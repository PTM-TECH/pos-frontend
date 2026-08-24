import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface ExpenseCategory {
  id: number
  name: string
  created_at: string
}

export interface Expense {
  id: number
  store_id: number | null
  store: string | null
  category_id: number | null
  category: string | null
  member: string | null
  title: string
  description: string | null
  amount: number
  date: string
  created_at: string
}

export interface ExpenseSummary {
  total: number
  count: number
  by_category: { category: string; total: number }[]
}

export interface ExpensePayload {
  store_id?: number | null
  category_id?: number | null
  title: string
  description?: string
  amount: number
  date?: string
}

export async function getExpenseCategories() {
  const response = await api.get<ApiResponse<ExpenseCategory[]>>('/expenses/categories')
  return response.data.data
}

export async function createExpenseCategory(name: string) {
  const response = await api.post<ApiResponse<ExpenseCategory>>('/expenses/categories', { name })
  return response.data.data
}

export async function deleteExpenseCategory(id: number) {
  await api.delete(`/expenses/categories/${id}`)
}

export async function getExpenses(storeId?: number) {
  const response = await api.get<ApiResponse<Expense[]>>('/expenses/', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export async function getExpenseSummary(storeId?: number) {
  const response = await api.get<ApiResponse<ExpenseSummary>>('/expenses/summary', {
    params: storeId ? { store_id: storeId } : {},
  })
  return response.data.data
}

export async function getMonthlyExpenses(year: number, storeId?: number) {
  const response = await api.get<ApiResponse<{ month: number; total: number }[]>>(
    '/expenses/monthly',
    { params: { year, ...(storeId ? { store_id: storeId } : {}) } }
  )
  return response.data.data
}

export async function createExpense(payload: ExpensePayload) {
  const response = await api.post<ApiResponse<Expense>>('/expenses/', payload)
  return response.data.data
}

export async function updateExpense(id: number, payload: Partial<ExpensePayload>) {
  const response = await api.patch<ApiResponse<Expense>>(`/expenses/${id}`, payload)
  return response.data.data
}

export async function deleteExpense(id: number) {
  await api.delete(`/expenses/${id}`)
}