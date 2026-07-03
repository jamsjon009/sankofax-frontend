'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CreditCard, CheckCircle2, AlertCircle, Zap, ArrowRight, ExternalLink } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { tokenStore } from '@/lib/auth'
import { plans } from '@/lib/api'
import type { Plan } from '@/types'

interface Subscription {
  id: string
  plan: Plan
  status: 'active' | 'past_due' | 'canceled' | 'trialing'
  current_period_end: string
  listings_used: number
  stripe_customer_id?: string
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  trialing: 'bg-blue-50 text-blue-700 border-blue-200',
  past_due: 'bg-amber-50 text-amber-700 border-amber-200',
  canceled: 'bg-gray-50 text-gray-600 border-gray-200',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  trialing: 'Trial',
  past_due: 'Past Due',
  canceled: 'Canceled',
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null)
  const [allPlans, setAllPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) return

    Promise.all([
      fetch(`${BASE}/subscriptions/my/`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null),
      plans.list(token),
    ])
      .then(([subData, plansData]) => {
        setSub(subData)
        setAllPlans(Array.isArray(plansData) ? plansData : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function openPortal() {
    const token = tokenStore.getAccess()
    if (!token) return
    setPortalLoading(true)
    try {
      const res = await fetch(`${BASE}/subscriptions/portal/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.url) window.open(data.url, '_blank')
    } catch {
      alert('Could not open billing portal. Please try again.')
    } finally {
      setPortalLoading(false)
    }
  }

  const upgradePlans = allPlans.filter(p => p.tier_level > (sub?.plan?.tier_level ?? 0) && Number(p.price) > 0)

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Billing & Subscription</h1>
          <p className="text-muted text-sm mt-1">Manage your plan, payments, and invoices</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="card p-6"><div className="skeleton h-24 rounded-xl" /></div>)}
          </div>
        ) : (
          <>
            {/* Current plan */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Current Plan</p>
                  <h2 className="text-xl font-bold text-charcoal">{sub?.plan?.name ?? 'Free'}</h2>
                  {sub && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`badge border text-[10px] font-semibold ${STATUS_STYLES[sub.status]}`}>
                        {STATUS_LABELS[sub.status]}
                      </span>
                      {sub.status === 'active' && (
                        <span className="text-xs text-muted">
                          Renews {new Date(sub.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  {sub?.plan ? (
                    <>
                      <p className="text-2xl font-bold text-charcoal">
                        {sub.plan.currency === 'USD' ? '$' : 'Â£'}{sub.plan.price}
                      </p>
                      <p className="text-xs text-muted">/{sub.plan.billing_cycle}</p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-charcoal">$0</p>
                  )}
                </div>
              </div>

              {/* Usage */}
              <div className="bg-surface-2 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-charcoal">Listings Used</p>
                  <p className="text-sm font-semibold text-charcoal">
                    {sub?.listings_used ?? 0} / {sub?.plan?.max_listings ?? 1}
                  </p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((sub?.listings_used ?? 0) / (sub?.plan?.max_listings ?? 1)) * 100)}%` }}
                  />
                </div>
                {(sub?.listings_used ?? 0) >= (sub?.plan?.max_listings ?? 1) && (
                  <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Limit reached â€” upgrade to add more listings
                  </p>
                )}
              </div>

              {/* Features */}
              {sub?.plan?.features_list && sub.plan.features_list.length > 0 && (
                <div className="mt-4 space-y-2">
                  {sub.plan.features_list.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-charcoal">
                      <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              )}

              {/* Portal button */}
              {sub && sub.status !== 'canceled' && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={openPortal}
                    disabled={portalLoading}
                    className="btn-outline gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {portalLoading ? 'Openingâ€¦' : 'Manage Billing & Invoices'}
                    <ExternalLink className="w-3.5 h-3.5 text-muted" />
                  </button>
                  <p className="text-xs text-muted mt-2">Update payment method, download invoices, or cancel.</p>
                </div>
              )}
            </div>

            {/* Upgrade options */}
            {upgradePlans.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent-500" />
                  Upgrade Your Plan
                </h3>
                <div className="space-y-3">
                  {upgradePlans.slice(0, 3).map(plan => (
                    <UpgradeCard key={plan.id} plan={plan} />
                  ))}
                </div>
                <Link href="/pricing" className="text-sm text-primary-700 hover:underline flex items-center gap-1 mt-3">
                  Compare all plans <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* No subscription CTA */}
            {!sub && (
              <div className="card p-6 text-center border-2 border-dashed border-primary-200">
                <Zap className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-charcoal mb-1">Unlock the full platform</h2>
                <p className="text-sm text-muted mb-5">
                  Get a paid plan to list more businesses, add photos, and reach the diaspora community.
                </p>
                <Link href="/pricing" className="btn-primary gap-2 inline-flex">
                  View Plans <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  )
}

function UpgradeCard({ plan }: { plan: Plan }) {
  const [loading, setLoading] = useState(false)

  async function checkout() {
    const token = tokenStore.getAccess()
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/subscriptions/checkout/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: plan.id }),
      })
      const data = await res.json()
      if (data.checkout_url) window.location.href = data.checkout_url
    } catch {
      alert('Could not start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-charcoal text-sm">{plan.name}</p>
        <p className="text-xs text-muted mt-0.5">Up to {plan.max_listings} listing{plan.max_listings !== 1 ? 's' : ''}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-charcoal">
          {plan.currency === 'USD' ? '$' : 'Â£'}{plan.price}
          <span className="text-xs font-normal text-muted">/{plan.billing_cycle}</span>
        </p>
      </div>
      <button
        onClick={checkout}
        disabled={loading}
        className="btn-primary text-sm px-4 py-2 gap-1.5 flex-shrink-0"
      >
        {loading ? 'Loadingâ€¦' : 'Upgrade'}
        {!loading && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}
