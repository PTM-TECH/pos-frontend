'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerTenant } from '@/lib/tenants'
import { getPlans, Plan } from '@/lib/plans'
import { getErrorMessage } from '@/lib/utils'
import AuthSplitLayout from '@/components/shared/AuthSplitLayout'
import SecurityChallenge from '@/components/shared/SecurityChallenge'
import PasswordStrengthHints from '@/components/shared/PasswordStrengthHints'
import { isPasswordValid } from '@/lib/passwordValidator'


function RegisterForm() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const planFromUrl   = searchParams.get('plan') ?? 'starter'

  const [plans, setPlans] = useState<Plan[]>([])
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
  const [challengeToken,  setChallengeToken]  = useState('')
  const [challengeAnswer, setChallengeAnswer] = useState('')

  useEffect(()=>{
    getPlans().then(setPlans).catch(()=>{})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) {
      toast.error('Please accept the terms of service')
      return
    }
    if (!isPasswordValid(password)) {
      toast.error('Please choose a stronger password')
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
        challenge_token:  challengeToken,
        challenge_answer: challengeAnswer,
      })

      const selectedPlan = plans.find((p)=> p.name === plan)

      toast.success('Account created! Your 14-day free trial has started.')
      router.push(`/login?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-xl font-semibold text-gray-900">
        Create your account
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Start your 14-day free trial; no credit card required
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Business Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Sokoni Boutique"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg
                         text-sm text-gray-900 placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your Full Name
            </label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. Sarah Wanjiku"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg
                         text-sm text-gray-900 placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@gmail.com"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg
                       text-sm text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg
                         text-sm text-gray-900 placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg
                           text-sm text-gray-900 placeholder:text-gray-400 pr-10
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrengthHints password={password} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              First Store Name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Main Branch"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg
                         text-sm text-gray-900 placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Store Location
            </label>
            <input
              type="text"
              value={storeLocation}
              onChange={(e) => setStoreLocation(e.target.value)}
              placeholder="e.g. Westlands, Nairobi"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg
                         text-sm text-gray-900 placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Plan
          </label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg
                       text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name.charAt(0).toUpperCase() + p.name.slice(1)} | KES {p.price.toLocaleString()}
                {p.billing_cycle === 'lifetime' ? ' one-time' : ` /${p.billing_cycle}`}
              </option>
            ))}
          </select>
        </div>

        <SecurityChallenge
          onChange={(t, a) => {
            setChallengeToken(t)
            setChallengeAnswer(a)
          }}
        />

        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-emerald-500 shrink-0"
          />
          <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl
                     text-sm font-semibold transition-colors disabled:opacity-60 mt-2"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <AuthSplitLayout>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthSplitLayout>
  )
}