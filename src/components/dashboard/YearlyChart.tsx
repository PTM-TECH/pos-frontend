
'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { YearlyStat } from '@/lib/analytics'
import { formatCurrency } from '@/lib/utils'

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export default function YearlyChart({
  data,
  year,
  onYearChange,
}: {
  data: YearlyStat[]
  year: number
  onYearChange: (year: number) => void
}) {
  const chartData = data.map((d) => ({
    name: MONTH_LABELS[d.month - 1],
    Sales: d.total,
    Paid: d.paid,
    Balance: d.balance,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">
          Sales for Year {year}
        </h3>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5
                     focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip
            formatter={(value: any) => formatCurrency(Number(value))}
            contentStyle={{
              borderRadius: '8px',
              fontSize: '13px',
              border: '1px solid #e5e7eb',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="Sales" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Paid" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Balance" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}