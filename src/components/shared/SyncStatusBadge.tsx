'use client'

import { useEffect, useState } from 'react'
import { CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPendingSaleCount } from '@/lib/db/salesQueue'
import { onSyncComplete, triggerSync } from '@/lib/db/syncManager'

export default function SyncStatusBadge() {
  const [pendingCount, setPendingCount] = useState(0)

  async function refreshCount() {
    const count = await getPendingSaleCount()
    setPendingCount(count)
  }

  useEffect(() => {
    refreshCount()

    const unsubscribe = onSyncComplete((result) => {
      if (result.succeeded > 0) {
        toast.success(`${result.succeeded} offline sale(s) synced successfully`)
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} offline sale(s) failed to sync, review in Sales History`)
      }
      refreshCount()
    })
    const interval = setInterval(refreshCount, 5000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  if (pendingCount === 0) return null

  return (
    <button
      onClick={() => triggerSync()}
      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg
                 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
      title="Click to retry sync now"
    >
      <CloudOff className="w-3.5 h-3.5" />
      {pendingCount} pending sync
    </button>
  )
}