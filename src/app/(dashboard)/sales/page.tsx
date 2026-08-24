
'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import ExportButton from '@/components/shared/ExportButton'
import PageHeader from '@/components/ui/PageHeader'
import DataTable, { Column } from '@/components/ui/DataTable'
import ReceiptModal from '@/components/pos/ReceiptModal'
import { getSales } from '@/lib/sales'
import { exportSales } from '@/lib/reports'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Sale } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useEffectiveStoreId } from '@/lib/useEffectiveStoreId'
import toast from 'react-hot-toast'

const DATE_PRESETS = [
  { label: 'All time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Custom range', value: 'custom' },
]

export default function SalesPage() {
  const storeId = useEffectiveStoreId()
  const member = useAuthStore((state) => state.member)
  const [sales, setSales] = useState<Sale[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState<Sale | null>(null)
  const [datePreset, setDatePreset] = useState('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      setSales(await getSales(storeId))
    } catch {
      toast.error('Failed to load sales')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [storeId])

  function isWithinDateRange(dateString: string): boolean {
    if (datePreset === 'all') return true

    const saleDate = new Date(dateString)
    const now = new Date()

    if (datePreset === 'today') {
      return saleDate.toDateString() === now.toDateString()
    }
    if (datePreset === '7d') {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 7)
      return saleDate >= cutoff
    }
    if (datePreset === '30d') {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 30)
      return saleDate >= cutoff
    }
    if (datePreset === 'custom') {
      if (!customFrom && !customTo) return true
      const from = customFrom ? new Date(customFrom) : null
      const to = customTo ? new Date(customTo) : null
      if (to) to.setHours(23, 59, 59, 999)
      if (from && saleDate < from) return false
      if (to && saleDate > to) return false
      return true
    }
    return true
  }

    function getExportDateRange(): { date_from?: string; date_to?: string } {
    const now = new Date()
    if (datePreset === 'today') {
      const today = now.toISOString().slice(0, 10)
      return { date_from: today, date_to: today }
    }
    if (datePreset === '7d') {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 7)
      return { date_from: cutoff.toISOString().slice(0, 10) }
    }
    if (datePreset === '30d') {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 30)
      return { date_from: cutoff.toISOString().slice(0, 10) }
    }
    if (datePreset === 'custom') {
      return { date_from: customFrom || undefined, date_to: customTo || undefined }
    }
    return {}
  }

  async function handleExport(format: 'xlsx' | 'pdf') {
    await exportSales({
      format,
      store_id: storeId,
      ...getExportDateRange(),
    })
    toast.success('Export downloaded')
  }

  const filtered = sales.filter((s) => {
    const matchesQuery =
      (s.client ?? 'walk-in').toLowerCase().includes(query.toLowerCase()) ||
      String(s.id).includes(query) ||
      s.items.some((item) =>
        (item.product_name ?? '').toLowerCase().includes(query.toLowerCase())
      )
    return matchesQuery && isWithinDateRange(s.created_at)
  })

  const columns: Column<Sale>[] = [
    { header: 'Sale #', render: (s) => <span className="font-medium text-gray-900">#{s.id}</span> },
    { header: 'Store', render: (s) => s.store ?? '—' },
    { header: 'Client', render: (s) => s.client ?? 'Walk-In' },
    { header: 'Sold By', render: (s) => s.member ?? '—' },
    { header: 'Total', render: (s) => formatCurrency(s.total) },
    { header: 'Paid', render: (s) => formatCurrency(s.paid) },
    { header: 'Balance', render: (s) => formatCurrency(s.balance) },
    {
      header: 'Status',
      render: (s) => (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(s.status)}`}>
          {getStatusLabel(s.status)}
        </span>
      ),
    },
    { header: 'Date', render: (s) => formatDate(s.created_at) },
    {
      header: 'Action',
      render: (s) => (
        <button
          onClick={() => setViewing(s)}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                     text-gray-500 hover:bg-gray-50"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ]

  return (
    <>
      <Topbar title="Sales History" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <PageHeader
              query={query}
              onQueryChange={setQuery}
              placeholder="Search by client, sale number, or product..."
              buttonLabel=""
              onButtonClick={() => {}}
              showButton={false}
            />
          </div>
          <ExportButton onExport={handleExport} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setDatePreset(preset.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors
                ${datePreset === preset.value
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {preset.label}
            </button>
          ))}

          {datePreset === 'custom' && (
            <div className="flex items-center gap-2 ml-1">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No sales found" />
      </div>

      {viewing && (
        <ReceiptModal sale={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  )
}