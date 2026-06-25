
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
export interface ClientPayload {
  name: string
  email?: string
  phone?: string
  gender?: string
}

export async function createClient(payload: ClientPayload) {
  const response = await api.post<ApiResponse<Client>>('/clients/', payload)
  return response.data.data
}

export async function updateClient(id: number, payload: Partial<ClientPayload>) {
  const response = await api.patch<ApiResponse<Client>>(
    `/clients/${id}`,
    payload
  )
  return response.data.data
}

export async function deleteClient(id: number) {
  await api.delete(`/clients/${id}`)
}