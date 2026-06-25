
import api from '@/lib/api'
import { ApiResponse, Store } from '@/types'

export async function getStores() {
  const response = await api.get<ApiResponse<Store[]>>('/stores/')
  return response.data.data
}

export interface StorePayload {
  name: string
  location?: string
  description?: string
}

export async function createStore(payload: StorePayload) {
  const response = await api.post<ApiResponse<Store>>('/stores/', payload)
  return response.data.data
}

export async function updateStore(id: number, payload: Partial<StorePayload>) {
  const response = await api.patch<ApiResponse<Store>>(
    `/stores/${id}`,
    payload
  )
  return response.data.data
}

export async function deleteStore(id: number) {
  await api.delete(`/stores/${id}`)
}