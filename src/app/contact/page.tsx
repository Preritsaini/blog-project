import type { Metadata } from 'next'
import ContactForm from '@/components/ui/ContactForm'
import { siteConfig } from '@/lib/config'

// ─── SSG: fully static — no dynamic data ─────────────────────────────────────
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Book a Psychic Coaching Session — Contact Prateeksha',
  description:
    'Ready to get clarity? Reach out to Prateeksha at Soul Compass to book a psychic coaching session, ask a question, or find out which service is right for you. Online sessions available worldwide.',
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: {
    title: 'Contact Prateeksha | Soul Compass',
    description:
      'Book a psychic coaching session or ask a question. Online sessions available worldwide.',
    url: `${siteConfig.url}/contact`,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Contact Soul Compass' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Prateeksha | Soul Compass',
    description: 'Book a psychic coaching session or ask a question. Online sessions available worldwide.',
    images: [siteConfig.ogImage],
  },
}

export default function ContactPage() {
  return (
    <div className="bg-[var(--color-cream)] min-h-screen">
      {/* Page header */}
      <div className="bg-[var(--color-plum-deep)] text-[var(--color-cream)] py-16 sm:py-20 px-4 sm:px-6 text-center">
        <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
          Let&apos;s Talk
        </p>
        <h1 className="font-[var(--font-heading)] text-4xl sm:text-5xl font-semibold mb-3 sm:mb-4">
          Your First Step Starts Here
        </h1>
        <p className="text-[var(--color-cream)]/65 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Whether you&apos;re ready to book or just want to ask a question first — this is the right place. Prateeksha reads every message personally.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-10 sm:mb-12 text-center">
          {[
            { stat: '500+', label: 'Sessions' },
            { stat: '10+', label: 'Years' },
            { stat: '48h', label: 'Response' },
          ].map(({ stat, label }) => (
            <div key={label} className="rounded-xl bg-[var(--color-mist)] border border-[var(--color-lavender)]/12 py-4 sm:py-5 px-2 sm:px-3">
              <p className="font-[var(--font-heading)] text-xl sm:text-2xl font-semibold text-[var(--color-plum-deep)]">{stat}</p>
              <p className="text-xs text-[var(--color-charcoal)]/50 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <ContactForm />

        <p className="mt-8 text-xs text-center text-[var(--color-charcoal)]/35 leading-relaxed">
          Your message is private and will only be read by Prateeksha. She typically responds within 48 hours.
        </p>
      </div>
    </div>
  )
}
