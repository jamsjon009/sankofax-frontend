'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, ChevronUp, ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANS = {
  global_north: [
    {
      name: 'Directory Basic',
      tagline: 'Get listed and get discovered',
      price: '15',
      period: 'month',
      badge: null,
      features: ['1 Business Listing', 'Basic Profile Page', 'Community Visibility', 'Search & Category Listing', 'Email Support'],
    },
    {
      name: 'Directory Pro',
      tagline: 'All benefits at a globally conscious rate',
      price: '29',
      period: 'month',
      badge: 'Most Popular',
      features: ['3 Business Listings', 'Featured Placement', 'Photo Gallery (up to 10)', 'Analytics Dashboard', 'WhatsApp & Social Links', 'Priority Support'],
    },
    {
      name: 'Directory Elite',
      tagline: 'Premium placement, same perks, half the cost',
      price: '99',
      period: 'month',
      badge: 'Billed Annually',
      features: ['Unlimited Listings', 'Premium Homepage Placement', 'Advanced Analytics', 'Dedicated Account Manager', 'Custom Brand Page', 'Featured in Newsletter'],
    },
  ],
  global_south: [
    {
      name: 'Directory Basic',
      tagline: 'Same features — equitable pricing',
      price: '7.50',
      period: 'month',
      badge: null,
      features: ['1 Business Listing', 'Basic Profile Page', 'Community Visibility', 'Search & Category Listing', 'Email Support'],
    },
    {
      name: 'Directory Pro',
      tagline: 'All benefits at a globally conscious rate',
      price: '14.50',
      period: 'month',
      badge: 'Most Popular',
      features: ['3 Business Listings', 'Featured Placement', 'Photo Gallery (up to 10)', 'Analytics Dashboard', 'WhatsApp & Social Links', 'Priority Support'],
    },
    {
      name: 'Directory Elite',
      tagline: 'Premium placement, same perks, half the cost',
      price: '24.50',
      period: 'month',
      badge: 'Billed Annually',
      features: ['Unlimited Listings', 'Premium Homepage Placement', 'Advanced Analytics', 'Dedicated Account Manager', 'Custom Brand Page', 'Featured in Newsletter'],
    },
  ],
}

const REGIONS = {
  global_north: { label: 'GLOBAL NORTH', sub: '(United States, UK, Canada, EU, Australia, etc.)' },
  global_south: { label: 'GLOBAL SOUTH', sub: '(Africa, Caribbean, Latin America, South & Southeast Asia)' },
}

function PlanCard({ plan }: { plan: typeof PLANS.global_north[0] }) {
  const [expanded, setExpanded] = useState(false)
  const isPopular = plan.badge === 'Most Popular'

  return (
    <div className={cn(
      'rounded-2xl border flex flex-col relative overflow-hidden transition-all duration-200',
      isPopular
        ? 'bg-primary-700 text-white border-primary-600 shadow-xl scale-[1.03]'
        : 'bg-white text-charcoal border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
    )}>
      {/* Badge */}
      {plan.badge && (
        <div className={cn(
          'absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full',
          isPopular ? 'bg-accent-500 text-charcoal' : 'bg-white/20 text-white',
        )}>
          {isPopular && <Zap className="w-3 h-3 inline mr-0.5 -mt-0.5" />}
          {plan.badge}
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Plan name & tagline */}
        <h3 className={cn('text-xl font-bold mb-1', isPopular ? 'text-white' : 'text-charcoal')}>
          {plan.name}
        </h3>
        <p className={cn('text-xs leading-snug mb-5', isPopular ? 'text-white/60' : 'text-muted')}>
          {plan.tagline}
        </p>

        {/* Price */}
        <div className="flex items-end gap-0.5 mb-5">
          <span className={cn('text-xl font-bold mb-1', isPopular ? 'text-white' : 'text-charcoal')}>$</span>
          <span className={cn('text-5xl font-extrabold leading-none', isPopular ? 'text-white' : 'text-charcoal')}>
            {plan.price}
          </span>
          <span className={cn('text-sm mb-1.5 ml-0.5', isPopular ? 'text-white/50' : 'text-muted')}>
            /{plan.period}
          </span>
        </div>

        <hr className={cn('mb-5', isPopular ? 'border-white/20' : 'border-gray-100')} />

        {/* Features — shown when expanded */}
        {expanded && (
          <ul className="space-y-2.5 mb-4">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <Check className={cn('w-4 h-4 flex-shrink-0 mt-0.5', isPopular ? 'text-accent-400' : 'text-primary-600')} />
                <span className={isPopular ? 'text-white/80' : 'text-charcoal'}>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Show More / Less */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-xl mb-4 transition-colors',
            isPopular
              ? 'text-white/70 hover:text-white hover:bg-white/10'
              : 'text-primary-700 hover:text-primary-800 hover:bg-primary-50',
          )}
        >
          {expanded ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show More</>}
        </button>

        {/* CTA */}
        <Link
          href="/list-your-business"
          className={cn(
            'w-full inline-flex items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-all mt-auto',
            isPopular
              ? 'bg-accent-500 hover:bg-accent-400 text-charcoal'
              : 'btn-outline',
          )}
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}

export default function PricingPreviewSection() {
  const [region, setRegion] = useState<'global_north' | 'global_south'>('global_north')
  const plans = PLANS[region]
  const regionInfo = REGIONS[region]

  return (
    <section className="bg-surface-2 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="section-title mb-4">Fair Pricing for a Global Community</h2>
          <p className="text-muted text-sm max-w-2xl mx-auto leading-relaxed">
            We recognise the <strong className="text-charcoal">economic differences between regions</strong>, and
            we believe equitable access is non-negotiable. That&apos;s why we offer{' '}
            <strong className="text-charcoal">tiered pricing</strong>:
          </p>
        </div>

        {/* Region toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-1 gap-1 shadow-sm">
            {(['global_north', 'global_south'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  'px-6 py-2 rounded-xl text-sm font-medium transition-all',
                  region === r ? 'bg-primary-700 text-white shadow-sm' : 'text-muted hover:text-charcoal',
                )}
              >
                {r === 'global_north' ? 'Global North' : 'Global South'}
              </button>
            ))}
          </div>
        </div>

        {/* Region label */}
        <div className="text-center mb-10">
          <h3 className="text-lg font-bold text-charcoal tracking-widest">{regionInfo.label}</h3>
          <p className="text-sm text-muted mt-1">{regionInfo.sub}</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map(plan => <PlanCard key={plan.name} plan={plan} />)}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link href="/pricing" className="btn-outline gap-2">
            View Full Pricing &amp; Compare
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted mt-3">
            Global South pricing available &mdash; up to 60% less than Global North rates
          </p>
        </div>

      </div>
    </section>
  )
}