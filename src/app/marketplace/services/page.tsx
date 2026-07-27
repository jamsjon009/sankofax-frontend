import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Clock, Globe, MapPin, CalendarClock } from 'lucide-react'
import type { PaginatedResponse, Service } from '@/types'

export const metadata: Metadata = {
  title: 'Book a Service | SankofaX',
  description: 'Book consultations, sessions and services from Black and African-owned businesses.',
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function getServices(): Promise<PaginatedResponse<Service>> {
  try {
    const res = await fetch(`${BASE}/marketplace/services/`, { next: { revalidate: 300 } })
    if (!res.ok) return { results: [], count: 0, next: null, previous: null }
    return res.json()
  } catch {
    return { results: [], count: 0, next: null, previous: null }
  }
}

export default async function ServicesPage() {
  const data = await getServices()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to marketplace
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">Book a Service</h1>
        <p className="text-muted">Consultations, sessions and bookings from Black &amp; African-owned businesses</p>
      </div>

      {data.results.length === 0 ? (
        <div className="text-center py-20">
          <CalendarClock className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-charcoal mb-2">No services yet</h3>
          <p className="text-muted text-sm">Bookable services are being added — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.results.map(s => {
            const free = !s.price || Number(s.price) === 0
            return (
              <Link key={s.id} href={`/marketplace/services/${s.slug}`}
                className="card p-6 flex flex-col group hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-primary-700 mb-1">{s.company_name}</p>
                <h3 className="font-bold text-charcoal mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">{s.name}</h3>
                <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">{s.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-4">
                  <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {s.duration_minutes} min</span>
                  <span className="inline-flex items-center gap-1.5">
                    {s.is_virtual ? <><Globe className="w-3.5 h-3.5" /> Online</> : <><MapPin className="w-3.5 h-3.5" /> {s.location || 'In person'}</>}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  {free
                    ? <span className="text-sm font-semibold text-green-700">Free booking</span>
                    : <span className="text-lg font-bold text-charcoal">{s.currency} {s.price}</span>}
                  <span className="btn-primary text-xs px-3 py-1.5 gap-1.5 pointer-events-none">
                    <CalendarClock className="w-3.5 h-3.5" /> Book
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
