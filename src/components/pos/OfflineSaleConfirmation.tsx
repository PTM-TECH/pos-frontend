'use client'

import { CloudOff, CheckCircle2 } from 'lucide-react'

export default function OfflineSaleConfirmation({
  itemCount,
  total,
  onClose,
}: {
  itemCount: number
  total: number
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <CloudOff className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-1.5">
          Sale saved offline
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          You&apos;re currently offline. This sale ({itemCount} item{itemCount !== 1 ? 's' : ''},
          KES {total.toLocaleString()}) has been saved on this device and will
          sync automatically once you&apos;re back online.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 mb-5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          No data will be lost
        </div>
        <button
          onClick={onClose}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}