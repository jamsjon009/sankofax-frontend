'use client'

import { useFormContext } from 'react-hook-form'
import type { Category, Amenity } from '@/types'
import type { ListingFormData } from '../page'
import { cn } from '@/lib/utils'

const PRICE_RANGES = [
  { value: '$', label: '$ · Budget' },
  { value: '$$', label: '$$ · Mid-range' },
  { value: '$$$', label: '$$$ · Upscale' },
  { value: '$$$$', label: '$$$$ · Luxury' },
]

export default function StepDetails({
  categories,
  amenities,
}: {
  categories: Category[]
  amenities: Amenity[]
}) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ListingFormData>()
  const selectedAmenities = watch('amenity_ids') ?? []
  const priceRange = watch('price_range')

  function toggleAmenity(id: number) {
    const cur = selectedAmenities
    setValue(
      'amenity_ids',
      cur.includes(id) ? cur.filter(a => a !== id) : [...cur, id],
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-charcoal mb-1">Listing details</h2>
        <p className="text-sm text-muted mb-5">Describe your business so people know what to expect.</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Category *</label>
        <select {...register('category')} className="input">
          <option value="">Select a category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>}
      </div>

      {/* Business type */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Business Type *</label>
        <select {...register('business_type')} className="input">
          <option value="product">Product-based</option>
          <option value="service">Service-based</option>
          <option value="both">Product &amp; Service</option>
          <option value="nonprofit">Nonprofit / Community</option>
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Listing Title *</label>
        <input {...register('title')} className="input" placeholder="e.g. Roots & Greens Kitchen" />
        {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Short description */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          Short Description * <span className="text-muted font-normal">(shown on cards, max 300 chars)</span>
        </label>
        <textarea
          {...register('short_description')}
          className="input min-h-[80px] resize-none"
          placeholder="One punchy sentence about what makes your business special…"
          maxLength={300}
        />
        {errors.short_description && <p className="text-red-600 text-xs mt-1">{errors.short_description.message}</p>}
      </div>

      {/* Full description */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Full Description *</label>
        <textarea
          {...register('full_description')}
          className="input min-h-[160px] resize-y"
          placeholder="Tell the full story — your mission, what you offer, what makes you unique…"
        />
        {errors.full_description && <p className="text-red-600 text-xs mt-1">{errors.full_description.message}</p>}
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
          <input {...register('phone')} className="input" placeholder="+44 20 ..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">WhatsApp</label>
          <input {...register('whatsapp')} className="input" placeholder="+44 ..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
          <input {...register('email')} type="email" className="input" placeholder="hello@business.com" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Website</label>
          <input {...register('website')} className="input" placeholder="https://..." />
          {errors.website && <p className="text-red-600 text-xs mt-1">{errors.website.message}</p>}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Price Range <span className="text-muted font-normal">(optional)</span></label>
        <div className="flex gap-2 flex-wrap">
          {PRICE_RANGES.map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => setValue('price_range', priceRange === p.value ? '' : p.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm border transition-colors',
                priceRange === p.value
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'border-gray-200 text-muted hover:border-primary-300',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Features & Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenities.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAmenity(a.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs border transition-colors',
                  selectedAmenities.includes(a.id)
                    ? 'bg-primary-50 text-primary-700 border-primary-300 font-medium'
                    : 'border-gray-100 text-muted hover:border-primary-200',
                )}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
