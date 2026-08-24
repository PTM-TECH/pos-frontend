'use client'

import { useEffect, useState } from 'react'
import { History, Plus, Pencil, Trash2, LogIn } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import { getAuditLogs } from '@/lib/auditLogs'
import { AuditLogEntry } from '@/types'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const ACTION_ICONS: Record<string, any> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  login: LogIn,
}

const ACTION_COLORS: Record<string, string> = {
  create: 'text-emerald-600 bg-emerald-50',
  update: 'text-blue-600 bg-blue-50',
  delete: 'text-red-600 bg-red-50',
  login: 'text-gray-600 bg-gray-50',
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuditLogs()
      .then(setLogs)
      .catch(() => toast.error('Failed to load activity log'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Topbar title="Activity Log" />
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-500">
          Recent staff actions across your business. Most recent first
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
            <History className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No activity recorded yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
            {logs.map((log) => {
              const Icon = ACTION_ICONS[log.action] ?? History
              const colorClass = ACTION_COLORS[log.action] ?? 'text-gray-600 bg-gray-50'
              return (
                <div key={log.id} className="flex items-start gap-3 px-5 py-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{log.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {log.member} · {formatDate(log.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}