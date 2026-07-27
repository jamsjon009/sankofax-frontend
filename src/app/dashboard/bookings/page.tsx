'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalendarClock, Store, User, CheckCircle2, Check, X, Clock } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { marketplace } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import type { ServiceBooking, BookingStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_UI: Record<BookingStatus, { label: string; cls: string }> = {
  pending_payment: { label: 'Awaiting payment', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  pending: { label: 'Pending confirmation', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  confirmed: { label: 'Confirmed', cls: 'text-green-700 bg-green-50 border-green-200' },
  completed: { label: 'Completed', cls: 'text-primary-700 bg-primary-50 border-primary-200' },
  declined: { label: 'Declined', cls: 'text-red-600 bg-red-50 border-red-200' },
  cancelled: { label: 'Cancelled', cls: 'text-gray-600 bg-gray-50 border-gray-200' },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function BookingsInner() {
  const search = useSearchParams()
  const justPaid = search.get('success')
  const [role, setRole] = useState<'customer' | 'seller'>('customer')
  const [bookings, setBookings] = useState<ServiceBooking[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (r: 'customer' | 'seller') => {
    const token = tokenStore.getAccess()
    if (!token) return
    setLoading(true)
    try {
      setBookings(await marketplace.bookings(token, r))
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(role) }, [role, load])

  async function setStatus(b: ServiceBooking, status: BookingStatus) {
    const token = tokenStore.getAccess()
    if (!token) return
    setBookings(prev => prev.map(x => (x.id === b.id ? { ...x, status } : x)))
    await marketplace.updateBooking(token, b.booking_number, status).catch(() => load(role))
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-charcoal mb-1">Bookings</h1>
        <p className="text-muted text-sm mb-6">Services you’ve booked, and bookings for your business.</p>

        {justPaid && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 mb-6 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4" /> Payment complete — booking {justPaid} is confirmed.
          </div>
        )}

        <div className="flex gap-1 mb-6 border-b border-gray-100">
          {([['customer', 'My Bookings', User], ['seller', 'For My Business', Store]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setRole(key)}
              className={cn('flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                role === key ? 'border-primary-700 text-primary-700' : 'border-transparent text-muted hover:text-charcoal')}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[0, 1].map(i => <div key={i} className="skeleton h-24 w-full rounded-xl" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <CalendarClock className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-muted text-sm">{role === 'customer' ? 'No bookings yet.' : 'No bookings for your business yet.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const s = STATUS_UI[b.status]
              const free = !b.total || Number(b.total) === 0
              return (
                <div key={b.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-muted">{b.booking_number}</p>
                      <p className="font-semibold text-charcoal">{b.service_name}</p>
                      <p className="text-sm text-muted">
                        {role === 'customer' ? b.company_name : b.contact_name}
                      </p>
                    </div>
                    <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border', s.cls)}>{s.label}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mt-3">
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {fmt(b.scheduled_for)}</span>
                    <span className="font-semibold text-charcoal">{free ? 'Free' : `${b.currency} ${b.total}`}</span>
                  </div>
                  {b.note && <p className="text-xs text-muted mt-2 italic">“{b.note}”</p>}

                  {role === 'seller' && (b.status === 'pending' || b.status === 'confirmed') && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => setStatus(b, 'confirmed')} className="btn-primary text-xs gap-1.5 py-1.5">
                            <Check className="w-3.5 h-3.5" /> Confirm
                          </button>
                          <button onClick={() => setStatus(b, 'declined')} className="btn-outline text-xs gap-1.5 py-1.5 text-red-600 border-red-200 hover:bg-red-50">
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => setStatus(b, 'completed')} className="btn-outline text-xs gap-1.5 py-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark completed
                        </button>
                      )}
                    </div>
                  )}
                  {role === 'customer' && (b.status === 'pending' || b.status === 'confirmed') && (
                    <div className="mt-4">
                      <button onClick={() => setStatus(b, 'cancelled')} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors">
                        <X className="w-3.5 h-3.5" /> Cancel booking
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

export default function BookingsPage() {
  return (
    <Suspense fallback={null}>
      <BookingsInner />
    </Suspense>
  )
}
