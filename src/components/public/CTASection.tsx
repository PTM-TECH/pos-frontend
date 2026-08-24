
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to grow your business?
        </h2>
        <p className="text-gray-400 mb-8">
          Join hundreds of Kenyan businesses already using PapoPOS.
          Start your 14-day free trial. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white
                       font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Get started for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-300 hover:text-white px-6 py-3
                       border border-white/10 rounded-xl hover:border-white/20 transition-colors"
          >
            See all plans
          </Link>
        </div>
      </div>
    </section>
  )
}