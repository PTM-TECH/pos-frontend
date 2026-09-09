'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { resetTenantData } from '@/lib/tenants'
import { getErrorMessage } from '@/lib/utils'

export default function ResetTenantDataDialog({
  tenantId,
  tenantName,
  onClose,
  onReset,
}: {
  tenantId: number
  tenantName: string
  onClose: () => void
  onReset: () => void
}) {
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)

  const isConfirmed = confirmText.trim() === tenantName.trim()

  async function handleReset() {
    if (!isConfirmed) return
    setLoading(true)
    try {
      await resetTenantData(tenantId)
      toast.success('Tenant data has been reset')
      onReset()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Reset Tenant Data
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            This will permanently delete all products, sales, purchases, clients, vendors,
            categories, expenses, and returns for <strong>{tenantName}</strong>. Their account,
            staff members, subscription, and stores will remain intact. This cannot be undone.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type <span className="font-semibold">{tenantName}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            onClick={handleReset}
            disabled={!isConfirmed || loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium
                       hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset All Data'}
          </button>
        </div>
      </div>
    </div>
  )
}