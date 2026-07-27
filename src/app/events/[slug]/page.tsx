import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { EventItem } from '@/types'
import EventDetailClient from './EventDetailClient'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function getEvent(slug: string): Promise<EventItem | null> {
  try {
    const res = await fetch(`${BASE}/events/${slug}/`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: 'Event | SankofaX' }
  return {
    title: `${event.title} | SankofaX`,
    description: event.description?.slice(0, 160),
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()
  return <EventDetailClient event={event} />
}
