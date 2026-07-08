'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Logo from '@/components/ui/Logo'
import { auth, categories as categoriesApi, plans as plansApi } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import { COUNTRIES, countryToRegion } from '@/lib/countries'
import type { Category, Plan } from '@/types'

// ── Step schemas ──────────────────────────────────────────────
const accountSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min. 8 characters'),
  password2: z.string(),
  country: z.string().min(1, 'Select your country'),
}).refine(d => d.password === d.password2, { message: "Passwords don't match", path: ['password2'] })

const companySchema = z.object({
  company_name: z.string().min(2, 'Company name required'),
  company_description: z.string().min(10, 'Brief description required (min 10 chars)'),
  website: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
})

const listingSchema = z.object({
  listing_name: z.string().min(2, 'Listing name required'),
  category: z.string().min(1, 'Select a category'),
  city: z.string().min(1, 'City required'),
  country_listing: z.string().min(1, 'Select country'),
  description: z.string().min(20, 'Description required (min 20 chars)'),
})

type AccountForm = z.infer<typeof accountSchema>
type CompanyForm = z.infer<typeof companySchema>
type ListingForm = z.infer<typeof listingSchema>

const STEP_LABELS = ['Account', 'Verify Email', 'Company', 'Listing', 'Plan', 'Go Live']
const TOTAL_STEPS = 6

// ── Progress bar ──────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i + 1 < step ? 'bg-primary-700 border-primary-700 text-white' :
              i + 1 === step ? 'bg-white border-primary-700 text-primary-700' :
              'bg-white border-gray-200 text-gray-400'
            }`}>
              {i + 1 < step ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i + 1 === step ? 'text-primary-700 font-semibold' : 'text-muted'}`}>{label}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-700 rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function ListYourBusinessPage() {
  const [step, setStep] = useState(1)
  const [serverError, setServerError] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [cats, setCats] = useState<Category[]>([])
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([])
  const [userRegion, setUserRegion] = useState<'global_north' | 'global_south'>('global_north')

  // Form instances
  const accountForm = useForm<AccountForm>({ resolver: zodResolver(accountSchema) })
  const companyForm = useForm<CompanyForm>({ resolver: zodResolver(companySchema) })
  const listingForm = useForm<ListingForm>({ resolver: zodResolver(listingSchema) })

  // ── Step 1: Account ──
  async function submitAccount(data: AccountForm) {
    setServerError('')
    const region = countryToRegion(data.country)
    setUserRegion(region)
    try {
      const res = await auth.register({
        email: data.email,
        password: data.password,
        password2: data.password2,
        region,
        country: data.country,
        account_type: 'business',
      })
      tokenStore.set(res.access, res.refresh, res.user)
      setSubmittedEmail(data.email)
      setStep(2)
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Registration failed.')
    }
  }

  // ── Step 2: Email verification check ──
  async function checkVerification() {
    setServerError('')
    try {
      const token = tokenStore.getAccess()
      if (!token) { setServerError('Session expired. Please start again.'); setStep(1); return }
      const user = await auth.me(token)
      if (!user.is_verified) {
        setServerError('Your email is not verified yet. Please check your inbox.')
        return
      }
      // Load categories for step 4
      const c = await categoriesApi.list().catch(() => [])
      setCats(c)
      setStep(3)
    } catch {
      setServerError('Could not verify. Please try again.')
    }
  }

  // ── Step 5: Load plans ──
  async function proceedToPlans() {
    setServerError('')
    const p = await plansApi.list(userRegion).catch(() => [])
    setAvailablePlans(p)
    setStep(5)
  }

  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/"><Logo size="md" /></Link>
        </div>

        <ProgressBar step={step} />

        {/* ── STEP 1: Account ── */}
        {step === 1 && (
          <div className="card p-8">
            <h2 className="text-xl font-bold text-charcoal mb-1">Create Your Account</h2>
            <p className="text-muted text-sm mb-6">Sign up free in under 2 minutes</p>

            <form onSubmit={accountForm.handleSubmit(submitAccount)} className="space-y-4">
              {serverError && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{serverError}</p>}

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Email address</label>
                <input {...accountForm.register('email')} type="email" className="input" placeholder="you@example.com" />
                {accountForm.formState.errors.email && <p className="text-red-600 text-xs mt-1">{accountForm.formState.errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
                <select {...accountForm.register('country')} className="input">
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
                {accountForm.formState.errors.country && <p className="text-red-600 text-xs mt-1">{accountForm.formState.errors.country.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
                <input {...accountForm.register('password')} type="password" className="input" placeholder="Min. 8 characters" />
                {accountForm.formState.errors.password && <p className="text-red-600 text-xs mt-1">{accountForm.formState.errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Confirm Password</label>
                <input {...accountForm.register('password2')} type="password" className="input" placeholder="Repeat password" />
                {accountForm.formState.errors.password2 && <p className="text-red-600 text-xs mt-1">{accountForm.formState.errors.password2.message}</p>}
              </div>

              <button type="submit" disabled={accountForm.formState.isSubmitting} className="btn-primary w-full justify-center mt-2">
                {accountForm.formState.isSubmitting ? 'Creating account...' : 'Create Account & Continue'}
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-700 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: Email Verification ── */}
        {step === 2 && (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-charcoal mb-2">Verify your email</h2>
            <p className="text-muted text-sm mb-1">We sent a verification link to</p>
            <p className="font-semibold text-primary-700 mb-6">{submittedEmail}</p>
            <p className="text-xs text-muted mb-8">Click the link in the email, then come back here and click the button below.</p>

            {serverError && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{serverError}</p>}

            <button onClick={checkVerification} className="btn-primary w-full justify-center mb-3">
              I&apos;ve verified my email &rarr;
            </button>
            <button
              onClick={() => auth.resendVerification(submittedEmail).catch(() => {})}
              className="btn-ghost text-sm text-muted hover:text-primary-700"
            >
              Resend verification email
            </button>
          </div>
        )}

        {/* ── STEP 3: Company ── */}
        {step === 3 && (
          <div className="card p-8">
            <h2 className="text-xl font-bold text-charcoal mb-1">Add Your Company</h2>
            <p className="text-muted text-sm mb-6">Set up your company profile — you can update this anytime</p>

            <form onSubmit={companyForm.handleSubmit(() => setStep(4))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Company Name</label>
                <input {...companyForm.register('company_name')} className="input" placeholder="e.g. Ashanti Goods Ltd" />
                {companyForm.formState.errors.company_name && <p className="text-red-600 text-xs mt-1">{companyForm.formState.errors.company_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Company Description</label>
                <textarea {...companyForm.register('company_description')} rows={3} className="input" placeholder="Brief description of your company..." />
                {companyForm.formState.errors.company_description && <p className="text-red-600 text-xs mt-1">{companyForm.formState.errors.company_description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Website <span className="text-muted font-normal">(optional)</span></label>
                <input {...companyForm.register('website')} type="url" className="input" placeholder="https://yourcompany.com" />
                {companyForm.formState.errors.website && <p className="text-red-600 text-xs mt-1">{companyForm.formState.errors.website.message}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1 justify-center">Back</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Continue</button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 4: Listing ── */}
        {step === 4 && (
          <div className="card p-8">
            <h2 className="text-xl font-bold text-charcoal mb-1">Create a Listing</h2>
            <p className="text-muted text-sm mb-6">Fill in your business details and location</p>

            <form onSubmit={listingForm.handleSubmit(proceedToPlans)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Listing / Business Name</label>
                <input {...listingForm.register('listing_name')} className="input" placeholder="e.g. Ashanti Goods — Brixton Branch" />
                {listingForm.formState.errors.listing_name && <p className="text-red-600 text-xs mt-1">{listingForm.formState.errors.listing_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
                <select {...listingForm.register('category')} className="input">
                  <option value="">Select a category</option>
                  {cats.length > 0
                    ? cats.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)
                    : (
                      <>
                        <option value="food-drink">Food & Drink</option>
                        <option value="beauty-wellness">Beauty & Wellness</option>
                        <option value="fashion">Fashion & Clothing</option>
                        <option value="professional-services">Professional Services</option>
                        <option value="health">Health & Medicine</option>
                        <option value="tech">Technology</option>
                        <option value="arts-culture">Arts & Culture</option>
                        <option value="education">Education & Training</option>
                        <option value="finance">Finance & Banking</option>
                        <option value="travel">Travel & Hospitality</option>
                        <option value="retail">Retail & Shopping</option>
                        <option value="other">Other</option>
                      </>
                    )
                  }
                </select>
                {listingForm.formState.errors.category && <p className="text-red-600 text-xs mt-1">{listingForm.formState.errors.category.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">City</label>
                  <input {...listingForm.register('city')} className="input" placeholder="London" />
                  {listingForm.formState.errors.city && <p className="text-red-600 text-xs mt-1">{listingForm.formState.errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
                  <select {...listingForm.register('country_listing')} className="input">
                    <option value="">Select</option>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                  {listingForm.formState.errors.country_listing && <p className="text-red-600 text-xs mt-1">{listingForm.formState.errors.country_listing.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Business Description</label>
                <textarea {...listingForm.register('description')} rows={4} className="input" placeholder="Describe your business, products or services..." />
                {listingForm.formState.errors.description && <p className="text-red-600 text-xs mt-1">{listingForm.formState.errors.description.message}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(3)} className="btn-outline flex-1 justify-center">Back</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Continue</button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 5: Plan ── */}
        {step === 5 && (
          <div className="card p-8">
            <h2 className="text-xl font-bold text-charcoal mb-1">Choose a Plan</h2>
            <p className="text-muted text-sm mb-6">Start free or unlock more features. Upgrade anytime from your dashboard.</p>

            <div className="space-y-3 mb-6">
              {availablePlans.length > 0 ? availablePlans.map(plan => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(String(plan.id))}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedPlan === String(plan.id)
                      ? 'border-primary-700 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-charcoal">{plan.name}</p>
                      <p className="text-xs text-muted mt-0.5">{plan.description ?? ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-700">${plan.price}<span className="text-xs font-normal text-muted">/mo</span></p>
                    </div>
                  </div>
                </button>
              )) : (
                <>
                  {[
                    { id: 'free', name: 'Basic (Free)', price: '$0', desc: '1 listing, basic profile' },
                    { id: 'pro', name: 'Pro', price: userRegion === 'global_north' ? '$29' : '$14.50', desc: '5 listings, featured placement, analytics' },
                    { id: 'elite', name: 'Elite', price: userRegion === 'global_north' ? '$99' : '$24.50', desc: 'Unlimited listings, top placement, priority support' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedPlan === p.id
                          ? 'border-primary-700 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-charcoal">{p.name}</p>
                          <p className="text-xs text-muted mt-0.5">{p.desc}</p>
                        </div>
                        <p className="font-bold text-primary-700">{p.price}<span className="text-xs font-normal text-muted">/mo</span></p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>

            {!selectedPlan && <p className="text-amber-600 text-xs mb-4">Please select a plan to continue.</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(4)} className="btn-outline flex-1 justify-center">Back</button>
              <button
                type="button"
                disabled={!selectedPlan}
                onClick={() => setStep(6)}
                className="btn-primary flex-1 justify-center disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: Go Live ── */}
        {step === 6 && (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-9 h-9 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-charcoal mb-3">You&apos;re almost live!</h2>
            <p className="text-muted text-sm mb-2 max-w-sm mx-auto">
              Your listing has been submitted for review. We&apos;ll publish it within <strong>24 hours</strong>.
            </p>
            <p className="text-muted text-sm mb-8 max-w-sm mx-auto">
              You can add photos, update details, and manage your listing from your dashboard.
            </p>
            <Link href="/dashboard" className="btn-primary px-10 py-3 text-base justify-center">
              Go to Dashboard
            </Link>
            <p className="text-xs text-muted mt-5">Questions? Email us at <span className="text-primary-700">support@sankofax.com</span></p>
          </div>
        )}
      </div>
    </div>
  )
}
