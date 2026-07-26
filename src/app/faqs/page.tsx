import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { faqs } from '@/lib/api'
import FAQSection from '@/components/home/FAQSection'

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about SankofaX — listing your business, subscriptions, reviews, and more.',
}

export default async function FAQsPage() {
  const list = await faqs.list().catch(() => [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-white/70 text-lg">Everything you need to know about SankofaX.</p>
        </div>
      </section>

      {/* Accordion (reuses the homepage FAQ component, fed from the admin API) */}
      <FAQSection faqs={list} showHeading={false} />

      {/* Still need help */}
      <section className="bg-surface-2 border-t border-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-charcoal mb-1">Still have questions?</h3>
            <p className="text-muted text-sm">Reach out and our team will get back to you.</p>
          </div>
          <Link href="/contact" className="btn-primary gap-2 flex-shrink-0">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
