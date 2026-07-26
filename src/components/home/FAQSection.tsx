'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQ } from '@/lib/api'

// Fallback used only when the admin has no FAQs configured (or the API is unavailable).
const FALLBACK_FAQS = [
  {
    question: 'What is SankofaX?',
    answer: 'SankofaX is the global directory for Black and African-owned businesses. We connect the diaspora community with businesses across every industry and country, making it easy to discover, support, and connect.',
  },
  {
    question: 'How do I list my business?',
    answer: 'Simply register for an account, choose a subscription plan, and submit your business details. Your listing will be reviewed and live within 24 hours.',
  },
  {
    question: 'Is there a free option?',
    answer: 'Yes! We offer a free basic listing that gives your business a presence on SankofaX. Paid plans unlock additional features like photos, featured placement, and performance analytics.',
  },
  {
    question: 'What pricing regions are available?',
    answer: 'We offer two pricing tiers: Global North (UK, US, Canada, Europe, Australia) and Global South (Africa, Caribbean, Latin America) to make SankofaX accessible to entrepreneurs everywhere.',
  },
  {
    question: 'How do subscriptions work?',
    answer: 'Subscriptions are billed monthly or annually. You can upgrade, downgrade, or cancel at any time through your billing dashboard. Annual plans offer a significant discount.',
  },
  {
    question: 'Can customers leave reviews?',
    answer: 'Yes. Verified users can leave ratings and reviews on any listing. Business owners can respond to reviews through their dashboard.',
  },
]

export default function FAQSection({ faqs, showHeading = true }: { faqs?: FAQ[]; showHeading?: boolean }) {
  const [open, setOpen] = useState<number | null>(0)

  // Prefer admin-managed FAQs; fall back to the built-in list if none exist.
  const usingAdminFaqs = !!faqs && faqs.length > 0
  const items = usingAdminFaqs ? faqs! : FALLBACK_FAQS

  return (
    <section className="bg-surface-2 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Got Questions?</h2>
            <p className="text-muted text-sm">Everything you need to know about SankofaX</p>
          </div>
        )}

        <div className="space-y-3">
          {items.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-charcoal text-sm">{faq.question}</span>
                <ChevronDown
                  className={cn('w-4 h-4 text-muted flex-shrink-0 transition-transform', open === i && 'rotate-180')}
                />
              </button>
              {open === i && (
                usingAdminFaqs ? (
                  <div
                    className="px-6 pb-4 text-sm text-muted leading-relaxed [&_a]:text-primary-700 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                ) : (
                  <div className="px-6 pb-4 text-sm text-muted leading-relaxed">{faq.answer}</div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
