
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutGrid, Store, User, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function OnboardingSetupPage() {
  const router = useRouter()

  const [storeName, setStoreName] = useState('')
  const [storeLocation, setStoreLocation] = useState('')
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (adminPassword.length < 8) {
      toast.error('Admin password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      // Will call FastAPI backend once rebuilt
      await new Promise((r) => setTimeout(r, 1500))
      toast.success('Setup complete! Redirecting to your dashboard...')
      router.push('/dashboard')
    } catch {
      toast.error('Setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">AppealPOS</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Set up your business</h1>
          <p className="text-sm text-gray-400">
            Just two more steps and you're ready to go
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Store className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Your first store</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Store Name
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
                placeholder="e.g. Nairobi CBD, Tom Mboya Street"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                           text-sm text-white placeholder:text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Admin account</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                           text-sm text-white placeholder:text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@yourbusiness.com"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                           text-sm text-white placeholder:text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                           text-sm text-white placeholder:text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400
                       text-white py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? 'Setting up...' : (
              <>
                Complete setup
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}