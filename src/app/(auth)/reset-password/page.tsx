'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { resetPassword } from '@/lib/auth'
import { getErrorMessage } from '@/lib/utils'
import AuthSplitLayout from '@/components/shared/AuthSplitLayout'
import SecurityChallenge from '@/components/shared/SecurityChallenge'
import PasswordStrengthHints from '@/components/shared/PasswordStrengthHints'
import { isPasswordValid } from '@/lib/passwordValidator'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router        = useRouter()
  const token          = searchParams.get('token') ?? ''

  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword,    setShowPassword]    = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [done,            setDone]            = useState(false)
  const [challengeToken,  setChallengeToken]  = useState('')
  const [challengeAnswer, setChallengeAnswer] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isPasswordValid(newPassword)) {
      toast.error('Please choose a stronger password')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await resetPassword({
        token,
        new_password: newPassword,
        challenge_token: challengeToken,
        challenge_answer: challengeAnswer,
      })
      setDone(true)
      toast.success('Password reset successfully')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">Invalid reset link</h1>
        <p className="text-sm text-gray-500">
          This password reset link is missing or malformed. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">Password reset</h1>
        <p className="text-sm text-gray-500">Redirecting you to sign in...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-xl font-semibold text-gray-900">Set a new password</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">
        Choose a strong password for your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10
                         placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrengthHints password={newPassword} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <SecurityChallenge
          onChange={(t, a) => {
            setChallengeToken(t)
            setChallengeAnswer(a)
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60 mt-2"
        >
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  )
}