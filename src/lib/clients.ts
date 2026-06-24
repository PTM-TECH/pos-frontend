
import api from '@/lib/api'
import { ApiResponse, Client } from '@/types'

export async function searchClients(query: string) {
  const response = await api.get<ApiResponse<Client[]>>('/clients/search', {
    params: { q: query },
  })
  return response.data.data
}

export async function getClients() {
  const response = await api.get<ApiResponse<Client[]>>('/clients/')
  return response.data.data
}

export async function createClient(payload: {
  name: string
  email?: string
  phone?: string
  gender?: string
}) {
  const response = await api.post<ApiResponse<Client>>('/clients/', payload)
  return response.data.data
}