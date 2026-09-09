'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createPurchaseReturn } from '@/lib/purchaseReturns'
import { getErrorMessage } from '@/lib/utils'
import { selectOnFocus } from '@/lib/formHelpers'
import { PurchaseItem } from '@/types'

const REASONS = [
  { value: 'defective', label: 'Defective' },
  { value: 'damaged_in_transit', label: 'Damaged in Transit' },
  { value: 'wrong_item', label: 'Wrong Item' },
  { value: 'other', label: 'Other' },
]

export default function VendorReturnModal({
  item,
  onClose,
  onSaved,
}: {
  item: PurchaseItem
  onClose: () => void
  onSaved: () => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState('defective')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createPurchaseReturn({
        purchase_item_id: item.id,
        quantity,
        reason,
        notes: notes || undefined,
      })
      toast.success('Return to vendor processed')
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Return to Vendor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Returning <span className="font-medium text-gray-900">{item.product_name}</span>
            {' '}(purchased {item.quantity} {item.unit ?? 'units'})
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              max={item.quantity}
              value={quantity}
              onFocus={selectOnFocus}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reason <span className="text-red-500">*</span>
            </label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium
                       hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Confirm Return'}
          </button>
        </form>
      </div>
    </div>
  )
}