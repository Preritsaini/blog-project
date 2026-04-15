import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/firestore/settings'
import { siteConfig } from '@/lib/config'

// ─── ISR: revalidate every 60 seconds ────────────────────────────────────────
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  return {
    title: `About ${s.coachName} — Psychic Coach & Spiritual Guide`,
    description: `${s.coachName} is a certified psychic coach, Reiki master, and intuitive healer with 10+ years of experience. Learn how her unique approach to spiritual coaching can help you find clarity, direction, and peace.`,
    alternates: { canonical: `${siteConfig.url}/about` },
    openGraph: {
      title: `About ${s.coachName} | ${s.siteName}`,
      description: `${s.coachName} is a certified psychic coach, Reiki master, and intuitive healer with 10+ years of experience.`,
      url: `${siteConfig.url}/about`,
      type: 'profile',
      images: [{ url: s.ogImage || siteConfig.ogImage, width: 1200, height: 630, alt: `About ${s.coachName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `About ${s.coachName} | ${s.siteName}`,
      description: `${s.coachName} is a certified psychic coach, Reiki master, and intuitive healer with 10+ years of experience.`,
      images: [s.ogImage || siteConfig.ogImage],
    },
  }
}

const values = [
  {
    icon: '✦',
    title: 'Pure Intuition, No Scripts',
    body: 'Every session is channelled live — not read from a template. Prateeksha tunes into your specific energy field to surface insights that are uniquely, unmistakably yours.',
  },
  {
    icon: '◈',
    title: 'Radical Safety',
    body: 'There is no version of you that is too much here. Grief, confusion, shame, hope — all of it is welcome. This is one of the few spaces where you don\'t have to manage how you\'re perceived.',
  },
  {
    icon: '◇',
    title: 'Grounded in the Real World',
    body: 'Spiritual insight without practical application is just entertainment. Prateeksha translates what she sees into clear, actionable next steps you can take before the week is out.',
  },
  {
    icon: '○',
    title: 'You Leave Stronger',
    body: 'The measure of a great session isn\'t how much Prateeksha told you — it\'s how much more clearly you can hear yourself. Every session is designed to build your own inner compass.',
  },
]

const faqs = [
  {
    q: 'What actually happens in a session?',
    a: 'You bring whatever is on your mind — a decision, a feeling, a situation you can\'t make sense of. Prateeksha tunes in, shares what she receives, and together you explore what it means for your life. It\'s more conversation than performance.',
  },
  {
    q: 'Do I need to believe in psychic abilities for this to work?',
    a: 'No. Scepticism is completely fine — many of Prateeksha\'s most impactful sessions have been with people who came in doubtful. All you need is a genuine question and a willingness to listen.',
  },
  {
    q: 'How do online sessions compare to in-person?',
    a: 'Clients consistently report that online sessions feel just as deep and connected. Energy isn\'t limited by geography. Sessions run via Zoom or Google Meet — you\'ll receive a link after booking.',
  },
  {
    q: 'How do I know if I\'m ready?',
    a: 'If you\'re asking that question, you probably are. Most people book when they\'re at a crossroads — a relationship, a career shift, a loss, or simply a persistent feeling that something needs to change.',
  },
  {
    q: 'How often should I come back?',
    a: 'There\'s no formula. Some clients return monthly; others come once a year at major life junctures. Prateeksha will never suggest you need more sessions than genuinely serve you.',
  },
]

export default async function AboutPage() {
  const s = await getSiteSettings()
  const credentials = s.credentials.split('\n').map((c) => c.trim()).filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: s.coachName,
      jobTitle: s.tagline,
      url: `${siteConfig.url}/about`,
      description: s.aboutBio1,
      sameAs: [s.instagramUrl, s.twitterUrl, s.facebookUrl].filter(Boolean),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-[var(--color-plum-deep)] text-[var(--color-cream)] py-16 sm:py-24 px-4 sm:px-6 text-center">
        <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 sm:mb-4">
          The Guide Behind {s.siteName}
        </p>
        <h1 className="font-[var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
          Meet {s.coachName}
        </h1>
        <p className="mt-4 sm:mt-5 text-[var(--color-cream)]/65 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Certified psychic coach. Reiki master. Intuitive healer. And the person who will finally help you hear yourself clearly.
        </p>
      </section>

      {/* Bio */}
      <section className="bg-[var(--color-cream)] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Photo — not sticky on mobile */}
          <div className="md:sticky md:top-24 aspect-[4/5] max-h-[400px] md:max-h-none rounded-2xl overflow-hidden bg-[var(--color-mist)] flex items-center justify-center border border-[var(--color-lavender)]/15">
            {s.coachPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.coachPhoto} alt={s.coachName} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center px-8">
                <p className="font-[var(--font-heading)] text-6xl text-[var(--color-lavender)]/25 mb-3">✦</p>
                <p className="text-sm text-[var(--color-charcoal)]/30">Photo of {s.coachName}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 sm:gap-6">
            <div>
              <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Her Story</p>
              <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-semibold text-[var(--color-plum-deep)] mb-4 sm:mb-5">
                A Calling, Not a Career
              </h2>
            </div>
            {[s.aboutBio1, s.aboutBio2, s.aboutBio3].filter(Boolean).map((para, i) => (
              <p key={i} className="text-[var(--color-charcoal)]/75 leading-relaxed text-base sm:text-lg">{para}</p>
            ))}

            {credentials.length > 0 && (
              <div className="mt-2 sm:mt-4 rounded-xl bg-[var(--color-mist)] p-5 sm:p-6 border border-[var(--color-lavender)]/15">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-charcoal)]/40 mb-3 sm:mb-4">
                  Credentials & Experience
                </p>
                <ul className="flex flex-col gap-2 sm:gap-3 list-none m-0 p-0">
                  {credentials.map((c) => (
                    <li key={c} className="flex items-center gap-3 text-sm text-[var(--color-charcoal)]/80">
                      <span className="text-[var(--color-gold)] text-base leading-none flex-shrink-0">✦</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link href="/contact" className="self-start rounded-md bg-[var(--color-sage)] px-6 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold text-[var(--color-plum-deep)] hover:opacity-90 transition-opacity mt-1 sm:mt-2">
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[var(--color-mist)] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">The Practice</p>
            <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-plum-deep)]">What Guides Every Session</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {values.map(({ icon, title, body }) => (
              <div key={title} className="rounded-xl bg-[var(--color-cream)] border border-[var(--color-lavender)]/12 p-6 sm:p-8">
                <p className="text-2xl text-[var(--color-gold)] mb-3 sm:mb-4">{icon}</p>
                <h3 className="font-[var(--font-heading)] text-lg sm:text-xl font-semibold text-[var(--color-plum-deep)] mb-2 sm:mb-3">{title}</h3>
                <p className="text-[var(--color-charcoal)]/65 leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-[var(--color-cream)] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl italic text-[var(--color-plum-deep)] leading-snug mb-5 sm:mb-6">
            &ldquo;I came in not knowing what I was looking for. I left knowing exactly what I needed to do — and more importantly, why I&apos;d been avoiding it.&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-[var(--color-charcoal)]/45 uppercase tracking-widest">— {s.siteName} Client, London</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-mist)] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Common Questions</p>
            <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-plum-deep)]">What to Expect</h2>
          </div>
          <dl className="flex flex-col gap-4 sm:gap-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="rounded-xl bg-[var(--color-cream)] border border-[var(--color-lavender)]/12 p-5 sm:p-7">
                <dt className="font-[var(--font-heading)] text-base sm:text-lg font-semibold text-[var(--color-plum-deep)] mb-2">{q}</dt>
                <dd className="text-[var(--color-charcoal)]/65 leading-relaxed text-sm m-0">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-plum-deep)] text-[var(--color-cream)] py-16 sm:py-20 px-4 sm:px-6 text-center">
        <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold mb-4 max-w-xl mx-auto leading-tight">
          Your Next Chapter Starts With One Conversation
        </h2>
        <p className="text-[var(--color-cream)]/65 text-base sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8">
          Book a session with {s.coachName}. No pressure, no scripts — just honest, intuitive guidance tailored entirely to you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/contact" className="rounded-md bg-[var(--color-sage)] px-7 sm:px-8 py-3 sm:py-3.5 font-semibold text-[var(--color-plum-deep)] hover:opacity-90 transition-opacity text-sm sm:text-base">
            Book Your Session
          </Link>
          <Link href="/services" className="rounded-md border border-[var(--color-cream)]/25 px-7 sm:px-8 py-3 sm:py-3.5 font-semibold text-[var(--color-cream)] hover:bg-[var(--color-cream)]/10 transition-colors text-sm sm:text-base">
            Explore Services
          </Link>
        </div>
      </section>
    </>
  )
}
