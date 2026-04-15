import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import NavBar from '@/components/ui/NavBar'
import Footer from '@/components/ui/Footer'
import DynamicStyles from '@/components/ui/DynamicStyles'
import ExitIntentPopup from '@/components/ui/ExitIntentPopup'
import StickyBookBar from '@/components/ui/StickyBookBar'
import { getSiteSettings } from '@/lib/firestore/settings'
import { siteConfig } from '@/lib/config'
import './globals.css'

// ─── ISR: revalidate layout (colours, settings) every 60 seconds ─────────────
export const revalidate = 60

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#4A365A',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  keywords: [
    'psychic coach',
    'psychic coaching',
    'spiritual life coach',
    'intuitive healer',
    'Reiki master',
    'tarot reading',
    'astrology reading',
    'energy healing',
    'spiritual guidance',
    'online psychic',
    'Prateeksha',
    'Soul Compass',
  ],
  authors: [{ name: siteConfig.coachName, url: siteConfig.url }],
  creator: siteConfig.coachName,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: { canonical: siteConfig.url },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.coachName,
  url: siteConfig.url,
  jobTitle: siteConfig.tagline,
  sameAs: Object.values(siteConfig.links),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <DynamicStyles settings={settings} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-plum-deep)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-cream)]"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <ExitIntentPopup />
        <StickyBookBar />
      </body>
    </html>
  )
}
