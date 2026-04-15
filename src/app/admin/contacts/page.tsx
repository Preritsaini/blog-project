import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  submittedAt: number | null
}

async function getAllContacts(): Promise<Contact[]> {
  if (!adminApp) return []
  const snap = await getFirestore(adminApp)
    .collection('contacts')
    .orderBy('submittedAt', 'desc')
    .get()
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name,
    email: d.data().email,
    subject: d.data().subject,
    message: d.data().message,
    submittedAt: d.data().submittedAt?.toMillis?.() ?? null,
  }))
}

export default async function AdminContactsPage() {
  const contacts = await getAllContacts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-plum-deep)] mb-1">
            Enquiries
          </h1>
          <p className="text-sm text-[var(--color-charcoal)]/45">
            {contacts.length} total contact form submission{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-xl bg-white border border-[var(--color-lavender)]/12 p-12 text-center">
          <p className="text-[var(--color-charcoal)]/40 text-lg mb-2">No enquiries yet.</p>
          <p className="text-sm text-[var(--color-charcoal)]/30">
            When visitors submit the contact form, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="rounded-xl bg-white border border-[var(--color-lavender)]/12 p-6 hover:border-[var(--color-lavender)]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-lavender)]/15 flex items-center justify-center text-sm font-semibold text-[var(--color-plum-deep)] flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-plum-deep)]">{c.name}</p>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-xs text-[var(--color-lavender)] hover:underline"
                    >
                      {c.email}
                    </a>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[var(--color-charcoal)]/40">
                    {c.submittedAt
                      ? new Intl.DateTimeFormat('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(c.submittedAt))
                      : '—'}
                  </p>
                  <a
                    href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                    className="inline-block mt-1 text-xs font-semibold text-[var(--color-sage)] hover:opacity-80 transition-opacity"
                  >
                    Reply via email ↗
                  </a>
                </div>
              </div>

              <p className="text-sm font-semibold text-[var(--color-charcoal)] mb-2">
                {c.subject}
              </p>
              <p className="text-sm text-[var(--color-charcoal)]/65 leading-relaxed whitespace-pre-wrap">
                {c.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
