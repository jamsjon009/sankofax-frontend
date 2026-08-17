'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { MessageSquare, Eye, Pin, Lock, ArrowLeft, Trash2 } from 'lucide-react'
import { community } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { tokenStore } from '@/lib/auth'
import type { ForumThreadDetail } from '@/types'
import { useRouter } from 'next/navigation'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return '' }
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-primary-700">{(name || '?')[0].toUpperCase()}</span>
    </div>
  )
}

export default function ThreadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [thread, setThread] = useState<ForumThreadDetail | null | undefined>(undefined)
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    community.thread(slug).then(setThread).catch(() => setThread(null))
  }, [slug])

  async function submitReply(e: React.FormEvent) {
    e.preventDefault()
    const token = tokenStore.getAccess()
    if (!token || !reply.trim()) return
    setError('')
    setSubmitting(true)
    try {
      const newReply = await community.reply(token, slug, reply.trim())
      setThread(t => t ? { ...t, replies: [...t.replies, newReply], reply_count: t.reply_count + 1 } : t)
      setReply('')
    } catch (err: unknown) {
      setError((err as { data?: { detail?: string } })?.data?.detail ?? 'Could not post your reply.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    const token = tokenStore.getAccess()
    if (!token || !confirm('Delete this discussion? This cannot be undone.')) return
    try {
      await community.deleteThread(token, slug)
      router.push('/community')
    } catch {
      setError('Could not delete this discussion.')
    }
  }

  if (thread === undefined) {
    return <div className="max-w-7xl mx-auto px-4 py-12"><div className="skeleton h-64 w-full rounded-2xl" /></div>
  }
  if (thread === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted mb-4">This discussion could not be found.</p>
        <Link href="/community" className="btn-outline">Back to Community</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>

      {/* Opening post */}
      <div className="card p-6">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Link href={`/community?category=${thread.category.slug}`} className="badge bg-primary-50 text-primary-700 text-[10px]">
            {thread.category.icon} {thread.category.name}
          </Link>
          {thread.is_pinned && <span className="inline-flex items-center gap-1 text-xs text-amber-600"><Pin className="w-3.5 h-3.5" /> Pinned</span>}
          {thread.is_locked && <span className="inline-flex items-center gap-1 text-xs text-muted"><Lock className="w-3.5 h-3.5" /> Locked</span>}
        </div>
        <h1 className="text-2xl font-bold text-charcoal">{thread.title}</h1>
        <div className="flex items-center gap-3 mt-3 mb-4">
          <Avatar name={thread.author_name} />
          <div className="text-xs text-muted">
            <span className="font-medium text-charcoal">{thread.author_name}</span>
            <span> · {formatDate(thread.created_at)}</span>
          </div>
        </div>
        <p className="text-[15px] leading-relaxed text-charcoal whitespace-pre-wrap">{thread.body}</p>

        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-xs text-muted">
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {thread.reply_count} replies</span>
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {thread.view_count} views</span>
          {thread.is_author && (
            <button onClick={handleDelete} className="ml-auto inline-flex items-center gap-1 text-red-500 hover:text-red-600">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      <h2 className="text-sm font-semibold text-charcoal mt-8 mb-3">
        {thread.reply_count} {thread.reply_count === 1 ? 'Reply' : 'Replies'}
      </h2>
      <div className="space-y-3">
        {thread.replies.map(r => (
          <div key={r.id} className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar name={r.author_name} />
              <div className="text-xs text-muted">
                <span className="font-medium text-charcoal">{r.author_name}</span>
                <span> · {formatDate(r.created_at)}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-charcoal whitespace-pre-wrap pl-11">{r.body}</p>
          </div>
        ))}
      </div>

      {/* Reply form */}
      <div className="mt-6">
        {thread.is_locked ? (
          <div className="card p-5 text-center text-sm text-muted flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> This discussion is locked and no longer accepts replies.
          </div>
        ) : user ? (
          <form onSubmit={submitReply} className="card p-5 space-y-3">
            <label className="block text-sm font-semibold text-charcoal">Add a reply</label>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              rows={4}
              required
              placeholder="Share your thoughts…"
              className="input w-full resize-none"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={submitting || !reply.trim()} className="btn-primary">
              {submitting ? 'Posting…' : 'Post reply'}
            </button>
          </form>
        ) : (
          <div className="card p-5 text-center text-sm text-muted">
            <Link href="/login" className="text-primary-700 font-medium">Sign in</Link> to join the discussion.
          </div>
        )}
      </div>
    </div>
  )
}
