import NewsletterForm from '@/components/ui/NewsletterForm'
import type { HomeContent } from '@/lib/api'

export default function NewsletterSection({ content }: { content?: HomeContent | null }) {
  const title = content?.newsletter_title || 'Stay Connected'
  const subtitle = content?.newsletter_subtitle ||
    'New listings, events, and diaspora news — no spam, unsubscribe anytime.'

  return (
    <section className="bg-primary-950 text-white py-14">
      <div className="max-w-lg mx-auto px-4 text-center">
        <span className="text-3xl">🌱</span>
        <h2 className="text-2xl font-bold mt-3 mb-2">{title}</h2>
        <p className="text-white/60 text-sm mb-6">
          {subtitle}
        </p>
        <NewsletterForm variant="dark" />
      </div>
    </section>
  )
}
