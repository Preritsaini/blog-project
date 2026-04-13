import { notFound } from 'next/navigation'
import { getServiceById } from '@/lib/firestore/services'
import EditServiceForm from './EditServiceForm'

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params
  const service = await getServiceById(id)

  if (!service) {
    notFound()
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-[var(--color-indigo-deep)] mb-8">
        Edit Service
      </h1>
      <EditServiceForm service={service} />
    </div>
  )
}
