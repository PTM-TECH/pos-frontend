import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface Plan {
  id: number
  name: string
  price: number
  billing_cycle: string
  max_stores: number
  max_members: number
  features: string[] | null
  created_at: string
}

export interface PlanPayload {
  name: string
  price: number
  billing_cycle: string
  max_stores: number
  max_members: number
  features?: string[]
}

export async function getPlans() {
  const response = await api.get<ApiResponse<Plan[]>>('/plans/')
  return response.data.data
}

export async function createPlan(payload: PlanPayload) {
  const response = await api.post<ApiResponse<Plan>>('/plans/', payload)
  return response.data.data
}

export async function updatePlan(id: number, payload: Partial<PlanPayload>) {
  const response = await api.patch<ApiResponse<Plan>>(`/plans/${id}`, payload)
  return response.data.data
}

export async function deletePlan(id: number) {
  await api.delete(`/plans/${id}`)
}