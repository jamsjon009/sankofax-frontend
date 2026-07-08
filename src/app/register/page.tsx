'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Logo from '@/components/ui/Logo'
import { auth } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import { COUNTRIES, countryToRegion } from '@/lib/countries'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password2: z.string(),
  country: z.string().min(1, 'Please select your country'),
}).refine(d => d.password === d.password2, {
  message: "Passwords don't match",
  path: ['password2'],
})
type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: Form) {
    setServerError('')
    const region = countryToRegion(data.country)
    try {
      const res = await auth.register({ email: data.email, password: data.password, password2: data.password2, region, country: data.country })
      tokenStore.set(res.access, res.refresh, res.user)
      setSubmittedEmail(data.email)
      setEmailSent(true)
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Registration failed. Please try again.')
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6"><Logo /></div>
          <div className="card p-10">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-charcoal mb-2">Check your inbox</h2>
            <p className="text-muted text-sm mb-1">We sent a verification link to</p>
            <p className="font-semibold text-primary-700 text-sm mb-6">{submittedEmail}</p>
            <p className="text-xs text-muted mb-6">Click the link in the email to verify your account, then you can sign in.</p>
            <button
              onClick={() => auth.resendVerification(submittedEmail).catch(() => {})}
              className="btn-ghost text-sm text-primary-700 hover:underline"
            >
              Didn&apos;t receive it? Resend email
            </button>
            <div className="mt-4">
              <Link href="/login" className="btn-primary w-full justify-center">
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Logo /></div>
          <h1 className="text-2xl font-bold text-charcoal">Create your account</h1>
          <p className="text-muted text-sm mt-1">Join the diaspora community &mdash; it&apos;s free</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {serverError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
              <select {...register('country')} className="input">
                <option value="">Select your country</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
              <input {...register('password')} type="password" className="input" placeholder="Min. 8 characters" />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Confirm Password</label>
              <input {...register('password2')} type="password" className="input" placeholder="Repeat password" />
              {errors.password2 && <p className="text-red-600 text-xs mt-1">{errors.password2.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center mt-2">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-700 font-medium hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-sm text-muted mt-2">
            Want to list your business?{' '}
            <Link href="/list-your-business" className="text-primary-700 font-medium hover:underline">Start here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}