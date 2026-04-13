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
    <article className="flex flex-col gap-4 rounded-lg border border-[var(--color-charcoal)]/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-indigo-deep)]">
        {name}
      </h2>

      <p className="text-sm text-[var(--color-charcoal)]/80 flex-1">{description}</p>

      <dl className="flex flex-wrap gap-4 text-sm">
        <div>
          <dt className="font-medium text-[var(--color-charcoal)]/60">Duration</dt>
          <dd className="text-[var(--color-charcoal)]">{duration}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--color-charcoal)]/60">Price</dt>
          <dd className="text-[var(--color-charcoal)] font-semibold">{price}</dd>
        </div>
      </dl>

      <a
        href={bookingLink}
        className="mt-auto inline-block rounded-md bg-[var(--color-gold-soft)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-indigo-deep)] hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-soft)]"
      >
        Book Now
      </a>
    </article>
  )
}
