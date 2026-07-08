import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react'
import { blog } from '@/lib/api'
import type { BlogPost, BlogCategory } from '@/lib/api'

export const revalidate = 60

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>
}

async function getData(q?: string, category?: string) {
  const [postsRes, cats] = await Promise.all([
    blog.list({ search: q, category__slug: category }).catch(() => ({ results: [] as BlogPost[], count: 0, next: null, previous: null })),
    blog.categories().catch(() => [] as BlogCategory[]),
  ])
  return {
    posts: Array.isArray(postsRes) ? postsRes : postsRes.results ?? [],
    categories: cats,
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPage({ searchParams }: Props) {
  const { q, category } = await searchParams
  const { posts, categories } = await getData(q, category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-primary-600 text-sm font-semibold uppercase tracking-widest mb-2">Our Blog</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-4">Stories, Guides &amp; Insights</h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          From business tips to diaspora culture — everything you need to grow and connect.
        </p>
      </div>

      {/* Search bar */}
      <form action="/blog" method="get" className="max-w-lg mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            name="q"
            type="search"
            defaultValue={q ?? ''}
            placeholder="Search articles, topics, tags..."
            className="input w-full pl-10 pr-20 py-3"
          />
          {category && <input type="hidden" name="category" value={category} />}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 text-sm rounded-lg"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          <Link
            href="/blog"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !category && !q
                ? 'bg-primary-700 text-white'
                : 'border border-gray-200 text-muted hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            All
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.slug
                  ? 'bg-primary-700 text-white'
                  : 'border border-gray-200 text-muted hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {cat.name} <span className="opacity-60">({cat.post_count})</span>
            </Link>
          ))}
        </div>
      )}

      {/* Search result label */}
      {(q || category) && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">
            {posts.length} result{posts.length !== 1 ? 's' : ''}
            {q && <> for <strong className="text-charcoal">&ldquo;{q}&rdquo;</strong></>}
            {category && (
              <> in <strong className="text-charcoal">{categories.find(c => c.slug === category)?.name ?? category}</strong></>
            )}
          </p>
          <Link href="/blog" className="text-xs text-primary-700 hover:underline">Clear filters</Link>
        </div>
      )}

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium text-charcoal mb-1">No articles found</p>
          <p className="text-sm text-muted mb-6">Try a different keyword or browse all posts.</p>
          <Link href="/blog" className="btn-outline">Browse all posts</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: BlogPost) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card group flex flex-col overflow-hidden">
              <div className="blog-card-thumb bg-primary-50 flex items-center justify-center">
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="blog-card-emoji">✍️</span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                {post.category && (
                  <span className="badge badge-gold mb-3 self-start">{post.category.name}</span>
                )}
                <h2 className="font-bold text-charcoal text-base leading-snug group-hover:text-primary-700 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>

                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <div className="flex items-center gap-3">
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
                  <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
