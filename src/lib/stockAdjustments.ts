import api from '@/lib/api'
import { ApiResponse, StockAdjustment } from '@/types'

export async function getStockAdjustments(storeId?: number) {
  const response = await api.get<ApiResponse<StockAdjustment[]>>('/stock-adjustments/', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export interface StockAdjustmentPayload {
  product_id: number
  adjustment_type: 'increase' | 'decrease'
  quantity: number
  reason: string
  notes?: string
}

export async function createStockAdjustment(payload: StockAdjustmentPayload) {
  const response = await api.post<ApiResponse<StockAdjustment>>('/stock-adjustments/', payload)
  return response.data.data
}