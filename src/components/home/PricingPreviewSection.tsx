'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types'
import { region as regionApi, type HomeContent } from '@/lib/api'

const REGIONS = {
  global_north: { label: 'GLOBAL NORTH', sub: '(United States, UK, Canada, EU, Australia, etc.)' },
  global_south: { label: 'GLOBAL SOUTH', sub: '(Africa, Caribbean, Latin America, South & Southeast Asia)' },
}

interface Props {
  northPlans: Plan[]
  southPlans: Plan[]
  content?: HomeContent | null
}

export default function PricingPreviewSection({ northPlans, southPlans, content }: Props) {
  const [region, setRegion] = useState<'global_north' | 'global_south'>('global_north')

  // Auto-select the visitor's region from their detected location (item #23).
  useEffect(() => {
    regionApi.detect()
      .then(r => { if (r.region) setRegion(r.region) })
      .catch(() => {})
  }, [])

  const plans = region === 'global_north' ? northPlans : southPlans
  const regionInfo = REGIONS[region]

  const title = content?.pricing_title || 'Fair Pricing for a Global Community'
  const subtitle = content?.pricing_subtitle ||
    'We recognise the economic differences between regions, and we believe equitable access is non-negotiable. That’s why we offer tiered pricing.'
  const note = content?.pricing_note || ''

  return (
    <section className="bg-surface-2 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <h2 className="section-title mb-4">{title}</h2>
          <p className="text-muted text-sm max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

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

        <div className="text-center mb-10">
          <h3 className="text-lg font-bold text-charcoal tracking-widest">{regionInfo.label}</h3>
          <p className="text-sm text-muted mt-1">{regionInfo.sub}</p>
          {note && (
            <p className="text-xs text-muted/80 mt-3 max-w-lg mx-auto italic">{note}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const isPopular = plan.tier_level === 2
            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-2xl border flex flex-col relative overflow-hidden transition-all duration-200',
                  isPopular
                    ? 'bg-primary-700 text-white border-primary-600 shadow-xl scale-[1.03]'
                    : 'bg-white text-charcoal border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
                )}
              >
                {isPopular && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 bg-accent-500 text-charcoal">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  <h3 className={cn('text-xl font-bold mb-1', isPopular ? 'text-white' : 'text-charcoal')}>
                    {plan.name}
                  </h3>
                  <p className={cn('text-xs leading-snug mb-5', isPopular ? 'text-white/60' : 'text-muted')}>
                    {plan.description}
                  </p>

                  <div className="flex items-end gap-0.5 mb-5">
                    <span className={cn('text-xl font-bold mb-1', isPopular ? 'text-white' : 'text-charcoal')}>$</span>
                    <span className={cn('text-5xl font-extrabold leading-none', isPopular ? 'text-white' : 'text-charcoal')}>
                      {plan.price}
                    </span>
                    <span className={cn('text-sm mb-1.5 ml-0.5', isPopular ? 'text-white/50' : 'text-muted')}>
                      /{plan.billing_cycle === 'monthly' ? 'month' : plan.billing_cycle}
                    </span>
                  </div>

                  <hr className={cn('mb-5', isPopular ? 'border-white/20' : 'border-gray-100')} />

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {(plan.features_list ?? []).map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <Check className={cn('w-4 h-4 flex-shrink-0 mt-0.5', isPopular ? 'text-accent-400' : 'text-primary-600')} />
                        <span className={isPopular ? 'text-white/80' : 'text-charcoal'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/list-your-business"
                    className={cn(
                      'w-full inline-flex items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-all',
                      isPopular ? 'bg-accent-500 hover:bg-accent-400 text-charcoal' : 'btn-outline',
                    )}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

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