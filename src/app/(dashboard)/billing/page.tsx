'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock, Copy, Smartphone } from 'lucide-react'
import toast from 'react-hot-toast'
import Topbar from '@/components/shared/Topbar'
import { getMySubscription, submitPayment } from '@/lib/tenants'
import { formatDate, getErrorMessage } from '@/lib/utils'
import { TenantWithSubscription } from '@/types'

export default function BillingPage() {
  const [tenant, setTenant] = useState<TenantWithSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [mpesaCode, setMpesaCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  function loadData() {
    setLoading(true)
    getMySubscription()
      .then(setTenant)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const sub = tenant?.subscription
  const isActive = sub && ['trial', 'active'].includes(sub.status)

  const amount = sub?.plan_price ?? 0

  function copyTill() {
    navigator.clipboard.writeText('0795310021')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmitPayment(e: React.FormEvent) {
    e.preventDefault()

    if (!tenant) {
      toast.error('Unable to load your account. Please refresh and try again.')
      return
    }
    
    if (mpesaCode.trim().length < 8) {
      toast.error('Please enter a valid M-Pesa confirmation code')
      return
    }

    if (!sub?.plan_id) {
      toast.error('Could not determine your plan. Please contact support.')
      return
    }

    setSubmitting(true)
    try {
      await submitPayment({
        tenant_id:  tenant.id,
        mpesa_code: mpesaCode,
        amount,
        plan_id:    sub.plan_id,
      })
      toast.success('Payment submitted! We will verify and activate your account within 30 minutes.')
      setMpesaCode('')
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Topbar title="Billing" />
      <div className="p-6 max-w-lg space-y-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-3">
                {isActive ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {isActive
                      ? sub?.status === 'trial'
                        ? 'Your free trial is active'
                        : 'Your subscription is active'
                      : 'Your subscription has expired'}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">
                    Plan: {sub?.plan ?? '—'} · Status: {sub?.status ?? '—'}
                  </p>
                </div>
              </div>

              {sub?.end_date && (
                <p className="text-sm text-gray-500">
                  {isActive ? (sub.status === 'trial' ? 'Trial ends' : 'Renews') : 'Expired'} on {formatDate(sub.end_date)}
                </p>
              )}
            </div>

            {!isActive && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                    <Smartphone className="w-4 h-4" />
                    M-Pesa Payment Instructions
                  </div>
                  <ol className="text-sm text-gray-700 space-y-1.5 list-decimal list-inside">
                    <li>Go to M-Pesa on your phone</li>
                    <li>Select <strong>Lipa na M-Pesa → Pochi La Biashara</strong></li>
                    <li>Enter Number: <strong>0795310021</strong></li>
                    <li>Enter amount: <strong>KES {amount.toLocaleString()}</strong></li>
                    <li>Enter your M-Pesa PIN and confirm</li>
                    <li>Copy the confirmation code and paste it below</li>
                  </ol>
                  <button
                    onClick={copyTill}
                    className="flex items-center gap-2 text-xs text-emerald-700 hover:text-emerald-800"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Number'}
                  </button>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      M-Pesa Confirmation Code
                    </label>
                    <input
                      type="text"
                      required
                      value={mpesaCode}
                      onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                      placeholder="e.g. QHJ1234ABC"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                                 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                               hover:bg-emerald-700 transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Payment Code'}
                  </button>
                </form>

                <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Your subscription stays inactive until we verify your payment, usually within
                    30 minutes during business hours. You&apos;ll regain access automatically once approved.
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}