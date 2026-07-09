
'use client'

import { useEffect, useState } from 'react'
import Topbar from '@/components/shared/Topbar'
import StatCard from '@/components/dashboard/StatCard'
import { Building2, CreditCard, TrendingUp, Users } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function SuperAdminDashboard() {
  const [tenantStats,  setTenantStats]  = useState<any>(null)
  const [revenueStats, setRevenueStats] = useState<any>(null)

  useEffect(() => {
    api.get('/tenants/stats').then(r => setTenantStats(r.data.data)).catch(() => {})
    api.get('/payments/revenue-stats').then(r => setRevenueStats(r.data.data)).catch(() => {})
  }, [])

  return (
    <>
      <Topbar title="Platform Dashboard" />
      <div className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Overview of all tenants and platform revenue
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Tenants"
            value={tenantStats?.total ?? '—'}
            icon={Building2}
            iconColor="#10b981"
            iconBg="#ecfdf5"
          />
          <StatCard
            label="Active Tenants"
            value={tenantStats?.active ?? '—'}
            icon={Users}
            iconColor="#3b82f6"
            iconBg="#eff6ff"
          />
          <StatCard
            label="Monthly Revenue"
            value={revenueStats ? formatCurrency(revenueStats.monthly_revenue) : '—'}
            icon={TrendingUp}
            iconColor="#f59e0b"
            iconBg="#fffbeb"
          />
          <StatCard
            label="Total Revenue"
            value={revenueStats ? formatCurrency(revenueStats.total_revenue) : '—'}
            icon={CreditCard}
            iconColor="#8b5cf6"
            iconBg="#f5f3ff"
          />
        </div>
      </div>
    </>
  )
}