import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { pages } from '@/lib/api'

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return null
  }
}

/**
 * Renders an admin-editable static/legal page (Terms, Privacy, Cookies).
 * Content comes from the backend `Page` model via GET /api/pages/<slug>/.
 */
export default async function LegalPage({
  slug,
  fallbackTitle,
}: {
  slug: string
  fallbackTitle: string
}) {
  const page = await pages.get(slug).catch(() => null)
  const title = page?.title ?? fallbackTitle
  const updated = formatDate(page?.updated_at)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{title}</h1>
          {updated && (
            <p className="text-white/60 text-sm">Last updated {updated}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {page ? (
            <div
              className="prose prose-lg max-w-none prose-headings:text-charcoal prose-a:text-primary-700 prose-strong:text-charcoal"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="text-muted">
              This page hasn&apos;t been published yet. Please check back soon.
            </p>
          )}
        </div>
      </section>

      {/* Still need help */}
      <section className="bg-surface-2 border-t border-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-charcoal mb-1">Questions about this policy?</h3>
            <p className="text-muted text-sm">Reach out and our team will get back to you.</p>
          </div>
          <Link href="/contact" className="btn-primary gap-2 flex-shrink-0">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
