// src/components/public/TestimonialsSection.tsx
const TESTIMONIALS = [
  {
    name: 'Sarah Wanjiku',
    role: 'Owner, Westside Boutique',
    location: 'Nairobi',
    text: "BoraPOS completely transformed how I run my boutique. I can track sales across my two branches from my phone. The M-Pesa integration makes checkout so fast.",
    avatar: 'SW',
  },
  {
    name: 'James Otieno',
    role: 'Manager, JO Hardware',
    location: 'Kisumu',
    text: "The inventory alerts saved us so many times. I get an SMS the moment any product drops below 3 units. We never run out of fast-moving items anymore.",
    avatar: 'JO',
  },
  {
    name: 'Amina Hassan',
    role: 'Owner, Amina General Store',
    location: 'Mombasa',
    text: "I was using a paper book before. Now I get a full sales report on my Email every morning before I even open the shop. The lifetime plan was worth every shilling.",
    avatar: 'AH',
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by businesses across Kenya
          </h2>
          <p className="text-gray-400">
            See what business owners are saying about BoraPOS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
            >
              <p className="text-sm text-gray-300 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center
                                text-xs font-bold text-emerald-400 shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}