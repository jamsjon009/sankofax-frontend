'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { tokenStore } from '@/lib/auth'
import { categories as catApi, amenities as amenityApi, myListings } from '@/lib/api'
import type { Category, Amenity } from '@/types'
import { cn } from '@/lib/utils'

const PRICE_RANGES = [
  { value: '$', label: '$ - Budget' },
  { value: '$$', label: '$$ - Mid-range' },
  { value: '$$$', label: '$$$ - Upscale' },
  { value: '$$$$', label: '$$$$ - Luxury' },
]

const COUNTRIES = [
  'United Kingdom', 'United States', 'Nigeria', 'Ghana', 'Kenya', 'South Africa',
  'Canada', 'France', 'Germany', 'Netherlands', 'Belgium', 'Italy', 'Spain',
  'Ethiopia', 'Uganda', 'Tanzania', 'Senegal', 'Cameroon', 'Ivory Coast',
  'Jamaica', 'Trinidad and Tobago', 'Barbados', 'Haiti', 'Brazil', 'Colombia',
  'Australia', 'New Zealand', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Other',
]

const schema = z.object({
  category: z.coerce.number().min(1, 'Select a category'),
  title: z.string().min(3).max(200),
  short_description: z.string().min(10).max(300),
  full_description: z.string().min(20),
  price_range: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  amenity_ids: z.array(z.number()).optional(),
  address_line: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  country: z.string().min(2),
  postal_code: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

type FormData = z.infer<typeof schema>

export default function EditListingPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saved, setSaved] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const selectedAmenities = watch('amenity_ids') ?? []
  const priceRange = watch('price_range')

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) return

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'}/listings/${slug}/`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      }),
      catApi.list(),
      amenityApi.list(),
    ])
      .then(([listing, catsData, amsData]) => {
        setAllCategories(Array.isArray(catsData) ? catsData : [])
        setAllAmenities(Array.isArray(amsData) ? amsData : [])
        reset({
          category: listing.category?.id ?? listing.category,
          title: listing.title,
          short_description: listing.short_description,
          full_description: listing.full_description,
          price_range: listing.price_range ?? '',
          phone: listing.phone ?? '',
          email: listing.email ?? '',
          website: listing.website ?? '',
          whatsapp: listing.whatsapp ?? '',
          amenity_ids: listing.amenities?.map((a: Amenity) => a.id) ?? [],
          address_line: listing.address_line ?? '',
          city: listing.city ?? '',
          state: listing.state ?? '',
          country: listing.country ?? '',
          postal_code: listing.postal_code ?? '',
          latitude: listing.latitude ?? undefined,
          longitude: listing.longitude ?? undefined,
        })
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingData(false))
  }, [slug, reset])

  async function onSubmit(data: FormData) {
    const token = tokenStore.getAccess()
    if (!token) return
    setServerError('')
    try {
      await myListings.update(token, slug, data)
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch {
      setServerError('Failed to save changes. Please try again.')
    }
  }

  function toggleAmenity(id: number) {
    setValue(
      'amenity_ids',
      selectedAmenities.includes(id)
        ? selectedAmenities.filter(a => a !== id)
        : [...selectedAmenities, id],
    )
  }

  if (loadingData) {
    return (
      <DashboardShell>
        <div className="max-w-2xl space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      </DashboardShell>
    )
  }

  if (notFound) {
    return (
      <DashboardShell>
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-charcoal mb-2">Listing not found</h2>
          <p className="text-sm text-muted mb-4">This listing does not exist or you do not have permission to edit it.</p>
          <Link href="/dashboard/business" className="btn-primary">Back to My Listings</Link>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/business" className="btn-ghost p-2 rounded-xl text-muted hover:text-charcoal -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Edit Listing</h1>
            <p className="text-sm text-muted mt-0.5">Changes will be reviewed before going live if currently pending.</p>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-xl mb-5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Changes saved successfully.
          </div>
        )}

        {serverError && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-charcoal border-b border-gray-100 pb-3">Listing Details</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Category *</label>
              <select {...register('category')} className="input">
                <option value="">Select a category</option>
                {allCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Listing Title *</label>
              <input {...register('title')} className="input" placeholder="e.g. Roots and Greens Kitchen" />
              {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Short Description * <span className="text-muted font-normal">(max 300 chars)</span>
              </label>
              <textarea
                {...register('short_description')}
                className="input min-h-[80px] resize-none"
                maxLength={300}
              />
              {errors.short_description && <p className="text-red-600 text-xs mt-1">{errors.short_description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Full Description *</label>
              <textarea {...register('full_description')} className="input min-h-[160px] resize-y" />
              {errors.full_description && <p className="text-red-600 text-xs mt-1">{errors.full_description.message}</p>}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-charcoal border-b border-gray-100 pb-3">Contact & Details</h2>

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
                <input {...register('email')} type="email" className="input" />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Website</label>
                <input {...register('website')} className="input" placeholder="https://..." />
                {errors.website && <p className="text-red-600 text-xs mt-1">{errors.website.message}</p>}
              </div>
            </div>

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

            {allAmenities.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Features & Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {allAmenities.map(a => (
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

          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-charcoal border-b border-gray-100 pb-3">Location</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Street Address</label>
              <input {...register('address_line')} className="input" placeholder="123 Example Street" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">City *</label>
                <input {...register('city')} className="input" />
                {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">State / Region</label>
                <input {...register('state')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Country *</label>
                <select {...register('country')} className="input">
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Postal Code</label>
                <input {...register('postal_code')} className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Map Coordinates <span className="text-muted font-normal">(optional)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input {...register('latitude')} type="number" step="any" className="input" placeholder="Latitude" />
                <input {...register('longitude')} type="number" step="any" className="input" placeholder="Longitude" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/dashboard/business" className="btn-outline gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <button type="submit" disabled={isSubmitting} className="btn-primary gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
