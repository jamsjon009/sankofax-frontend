import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about SankofaX â€” the global Black and African business directory.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-charcoal mb-6">About SankofaX</h1>

      <div className="prose prose-emerald text-charcoal space-y-6 text-[15px] leading-relaxed">
        <p className="text-lg text-muted">
          SankofaX is the global platform connecting the African diaspora with Black and African-owned businesses, services, and experiences worldwide.
        </p>

        <h2 className="text-xl font-semibold text-charcoal mt-8 mb-3">Our Mission</h2>
        <p>
          We believe that economic empowerment starts with visibility. When Black and African businesses are easy to find, they grow. When the diaspora can discover wellness spaces, tech companies, restaurants, and creatives that reflect their culture â€” community thrives.
        </p>

        <h2 className="text-xl font-semibold text-charcoal mt-8 mb-3">Who We Serve</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>Black and African-owned businesses seeking visibility</li>
          <li>Members of the diaspora looking for community spaces and services</li>
          <li>Travelers seeking culturally aligned experiences worldwide</li>
          <li>Organizations building economic networks across the diaspora</li>
        </ul>

        <h2 className="text-xl font-semibold text-charcoal mt-8 mb-3">Regional Pricing</h2>
        <p>
          We offer different pricing tiers for Global North and Global South businesses â€” because a fair price looks different in Lagos than it does in London.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/list-your-business" className="btn-primary">List Your Business</Link>
          <Link href="/directory" className="btn-outline">Browse the Directory</Link>
        </div>
      </div>
    </div>
  )
}
