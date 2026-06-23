'use client'

import { useEffect, useState } from 'react'
import {
  ShoppingBag,
  Package,
  Wallet,
  RotateCcw,
  Scale,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import Topbar from '@/components/shared/Topbar'
import StatCard from '@/components/dashboard/StatCard'
import YearlyChart from '@/components/dashboard/YearlyChart'
import MonthlyChart from '@/components/dashboard/MonthlyChart'
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
import { DashboardStats } from '@/types'
import { formatCurrency } from '@/lib/utils'

const now = new Date()

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [yearlyData, setYearlyData] = useState<YearlyStat[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [monthYear, setMonthYear] = useState(now.getFullYear())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
    getTopProducts(undefined, 5).then(setTopProducts).catch(() => {})
    setLoading(false)
  }, [])

  useEffect(() => {
    getYearlyStats(year).then(setYearlyData).catch(() => {})
  }, [year])

  useEffect(() => {
    getMonthlyStats(monthYear, month).then(setMonthlyData).catch(() => {})
  }, [month, monthYear])

  return (
    <>
      <Topbar title="Dashboard" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Overview of your business performance
          </p>
          <Link
            href="/pos"
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
            label="Returned"
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

        {/* Yearly chart */}
        <YearlyChart data={yearlyData} year={year} onYearChange={setYear} />

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