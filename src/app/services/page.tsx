import type { Metadata } from 'next'
import ServiceCard from '@/components/ui/ServiceCard'
import { getActiveServices } from '@/lib/firestore/services'
import { siteConfig } from '@/lib/config'
import type { Service } from '@/lib/firestore/utils'

// ─── ISR: revalidate every 60 seconds ────────────────────────────────────────
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Psychic Coaching Services — Book a Session with Prateeksha',
  description:
    "Explore Soul Compass's psychic coaching services — intuitive readings, energy healing, tarot, and spiritual life coaching with Prateeksha. Personalised sessions available online worldwide.",
  alternates: { canonical: `${siteConfig.url}/services` },
  openGraph: {
    title: 'Psychic Coaching Services | Soul Compass',
    description:
      "Intuitive readings, energy healing, tarot, and spiritual life coaching with Prateeksha. Book your personalised session today.",
    url: `${siteConfig.url}/services`,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Soul Compass Coaching Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psychic Coaching Services | Soul Compass',
    description:
      "Intuitive readings, energy healing, tarot, and spiritual life coaching with Prateeksha.",
    images: [siteConfig.ogImage],
  },
}

function buildServicesJsonLd(services: Service[], baseUrl: string): object[] {
  return services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    offers: { '@type': 'Offer', price: s.price, priceCurrency: 'USD' },
    provider: { '@type': 'Person', name: siteConfig.coachName, url: baseUrl },
    url: `${baseUrl}/services`,
  }))
}

export default async function ServicesPage() {
  const services = await getActiveServices()
  const jsonLd = buildServicesJsonLd(services, siteConfig.url)

  return (
    <div className="bg-[var(--color-cream)] min-h-screen">
      {services.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Page header */}
      <div className="bg-[var(--color-plum-deep)] text-[var(--color-cream)] py-16 sm:py-20 px-4 sm:px-6 text-center">
        <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
          Work With Prateeksha
        </p>
        <h1 className="font-[var(--font-heading)] text-4xl sm:text-5xl font-semibold mb-3 sm:mb-4">
          Find the Session That Fits
        </h1>
        <p className="text-[var(--color-cream)]/65 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Every offering is designed around one goal: giving you the clarity to move forward with confidence. Choose the format that feels right — or reach out and Prateeksha will help you decide.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-charcoal)]/50 text-lg mb-4">New sessions coming soon.</p>
            <p className="text-[var(--color-charcoal)]/35 text-sm">
              In the meantime, <a href="/contact" className="text-[var(--color-lavender)] hover:underline">get in touch</a> to discuss what you need.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  name={service.name}
                  description={service.description}
                  duration={service.duration}
                  price={service.price}
                  bookingLink={service.bookingLink}
                />
              ))}
            </div>

            <div className="mt-12 sm:mt-16 rounded-2xl bg-[var(--color-mist)] border border-[var(--color-lavender)]/12 p-6 sm:p-8 text-center">
              <p className="font-[var(--font-heading)] text-xl sm:text-2xl text-[var(--color-plum-deep)] mb-3">
                Not sure which session is right for you?
              </p>
              <p className="text-[var(--color-charcoal)]/60 mb-6 max-w-lg mx-auto">
                Drop Prateeksha a message and she&apos;ll point you in the right direction — no obligation, no sales pitch.
              </p>
              <a
                href="/contact"
                className="inline-block rounded-md bg-[var(--color-plum-deep)] px-7 py-3 text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity"
              >
                Ask Prateeksha
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
