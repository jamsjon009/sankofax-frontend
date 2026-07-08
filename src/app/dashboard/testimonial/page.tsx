'use client'

import { useState, useEffect } from 'react'
import { MessageSquareQuote, CheckCircle, Clock, XCircle } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { tokenStore } from '@/lib/auth'
import { testimonials, type MyTestimonial } from '@/lib/api'

const STATUS_UI = {
  pending: { label: 'Pending Review', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  approved: { label: 'Approved — Live on Homepage', icon: CheckCircle, color: 'text-green-700 bg-green-50 border-green-200' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
}

export default function TestimonialPage() {
  const [existing, setExisting] = useState<MyTestimonial | null | undefined>(undefined)
  const [body, setBody] = useState('')
  const [role, setRole] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) return
    testimonials.my(token).then(setExisting).catch(() => setExisting(null))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = tokenStore.getAccess()
    if (!token) return
    setError('')
    setSubmitting(true)
    try {
      await testimonials.submit(token, body, role)
      setSuccess(true)
      const updated = await testimonials.my(token)
      setExisting(updated)
    } catch (err: unknown) {
      const msg = (err as { data?: { detail?: string; body?: string[] } })?.data
      setError(msg?.detail ?? msg?.body?.[0] ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const statusInfo = existing ? STATUS_UI[existing.status] : null
  const StatusIcon = statusInfo?.icon

  return (
    <DashboardShell>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Share Your Experience</h1>
          <p className="text-muted text-sm mt-1">
            Your testimonial will appear on the homepage after staff review.
          </p>
        </div>

        {/* Existing testimonial */}
        {existing && (
          <div className="card p-5 space-y-3">
            <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusInfo!.color}`}>
              {StatusIcon && <StatusIcon className="w-3.5 h-3.5" />}
              {statusInfo!.label}
            </div>
            <blockquote className="text-sm text-charcoal leading-relaxed border-l-4 border-primary-200 pl-4 italic">
              &ldquo;{existing.body}&rdquo;
            </blockquote>
            <p className="text-xs text-muted">{existing.role}</p>
            {existing.status === 'rejected' && (
              <p className="text-xs text-red-600">
                Your testimonial was not approved. You may submit a new one below.
              </p>
            )}
          </div>
        )}

        {/* Form — show if no existing, or if rejected */}
        {(existing === null || existing?.status === 'rejected') && !success && (
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareQuote className="w-5 h-5 text-primary-700" />
              <span className="font-semibold text-charcoal">Write your testimonial</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Your message <span className="text-muted">({body.length}/500)</span>
              </label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={4}
                maxLength={500}
                required
                placeholder="Tell us how SankofaX helped you or your business…"
                className="input w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Your role / location</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                required
                maxLength={150}
                placeholder="e.g. Business Owner – Accra, Ghana"
                className="input w-full"
              />
              <p className="text-[11px] text-muted mt-1">This is shown under your name on the homepage.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Submitting…' : 'Submit for Review'}
            </button>
          </form>
        )}

        {success && (
          <div className="card p-6 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
            <p className="font-semibold text-charcoal">Submitted successfully!</p>
            <p className="text-sm text-muted">Our team will review and publish it shortly.</p>
          </div>
        )}

        {existing?.status === 'pending' && (
          <p className="text-xs text-muted text-center">
            You already have a testimonial pending review. We&apos;ll notify you once it&apos;s approved.
          </p>
        )}
      </div>
    </DashboardShell>
  )
}
