
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const HIGHLIGHTS = [
  'No setup fees',
  'Cancel anytime',
  'Free 14-day trial',
]

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          The POS system your
          <span className="text-emerald-400"> business deserves</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Manage sales, inventory, purchases, and staff across multiple stores.
          all from one clean, fast, and affordable platform built for Kenya.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white
                       font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Start your free trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-300 hover:text-white px-6 py-3
                       border border-white/10 rounded-xl hover:border-white/20 transition-colors"
          >
            View pricing
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {HIGHLIGHTS.map((h) => (
            <div key={h} className="flex items-center gap-1.5 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {h}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}