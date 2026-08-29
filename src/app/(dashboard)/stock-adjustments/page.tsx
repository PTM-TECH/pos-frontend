'use client'

import { useEffect, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import DataTable, { Column } from '@/components/ui/DataTable'
import { getStockAdjustments } from '@/lib/stockAdjustments'
import { StockAdjustment } from '@/types'
import { formatDate } from '@/lib/utils'
import { useEffectiveStoreId } from '@/lib/useEffectiveStoreId'
import toast from 'react-hot-toast'

const REASON_LABELS: Record<string, string> = {
  damage: 'Damaged',
  theft: 'Theft / Loss',
  expired: 'Expired',
  miscount: 'Count Correction',
  other: 'Other',
}

export default function StockAdjustmentsPage() {
  const storeId = useEffectiveStoreId()
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getStockAdjustments(storeId)
      .then(setAdjustments)
      .catch(() => toast.error('Failed to load stock adjustments'))
      .finally(() => setLoading(false))
  }, [storeId])

  const columns: Column<StockAdjustment>[] = [
    { header: 'Product', render: (a) => a.product_name ?? '—' },
    {
      header: 'Type',
      render: (a) => (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize
          ${a.adjustment_type === 'increase'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
          }`}>
          {a.adjustment_type}
        </span>
      ),
    },
    { header: 'Quantity', render: (a) => a.quantity },
    { header: 'Before', render: (a) => a.quantity_before },
    { header: 'After', render: (a) => a.quantity_after },
    { header: 'Reason', render: (a) => REASON_LABELS[a.reason] ?? a.reason },
    { header: 'Notes', render: (a) => a.notes ?? '—' },
    { header: 'By', render: (a) => a.member ?? '—' },
    { header: 'Date', render: (a) => formatDate(a.created_at) },
  ]

  return (
    <>
      <Topbar title="Stock Adjustments" />
      <div className="p-6 space-y-5">
        <p className="text-sm text-gray-500">
          A record of every manual stock correction, damage, theft, or count adjustment
        </p>
        <DataTable
          columns={columns}
          data={adjustments}
          loading={loading}
          emptyMessage="No stock adjustments recorded yet"
        />
      </div>
    </>
  )
}