'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { useAuth } from '@/hooks/useAuth'
import { tokenStore } from '@/lib/auth'
import { categories, amenities, myCompanies, myListings } from '@/lib/api'
import type { Category, Amenity, CompanyProfile } from '@/types'
import { cn } from '@/lib/utils'

import StepCompany from './steps/StepCompany'
import StepDetails from './steps/StepDetails'
import StepLocation from './steps/StepLocation'
import StepPhotos from './steps/StepPhotos'
import StepReview from './steps/StepReview'

const STEPS = [
  { id: 1, label: 'Company' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Location' },
  { id: 4, label: 'Photos' },
  { id: 5, label: 'Review' },
]

// Full form schema
const schema = z.object({
  // Step 1
  company: z.string().uuid('Select a company'),
  // Step 2
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
  // Step 3
  address_line: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  country: z.string().min(2),
  postal_code: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

export type ListingFormData = z.infer<typeof schema>

const STEP_FIELDS: Record<number, (keyof ListingFormData)[]> = {
  1: ['company'],
  2: ['category', 'title', 'short_description', 'full_description'],
  3: ['city', 'country'],
  4: [],
  5: [],
}

export default function NewListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userCompanies, setUserCompanies] = useState<CompanyProfile[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [ams, setAms] = useState<Amenity[]>([])
  const [createdListingId, setCreatedListingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const methods = useForm<ListingFormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  })

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) return
    Promise.all([
      myCompanies.list(token),
      categories.list(),
      amenities.list(),
    ]).then(([comps, c, a]) => {
      setUserCompanies(comps)
      setCats(c)
      setAms(a)
    }).catch(() => {})
  }, [])

  async function validateAndNext() {
    const fields = STEP_FIELDS[step] ?? []
    const ok = fields.length === 0 || await methods.trigger(fields)
    if (ok) setStep(s => s + 1)
  }

  async function onSubmit(data: ListingFormData) {
    const token = tokenStore.getAccess()
    if (!token) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const payload = {
        ...data,
        listing_status: 'pending_review',
      }
      const listing = await myListings.create(token, payload)
      setCreatedListingId(listing.id)
      setStep(6) // success state
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to create listing. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 6) {
    return (
      <DashboardShell>
        <div className="card p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Listing submitted!</h2>
          <p className="text-muted text-sm mb-6">
            Your listing is under review. We typically approve listings within 24 hours.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => router.push('/dashboard/business')} className="btn-primary w-full justify-center">
              Back to My Listings
            </button>
            <button onClick={() => { setStep(1); setCreatedListingId(null); methods.reset() }} className="btn-outline w-full justify-center">
              Add Another Listing
            </button>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-charcoal">Add a New Listing</h1>
          <p className="text-muted text-sm mt-1">Step {step} of {STEPS.length}</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                  step === s.id
                    ? 'bg-primary-700 text-white border-primary-700'
                    : step > s.id
                    ? 'bg-primary-100 text-primary-700 border-primary-200 cursor-pointer hover:bg-primary-200'
                    : 'bg-white text-muted border-gray-200 cursor-default',
                )}
              >
                {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
              </button>
              <span className={cn('text-xs hidden sm:block', step === s.id ? 'font-semibold text-charcoal' : 'text-muted')}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className={cn('flex-1 h-px w-6', step > s.id ? 'bg-primary-200' : 'bg-gray-100')} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <FormProvider {...methods}>
          <div className="card p-7">
            {step === 1 && <StepCompany companies={userCompanies} />}
            {step === 2 && <StepDetails categories={cats} amenities={ams} />}
            {step === 3 && <StepLocation />}
            {step === 4 && <StepPhotos listingId={createdListingId} />}
            {step === 5 && (
              <StepReview
                companies={userCompanies}
                categories={cats}
                submitting={submitting}
                error={submitError}
                onSubmit={methods.handleSubmit(onSubmit)}
              />
            )}

            {/* Navigation */}
            {step < 5 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="btn-outline disabled:opacity-40"
                >
                  Back
                </button>
                <button type="button" onClick={validateAndNext} className="btn-primary">
                  {step === 4 ? 'Review & Submit' : 'Continue'}
                </button>
              </div>
            )}
          </div>
        </FormProvider>
      </div>
    </DashboardShell>
  )
}
