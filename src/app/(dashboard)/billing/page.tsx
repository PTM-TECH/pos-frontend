'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Topbar from '@/components/shared/Topbar'
import { getMySubscription } from '@/lib/tenants'
import { formatDate } from '@/lib/utils'

export default function BillingPage() {
  const [tenant, setTenant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMySubscription().then(setTenant).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const sub = tenant?.subscription
  const isActive = sub && ['trial', 'active'].includes(sub.status)

  return (
    <>
      <Topbar title="Billing" />
      <div className="p-6 max-w-lg">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              {isActive ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {isActive ? 'Your subscription is active' : 'Your subscription has expired'}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  Plan: {sub?.plan ?? '—'} · Status: {sub?.status ?? '—'}
                </p>
              </div>
            </div>

            {sub?.end_date && (
              <p className="text-sm text-gray-500">
                {isActive ? 'Renews' : 'Expired'} on {formatDate(sub.end_date)}
              </p>
            )}

            {!isActive && (
              <Link
                href={`/onboarding/verify-payment?plan=${sub?.plan ?? 'starter'}&email=${encodeURIComponent(tenant?.email ?? '')}&tenant_id=${tenant?.id}&plan_id=1`}
                className="inline-block bg-emerald-600 text-white px-4 py-2.5 rounded-lg
                           text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Renew subscription
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}