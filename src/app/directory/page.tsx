import type { Metadata } from 'next'
import { categories, listings, badges } from '@/lib/api'
import DirectoryClient from './DirectoryClient'

export const metadata: Metadata = {
  title: 'Directory',
  description: 'Search Black-owned and African businesses worldwide by category, city, or type.',
}

interface SearchParams {
  q?: string
  category?: string
  city?: string
  country?: string
  price_range?: string
  amenities?: string
  badges?: string
  min_rating?: string
  featured?: string
  ordering?: string
  page?: string
}

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams

  const [cats, badgeList, data] = await Promise.all([
    categories.list().catch(() => []),
    badges.list().catch(() => []),
    listings.list({
      q: sp.q,
      category: sp.category,
      city: sp.city,
      country: sp.country,
      price_range: sp.price_range,
      amenities: sp.amenities,
      badges: sp.badges,
      min_rating: sp.min_rating ? Number(sp.min_rating) : undefined,
      featured: sp.featured === 'true' ? true : undefined,
      ordering: sp.ordering,
      page: sp.page ? Number(sp.page) : 1,
    }).catch(() => ({ count: 0, next: null, previous: null, results: [] })),
  ])

  return <DirectoryClient categories={cats} badges={badgeList} data={data} initialFilters={sp as Record<string, string | undefined>} />
}
