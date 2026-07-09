
'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutGrid, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerTenant } from '@/lib/tenants'
import { getErrorMessage } from '@/lib/utils'

const PLAN_LABELS: Record<string, string> = {
  starter:    'Starter — KES 2,500/month',
  business:   'Business — KES 5,000/month',
  enterprise: 'Enterprise — KES 5,000/month',
  lifetime:   'Lifetime — KES 40,000 one-time',
}

const PLAN_AMOUNTS: Record<string, number> = {
  starter:    2500,
  business:   3000,
  enterprise: 5000,
  lifetime:   40000,
}

function RegisterForm() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const planFromUrl   = searchParams.get('plan') ?? 'starter'

  const [businessName,   setBusinessName]   = useState('')
  const [adminName,      setAdminName]      = useState('')
  const [email,          setEmail]          = useState('')
  const [phone,          setPhone]          = useState('')
  const [password,       setPassword]       = useState('')
  const [showPassword,   setShowPassword]   = useState(false)
  const [plan,           setPlan]           = useState(planFromUrl)
  const [storeName,      setStoreName]      = useState('Main Store')
  const [storeLocation,  setStoreLocation]  = useState('')
  const [loading,        setLoading]        = useState(false)
  const [agreed,         setAgreed]         = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) {
      toast.error('Please accept the terms of service')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const result = await registerTenant({
        business_name:  businessName,
        admin_name:     adminName,
        email,
        phone:          phone || undefined,
        password,
        plan_name:      plan,
        store_name:     storeName,
        store_location: storeLocation || undefined,
      })

      toast.success('Account created! Complete payment to activate.')
      router.push(
        `/onboarding/verify-payment?plan=${plan}&email=${encodeURIComponent(email)}&tenant_id=${result.tenant.id}&plan_id=${getPlanId(plan)}`
      )
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function getPlanId(planName: string): number {
    const ids: Record<string, number> = {
      starter: 1, business: 2, enterprise: 3, lifetime: 4
    }
    return ids[planName] ?? 1
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">BoraPOS</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            Create your account
          </h1>
          <p className="text-sm text-gray-400">
            Start your 5-day free trial — no credit card required
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Westside Boutique"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             text-sm text-white placeholder:text-gray-600
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Sarah Wanjiku"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             text-sm text-white placeholder:text-gray-600
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                           text-sm text-white placeholder:text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             text-sm text-white placeholder:text-gray-600
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                               text-sm text-white placeholder:text-gray-600 pr-10
                               focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  First Store Name
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Main Branch"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             text-sm text-white placeholder:text-gray-600
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Store Location
                </label>
                <input
                  type="text"
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                  placeholder="e.g. Westlands, Nairobi"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             text-sm text-white placeholder:text-gray-600
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Plan
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                           text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.entries(PLAN_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="bg-gray-900">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-emerald-500 shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl
                         text-sm font-semibold transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}