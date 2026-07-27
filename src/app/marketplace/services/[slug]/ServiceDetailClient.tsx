'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Globe, MapPin, Store, CalendarClock, Loader2, CheckCircle2 } from 'lucide-react'
import type { Service } from '@/types'
import { marketplace } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { apiError } from '@/lib/utils'

export default function ServiceDetailClient({ service }: { service: Service }) {
  const { user } = useAuth()
  const [when, setWhen] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<null | string>(null)  // booking number for a free request

  const free = !service.price || Number(service.price) === 0

  async function submit() {
    const token = tokenStore.getAccess()
    if (!token) return
    if (!when) { setError('Please choose a date and time.'); return }
    setBusy(true); setError('')
    try {
      const { checkout_url, booking } = await marketplace.book(token, {
        service: service.slug,
        scheduled_for: new Date(when).toISOString(),
        contact_name: name || user?.email?.split('@')[0] || 'Customer',
        contact_email: email || user?.email || '',
        note,
      })
      if (checkout_url) {
        window.location.href = checkout_url
      } else {
        setDone(booking.booking_number)
        setBusy(false)
      }
    } catch (e) {
      setError(apiError(e, 'Could not create booking.'))
      setBusy(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/marketplace/services" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Link href={`/company/${service.company_slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline mb-2">
            <Store className="w-4 h-4" /> {service.company_name}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-4">{service.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal mb-6">
            <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-primary-600" /> {service.duration_minutes} minutes</span>
            <span className="inline-flex items-center gap-2">
              {service.is_virtual
                ? <><Globe className="w-4 h-4 text-primary-600" /> Online session</>
                : <><MapPin className="w-4 h-4 text-primary-600" /> {service.location || 'In person'}</>}
            </span>
          </div>
          <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">{service.description}</p>
        </div>

        {/* Booking card */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 card p-6">
            <div className="flex items-center justify-between mb-4">
              {free
                ? <span className="text-lg font-bold text-green-700">Free booking</span>
                : <span className="text-lg font-bold text-charcoal">{service.currency} {service.price}</span>}
              <span className="text-xs text-muted">{service.duration_minutes} min</span>
            </div>

            {done ? (
              <div className="text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-charcoal">Booking request sent</p>
                <p className="text-xs text-muted mt-1">Reference {done}. The business will confirm your slot shortly.</p>
                <Link href="/dashboard/bookings" className="btn-outline w-full mt-4 text-sm">View my bookings</Link>
              </div>
            ) : !user ? (
              <div className="text-center">
                <p className="text-sm text-muted mb-3">Sign in to book this service.</p>
                <Link href={`/login?next=/marketplace/services/${service.slug}`} className="btn-primary w-full">Sign in to book</Link>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-muted">Preferred date &amp; time</span>
                  <input type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} className="input mt-1" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="input" />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder={user.email} className="input" />
                </div>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                  placeholder="Anything the business should know?" className="input resize-none" />

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button onClick={submit} disabled={busy} className="btn-primary w-full gap-2">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarClock className="w-4 h-4" />}
                  {free ? 'Request booking' : busy ? 'Redirecting to checkout…' : `Pay & book · ${service.currency} ${service.price}`}
                </button>
                <p className="text-[11px] text-muted text-center">
                  {free ? 'Free — the business confirms your slot.' : 'Secure payment by card via Stripe.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
