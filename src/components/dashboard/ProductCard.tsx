
import { Package, Pencil, Trash2 } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Package className="w-6 h-6 text-gray-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${getStatusColor(
              product.status
            )}`}
          >
            {getStatusLabel(product.status)}
          </span>
        </div>
        {product.description && (
          <p className="text-xs text-gray-500 truncate mb-1.5">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {product.code && <span>Code: {product.code}</span>}
          <span>{formatCurrency(product.unit_price)}</span>
          <span>
            {product.quantity} {product.unit ?? 'units'}
          </span>
          {product.category && <span>{product.category}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                     text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                     text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}