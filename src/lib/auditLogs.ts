import api from '@/lib/api'
import { ApiResponse, AuditLogEntry } from '@/types'

export async function getAuditLogs() {
  const response = await api.get<ApiResponse<AuditLogEntry[]>>('/audit-logs/')
  return response.data.data
}