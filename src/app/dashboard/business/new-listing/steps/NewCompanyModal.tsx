'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { myCompanies } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import type { CompanyProfile } from '@/types'

const schema = z.object({
  company_name: z.string().min(2),
  description: z.string().optional(),
  founder_story: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
})
type Form = z.infer<typeof schema>

export default function NewCompanyModal({
  onCreated,
  onClose,
}: {
  onCreated: (c: CompanyProfile) => void
  onClose: () => void
}) {
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: Form) {
    const token = tokenStore.getAccess()
    if (!token) return
    setError('')
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v) })
      const company = await myCompanies.create(token, fd)
      onCreated(company)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create company')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-card-lg p-7 w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-charcoal">New Company</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Company Name *</label>
            <input {...register('company_name')} className="input" placeholder="e.g. Roots & Greens Kitchen" />
            {errors.company_name && <p className="text-red-600 text-xs mt-1">{errors.company_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Short Description</label>
            <textarea {...register('description')} className="input min-h-[80px] resize-none" placeholder="What does your company do?" />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Founder Story <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea {...register('founder_story')} className="input min-h-[80px] resize-none" placeholder="How and why did you start? Shown on your business profile." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Website</label>
              <input {...register('website')} className="input" placeholder="https://..." />
              {errors.website && <p className="text-red-600 text-xs mt-1">{errors.website.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Contact Email</label>
              <input {...register('contact_email')} type="email" className="input" placeholder="you@company.com" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? 'Creating…' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
