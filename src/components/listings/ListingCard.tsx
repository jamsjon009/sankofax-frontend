import Link from 'next/link'
import Image from 'next/image'
import { MapPin, BadgeCheck } from 'lucide-react'
import type { ListingCard as TListingCard } from '@/types'
import StarRating from '@/components/ui/StarRating'
import { cn } from '@/lib/utils'

interface Props {
  listing: TListingCard
  className?: string
}

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"%3E%3Crect width="400" height="260" fill="%23f0fdf4"/%3E%3Ctext x="200" y="140" font-family="system-ui" font-size="48" fill="%2316a34a" text-anchor="middle"%3E🌍%3C/text%3E%3C/svg%3E'

export default function ListingCard({ listing, className }: Props) {
  return (
    <Link href={`/listing/${listing.slug}`} className={cn('card block overflow-hidden group', className)}>
      {/* Image */}
      <div className="relative h-48 bg-surface-2 overflow-hidden">
        <Image
          src={listing.cover_image ?? PLACEHOLDER}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {listing.featured && (
          <div className="absolute top-3 left-3">
            <span className="badge bg-accent-500 text-white text-[10px] font-semibold tracking-wide uppercase shadow-sm">
              Featured
            </span>
          </div>
        )}
        {listing.price_range && (
          <div className="absolute bottom-3 right-3">
            <span className="badge bg-white/90 text-charcoal text-xs font-medium backdrop-blur-sm shadow-sm">
              {listing.price_range}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category badge */}
        <span className="badge bg-primary-50 text-primary-700 text-[10px] font-semibold uppercase tracking-wide mb-2">
          {listing.category_name}
        </span>

        {/* Title + verified */}
        <div className="flex items-start gap-1.5 mt-1">
          <h3 className="font-semibold text-charcoal text-base leading-snug line-clamp-1 flex-1">
            {listing.title}
          </h3>
          {listing.company_verified && (
            <BadgeCheck className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
          )}
        </div>

        <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
          {listing.short_description}
        </p>

        {/* Footer row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>{listing.city}, {listing.country}</span>
          </div>
          {listing.review_count > 0 && (
            <StarRating rating={listing.avg_rating} count={listing.review_count} />
          )}
        </div>
      </div>
    </Link>
  )
}
