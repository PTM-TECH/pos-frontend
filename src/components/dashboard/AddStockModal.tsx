'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { Product, Vendor } from '@/types'
import { addStock } from '@/lib/inventory'
import { getVendors } from '@/lib/vendors'
import { getErrorMessage } from '@/lib/utils'
import { selectOnFocus } from '@/lib/formHelpers'
import toast from 'react-hot-toast'

export default function AddStockModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product
  onClose: () => void
  onSaved: () => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [costPrice, setCostPrice] = useState(0)
  const [title, setTitle] = useState('')
  const [vendorId, setVendorId] = useState<number | ''>('')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getVendors().then(setVendors).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a purchase title')
      return
    }
    setLoading(true)
    try {
      await addStock(product.id, {
        quantity,
        cost_price: costPrice,
        title,
        vendor_id: vendorId === '' ? null : vendorId,
      })
      toast.success('Stock added successfully')
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={`Add Stock: ${product.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-gray-500">
          Current stock: <span className="font-medium text-gray-900">{product.quantity} {product.unit ?? 'units'}</span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity <span className="text-red-500">*</span></label>
            <input
              type="number" required min={1} value={quantity}
              onFocus={selectOnFocus}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cost Price (Buy) <span className="text-red-500">*</span></label>
            <input
              type="number" required min={0} value={costPrice}
              onFocus={selectOnFocus}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Purchase Title <span className="text-red-500">*</span></label>
          <input
            type="text" required value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Restock, September"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Vendor <span className="text-gray-400">(optional)</span></label>
          <select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">None</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Add Stock'}
        </button>
      </form>
    </Modal>
  )
}