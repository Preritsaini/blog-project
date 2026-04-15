import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing Firebase Admin credentials in .env.local')
  console.error('Ensure you have FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY set.')
  process.exit(1)
}

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })

const auth = getAuth(app)
const db = getFirestore(app)

async function seed() {
  console.log('🌱 Starting database seed...')

  // 1. Create Super Admin User
  const adminEmail = 'superadmin@gmail.com'
  const adminPassword = 'superadmin'

  try {
    const userRecord = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: 'Super Admin',
    })
    console.log(`✅ Created Super Admin user: ${userRecord.uid}`)
    
    // Optional: Add admin role/claims if you use custom claims
    await auth.setCustomUserClaims(userRecord.uid, { admin: true })
    console.log('✅ Assigned admin custom claims')
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log('ℹ️ Super Admin user already exists, skipping creation.')
    } else {
      console.error('❌ Error creating Super Admin:', error)
    }
  }

  // 2. Seed Site Settings
  const settingsRef = db.doc('settings/site')
  const defaultSettings = {
    siteName: 'Soul Compass',
    tagline: 'Psychic Coaching & Spiritual Guidance',
    coachName: 'Prateeksha',
    coachPhoto: '/images/coach-portrait.png',
    twitterHandle: '@soulcompassco',
    heroHeadline: 'Stop Searching for Answers.',
    heroSubheadline: 'Start Hearing Your Own.',
    heroBody: "You already know more than you think. Prateeksha's psychic coaching sessions help you cut through the noise — and finally trust the voice that's been trying to reach you.",
    aboutHeadline: 'Meet Prateeksha',
    aboutBio1: "Prateeksha is a certified psychic coach, Reiki master, and intuitive healer with over a decade of experience guiding people through life's most pivotal moments.",
    aboutBio2: "Her sessions weave together psychic intuition, tarot, astrology, and energy healing into something that feels like a conversation with the wisest part of yourself.",
    credentials: "Certified Spiritual Life Coach\nReiki Master & Energy Healer\nTarot & Astrology Practitioner\n10+ Years of Practice\n500+ Sessions Delivered",
    colorGold: '#C9A86A',
    colorPlumDeep: '#4A365A',
    colorCream: '#F7F3EE',
    ogImage: '/images/hero-bg.png',
  }

  await settingsRef.set(defaultSettings, { merge: true })
  console.log('✅ Seeded site settings')

  // 3. Seed Services
  const services = [
    {
      name: 'Tarot Reading',
      description: 'Gain clarity and insight into your path with a deep, intuitive tarot session focusing on your current energy.',
      duration: '45 mins',
      price: 80,
      active: true,
      bookingLink: '/contact',
      createdAt: Timestamp.now(),
    },
    {
      name: 'Energy Healing',
      description: 'A transformative Reiki and crystal healing session to clear blockages and restore your natural vibrance.',
      duration: '60 mins',
      price: 120,
      active: true,
      bookingLink: '/contact',
      createdAt: Timestamp.now(),
    },
    {
      name: 'Astrology Natal Chart',
      description: 'Unlock the roadmap of your soul. A comprehensive look at your planetary alignments and life purpose.',
      duration: '90 mins',
      price: 150,
      active: true,
      bookingLink: '/contact',
      createdAt: Timestamp.now(),
    },
  ]

  for (const s of services) {
    const res = await db.collection('services').where('name', '==', s.name).get()
    if (res.empty) {
      await db.collection('services').add(s)
      console.log(`✅ Seeded service: ${s.name}`)
    }
  }

  // 4. Seed a Sample Post
  const post = {
    title: 'How to Trust Your Intuition in Times of Change',
    slug: 'trusting-your-intuition',
    excerpt: 'In the middle of uncertainty, your inner voice is your most reliable compass. Here is how to hear it.',
    body: '<p>Learning to trust your intuition is a journey of unlearning the noise around you...</p>',
    coverImage: '/images/hero-bg.png',
    tags: ['Intuition', 'Self-Growth'],
    published: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  const postRes = await db.collection('posts').where('slug', '==', post.slug).get()
  if (postRes.empty) {
    await db.collection('posts').add(post)
    console.log(`✅ Seeded blog post: ${post.title}`)
  }

  console.log('✨ Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
