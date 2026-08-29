
import api from './api'
import { Member, ApiResponse } from '@/types'

interface LoginPayload {
  email: string
  password: string
  challenge_token: string
  challenge_answer: string
  turnstile_token: string
}

interface LoginResponseData {
  token: string
  member: Member
}

export async function loginRequest(payload: LoginPayload) {
  const response = await api.post<ApiResponse<{ pending_token: string; email_hint: string }>>(
    '/auth/login',
    payload
  )
  return response.data.data
}

export async function verify2FA(pendingToken: string, code: string) {
  const response = await api.post<ApiResponse<LoginResponseData>>('/auth/verify-2fa', {
    pending_token: pendingToken,
    code,
  })
  return response.data.data
}

export async function resend2FA(pendingToken: string) {
  const response = await api.post('/auth/resend-2fa', { pending_token: pendingToken })
  return response.data
}

export async function changePassword(payload: {
  current_password: string
  new_password: string
}) {
  const response = await api.post<ApiResponse<null>>('/auth/change-password', payload)
  return response.data
}

export async function forgotPassword(payload: {
  email: string
  challenge_token: string
  challenge_answer: string
}) {
  const response = await api.post('/auth/forgot-password', payload)
  return response.data
}
export async function getChallenge() {
  const response = await api.get<ApiResponse<{ token: string; code: string }>>('/auth/challenge')
  return response.data.data
}

export async function resetPassword(payload: {
  token: string
  new_password: string
  challenge_token: string
  challenge_answer: string
}) {
  const response = await api.post('/auth/reset-password', payload)
  return response.data
}

export async function getCurrentMember() {
  const response = await api.get<ApiResponse<Member>>('/auth/me')
  return response.data.data
}