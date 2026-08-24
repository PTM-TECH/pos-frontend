'use client'

import { Package } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'

const DISPLAY_LIMIT = 10

export default function POSProductGrid({
  products,
  loading,
  onAddToCart,
}: {
  products: Product[]
  loading: boolean
  onAddToCart: (product: Product) => void
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
        <Package className="w-10 h-10 text-gray-200 mb-3" />
        <p className="text-sm text-gray-400">No products found</p>
      </div>
    )
  }

  const visibleProducts = products.slice(0, DISPLAY_LIMIT)
  const remaining = products.length - visibleProducts.length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500">
          Showing {visibleProducts.length} of {products.length} products
        </p>
        {remaining > 0 && (
          <p className="text-xs text-gray-400">
            Use search above to find the rest
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
        {visibleProducts.map((product) => {
          const outOfStock = product.quantity <= 0
          return (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
              <div className="w-full aspect-square rounded-lg bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-gray-300" />
                )}
              </div>

              <p className="text-sm font-medium text-gray-900 truncate mb-0.5">{product.name}</p>
              <p className="text-xs text-gray-500 mb-2">
                {product.code ?? '—'} · {product.quantity} {product.unit ?? 'units'}
              </p>

              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(product.unit_price)}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(product.status)}`}>
                  {getStatusLabel(product.status)}
                </span>
              </div>

              <button
                onClick={() => onAddToCart(product)}
                disabled={outOfStock}
                className="mt-3 w-full bg-emerald-600 text-white py-2 rounded-lg text-xs font-medium
                           hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {outOfStock ? 'Out of stock' : 'Add to Cart'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}