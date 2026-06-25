
import { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  loading,
  emptyMessage = 'No records found',
}: {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {columns.map((col) => (
              <th
                key={col.header}
                className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-5 py-3.5 text-sm text-gray-700 ${col.className ?? ''}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}