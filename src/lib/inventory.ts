
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

export async function getCategories() {
  const response = await api.get<ApiResponse<Category[]>>(
    '/inventory/categories'
  )
  return response.data.data
}