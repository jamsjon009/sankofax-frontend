'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'What is SankofaX?',
    a: 'SankofaX is the global directory for Black and African-owned businesses. We connect the diaspora community with businesses across every industry and country, making it easy to discover, support, and connect.',
  },
  {
    q: 'How do I list my business?',
    a: 'Simply register for an account, choose a subscription plan, and submit your business details. Your listing will be reviewed and live within 24 hours.',
  },
  {
    q: 'Is there a free option?',
    a: 'Yes! We offer a free basic listing that gives your business a presence on SankofaX. Paid plans unlock additional features like photos, featured placement, and performance analytics.',
  },
  {
    q: 'What pricing regions are available?',
    a: 'We offer two pricing tiers: Global North (UK, US, Canada, Europe, Australia) and Global South (Africa, Caribbean, Latin America) to make SankofaX accessible to entrepreneurs everywhere.',
  },
  {
    q: 'How do subscriptions work?',
    a: 'Subscriptions are billed monthly or annually. You can upgrade, downgrade, or cancel at any time through your billing dashboard. Annual plans offer a significant discount.',
  },
  {
    q: 'Can customers leave reviews?',
    a: 'Yes. Verified users can leave ratings and reviews on any listing. Business owners can respond to reviews through their dashboard.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-surface-2 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title mb-3">Got Questions?</h2>
          <p className="text-muted text-sm">Everything you need to know about SankofaX</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-charcoal text-sm">{faq.q}</span>
                <ChevronDown
                  className={cn('w-4 h-4 text-muted flex-shrink-0 transition-transform', open === i && 'rotate-180')}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-sm text-muted leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}