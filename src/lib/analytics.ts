
import api from './api'
import { ApiResponse, DashboardStats } from '@/types'

export interface YearlyStat {
  month: number
  total: number
  paid: number
  discount: number
  balance: number
}

export interface MonthlyStat {
  day: number
  total: number
  paid: number
  discount: number
  balance: number
  profit: number
}

export interface TopProduct {
  id: number
  name: string
  code: string | null
  unit_price: number
  total_sold: number
  total_revenue: number
}

export async function getDashboardStats(storeId?: number) {
  const response = await api.get<ApiResponse<DashboardStats>>(
    '/analytics/dashboard',
    { params: storeId ? { store_id: storeId } : {} }
  )
  return response.data.data
}

export async function getYearlyStats(year: number, storeId?: number) {
  const response = await api.get<ApiResponse<YearlyStat[]>>(
    '/analytics/yearly',
    { params: { year, ...(storeId ? { store_id: storeId } : {}) } }
  )
  return response.data.data
}

export async function getMonthlyStats(
  year: number,
  month: number,
  storeId?: number
) {
  const response = await api.get<ApiResponse<MonthlyStat[]>>(
    '/analytics/monthly',
    { params: { year, month, ...(storeId ? { store_id: storeId } : {}) } }
  )
  return response.data.data
}

export async function getTopProducts(storeId?: number, limit = 5) {
  const response = await api.get<ApiResponse<TopProduct[]>>(
    '/analytics/top-products',
    { params: { limit, ...(storeId ? { store_id: storeId } : {}) } }
  )
  return response.data.data
}