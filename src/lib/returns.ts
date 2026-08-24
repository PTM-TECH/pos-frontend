import api from '@/lib/api'
import { ApiResponse, SaleReturn } from '@/types'

export async function getReturns(storeId?: number) {
  const response = await api.get<ApiResponse<SaleReturn[]>>('/returns/', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export async function createReturn(payload: {
  sale_item_id: number
  quantity: number
  reason?: string
}) {
  const response = await api.post<ApiResponse<SaleReturn>>('/returns/', payload)
  return response.data.data
}