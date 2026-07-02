import type { Metadata } from 'next'
import { plans } from '@/lib/api'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Affordable plans for Global North and Global South businesses. List your Black or African-owned business today.',
}

export default async function PricingPage() {
  const [northPlans, southPlans] = await Promise.all([
    plans.list('global_north').catch(() => []),
    plans.list('global_south').catch(() => []),
  ])

  return <PricingClient northPlans={northPlans} southPlans={southPlans} />
}
