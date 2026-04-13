export default function SkeletonCard() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-charcoal)]/10 bg-white shadow-sm animate-pulse"
      aria-hidden="true"
    >
      {/* Cover image placeholder */}
      <div className="h-48 w-full bg-[var(--color-charcoal)]/10" />

      <div className="flex flex-col gap-3 p-5">
        {/* Tags placeholder */}
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-[var(--color-charcoal)]/10" />
          <div className="h-5 w-12 rounded-full bg-[var(--color-charcoal)]/10" />
        </div>

        {/* Title placeholder */}
        <div className="h-6 w-3/4 rounded bg-[var(--color-charcoal)]/10" />

        {/* Excerpt placeholder */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-full rounded bg-[var(--color-charcoal)]/10" />
          <div className="h-4 w-5/6 rounded bg-[var(--color-charcoal)]/10" />
          <div className="h-4 w-4/6 rounded bg-[var(--color-charcoal)]/10" />
        </div>

        {/* Date placeholder */}
        <div className="h-3 w-24 rounded bg-[var(--color-charcoal)]/10" />
      </div>
    </div>
  )
}
