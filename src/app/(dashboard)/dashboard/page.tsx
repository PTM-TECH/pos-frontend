'use client'

import { useEffect, useState } from 'react'
import {
  ShoppingBag,
  Package,
  Wallet,
  RotateCcw,
  Scale,
  TrendingUp,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import Topbar from '@/components/shared/Topbar'
import StatCard from '@/components/dashboard/StatCard'
import YearlyChart from '@/components/dashboard/YearlyChart'
import MonthlyChart from '@/components/dashboard/MonthlyChart'
import ExpenseChart from '@/components/dashboard/ExpenseChart'
import TopProducts from '@/components/dashboard/TopProducts'
import {
  getDashboardStats,
  getYearlyStats,
  getMonthlyStats,
  getTopProducts,
  YearlyStat,
  MonthlyStat,
  TopProduct,
} from '@/lib/analytics'
import { getMonthlyExpenses } from '@/lib/expenses'
import { DashboardStats } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useEffectiveStoreId } from '@/lib/useEffectiveStoreId'

const now = new Date()

export default function DashboardPage() {
  const storeId = useEffectiveStoreId()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [yearlyData, setYearlyData] = useState<YearlyStat[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([])
  const [expenseData, setExpenseData] = useState<{ month: number; total: number }[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [monthYear, setMonthYear] = useState(now.getFullYear())
  const [expenseYear, setExpenseYear] = useState(now.getFullYear())

  useEffect(() => {
    getDashboardStats(storeId).then(setStats).catch(() => {})
    getTopProducts(storeId, 5).then(setTopProducts).catch(() => {})
  }, [storeId])

  useEffect(() => {
    getYearlyStats(year, storeId).then(setYearlyData).catch(() => {})
  }, [year, storeId])

  useEffect(() => {
    getMonthlyStats(monthYear, month, storeId).then(setMonthlyData).catch(() => {})
  }, [month, monthYear, storeId])

  useEffect(() => {
    getMonthlyExpenses(expenseYear, storeId).then(setExpenseData).catch(() => {})
  }, [expenseYear, storeId])


  return (
    <>
      <Topbar title="Dashboard" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Overview of your business performance
          </p>
          <Link
            href="/new-sale"
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5
                       rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Sale
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Sales"
            value={stats?.total_sales ?? '—'}
            icon={ShoppingBag}
            iconColor="#10b981"
            iconBg="#ecfdf5"
          />
          <StatCard
            label="Items Sold"
            value={stats?.items_sold ?? '—'}
            icon={Package}
            iconColor="#3b82f6"
            iconBg="#eff6ff"
          />
          <StatCard
            label="Total Paid"
            value={stats ? formatCurrency(stats.total_paid) : '—'}
            icon={Wallet}
            iconColor="#10b981"
            iconBg="#ecfdf5"
          />
          <StatCard
            label="Returned Units"
            value={stats?.total_returned ?? 0}
            icon={RotateCcw}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
          <StatCard
            label="Balance"
            value={stats ? formatCurrency(stats.total_balance) : '—'}
            icon={Scale}
            iconColor="#f59e0b"
            iconBg="#fffbeb"
          />
        </div>

          {/* Profitability cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Gross Profit"
            value={stats ? formatCurrency(stats.gross_profit) : '—'}
            icon={TrendingUp}
            iconColor="#10b981"
            iconBg="#ecfdf5"
          />
          <StatCard
            label="Total Expenses"
            value={stats ? formatCurrency(stats.total_expenses) : '—'}
            icon={Wallet}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
          <StatCard
            label="Net Profit"
            value={stats ? formatCurrency(stats.net_profit) : '—'}
            icon={Scale}
            iconColor={stats && stats.net_profit < 0 ? '#ef4444' : '#10b981'}
            iconBg={stats && stats.net_profit < 0 ? '#fef2f2' : '#ecfdf5'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <YearlyChart data={yearlyData} year={year} onYearChange={setYear} />
          </div>
          <ExpenseChart
            data={expenseData}
            year={expenseYear}
            onYearChange={setExpenseYear}
          />
        </div>


        {/* Monthly chart + top products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlyChart
              data={monthlyData}
              month={month}
              year={monthYear}
              onMonthChange={setMonth}
              onYearChange={setMonthYear}
            />
          </div>
          <TopProducts products={topProducts} />
        </div>
      </div>
    </>
  )
}