import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const POSTS = [
  {
    slug: 'why-black-owned-businesses-need-a-global-presence',
    title: 'Why Black-Owned Businesses Need a Global Presence',
    excerpt: 'In an increasingly connected world, limiting your business to local markets means leaving money and opportunity on the table. Here is how SankofaX helps you go global.',
    category: 'Business Growth',
    date: 'June 15, 2025',
    readTime: '5 min read',
  },
  {
    slug: 'the-power-of-the-diaspora-economy',
    title: 'The Power of the Diaspora Economy',
    excerpt: 'The African diaspora represents a combined spending power of over $1.5 trillion. Understanding how to tap into this community can transform your business.',
    category: 'Community',
    date: 'June 8, 2025',
    readTime: '7 min read',
  },
  {
    slug: 'how-to-optimize-your-sankofax-listing',
    title: 'How to Optimize Your SankofaX Listing for Maximum Visibility',
    excerpt: 'A complete listing gets 10x more views than an incomplete one. Follow these tips to make sure your business stands out in the directory.',
    category: 'Tips & Guides',
    date: 'May 28, 2025',
    readTime: '4 min read',
  },
  {
    slug: 'subscription-tiers-explained',
    title: 'SankofaX Subscription Tiers Explained: Which Plan is Right for You?',
    excerpt: 'From our free listing to Directory Elite, every plan is designed to meet businesses where they are. Here is a breakdown to help you choose.',
    category: 'Platform Updates',
    date: 'May 20, 2025',
    readTime: '6 min read',
  },
  {
    slug: 'spotlight-black-tech-founders',
    title: 'Spotlight: Black Tech Founders Changing the Game',
    excerpt: 'We sat down with five Black tech entrepreneurs listed on SankofaX to hear their stories, challenges, and advice for aspiring founders.',
    category: 'Spotlight',
    date: 'May 12, 2025',
    readTime: '8 min read',
  },
  {
    slug: 'fair-pricing-global-south',
    title: 'Fair Pricing for the Global South: Our Commitment to Accessibility',
    excerpt: 'SankofaX offers reduced pricing for businesses in Africa, the Caribbean, and Latin America. Here is why we believe accessibility is non-negotiable.',
    category: 'Community',
    date: 'May 5, 2025',
    readTime: '4 min read',
  },
]

const CATEGORIES = ['All', 'Business Growth', 'Community', 'Tips & Guides', 'Platform Updates', 'Spotlight']

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-950 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">SankofaX Blog</h1>
          <p className="text-white/70 max-w-xl">
            Insights, stories, and guides for Black and African-owned businesses and the diaspora community.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <span
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm border cursor-pointer transition-colors ${
                cat === 'All'
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'border-gray-200 text-muted hover:border-primary-300'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card hover:shadow-md transition-shadow group overflow-hidden">
              {/* Placeholder image area */}
              <div className="h-40 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <span className="text-4xl">
                  {post.category === 'Business Growth' ? '📈' :
                   post.category === 'Community' ? '🌍' :
                   post.category === 'Tips & Guides' ? '💡' :
                   post.category === 'Platform Updates' ? '🚀' : '✨'}
                </span>
              </div>
              <div className="p-5">
                <span className="badge bg-primary-50 text-primary-700 border border-primary-100 text-[10px] font-semibold">
                  {post.category}
                </span>
                <h2 className="mt-3 font-semibold text-charcoal text-sm leading-snug group-hover:text-primary-700 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-primary-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}