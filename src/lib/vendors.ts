
import api from '@/lib/api'
import { ApiResponse, Vendor } from '@/types'

export async function searchVendors(query: string) {
  const response = await api.get<ApiResponse<Vendor[]>>('/vendors/search', {
    params: { q: query },
  })
  return response.data.data
}

export async function getVendors() {
  const response = await api.get<ApiResponse<Vendor[]>>('/vendors/')
  return response.data.data
}

export interface VendorPayload {
  name: string
  contact?: string
  phone?: string
  location?: string
}

export async function createVendor(payload: VendorPayload) {
  const response = await api.post<ApiResponse<Vendor>>('/vendors/', payload)
  return response.data.data
}

export async function updateVendor(id: number, payload: Partial<VendorPayload>) {
  const response = await api.patch<ApiResponse<Vendor>>(
    `/vendors/${id}`,
    payload
  )
  return response.data.data
}

export async function deleteVendor(id: number) {
  await api.delete(`/vendors/${id}`)
}