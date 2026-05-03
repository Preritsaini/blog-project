import Image from 'next/image'
import Link from 'next/link'

export interface BlogCardProps {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  publishedAt: number // milliseconds
  tags: string[]
}

function formatDate(ms: number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(ms))
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  tags,
}: BlogCardProps) {
  const hasImage = Boolean(coverImage)

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[var(--color-charcoal)]/8 bg-[var(--color-mist)] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <Link
        href={`/blog/${slug}`}
        className="block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative h-48 w-full overflow-hidden bg-[var(--color-lavender)]/10">
          {hasImage ? (
            <Image
              suppressHydrationWarning
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-[var(--font-heading)] text-4xl text-[var(--color-lavender)]/30">✦</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 list-none m-0 p-0" aria-label="Tags">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[var(--color-lavender)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--color-plum-deep)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Title */}
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-plum-deep)] leading-snug">
          <Link
            href={`/blog/${slug}`}
            className="hover:text-[var(--color-lavender)] transition-colors"
          >
            {title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-[var(--color-charcoal)]/70 line-clamp-3 flex-1">
          {excerpt}
        </p>

        {/* Published date */}
        <time
          suppressHydrationWarning
          dateTime={new Date(publishedAt).toISOString()}
          className="text-xs text-[var(--color-charcoal)]/45"
        >
          {formatDate(publishedAt)}
        </time>
      </div>
    </article>
  )
}
