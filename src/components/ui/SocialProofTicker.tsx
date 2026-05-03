const testimonials = [
  '"I finally know what I need to do." — Sarah, London',
  '"The most honest conversation I\'ve had in years." — James, NYC',
  '"She saw things I hadn\'t told anyone." — Priya, Mumbai',
  '"I came in lost. I left with a plan." — Chloe, Sydney',
  '"Worth every penny and then some." — Marcus, Toronto',
  '"I\'ve recommended her to everyone I know." — Aisha, Dubai',
]

export default function SocialProofTicker() {
  // Duplicate for seamless loop
  const items = [...testimonials, ...testimonials]

  return (
    <div
      className="overflow-hidden bg-[var(--color-lavender)]/8 border-y border-[var(--color-lavender)]/12 py-3"
      aria-hidden="true"
    >
      <div
        className="ticker-track flex gap-12 whitespace-nowrap"
      >
        {items.map((t, i) => (
          <span key={i} className="text-sm text-[var(--color-charcoal)]/55 flex-shrink-0">
            <span className="text-[var(--color-gold)] mr-2">✦</span>
            {t}
          </span>
        ))}
      </div>

    </div>
  )
}
