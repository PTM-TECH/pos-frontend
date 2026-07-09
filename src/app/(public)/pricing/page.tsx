// src/app/(public)/pricing/page.tsx
import Link from 'next/link'
import { CheckCircle2, Zap } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

const PLANS = [
  {
    name: 'Starter',
    price: 2500,
    billing: 'per month',
    description: 'Perfect for small single-store businesses just getting started.',
    features: [
      '1 store',
      'Up to 3 staff members',
      'Unlimited products',
      'Sales & receipts',
      'Basic inventory management',
      'Email support',
    ],
    cta: 'Start free trial',
    href: '/register?plan=starter',
    highlighted: false,
  },
  {
    name: 'Business',
    price: 3000,
    billing: 'per month',
    description: 'For growing businesses with multiple stores and teams.',
    features: [
      'Up to 5 stores',
      'Unlimited staff members',
      'Unlimited products',
      'Full analytics & charts',
      'Scheduled email & SMS reports',
      'Purchase order management',
      'Priority support',
    ],
    cta: 'Start free trial',
    href: '/register?plan=business',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 5000,
    billing: 'per month',
    description: 'For large operations with advanced needs and high volume.',
    features: [
      'Unlimited stores',
      'Unlimited staff members',
      'Unlimited products',
      'Full analytics & charts',
      'Scheduled email & SMS reports',
      'Purchase order management',
      'Custom branding',
      'Dedicated support',
    ],
    cta: 'Start free trial',
    href: '/register?plan=enterprise',
    highlighted: false,
  },
  {
    name: 'Lifetime',
    price: 40000,
    billing: 'one-time payment',
    description: 'Pay once, use forever. Everything in Enterprise included.',
    features: [
      'Everything in Enterprise',
      'No recurring payments ever',
      'All future updates included',
      'Lifetime priority support',
    ],
    cta: 'Get lifetime access',
    href: '/register?plan=lifetime',
    highlighted: false,
    badge: 'Best value',
  },
]

export const metadata = {
  title: 'Pricing, BoraPOS',
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              All plans include a 5-day free trial. No credit card required.
              Pay via M-Pesa after your trial ends.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col border transition-colors
                  ${plan.highlighted
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px]
                                     font-bold px-2.5 py-1 rounded-full">
                      <Zap className="w-3 h-3" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={`text-sm font-semibold mb-1 ${plan.highlighted ? 'text-white' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mb-4 ${plan.highlighted ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-white'}`}>
                      KES {plan.price.toLocaleString()}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${plan.highlighted ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {plan.billing}
                  </p>
                </div>

                <div className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-emerald-100' : 'text-emerald-500'}`} />
                      <span className={`text-xs ${plan.highlighted ? 'text-emerald-50' : 'text-gray-300'}`}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.href}
                  className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${plan.highlighted
                      ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-white font-semibold mb-2">How payment works</h3>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              After your 5-day free trial, send payment via M-Pesa to{' '}
              <span className="text-white font-medium">0705 273 739</span> (Till/Paybill).
              Send us your M-Pesa confirmation code via WhatsApp or email and we'll
              activate your subscription within 30 minutes during business hours.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}