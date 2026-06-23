
import { TopProduct } from '@/lib/analytics'
import { formatCurrency } from '@/lib/utils'
import { Package } from 'lucide-react'

export default function TopProducts({ products }: { products: TopProduct[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Top Selling Products
      </h3>

      {products.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No sales data yet
        </p>
      ) : (
        <div className="space-y-3">
          {products.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0">
                {i + 1}
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {p.name}
                </p>
                <p className="text-xs text-gray-500">
                  {p.total_sold} units sold
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900 shrink-0">
                {formatCurrency(p.total_revenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}