import type { Metadata } from 'next'
import MarketplaceClient from './MarketplaceClient'

export const metadata: Metadata = {
  title: 'Marketplace | SankofaX',
  description: 'Shop Black and African-owned products â€” fashion, food, beauty, art and more.',
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function getProducts(searchParams: Record<string, string>) {
  try {
    const params = new URLSearchParams(searchParams)
    const res = await fetch(`${BASE}/marketplace/?${params}`, { next: { revalidate: 300 } })
    if (!res.ok) return { results: [], count: 0, next: null, previous: null }
    return res.json()
  } catch {
    return { results: [], count: 0, next: null, previous: null }
  }
}

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams
  const data = await getProducts(sp)
  return <MarketplaceClient data={data} initialFilters={sp} />
}
