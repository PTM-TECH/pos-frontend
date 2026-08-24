
import {
  ShoppingCart,
  Package,
  BarChart3,
  Bell,
  Users,
  Store,
  Receipt,
  Truck,
} from 'lucide-react'

const FEATURES = [
  {
    icon: ShoppingCart,
    title: 'Fast POS Sales',
    description: 'Search products, add to cart, checkout, and print receipts in seconds. Works on any device.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track stock levels in real time. Get automatic alerts when products run low.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: BarChart3,
    title: 'Sales Analytics',
    description: 'Daily, weekly, and monthly charts. Understand your business performance at a glance.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Bell,
    title: 'Scheduled Reports',
    description: 'Receive automated sales reports via email and SMS at times you choose.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Users,
    title: 'Staff Management',
    description: 'Add cashiers, admins, and stockists with different access levels per store.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
  {
    icon: Store,
    title: 'Multi-Store Support',
    description: 'Manage multiple branches from one account. Switch stores in a single click.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    icon: Truck,
    title: 'Purchase Orders',
    description: 'Record vendor purchases and track deliveries. Stock updates automatically on receipt.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: Receipt,
    title: 'Receipt Printing',
    description: 'Print professional receipts or send them digitally. Works with thermal printers.',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything you need to run your business
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From the first sale of the day to your end-of-day report; PapoPOS has every part of your operation covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8
                           hover:border-white/15 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}