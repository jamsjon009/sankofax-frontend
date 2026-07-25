'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Send, CheckCircle2, Handshake, Users } from 'lucide-react'
import { connections } from '@/lib/api'
import { tokenStore } from '@/lib/auth'

interface Props {
  listingSlug: string
  businessName: string
  kind: 'connect' | 'collaborate'
  onClose: () => void
}

export default function ConnectModal({ listingSlug, businessName, kind, onClose }: Props) {
  const isCollab = kind === 'collaborate'
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const token = tokenStore.getAccess()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setError('')
    setSubmitting(true)
    try {
      await connections.create(token, { listing: listingSlug, kind, subject, message })
      setDone(true)
    } catch (err: unknown) {
      const data = (err as { data?: { detail?: string; message?: string[] } })?.data
      setError(data?.detail ?? data?.message?.[0] ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-charcoal" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          {isCollab ? <Handshake className="w-5 h-5 text-primary-700" /> : <Users className="w-5 h-5 text-primary-700" />}
          <h2 className="text-lg font-bold text-charcoal">
            {isCollab ? 'Collaborate' : 'Connect'} with {businessName}
          </h2>
        </div>
        <p className="text-sm text-muted mb-5">
          {isCollab
            ? 'Send a project or partnership inquiry. The owner will see it in their inbox.'
            : 'Send a connection request. You can add a short note (optional).'}
        </p>

        {!token ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted mb-4">Please sign in to {isCollab ? 'collaborate' : 'connect'}.</p>
            <Link href="/login" className="btn-primary">Sign in</Link>
          </div>
        ) : done ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <p className="font-semibold text-charcoal">Request sent!</p>
            <p className="text-sm text-muted">{businessName} will get back to you.</p>
            <button onClick={onClose} className="btn-outline mt-2">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5">Subject {isCollab && '*'}</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required={isCollab}
                maxLength={200}
                placeholder={isCollab ? 'e.g. Catering partnership' : 'e.g. I’d love to connect'}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5">
                Message {isCollab ? '*' : '(optional)'}
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required={isCollab}
                rows={4}
                placeholder={isCollab ? 'Describe your project or how you’d like to work together…' : 'Add a short note…'}
                className="input w-full resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center gap-2">
              {submitting ? 'Sending…' : <><Send className="w-4 h-4" /> Send {isCollab ? 'Inquiry' : 'Request'}</>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
