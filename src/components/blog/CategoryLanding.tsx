import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { blog } from '@/lib/api'
import type { BlogPost } from '@/lib/api'

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group flex flex-col overflow-hidden">
      <div className="blog-card-thumb bg-primary-50 flex items-center justify-center">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="blog-card-emoji">✍️</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        {post.category && <span className="badge badge-gold mb-3 self-start">{post.category.name}</span>}
        <h2 className="font-bold text-charcoal text-base leading-snug group-hover:text-primary-700 transition-colors mb-2">
          {post.title}
        </h2>
        <p className="text-muted text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-3">
            {post.published_at && (
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.published_at)}</span>
            )}
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time_minutes} min read</span>
          </div>
          <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

/**
 * Landing page for a dedicated blog category (Success Stories, Diaspora News).
 * Fetches published posts in `categorySlug` and renders a hero + featured post + grid.
 */
export default async function CategoryLanding({
  categorySlug,
  eyebrow,
  title,
  subtitle,
  emptyEmoji = '📰',
  emptyText = 'No posts yet — check back soon.',
}: {
  categorySlug: string
  eyebrow: string
  title: string
  subtitle: string
  emptyEmoji?: string
  emptyText?: string
}) {
  const res = await blog
    .list({ category__slug: categorySlug })
    .catch(() => ({ results: [] as BlogPost[], count: 0, next: null, previous: null }))
  const posts = Array.isArray(res) ? res : res.results ?? []
  const [lead, ...rest] = posts

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2">{eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{title}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{emptyEmoji}</div>
            <p className="text-lg font-medium text-charcoal mb-1">{emptyText}</p>
            <Link href="/blog" className="btn-outline mt-4">Browse the blog</Link>
          </div>
        ) : (
          <>
            {/* Featured / lead post */}
            <Link href={`/blog/${lead.slug}`} className="card group grid md:grid-cols-2 overflow-hidden mb-10">
              <div className="blog-card-thumb bg-primary-50 flex items-center justify-center min-h-[220px]">
                {lead.cover_image ? (
                  <img src={lead.cover_image} alt={lead.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="blog-card-emoji text-6xl">{emptyEmoji}</span>
                )}
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                {lead.category && <span className="badge badge-gold mb-3 self-start">{lead.category.name}</span>}
                <h2 className="text-2xl font-bold text-charcoal group-hover:text-primary-700 transition-colors mb-3">{lead.title}</h2>
                <p className="text-muted leading-relaxed line-clamp-3 mb-4">{lead.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted">
                  {lead.published_at && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(lead.published_at)}</span>
                  )}
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.read_time_minutes} min read</span>
                </div>
              </div>
            </Link>

            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(post => <PostCard key={post.slug} post={post} />)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
