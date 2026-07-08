import type { Testimonial } from '@/lib/api'

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="section-title text-center mb-2">What Clients Are Saying</h2>
      <p className="text-center text-muted text-sm mb-10">Real stories from real members of the diaspora</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="card p-6">
            <p className="text-sm text-charcoal leading-relaxed">&ldquo;{t.body}&rdquo;</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-700">{t.initials}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">{t.author}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}