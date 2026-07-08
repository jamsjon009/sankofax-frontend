'use client'
import { useState } from 'react'
import Link from 'next/link'
import { auth } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await auth.forgotPassword(email)
      setStatus('sent')
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-sand-50">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-charcoal mb-2">Check your inbox</h2>
          <p className="text-muted text-sm mb-6">
            We sent a password reset link to <strong>{email}</strong>. Check your spam folder if you do not see it.
          </p>
          <Link href="/login" className="btn-outline w-full text-center block">
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-sand-50">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-charcoal mb-2">Reset your password</h1>
          <p className="text-muted text-sm">Enter your email and we will send you a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">Email address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input w-full"
            />
          </div>

          {(status === 'error') && (
            <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary w-full py-3 font-semibold disabled:opacity-60"
          >
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-primary-700 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}