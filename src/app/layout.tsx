import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

async function getSiteSettings() {
  try {
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'
    const res = await fetch(`${BASE}/site-settings/`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json() as Promise<{
      google_tag_manager_id: string
      google_analytics_id: string
      google_search_console_code: string
    }>
  } catch {
    return null
  }
}

export const metadata: Metadata = {
  title: {
    default: 'SankofaX - Global Black & African Business Directory',
    template: '%s | SankofaX',
  },
  description: 'Find Black-owned and African businesses, wellness retreats, healthcare providers, tech companies, and more worldwide.',
  keywords: ['Black-owned businesses', 'African diaspora', 'Black directory', 'African businesses worldwide'],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: 'SankofaX',
    title: 'SankofaX - Global Black & African Business Directory',
    description: 'Discover, support, and connect with Black and African-owned businesses across the diaspora.',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings()
  const gtmId = site?.google_tag_manager_id?.trim()
  const ga4Id = site?.google_analytics_id?.trim()
  const gscCode = site?.google_search_console_code?.trim()

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Search Console verification */}
        {gscCode && <meta name="google-site-verification" content={gscCode} />}

        {/* Google Tag Manager — <head> snippet */}
        {gtmId && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}

        {/* GA4 direct (only if no GTM) */}
        {!gtmId && ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${ga4Id}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* GTM noscript fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0" width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}