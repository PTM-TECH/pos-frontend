'use client'

import { Eye, EyeOff } from 'lucide-react'
import { usePrivacyStore } from '@/store/privacyStore'

export default function PrivacyToggle() {
  const amountsHidden = usePrivacyStore((state) => state.amountsHidden)
  const toggleAmountsHidden = usePrivacyStore((state) => state.toggleAmountsHidden)

  return (
    <button
      onClick={toggleAmountsHidden}
      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
      title={amountsHidden ? 'Show amounts' : 'Hide amounts'}
    >
      {amountsHidden ? (
        <EyeOff className="w-4 h-4 text-gray-600" />
      ) : (
        <Eye className="w-4 h-4 text-gray-600" />
      )}
    </button>
  )
}