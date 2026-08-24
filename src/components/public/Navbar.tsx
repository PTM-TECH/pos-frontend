
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="PapoPOS" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-bold text-white text-sm">PapoPOS</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm text-gray-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">
            Testimonials
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Start free trial
          </Link>
        </div>

        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-gray-950 px-6 py-4 space-y-3">
          <Link href="/#features" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/pricing" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/#testimonials" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setOpen(false)}>Testimonials</Link>
          <Link href="/login" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setOpen(false)}>Sign in</Link>
          <Link href="/register" className="block text-sm font-semibold bg-emerald-500 text-white px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>Start free trial</Link>
        </div>
      )}
    </nav>
  )
}