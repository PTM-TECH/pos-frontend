
import api from '@/lib/api'
import { ApiResponse, Product, Category } from '@/types'

export async function searchProducts(query: string, storeId?: number) {
  const response = await api.get<ApiResponse<Product[]>>(
    '/inventory/products/search',
    { params: { q: query, ...(storeId ? { store_id: storeId } : {}) } }
  )
  return response.data.data
}

export async function getProducts(storeId?: number) {
  const response = await api.get<ApiResponse<Product[]>>(
    '/inventory/products',
    { params: storeId ? { store_id: storeId } : {} }
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
}

export async function createProduct(payload: CreateProductPayload) {
  const response = await api.post<ApiResponse<Product>>(
    '/inventory/products',
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