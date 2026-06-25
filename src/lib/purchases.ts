
import api from '@/lib/api'
import { ApiResponse, Purchase } from '@/types'

export interface PurchaseSummary {
  total: number
  pending: number
  received: number
  partially_received: number
  cancelled: number
}

export async function getPurchases(storeId?: number) {
  const response = await api.get<ApiResponse<Purchase[]>>('/purchases/', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export async function getPurchaseSummary(storeId?: number) {
  const response = await api.get<ApiResponse<PurchaseSummary>>(
    '/purchases/summary',
    { params: storeId ? { store_id: storeId } : {} }
  )
  return response.data.data
}

export interface CreatePurchasePayload {
  store_id: number
  vendor_id?: number | null
  title: string
  paid: number
  date?: string
  items: {
    product_id: number
    quantity: number
    cost_price: number
  }[]
}

export async function createPurchase(payload: CreatePurchasePayload) {
  const response = await api.post<ApiResponse<Purchase>>(
    '/purchases/',
    payload
  )
  return response.data.data
}

export async function receivePurchase(id: number) {
  const response = await api.patch<ApiResponse<Purchase>>(
    `/purchases/${id}/receive`
  )
  return response.data.data
}

export async function cancelPurchase(id: number) {
  const response = await api.patch<ApiResponse<Purchase>>(
    `/purchases/${id}/cancel`
  )
  return response.data.data
}

export async function deletePurchase(id: number) {
  await api.delete(`/purchases/${id}`)
}