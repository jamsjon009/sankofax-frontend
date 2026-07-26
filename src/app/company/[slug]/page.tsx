import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BadgeCheck, Globe, Mail, Phone, Calendar, Users, Instagram, Facebook, Twitter, Linkedin, Youtube, Sparkles } from 'lucide-react'
import { companies, listings } from '@/lib/api'
import ListingCard from '@/components/listings/ListingCard'

interface Props {
  params: Promise<{ slug: string }>
}

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram, facebook: Facebook, twitter: Twitter, linkedin: Linkedin, youtube: Youtube,
}

const SIZE_LABEL: Record<string, string> = {
  solo: 'Solo', '1-10': '1–10 employees', '11-50': '11–50 employees', '51+': '51+ employees',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const company = await companies.get(slug)
    return {
      title: company.company_name,
      description: `${company.company_name} on SankofaX — the global directory of Black & African-owned businesses.`,
    }
  } catch {
    return { title: 'Business Not Found' }
  }
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  const company = await companies.get(slug).catch(() => null)
  if (!company) notFound()

  const listingData = await listings.list({ company: slug }).catch(() => ({ results: [] }))
  const companyListings = listingData.results ?? []

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <div className="h-48 sm:h-60 bg-gradient-to-br from-primary-900 to-primary-700 relative">
        {company.cover_image && (
          <img src={company.cover_image} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="-mt-14 relative flex flex-col sm:flex-row sm:items-end gap-4 pb-6 border-b border-gray-100">
          <div className="w-24 h-24 rounded-2xl bg-white shadow-md overflow-hidden flex-shrink-0 flex items-center justify-center">
            {company.logo ? (
              <img src={company.logo} alt={company.company_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary-700">{company.company_name[0]}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal flex items-center gap-2">
              {company.company_name}
              {company.is_verified && <BadgeCheck className="w-6 h-6 text-primary-600 flex-shrink-0" />}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted">
              {company.founded_year && (
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Founded {company.founded_year}</span>
              )}
              {company.company_size && (
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {SIZE_LABEL[company.company_size] ?? company.company_size}</span>
              )}
            </div>
            {company.badges?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {company.badges.map(b => (
                  <span
                    key={b.slug}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border"
                    style={{ color: b.color || '#555', borderColor: (b.color || '#999') + '55', backgroundColor: (b.color || '#999') + '12' }}
                  >
                    {b.icon && <span aria-hidden>{b.icon}</span>}
                    {b.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
          {/* Main */}
          <div className="lg:col-span-8 space-y-8 min-w-0">
            {company.description && (
              <section>
                <h2 className="text-lg font-semibold text-charcoal mb-3">About</h2>
                <div
                  className="text-sm text-charcoal leading-relaxed [&_a]:text-primary-700 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: company.description }}
                />
              </section>
            )}

            {company.founder_story && (
              <section className="card p-6 bg-surface-2 border-l-4 border-primary-300">
                <h2 className="text-lg font-semibold text-charcoal mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" /> Founder Story
                </h2>
                <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line italic">{company.founder_story}</p>
              </section>
            )}

            {company.services_list?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-charcoal mb-3">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {company.services_list.map(s => (
                    <span key={s} className="badge bg-primary-50 text-primary-700 border border-primary-100 text-xs px-3 py-1">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Listings */}
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-4">
                Listings {companyListings.length > 0 && <span className="text-muted font-normal text-base">({companyListings.length})</span>}
              </h2>
              {companyListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {companyListings.map(l => <ListingCard key={l.id} listing={l} />)}
                </div>
              ) : (
                <p className="text-sm text-muted">No published listings yet.</p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5 space-y-3">
              <h3 className="font-semibold text-charcoal text-sm">Contact</h3>
              {company.contact_phone && (
                <a href={`tel:${company.contact_phone}`} className="flex items-center gap-2.5 text-sm text-charcoal hover:text-primary-700">
                  <Phone className="w-4 h-4 text-primary-600 flex-shrink-0" /> {company.contact_phone}
                </a>
              )}
              {company.contact_email && (
                <a href={`mailto:${company.contact_email}`} className="flex items-center gap-2.5 text-sm text-charcoal hover:text-primary-700 break-all">
                  <Mail className="w-4 h-4 text-primary-600 flex-shrink-0" /> {company.contact_email}
                </a>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-charcoal hover:text-primary-700">
                  <Globe className="w-4 h-4 text-primary-600 flex-shrink-0" /> Visit Website
                </a>
              )}

              {Object.keys(company.social_links || {}).length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
                  {Object.entries(company.social_links).map(([platform, url]) => {
                    const Icon = SOCIAL_ICONS[platform]
                    return (
                      <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={platform}
                        className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-primary-50 flex items-center justify-center text-muted hover:text-primary-700 transition-colors">
                        {Icon ? <Icon className="w-4 h-4" /> : <span className="text-xs font-semibold uppercase">{platform.slice(0, 2)}</span>}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            <Link href="/directory" className="btn-outline w-full justify-center">Back to Directory</Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
