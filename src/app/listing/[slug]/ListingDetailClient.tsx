'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import Link from 'next/link'
import {
  MapPin, Phone, Globe, Mail, MessageSquare, BadgeCheck,
  Clock, Share2, Heart, ChevronLeft, ChevronRight, Star,
  Users, Handshake, Sparkles,
  Instagram, Facebook, Twitter, Linkedin, Youtube,
} from 'lucide-react'
import type { ListingDetail, Review } from '@/types'
import StarRating from '@/components/ui/StarRating'
import ConnectModal from '@/components/connections/ConnectModal'
import { mediaUrl } from '@/lib/utils'

const SingleListingMap = lazy(() => import('@/components/map/SingleListingMap'))

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

export default function ListingDetailClient({
  listing,
  reviews,
}: {
  listing: ListingDetail
  reviews: Review[]
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const [connectKind, setConnectKind] = useState<'connect' | 'collaborate' | null>(null)
  const images = listing.gallery_images.map(g => g.image)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-charcoal">Home</Link>
        <span>/</span>
        <Link href="/directory" className="hover:text-charcoal">Directory</Link>
        <span>/</span>
        <Link href={`/category/${listing.category.slug}`} className="hover:text-charcoal">{listing.category.name}</Link>
        <span>/</span>
        <span className="text-charcoal font-medium truncate max-w-[200px]">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="relative rounded-2xl overflow-hidden bg-surface-2 aspect-[16/9]">
            {images.length > 0 ? (
              <img
                src={images[imgIdx]}
                alt={`${listing.title} photo ${imgIdx + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">🌍</div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge bg-primary-50 text-primary-700 border border-primary-100 text-[10px] font-semibold uppercase tracking-wide">
                  {listing.category.name}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-2 flex items-center gap-2">
                  {listing.title}
                  {listing.company_verified && (
                    <BadgeCheck className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {listing.review_count > 0 && (
                    <StarRating rating={listing.avg_rating} count={listing.review_count} size="md" />
                  )}
                  {listing.price_range && (
                    <span className="text-sm text-muted">{listing.price_range}</span>
                  )}
                  {listing.business_type_display && (
                    <span className="badge bg-surface-2 text-charcoal border border-gray-100 text-xs">
                      {listing.business_type_display}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.city}, {listing.country}
                  </div>
                </div>
                {listing.badges?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {listing.badges.map(b => (
                      <span
                        key={b.slug}
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border"
                        style={{ color: b.color || '#555', borderColor: (b.color || '#999') + '55', backgroundColor: (b.color || '#999') + '12' }}
                        title={b.description || b.name}
                      >
                        {b.icon && <span aria-hidden>{b.icon}</span>}
                        {b.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="btn-ghost p-2.5 rounded-xl border border-gray-200" aria-label="Save">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="btn-ghost p-2.5 rounded-xl border border-gray-200" aria-label="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-3">About</h2>
            <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
              {listing.full_description}
            </div>
          </div>

          {/* Founder Story */}
          {listing.company_founder_story && (
            <div className="card p-6 bg-surface-2 border-l-4 border-primary-300">
              <h2 className="text-lg font-semibold text-charcoal mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" /> Founder Story
              </h2>
              <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line italic">
                {listing.company_founder_story}
              </div>
            </div>
          )}

          {/* Services offered */}
          {listing.company_services?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-charcoal mb-3">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {listing.company_services.map(s => (
                  <span key={s} className="badge bg-primary-50 text-primary-700 border border-primary-100 text-xs px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {listing.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-charcoal mb-3">Features & Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map(a => (
                  <span key={a.id} className="badge bg-surface-2 text-charcoal border border-gray-100 text-xs px-3 py-1">
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Opening hours */}
          {Object.keys(listing.opening_hours).length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-charcoal mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                Opening Hours
              </h2>
              <div className="bg-surface-2 rounded-xl overflow-hidden">
                {DAYS.map(day => {
                  const hours = listing.opening_hours[day]
                  if (!hours) return null
                  return (
                    <div key={day} className="flex justify-between px-4 py-2.5 even:bg-white text-sm">
                      <span className="font-medium capitalize text-charcoal">{day}</span>
                      <span className={hours === 'Closed' ? 'text-muted' : 'text-charcoal'}>{hours}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Reviews */}
          <ReviewsSection reviews={reviews} listingSlug={listing.slug} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Connect & Collaborate */}
          <div className="card p-5 space-y-2.5">
            <h3 className="font-semibold text-charcoal text-sm">Get in touch</h3>
            <button onClick={() => setConnectKind('connect')} className="btn-primary w-full justify-center gap-2">
              <Users className="w-4 h-4" /> Connect
            </button>
            <button onClick={() => setConnectKind('collaborate')} className="btn-outline w-full justify-center gap-2">
              <Handshake className="w-4 h-4" /> Collaborate
            </button>
          </div>

          {/* Contact card */}
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-charcoal text-sm">Contact</h3>
            {listing.phone && (
              <a href={`tel:${listing.phone}`} className="flex items-center gap-2.5 text-sm text-charcoal hover:text-primary-700">
                <Phone className="w-4 h-4 text-primary-600 flex-shrink-0" />
                {listing.phone}
              </a>
            )}
            {listing.email && (
              <a href={`mailto:${listing.email}`} className="flex items-center gap-2.5 text-sm text-charcoal hover:text-primary-700">
                <Mail className="w-4 h-4 text-primary-600 flex-shrink-0" />
                {listing.email}
              </a>
            )}
            {listing.website && (
              <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-charcoal hover:text-primary-700">
                <Globe className="w-4 h-4 text-primary-600 flex-shrink-0" />
                Visit Website
              </a>
            )}
            {listing.whatsapp && (
              <a href={`https://wa.me/${listing.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-charcoal hover:text-primary-700">
                <MessageSquare className="w-4 h-4 text-primary-600 flex-shrink-0" />
                WhatsApp
              </a>
            )}
            {listing.website && (
              <a href={listing.website} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center mt-2">
                Visit Website
              </a>
            )}

            {Object.keys(listing.company_socials || {}).length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                {Object.entries(listing.company_socials).map(([platform, url]) => {
                  const Icon = SOCIAL_ICONS[platform]
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-primary-50 flex items-center justify-center text-muted hover:text-primary-700 transition-colors"
                    >
                      {Icon ? <Icon className="w-4 h-4" /> : <span className="text-xs font-semibold uppercase">{platform.slice(0, 2)}</span>}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="card p-5">
            <h3 className="font-semibold text-charcoal text-sm mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              Location
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-3">
              {[listing.address_line, listing.city, listing.state, listing.country].filter(Boolean).join(', ')}
            </p>
            {listing.latitude && listing.longitude && (
              <Suspense fallback={<div className="h-48 bg-surface-2 rounded-xl animate-pulse" />}>
                <SingleListingMap
                  latitude={Number(listing.latitude)}
                  longitude={Number(listing.longitude)}
                  title={listing.title}
                />
              </Suspense>
            )}
          </div>

          {/* Company */}
          <div className="card p-5">
            <h3 className="font-semibold text-charcoal text-sm mb-3">Business</h3>
            <div className="flex items-center gap-3">
              {listing.company_logo ? (
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                  <img src={listing.company_logo} alt={listing.company_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-bold text-sm">{listing.company_name[0]}</span>
                </div>
              )}
              <div>
                <Link href={`/company/${listing.company_slug}`} className="text-sm font-medium text-charcoal hover:text-primary-700">
                  {listing.company_name}
                </Link>
                {listing.company_verified && (
                  <p className="text-xs text-primary-600 flex items-center gap-0.5 mt-0.5">
                    <BadgeCheck className="w-3 h-3" /> Verified
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {connectKind && (
        <ConnectModal
          listingSlug={listing.slug}
          businessName={listing.company_name}
          kind={connectKind}
          onClose={() => setConnectKind(null)}
        />
      )}
    </div>
  )
}

function ReviewsSection({ reviews: initialReviews, listingSlug }: { reviews: Review[]; listingSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    const { tokenStore } = await import('@/lib/auth')
    const { myReviews } = await import('@/lib/api')
    const token = tokenStore.getAccess()
    if (!token) { setSubmitMsg('Sign in to leave a review.'); return }
    setSubmitting(true)
    try {
      const review = await myReviews.submitReview(token, listingSlug, { rating, title, body })
      setReviews(prev => [review, ...prev])
      setShowForm(false)
      setTitle('')
      setBody('')
      setRating(5)
      setSubmitMsg('Review submitted — it will appear once approved.')
    } catch {
      setSubmitMsg('Failed to submit review. You may have already reviewed this listing.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-charcoal">
          Reviews {reviews.length > 0 && <span className="text-muted font-normal text-base">({reviews.length})</span>}
        </h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-outline text-sm gap-1.5">
            <Star className="w-4 h-4" />
            Write a Review
          </button>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <div className="card p-5 mb-5 animate-fade-in">
          <h3 className="font-semibold text-charcoal text-sm mb-4">Your Review</h3>
          <form onSubmit={submitReview} className="space-y-4">
            {/* Star picker */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-2">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star className={`w-6 h-6 transition-colors ${i < (hoverRating || rating) ? 'fill-accent-400 text-accent-400' : 'text-gray-200 fill-gray-200'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="Summary of your experience" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5">Review</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} className="input min-h-[100px] resize-none" placeholder="Share your experience…" required />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {submitMsg && <p className="text-sm text-primary-700 mb-4 font-medium">{submitMsg}</p>}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted py-4">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-charcoal">{review.user_email.split('@')[0]}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-accent-400 text-accent-400' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-charcoal mt-1">{review.title}</h4>
                </div>
                <span className="text-xs text-muted flex-shrink-0">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-charcoal mt-2 leading-relaxed">{review.body}</p>
              {review.owner_reply && (
                <div className="mt-3 pl-3 border-l-2 border-primary-200">
                  <p className="text-xs font-semibold text-primary-700 mb-1">Owner&apos;s reply</p>
                  <p className="text-sm text-muted">{review.owner_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
