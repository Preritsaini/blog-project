import 'server-only'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase/admin'
import type { ContactSubmission } from './utils'

function db() {
  if (!adminApp) {
    throw new Error('Firebase Admin SDK is not initialised. Check your .env.local file.')
  }
  return getFirestore(adminApp)
}

export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalServices: number
  activeServices: number
  totalContacts: number
  newContactsThisWeek: number
  recentContacts: (ContactSubmission & { id: string })[]
  /** contacts per day for the last 7 days — [{label:'Mon', count:3}, ...] */
  contactsChart: { label: string; count: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const database = db()

  const [postsSnap, servicesSnap, contactsSnap] = await Promise.all([
    database.collection('posts').get(),
    database.collection('services').get(),
    database.collection('contacts').orderBy('submittedAt', 'desc').limit(50).get(),
  ])

  const posts = postsSnap.docs.map((d) => d.data())
  const services = servicesSnap.docs.map((d) => d.data())
  const contacts = contactsSnap.docs.map((d) => ({
    id: d.id,
    name: d.data().name as string,
    email: d.data().email as string,
    subject: d.data().subject as string,
    message: d.data().message as string,
    submittedAt: d.data().submittedAt?.toMillis?.() ?? 0,
  }))

  // Week boundary
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const newContactsThisWeek = contacts.filter((c) => {
    const ts = c.submittedAt?.toDate?.()
    return ts && ts >= weekAgo
  }).length

  // Build 7-day chart
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const chartMap: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    chartMap[days[d.getDay()]] = 0
  }
  contacts.forEach((c) => {
    const ts = c.submittedAt?.toDate?.()
    if (ts && ts >= weekAgo) {
      const label = days[ts.getDay()]
      if (label in chartMap) chartMap[label] = (chartMap[label] || 0) + 1
    }
  })
  const contactsChart = Object.entries(chartMap).map(([label, count]) => ({ label, count }))

  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.published).length,
    draftPosts: posts.filter((p) => !p.published).length,
    totalServices: services.length,
    activeServices: services.filter((s) => s.active).length,
    totalContacts: contacts.length,
    newContactsThisWeek,
    recentContacts: contacts.slice(0, 5),
    contactsChart,
  }
}
