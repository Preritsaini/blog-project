import Link from 'next/link'
import { getDashboardStats } from '@/lib/firestore/analytics'

function StatCard({
  label,
  value,
  sub,
  href,
  accent,
}: {
  label: string
  value: number | string
  sub?: string
  href: string
  accent?: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-xl bg-white border border-[var(--color-lavender)]/12 p-5 hover:border-[var(--color-lavender)]/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-charcoal)]/40">
        {label}
      </span>
      <span
        className="font-[var(--font-heading)] text-4xl font-semibold"
        style={{ color: accent || 'var(--color-plum-deep)' }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs text-[var(--color-charcoal)]/45 mt-0.5">{sub}</span>
      )}
    </Link>
  )
}

function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map(({ label, count }) => {
        const pct = Math.round((count / max) * 100)
        return (
          <div key={label} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-medium text-[var(--color-charcoal)]/60">
              {count > 0 ? count : ''}
            </span>
            <div className="w-full rounded-t-md bg-[var(--color-lavender)]/15 relative overflow-hidden" style={{ height: '64px' }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-md bg-[var(--color-lavender)] transition-all duration-700"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-charcoal)]/40">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const navCards = [
    { href: '/admin/posts',    icon: '✍', title: 'Blog Posts',     desc: 'Create, edit, and publish posts.' },
    { href: '/admin/services', icon: '◈', title: 'Services',       desc: 'Manage coaching offerings.' },
    { href: '/admin/media',    icon: '◻', title: 'Media Library',  desc: 'Upload and manage photos.' },
    { href: '/admin/settings', icon: '⚙', title: 'Site Settings',  desc: 'Edit copy, colours, and SEO.' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-plum-deep)] mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--color-charcoal)]/45">
          Here&apos;s what&apos;s happening on your site.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Published Posts" value={stats.publishedPosts} sub={`${stats.draftPosts} drafts`} href="/admin/posts" />
        <StatCard label="Active Services" value={stats.activeServices} sub={`${stats.totalServices} total`} href="/admin/services" />
        <StatCard label="Total Enquiries" value={stats.totalContacts} href="/admin/contacts" accent="var(--color-lavender)" />
        <StatCard
          label="This Week"
          value={stats.newContactsThisWeek}
          sub="new enquiries"
          href="/admin/contacts"
          accent={stats.newContactsThisWeek > 0 ? 'var(--color-sage)' : undefined}
        />
        <StatCard label="Total Posts" value={stats.totalPosts} href="/admin/posts" />
        <StatCard label="Total Services" value={stats.totalServices} href="/admin/services" />
      </div>

      {/* Chart + Recent contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiries chart */}
        <div className="rounded-xl bg-white border border-[var(--color-lavender)]/12 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-[var(--color-plum-deep)]">Enquiries — Last 7 Days</h2>
              <p className="text-xs text-[var(--color-charcoal)]/40 mt-0.5">Contact form submissions</p>
            </div>
            <span className="text-2xl font-[var(--font-heading)] font-semibold text-[var(--color-lavender)]">
              {stats.newContactsThisWeek}
            </span>
          </div>
          <BarChart data={stats.contactsChart} />
        </div>

        {/* Recent contacts */}
        <div className="rounded-xl bg-white border border-[var(--color-lavender)]/12 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--color-plum-deep)]">Recent Enquiries</h2>
            <Link
              href="/admin/contacts"
              className="text-xs text-[var(--color-lavender)] hover:text-[var(--color-plum-deep)] transition-colors"
            >
              View all →
            </Link>
          </div>

          {stats.recentContacts.length === 0 ? (
            <p className="text-sm text-[var(--color-charcoal)]/40 py-4 text-center">
              No enquiries yet. Share your site to start getting leads.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-[var(--color-lavender)]/8">
              {stats.recentContacts.map((c) => (
                <li key={c.id} className="py-3 flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-[var(--color-lavender)]/15 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-[var(--color-plum-deep)]">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-charcoal)] truncate">{c.name}</p>
                    <p className="text-xs text-[var(--color-charcoal)]/45 truncate">{c.subject}</p>
                  </div>
                  <span className="text-xs text-[var(--color-charcoal)]/30 flex-shrink-0 ml-auto">
                    {c.submittedAt
                      ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(c.submittedAt))
                      : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick nav */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-charcoal)]/35 mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {navCards.map(({ href, icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 rounded-xl bg-white border border-[var(--color-lavender)]/12 p-5 hover:border-[var(--color-lavender)]/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="text-xl text-[var(--color-gold)] mt-0.5">{icon}</span>
              <div>
                <p className="font-semibold text-sm text-[var(--color-plum-deep)]">{title}</p>
                <p className="text-xs text-[var(--color-charcoal)]/45 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
