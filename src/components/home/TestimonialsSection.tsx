const TESTIMONIALS = [
  {
    body: 'Finding a Black-owned therapist in London used to take weeks of research. SankofaX got me there in minutes.',
    author: 'Amara O.',
    role: 'London, UK',
    avatar: 'ðŸ‘©ðŸ¾',
  },
  {
    body: 'Listed my restaurant and had new customers within the week. The platform actually gets our community.',
    author: 'Kofi A.',
    role: 'Business Owner Â· Accra, Ghana',
    avatar: 'ðŸ‘¨ðŸ¿',
  },
  {
    body: 'The best directory for the diaspora. I use it whenever I travel to find Black-owned spaces that feel like home.',
    author: 'Nadia R.',
    role: 'Toronto, Canada',
    avatar: 'ðŸ‘©ðŸ½',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="section-title text-center mb-2">Loved by the Community</h2>
      <p className="text-center text-muted text-sm mb-10">Real stories from real members of the diaspora</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map(t => (
          <div key={t.author} className="card p-6">
            <p className="text-sm text-charcoal leading-relaxed">&ldquo;{t.body}&rdquo;</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl">{t.avatar}</span>
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
