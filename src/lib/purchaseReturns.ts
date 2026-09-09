import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface PurchaseReturn {
  id: number
  purchase_id: number
  purchase_title: string | null
  vendor: string | null
  product_name: string | null
  quantity: number
  refund_amount: number
  refunded_amount: number
  refund_balance: number
  reason: string
  notes: string | null
  processed_by: string | null
  created_at: string
}

export interface PurchaseReturnsSummary {
  total_returns: number
  total_units_returned: number
  total_refund_amount: number
}

export async function getPurchaseReturns(storeId?: number) {
  const response = await api.get<ApiResponse<PurchaseReturn[]>>('/purchase-returns/', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export async function getPurchaseReturnsSummary(storeId?: number) {
  const response = await api.get<ApiResponse<PurchaseReturnsSummary>>('/purchase-returns/summary', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export async function createPurchaseReturn(payload: {
  purchase_item_id: number
  quantity: number
  reason: string
  notes?: string
}) {
  const response = await api.post<ApiResponse<PurchaseReturn>>('/purchase-returns/', payload)
  return response.data.data
}

export async function recordVendorRefund(returnId: number, amount: number) {
  const response = await api.patch(`/purchase-returns/${returnId}/record-refund`, null, {
    params: { amount },
  })
  return response.data.data
}