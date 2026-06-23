
import api from './api'
import { ApiResponse, Notification } from '@/types'

export async function getUnreadCount() {
  const response = await api.get<ApiResponse<{ count: number }>>(
    '/sales/notifications/unread-count'
  )
  return response.data.data.count
}

export async function getNotifications() {
  const response = await api.get<ApiResponse<Notification[]>>(
    '/sales/notifications'
  )
  return response.data.data
}

export async function markAllAsRead() {
  await api.patch('/sales/notifications/read-all')
}

export async function markAsRead(id: number) {
  await api.patch(`/sales/notifications/${id}/read`)
}