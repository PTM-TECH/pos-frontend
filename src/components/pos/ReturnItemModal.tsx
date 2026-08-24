'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { createReturn } from '@/lib/returns'
import { getErrorMessage } from '@/lib/utils'
import { SaleItem } from '@/types'
import toast from 'react-hot-toast'

export default function ReturnItemModal({
  item,
  onClose,
  onSaved,
}: {
  item: SaleItem
  onClose: () => void
  onSaved: () => void
}) {
  const maxReturnable = item.quantity - (item.returned_quantity ?? 0)
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (quantity < 1 || quantity > maxReturnable) {
      toast.error(`Enter a quantity between 1 and ${maxReturnable}`)
      return
    }

    setLoading(true)
    try {
      await createReturn({
        sale_item_id: item.id,
        quantity,
        reason: reason || undefined,
      })
      toast.success('Return processed — stock restored')
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={`Return: ${item.product_name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-gray-500">
          {maxReturnable} of {item.quantity} unit(s) available to return
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Quantity to return
          </label>
          <input
            type="number"
            required
            min={1}
            max={maxReturnable}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Reason <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="e.g. Damaged, wrong item, customer changed mind"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || maxReturnable <= 0}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Process Return'}
        </button>
      </form>
    </Modal>
  )
}