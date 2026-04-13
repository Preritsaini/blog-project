import type { Metadata } from 'next'
import ContactForm from '@/components/ui/ContactForm'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Prateeksha to ask questions or request a psychic coaching consultation.',
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: 'Contact | Prateeksha',
    description:
      'Get in touch with Prateeksha to ask questions or request a psychic coaching consultation.',
    url: `${siteUrl}/contact`,
    type: 'website',
    images: [`${siteUrl}/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Prateeksha',
    description:
      'Get in touch with Prateeksha to ask questions or request a psychic coaching consultation.',
    images: [`${siteUrl}/og-image.png`],
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-[var(--font-heading)] text-4xl font-semibold text-[var(--color-indigo-deep)] mb-4">
        Contact
      </h1>
      <p className="text-[var(--color-charcoal)]/70 mb-10">
        Have a question or want to book a session? Fill in the form below and Prateeksha
        will get back to you as soon as possible.
      </p>
      <ContactForm />
    </div>
  )
}
