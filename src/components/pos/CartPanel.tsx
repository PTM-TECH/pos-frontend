
'use client'

import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'

export default function CartPanel() {
  const items = useCartStore((state) => state.items)
  const discount = useCartStore((state) => state.discount)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const setDiscount = useCartStore((state) => state.setDiscount)
  const getSubtotal = useCartStore((state) => state.getSubtotal)

  const subtotal = getSubtotal()

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <ShoppingCart className="w-4.5 h-4.5 text-gray-700" />
        <h3 className="text-sm font-semibold text-gray-900">
          Cart ({items.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingCart className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Cart is empty</p>
            <p className="text-xs text-gray-400 mt-1">
              Search and add products to begin
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(item.unit_price)} / {item.unit ?? 'unit'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => decrementItem(item.product_id)}
                  className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center
                             hover:bg-gray-50 text-gray-600"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-medium w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => incrementItem(item.product_id)}
                  disabled={item.quantity >= item.available_stock}
                  className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center
                             hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <p className="text-sm font-semibold text-gray-900 w-20 text-right shrink-0">
                {formatCurrency(item.quantity * item.unit_price)}
              </p>

              <button
                onClick={() => removeItem(item.product_id)}
                className="text-gray-300 hover:text-red-500 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-500">Discount (KES)</label>
            <input
              type="number"
              min={0}
              value={discount || ''}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              placeholder="0"
              className="w-24 text-right text-sm border border-gray-200 rounded-md px-2 py-1
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-emerald-600">
              {formatCurrency(Math.max(subtotal - discount, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}