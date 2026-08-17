import Link from 'next/link'
import type { HomeContent } from '@/lib/api'

export default function CTABanner({ content }: { content?: HomeContent | null }) {
  const title = content?.cta_title || 'Join the Directory. Be Seen. Be Supported. Be SankofaX.'
  const subtitle = content?.cta_subtitle ||
    'Join thousands of businesses already connecting with the diaspora community. Get listed in minutes.'

  return (
    <section className="py-14 hero-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {title}
        </h2>
        <p className="text-white/70 text-lg mb-8 mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/list-your-business"
            className="btn-primary bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold text-base px-8 py-3 rounded-xl"
          >
            List Your Business &mdash; Free
          </Link>
          <Link
            href="/pricing"
            className="btn-outline border-white/40 text-white hover:bg-white/10 hover:border-white/60 text-base px-8 py-3 rounded-xl"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </section>
  )
}