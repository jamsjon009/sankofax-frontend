import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types'

const FALLBACK_PLANS = [
  {
    name: 'Directory Basic',
    price: '15',
    billing_cycle: 'month',
    features: ['1 Business Listing', 'Basic Profile Page', 'Community Visibility', 'Email Support'],
    popular: false,
  },
  {
    name: 'Directory Pro',
    price: '29',
    billing_cycle: 'month',
    features: ['3 Business Listings', 'Featured Placement', 'Analytics Dashboard', 'Photo Gallery', 'Priority Support'],
    popular: true,
  },
  {
    name: 'Directory Elite',
    price: '99',
    billing_cycle: 'month',
    features: ['Unlimited Listings', 'Premium Placement', 'Advanced Analytics', 'Dedicated Account Manager', 'Custom Brand Page'],
    popular: false,
  },
]

export default function PricingPreviewSection({ plans }: { plans: Plan[] }) {
  const displayPlans = Array.isArray(plans) && plans.length > 0 ? plans : null

  return (
    <section className="bg-surface-2 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Fair Pricing for a Global Community</h2>
          <p className="text-muted text-sm max-w-lg mx-auto">
            Regional pricing for Global North and Global South &mdash; because accessibility matters.
          </p>
        </div>

        {displayPlans ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPlans.slice(0, 3).map((plan, i) => {
              const isPopular = i === 1
              return (
                <div
                  key={plan.id}
                  className={cn(
                    'rounded-2xl p-6 border flex flex-col',
                    isPopular
                      ? 'bg-primary-700 text-white border-primary-600 shadow-xl scale-[1.02]'
                      : 'bg-white border-gray-100 shadow-card',
                  )}
                >
                  <h3 className={cn('font-bold text-lg', isPopular ? 'text-white' : 'text-charcoal')}>{plan.name}</h3>
                  <div className="mt-3 mb-5">
                    <span className={cn('text-3xl font-bold', isPopular ? 'text-white' : 'text-charcoal')}>${plan.price}</span>
                    <span className={cn('text-xs ml-1', isPopular ? 'text-white/60' : 'text-muted')}>/{plan.billing_cycle}</span>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {(plan.features_list ?? []).slice(0, 4).map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm">
                        <Check className={cn('w-3.5 h-3.5 flex-shrink-0', isPopular ? 'text-accent-400' : 'text-primary-600')} />
                        <span className={isPopular ? 'text-white/80' : 'text-charcoal'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FALLBACK_PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={cn(
                  'rounded-2xl p-6 border flex flex-col',
                  plan.popular
                    ? 'bg-primary-700 text-white border-primary-600 shadow-xl scale-[1.02]'
                    : 'bg-white border-gray-100 shadow-card',
                )}
              >
                <h3 className={cn('font-bold text-lg', plan.popular ? 'text-white' : 'text-charcoal')}>{plan.name}</h3>
                <div className="mt-3 mb-5">
                  <span className={cn('text-3xl font-bold', plan.popular ? 'text-white' : 'text-charcoal')}>${plan.price}</span>
                  <span className={cn('text-xs ml-1', plan.popular ? 'text-white/60' : 'text-muted')}>/{plan.billing_cycle}</span>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <Check className={cn('w-3.5 h-3.5 flex-shrink-0', plan.popular ? 'text-accent-400' : 'text-primary-600')} />
                      <span className={plan.popular ? 'text-white/80' : 'text-charcoal'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/pricing" className="btn-primary gap-2">
            View All Plans &amp; Compare
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted mt-3">Global South pricing also available &mdash; up to 60% less</p>
        </div>
      </div>
    </section>
  )
}