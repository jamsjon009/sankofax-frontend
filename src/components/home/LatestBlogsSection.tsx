import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const POSTS = [
  {
    slug: 'why-black-owned-businesses-need-a-global-presence',
    title: 'Why Black-Owned Businesses Need a Global Presence',
    excerpt: 'In an increasingly connected world, limiting your business to local markets means leaving money and opportunity on the table.',
    category: 'Business Growth',
    date: 'June 15, 2025',
    readTime: '5 min read',
    emoji: '📈',
  },
  {
    slug: 'the-power-of-the-diaspora-economy',
    title: 'The Power of the Diaspora Economy',
    excerpt: 'The African diaspora represents a combined spending power of over $1.5 trillion. Here is how to tap into this community.',
    category: 'Community',
    date: 'June 8, 2025',
    readTime: '7 min read',
    emoji: '🌍',
  },
  {
    slug: 'how-to-optimize-your-sankofax-listing',
    title: 'How to Optimize Your SankofaX Listing for Maximum Visibility',
    excerpt: 'A complete listing gets 10x more views than an incomplete one. Follow these tips to make your business stand out.',
    category: 'Tips & Guides',
    date: 'May 28, 2025',
    readTime: '4 min read',
    emoji: '💡',
  },
]

export default function LatestBlogsSection() {
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
        {POSTS.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card overflow-hidden group"
          >
            <div className="blog-card-thumb">
              <span className="blog-card-emoji">{post.emoji}</span>
            </div>
            <div className="p-5">
              <span className="badge bg-primary-50 text-primary-700 border border-primary-100 text-[10px] font-semibold">
                {post.category}
              </span>
              <h3 className="mt-3 font-semibold text-charcoal text-sm leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
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