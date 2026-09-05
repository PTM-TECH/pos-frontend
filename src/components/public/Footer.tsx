
import Link from 'next/link'


export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="PapoPOS" className="w-7 h-7 rounded-lg object-contain" />
              <span className="font-bold text-white text-sm">PapoPOS</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              The modern POS system built for Kenyan businesses.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Product</p>
            <div className="space-y-2">
              <Link href="/#features" className="block text-sm text-gray-500 hover:text-gray-300">Features</Link>
              <Link href="/pricing" className="block text-sm text-gray-500 hover:text-gray-300">Pricing</Link>
              <Link href="/register" className="block text-sm text-gray-500 hover:text-gray-300">Get started</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Support</p>
            <div className="space-y-2">
              <Link href="/login" className="block text-sm text-gray-500 hover:text-gray-300">Sign in</Link>
              <a href="mailto:support@papopos.com" className="block text-sm text-gray-500 hover:text-gray-300">Contact us</a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Legal</p>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-sm text-gray-500 hover:text-gray-300">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm text-gray-500 hover:text-gray-300">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} PapoPOS. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Fast. Easy. Secure.
          </p>
        </div>
      </div>
    </footer>
  )
}