export interface ServiceCardProps {
  name: string
  description: string
  duration: string
  price: string
  bookingLink: string
}

export default function ServiceCard({
  name,
  description,
  duration,
  price,
  bookingLink,
}: ServiceCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-[var(--color-charcoal)]/8 bg-[var(--color-mist)] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-plum-deep)]">
        {name}
      </h2>

      <p className="text-sm text-[var(--color-charcoal)]/75 flex-1 leading-relaxed">
        {description}
      </p>

      <dl className="flex flex-wrap gap-4 text-sm">
        <div>
          <dt className="font-medium text-[var(--color-charcoal)]/50 text-xs uppercase tracking-wide">Duration</dt>
          <dd className="text-[var(--color-charcoal)] mt-0.5">{duration}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--color-charcoal)]/50 text-xs uppercase tracking-wide">Price</dt>
          <dd className="text-[var(--color-plum-deep)] font-semibold mt-0.5">{price}</dd>
        </div>
      </dl>

      <a
        href={bookingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-block rounded-md bg-[var(--color-sage)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-plum-deep)] hover:opacity-90 transition-opacity active:scale-95"
      >
        Book Now
      </a>
    </article>
  )
}
