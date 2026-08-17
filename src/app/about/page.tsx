import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about SankofaX — the global Black and African business directory.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">About SankofaX</h1>
          <p className="text-white/70 text-lg">
            The global platform connecting the African diaspora with Black and African-owned
            businesses, services, and experiences worldwide.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div>
          <h2 className="text-xl font-semibold text-charcoal mb-3">Our Mission</h2>
          <p className="text-[15px] leading-relaxed text-charcoal">
            We believe that economic empowerment starts with visibility. When Black and African
            businesses are easy to find, they grow. When the diaspora can discover wellness spaces,
            tech companies, restaurants, and creatives that reflect their culture — community thrives.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-charcoal mb-3">Who We Serve</h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] leading-relaxed text-muted">
            <li>Black and African-owned businesses seeking visibility</li>
            <li>Members of the diaspora looking for community spaces and services</li>
            <li>Travelers seeking culturally aligned experiences worldwide</li>
            <li>Organizations building economic networks across the diaspora</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-charcoal mb-3">Regional Pricing</h2>
          <p className="text-[15px] leading-relaxed text-charcoal">
            We offer different pricing tiers for Global North and Global South businesses — because a
            fair price looks different in Lagos than it does in London.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link href="/list-your-business" className="btn-primary">List Your Business</Link>
          <Link href="/directory" className="btn-outline">Browse the Directory</Link>
        </div>
      </section>
    </div>
  )
}
