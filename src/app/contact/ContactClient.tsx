'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { contact, type SiteSettings } from '@/lib/api'
import Link from 'next/link'
import { Mail, MapPin, Phone, Clock, CheckCircle2, Send, ArrowRight } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type Form = z.infer<typeof schema>

interface Props {
  site: SiteSettings | null
}

export default function ContactClient({ site }: Props) {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: Form) {
    await contact.send({ name: data.name, email: data.email, message: `${data.subject}\n\n${data.message}` })
      .catch(() => {})
    setSent(true)
  }

  const contactItems = [
    site?.contact_email && {
      icon: Mail, label: 'Email',
      value: site.contact_email,
      href: `mailto:${site.contact_email}`,
    },
    site?.contact_phone && {
      icon: Phone, label: 'Phone',
      value: site.contact_phone,
      href: `tel:${site.contact_phone.replace(/\s/g, '')}`,
    },
    site?.contact_address && {
      icon: MapPin, label: 'Address',
      value: site.contact_address,
      href: null,
    },
    {
      icon: Clock, label: 'Response Time',
      value: site?.response_time || 'Within 24–48 hours',
      href: null,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string | null }[]

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/70 max-w-lg text-lg">
            Have a question, partnership idea, or need support? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — contact info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-charcoal mb-1">Get in Touch</h2>
              <p className="text-muted text-sm leading-relaxed">
                Whether you are a business owner looking to list, a community member with feedback, or a
                partner interested in collaboration — we are here.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="space-y-4">
              {contactItems.map(item => {
                const Icon = item.icon
                const inner = (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-2 border border-gray-100 hover:border-primary-200 transition-colors h-full">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-charcoal break-words">{item.value}</p>
                    </div>
                  </div>
                )
                return item.href ? (
                  <a key={item.label} href={item.href} className="block">{inner}</a>
                ) : (
                  <div key={item.label}>{inner}</div>
                )
              })}
            </div>
          </div>

          {/* Right — contact form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="card p-10 text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-charcoal">Message Sent!</h2>
                <p className="text-muted text-sm max-w-sm">
                  Thank you for reaching out. We will get back to you at your email{' '}
                  {site?.response_time ? `within ${site.response_time.toLowerCase()}` : 'within 24–48 hours'}.
                </p>
                <Link href="/" className="btn-primary mt-2">Back to Home</Link>
              </div>
            ) : (
              <div className="card p-8">
                <h2 className="text-xl font-bold text-charcoal mb-1">Send a Message</h2>
                <p className="text-muted text-sm mb-6">Fill in the form below and we will respond promptly.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name *</label>
                    <input {...register('name')} className="input" placeholder="Your full name" />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Email *</label>
                      <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Subject *</label>
                      <input {...register('subject')} className="input" placeholder="How can we help?" />
                      {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Message *</label>
                    <textarea {...register('message')} className="input min-h-[160px] resize-y" placeholder="Write your message here..." />
                    {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center gap-2 py-3">
                    {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Map — full width */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {site?.map_embed_code ? (
            <div
              className="[&_iframe]:block [&_iframe]:w-full [&_iframe]:h-96 [&_iframe]:border-0"
              dangerouslySetInnerHTML={{ __html: site.map_embed_code }}
            />
          ) : (
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 h-80 flex flex-col items-center justify-center gap-3 relative">
              <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
                {[
                  [60,80],[80,60],[120,90],[160,70],[200,80],[240,75],[280,85],[320,70],[360,80],
                  [50,120],[100,110],[150,130],[200,120],[260,115],[310,125],[370,110],
                  [80,150],[140,160],[190,155],[240,145],[300,155],[350,150],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#047857" />
                ))}
              </svg>
              <MapPin className="w-10 h-10 text-primary-600 relative z-10" />
              <div className="text-center relative z-10">
                <p className="text-sm font-semibold text-charcoal">Global Reach</p>
                <p className="text-xs text-muted">Serving 54+ countries across the diaspora</p>
              </div>
            </div>
          )}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100">
            <span className="text-xs text-muted">Diaspora-first, globally connected</span>
            <span className="badge bg-primary-50 text-primary-700 border border-primary-100 text-[10px]">Global</span>
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="bg-surface-2 border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-charcoal mb-1">Looking for quick answers?</h3>
            <p className="text-muted text-sm">Check our FAQ page before sending a message.</p>
          </div>
          <Link href="/faqs" className="btn-outline gap-2 flex-shrink-0">
            Browse FAQs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-primary-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join the Directory. Be Seen. Be Supported. Be SankofaX.
          </h2>
          <Link href="/directory" className="inline-flex items-center gap-2 btn-primary bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold px-8 py-3 rounded-xl">
            Explore the Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
