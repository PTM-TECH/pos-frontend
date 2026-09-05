import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface PlatformNotification {
  id: number
  event_type: string
  tenant_id: number | null
  tenant_name: string | null
  message: string
  is_read: boolean
  created_at: string
}

export async function getPlatformNotifications() {
  const response = await api.get<ApiResponse<PlatformNotification[]>>('/platform-notifications/')
  return response.data.data
}

export async function getUnreadCount() {
  const response = await api.get<ApiResponse<{ count: number }>>('/platform-notifications/unread-count')
  return response.data.data.count
}

export async function markAllAsRead() {
  await api.patch('/platform-notifications/read-all')
}

export async function markAsRead(id: number) {
  await api.patch(`/platform-notifications/${id}/read`)
}