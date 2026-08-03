import { Eye, Award, Users, Megaphone, BarChart2 } from 'lucide-react'
import type { HomeContent } from '@/lib/api'

const ICONS = [Eye, Award, Users, Megaphone, BarChart2]

const BENEFITS = [
  {
    icon: Eye,
    title: 'Visibility',
    desc: 'Get discovered by thousands of diaspora customers actively searching for Black and African-owned businesses.',
  },
  {
    icon: Award,
    title: 'Credibility',
    desc: 'Build trust with verified listings, reviews, and a professional profile that showcases your brand.',
  },
  {
    icon: Users,
    title: 'Connection',
    desc: 'Connect with a global community that wants to support, invest in, and grow with your business.',
  },
  {
    icon: Megaphone,
    title: 'Promotion',
    desc: 'Amplify your reach through our newsletter, social channels, and featured listing opportunities.',
  },
  {
    icon: BarChart2,
    title: 'Performance Insights',
    desc: 'Track views, clicks, and leads with your business dashboard to understand your audience better.',
  },
]

export default function WhyListSection({ content }: { content?: HomeContent | null }) {
  const title = content?.why_list_title || 'Why List Your Brand?'
  const subtitle = content?.why_list_subtitle ||
    'SankofaX gives your business the platform it deserves — connecting you with a community that actively seeks out and supports Black and African-owned brands.'
  const benefits = content?.why_list_benefits?.length
    ? content.why_list_benefits.map((b, i) => ({ ...b, icon: ICONS[i] ?? Eye }))
    : BENEFITS

  return (
    <section className="bg-surface-2 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">{title}</h2>
          <p className="text-muted max-w-xl mx-auto text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <div key={b.title || i} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="font-semibold text-charcoal text-sm mb-2">{b.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{b.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}