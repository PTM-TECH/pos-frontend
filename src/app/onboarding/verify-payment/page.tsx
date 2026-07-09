
'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LayoutGrid, Copy, CheckCircle2, Smartphone } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { submitPayment } from '@/lib/tenants'
import { getErrorMessage } from '@/lib/utils'

const PLAN_AMOUNTS: Record<string, number> = {
  starter:    2500,
  business:   3000,
  enterprise: 5000,
  lifetime:   40000,
}

function VerifyPaymentForm() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const plan      = searchParams.get('plan')      ?? 'starter'
  const email     = searchParams.get('email')     ?? ''
  const tenantId  = Number(searchParams.get('tenant_id') ?? '0')
  const planId    = Number(searchParams.get('plan_id')   ?? '1')
  const amount    = PLAN_AMOUNTS[plan] ?? 2500

  const [mpesaCode, setMpesaCode] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [copied,    setCopied]    = useState(false)

  function copyTill() {
    navigator.clipboard.writeText('123456')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mpesaCode.trim().length < 8) {
      toast.error('Please enter a valid M-Pesa confirmation code')
      return
    }
    if (!tenantId) {
      toast.error('Invalid registration session. Please register again.')
      return
    }

    setLoading(true)
    try {
      await submitPayment({
        tenant_id:  tenantId,
        mpesa_code: mpesaCode,
        amount,
        plan_id:    planId,
      })
      toast.success(
        'Payment submitted! We will verify and activate your account within 30 minutes.'
      )
      router.push(`/login?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">BoraPOS</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            Complete your payment
          </h1>
          <p className="text-sm text-gray-400">
            Send{' '}
            <span className="text-white font-semibold">
              KES {amount.toLocaleString()}
            </span>{' '}
            via M-Pesa to activate your account
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Smartphone className="w-4 h-4" />
              M-Pesa Payment Instructions
            </div>
            <ol className="text-sm text-gray-300 space-y-1.5 list-decimal list-inside">
              <li>Go to M-Pesa on your phone</li>
              <li>
                Select{' '}
                <strong className="text-white">
                  Lipa na M-Pesa → Pochi La Biashara
                </strong>
              </li>
              <li>
                Enter Number:{' '}
                <strong className="text-white">0795310021</strong>
              </li>
              <li>
                Enter amount:{' '}
                <strong className="text-white">
                  KES {amount.toLocaleString()}
                </strong>
              </li>
              <li>Enter your M-Pesa PIN and confirm</li>
              <li>Copy the confirmation code and paste it below</li>
            </ol>
            <button
              onClick={copyTill}
              className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300"
            >
              {copied
                ? <CheckCircle2 className="w-3.5 h-3.5" />
                : <Copy className="w-3.5 h-3.5" />
              }
              {copied ? 'Copied!' : 'Copy Till Number'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                M-Pesa Confirmation Code
              </label>
              <input
                type="text"
                required
                value={mpesaCode}
                onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                placeholder="e.g. QHJ1234ABC"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                           text-sm text-white placeholder:text-gray-600 uppercase tracking-widest
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Found in your M-Pesa confirmation SMS
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3
                         rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Payment Code'}
            </button>
          </form>

          <div className="text-center space-y-1">
            <p className="text-xs text-gray-500">
              Your 14-day free trial starts immediately.
            </p>
            <p className="text-xs text-gray-500">
              Having trouble?{' '}
              
               <a href="mailto:support@borapos.co.ke"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPaymentPage() {
  return (
    <Suspense>
      <VerifyPaymentForm />
    </Suspense>
  )
}