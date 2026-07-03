import type { Metadata } from 'next'
import EventsClient from './EventsClient'

export const metadata: Metadata = {
  title: 'Events | SankofaX',
  description: 'Discover Black and African cultural events, conferences, and community gatherings near you.',
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function getEvents(searchParams: Record<string, string>) {
  try {
    const params = new URLSearchParams(searchParams)
    const res = await fetch(`${BASE}/events/?${params}`, { next: { revalidate: 300 } })
    if (!res.ok) return { results: [], count: 0, next: null, previous: null }
    return res.json()
  } catch {
    return { results: [], count: 0, next: null, previous: null }
  }
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams
  const data = await getEvents(sp)
  return <EventsClient data={data} initialFilters={sp} />
}
