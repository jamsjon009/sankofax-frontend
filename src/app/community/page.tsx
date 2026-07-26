'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { MessageSquare, Eye, Pin, Lock, Plus, Search } from 'lucide-react'
import { community } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { ForumCategory, ForumThread } from '@/types'

function timeAgo(iso: string) {
  const d = new Date(iso).getTime()
  const s = Math.floor((Date.now() - d) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24); if (days < 30) return `${days}d ago`
  const mo = Math.floor(days / 30); if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(mo / 12)}y ago`
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [active, setActive] = useState<string>('')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    community.categories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await community.threads({ category: active || undefined, q: q || undefined })
      setThreads(Array.isArray(res) ? res : (res.results ?? []))
    } catch {
      setThreads([])
    } finally {
      setLoading(false)
    }
  }, [active, q])

  useEffect(() => {
    const t = setTimeout(load, q ? 350 : 0) // debounce search
    return () => clearTimeout(t)
  }, [load, q])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Community</h1>
            <p className="text-white/70 max-w-xl">
              Connect, ask questions and share resources with founders and members across the diaspora.
            </p>
          </div>
          <Link href={user ? '/community/new' : '/login'} className="btn-primary gap-2 flex-shrink-0 bg-white text-primary-800 hover:bg-white/90">
            <Plus className="w-4 h-4" /> Start a discussion
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search discussions…"
            className="input w-full pl-9"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActive('')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${active === '' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted border-gray-200 hover:border-primary-300'}`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${active === c.slug ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted border-gray-200 hover:border-primary-300'}`}
            >
              {c.icon && <span className="mr-1">{c.icon}</span>}{c.name}
            </button>
          ))}
        </div>

        {/* Threads */}
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map(i => <div key={i} className="skeleton h-24 w-full rounded-2xl" />)}
          </div>
        ) : threads.length === 0 ? (
          <div className="card p-10 text-center text-muted text-sm">
            No discussions yet.{' '}
            <Link href={user ? '/community/new' : '/login'} className="text-primary-700 font-medium">
              Be the first to start one →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map(t => (
              <Link
                key={t.id}
                href={`/community/${t.slug}`}
                className="card p-5 block hover:border-primary-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-600" />}
                      {t.is_locked && <Lock className="w-3.5 h-3.5 text-muted" />}
                      <h3 className="font-semibold text-charcoal">{t.title}</h3>
                    </div>
                    <p className="text-sm text-muted mt-1 line-clamp-2">{t.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted">
                      <span className="badge bg-primary-50 text-primary-700 text-[10px]">{t.category_name}</span>
                      <span>by {t.author_name}</span>
                      <span>· {timeAgo(t.last_activity_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-muted flex-shrink-0">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {t.reply_count}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {t.view_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
