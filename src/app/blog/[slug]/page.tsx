import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Eye, Tag } from 'lucide-react'
import { blog, type BlogPost, type BlogCategory } from '@/lib/api'
import type { Metadata } from 'next'
import BlogShareButtons from '@/components/blog/BlogShareButtons'

export const revalidate = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sankofax.com'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await blog.get(slug).catch(() => null)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.og_image ? [post.og_image] : post.cover_image ? [post.cover_image] : [],
    },
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await blog.get(slug).catch(() => null)
  if (!post) notFound()

  const [allPostsRes, categories] = await Promise.all([
    blog.list().catch(() => ({ results: [] as BlogPost[] })),
    blog.categories().catch(() => [] as BlogCategory[]),
  ])

  const allPosts: BlogPost[] = Array.isArray(allPostsRes) ? allPostsRes : (allPostsRes.results ?? [])

  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.category?.slug === post.category?.slug)
    .slice(0, 4)

  const recentPosts = allPosts
    .filter(p => p.slug !== post.slug)
    .slice(0, 4)

  const postUrl = `${SITE_URL}/blog/${post.slug}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary-700 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

        {/* ── Main content ── */}
        <article>
          {/* Category */}
          {post.category && (
            <Link href={`/blog?category=${post.category.slug}`}>
              <span className="badge badge-gold mb-4 inline-block hover:opacity-80 transition-opacity">
                {post.category.name}
              </span>
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6 pb-6 border-b border-gray-100">
            <span className="font-medium text-charcoal">{post.author_name}</span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.read_time_minutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.view_count} views
            </span>
          </div>

          {/* Cover image */}
          {post.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-charcoal prose-a:text-primary-700 prose-strong:text-charcoal prose-img:rounded-xl mb-8"
            dangerouslySetInnerHTML={{ __html: post.content ?? post.excerpt }}
          />

          {/* Tags */}
          {post.tags_list.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-100 mb-8">
              <Tag className="w-4 h-4 text-muted" />
              {post.tags_list.map(tag => (
                <span key={tag} className="badge text-xs">#{tag}</span>
              ))}
            </div>
          )}

          {/* Share — mobile (shown below content on small screens) */}
          <div className="lg:hidden mb-8">
            <BlogShareButtons title={post.title} url={postUrl} />
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-lg font-bold text-charcoal mb-5">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map(p => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="card p-4 group hover:shadow-md transition-shadow"
                  >
                    {p.cover_image && (
                      <div className="h-32 rounded-lg overflow-hidden mb-3">
                        <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-charcoal group-hover:text-primary-700 transition-colors leading-snug block mb-1">
                      {p.title}
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.read_time_minutes} min read
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA banner */}
          <div className="mt-10 bg-gradient-to-br from-primary-950 to-primary-800 text-white rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">List your business on SankofaX</h3>
            <p className="text-white/70 text-sm mb-5">
              Join thousands of Black and African-owned businesses already connecting with the diaspora.
            </p>
            <Link
              href="/list-your-business"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold px-8 py-2.5 rounded-xl transition-colors"
            >
              Get Listed Free
            </Link>
          </div>
        </article>

        {/* ── Sidebar ── */}
        <aside className="space-y-6">

          {/* Search */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal mb-3">Search</h3>
            <form action="/blog" method="get">
              <div className="relative">
                <input
                  name="q"
                  type="search"
                  placeholder="Search articles..."
                  className="input w-full pr-10 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Social share — desktop */}
          <div className="hidden lg:block">
            <BlogShareButtons title={post.title} url={postUrl} />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-charcoal mb-4">Categories</h3>
              <ul className="space-y-1">
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <Link
                      href={`/blog?category=${cat.slug}`}
                      className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg transition-colors ${
                        post.category?.slug === cat.slug
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-charcoal hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-muted bg-gray-100 rounded-full px-2 py-0.5">
                        {cat.post_count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent posts */}
          {recentPosts.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-charcoal mb-4">Recent Posts</h3>
              <ul className="space-y-4">
                {recentPosts.map(p => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="flex gap-3 group">
                      {p.cover_image ? (
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 text-xl">
                          📝
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-charcoal group-hover:text-primary-700 transition-colors leading-snug line-clamp-2">
                          {p.title}
                        </p>
                        {p.published_at && (
                          <p className="text-[11px] text-muted mt-1">{formatDate(p.published_at)}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags cloud */}
          {(() => {
            const allTags = [...new Set(allPosts.flatMap(p => p.tags_list))].slice(0, 20)
            return allTags.length > 0 ? (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-charcoal mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?q=${encodeURIComponent(tag)}`}
                      className={`badge text-xs transition-colors hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 ${
                        post.tags_list.includes(tag) ? 'bg-primary-50 text-primary-700 border-primary-200' : ''
                      }`}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null
          })()}

        </aside>
      </div>
    </div>
  )
}
