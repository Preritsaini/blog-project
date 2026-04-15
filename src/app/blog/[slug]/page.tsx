import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/ui/BlogCard'
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/firestore/posts'
import { siteConfig } from '@/lib/config'
import type { BlogPost } from '@/lib/firestore/utils'

// ─── SSG: pre-build all published slugs at build time ────────────────────────
// New posts added after build are rendered on first request then cached (ISR).
export const dynamicParams = true   // allow slugs not in generateStaticParams
export const revalidate = 60        // ISR fallback: revalidate cached pages every 60s

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

// ─── Pure builder functions (exported for property testing) ──────────────────

export function buildPostMetadata(post: BlogPost, baseUrl: string): Metadata {
  const canonical = `${baseUrl}/blog/${post.slug}`
  const publishedTime = new Date(post.publishedAt).toISOString()
  const modifiedTime = new Date(post.updatedAt).toISOString()

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: 'article',
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      publishedTime,
      modifiedTime,
      authors: [siteConfig.coachName],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || siteConfig.ogImage],
    },
  }
}

export function buildArticleJsonLd(post: BlogPost, baseUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || `${baseUrl}/og-image.png`,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: siteConfig.coachName,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
    },
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.tags.join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/blog/${post.slug}` },
  }
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }
  return buildPostMetadata(post, siteConfig.url)
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const [relatedPosts] = await Promise.all([getRelatedPosts(post, 3)])
  const jsonLd = buildArticleJsonLd(post, siteConfig.url)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Cover image */}
        {post.coverImage && (
          <div className="relative h-52 sm:h-72 lg:h-96 w-full overflow-hidden rounded-xl mb-8 sm:mb-10 shadow-md">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 list-none m-0 p-0 mb-4 sm:mb-5" aria-label="Tags">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[var(--color-lavender)]/15 px-3 py-1 text-xs font-medium text-[var(--color-plum-deep)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Title */}
        <h1 className="font-[var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-plum-deep)] mb-3 sm:mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-base sm:text-lg text-[var(--color-charcoal)]/65 mb-5 sm:mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-[var(--color-charcoal)]/10">
          <span className="text-sm font-medium text-[var(--color-charcoal)]">
            {siteConfig.coachName}
          </span>
          <span className="text-[var(--color-charcoal)]/25">·</span>
          <time
            dateTime={new Date(post.publishedAt).toISOString()}
            className="text-sm text-[var(--color-charcoal)]/45"
          >
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(new Date(post.publishedAt))}
          </time>
        </div>

        {/* Body */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section
          aria-label="Related posts"
          className="bg-[var(--color-mist)] py-12 sm:py-16 px-4 sm:px-6"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[var(--font-heading)] text-xl sm:text-2xl font-semibold text-[var(--color-plum-deep)] mb-6 sm:mb-8">
              Related Posts
            </h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <BlogCard
                  key={related.id}
                  title={related.title}
                  slug={related.slug}
                  excerpt={related.excerpt}
                  coverImage={related.coverImage}
                  publishedAt={related.publishedAt}
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
