'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteTenant } from '@/lib/tenants'
import { getErrorMessage } from '@/lib/utils'

export default function DeleteTenantDialog({
  tenantId,
  tenantName,
  onClose,
  onDeleted,
}: {
  tenantId: number
  tenantName: string
  onClose: () => void
  onDeleted: () => void
}) {
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)

  const expectedPhrase = `delete ${tenantName}`
  const isConfirmed = confirmText.trim().toLowerCase() === expectedPhrase.toLowerCase()

  async function handleDelete() {
    if (!isConfirmed) return
    setLoading(true)
    try {
      await deleteTenant(tenantId)
      toast.success(`${tenantName} has been permanently deleted`)
      onDeleted()
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
            Delete Tenant
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            This will <strong>permanently delete</strong> <strong>{tenantName}</strong>&apos;s
            entire account. All staff members, stores, products, sales, purchases, clients,
            vendors, and subscription history. This is different from a data reset: the account
            itself will cease to exist, and no one will be able to log in again. This cannot be undone.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type <span className="font-mono font-semibold">delete {tenantName}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`delete ${tenantName}`}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            onClick={handleDelete}
            disabled={!isConfirmed || loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium
                       hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Permanently Delete Tenant'}
          </button>
        </div>
      </div>
    </div>
  )
}