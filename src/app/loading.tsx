import SkeletonCard from '@/components/ui/SkeletonCard'

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="h-10 w-48 rounded-lg bg-[var(--color-charcoal)]/10 animate-pulse mb-12" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
