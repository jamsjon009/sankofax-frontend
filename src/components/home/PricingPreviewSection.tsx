'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types'

const STATIC_PLANS = {
  global_north: [
    {
      name: 'Directory Basic',
      tagline: 'Get listed and get discovered',
      price: '15',
      period: 'month',
      ribbon: null,
      features: [
        '1 Business Listing',
        'Basic Profile Page',
        'Community Visibility',
        'Search & Category Listing',
        'Email Support',
      ],
    },
    {
      name: 'Directory Pro',
      tagline: 'All benefits at a globally conscious rate',
      price: '29',
      period: 'month',
      ribbon: 'Most Popular',
      features: [
        '3 Business Listings',
        'Featured Placement',
        'Photo Gallery (up to 10)',
        'Analytics Dashboard',
        'WhatsApp & Social Links',
        'Priority Support',
      ],
    },
    {
      name: 'Directory Elite',
      tagline: 'Premium placement, same perks, half the cost',
      price: '99',
      period: 'month',
      ribbon: 'Billed Annually',
      features: [
        'Unlimited Business Listings',
        'Premium Homepage Placement',
        'Advanced Analytics',
        'Dedicated Account Manager',
        'Custom Brand Page',
        'Featured in Newsletter',
        'Priority Search Ranking',
      ],
    },
  ],
  global_south: [
    {
      name: 'Directory Basic',
      tagline: 'Same features — equitable pricing',
      price: '7.50',
      period: 'month',
      ribbon: null,
      features: [
        '1 Business Listing',
        'Basic Profile Page',
        'Community Visibility',
        'Search & Category Listing',
        'Email Support',
      ],
    },
    {
      name: 'Directory Pro',
      tagline: 'All benefits at a globally conscious rate',
      price: '14.50',
      period: 'month',
      ribbon: 'Most Popular',
      features: [
        '3 Business Listings',
        'Featured Placement',
        'Photo Gallery (up to 10)',
        'Analytics Dashboard',
        'WhatsApp & Social Links',
        'Priority Support',
      ],
    },
    {
      name: 'Directory Elite',
      tagline: 'Premium placement, same perks, half the cost',
      price: '24.50',
      period: 'month',
      ribbon: 'Billed Annually',
      features: [
        'Unlimited Business Listings',
        'Premium Homepage Placement',
        'Advanced Analytics',
        'Dedicated Account Manager',
        'Custom Brand Page',
        'Featured in Newsletter',
        'Priority Search Ranking',
      ],
    },
  ],
}

const REGION_LABELS: Record<string, { label: string; sub: string }> = {
  global_north: { label: 'GLOBAL NORTH', sub: '(United States, UK, Canada, EU, Australia, etc.)' },
  global_south: { label: 'GLOBAL SOUTH', sub: '(Africa, Caribbean, Latin America, South & Southeast Asia)' },
}

function PlanCard({ plan, index }: { plan: typeof STATIC_PLANS.global_north[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const isPopular = plan.ribbon === 'Most Popular'
  const isElite = plan.ribbon === 'Billed Annually'
  const hasRibbon = !!plan.ribbon

  return (
    <div className={cn('pricing-card', isPopular && 'pricing-card-popular')}>
      {/* Ribbon badge */}
      {hasRibbon && (
        <div className={cn('pricing-ribbon', isPopular ? 'pricing-ribbon-popular' : 'pricing-ribbon-elite')}>
          <span>{plan.ribbon}</span>
        </div>
      )}

      <div className="pricing-card-body">
        <h3 className="pricing-plan-name">{plan.name}</h3>
        <p className="pricing-plan-tagline">{plan.tagline}</p>

        <div className="pricing-price-row">
          <span className="pricing-currency">$</span>
          <span className="pricing-amount">{plan.price}</span>
          <span className="pricing-period">/{plan.period}</span>
        </div>

        <hr className="pricing-divider" />

        {/* Collapsed: CTA only. Expanded: show features */}
        {expanded && (
          <ul className="pricing-features">
            {plan.features.map((f, i) => (
              <li key={i} className="pricing-feature-item">
                <Check className="pricing-check-icon" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="pricing-toggle-btn"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Show More <ChevronDown className="w-4 h-4" /></>
          )}
        </button>

        <Link href="/list-your-business" className="pricing-cta-btn">
          Get Started
        </Link>
      </div>
    </div>
  )
}

export default function PricingPreviewSection({ plans }: { plans: Plan[] }) {
  const [region, setRegion] = useState<'global_north' | 'global_south'>('global_north')
  const displayPlans = STATIC_PLANS[region]
  const regionInfo = REGION_LABELS[region]

  return (
    <section className="pricing-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="pricing-main-title">
            Fair Pricing for a <span className="pricing-title-accent">Global Community</span>
          </h2>
          <p className="pricing-subtitle">
            We recognise the <strong>economic differences between regions</strong>, and we believe equitable
            access is non-negotiable. That&apos;s why we offer <strong>tiered pricing</strong>:
          </p>
        </div>

        {/* Region toggle */}
        <div className="pricing-toggle-row">
          <div className="pricing-toggle">
            <button
              onClick={() => setRegion('global_north')}
              className={cn('pricing-toggle-btn-region', region === 'global_north' && 'pricing-toggle-btn-active')}
            >
              Global North
            </button>
            <button
              onClick={() => setRegion('global_south')}
              className={cn('pricing-toggle-btn-region', region === 'global_south' && 'pricing-toggle-btn-active')}
            >
              Global South
            </button>
          </div>
        </div>

        {/* Region label */}
        <div className="text-center mb-10">
          <h3 className="pricing-region-label">{regionInfo.label}</h3>
          <p className="pricing-region-sub">{regionInfo.sub}</p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {displayPlans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-12 text-center">
          <Link href="/pricing" className="pricing-view-all">
            View full pricing details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}