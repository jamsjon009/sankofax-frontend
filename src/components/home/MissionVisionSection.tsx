import type { HomeContent } from '@/lib/api'

export default function MissionVisionSection({ content }: { content?: HomeContent | null }) {
  const missionTitle = content?.mission_title || 'Our Mission'
  const missionBody = content?.mission_body ||
    'To build the most comprehensive and trusted global directory of Black and African-owned businesses, empowering entrepreneurs to reach a worldwide audience while helping consumers make intentional purchasing decisions that strengthen the diaspora economy.'
  const visionTitle = content?.vision_title || 'Our Vision'
  const visionBody = content?.vision_body ||
    'A thriving global ecosystem where Black and African-owned businesses are visible, supported, and celebrated — where the diaspora community can find, trust, and invest in businesses that reflect their values and heritage.'

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8 border-l-4 border-primary-600">
          <h2 className="text-xl font-bold text-charcoal mb-3">{missionTitle}</h2>
          <p className="text-muted text-sm leading-relaxed">
            {missionBody}
          </p>
        </div>
        <div className="card p-8 border-l-4 border-accent-500">
          <h2 className="text-xl font-bold text-charcoal mb-3">{visionTitle}</h2>
          <p className="text-muted text-sm leading-relaxed">
            {visionBody}
          </p>
        </div>
      </div>
    </section>
  )
}