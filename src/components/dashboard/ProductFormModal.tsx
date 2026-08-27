'use client'

import { useState, useEffect } from 'react'
import { ScanLine, Image as ImageIcon, Upload } from 'lucide-react'
import QRScannerModal from '../pos/QRScannerModal'
import Modal from '@/components/ui/Modal'
import { Category, Product } from '@/types'
import { createProduct, updateProduct, uploadProductImage } from '@/lib/inventory'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/utils'
import { useEffectiveStoreId } from '@/lib/useEffectiveStoreId'

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
  const storeId = useEffectiveStoreId()
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
  const [showScanner, setShowScanner] = useState(false)
  const [productImage, setProductImage] = useState(product?.image ?? null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (product?.category) {
      const match = categories.find((c) => c.name === product.category)
      if (match) setCategoryId(match.id)
    }
  }, [product, categories])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !product) return

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3MB')
      return
    }

    setUploadingImage(true)
    try {
      const updated = await uploadProductImage(product.id, file)
      setProductImage(updated.image)
      toast.success('Product image updated')
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploadingImage(false)
    }
  }

  function handlePendingImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3MB')
      return
    }

    setPendingImageFile(file)
    setPendingImagePreview(URL.createObjectURL(file))
  }

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
      })
      toast.success('Product updated successfully')
      } else {
        const newProduct = await createProduct({
        store_id: storeId ?? 1,
        category_id: categoryId === '' ? null : categoryId,
        name,
        description,
        code,
        unit_price: unitPrice,
        unit,
        quantity: 0,
        })

        if (pendingImageFile) {
          try {
            await uploadProductImage(newProduct.id, pendingImageFile)
          } catch {
            toast.error('Product saved, but the image failed to upload. You can add it later by editing the product.')
          }
        }

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
            Product Image
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {isEdit && productImage ? (
                <img src={productImage} alt="Product" className="w-full h-full object-cover" />
              ) : pendingImagePreview ? (
                <img src={pendingImagePreview} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <label className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3.5 py-2
                               rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              {uploadingImage ? 'Uploading...' : isEdit ? 'Change photo' : 'Select photo'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={isEdit ? handleImageUpload : handlePendingImageSelect}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
          {!isEdit && pendingImageFile && (
            <p className="text-xs text-gray-400 mt-1.5">
              Photo will upload once you save the product
            </p>
          )}
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
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. HW026"
                className="flex-1 min-w-0 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg
                           text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
                title="Scan barcode/QR to fill code"
              >
                <ScanLine className="w-4 h-4" />
              </button>
            </div>
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
              Unit Price (Sell)
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
              disabled
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">Add stock via Purchases</p>
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

      {showScanner && (
        <QRScannerModal
          onScan={(scannedCode) => {
            setCode(scannedCode)
            setShowScanner(false)
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </Modal>
  )
}