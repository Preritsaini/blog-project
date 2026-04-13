import type { Metadata } from 'next'
import Link from 'next/link'
import BlogCard from '@/components/ui/BlogCard'
import ServiceCard from '@/components/ui/ServiceCard'
import { getRecentPosts } from '@/lib/firestore/posts'
import { getActiveServices } from '@/lib/firestore/services'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default async function HomePage() {
  const [recentPosts, services] = await Promise.all([
    getRecentPosts(3),
    getActiveServices(),
  ])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative bg-[var(--color-indigo-deep)] text-[var(--color-off-white)] overflow-hidden"
      >
        {/* Subtle radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(201,168,76,0.12),transparent_70%)]"
        />

        <div className="relative max-w-4xl mx-auto px-6 py-32 text-center">
          <p className="text-[var(--color-gold-soft)] text-sm font-semibold uppercase tracking-widest mb-4">
            Welcome to {siteConfig.name}
          </p>
          <h1 className="font-[var(--font-heading)] text-5xl sm:text-7xl font-semibold mb-6 leading-tight">
            Find Your Path.<br />
            <span className="text-[var(--color-gold-soft)]">Trust Your Soul.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-off-white)]/75 max-w-2xl mx-auto leading-relaxed mb-10">
            Psychic coaching and spiritual guidance with{' '}
            <span className="text-[var(--color-off-white)] font-medium">Prateeksha</span>.
            Intuitive readings, energy healing, and personalised sessions to help you
            navigate life with clarity and confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="rounded-md bg-[var(--color-gold-soft)] px-8 py-3.5 font-semibold text-[var(--color-indigo-deep)] hover:opacity-90 transition-opacity"
            >
              Book a Session
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-[var(--color-off-white)]/25 px-8 py-3.5 font-semibold text-[var(--color-off-white)] hover:bg-[var(--color-off-white)]/10 transition-colors"
            >
              Meet Prateeksha
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────────────────── */}
      <section
        aria-label="Credentials"
        className="bg-[var(--color-charcoal)] text-[var(--color-off-white)]/70 py-5 px-6"
      >
        <ul className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-widest list-none m-0 p-0">
          {siteConfig.about.credentials.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span className="text-[var(--color-gold-soft)]">✦</span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* ── About teaser ─────────────────────────────────────────────────── */}
      <section aria-label="About Prateeksha" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder — replace with real image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-indigo-deep)]/10 flex items-center justify-center order-last md:order-first">
            <div className="text-center px-8">
              <p className="font-[var(--font-heading)] text-5xl text-[var(--color-indigo-deep)]/20 mb-2">✦</p>
              <p className="text-sm text-[var(--color-charcoal)]/30">Photo of Prateeksha</p>
            </div>
          </div>

          <div>
            <p className="text-[var(--color-gold-soft)] text-sm font-semibold uppercase tracking-widest mb-3">
              Your Guide
            </p>
            <h2 className="font-[var(--font-heading)] text-4xl sm:text-5xl font-semibold text-[var(--color-indigo-deep)] mb-6 leading-tight">
              {siteConfig.about.headline}
            </h2>
            <p className="text-[var(--color-charcoal)]/75 leading-relaxed text-lg mb-6">
              {siteConfig.about.bio[0]}
            </p>
            <p className="text-[var(--color-charcoal)]/65 leading-relaxed mb-8">
              {siteConfig.about.bio[1]}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-indigo-deep)] hover:text-[var(--color-gold-soft)] transition-colors"
            >
              Read full story
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services Preview ─────────────────────────────────────────────── */}
      <section aria-label="Coaching services" className="bg-[var(--color-off-white)] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[var(--color-gold-soft)] text-sm font-semibold uppercase tracking-widest mb-3">
              Work With Prateeksha
            </p>
            <h2 className="font-[var(--font-heading)] text-4xl font-semibold text-[var(--color-indigo-deep)]">
              Coaching Services
            </h2>
          </div>

          {services.length === 0 ? (
            <p className="text-center text-[var(--color-charcoal)]/60">Services coming soon.</p>
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

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-block rounded-md border border-[var(--color-indigo-deep)]/30 px-6 py-2.5 text-sm font-semibold text-[var(--color-indigo-deep)] hover:bg-[var(--color-indigo-deep)]/5 transition-colors"
            >
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recent Blog Posts ────────────────────────────────────────────── */}
      <section aria-label="Latest blog posts" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[var(--color-gold-soft)] text-sm font-semibold uppercase tracking-widest mb-3">
                Insights & Wisdom
              </p>
              <h2 className="font-[var(--font-heading)] text-4xl font-semibold text-[var(--color-indigo-deep)]">
                Latest Posts
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline text-sm font-medium text-[var(--color-indigo-deep)] hover:text-[var(--color-gold-soft)] transition-colors"
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

          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--color-indigo-deep)] hover:text-[var(--color-gold-soft)] transition-colors"
            >
              View all posts →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section
        aria-label="Call to action"
        className="bg-[var(--color-indigo-deep)] text-[var(--color-off-white)] py-20 px-6 text-center"
      >
        <h2 className="font-[var(--font-heading)] text-4xl sm:text-5xl font-semibold mb-4">
          Ready to Begin?
        </h2>
        <p className="text-[var(--color-off-white)]/70 text-lg max-w-xl mx-auto mb-8">
          Book a session with Prateeksha and take the first step toward the clarity
          and direction you deserve.
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-md bg-[var(--color-gold-soft)] px-10 py-4 font-semibold text-[var(--color-indigo-deep)] hover:opacity-90 transition-opacity text-base"
        >
          Book a Session
        </Link>
      </section>
    </>
  )
}
