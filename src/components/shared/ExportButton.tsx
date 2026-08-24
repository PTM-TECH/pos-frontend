'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ExportButton({
  onExport,
}: {
  onExport: (format: 'xlsx' | 'pdf') => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleExport(format: 'xlsx' | 'pdf') {
    setOpen(false)
    setLoading(true)
    try {
      await onExport(format)
    } catch {
      toast.error('Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5
                   rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        <Download className="w-4 h-4" />
        {loading ? 'Exporting...' : 'Export'}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
            <button
              onClick={() => handleExport('xlsx')}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Excel (.xlsx)
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FileText className="w-4 h-4 text-red-600" />
              PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}