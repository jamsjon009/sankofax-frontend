'use client'

import { useState, useEffect, useCallback } from 'react'
import { Inbox, Send, Handshake, Users, Check, X, Clock } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { connections, type Connection } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import { cn } from '@/lib/utils'

const STATUS_UI: Record<Connection['status'], { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  accepted: { label: 'Accepted', cls: 'text-green-700 bg-green-50 border-green-200' },
  declined: { label: 'Declined', cls: 'text-red-600 bg-red-50 border-red-200' },
}

export default function InboxPage() {
  const [box, setBox] = useState<'inbox' | 'sent'>('inbox')
  const [items, setItems] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (which: 'inbox' | 'sent') => {
    const token = tokenStore.getAccess()
    if (!token) return
    setLoading(true)
    try {
      const data = await connections.list(token, which)
      setItems(data)
      // mark unread inbox items as read
      if (which === 'inbox') {
        await Promise.all(
          data.filter(c => !c.is_read).map(c => connections.updateStatus(token, c.id, { is_read: true }).catch(() => {})),
        )
      }
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(box) }, [box, load])

  async function respond(id: string, status: 'accepted' | 'declined') {
    const token = tokenStore.getAccess()
    if (!token) return
    setItems(prev => prev.map(c => (c.id === id ? { ...c, status } : c)))
    await connections.updateStatus(token, id, { status }).catch(() => load(box))
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-charcoal mb-1">Inbox</h1>
        <p className="text-muted text-sm mb-6">Connect requests and collaboration inquiries.</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-100">
          {([['inbox', 'Received', Inbox], ['sent', 'Sent', Send]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setBox(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                box === key ? 'border-primary-700 text-primary-700' : 'border-transparent text-muted hover:text-charcoal',
              )}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map(i => <div key={i} className="skeleton h-24 w-full rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Inbox className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-muted text-sm">
              {box === 'inbox' ? 'No requests yet.' : 'You haven’t sent any requests yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(c => {
              const s = STATUS_UI[c.status]
              return (
                <div key={c.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {c.kind === 'collaborate'
                        ? <Handshake className="w-4 h-4 text-primary-700" />
                        : <Users className="w-4 h-4 text-primary-700" />}
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                        {c.kind}
                      </span>
                    </div>
                    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border', s.cls)}>
                      {c.status === 'pending' && <Clock className="w-3 h-3" />}
                      {s.label}
                    </span>
                  </div>

                  <p className="text-sm text-charcoal mt-3">
                    {box === 'inbox'
                      ? <><span className="font-semibold">{c.sender_name}</span> ({c.sender_email})</>
                      : <>To <span className="font-semibold">{c.company_name ?? c.recipient_name}</span></>}
                    {c.listing_title && <> · re: <span className="text-muted">{c.listing_title}</span></>}
                  </p>

                  {c.subject && <p className="text-sm font-medium text-charcoal mt-2">{c.subject}</p>}
                  {c.message && <p className="text-sm text-muted mt-1 leading-relaxed whitespace-pre-line">{c.message}</p>}

                  {box === 'inbox' && c.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => respond(c.id, 'accepted')} className="btn-primary text-sm gap-1.5 py-1.5">
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button onClick={() => respond(c.id, 'declined')} className="btn-outline text-sm gap-1.5 py-1.5">
                        <X className="w-4 h-4" /> Decline
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
