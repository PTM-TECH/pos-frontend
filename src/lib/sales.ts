
import api from '@/lib/api'
import { ApiResponse, Sale } from '@/types'

export interface CreateSalePayload {
  store_id: number
  client_id?: number | null
  paid: number
  discount: number
  payment_method: 'cash' | 'mpesa' | 'credit'
  items: {
    product_id: number
    quantity: number
    unit_price: number
  }[]
}

export async function createSale(payload: CreateSalePayload) {
  const response = await api.post<ApiResponse<Sale>>('/sales/', payload)
  return response.data.data
}

export async function getSales(storeId?: number) {
  const response = await api.get<ApiResponse<Sale[]>>('/sales/', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export async function getSaleReceipt(saleId: number) {
  const response = await api.get<ApiResponse<Sale>>(`/sales/${saleId}/receipt`)
  return response.data.data
}