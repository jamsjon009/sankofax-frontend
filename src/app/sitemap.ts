import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sankofax.com'
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function fetchAllSlugs(endpoint: string, slugField = 'slug'): Promise<string[]> {
  const slugs: string[] = []
  let url = `${API}/${endpoint}/?page_size=500`
  while (url) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) break
      const data = await res.json()
      slugs.push(...(data.results ?? []).map((item: Record<string, string>) => item[slugField]))
      url = data.next
    } catch {
      break
    }
  }
  return slugs
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listingSlugs, categorySlugs] = await Promise.all([
    fetchAllSlugs('listings'),
    fetchAllSlugs('categories'),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/directory`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ]

  const listingRoutes: MetadataRoute.Sitemap = listingSlugs.map(slug => ({
    url: `${BASE_URL}/listing/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map(slug => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...listingRoutes, ...categoryRoutes]
}
