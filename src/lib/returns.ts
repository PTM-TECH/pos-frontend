import api from '@/lib/api'
import { ApiResponse, SaleReturn } from '@/types'

export async function getReturns(storeId?: number) {
  const response = await api.get<ApiResponse<SaleReturn[]>>('/returns/', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export interface ReturnsSummary {
  total_returns: number
  total_refund_amount: number
  total_units_returned: number
}

export async function getReturnsSummary(storeId?: number) {
  const response = await api.get<ApiResponse<ReturnsSummary>>('/returns/summary', {
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