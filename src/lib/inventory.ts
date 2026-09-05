
import api from '@/lib/api'
import { ApiResponse, Product, Category } from '@/types'

export async function searchProducts(query: string, storeId?: number) {
  const response = await api.get<ApiResponse<Product[]>>(
    '/inventory/products/search',
    { params: { q: query, ...(storeId ? { store_id: storeId } : {}) } }
  )
  return response.data.data
}

export async function getProducts(storeId?: number, includeInactive = false) {
  const response = await api.get<ApiResponse<Product[]>>(
    '/inventory/products',
    { params: { ...(storeId ? { store_id: storeId } : {}), include_inactive: includeInactive } }
  )
  return response.data.data
}

export async function getProductByCode(code: string, storeId?: number) {
  const response = await api.get<ApiResponse<Product>>(
    `/inventory/products/barcode/${encodeURIComponent(code)}`,
    { params: storeId ? { store_id: storeId } : {} }
  )
  return response.data.data
}

export async function setProductActiveStatus(id: number, isActive: boolean) {
  const response = await api.patch<ApiResponse<Product>>(
    `/inventory/products/${id}/status`,
    null,
    { params: { is_active: isActive } }
  )
  return response.data.data
}

export async function getLowStockProducts(storeId?: number) {
  const response = await api.get<ApiResponse<Product[]>>(
    '/inventory/products/low-stock',
    { params: storeId ? { store_id: storeId } : {} }
  )
  return response.data.data
}
export interface CreateProductPayload {
  store_id: number
  category_id?: number | null
  name: string
  description?: string
  code?: string
  unit_price: number
  unit?: string
  quantity?: number
  image?: string
  initial_quantity?: number
  cost_price?: number
  purchase_title?: string
  vendor_id?: number | null
}

export async function createProduct(payload: CreateProductPayload) {
  const response = await api.post<ApiResponse<Product>>(
    '/inventory/products',
    payload
  )
  return response.data.data
}

export async function uploadProductImage(productId: number, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post<ApiResponse<Product>>(
    `/inventory/products/${productId}/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data.data
}

export async function addStock(productId: number, payload: {
  quantity: number
  cost_price: number
  title: string
  vendor_id?: number | null
}) {
  const response = await api.post<ApiResponse<Product>>(
    `/inventory/products/${productId}/add-stock`,
    payload
  )
  return response.data.data
}

export async function updateProduct(
  id: number,
  payload: Partial<CreateProductPayload>
) {
  const response = await api.patch<ApiResponse<Product>>(
    `/inventory/products/${id}`,
    payload
  )
  return response.data.data
}

export async function deleteProduct(id: number) {
  await api.delete(`/inventory/products/${id}`)
}

export async function getCategories() {
  const response = await api.get<ApiResponse<Category[]>>(
    '/inventory/categories'
  )
  return response.data.data
}

export async function createCategory(payload: { name: string; type: string }) {
  const response = await api.post<ApiResponse<Category>>(
    '/inventory/categories',
    payload
  )
  return response.data.data
}

export async function deleteCategory(id: number) {
  await api.delete(`/inventory/categories/${id}`)
}