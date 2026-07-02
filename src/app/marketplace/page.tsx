import type { Metadata } from 'next'
import MarketplaceClient from './MarketplaceClient'

export const metadata: Metadata = {
  title: 'Marketplace | SankofaX',
  description: 'Shop Black and African-owned products â€” fashion, food, beauty, art and more.',
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

async function getProducts(searchParams: Record<string, string>) {
  const params = new URLSearchParams(searchParams)
  const res = await fetch(`${BASE}/marketplace/?${params}`, { next: { revalidate: 300 } })
  if (!res.ok) return { results: [], count: 0, next: null, previous: null }
  return res.json()
}

export default async function MarketplacePage({ searchParams }: { searchParams: Record<string, string> }) {
  const sp = await searchParams
  const data = await getProducts(sp)
  return <MarketplaceClient data={data} initialFilters={sp} />
}
