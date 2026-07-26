'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import VerificationBadge from '@/components/ui/VerificationBadge'
import type { ListingCard as TListingCard } from '@/types'
import StarRating from '@/components/ui/StarRating'
import { cn } from '@/lib/utils'

interface Props {
  listing: TListingCard
  className?: string
}

export default function ListingCard({ listing, className }: Props) {
  const images = listing.gallery_images?.length ? listing.gallery_images : []
  const [idx, setIdx] = useState(0)

  function prev(e: React.MouseEvent) {
    e.preventDefault()
    setIdx(i => (i - 1 + images.length) % images.length)
  }
  function next(e: React.MouseEvent) {
    e.preventDefault()
    setIdx(i => (i + 1) % images.length)
  }

  return (
    <Link href={`/listing/${listing.slug}`} className={cn('card block overflow-hidden group', className)}>
      {/* Image / Carousel */}
      <div className="relative h-48 bg-surface-2 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[idx]}
            alt={`${listing.title} photo ${idx + 1}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🌍</div>
        )}

        {/* Carousel controls — only when multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.preventDefault(); setIdx(i) }}
                  className={cn('w-1.5 h-1.5 rounded-full transition-colors', i === idx ? 'bg-white' : 'bg-white/40')}
                />
              ))}
            </div>
          </>
        )}
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
          <VerificationBadge
            level={listing.company_verification_level}
            label={listing.company_verification_label}
            showLabel={false}
            className="flex-shrink-0 mt-0.5"
          />
        </div>

        <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
          {listing.short_description}
        </p>

        {/* Ownership / identity badges */}
        {listing.badges?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {listing.badges.slice(0, 3).map(b => (
              <span
                key={b.slug}
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
                style={{ color: b.color || '#555', borderColor: (b.color || '#999') + '55', backgroundColor: (b.color || '#999') + '12' }}
                title={b.name}
              >
                {b.icon && <span aria-hidden>{b.icon}</span>}
                {b.name}
              </span>
            ))}
            {listing.badges.length > 3 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-muted bg-surface-2 border border-gray-200">
                +{listing.badges.length - 3}
              </span>
            )}
          </div>
        )}

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
