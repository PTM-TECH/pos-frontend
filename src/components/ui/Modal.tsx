
'use client'

import { X } from 'lucide-react'
import { ReactNode } from 'react'

export default function Modal({
  title,
  onClose,
  children,
  maxWidth = 'max-w-md',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: string
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}