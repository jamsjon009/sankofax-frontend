'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { community } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { tokenStore } from '@/lib/auth'
import type { ForumCategory } from '@/types'

export default function NewThreadPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-12"><div className="skeleton h-96 w-full rounded-2xl" /></div>}>
      <NewThreadForm />
    </Suspense>
  )
}

function NewThreadForm() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  useEffect(() => {
    community.categories().then(cats => {
      setCategories(cats)
      const preset = searchParams.get('category')
      setCategory(preset && cats.some(c => c.slug === preset) ? preset : (cats[0]?.slug ?? ''))
    }).catch(() => setCategories([]))
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = tokenStore.getAccess()
    if (!token) { router.push('/login'); return }
    setError('')
    setSubmitting(true)
    try {
      const thread = await community.createThread(token, { category, title: title.trim(), body: body.trim() })
      router.push(`/community/${thread.slug}`)
    } catch (err: unknown) {
      const data = (err as { data?: Record<string, unknown> })?.data
      const first = data && (data.detail || data.title || data.body || data.category)
      setError(typeof first === 'string' ? first : Array.isArray(first) ? String(first[0]) : 'Could not create the discussion.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>

      <h1 className="text-2xl font-bold text-charcoal mb-1">Start a discussion</h1>
      <p className="text-muted text-sm mb-6">Ask a question, share an idea, or connect with the community.</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">Board</label>
          <select value={category} onChange={e => setCategory(e.target.value)} required className="input w-full">
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            minLength={5}
            maxLength={200}
            placeholder="A clear, descriptive title"
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            minLength={10}
            rows={8}
            placeholder="Write your post…"
            className="input w-full resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" disabled={submitting || !category} className="btn-primary">
            {submitting ? 'Posting…' : 'Post discussion'}
          </button>
          <Link href="/community" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
