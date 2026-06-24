
'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { Category, Product } from '@/types'
import { createProduct, updateProduct } from '@/lib/inventory'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/utils'

export default function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product?: Product | null
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}) {
  const member = useAuthStore((state) => state.member)
  const isEdit = !!product

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [code, setCode] = useState(product?.code ?? '')
  const [unitPrice, setUnitPrice] = useState(product?.unit_price ?? 0)
  const [unit, setUnit] = useState(product?.unit ?? 'Pieces')
  const [quantity, setQuantity] = useState(product?.quantity ?? 0)
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product?.category) {
      const match = categories.find((c) => c.name === product.category)
      if (match) setCategoryId(match.id)
    }
  }, [product, categories])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || unitPrice <= 0) {
      toast.error('Please fill in product name and a valid price')
      return
    }

    setLoading(true)
    try {
      if (isEdit && product) {
        await updateProduct(product.id, {
        category_id: categoryId === '' ? null : categoryId,
        name,
        description,
        code,
        unit_price: unitPrice,
        unit,
        quantity,
      })
      toast.success('Product updated successfully')
      } else {
        await createProduct({
        store_id: member?.store_id ?? 1,
        category_id: categoryId === '' ? null : categoryId,
        name,
        description,
        code,
        unit_price: unitPrice,
        unit,
        quantity,
        })
        toast.success('Product added successfully')
      }
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Product' : 'Add Product'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Product Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Water Tap"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            rows={2}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. HW026"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Unit Price
            </label>
            <input
              type="number"
              required
              min={0}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Unit
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Pieces, Kg..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quantity
            </label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60 mt-2"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </Modal>
  )
}