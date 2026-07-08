import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import NewsletterForm from '@/components/ui/NewsletterForm'
import InstagramEmbed from '@/components/layout/InstagramEmbed'
import { siteSettings } from '@/lib/api'

const DISCOVER = [
  { label: 'Directory', href: '/directory' },
  { label: 'Events', href: '/events' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'List Your Business', href: '/list-your-business' },
]

const COMPANY = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Careers', href: '/careers' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
]

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
}
function TwitterIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
}
function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="currentColor" stroke="none"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
}
function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
}
function YouTubeIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
}
function TikTokIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.94a8.18 8.18 0 0 0 4.78 1.52V7.01a4.85 4.85 0 0 1-1.01-.32z"/></svg>
}

const IG_TILES = [
  { bg: 'from-primary-900 to-primary-700', label: 'Community' },
  { bg: 'from-primary-800 to-primary-600', label: 'Business' },
  { bg: 'from-primary-700 to-primary-500', label: 'Culture' },
  { bg: 'from-primary-950 to-primary-800', label: 'Diaspora' },
  { bg: 'from-primary-600 to-primary-400', label: 'Events' },
  { bg: 'from-primary-900 to-primary-600', label: 'Growth' },
]

export default async function Footer() {
  const site = await siteSettings.get().catch(() => null)

  const socials = [
    { label: 'Facebook',    href: site?.facebook_url,   icon: <FacebookIcon /> },
    { label: 'X (Twitter)', href: site?.twitter_url,    icon: <TwitterIcon /> },
    { label: 'Instagram',   href: site?.instagram_url,  icon: <InstagramIcon /> },
    { label: 'LinkedIn',    href: site?.linkedin_url,   icon: <LinkedInIcon /> },
    { label: 'YouTube',     href: site?.youtube_url,    icon: <YouTubeIcon /> },
    { label: 'TikTok',      href: site?.tiktok_url,     icon: <TikTokIcon /> },
  ].filter(s => s.href)

  const igUrl = site?.instagram_url || '#'
  const igHandle = site?.instagram_url
    ? '@' + site.instagram_url.replace(/\/$/, '').split('/').pop()
    : '@sankofax'

  return (
    <footer className="bg-charcoal text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <Logo variant="light" size="md" />
            <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
              {site?.footer_text || 'The global directory connecting the African diaspora with Black and African-owned businesses, services, and experiences worldwide.'}
            </p>

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-2 flex-wrap">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary-600 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-2">Stay in the loop</p>
              <NewsletterForm variant="dark" />
            </div>
          </div>

          {/* Discover */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Discover</h3>
            <ul className="space-y-2.5">
              {DISCOVER.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Instagram</h3>
              {site?.instagram_url && (
                <a href={igUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  {igHandle} &rarr;
                </a>
              )}
            </div>
            {site?.instagram_embed_code ? (
              <InstagramEmbed html={site.instagram_embed_code} />
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {IG_TILES.map((tile, i) => (
                  <a key={i} href={igUrl} target="_blank" rel="noopener noreferrer"
                    className={`h-24 rounded-lg bg-gradient-to-br ${tile.bg} flex items-end p-1.5 group overflow-hidden relative`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                    <span className="relative text-[9px] text-white/70 font-medium leading-none">{tile.label}</span>
                  </a>
                ))}
              </div>
            )}
            <p className="text-xs text-white/40 mt-3 leading-relaxed">
              Follow us on Instagram for community stories, business spotlights, and diaspora culture.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} {site?.site_name || 'SankofaX'}. All rights reserved.</p>
          <p>Built by the community, for the community.</p>
        </div>
      </div>
    </footer>
  )
}
