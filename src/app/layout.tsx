import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import NavBar from '@/components/ui/NavBar'
import Footer from '@/components/ui/Footer'
import './globals.css'

// Serif font for headings
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// Clean sans-serif for body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { template: '%s | Prateeksha', default: 'Prateeksha — Psychic Coach' },
  description: 'Psychic coaching and spiritual guidance with Prateeksha.',
  openGraph: { siteName: 'Prateeksha', type: 'website' },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Prateeksha',
  url: siteUrl,
  description: 'Psychic coaching and spiritual guidance with Prateeksha.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
