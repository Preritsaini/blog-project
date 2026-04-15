import type { Metadata } from 'next'
import Link from 'next/link'
import BlogCard from '@/components/ui/BlogCard'
import ServiceCard from '@/components/ui/ServiceCard'
import Reveal from '@/components/ui/Reveal'
import SocialProofTicker from '@/components/ui/SocialProofTicker'
import { getRecentPosts } from '@/lib/firestore/posts'
import { getActiveServices } from '@/lib/firestore/services'
import { getSiteSettings } from '@/lib/firestore/settings'
import { siteConfig } from '@/lib/config'

// ─── ISR: revalidate every 60 seconds ────────────────────────────────────────
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  const url = siteConfig.url
  const ogImg = s.ogImage || siteConfig.ogImage
  return {
    title: `${s.siteName} — ${s.tagline}`,
    description: s.siteDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${s.siteName} — ${s.tagline}`,
      description: s.siteDescription,
      url,
      type: 'website',
      images: [{ url: ogImg, width: 1200, height: 630, alt: s.siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${s.siteName} — ${s.tagline}`,
      description: s.siteDescription,
      images: [ogImg],
    },
  }
}

export default async function HomePage() {
  const [s, recentPosts, services] = await Promise.all([
    getSiteSettings(),
    getRecentPosts(3),
    getActiveServices(),
  ])

  const credentials = s.credentials
    .split('\n')
    .map((c) => c.trim())
    .filter(Boolean)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative bg-[var(--color-plum-deep)] text-[var(--color-cream)] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#35223a]/80" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(201,168,106,0.2),transparent_70%)]"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36 text-center">
          <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 sm:mb-4">
            Welcome to {s.siteName}
          </p>
          <h1 className="font-[var(--font-heading)] text-4xl sm:text-5xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
            {s.heroHeadline}<br />
            <span className="text-[var(--color-gold)]">{s.heroSubheadline}</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--color-cream)]/70 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            {s.heroBody}
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/contact"
              className="rounded-md bg-[var(--color-sage)] px-6 sm:px-8 py-3 sm:py-3.5 font-semibold text-[var(--color-plum-deep)] hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Book a Session
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-[var(--color-cream)]/25 px-6 sm:px-8 py-3 sm:py-3.5 font-semibold text-[var(--color-cream)] hover:bg-[var(--color-cream)]/10 transition-colors text-sm sm:text-base"
            >
              Meet {s.coachName}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────────────────── */}
      {credentials.length > 0 && (
        <section aria-label="Credentials" className="bg-[var(--color-charcoal)] text-[var(--color-cream)]/60 py-5 px-6">
          <ul className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-widest list-none m-0 p-0">
            {credentials.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="text-[var(--color-gold)]">✦</span>
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Social proof ticker ──────────────────────────────────────────── */}
      <SocialProofTicker />

      {/* ── About teaser ─────────────────────────────────────────────────── */}
      <section aria-label="About" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--color-cream)]">
        <Reveal>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative aspect-[4/5] max-h-[420px] md:max-h-none rounded-2xl overflow-hidden bg-[var(--color-plum-deep)] flex items-center justify-center order-last md:order-first shadow-xl shadow-[var(--color-plum-deep)]/20">
              {s.coachPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.coachPhoto} alt={s.coachName} className="w-full h-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/images/coach-portrait.png" alt={s.coachName} className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]" />
              )}
            </div>

            <div>
              <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Your Guide</p>
              <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-plum-deep)] mb-4 sm:mb-6 leading-tight">
                {s.aboutHeadline}
              </h2>
              <p className="text-[var(--color-charcoal)]/75 leading-relaxed text-base sm:text-lg mb-4 sm:mb-6">{s.aboutBio1}</p>
              <p className="text-[var(--color-charcoal)]/60 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">{s.aboutBio2}</p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-lavender)] hover:text-[var(--color-plum-deep)] transition-colors"
              >
                Read full story <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Services Preview ─────────────────────────────────────────────── */}
      <section aria-label="Coaching services" className="bg-[var(--color-mist)] py-16 sm:py-24 px-4 sm:px-6">
        <Reveal>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Work With {s.coachName}</p>
              <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-plum-deep)]">Coaching Services</h2>
            </div>
            {services.length === 0 ? (
              <p className="text-center text-[var(--color-charcoal)]/50">Services coming soon.</p>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} name={service.name} description={service.description} duration={service.duration} price={service.price} bookingLink={service.bookingLink} />
                ))}
              </div>
            )}
            <div className="text-center mt-8 sm:mt-10">
              <Link href="/services" className="inline-block rounded-md border border-[var(--color-plum-deep)]/25 px-6 py-2.5 text-sm font-semibold text-[var(--color-plum-deep)] hover:bg-[var(--color-plum-deep)]/5 transition-colors">
                View all services
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Recent Blog Posts ────────────────────────────────────────────── */}
      <section aria-label="Latest blog posts" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--color-cream)]">
        <Reveal delay={100}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8 sm:mb-12">
              <div>
                <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2 sm:mb-3">Insights & Wisdom</p>
                <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-plum-deep)]">Latest Posts</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline text-sm font-medium text-[var(--color-lavender)] hover:text-[var(--color-plum-deep)] transition-colors">View all →</Link>
            </div>
            {recentPosts.length === 0 ? (
              <p className="text-[var(--color-charcoal)]/50">No posts yet — check back soon.</p>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {recentPosts.map((post) => (
                  <BlogCard key={post.id} title={post.title} slug={post.slug} excerpt={post.excerpt} coverImage={post.coverImage} publishedAt={post.publishedAt} tags={post.tags} />
                ))}
              </div>
            )}
            <div className="text-center mt-6 sm:hidden">
              <Link href="/blog" className="text-sm font-medium text-[var(--color-lavender)] hover:text-[var(--color-plum-deep)] transition-colors">View all posts →</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section aria-label="Call to action" className="bg-[var(--color-plum-deep)] text-[var(--color-cream)] py-16 sm:py-20 px-4 sm:px-6 text-center">
        <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 max-w-2xl mx-auto leading-tight">
          The Clarity You&apos;ve Been Looking For Is One Session Away
        </h2>
        <p className="text-[var(--color-cream)]/65 text-base sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8">
          No scripts. No vague platitudes. Just honest, intuitive guidance from {s.coachName} — tailored entirely to where you are right now.
        </p>
        <Link href="/contact" className="inline-block rounded-md bg-[var(--color-sage)] px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-[var(--color-plum-deep)] hover:opacity-90 transition-opacity text-sm sm:text-base">
          Book Your Session
        </Link>
      </section>
    </>
  )
}
