'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, TrendingUp, Users, AlertCircle, Crown } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import StatCard from '@/components/dashboard/StatCard'
import { getPlatformStats, PlatformStats } from '@/lib/tenants'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  trial: 'bg-blue-50 text-blue-700 border-blue-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-red-50 text-red-700 border-red-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlatformStats()
      .then(setStats)
      .catch(() => toast.error('Failed to load platform stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <>
        <Topbar title="Platform Dashboard" />
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar title="Platform Dashboard" />
      <div className="p-6 space-y-6">
        <p className="text-sm text-gray-500">Overview of all tenants and platform revenue</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Tenants" value={stats?.total_tenants ?? '—'} icon={Building2} iconColor="#10b981" iconBg="#ecfdf5" />
          <StatCard label="Active" value={stats?.active_count ?? '—'} icon={Users} iconColor="#3b82f6" iconBg="#eff6ff" />
          <StatCard label="On Trial" value={stats?.trial_count ?? '—'} icon={Users} iconColor="#f59e0b" iconBg="#fffbeb" />
          <StatCard label="Expired / Suspended" value={(stats?.expired_count ?? 0) + (stats?.suspended_count ?? 0)} icon={AlertCircle} iconColor="#ef4444" iconBg="#fef2f2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Revenue" value={stats ? formatCurrency(stats.total_revenue) : '—'} icon={TrendingUp} iconColor="#10b981" iconBg="#ecfdf5" />
          <StatCard label="This Month" value={stats ? formatCurrency(stats.this_month_revenue) : '—'} icon={TrendingUp} iconColor="#8b5cf6" iconBg="#f5f3ff" />
          <StatCard label="New Signups (30d)" value={stats?.recent_signups_30d ?? '—'} icon={Building2} iconColor="#3b82f6" iconBg="#eff6ff" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Signups</h3>
            <div className="space-y-3">
              {stats?.recent_tenants.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No tenants yet</p>
              ) : (
                stats?.recent_tenants.map((t) => (
                  <Link
                    key={t.id}
                    href={`/super-admin/tenants/${t.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.email} · {formatDate(t.created_at)}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize ${STATUS_COLORS[t.status] ?? ''}`}>
                      {t.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4 text-emerald-600" />
              Plan Distribution
            </h3>
            <div className="space-y-3">
              {stats?.plan_distribution.map((p) => (
                <div key={p.plan} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{p.plan}</span>
                  <span className="text-sm font-semibold text-gray-900">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}