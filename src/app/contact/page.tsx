'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { contact } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})
type Form = z.infer<typeof schema>

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })

  async function onSubmit(data: Form) {
    await contact.send(data)
    setSent(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-charcoal mb-2">Contact Us</h1>
      <p className="text-muted mb-8">We&apos;d love to hear from you.</p>

      {sent ? (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-4">✉️</p>
          <h2 className="text-xl font-semibold text-charcoal mb-2">Message sent!</h2>
          <p className="text-muted text-sm">We&apos;ll get back to you within 24–48 hours.</p>
        </div>
      ) : (
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Name</label>
              <input {...register('name')} className="input" placeholder="Your name" />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Message</label>
              <textarea {...register('message')} className="input min-h-[140px] resize-y" placeholder="How can we help?" />
              {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
