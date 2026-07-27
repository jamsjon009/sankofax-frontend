'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Megaphone, CheckCircle2, Clock, ExternalLink, XCircle, CreditCard } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { promotions } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import type { StorySubmission, StorySubmissionStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_UI: Record<StorySubmissionStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  pending_payment: { label: 'Awaiting payment', cls: 'text-amber-700 bg-amber-50 border-amber-200', Icon: CreditCard },
  in_review: { label: 'In review', cls: 'text-amber-700 bg-amber-50 border-amber-200', Icon: Clock },
  published: { label: 'Published', cls: 'text-green-700 bg-green-50 border-green-200', Icon: CheckCircle2 },
  rejected: { label: 'Needs changes', cls: 'text-red-600 bg-red-50 border-red-200', Icon: XCircle },
}

function PromotionsInner() {
  const search = useSearchParams()
  const justPaid = search.get('success')
  const [items, setItems] = useState<StorySubmission[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const token = tokenStore.getAccess()
    if (!token) return
    setLoading(true)
    try {
      setItems(await promotions.mySubmissions(token))
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <DashboardShell>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-charcoal">Story Promotions</h1>
          <Link href="/promote" className="btn-primary text-sm gap-1.5">
            <Megaphone className="w-4 h-4" /> New story
          </Link>
        </div>
        <p className="text-muted text-sm mb-6">Founder stories, brand features and press releases you’ve submitted.</p>

        {justPaid && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 mb-6 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4" /> Payment received — submission {justPaid} is now with our editors for review.
          </div>
        )}

        {loading ? (
          <div className="space-y-3">{[0, 1].map(i => <div key={i} className="skeleton h-28 w-full rounded-xl" />)}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Megaphone className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-muted text-sm mb-4">You haven’t promoted a story yet.</p>
            <Link href="/promote" className="btn-primary text-sm">Explore packages</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(s => {
              const ui = STATUS_UI[s.status]
              return (
                <div key={s.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted">{s.reference} · {s.kind_label}</p>
                      <p className="font-semibold text-charcoal">{s.title}</p>
                      <p className="text-sm text-muted">{s.company_name}</p>
                    </div>
                    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0', ui.cls)}>
                      <ui.Icon className="w-3 h-3" /> {ui.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-3 border-t border-gray-100 pt-3">
                    <span className="text-sm text-charcoal">{s.currency} {s.amount}</span>
                    {s.status === 'published' && s.post_slug && (
                      <Link href={`/blog/${s.post_slug}`} className="btn-outline text-xs gap-1.5 py-1.5">
                        View published story <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  {s.status === 'rejected' && s.admin_note && (
                    <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-3">
                      Editor feedback: {s.admin_note}
                    </p>
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

export default function PromotionsPage() {
  return (
    <Suspense fallback={null}>
      <PromotionsInner />
    </Suspense>
  )
}
