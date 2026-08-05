'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Camera, Loader2, MapPin, CalendarDays, Ticket, Inbox, Heart, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { useAuth } from '@/hooks/useAuth'
import { tokenStore, refreshAccessToken } from '@/lib/auth'
import { mediaUrl } from '@/lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

const schema = z.object({
  bio: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  date_of_birth: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
})
type Form = z.infer<typeof schema>

export default function ProfilePage() {
  const { user, refresh } = useAuth()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const values = watch()

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
          date_of_birth: data.date_of_birth ?? '',
          instagram: data.social_links?.instagram ?? '',
          twitter: data.social_links?.twitter ?? '',
          linkedin: data.social_links?.linkedin ?? '',
          website: data.social_links?.website ?? '',
        })
      })
  }, [reset])

  // Profile completeness — encourage users to fill things in.
  const completeness = useMemo(() => {
    const checks = [
      !!user?.avatar,
      !!values.bio,
      !!values.city || !!values.country,
      !!values.date_of_birth,
      !!(values.instagram || values.twitter || values.linkedin || values.website),
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [user?.avatar, values.bio, values.city, values.country, values.date_of_birth, values.instagram, values.twitter, values.linkedin, values.website])

  const MAX_MB = 10

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const token = tokenStore.getAccess()
    if (!token) return
    setError('')

    // Client-side guards for fast, clear feedback.
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG or WebP).')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please upload a file under ${MAX_MB}MB.`)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const doUpload = (auth: string) =>
        fetch(`${BASE}/auth/me/`, { method: 'PATCH', headers: { Authorization: `Bearer ${auth}` }, body: fd })
      let res = await doUpload(token)
      // Access token expired mid-session? Refresh once and retry.
      if (res.status === 401) {
        const fresh = await refreshAccessToken()
        if (fresh) res = await doUpload(fresh)
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as Record<string, unknown>))
        const msg = Array.isArray(data.avatar) ? data.avatar[0] : (data.detail ?? 'Could not upload your photo. Please try another image.')
        throw new Error(String(msg))
      }
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload your photo. Please try another image.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function onSubmit(data: Form) {
    const token = tokenStore.getAccess()
    if (!token) return
    setError('')
    const body = JSON.stringify({
      bio: data.bio,
      country: data.country,
      city: data.city,
      date_of_birth: data.date_of_birth || null,
      social_links: {
        instagram: data.instagram,
        twitter: data.twitter,
        linkedin: data.linkedin,
        website: data.website,
      },
    })
    const doSave = (auth: string) =>
      fetch(`${BASE}/profile/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth}` },
        body,
      })
    try {
      let res = await doSave(token)
      if (res.status === 401) {
        const fresh = await refreshAccessToken()
        if (fresh) res = await doSave(fresh)
      }
      if (!res.ok) throw new Error()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save profile. Please try again.')
    }
  }

  const avatarUrl = user?.avatar ? mediaUrl(user.avatar) : null
  const initial = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Your Profile</h1>
          <p className="text-muted text-sm mt-1">Add a photo, bio, and links so the community can get to know you</p>
        </div>

        {/* Profile header card with cover + avatar */}
        <div className="card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-900" />
          <div className="px-5 pb-5">
            <div className="flex items-end gap-4 -mt-10">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl ring-4 ring-white bg-primary-100 overflow-hidden flex items-center justify-center shadow-sm">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Your avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-primary-700">{initial}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                  aria-label="Change photo"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-charcoal" /> : <Camera className="w-3.5 h-3.5 text-charcoal" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
              </div>
              <div className="pb-1 min-w-0">
                <p className="font-semibold text-charcoal truncate">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 capitalize font-medium">
                    {user?.role?.replace('_', ' ')}
                  </span>
                  {user?.region && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-2 text-muted capitalize">
                      {user.region.replace('_', ' ')}
                    </span>
                  )}
                  {user?.is_verified && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Completeness meter */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted">Profile completeness</span>
                <span className="font-semibold text-charcoal">{completeness}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick links to activity */}
        <div className="grid grid-cols-3 gap-3">
          <QuickLink href="/dashboard/saved" icon={Heart} label="Saved" />
          <QuickLink href="/dashboard/tickets" icon={Ticket} label="Tickets" />
          <QuickLink href="/dashboard/inbox" icon={Inbox} label="Inbox" />
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
                <label className="text-sm font-medium text-charcoal mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted" /> City
                </label>
                <input {...register('city')} className="input" placeholder="e.g. London" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Country</label>
                <input {...register('country')} className="input" placeholder="e.g. United Kingdom" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-charcoal mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-muted" /> Date of birth
              </label>
              <input {...register('date_of_birth')} type="date" className="input" />
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

function QuickLink({ href, icon: Icon, label }: { href: string; icon: typeof Heart; label: string }) {
  return (
    <Link href={href} className="card p-4 flex flex-col items-center gap-1.5 group hover:border-primary-200">
      <Icon className="w-5 h-5 text-primary-600" />
      <span className="text-xs font-medium text-charcoal">{label}</span>
      <ArrowRight className="w-3 h-3 text-muted group-hover:text-primary-700 transition-colors" />
    </Link>
  )
}
