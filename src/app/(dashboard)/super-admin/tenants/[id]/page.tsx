'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Building2, CheckCircle2, XCircle, Store as StoreIcon, Users } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import api from '@/lib/api'
import { formatCurrency, formatDate, getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface TenantDetail {
  id: number
  name: string
  email: string
  phone: string | null
  status: string
  created_at: string
  subscription: {
    plan: string | null
    status: string
    billing_cycle: string
    start_date: string
    end_date: string | null
    amount_paid: number
  } | null
}

export default function TenantDetailPage() {
  const params = useParams()
  const tenantId = params.id as string

  const [tenant, setTenant] = useState<TenantDetail | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    try {
      const response = await api.get(`/tenants/${tenantId}`)
      setTenant(response.data.data)
    } catch {
      toast.error('Failed to load tenant')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [tenantId])

  async function handleSuspend() {
    try {
      await api.patch(`/tenants/${tenantId}/suspend`)
      toast.success('Tenant suspended')
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleActivate() {
    try {
      await api.patch(`/tenants/${tenantId}/activate`)
      toast.success('Tenant activated')
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    trial:     'bg-blue-50 text-blue-700 border-blue-200',
    active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    expired:   'bg-red-50 text-red-700 border-red-200',
    suspended: 'bg-red-50 text-red-700 border-red-200',
    cancelled: 'bg-gray-50 text-gray-700 border-gray-200',
  }

  return (
    <>
      <Topbar title="Tenant Detail" />
      <div className="p-6 space-y-5 max-w-2xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !tenant ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-400">Tenant not found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">{tenant.name}</h2>
                    <p className="text-sm text-gray-500">{tenant.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-1 rounded border capitalize
                  ${STATUS_COLORS[tenant.status] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                  {tenant.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                <div>
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="text-gray-900">{tenant.phone ?? '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Joined</p>
                  <p className="text-gray-900">{formatDate(tenant.created_at)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {tenant.status !== 'active' ? (
                  <button
                    onClick={handleActivate}
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-2
                               bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Activate Tenant
                  </button>
                ) : (
                  <button
                    onClick={handleSuspend}
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-2
                               bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                  >
                    <XCircle className="w-4 h-4" />
                    Suspend Tenant
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Subscription</h3>
              {tenant.subscription ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Plan</p>
                    <p className="text-gray-900 capitalize">{tenant.subscription.plan ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Status</p>
                    <p className="text-gray-900 capitalize">{tenant.subscription.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Billing Cycle</p>
                    <p className="text-gray-900 capitalize">{tenant.subscription.billing_cycle}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Amount Paid</p>
                    <p className="text-gray-900">{formatCurrency(tenant.subscription.amount_paid)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Started</p>
                    <p className="text-gray-900">{formatDate(tenant.subscription.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Ends / Renews</p>
                    <p className="text-gray-900">
                      {tenant.subscription.end_date ? formatDate(tenant.subscription.end_date) : 'Lifetime'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No subscription found</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}