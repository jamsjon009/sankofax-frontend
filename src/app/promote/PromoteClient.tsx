'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Sparkles, Check, Loader2, X, BookOpen, Megaphone, Newspaper } from 'lucide-react'
import { promotions, myCompanies } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { apiError } from '@/lib/utils'
import type { StoryPackage, StoryKind, CompanyProfile } from '@/types'

const KIND_ICON: Record<StoryKind, typeof BookOpen> = {
  founder_story: BookOpen,
  brand_feature: Sparkles,
  press_release: Newspaper,
}

export default function PromoteClient() {
  const { user } = useAuth()
  const [packages, setPackages] = useState<StoryPackage[]>([])
  const [companies, setCompanies] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<StoryPackage | null>(null)

  const load = useCallback(async () => {
    const token = tokenStore.getAccess()
    setLoading(true)
    try {
      const pkgs = await promotions.packages(token)
      setPackages(pkgs)
      if (token) {
        try { setCompanies(await myCompanies.list(token)) } catch { setCompanies([]) }
      }
    } catch {
      setPackages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const hasDiscount = packages.some(p => p.your_price !== p.price)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 badge bg-primary-50 text-primary-700 border border-primary-200 mb-4">
          <Megaphone className="w-3.5 h-3.5" /> Story Promotion
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-3">Get your story in front of the diaspora</h1>
        <p className="text-muted">
          Publish your founder journey, a brand feature or a press release — professionally edited,
          featured on SankofaX and shared with our audience.
        </p>
        {hasDiscount && (
          <p className="text-sm text-green-700 font-medium mt-3">
            ✨ Your subscription discount is already applied to the prices below.
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map(i => <div key={i} className="skeleton h-96 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map(pkg => {
            const Icon = KIND_ICON[pkg.kind] ?? BookOpen
            const discounted = pkg.your_price !== pkg.price
            return (
              <div key={pkg.id} className="card p-6 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-700" />
                </div>
                <h3 className="text-lg font-bold text-charcoal">{pkg.name}</h3>
                <p className="text-sm text-muted mt-1 mb-4">{pkg.description}</p>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-charcoal">{pkg.currency} {pkg.your_price}</span>
                  {discounted && <span className="text-sm text-muted line-through">{pkg.price}</span>}
                </div>
                <p className="text-xs text-muted mb-5">Featured for {pkg.duration_days} days
                  {pkg.subscriber_discount_percent > 0 && !discounted &&
                    ` · ${pkg.subscriber_discount_percent}% off for subscribers`}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {pkg.features_list.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>

                <button onClick={() => setSelected(pkg)} className="btn-primary w-full">
                  Promote your story
                </button>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <SubmitModal
          pkg={selected}
          user={user}
          companies={companies}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

function SubmitModal({
  pkg, user, companies, onClose,
}: {
  pkg: StoryPackage
  user: ReturnType<typeof useAuth>['user']
  companies: CompanyProfile[]
  onClose: () => void
}) {
  const [company, setCompany] = useState(companies[0]?.slug ?? '')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [email, setEmail] = useState(user?.email ?? '')
  const [cover, setCover] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    const token = tokenStore.getAccess()
    if (!token) return
    setBusy(true); setError('')
    try {
      const fd = new FormData()
      fd.append('package', pkg.slug)
      fd.append('company', company)
      fd.append('title', title)
      fd.append('body', body)
      fd.append('contact_email', email)
      if (cover) fd.append('cover_image', cover)
      const { checkout_url } = await promotions.submit(token, fd)
      window.location.href = checkout_url
    } catch (e) {
      setError(apiError(e, 'Could not start checkout.'))
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-charcoal">{pkg.name}</h2>
            <p className="text-sm text-muted">{pkg.currency} {pkg.your_price} · featured {pkg.duration_days} days</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-charcoal"><X className="w-5 h-5" /></button>
        </div>

        {!user ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted mb-3">Sign in to submit your story.</p>
            <Link href="/login?next=/promote" className="btn-primary w-full">Sign in</Link>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted mb-3">Add your business first, then promote its story.</p>
            <Link href="/dashboard/business/new-listing" className="btn-primary w-full">Add your business</Link>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-muted">Business</span>
              <select value={company} onChange={e => setCompany(e.target.value)} className="input mt-1">
                {companies.map(c => <option key={c.slug} value={c.slug}>{c.company_name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted">Headline</span>
              <input value={title} onChange={e => setTitle(e.target.value)} className="input mt-1"
                placeholder="e.g. How we brought Kente to the world" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted">Your story</span>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={7} className="input mt-1 resize-none"
                placeholder="Tell your story… (separate paragraphs with a blank line)" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted">Contact email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} className="input mt-1" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted">Cover image (optional)</span>
              <input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:text-sm" />
            </label>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button onClick={submit} disabled={busy} className="btn-primary w-full gap-2">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {busy ? 'Redirecting to checkout…' : `Pay & submit · ${pkg.currency} ${pkg.your_price}`}
            </button>
            <p className="text-[11px] text-muted text-center">
              Secure payment by card via Stripe. Our editors review before publishing.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
