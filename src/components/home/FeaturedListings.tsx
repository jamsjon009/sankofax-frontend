import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ListingCard } from '@/types'
import ListingCardComponent from '@/components/listings/ListingCard'

export default function FeaturedListings({ listings }: { listings: ListingCard[] }) {
  if (!listings.length) return null

  return (
    <section className="bg-surface-2 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Businesses</h2>
            <p className="text-muted text-sm mt-1">Handpicked from across the diaspora</p>
          </div>
          <Link href="/directory?featured=true" className="btn-outline hidden sm:inline-flex gap-1.5">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.slice(0, 6).map(listing => (
            <ListingCardComponent key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/directory?featured=true" className="btn-outline gap-1.5">
            View all featured
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
