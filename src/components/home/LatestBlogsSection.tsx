import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { blog, type BlogPost } from '@/lib/api'

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const FALLBACK_EMOJIS = ['📈', '🌍', '💡', '✨', '🚀', '🤝']

export default async function LatestBlogsSection() {
  let posts: BlogPost[] = []
  try {
    const res = await blog.list()
    const all = Array.isArray(res) ? res : res.results ?? []
    posts = all.slice(0, 3)
  } catch {
    // silently use empty array; section still renders
  }

  // If no API posts, render nothing (avoids stale static data)
  if (posts.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="section-title mb-2">Latest from the Blog</h2>
          <p className="text-muted text-sm">Insights and guides for the diaspora community</p>
        </div>
        <Link href="/blog" className="btn-outline gap-2 text-sm hidden sm:inline-flex">
          View all posts
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card overflow-hidden group"
          >
            {post.cover_image ? (
              <div className="h-40 overflow-hidden">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="blog-card-thumb">
                <span className="blog-card-emoji">{FALLBACK_EMOJIS[i % FALLBACK_EMOJIS.length]}</span>
              </div>
            )}
            <div className="p-5">
              {post.category && (
                <span className="badge bg-primary-50 text-primary-700 border border-primary-100 text-[10px] font-semibold">
                  {post.category.name}
                </span>
              )}
              <h3 className="mt-3 font-semibold text-charcoal text-sm leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                {post.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.published_at)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.read_time_minutes} min read
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/blog" className="btn-outline gap-2">
          View all posts
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
