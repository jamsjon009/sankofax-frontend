'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import type { Plan } from '@/types'
import { cn } from '@/lib/utils'

export default function PricingClient({ northPlans, southPlans }: { northPlans: Plan[]; southPlans: Plan[] }) {
  const [region, setRegion] = useState<'global_north' | 'global_south'>('global_north')
  const displayPlans = region === 'global_north' ? northPlans : southPlans

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-charcoal mb-3">Simple, Fair Pricing</h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Regional pricing for the diaspora — wherever you are in the world.
        </p>

        {/* Region toggle */}
        <div className="mt-8 inline-flex bg-surface-2 border border-gray-200 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setRegion('global_north')}
            className={cn('px-5 py-2 rounded-xl text-sm font-medium transition-all', region === 'global_north' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal')}
          >
            🌎 Global North
          </button>
          <button
            onClick={() => setRegion('global_south')}
            className={cn('px-5 py-2 rounded-xl text-sm font-medium transition-all', region === 'global_south' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal')}
          >
            🌍 Global South
          </button>
        </div>
        {region === 'global_south' && (
          <p className="mt-3 text-sm text-primary-600 font-medium">
            ✓ Lower prices for African, Caribbean & South American businesses
          </p>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayPlans.map((plan, i) => {
          const isPopular = i === 1
          return (
            <div
              key={plan.id}
              className={cn(
                'rounded-2xl p-7 border flex flex-col',
                isPopular
                  ? 'bg-primary-700 text-white border-primary-600 shadow-card-lg scale-[1.03]'
                  : 'bg-white text-charcoal border-gray-100 shadow-card',
              )}
            >
              {isPopular && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Zap className="w-3.5 h-3.5 text-accent-400" />
                  <span className="text-xs font-semibold text-accent-300 uppercase tracking-wider">Most Popular</span>
                </div>
              )}
              <h3 className={cn('text-xl font-bold', isPopular ? 'text-white' : 'text-charcoal')}>{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className={cn('text-4xl font-bold', isPopular ? 'text-white' : 'text-charcoal')}>
                  ${plan.price}
                </span>
                <span className={cn('text-sm ml-1', isPopular ? 'text-white/60' : 'text-muted')}>
                  /{plan.billing_cycle}
                </span>
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features_list.map(feature => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={cn('w-4 h-4 flex-shrink-0 mt-0.5', isPopular ? 'text-accent-400' : 'text-primary-600')} />
                    <span className={isPopular ? 'text-white/80' : 'text-charcoal'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/list-your-business"
                className={cn(
                  'mt-8 w-full justify-center rounded-xl py-2.5 text-sm font-semibold text-center transition-all',
                  isPopular
                    ? 'bg-accent-500 text-charcoal hover:bg-accent-400'
                    : 'btn-outline',
                )}
              >
                Get Started
              </Link>
            </div>
          )
        })}
      </div>

      {/* Compare table */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-charcoal text-center mb-6">Feature Comparison</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-charcoal">Feature</th>
                {displayPlans.map(p => (
                  <th key={p.id} className="px-5 py-3 text-center font-semibold text-charcoal">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Listings', key: 'max_listings', format: (v: unknown) => String(v) },
                { label: 'Featured Slots', key: 'featured_listing_slots', format: (v: unknown) => String(v) },
                { label: 'Analytics', key: 'analytics_access', format: (v: unknown) => v ? '✓' : '–' },
                { label: 'Priority Support', key: 'priority_support', format: (v: unknown) => v ? '✓' : '–' },
              ].map(row => (
                <tr key={row.label} className="border-b border-gray-50 even:bg-surface-2/50">
                  <td className="px-5 py-3 text-charcoal">{row.label}</td>
                  {displayPlans.map(p => (
                    <td key={p.id} className="px-5 py-3 text-center text-muted">
                      {row.format(p[row.key as keyof Plan])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-14 text-center">
        <p className="text-muted text-sm">
          Questions?{' '}
          <Link href="/contact" className="text-primary-700 font-medium hover:underline">Contact us</Link>
          {' '}or{' '}
          <Link href="/faqs" className="text-primary-700 font-medium hover:underline">read our FAQs</Link>.
        </p>
      </div>
    </div>
  )
}
