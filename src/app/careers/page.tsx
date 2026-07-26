import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe2, HeartHandshake, Sparkles, Rocket, ArrowRight, Mail } from 'lucide-react'
import { siteSettings } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the SankofaX team and help connect the African diaspora with Black and African-owned businesses worldwide.',
}

const VALUES = [
  {
    icon: Globe2,
    title: 'Global impact',
    body: 'Your work helps Black and African-owned businesses get discovered across the diaspora — from Lagos to London to Atlanta.',
  },
  {
    icon: HeartHandshake,
    title: 'Community first',
    body: 'We build for real people and real businesses. Empathy and economic empowerment guide every decision we make.',
  },
  {
    icon: Sparkles,
    title: 'Craft & ownership',
    body: 'Small team, big responsibility. You will own meaningful work end-to-end and see it ship to a growing audience.',
  },
  {
    icon: Rocket,
    title: 'Grow with us',
    body: 'We are early and moving fast. There is room to learn, stretch into new areas, and shape the product as we scale.',
  },
]

export default async function CareersPage() {
  const site = await siteSettings.get().catch(() => null)
  const email = site?.contact_email || 'careers@sankofax.com'

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Careers at SankofaX</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Help us build the global platform that connects the African diaspora with the
            businesses, services, and experiences that reflect their culture.
          </p>
        </div>
      </section>

      {/* Why work with us */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-semibold text-charcoal mb-2">Why work with us</h2>
        <p className="text-[15px] leading-relaxed text-muted max-w-2xl mb-8">
          We are a mission-driven team building something that matters. If you care about visibility,
          economic empowerment, and thoughtful product work, you will feel at home here.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-6 flex gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-1">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Open positions */}
      <section className="bg-surface-2 border-y border-gray-100 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-charcoal mb-3">Open positions</h2>
          <p className="text-[15px] leading-relaxed text-muted mb-6">
            We don&apos;t have any open roles right now — but we&apos;re always glad to hear from
            talented people who share our mission. Send us your CV and a note about how you&apos;d
            like to contribute, and we&apos;ll keep you in mind as we grow.
          </p>
          <a
            href={`mailto:${email}?subject=${encodeURIComponent('Careers at SankofaX')}`}
            className="btn-primary gap-2 inline-flex"
          >
            <Mail className="w-4 h-4" /> Email us your CV
          </a>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-charcoal mb-1">Not looking for a job?</h3>
            <p className="text-muted text-sm">Discover Black and African-owned businesses on SankofaX.</p>
          </div>
          <Link href="/directory" className="btn-outline gap-2 flex-shrink-0">
            Browse the Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
