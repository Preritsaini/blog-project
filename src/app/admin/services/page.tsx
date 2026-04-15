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
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-semibold text-[var(--color-plum-deep)]">
          Services
        </h1>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center rounded-md bg-[var(--color-plum-deep)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity"
        >
          + New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-[var(--color-charcoal)]/50 text-sm">No services yet.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-[var(--color-lavender)]/12">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-mist)] text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Name</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-charcoal)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-lavender)]/8">
                {services.map((service) => (
                  <tr key={service.id} className="bg-white hover:bg-[var(--color-mist)]/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--color-charcoal)]">{service.name}</td>
                    <td className="px-4 py-3">
                      {service.active ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Active</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Link href={`/admin/services/${service.id}/edit`} className="text-xs text-[var(--color-lavender)] hover:underline px-2 py-1">Edit</Link>
                      <ConfirmDelete id={service.id} onDelete={handleDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden flex flex-col gap-3">
            {services.map((service) => (
              <div key={service.id} className="rounded-xl bg-white border border-[var(--color-lavender)]/12 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="font-medium text-[var(--color-plum-deep)] text-sm">{service.name}</p>
                  {service.active ? (
                    <span className="flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Active</span>
                  ) : (
                    <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Inactive</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/services/${service.id}/edit`} className="text-xs font-semibold text-[var(--color-lavender)] hover:underline">Edit</Link>
                  <ConfirmDelete id={service.id} onDelete={handleDelete} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
