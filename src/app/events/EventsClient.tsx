'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Calendar, Ticket, Globe, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { PaginatedResponse } from '@/types'
import { cn } from '@/lib/utils'

interface Event {
  id: string
  slug: string
  title: string
  description: string
  city: string
  country: string
  venue_name: string
  start_datetime: string
  end_datetime: string
  is_virtual: boolean
  virtual_link: string
  cover_image: string | null
  ticket_url: string
  ticket_price: string | null
  currency: string
  organizer_name: string
  rsvp_enabled?: boolean
  is_full?: boolean
  spots_left?: number | null
}

interface Props {
  data: PaginatedResponse<Event>
  initialFilters: Record<string, string>
}

export default function EventsClient({ data, initialFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [filters, setFilters] = useState<Record<string, string | undefined>>(initialFilters)

  const updateFilters = useCallback((updates: Record<string, string | undefined>) => {
    const next = { ...filters, ...updates, page: undefined }
    setFilters(next)
    const params = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
    startTransition(() => router.push(`${pathname}?${params}`))
  }, [filters, pathname, router])

  const totalPages = Math.ceil(data.count / 12)
  const currentPage = Number(filters.page ?? 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">Community Events</h1>
        <p className="text-muted">Cultural gatherings, conferences, and celebrations across the diaspora</p>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            defaultValue={filters.search}
            placeholder="Search events…"
            className="input pl-10"
            onChange={e => updateFilters({ search: e.target.value || undefined })}
          />
        </div>
        <div className="relative sm:w-52">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            defaultValue={filters.city}
            placeholder="City"
            className="input pl-10"
            onChange={e => updateFilters({ city: e.target.value || undefined })}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer px-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
          <input
            type="checkbox"
            checked={filters.is_virtual === 'true'}
            onChange={e => updateFilters({ is_virtual: e.target.checked ? 'true' : undefined })}
            className="accent-primary-600"
          />
          <span className="text-sm text-charcoal flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-primary-600" /> Virtual only
          </span>
        </label>
      </div>

      {/* Active chips */}
      {Object.entries(filters).some(([k, v]) => v && k !== 'page') && (
        <div className="flex gap-2 flex-wrap mb-5">
          {Object.entries(filters).map(([k, v]) =>
            v && k !== 'page' ? (
              <span key={k} className="badge bg-primary-50 text-primary-700 border border-primary-200 gap-1.5">
                {k}: {v}
                <button onClick={() => updateFilters({ [k]: undefined })}><X className="w-3 h-3" /></button>
              </span>
            ) : null,
          )}
        </div>
      )}

      <p className="text-sm text-muted mb-6">{isPending ? 'Loading…' : `${data.count} events`}</p>

      {data.results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📅</p>
          <h3 className="text-lg font-semibold text-charcoal mb-2">No events found</h3>
          <p className="text-muted text-sm">Check back soon — more events are being added.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.results.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button disabled={currentPage <= 1} onClick={() => updateFilters({ page: String(currentPage - 1) })} className="btn-outline px-3 py-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => updateFilters({ page: String(currentPage + 1) })} className="btn-outline px-3 py-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const start = new Date(event.start_datetime)
  const dateStr = start.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const isPast = start < new Date()

  const priceFree = !event.ticket_price || Number(event.ticket_price) === 0

  return (
    <Link href={`/events/${event.slug}`} className="card overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      {/* Cover */}
      <div className="relative h-44 bg-surface-2 flex-shrink-0">
        {event.cover_image ? (
          <Image src={event.cover_image} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎉</div>
        )}
        {event.is_virtual && (
          <span className="absolute top-3 left-3 badge bg-blue-600 text-white text-[10px] font-semibold">
            Virtual
          </span>
        )}
        {isPast && (
          <span className="absolute top-3 right-3 badge bg-gray-800/80 text-white text-[10px]">Past</span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-primary-700 font-semibold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          {dateStr} · {timeStr}
        </div>

        <h3 className="font-bold text-charcoal text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">{event.title}</h3>

        <div className="flex items-center gap-1 text-xs text-muted mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {event.is_virtual ? 'Online' : `${event.venue_name || event.city}, ${event.country}`}
        </div>

        <p className="text-xs text-muted line-clamp-2 mb-4 flex-1">{event.description}</p>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            {priceFree
              ? <span className="text-sm font-semibold text-green-700">Free</span>
              : <span className="text-sm font-bold text-charcoal">{event.currency} {event.ticket_price}</span>}
            {event.rsvp_enabled && !isPast && event.spots_left != null && (
              <span className="block text-[11px] text-muted mt-0.5">
                {event.is_full ? 'Waitlist open' : `${event.spots_left} spot${event.spots_left === 1 ? '' : 's'} left`}
              </span>
            )}
          </div>
          {!isPast && (
            <span className="btn-primary text-xs px-3 py-1.5 gap-1.5 pointer-events-none">
              <Ticket className="w-3.5 h-3.5" />
              {event.rsvp_enabled ? 'RSVP' : event.ticket_url ? 'Get Tickets' : 'Details'}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
