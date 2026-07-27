import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Service } from '@/types'
import ServiceDetailClient from './ServiceDetailClient'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function getService(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${BASE}/marketplace/services/${slug}/`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return { title: 'Service | SankofaX' }
  return { title: `${service.name} | SankofaX`, description: service.description?.slice(0, 160) }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()
  return <ServiceDetailClient service={service} />
}
