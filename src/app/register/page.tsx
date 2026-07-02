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

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password2: z.string(),
  region: z.enum(['global_north', 'global_south']),
}).refine(d => d.password === d.password2, {
  message: "Passwords don't match",
  path: ['password2'],
})
type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { region: 'global_north' },
  })

  async function onSubmit(data: Form) {
    setServerError('')
    try {
      const res = await auth.register(data)
      tokenStore.set(res.access, res.refresh, res.user)
      router.push('/dashboard')
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Logo /></div>
          <h1 className="text-2xl font-bold text-charcoal">Create your account</h1>
          <p className="text-muted text-sm mt-1">Join the diaspora community — it&apos;s free</p>
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
              <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
              <input {...register('password')} type="password" className="input" placeholder="Min. 8 characters" />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Confirm Password</label>
              <input {...register('password2')} type="password" className="input" placeholder="Repeat password" />
              {errors.password2 && <p className="text-red-600 text-xs mt-1">{errors.password2.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Your Region</label>
              <select {...register('region')} className="input">
                <option value="global_north">Global North (US, UK, Europe, Canada, Australia…)</option>
                <option value="global_south">Global South (Africa, Caribbean, South America…)</option>
              </select>
              <p className="text-xs text-muted mt-1">Used to show you the right pricing tier</p>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center mt-2">
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-700 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
