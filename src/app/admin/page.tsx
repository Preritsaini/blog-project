import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-[var(--color-indigo-deep)] mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/posts"
          className="block rounded-xl border border-[var(--color-indigo-deep)]/15 bg-white p-6 hover:border-[var(--color-indigo-deep)]/40 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
        >
          <h2 className="font-serif text-xl font-semibold text-[var(--color-indigo-deep)] mb-2">
            Blog Posts
          </h2>
          <p className="text-sm text-[var(--color-charcoal)]/70">
            Create, edit, and manage blog posts.
          </p>
        </Link>
        <Link
          href="/admin/services"
          className="block rounded-xl border border-[var(--color-indigo-deep)]/15 bg-white p-6 hover:border-[var(--color-indigo-deep)]/40 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
        >
          <h2 className="font-serif text-xl font-semibold text-[var(--color-indigo-deep)] mb-2">
            Services
          </h2>
          <p className="text-sm text-[var(--color-charcoal)]/70">
            Create, edit, and manage coaching services.
          </p>
        </Link>
        <Link
          href="/admin/media"
          className="block rounded-xl border border-[var(--color-indigo-deep)]/15 bg-white p-6 hover:border-[var(--color-indigo-deep)]/40 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
        >
          <h2 className="font-serif text-xl font-semibold text-[var(--color-indigo-deep)] mb-2">
            Media Library
          </h2>
          <p className="text-sm text-[var(--color-charcoal)]/70">
            Upload and manage photos used across the site.
          </p>
        </Link>
      </div>
    </div>
  )
}
