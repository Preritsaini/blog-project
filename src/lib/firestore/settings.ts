import 'server-only'
import { getFirestore } from 'firebase-admin/firestore'
import { unstable_cache } from 'next/cache'
import { adminApp } from '@/lib/firebase/admin'

const SETTINGS_DOC = 'settings/site'

export interface SiteSettings {
  siteName: string
  tagline: string
  coachName: string
  coachPhoto: string
  twitterHandle: string

  heroHeadline: string
  heroSubheadline: string
  heroBody: string

  aboutHeadline: string
  aboutBio1: string
  aboutBio2: string
  aboutBio3: string
  credentials: string

  instagramUrl: string
  twitterUrl: string
  facebookUrl: string

  colorCream: string
  colorMist: string
  colorLavender: string
  colorPlumDeep: string
  colorSage: string
  colorGold: string
  colorCharcoal: string

  siteDescription: string
  ogImage: string
}

export const defaultSettings: SiteSettings = {
  siteName: 'Soul Compass',
  tagline: 'Psychic Coaching & Spiritual Guidance',
  coachName: 'Prateeksha',
  coachPhoto: '',
  twitterHandle: '@soulcompassco',

  heroHeadline: 'Stop Searching for Answers.',
  heroSubheadline: 'Start Hearing Your Own.',
  heroBody:
    "You already know more than you think. Prateeksha's psychic coaching sessions help you cut through the noise — and finally trust the voice that's been trying to reach you.",

  aboutHeadline: 'Meet Prateeksha',
  aboutBio1:
    "Prateeksha is a certified psychic coach, Reiki master, and intuitive healer with over a decade of experience guiding people through life's most pivotal moments. She was born with a rare sensitivity to energy — a gift she spent years learning to understand, and now uses entirely in service of others.",
  aboutBio2:
    "Her sessions weave together psychic intuition, tarot, astrology, and energy healing into something that feels less like a reading and more like a conversation with the wisest part of yourself. She doesn't tell you what to do — she helps you hear what you already know.",
  aboutBio3:
    'Over 500 clients have sat with Prateeksha at crossroads of career, love, grief, and identity. Every single one left with something they didn\'t have before: direction.',
  credentials:
    'Certified Spiritual Life Coach\nReiki Master & Energy Healer\nTarot & Astrology Practitioner\n10+ Years of Practice\n500+ Sessions Delivered',

  instagramUrl: 'https://instagram.com/soulcompassco',
  twitterUrl: 'https://twitter.com/soulcompassco',
  facebookUrl: 'https://facebook.com/soulcompassco',

  colorCream: '#F7F3EE',
  colorMist: '#EEE8F2',
  colorLavender: '#8E79A8',
  colorPlumDeep: '#4A365A',
  colorSage: '#9CAF9A',
  colorGold: '#C9A86A',
  colorCharcoal: '#2C2433',

  siteDescription:
    'Soul Compass offers transformative psychic coaching with Prateeksha — a certified spiritual life coach, Reiki master, and intuitive healer. Discover clarity, healing, and purpose through personalised readings and one-on-one sessions.',
  ogImage: '',
}

function db() {
  if (!adminApp) return null
  return getFirestore(adminApp)
}

function requireDb() {
  if (!adminApp) {
    throw new Error('Firebase Admin SDK is not initialised. Check your .env.local file.')
  }
  return getFirestore(adminApp)
}

/** Cached — used by public pages. Falls back to defaultSettings if SDK not configured. */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const database = db()
    if (!database) return defaultSettings
    try {
      const doc = await database.doc(SETTINGS_DOC).get()
      if (!doc.exists) return defaultSettings
      return { ...defaultSettings, ...(doc.data() as Partial<SiteSettings>) }
    } catch {
      return defaultSettings
    }
  },
  ['site-settings'],
  { tags: ['settings'], revalidate: 60 }
)

/** Uncached — used by admin settings page so it always shows latest values. */
export async function getSiteSettingsAdmin(): Promise<SiteSettings> {
  const database = db()
  if (!database) return defaultSettings
  try {
    const doc = await database.doc(SETTINGS_DOC).get()
    if (!doc.exists) return defaultSettings
    return { ...defaultSettings, ...(doc.data() as Partial<SiteSettings>) }
  } catch {
    return defaultSettings
  }
}

export async function saveSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  await requireDb().doc(SETTINGS_DOC).set(data, { merge: true })
}
