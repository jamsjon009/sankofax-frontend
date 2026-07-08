import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { categories, listings } from '@/lib/api'
import ListingCardComponent from '@/components/listings/ListingCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const cat = await categories.get(slug)
    return {
      title: cat.name,
      description: cat.description || `Browse ${cat.name} listings across the African diaspora.`,
    }
  } catch {
    return { title: 'Category' }
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = await categories.get(slug).catch(() => null)
  if (!cat) notFound()

  const data = await listings.list({ category: slug }).catch(() => ({ results: [], count: 0 }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-950 to-primary-800 text-white rounded-3xl px-8 py-12 mb-10 overflow-hidden">
        {cat.cover_image && (
          <img
            src={cat.cover_image}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{cat.name}</h1>
          {cat.description && (
            <p className="text-white/70 text-lg max-w-xl">{cat.description}</p>
          )}
          <p className="mt-4 text-white/50 text-sm">{data.count} listing{data.count !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: cat.name,
            description: cat.description,
            numberOfItems: data.count,
          }),
        }}
      />

      {data.results.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-4">🌍</p>
          <p className="text-lg font-medium text-charcoal mb-2">No listings yet</p>
          <p>Be the first to add a {cat.name} listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.results.map(l => <ListingCardComponent key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
