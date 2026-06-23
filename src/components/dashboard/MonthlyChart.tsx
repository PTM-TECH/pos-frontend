
'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { MonthlyStat } from '@/lib/analytics'
import { formatCurrency } from '@/lib/utils'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function MonthlyChart({
  data,
  month,
  year,
  onMonthChange,
  onYearChange,
}: {
  data: MonthlyStat[]
  month: number
  year: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
}) {
  const chartData = data.map((d) => ({
    day: d.day,
    Sales: d.total,
    Profit: d.profit,
    Discount: d.discount,
    Balance: d.balance,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">
          Sales for {MONTHS[month - 1]} {year}
        </h3>
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
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
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
          <XAxis
            dataKey="day"
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
            labelFormatter={(label) => `Day ${label}`}
            contentStyle={{
              borderRadius: '8px',
              fontSize: '13px',
              border: '1px solid #e5e7eb',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Area
            type="monotone"
            dataKey="Sales"
            stroke="#1e3a8a"
            fill="#1e3a8a"
            fillOpacity={0.08}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Profit"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.08}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Balance"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.08}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}