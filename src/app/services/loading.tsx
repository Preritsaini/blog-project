import SkeletonCard from '@/components/ui/SkeletonCard'

export default function ServicesLoading() {
  return (
    <div className="bg-[var(--color-cream)] min-h-screen">
      <div className="bg-[var(--color-plum-deep)] py-16 sm:py-20 px-6 text-center animate-pulse">
        <div className="h-3 w-32 rounded bg-[var(--color-cream)]/20 mx-auto mb-4" />
        <div className="h-10 w-64 rounded-lg bg-[var(--color-cream)]/20 mx-auto mb-3" />
        <div className="h-4 w-80 rounded bg-[var(--color-cream)]/15 mx-auto" />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
