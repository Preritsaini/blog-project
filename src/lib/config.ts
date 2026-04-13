/**
 * Central site configuration — single source of truth.
 */

export const siteConfig = {
  /** Brand / site name */
  name: 'Soul Compass',

  /** The coach */
  coachName: 'Prateeksha',

  tagline: 'Psychic Coaching & Spiritual Guidance',

  description:
    'Soul Compass is a psychic coaching practice led by Prateeksha. Through intuitive readings, energy healing, and personalised spiritual coaching, she helps you navigate life\'s transitions with clarity, confidence, and purpose.',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulcompass.co',
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulcompass.co'}/og-image.png`,

  author: 'Prateeksha',
  twitterHandle: '@soulcompassco',
  locale: 'en_US',

  links: {
    instagram: 'https://instagram.com/soulcompassco',
    twitter: 'https://twitter.com/soulcompassco',
    facebook: 'https://facebook.com/soulcompassco',
  },

  /** About the coach — used on homepage + about section */
  about: {
    headline: 'Meet Prateeksha',
    bio: [
      'Prateeksha is a gifted psychic coach, intuitive healer, and spiritual guide with over a decade of experience helping people reconnect with their inner wisdom. Born with a heightened sensitivity to energy and emotion, she discovered her calling early — and has since dedicated her life to helping others find theirs.',
      'Her practice blends psychic intuition, tarot, astrology, and energy healing into deeply personalised sessions. Whether you\'re navigating a crossroads, seeking clarity on relationships, or simply feeling called to explore your spiritual path, Prateeksha meets you exactly where you are.',
      'Clients describe working with her as "like finally being understood" — a safe, non-judgmental space where real transformation begins.',
    ],
    credentials: [
      'Certified Spiritual Life Coach',
      'Reiki Master & Energy Healer',
      'Tarot & Astrology Practitioner',
      '10+ Years of Practice',
      '500+ Sessions Delivered',
    ],
  },
} as const

export type SiteConfig = typeof siteConfig
