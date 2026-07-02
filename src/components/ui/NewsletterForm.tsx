'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { newsletter } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function NewsletterForm({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      await newsletter.subscribe(email)
      setState('done')
      setEmail('')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className={cn('text-sm', variant === 'dark' ? 'text-accent-300' : 'text-primary-600')}>
        ✓ You&apos;re on the list!
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className={cn(
          'flex-1 px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-primary-500',
          variant === 'dark'
            ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
            : 'bg-white border-gray-200 text-charcoal placeholder:text-muted',
        )}
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary px-3 py-2 rounded-xl"
        aria-label="Subscribe"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  )
}
