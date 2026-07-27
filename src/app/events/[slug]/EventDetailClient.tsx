'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar, Clock, MapPin, Globe, Ticket, Users, Check, X, Loader2,
  ArrowLeft, CheckCircle2, ChevronDown, UserCheck,
} from 'lucide-react'
import type { EventItem, EventRegistration, AttendeeList } from '@/types'
import { events } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function EventDetailClient({ event: initial }: { event: EventItem }) {
  const { user } = useAuth()
  const [event, setEvent] = useState<EventItem>(initial)
  const isPast = new Date(event.start_datetime) < new Date()

  // Re-fetch with the user's token so `my_registration` reflects the logged-in user.
  const reload = useCallback(async () => {
    const token = tokenStore.getAccess()
    try {
      const fresh = await events.get(event.slug, token)
      setEvent(fresh)
    } catch { /* keep current */ }
  }, [event.slug])

  useEffect(() => { if (user) reload() }, [user, reload])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main */}
        <div className="lg:col-span-8">
          <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-surface-2 mb-6">
            {event.cover_image ? (
              <Image src={event.cover_image} alt={event.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🎉</div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              {event.is_virtual && (
                <span className="badge bg-blue-600 text-white text-[11px] font-semibold">Virtual</span>
              )}
              {isPast && <span className="badge bg-gray-800/80 text-white text-[11px]">Past event</span>}
            </div>
          </div>

          <p className="text-sm font-semibold text-primary-700 mb-2">{event.organizer_name}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal mb-6">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-600" /> {fmtDate(event.start_datetime)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-600" />
              {fmtTime(event.start_datetime)} – {fmtTime(event.end_datetime)}
            </span>
            <span className="inline-flex items-center gap-2">
              {event.is_virtual
                ? <><Globe className="w-4 h-4 text-primary-600" /> Online event</>
                : <><MapPin className="w-4 h-4 text-primary-600" /> {[event.venue_name, event.city, event.country].filter(Boolean).join(', ')}</>}
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-charcoal whitespace-pre-line leading-relaxed">
            {event.description}
          </div>

          {user && <OrganizerPanel slug={event.slug} />}
        </div>

        {/* RSVP sidebar */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <RsvpCard event={event} user={user} isPast={isPast} onChange={reload} />
          </div>
        </div>
      </div>
    </div>
  )
}

const STATUS_UI: Record<EventRegistration['status'], { label: string; cls: string }> = {
  confirmed: { label: 'Confirmed', cls: 'text-green-700 bg-green-50 border-green-200' },
  waitlisted: { label: 'Waitlisted', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  cancelled: { label: 'Cancelled', cls: 'text-red-600 bg-red-50 border-red-200' },
}

function RsvpCard({
  event, user, isPast, onChange,
}: {
  event: EventItem
  user: ReturnType<typeof useAuth>['user']
  isPast: boolean
  onChange: () => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const reg = event.my_registration
  const priceLabel = event.ticket_price && Number(event.ticket_price) > 0
    ? `${event.currency} ${event.ticket_price}`
    : 'Free'

  async function doRegister() {
    const token = tokenStore.getAccess()
    if (!token) return
    setBusy(true); setError('')
    try {
      await events.register(token, event.slug, { quantity, note })
      onChange()
    } catch (e) {
      setError((e as { data?: Record<string, unknown> })?.data
        ? String((e as { data: { detail?: string } }).data.detail ?? (e as Error).message)
        : (e as Error).message)
    } finally { setBusy(false) }
  }

  async function doCancel() {
    const token = tokenStore.getAccess()
    if (!token) return
    setBusy(true); setError('')
    try {
      await events.cancel(token, event.slug)
      onChange()
    } catch (e) {
      setError((e as Error).message)
    } finally { setBusy(false) }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-charcoal">{priceLabel}</span>
        {event.capacity != null && !reg && (
          <span className={cn(
            'text-xs font-semibold px-2.5 py-1 rounded-full border',
            event.is_full ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-green-700 bg-green-50 border-green-200',
          )}>
            {event.is_full ? 'Full' : `${event.spots_left} spot${event.spots_left === 1 ? '' : 's'} left`}
          </span>
        )}
      </div>

      {/* Already registered */}
      {reg ? (
        <div>
          <div className="rounded-xl border border-gray-200 p-4 bg-surface-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Your ticket</span>
              <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border', STATUS_UI[reg.status].cls)}>
                {STATUS_UI[reg.status].label}
              </span>
            </div>
            <p className="font-mono text-lg font-bold text-charcoal tracking-wider">{reg.ticket_code}</p>
            <p className="text-xs text-muted mt-1">
              {reg.quantity} {reg.quantity === 1 ? 'ticket' : 'tickets'}
              {reg.checked_in && <span className="text-green-700 font-medium"> · Checked in</span>}
            </p>
            {reg.status === 'waitlisted' && (
              <p className="text-xs text-amber-700 mt-2">
                You’re on the waitlist — we’ll confirm your spot if one frees up.
              </p>
            )}
          </div>
          {!isPast && (
            <button onClick={doCancel} disabled={busy}
              className="btn-outline w-full mt-3 text-sm gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Cancel my RSVP
            </button>
          )}
          <Link href="/dashboard/tickets" className="block text-center text-xs text-primary-700 hover:underline mt-3">
            View all my tickets
          </Link>
        </div>
      ) : isPast ? (
        <p className="text-sm text-muted text-center py-2">This event has already taken place.</p>
      ) : !event.rsvp_enabled ? (
        // External ticketing fallback
        event.ticket_url ? (
          <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full gap-1.5">
            <Ticket className="w-4 h-4" /> Get Tickets
          </a>
        ) : (
          <p className="text-sm text-muted text-center py-2">Registration is not available for this event.</p>
        )
      ) : !event.registration_open ? (
        <p className="text-sm text-muted text-center py-2">Registration for this event is closed.</p>
      ) : !user ? (
        <div className="text-center">
          <p className="text-sm text-muted mb-3">Sign in to reserve your spot.</p>
          <Link href={`/login?next=/events/${event.slug}`} className="btn-primary w-full">Sign in to RSVP</Link>
        </div>
      ) : (
        // RSVP form
        <div className="space-y-3">
          {event.is_full && event.allow_waitlist && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              This event is full. Register to join the waitlist.
            </p>
          )}
          <label className="block">
            <span className="text-xs font-medium text-muted">Tickets</span>
            <select value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="input mt-1">
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted">Note to organizer (optional)</span>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              placeholder="Accessibility needs, dietary requirements…" className="input mt-1 resize-none" />
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button onClick={doRegister} disabled={busy} className="btn-primary w-full gap-1.5">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" />
              : event.is_full ? <Users className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {event.is_full && event.allow_waitlist ? 'Join the waitlist' : 'RSVP now'}
          </button>
          <p className="text-[11px] text-muted text-center">
            Closes {fmtDate(event.registration_closes_at)}
          </p>
        </div>
      )}
    </div>
  )
}

/** Organizer-only attendee management. Silently hidden if the user isn't the organizer. */
function OrganizerPanel({ slug }: { slug: string }) {
  const [data, setData] = useState<AttendeeList | null>(null)
  const [open, setOpen] = useState(false)
  const [allowed, setAllowed] = useState(false)

  const load = useCallback(async () => {
    const token = tokenStore.getAccess()
    if (!token) return
    try {
      const res = await events.attendees(token, slug)
      setData(res); setAllowed(true)
    } catch {
      setAllowed(false)
    }
  }, [slug])

  useEffect(() => { load() }, [load])

  async function toggleCheckIn(reg: EventRegistration) {
    const token = tokenStore.getAccess()
    if (!token) return
    await events.checkIn(token, slug, reg.id, !reg.checked_in).catch(() => {})
    load()
  }

  if (!allowed || !data) return null

  return (
    <div className="mt-10 border-t border-gray-100 pt-6">
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full text-left">
        <div>
          <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary-600" /> Attendees
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {data.confirmed_count} confirmed
            {data.capacity != null && ` / ${data.capacity}`}
            {data.waitlist_count > 0 && ` · ${data.waitlist_count} on waitlist`}
          </p>
        </div>
        <ChevronDown className={cn('w-5 h-5 text-muted transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="mt-4 overflow-x-auto">
          {data.attendees.length === 0 ? (
            <p className="text-sm text-muted py-4">No registrations yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted border-b border-gray-100">
                  <th className="py-2 pr-4 font-medium">Attendee</th>
                  <th className="py-2 pr-4 font-medium">Qty</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Ticket</th>
                  <th className="py-2 font-medium">Check-in</th>
                </tr>
              </thead>
              <tbody>
                {data.attendees.map(a => (
                  <tr key={a.id} className="border-b border-gray-50">
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-charcoal">{a.name}</p>
                      <p className="text-xs text-muted">{a.email}</p>
                      {a.note && <p className="text-xs text-muted italic mt-0.5">“{a.note}”</p>}
                    </td>
                    <td className="py-2.5 pr-4">{a.quantity}</td>
                    <td className="py-2.5 pr-4">
                      <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border', STATUS_UI[a.status].cls)}>
                        {STATUS_UI[a.status].label}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{a.ticket_code}</td>
                    <td className="py-2.5">
                      {a.status === 'confirmed' ? (
                        <button onClick={() => toggleCheckIn(a)}
                          className={cn(
                            'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors',
                            a.checked_in
                              ? 'text-green-700 bg-green-50 border-green-200'
                              : 'text-muted border-gray-200 hover:border-primary-300',
                          )}>
                          <Check className="w-3.5 h-3.5" />
                          {a.checked_in ? 'Checked in' : 'Check in'}
                        </button>
                      ) : <span className="text-xs text-muted">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
