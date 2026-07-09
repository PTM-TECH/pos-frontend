
import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface TenantRegisterPayload {
  business_name:  string
  email:          string
  phone?:         string
  password:       string
  plan_name:      string
  store_name:     string
  store_location?: string
  admin_name:     string
}

export interface TenantRegisterResponse {
  tenant: {
    id:         number
    name:       string
    email:      string
    status:     string
    created_at: string
  }
  member: {
    id:    number
    name:  string
    email: string
    role:  string
  }
  store: {
    id:       number
    name:     string
    location: string | null
  }
}

export async function registerTenant(payload: TenantRegisterPayload) {
  const response = await api.post<ApiResponse<TenantRegisterResponse>>(
    '/tenants/register',
    payload
  )
  return response.data.data
}

export async function submitPayment(payload: {
  tenant_id:  number
  mpesa_code: string
  amount:     number
  plan_id:    number
}) {
  const response = await api.post('/payments/submit', payload)
  return response.data
}

export async function getPlans() {
  const response = await api.get('/plans/')
  return response.data.data
}