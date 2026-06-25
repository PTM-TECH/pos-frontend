// src/lib/members.ts
import api from '@/lib/api'
import { ApiResponse, Member, Role } from '@/types'

export async function getMembers() {
  const response = await api.get<ApiResponse<Member[]>>('/members/')
  return response.data.data
}

export async function getRoles() {
  const response = await api.get<ApiResponse<Role[]>>('/members/roles')
  return response.data.data
}

export interface CreateMemberPayload {
  name: string
  email: string
  password: string
  phone?: string
  role_id: number
  store_id?: number | null
}

export async function createMember(payload: CreateMemberPayload) {
  const response = await api.post<ApiResponse<Member>>('/members/', payload)
  return response.data.data
}

export async function updateMember(
  id: number,
  payload: {
    name?: string
    phone?: string
    role_id?: number
    store_id?: number | null
    state?: string
  }
) {
  const response = await api.patch<ApiResponse<Member>>(
    `/members/${id}`,
    payload
  )
  return response.data.data
}

export async function deleteMember(id: number) {
  await api.delete(`/members/${id}`)
}