
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Zap } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { getPlans, Plan } from '@/lib/plans'


export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    getPlans()
      .then(setPlans)
      .catch(()=>{})
      .finally(()=> setLoading(false))
  }, [])
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
              All plans include a 14-day free trial. No credit card required.
              Pay via M-Pesa after your trial ends.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {plans.map((plan, index) => {
                const highlighted = plan.name.toLowerCase() === 'business'
                const isLifetime = plan.billing_cycle === 'lifetime'
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl p-6 flex flex-col border transition-colors
                      ${highlighted
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                  >
                    {isLifetime && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px]
                                         font-bold px-2.5 py-1 rounded-full">
                          <Zap className="w-3 h-3" />
                          Best value
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="text-sm font-semibold mb-1 text-white capitalize">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">
                          KES {plan.price.toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${highlighted ? 'text-emerald-100' : 'text-gray-500'}`}>
                        {plan.billing_cycle === 'lifetime' ? 'one-time payment' : `per ${plan.billing_cycle}`}
                      </p>
                    </div>

                    <div className="flex-1 space-y-2.5 mb-6">
                      {(plan.features ?? []).map((f) => (
                        <div key={f} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${highlighted ? 'text-emerald-100' : 'text-emerald-500'}`} />
                          <span className={`text-xs ${highlighted ? 'text-emerald-50' : 'text-gray-300'}`}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/register?plan=${plan.name}`}
                      className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors
                        ${highlighted
                          ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                        }`}
                    >
                      {isLifetime ? 'Get lifetime access' : 'Start free trial'}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-white font-semibold mb-2">How payment works</h3>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              After your 14-day free trial, send payment via M-Pesa to{' '}
              <span className="text-white font-medium">0705 273 739</span> (Pochi La Biashara).
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