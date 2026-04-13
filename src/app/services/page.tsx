import type { Metadata } from 'next'
import ServiceCard from '@/components/ui/ServiceCard'
import { getActiveServices } from '@/lib/firestore/services'
import { siteConfig } from '@/lib/config'
import type { Service } from '@/lib/firestore/utils'

export const metadata: Metadata = {
  title: 'Coaching Services',
  description:
    "Explore Prateeksha's psychic coaching and consultancy services. Find the right session for your spiritual journey.",
  alternates: { canonical: `${siteConfig.url}/services` },
  openGraph: {
    title: `Coaching Services | ${siteConfig.name}`,
    description: "Explore Prateeksha's psychic coaching and consultancy services.",
    url: `${siteConfig.url}/services`,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Coaching Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Coaching Services | ${siteConfig.name}`,
    description: "Explore Prateeksha's psychic coaching and consultancy services.",
    images: [siteConfig.ogImage],
  },
}

function buildServicesJsonLd(services: Service[], baseUrl: string): object[] {
  return services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    offers: {
      '@type': 'Offer',
      price: s.price,
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Person',
      name: siteConfig.coachName,
      url: baseUrl,
    },
    url: `${baseUrl}/services`,
  }))
}

export default async function ServicesPage() {
  const services = await getActiveServices()
  const jsonLd = buildServicesJsonLd(services, siteConfig.url)

  return (
    <>
      {services.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="font-[var(--font-heading)] text-5xl font-semibold text-[var(--color-indigo-deep)] mb-3">
            Coaching Services
          </h1>
          <p className="text-[var(--color-charcoal)]/60 text-lg">
            Personalised sessions to help you align with your highest path.
          </p>
        </header>

        {services.length === 0 ? (
          <p className="text-[var(--color-charcoal)]/60">
            Services coming soon — please check back later.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        )}
      </div>
    </>
  )
}
