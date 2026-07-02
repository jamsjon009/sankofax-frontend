import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { listings } from '@/lib/api'
import ListingDetailClient from './ListingDetailClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diaspora-directory.com'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const listing = await listings.get(params.slug)
    return {
      title: `${listing.title} | Diaspora Directory`,
      description: listing.short_description,
      openGraph: {
        title: listing.title,
        description: listing.short_description,
        images: listing.cover_image ? [listing.cover_image] : [],
        type: 'website',
        url: `${SITE_URL}/listing/${listing.slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: listing.title,
        description: listing.short_description,
        images: listing.cover_image ? [listing.cover_image] : [],
      },
      alternates: {
        canonical: `${SITE_URL}/listing/${listing.slug}`,
      },
    }
  } catch {
    return { title: 'Listing Not Found' }
  }
}

function buildJsonLd(listing: Awaited<ReturnType<typeof listings.get>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.title,
    description: listing.short_description,
    url: listing.website || `${SITE_URL}/listing/${listing.slug}`,
    telephone: listing.phone || undefined,
    email: listing.email || undefined,
    address: listing.address_line
      ? {
          '@type': 'PostalAddress',
          streetAddress: listing.address_line,
          addressLocality: listing.city,
          addressRegion: listing.state || undefined,
          postalCode: listing.postal_code || undefined,
          addressCountry: listing.country,
        }
      : {
          '@type': 'PostalAddress',
          addressLocality: listing.city,
          addressCountry: listing.country,
        },
    geo:
      listing.latitude && listing.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: listing.latitude,
            longitude: listing.longitude,
          }
        : undefined,
    image: listing.cover_image ? [listing.cover_image] : undefined,
    aggregateRating:
      listing.review_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: listing.avg_rating,
            reviewCount: listing.review_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    priceRange: listing.price_range || undefined,
  }
}

export default async function ListingPage({ params }: Props) {
  const listing = await listings.get(params.slug).catch(() => null)
  if (!listing) notFound()

  const reviewData = await listings.reviews(params.slug).catch(() => ({ results: [] }))
  const jsonLd = buildJsonLd(listing)

  return (
    <>
      <Script
        id="listing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingDetailClient listing={listing} reviews={reviewData.results} />
    </>
  )
}
