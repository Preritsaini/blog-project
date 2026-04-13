import Link from 'next/link'
import { getAllServicesAdmin } from '@/lib/firestore/services'
import { deleteService } from '@/actions/services'
import ConfirmDelete from '@/components/admin/ConfirmDelete'

export default async function AdminServicesPage() {
  const services = await getAllServicesAdmin()

  async function handleDelete(id: string) {
    'use server'
    await deleteService(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-semibold text-[var(--color-indigo-deep)]">
          Services
        </h1>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center rounded-md bg-[var(--color-indigo-deep)] px-4 py-2 text-sm font-semibold text-[var(--color-off-white)] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)]"
        >
          New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-[var(--color-charcoal)]/60">No services yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-indigo-deep)]/10">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-indigo-deep)]/5 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Name</th>
                <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Status</th>
                <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-indigo-deep)]/5">
              {services.map((service) => (
                <tr key={service.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--color-charcoal)]">
                    {service.name}
                  </td>
                  <td className="px-4 py-3">
                    {service.active ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="text-sm text-[var(--color-indigo-deep)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-deep)] rounded px-2 py-1"
                    >
                      Edit
                    </Link>
                    <ConfirmDelete id={service.id} onDelete={handleDelete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
