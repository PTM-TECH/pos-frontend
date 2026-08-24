import { Store, UtensilsCrossed, Pill, Truck } from 'lucide-react'

const TYPES = [
  { icon: Store,             title: 'Retail & Wholesale', description: 'Shops, boutiques, and bulk sellers managing high product volumes.' },
  { icon: UtensilsCrossed,   title: 'Hospitality',        description: 'Restaurants, cafes, and bars needing fast, reliable checkout.' },
  { icon: Pill,              title: 'Pharmacy',           description: 'Pharmacies tracking stock, expiry, and regulated inventory.' },
  { icon: Truck,             title: 'Distribution',       description: 'Distributors managing vendors, purchase orders, and multi-store stock.' },
]

export default function BusinessTypesSection() {
  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            Built for you
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Single POS System. For Every Business Type
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TYPES.map((t) => {
            const Icon = t.icon
            return (
              <div
                key={t.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center
                           hover:bg-white/8 hover:border-white/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{t.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{t.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}