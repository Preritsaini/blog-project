import type { Metadata } from 'next'
import BlogCard from '@/components/ui/BlogCard'
import { getAllPosts } from '@/lib/firestore/posts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Explore spiritual insights, psychic guidance, and coaching wisdom from Prateeksha.',
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: 'Blog | Prateeksha',
    description:
      'Explore spiritual insights, psychic guidance, and coaching wisdom from Prateeksha.',
    url: `${siteUrl}/blog`,
    type: 'website',
    images: [`${siteUrl}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Prateeksha',
    description:
      'Explore spiritual insights, psychic guidance, and coaching wisdom from Prateeksha.',
    images: [`${siteUrl}/og-image.png`],
  },
}

export default async function BlogListingPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-[var(--font-heading)] text-4xl font-semibold text-[var(--color-indigo-deep)] mb-10">
        Blog
      </h1>

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
