
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Package, X } from 'lucide-react'
import { searchProducts } from '@/lib/inventory'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@/types'
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductSearch({ storeId }: { storeId?: number }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const delay = setTimeout(async () => {
      try {
        const data = await searchProducts(query, storeId)
        setResults(data)
        setShowResults(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(delay)
  }, [query, storeId])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(product: Product) {
    if (product.quantity <= 0) {
      toast.error(`${product.name} is out of stock`)
      return
    }

    addItem({
      product_id: product.id,
      name: product.name,
      code: product.code,
      unit: product.unit,
      unit_price: product.unit_price,
      quantity: 1,
      available_stock: product.quantity,
    })
    toast.success(`${product.name} added to cart`)
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Search products by name or code..."
          className="w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-400">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-400">
              No products found
            </div>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                disabled={product.quantity <= 0}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50
                           border-b border-gray-50 last:border-0 transition-colors text-left
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.code ?? '—'} · {product.quantity} {product.unit ?? 'units'} available
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(product.unit_price)}
                  </p>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {getStatusLabel(product.status)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}