'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShieldCheck, BadgeCheck, Award, Check, X, Clock, CheckCircle, XCircle, Upload } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import VerificationBadge from '@/components/ui/VerificationBadge'
import { tokenStore } from '@/lib/auth'
import { myCompanies, verification } from '@/lib/api'
import type { CompanyProfile, VerificationStatus } from '@/types'

const TIERS = [
  {
    level: 1,
    name: 'Basic',
    icon: ShieldCheck,
    color: 'text-slate-600',
    blurb: 'Automated checks confirm your profile is complete. Instant — no review needed.',
    requirement: 'A complete profile: website, contact email, logo and description.',
    needsDocs: false,
  },
  {
    level: 2,
    name: 'Verified',
    icon: BadgeCheck,
    color: 'text-primary-700',
    blurb: 'We review ownership / registration documents to confirm the business is genuine.',
    requirement: 'Upload business registration or ownership documents for staff review.',
    needsDocs: true,
  },
  {
    level: 3,
    name: 'Certified',
    icon: Award,
    color: 'text-amber-600',
    blurb: 'The highest tier — certified by a SankofaX partner organisation.',
    requirement: 'Upload partner certification documents for review.',
    needsDocs: true,
  },
]

const REQUEST_STATUS_UI = {
  pending: { label: 'Pending review', icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-700 bg-green-50 border-green-200' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
}

function formatDate(d: string | null) {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return null
  }
}

export default function VerificationPage() {
  const [companies, setCompanies] = useState<CompanyProfile[] | undefined>(undefined)
  const [slug, setSlug] = useState<string>('')
  const [status, setStatus] = useState<VerificationStatus | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(false)

  // request form
  const [targetLevel, setTargetLevel] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) return
    myCompanies.list(token).then(list => {
      setCompanies(list)
      if (list.length) setSlug(list[0].slug)
    }).catch(() => setCompanies([]))
  }, [])

  const loadStatus = useCallback(async (companySlug: string) => {
    const token = tokenStore.getAccess()
    if (!token || !companySlug) return
    setLoadingStatus(true)
    try {
      setStatus(await verification.status(token, companySlug))
    } catch {
      setStatus(null)
    } finally {
      setLoadingStatus(false)
    }
  }, [])

  useEffect(() => {
    if (slug) loadStatus(slug)
  }, [slug, loadStatus])

  async function submitRequest(level: number) {
    const token = tokenStore.getAccess()
    if (!token || !slug) return
    setError('')
    const tier = TIERS.find(t => t.level === level)
    if (tier?.needsDocs && !file) {
      setError('Please attach a document for this tier.')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('company', slug)
      fd.append('requested_level', String(level))
      if (note) fd.append('note', note)
      if (file) fd.append('documents', file)
      const res = await verification.submit(token, fd)
      setStatus(res.status)
      setTargetLevel(null)
      setFile(null)
      setNote('')
    } catch (err: unknown) {
      const data = (err as { data?: Record<string, unknown> })?.data
      const first = data && (data.detail || data.requested_level || data.documents || data.company)
      setError(typeof first === 'string' ? first : Array.isArray(first) ? String(first[0]) : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  // ---- render states ----
  if (companies === undefined) {
    return <DashboardShell><div className="skeleton h-40 w-full max-w-2xl rounded-2xl" /></DashboardShell>
  }

  if (companies.length === 0) {
    return (
      <DashboardShell>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-charcoal">Verification</h1>
          <div className="card p-6 mt-4 text-center text-muted text-sm">
            You need a business profile before you can request verification.{' '}
            <a href="/dashboard/business/new-listing" className="text-primary-700 font-medium">Create one →</a>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const currentLevel = status?.verification_level ?? 0
  const pending = status?.latest_request?.status === 'pending' ? status.latest_request : null
  const latest = status?.latest_request ?? null

  return (
    <DashboardShell>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Verification</h1>
          <p className="text-muted text-sm mt-1">
            Build trust with a verification badge on all your listings. Three tiers, from an
            instant automated check to full partner certification.
          </p>
        </div>

        {/* Company selector (only when the owner has more than one) */}
        {companies.length > 1 && (
          <select
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="input max-w-xs"
          >
            {companies.map(c => (
              <option key={c.slug} value={c.slug}>{c.company_name}</option>
            ))}
          </select>
        )}

        {loadingStatus || !status ? (
          <div className="skeleton h-32 w-full rounded-2xl" />
        ) : (
          <>
            {/* Current status */}
            <div className="card p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide font-semibold">Current tier</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {currentLevel > 0
                      ? <VerificationBadge level={currentLevel} label={status.verification_label} />
                      : <span className="text-sm font-medium text-muted">Not verified yet</span>}
                  </div>
                </div>
                {currentLevel > 0 && (
                  <div className="text-right text-xs text-muted">
                    {status.verified_at && <p>Granted {formatDate(status.verified_at)}</p>}
                    {status.verification_expires_at && (
                      <p className={status.is_expired ? 'text-red-600 font-medium' : ''}>
                        {status.is_expired ? 'Expired ' : 'Renews '}{formatDate(status.verification_expires_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {status.is_expired && (
                <p className="text-xs text-red-600 mt-3">
                  Your verification has expired. Re-submit below to renew it.
                </p>
              )}
            </div>

            {/* Latest request status */}
            {latest && (
              <div className={`card p-4 border ${REQUEST_STATUS_UI[latest.status].color}`}>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {(() => { const I = REQUEST_STATUS_UI[latest.status].icon; return <I className="w-4 h-4" /> })()}
                  {latest.requested_level_label} — {REQUEST_STATUS_UI[latest.status].label}
                </div>
                {latest.admin_notes && (
                  <p className="text-xs mt-1.5 opacity-90">{latest.admin_notes}</p>
                )}
              </div>
            )}

            {/* Automated checks */}
            <div className="card p-5">
              <p className="font-semibold text-charcoal text-sm mb-3">Profile completeness (Basic tier)</p>
              <ul className="space-y-2">
                {status.automated_checks.map(c => (
                  <li key={c.key} className="flex items-center gap-2 text-sm">
                    {c.passed
                      ? <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      : <X className="w-4 h-4 text-red-500 flex-shrink-0" />}
                    <span className={c.passed ? 'text-charcoal' : 'text-muted'}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tier cards */}
            <div className="space-y-3">
              {TIERS.map(tier => {
                const Icon = tier.icon
                const achieved = currentLevel >= tier.level && !status.is_expired
                const canRequest = !pending && (tier.level > currentLevel || status.is_expired)
                const basicBlocked = tier.level === 1 && !status.passes_automated
                return (
                  <div key={tier.level} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 flex-shrink-0 ${tier.color}`} />
                        <div>
                          <p className="font-semibold text-charcoal">
                            Level {tier.level} — {tier.name}
                          </p>
                          <p className="text-sm text-muted mt-0.5">{tier.blurb}</p>
                          <p className="text-xs text-muted mt-1.5"><strong>Requirement:</strong> {tier.requirement}</p>
                        </div>
                      </div>
                      {achieved && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 flex-shrink-0">
                          <Check className="w-4 h-4" /> Active
                        </span>
                      )}
                    </div>

                    {/* Request UI */}
                    {canRequest && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {targetLevel === tier.level ? (
                          <div className="space-y-3">
                            {tier.needsDocs && (
                              <div>
                                <label className="block text-xs font-medium text-charcoal mb-1">
                                  Document (PDF or image)
                                </label>
                                <input
                                  type="file"
                                  accept=".pdf,image/*"
                                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                                  className="block w-full text-sm text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700"
                                />
                              </div>
                            )}
                            <textarea
                              value={note}
                              onChange={e => setNote(e.target.value)}
                              rows={2}
                              placeholder="Optional note to the reviewer…"
                              className="input w-full resize-none text-sm"
                            />
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <div className="flex gap-2">
                              <button
                                onClick={() => submitRequest(tier.level)}
                                disabled={submitting}
                                className="btn-primary text-sm"
                              >
                                {submitting ? 'Submitting…' : 'Submit request'}
                              </button>
                              <button
                                onClick={() => { setTargetLevel(null); setError(''); setFile(null) }}
                                className="btn-outline text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setTargetLevel(tier.level); setError('') }}
                            disabled={basicBlocked}
                            className="btn-outline text-sm gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={basicBlocked ? 'Complete your profile to qualify' : undefined}
                          >
                            {tier.needsDocs ? <Upload className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                            {tier.level === 1 ? 'Get Basic verification' : `Request ${tier.name}`}
                          </button>
                        )}
                        {basicBlocked && targetLevel !== tier.level && (
                          <p className="text-xs text-muted mt-2">Complete every profile check above to qualify.</p>
                        )}
                      </div>
                    )}

                    {pending && pending.requested_level === tier.level && (
                      <p className="text-xs text-amber-700 mt-3 pt-3 border-t border-gray-100">
                        This request is awaiting review.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  )
}
