import type { Metadata } from 'next'
import BlogCard from '@/components/ui/BlogCard'
import NewsletterCapture from '@/components/ui/NewsletterCapture'
import { getAllPosts } from '@/lib/firestore/posts'
import { siteConfig } from '@/lib/config'

// ─── ISR: revalidate every 60 seconds ────────────────────────────────────────
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Spiritual Blog — Psychic Insights, Tarot & Healing Wisdom',
  description:
    'Read Prateeksha\'s blog for honest, grounded writing on psychic development, tarot, energy healing, astrology, and navigating life\'s big questions. New posts regularly.',
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    title: 'Spiritual Blog | Soul Compass',
    description:
      'Honest, grounded writing on psychic development, tarot, energy healing, and navigating life\'s big questions.',
    url: `${siteConfig.url}/blog`,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Soul Compass Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spiritual Blog | Soul Compass',
    description:
      'Honest, grounded writing on psychic development, tarot, energy healing, and navigating life\'s big questions.',
    images: [siteConfig.ogImage],
  },
}

export default async function BlogListingPage() {
  const posts = await getAllPosts()

  return (
    <div className="bg-[var(--color-cream)] min-h-screen">
      {/* Page header */}
      <div className="bg-[var(--color-plum-deep)] text-[var(--color-cream)] py-16 sm:py-20 px-4 sm:px-6 text-center">
        <p className="text-[var(--color-gold)] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
          Insights & Wisdom
        </p>
        <h1 className="font-[var(--font-heading)] text-4xl sm:text-5xl font-semibold mb-3 sm:mb-4">
          Words Worth Sitting With
        </h1>
        <p className="text-[var(--color-cream)]/65 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Honest writing on psychic development, tarot, energy healing, and the questions that keep you up at night.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-charcoal)]/50 text-lg mb-2">The first post is on its way.</p>
            <p className="text-[var(--color-charcoal)]/35 text-sm">Check back soon — or <a href="/contact" className="text-[var(--color-lavender)] hover:underline">get in touch</a> in the meantime.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                publishedAt={post.publishedAt}
                tags={post.tags}
              />
            ))}
          </div>
        )}

        {/* Newsletter capture — lead gen */}
        <div className="mt-16">
          <NewsletterCapture />
        </div>
      </div>
    </div>
  )
}
