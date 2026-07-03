import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

const POSTS: Record<string, { title: string; category: string; date: string; readTime: string; body: string }> = {
  'why-black-owned-businesses-need-a-global-presence': {
    title: 'Why Black-Owned Businesses Need a Global Presence',
    category: 'Business Growth',
    date: 'June 15, 2025',
    readTime: '5 min read',
    body: `In an increasingly connected world, limiting your business to local markets means leaving money and opportunity on the table.

The African diaspora spans every continent. From London to Lagos, Toronto to Trinidad, there are millions of people actively seeking out Black and African-owned businesses — not just to buy a product, but to make a statement with their spending.

**The Opportunity is Enormous**

The global Black consumer market is valued at over $1.5 trillion annually. Yet many Black-owned businesses remain invisible to this potential customer base simply because they lack an online presence that reaches beyond their immediate geography.

**SankofaX Changes That**

By listing your business on SankofaX, you instantly become discoverable to diaspora consumers worldwide. Our platform is built specifically for this community — the people searching are not just looking for any business, they are looking for YOUR business.

**Getting Started is Simple**

1. Create your free account
2. Choose a subscription that fits your budget
3. Complete your business profile
4. Start receiving inquiries from customers across the globe

The diaspora is waiting. Be Seen. Be Supported. Be SankofaX.`,
  },
  'the-power-of-the-diaspora-economy': {
    title: 'The Power of the Diaspora Economy',
    category: 'Community',
    date: 'June 8, 2025',
    readTime: '7 min read',
    body: `The African diaspora represents one of the most powerful and untapped economic forces in the world.

With an estimated combined spending power of over $1.5 trillion, diaspora communities across North America, Europe, and beyond are reshaping global commerce — and increasingly, they want to spend that money with businesses that look like them.

**Community-Driven Commerce**

The concept of "buying Black" has surged in recent years, driven by a growing awareness that where we spend our money matters. Every dollar spent with a Black-owned business circulates within the community, creating jobs, building wealth, and strengthening the economic fabric of the diaspora.

**SankofaX as the Bridge**

SankofaX was built to be the infrastructure for this movement. We are not just a directory — we are a community platform that connects conscious consumers with the businesses they are already looking for.

**Your Business Belongs Here**

Whether you are a restaurant in Brixton, a tech startup in Nairobi, or a wellness practitioner in Brooklyn — your business has a global audience waiting to discover you.`,
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-3">Post not found</h1>
          <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    )
  }

  const paragraphs = post.body.split('\n\n')

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-950 to-primary-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <span className="badge bg-accent-500/20 text-accent-300 border border-accent-500/30 mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-white/50 text-sm">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-sm max-w-none">
          {paragraphs.map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return <h2 key={i} className="text-lg font-bold text-charcoal mt-8 mb-3">{para.replace(/\*\*/g, '')}</h2>
            }
            if (para.startsWith('1. ') || para.startsWith('- ')) {
              const items = para.split('\n')
              return (
                <ul key={i} className="list-disc list-inside space-y-1 text-muted text-sm my-4">
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^[\d]+\.\s|-\s/, '')}</li>
                  ))}
                </ul>
              )
            }
            return <p key={i} className="text-muted text-sm leading-relaxed mb-4">{para}</p>
          })}
        </article>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="card p-6 bg-primary-50 border-primary-100 text-center">
            <h3 className="font-bold text-charcoal mb-2">Ready to list your business?</h3>
            <p className="text-sm text-muted mb-4">Join thousands of Black and African-owned businesses on SankofaX.</p>
            <Link href="/register" className="btn-primary">Get Started Free</Link>
          </div>
        </div>
      </div>
    </div>
  )
}