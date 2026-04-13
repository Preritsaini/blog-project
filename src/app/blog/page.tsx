import type { Metadata } from 'next'
import BlogCard from '@/components/ui/BlogCard'
import { getAllPosts } from '@/lib/firestore/posts'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Explore spiritual insights, psychic guidance, and coaching wisdom from Prateeksha.',
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: 'Explore spiritual insights, psychic guidance, and coaching wisdom from Prateeksha.',
    url: `${siteConfig.url}/blog`,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} Blog` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${siteConfig.name}`,
    description: 'Explore spiritual insights, psychic guidance, and coaching wisdom from Prateeksha.',
    images: [siteConfig.ogImage],
  },
}

export default async function BlogListingPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12">
        <h1 className="font-[var(--font-heading)] text-5xl font-semibold text-[var(--color-indigo-deep)] mb-3">
          Blog
        </h1>
        <p className="text-[var(--color-charcoal)]/60 text-lg">
          Spiritual insights, psychic guidance, and coaching wisdom.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--color-charcoal)]/60">
          No posts available yet — check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
  )
}
