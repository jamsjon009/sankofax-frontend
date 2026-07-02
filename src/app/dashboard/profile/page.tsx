'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Camera } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { useAuth } from '@/hooks/useAuth'
import { tokenStore } from '@/lib/auth'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

const schema = z.object({
  bio: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
})
type Form = z.infer<typeof schema>

export default function ProfilePage() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) return
    fetch(`${BASE}/profile/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        reset({
          bio: data.bio ?? '',
          country: data.country ?? '',
          city: data.city ?? '',
          instagram: data.social_links?.instagram ?? '',
          twitter: data.social_links?.twitter ?? '',
          linkedin: data.social_links?.linkedin ?? '',
          website: data.social_links?.website ?? '',
        })
      })
  }, [reset])

  async function onSubmit(data: Form) {
    const token = tokenStore.getAccess()
    if (!token) return
    setError('')
    try {
      await fetch(`${BASE}/profile/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bio: data.bio,
          country: data.country,
          city: data.city,
          social_links: {
            instagram: data.instagram,
            twitter: data.twitter,
            linkedin: data.linkedin,
            website: data.website,
          },
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save profile. Please try again.')
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Your Profile</h1>
          <p className="text-muted text-sm mt-1">Manage your personal info and social links</p>
        </div>

        {/* Avatar */}
        <div className="card p-5 flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
              <span className="text-xl font-bold text-primary-700">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50">
              <Camera className="w-3.5 h-3.5 text-charcoal" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-charcoal">{user?.email}</p>
            <p className="text-xs text-muted capitalize mt-0.5">
              {user?.role?.replace('_', ' ')} · {user?.region?.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Bio</label>
              <textarea
                {...register('bio')}
                className="input min-h-[100px] resize-none"
                placeholder="Tell the community about yourself…"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">City</label>
                <input {...register('city')} className="input" placeholder="e.g. London" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
                <input {...register('country')} className="input" placeholder="e.g. United Kingdom" />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm font-semibold text-charcoal mb-4">Social Links</p>
              <div className="space-y-3">
                {[
                  { name: 'instagram' as const, label: 'Instagram', placeholder: '@yourhandle' },
                  { name: 'twitter' as const, label: 'X / Twitter', placeholder: '@yourhandle' },
                  { name: 'linkedin' as const, label: 'LinkedIn', placeholder: 'linkedin.com/in/you' },
                  { name: 'website' as const, label: 'Website', placeholder: 'https://yourwebsite.com' },
                ].map(field => (
                  <div key={field.name} className="flex items-center gap-3">
                    <label className="text-sm text-muted w-24 flex-shrink-0">{field.label}</label>
                    <input {...register(field.name)} className="input flex-1" placeholder={field.placeholder} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved && (
                <span className="text-sm text-green-600 font-medium">✓ Profile saved</span>
              )}
              <div className="ml-auto">
                <button type="submit" disabled={isSubmitting} className="btn-primary gap-2">
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardShell>
  )
}
