import type { Metadata } from 'next'
import Link from 'next/link'
import BlogCard from '@/components/ui/BlogCard'
import ServiceCard from '@/components/ui/ServiceCard'
import { getRecentPosts } from '@/lib/firestore/posts'
import { getActiveServices } from '@/lib/firestore/services'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

export const metadata: Metadata = {
  title: 'Prateeksha — Psychic Coach',
  description:
    'Psychic coaching and spiritual guidance with Prateeksha. Explore blog posts and coaching services.',
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Prateeksha — Psychic Coach',
    description:
      'Psychic coaching and spiritual guidance with Prateeksha. Explore blog posts and coaching services.',
    url: siteUrl,
    type: 'website',
    images: [`${siteUrl}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prateeksha — Psychic Coach',
    description:
      'Psychic coaching and spiritual guidance with Prateeksha. Explore blog posts and coaching services.',
    images: [`${siteUrl}/og-image.png`],
  },
}

export default async function HomePage() {
  const [recentPosts, services] = await Promise.all([
    getRecentPosts(3),
    getActiveServices(),
  ])

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-indigo-deep)] text-[var(--color-off-white)] py-24 px-6 text-center">
        <h1 className="font-[var(--font-heading)] text-5xl font-semibold mb-4">
          Prateeksha
        </h1>
        <p className="text-xl text-[var(--color-off-white)]/80 max-w-xl mx-auto">
          Psychic coaching &amp; spiritual guidance to help you trust your inner compass.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-md bg-[var(--color-gold-soft)] px-8 py-3 font-semibold text-[var(--color-indigo-deep)] hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-soft)]"
        >
          Book a Session
        </Link>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-indigo-deep)] mb-4">
          About Prateeksha
        </h2>
        <p className="text-[var(--color-charcoal)]/80 leading-relaxed">
          Prateeksha is a gifted psychic coach dedicated to helping you navigate life&apos;s
          transitions with clarity and confidence. Through intuitive readings and
          personalised coaching, she empowers you to align with your highest path.
        </p>
      </section>

      {/* Recent Blog Posts */}
      <section className="bg-[var(--color-off-white)] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-indigo-deep)]">
              Latest Posts
            </h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--color-indigo-deep)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-indigo-deep)] rounded-sm"
            >
              View all →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-[var(--color-charcoal)]/60">No posts yet — check back soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  coverImage={post.coverImage}
                  publishedAt={post.publishedAt.toDate()}
                  tags={post.tags}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-indigo-deep)]">
              Coaching Services
            </h2>
            <Link
              href="/services"
              className="text-sm font-medium text-[var(--color-indigo-deep)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-indigo-deep)] rounded-sm"
            >
              View all →
            </Link>
          </div>
          {services.length === 0 ? (
            <p className="text-[var(--color-charcoal)]/60">Services coming soon.</p>
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
      </section>
    </>
  )
}
