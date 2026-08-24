'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Product } from '@/types'
import { createStockAdjustment } from '@/lib/stockAdjustments'
import { getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

const REASONS = [
  { value: 'damage',   label: 'Damaged' },
  { value: 'theft',    label: 'Theft / Loss' },
  { value: 'expired',  label: 'Expired' },
  { value: 'miscount', label: 'Count correction' },
  { value: 'other',    label: 'Other' },
]

export default function StockAdjustmentModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product
  onClose: () => void
  onSaved: () => void
}) {
  const [type, setType] = useState<'increase' | 'decrease'>('decrease')
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState('miscount')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const projectedQuantity =
    type === 'increase' ? product.quantity + quantity : product.quantity - quantity

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (quantity <= 0) {
      toast.error('Quantity must be greater than zero')
      return
    }
    if (type === 'decrease' && quantity > product.quantity) {
      toast.error(`Cannot decrease by more than the current stock (${product.quantity})`)
      return
    }

    setLoading(true)
    try {
      await createStockAdjustment({
        product_id: product.id,
        adjustment_type: type,
        quantity,
        reason,
        notes: notes || undefined,
      })
      toast.success('Stock adjustment recorded')
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={`Adjust Stock: ${product.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-gray-500">
          Current stock: <span className="font-medium text-gray-900">{product.quantity} {product.unit ?? 'units'}</span>
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Adjustment Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('decrease')}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors
                ${type === 'decrease'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              Decrease
            </button>
            <button
              type="button"
              onClick={() => setType('increase')}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors
                ${type === 'increase'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              Increase
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
            <input
              type="number"
              required
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notes <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Additional details..."
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className={`rounded-lg p-3 text-sm ${projectedQuantity < 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}`}>
          New stock level: <span className="font-semibold">{Math.max(projectedQuantity, 0)} {product.unit ?? 'units'}</span>
        </div>

        <button
          type="submit"
          disabled={loading || projectedQuantity < 0}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Record Adjustment'}
        </button>
      </form>
    </Modal>
  )
}