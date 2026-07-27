'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Ticket, Calendar, MapPin, Globe, X, Loader2 } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { events } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import type { MyTicket } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_UI: Record<MyTicket['status'], { label: string; cls: string }> = {
  confirmed: { label: 'Confirmed', cls: 'text-green-700 bg-green-50 border-green-200' },
  waitlisted: { label: 'Waitlisted', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  cancelled: { label: 'Cancelled', cls: 'text-red-600 bg-red-50 border-red-200' },
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<MyTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  const load = useCallback(async () => {
    const token = tokenStore.getAccess()
    if (!token) return
    setLoading(true)
    try {
      setTickets(await events.myTickets(token))
    } catch {
      setTickets([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function cancel(t: MyTicket) {
    const token = tokenStore.getAccess()
    if (!token) return
    setCancelling(t.id)
    try {
      await events.cancel(token, t.event.slug)
      await load()
    } catch { /* ignore */ } finally {
      setCancelling(null)
    }
  }

  const now = new Date()

  return (
    <DashboardShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-charcoal mb-1">My Tickets</h1>
        <p className="text-muted text-sm mb-6">Events you’ve registered for on SankofaX.</p>

        {loading ? (
          <div className="space-y-3">
            {[0, 1].map(i => <div key={i} className="skeleton h-28 w-full rounded-xl" />)}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-muted text-sm mb-4">You haven’t registered for any events yet.</p>
            <Link href="/events" className="btn-primary text-sm">Browse events</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(t => {
              const s = STATUS_UI[t.status]
              const start = new Date(t.event.start_datetime)
              const isPast = start < now
              return (
                <div key={t.id} className="card p-4 flex gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0 hidden sm:block">
                    {t.event.cover_image ? (
                      <Image src={t.event.cover_image} alt={t.event.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🎉</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/events/${t.event.slug}`} className="font-bold text-charcoal hover:text-primary-700 line-clamp-1">
                        {t.event.title}
                      </Link>
                      <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0', s.cls)}>
                        {s.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mt-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}
                        {start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        {t.event.is_virtual
                          ? <><Globe className="w-3.5 h-3.5" /> Online</>
                          : <><MapPin className="w-3.5 h-3.5" /> {t.event.venue_name || t.event.city}, {t.event.country}</>}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-3">
                      <div className="text-xs">
                        <span className="font-mono font-bold text-charcoal tracking-wider">{t.ticket_code}</span>
                        <span className="text-muted"> · {t.quantity} {t.quantity === 1 ? 'ticket' : 'tickets'}</span>
                        {t.checked_in && <span className="text-green-700 font-medium"> · Checked in</span>}
                      </div>
                      {!isPast && (
                        <button onClick={() => cancel(t)} disabled={cancelling === t.id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors">
                          {cancelling === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
