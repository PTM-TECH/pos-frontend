'use client'

import { useEffect, useState } from 'react'
import { RotateCcw, Package, Wallet } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import StatCard from '@/components/dashboard/StatCard'
import DataTable, { Column } from '@/components/ui/DataTable'
import { getReturns, getReturnsSummary, ReturnsSummary } from '@/lib/returns'
import { SaleReturn } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useEffectiveStoreId } from '@/lib/useEffectiveStoreId'
import toast from 'react-hot-toast'

const REASON_LABELS: Record<string, string> = {
  damaged: 'Damaged',
  wrong_item: 'Wrong Item',
  changed_mind: 'Changed Mind',
  defective: 'Defective',
  other: 'Other',
}

export default function ReturnsPage() {
  const storeId = useEffectiveStoreId()
  const [returns, setReturns] = useState<SaleReturn[]>([])
  const [summary, setSummary] = useState<ReturnsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    try {
      const [returnsData, summaryData] = await Promise.all([
        getReturns(storeId),
        getReturnsSummary(storeId),
      ])
      setReturns(returnsData)
      setSummary(summaryData)
    } catch {
      toast.error('Failed to load returns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [storeId])

  const columns: Column<SaleReturn>[] = [
    { header: 'Sale #', render: (r) => <span className="font-medium text-gray-900">#{r.sale_id}</span> },
    { header: 'Product', render: (r) => r.product_name ?? '—' },
    { header: 'Quantity', render: (r) => r.quantity },
    { header: 'Refund Amount', render: (r) => formatCurrency(r.refund_amount) },
    {
      header: 'Reason',
      render: (r) => (
        <span className="text-xs text-gray-600">
          {r.reason ? (REASON_LABELS[r.reason] ?? r.reason) : '—'}
        </span>
      ),
    },
    { header: 'Processed By', render: (r) => r.processed_by ?? '—' },
    { header: 'Date', render: (r) => formatDate(r.created_at) },
  ]

  return (
    <>
      <Topbar title="Returns" />
      <div className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          All products returned by customers, with stock automatically restored
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Returns"
            value={summary?.total_returns ?? '—'}
            icon={RotateCcw}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
          <StatCard
            label="Units Returned"
            value={summary?.total_units_returned ?? '—'}
            icon={Package}
            iconColor="#f59e0b"
            iconBg="#fffbeb"
          />
          <StatCard
            label="Total Refunded"
            value={summary ? formatCurrency(summary.total_refund_amount) : '—'}
            icon={Wallet}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
        </div>

        <DataTable
          columns={columns}
          data={returns}
          loading={loading}
          emptyMessage="No returns recorded yet"
        />
      </div>
    </>
  )
}