'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/api'

function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) setError('Invalid or missing reset token. Please request a new link.')
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== password2) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setStatus('loading')
    setError('')
    try {
      await auth.resetPassword(token, password, password2)
      setStatus('success')
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-charcoal mb-2">Password updated!</h2>
        <p className="text-muted text-sm mb-4">Redirecting you to sign in...</p>
        <Link href="/login" className="text-primary-700 hover:underline text-sm font-medium">Go to Sign In</Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-charcoal mb-2">Set a new password</h1>
        <p className="text-muted text-sm">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">New password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="input w-full"
          />
        </div>
        <div>
          <label htmlFor="password2" className="block text-sm font-medium text-charcoal mb-1.5">Confirm password</label>
          <input
            id="password2"
            type="password"
            required
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            placeholder="Repeat your password"
            className="input w-full"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !token}
          className="btn-primary w-full py-3 font-semibold disabled:opacity-60"
        >
          {status === 'loading' ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        <Link href="/forgot-password" className="text-primary-700 hover:underline font-medium">Request a new link</Link>
      </p>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-sand-50">
      <div className="card max-w-md w-full p-8">
        <Suspense fallback={<div className="text-center text-muted py-8">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}