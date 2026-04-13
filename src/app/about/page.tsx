import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `About Prateeksha`,
  description: `Meet Prateeksha — psychic coach, intuitive healer, and spiritual guide. Learn about her journey, her practice, and how she can help you find clarity and purpose.`,
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: {
    title: `About Prateeksha | ${siteConfig.name}`,
    description: `Meet Prateeksha — psychic coach, intuitive healer, and spiritual guide.`,
    url: `${siteConfig.url}/about`,
    type: 'profile',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'About Prateeksha' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `About Prateeksha | ${siteConfig.name}`,
    description: `Meet Prateeksha — psychic coach, intuitive healer, and spiritual guide.`,
    images: [siteConfig.ogImage],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: siteConfig.coachName,
    jobTitle: siteConfig.tagline,
    url: `${siteConfig.url}/about`,
    description: siteConfig.about.bio[0],
    sameAs: Object.values(siteConfig.links),
  },
}

const values = [
  {
    icon: '✦',
    title: 'Intuition First',
    body: 'Every session is guided by genuine psychic intuition — not scripts or formulas. Prateeksha tunes in to your unique energy to deliver insights that are truly personal.',
  },
  {
    icon: '◈',
    title: 'Safe & Non-Judgmental',
    body: 'This is a space of radical acceptance. Whatever you bring — fears, confusion, grief, or hope — you will be met with compassion and zero judgment.',
  },
  {
    icon: '◇',
    title: 'Practical Wisdom',
    body: 'Spiritual guidance should translate into real life. Prateeksha bridges the mystical and the practical, giving you actionable clarity you can use today.',
  },
  {
    icon: '○',
    title: 'Your Empowerment',
    body: 'The goal is never dependency — it\'s your growth. Every session is designed to strengthen your own intuition and confidence so you can lead your life with purpose.',
  },
]

const faqs = [
  {
    q: 'What happens in a session?',
    a: 'Sessions are conversational and intuitive. Prateeksha will tune in to your energy, use tarot or astrology as tools where helpful, and share the insights she receives. You\'re always welcome to ask questions and guide the direction.',
  },
  {
    q: 'Do I need to believe in psychic abilities?',
    a: 'Not at all. Many clients come in sceptical and leave with a new perspective. An open mind is all that\'s needed.',
  },
  {
    q: 'How do online sessions work?',
    a: 'Sessions are held via video call (Zoom or Google Meet). The connection is just as strong remotely — energy has no borders.',
  },
  {
    q: 'How often should I book?',
    a: 'That\'s entirely up to you. Some clients book monthly for ongoing guidance; others come at key life moments. Prateeksha will never push you to book more than feels right.',
  },
]

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-indigo-deep)] text-[var(--color-off-white)] py-24 px-6 text-center">
        <p className="text-[var(--color-gold-soft)] text-sm font-semibold uppercase tracking-widest mb-4">
          The Guide Behind {siteConfig.name}
        </p>
        <h1 className="font-[var(--font-heading)] text-5xl sm:text-6xl font-semibold leading-tight">
          Meet Prateeksha
        </h1>
      </section>

      {/* ── Bio ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Photo placeholder */}
          <div className="sticky top-24 aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-indigo-deep)]/8 flex items-center justify-center border border-[var(--color-indigo-deep)]/10">
            <div className="text-center px-8">
              <p className="font-[var(--font-heading)] text-6xl text-[var(--color-indigo-deep)]/15 mb-3">✦</p>
              <p className="text-sm text-[var(--color-charcoal)]/30">Photo of Prateeksha</p>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[var(--color-gold-soft)] text-sm font-semibold uppercase tracking-widest mb-3">
                Her Story
              </p>
              <h2 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-indigo-deep)] mb-5">
                A Calling, Not a Career
              </h2>
            </div>

            {siteConfig.about.bio.map((paragraph, i) => (
              <p key={i} className="text-[var(--color-charcoal)]/75 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}

            {/* Credentials */}
            <div className="mt-4 rounded-xl bg-[var(--color-off-white)] p-6 border border-[var(--color-indigo-deep)]/8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-charcoal)]/40 mb-4">
                Credentials & Experience
              </p>
              <ul className="flex flex-col gap-3 list-none m-0 p-0">
                {siteConfig.about.credentials.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-[var(--color-charcoal)]/80">
                    <span className="text-[var(--color-gold-soft)] text-base leading-none">✦</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/contact"
              className="self-start rounded-md bg-[var(--color-indigo-deep)] px-7 py-3 text-sm font-semibold text-[var(--color-off-white)] hover:opacity-90 transition-opacity mt-2"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-off-white)] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--color-gold-soft)] text-sm font-semibold uppercase tracking-widest mb-3">
              The Practice
            </p>
            <h2 className="font-[var(--font-heading)] text-4xl font-semibold text-[var(--color-indigo-deep)]">
              What Guides Every Session
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl bg-white border border-[var(--color-indigo-deep)]/8 p-8"
              >
                <p className="text-2xl text-[var(--color-gold-soft)] mb-4">{icon}</p>
                <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-indigo-deep)] mb-3">
                  {title}
                </h3>
                <p className="text-[var(--color-charcoal)]/70 leading-relaxed text-sm">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial pull-quote ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-[var(--font-heading)] text-3xl sm:text-4xl italic text-[var(--color-indigo-deep)] leading-snug mb-6">
            &ldquo;Working with Prateeksha felt like finally being understood — by someone
            who could see the parts of me I hadn&apos;t even named yet.&rdquo;
          </p>
          <p className="text-sm text-[var(--color-charcoal)]/50 uppercase tracking-widest">
            — A Soul Compass Client
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-off-white)] py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--color-gold-soft)] text-sm font-semibold uppercase tracking-widest mb-3">
              Common Questions
            </p>
            <h2 className="font-[var(--font-heading)] text-4xl font-semibold text-[var(--color-indigo-deep)]">
              What to Expect
            </h2>
          </div>

          <dl className="flex flex-col gap-6">
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl bg-white border border-[var(--color-indigo-deep)]/8 p-7"
              >
                <dt className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-indigo-deep)] mb-2">
                  {q}
                </dt>
                <dd className="text-[var(--color-charcoal)]/70 leading-relaxed text-sm m-0">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-indigo-deep)] text-[var(--color-off-white)] py-20 px-6 text-center">
        <h2 className="font-[var(--font-heading)] text-4xl font-semibold mb-4">
          Ready to Connect?
        </h2>
        <p className="text-[var(--color-off-white)]/70 text-lg max-w-xl mx-auto mb-8">
          Book a session with Prateeksha and start your journey toward clarity,
          healing, and purpose.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="rounded-md bg-[var(--color-gold-soft)] px-8 py-3.5 font-semibold text-[var(--color-indigo-deep)] hover:opacity-90 transition-opacity"
          >
            Book a Session
          </Link>
          <Link
            href="/services"
            className="rounded-md border border-[var(--color-off-white)]/25 px-8 py-3.5 font-semibold text-[var(--color-off-white)] hover:bg-[var(--color-off-white)]/10 transition-colors"
          >
            View Services
          </Link>
        </div>
      </section>
    </>
  )
}
