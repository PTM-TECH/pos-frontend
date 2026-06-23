
import api from './api'
import { Member, ApiResponse } from '@/types'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponseData {
  token: string
  member: Member
}

export async function loginRequest(payload: LoginPayload) {
  const response = await api.post<ApiResponse<LoginResponseData>>(
    '/auth/login',
    payload
  )
  return response.data.data
}

export async function getCurrentMember() {
  const response = await api.get<ApiResponse<Member>>('/auth/me')
  return response.data.data
}