'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { forgotPassword } from '@/lib/auth'
import { getErrorMessage } from '@/lib/utils'
import AuthSplitLayout from '@/components/shared/AuthSplitLayout'
import SecurityChallenge from '@/components/shared/SecurityChallenge'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [challengeToken,  setChallengeToken]  = useState('')
  const [challengeAnswer, setChallengeAnswer] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword({
        email,
        challenge_token: challengeToken,
        challenge_answer: challengeAnswer,
      })
      setSent(true)
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-gray-900">
          Forgot your password?
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-8">
          Enter your email and we&apos;ll send you a link to reset it
        </p>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm text-gray-600">
              If an account exists for <span className="font-medium text-gray-900">{email}</span>,
              we&apos;ve sent a password reset link. Check your inbox and spam folder.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             placeholder:text-gray-400"
                />
              </div>
            </div>

            <SecurityChallenge
              onChange={(token, answer) => {
                setChallengeToken(token)
                setChallengeAnswer(answer)
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                         hover:bg-emerald-700 transition-colors disabled:opacity-60
                         disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 pt-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </AuthSplitLayout>
  )
}