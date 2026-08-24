'use client'

import { Delete } from 'lucide-react'

export default function NumericKeypad({
  onDigit,
  onBackspace,
  onClear,
}: {
  onDigit: (digit: string) => void
  onBackspace: () => void
  onClear: () => void
}) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

  function handlePress(key: string) {
    if (key === 'C') onClear()
    else if (key === '⌫') onBackspace()
    else onDigit(key)
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 p-2 bg-white rounded-xl border border-gray-200 shadow-lg">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => handlePress(key)}
          className="h-11 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50
                     hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center"
        >
          {key === '⌫' ? <Delete className="w-4 h-4" /> : key}
        </button>
      ))}
    </div>
  )
}