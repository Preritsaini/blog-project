import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/ui/BlogCard'
import { getPostBySlug, getRelatedPosts } from '@/lib/firestore/posts'
import type { BlogPost } from '@/lib/firestore/utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

// ---------------------------------------------------------------------------
// Pure builder functions (exported for property testing)
// ---------------------------------------------------------------------------

export function buildPostMetadata(post: BlogPost, baseUrl: string): Metadata {
  const canonical = `${baseUrl}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: 'article',
      images: [post.coverImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export function buildArticleJsonLd(post: BlogPost, baseUrl: string): object {
  const publishedAt = post.publishedAt.toDate().toISOString()
  const updatedAt = post.updatedAt.toDate().toISOString()
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      '@type': 'Person',
      name: 'Prateeksha',
      url: baseUrl,
    },
    url: `${baseUrl}/blog/${post.slug}`,
  }
}

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }
  return buildPostMetadata(post, siteUrl)
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post, 3)
  const jsonLd = buildArticleJsonLd(post, siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Cover image */}
        <div className="relative h-72 w-full overflow-hidden rounded-lg mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 list-none m-0 p-0 mb-4" aria-label="Tags">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[var(--color-indigo-deep)]/10 px-3 py-1 text-xs font-medium text-[var(--color-indigo-deep)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Title */}
        <h1 className="font-[var(--font-heading)] text-4xl font-semibold text-[var(--color-charcoal)] mb-3">
          {post.title}
        </h1>

        {/* Published date */}
        <time
          dateTime={post.publishedAt.toDate().toISOString()}
          className="text-sm text-[var(--color-charcoal)]/50 mb-8 block"
        >
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(post.publishedAt.toDate())}
        </time>

        {/* Body */}
        <div
          className="prose prose-lg max-w-none text-[var(--color-charcoal)]"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-[var(--color-off-white)] py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-indigo-deep)] mb-6">
              Related Posts
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <BlogCard
                  key={related.id}
                  title={related.title}
                  slug={related.slug}
                  excerpt={related.excerpt}
                  coverImage={related.coverImage}
                  publishedAt={related.publishedAt.toDate()}
                  tags={related.tags}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
