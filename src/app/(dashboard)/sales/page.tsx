
'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import PageHeader from '@/components/ui/PageHeader'
import DataTable, { Column } from '@/components/ui/DataTable'
import ReceiptModal from '@/components/pos/ReceiptModal'
import { getSales } from '@/lib/sales'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Sale } from '@/types'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function SalesPage() {
  const member = useAuthStore((state) => state.member)
  const [sales, setSales] = useState<Sale[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState<Sale | null>(null)

  async function loadData() {
    setLoading(true)
    try {
      setSales(await getSales(member?.store_id ?? undefined))
    } catch {
      toast.error('Failed to load sales')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = sales.filter((s) =>
    (s.client ?? 'walk-in').toLowerCase().includes(query.toLowerCase()) ||
    String(s.id).includes(query)
  )

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
        <PageHeader
          query={query}
          onQueryChange={setQuery}
          placeholder="Search by client or sale number..."
          buttonLabel=""
          onButtonClick={() => {}}
          showButton={false}
        />
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No sales found" />
      </div>

      {viewing && (
        <ReceiptModal sale={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  )
}