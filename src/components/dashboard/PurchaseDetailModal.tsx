'use client'

import { X } from 'lucide-react'
import { Purchase } from '@/types'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'

export default function PurchaseDetailModal({
  purchase,
  onClose,
}: {
  purchase: Purchase
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{purchase.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Vendor</p>
              <p className="text-gray-900 font-medium">{purchase.vendor ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Store</p>
              <p className="text-gray-900 font-medium">{purchase.store ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Date</p>
              <p className="text-gray-900 font-medium">{formatDate(purchase.date)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Status</p>
              <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(purchase.status)}`}>
                {getStatusLabel(purchase.status)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</h3>
            <div className="space-y-2">
              {purchase.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-gray-900 font-medium">{item.product_name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} {item.unit ?? 'units'} × {formatCurrency(item.cost_price)}
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold text-gray-900">{formatCurrency(purchase.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Paid</span>
              <span className="text-gray-900">{formatCurrency(purchase.paid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Balance</span>
              <span className="text-gray-900">{formatCurrency(purchase.balance)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}