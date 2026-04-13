import type { Metadata } from 'next'
import ServiceCard from '@/components/ui/ServiceCard'
import { getActiveServices } from '@/lib/firestore/services'
import type { Service } from '@/lib/firestore/utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

export const metadata: Metadata = {
  title: 'Coaching Services',
  description:
    'Explore Prateeksha\'s psychic coaching and consultancy services. Find the right session for your spiritual journey.',
  alternates: { canonical: `${siteUrl}/services` },
  openGraph: {
    title: 'Coaching Services | Prateeksha',
    description:
      'Explore Prateeksha\'s psychic coaching and consultancy services.',
    url: `${siteUrl}/services`,
    type: 'website',
    images: [`${siteUrl}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coaching Services | Prateeksha',
    description:
      'Explore Prateeksha\'s psychic coaching and consultancy services.',
    images: [`${siteUrl}/og-image.png`],
  },
}

function buildServicesJsonLd(services: Service[], baseUrl: string): object {
  return services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    provider: {
      '@type': 'Person',
      name: 'Prateeksha',
      url: baseUrl,
    },
    url: `${baseUrl}/services`,
  }))
}

export default async function ServicesPage() {
  const services = await getActiveServices()
  const jsonLd = buildServicesJsonLd(services, siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-[var(--font-heading)] text-4xl font-semibold text-[var(--color-indigo-deep)] mb-10">
          Coaching Services
        </h1>

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
