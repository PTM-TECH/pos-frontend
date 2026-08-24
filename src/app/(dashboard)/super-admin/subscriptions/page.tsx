'use client'

import { useEffect, useState } from 'react'
import Topbar from '@/components/shared/Topbar'
import DataTable, { Column } from '@/components/ui/DataTable'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface TenantWithSub {
  id: number
  name: string
  email: string
  status: string
  subscription: {
    plan: string | null
    status: string
    billing_cycle: string
    end_date: string | null
    amount_paid: number
  } | null
}

const STATUS_COLORS: Record<string, string> = {
  trial:     'bg-blue-50 text-blue-700 border-blue-200',
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired:   'bg-red-50 text-red-700 border-red-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-50 text-gray-700 border-gray-200',
}

export default function SuperAdminSubscriptionsPage() {
  const [tenants, setTenants] = useState<TenantWithSub[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tenants/')
      .then((r) => setTenants(r.data.data))
      .catch(() => toast.error('Failed to load subscriptions'))
      .finally(() => setLoading(false))
  }, [])

  const columns: Column<TenantWithSub>[] = [
    {
      header: 'Business',
      render: (t) => (
        <div>
          <p className="font-medium text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-500">{t.email}</p>
        </div>
      ),
    },
    {
      header: 'Plan',
      render: (t) => <span className="capitalize">{t.subscription?.plan ?? '—'}</span>,
    },
    {
      header: 'Status',
      render: (t) => (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize
          ${STATUS_COLORS[t.subscription?.status ?? ''] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
          {t.subscription?.status ?? '—'}
        </span>
      ),
    },
    {
      header: 'Billing Cycle',
      render: (t) => <span className="capitalize">{t.subscription?.billing_cycle ?? '—'}</span>,
    },
    {
      header: 'Amount Paid',
      render: (t) => formatCurrency(t.subscription?.amount_paid ?? 0),
    },
    {
      header: 'Ends / Renews',
      render: (t) => (t.subscription?.end_date ? formatDate(t.subscription.end_date) : 'Lifetime'),
    },
  ]

  return (
    <>
      <Topbar title="Subscriptions" />
      <div className="p-6 space-y-5">
        <p className="text-sm text-gray-500">Overview of every tenant&apos;s subscription status</p>
        <DataTable columns={columns} data={tenants} loading={loading} emptyMessage="No subscriptions found" />
      </div>
    </>
  )
}