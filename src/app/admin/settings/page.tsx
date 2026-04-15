import { getSiteSettingsAdmin } from '@/lib/firestore/settings'
import SettingsClient from './SettingsClient'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsAdmin()
  return <SettingsClient settings={settings} />
}
