import { ShoppingCart, Package, Wallet, UserCog, Users, BarChart3 } from 'lucide-react'

const SERVICES = [
  { icon: ShoppingCart, title: 'Sales Management', description: 'Fast checkout, receipts, discounts, and multiple payment methods in one flow.' },
  { icon: Package,      title: 'Stock Management',  description: 'Track inventory in real time with low-stock alerts and purchase orders.' },
  { icon: Wallet,       title: 'Expense Tracking',   description: 'Record and categorize business expenses to see your true profitability.' },
  { icon: UserCog,      title: 'Staff Management',   description: 'Add cashiers, admins, and stockists with role-based access per store.' },
  { icon: Users,        title: 'Customer Management',description: 'Keep client records and purchase history to build lasting relationships.' },
  { icon: BarChart3,    title: 'Reports & Analytics',description: 'Daily, weekly, and monthly insights into how your business is performing.' },
]

export default function ServicesSection() {
  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            What you get
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything your business needs, in one place
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8
                           hover:border-white/15 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}