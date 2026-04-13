import type { Metadata } from 'next'
import ContactForm from '@/components/ui/ContactForm'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Prateeksha to ask questions or request a psychic coaching consultation.',
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description: 'Get in touch with Prateeksha to ask questions or request a psychic coaching consultation.',
    url: `${siteConfig.url}/contact`,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Contact Prateeksha' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact | ${siteConfig.name}`,
    description: 'Get in touch with Prateeksha to ask questions or request a psychic coaching consultation.',
    images: [siteConfig.ogImage],
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-10">
        <h1 className="font-[var(--font-heading)] text-5xl font-semibold text-[var(--color-indigo-deep)] mb-3">
          Contact
        </h1>
        <p className="text-[var(--color-charcoal)]/70 text-lg leading-relaxed">
          Have a question or want to book a session? Fill in the form below and Prateeksha
          will get back to you as soon as possible.
        </p>
      </header>
      <ContactForm />
    </div>
  )
}
