export default function PostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
      <div className="h-72 sm:h-96 w-full rounded-xl bg-[var(--color-charcoal)]/10 mb-10" />
      <div className="flex gap-2 mb-5">
        <div className="h-6 w-20 rounded-full bg-[var(--color-charcoal)]/10" />
        <div className="h-6 w-16 rounded-full bg-[var(--color-charcoal)]/10" />
      </div>
      <div className="h-12 w-3/4 rounded-lg bg-[var(--color-charcoal)]/10 mb-4" />
      <div className="h-5 w-full rounded bg-[var(--color-charcoal)]/10 mb-2" />
      <div className="h-5 w-5/6 rounded bg-[var(--color-charcoal)]/10 mb-10" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-[var(--color-charcoal)]/10" style={{ width: `${85 + Math.random() * 15}%` }} />
        ))}
      </div>
    </div>
  )
}
