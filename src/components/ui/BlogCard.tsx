import Image from 'next/image'
import Link from 'next/link'

export interface BlogCardProps {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  publishedAt: Date
  tags: string[]
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  tags,
}: BlogCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-charcoal)]/10 bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={`/blog/${slug}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-indigo-deep)]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 list-none m-0 p-0" aria-label="Tags">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[var(--color-indigo-deep)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-indigo-deep)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Title */}
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-charcoal)] leading-snug">
          <Link
            href={`/blog/${slug}`}
            className="hover:text-[var(--color-indigo-deep)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-indigo-deep)] rounded-sm"
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
          dateTime={publishedAt.toISOString()}
          className="text-xs text-[var(--color-charcoal)]/50"
        >
          {formatDate(publishedAt)}
        </time>
      </div>
    </article>
  )
}
