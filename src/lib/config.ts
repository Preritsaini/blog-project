/**
 * Central site configuration — single source of truth.
 */

export const siteConfig = {
  name: 'AhanaFlow',
  coachName: 'Prateeksha',
  tagline: 'Psychic Coaching & Spiritual Guidance',

  description:
    'AhanaFlow offers transformative psychic coaching with Prateeksha — a certified spiritual life coach, Reiki master, and intuitive healer. Discover clarity, healing, and purpose through personalised readings and one-on-one sessions.',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahanaflow.com',
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahanaflow.com'}/og-image.png`,

  author: 'Prateeksha',
  twitterHandle: '@ahanaflow',
  locale: 'en_US',

  links: {
    instagram: 'https://instagram.com/ahanaflow',
    twitter: 'https://twitter.com/ahanaflow',
    facebook: 'https://facebook.com/ahanaflow',
  },

  about: {
    headline: 'Meet Prateeksha',
    bio: [
      'Prateeksha is a certified psychic coach, Reiki master, and intuitive healer with over a decade of experience guiding people through life\'s most pivotal moments. She was born with a rare sensitivity to energy — a gift she spent years learning to understand, and now uses entirely in service of others.',
      'Her sessions weave together psychic intuition, tarot, astrology, and energy healing into something that feels less like a reading and more like a conversation with the wisest part of yourself. She doesn\'t tell you what to do — she helps you hear what you already know.',
      'Over 500 clients have sat with Prateeksha at crossroads of career, love, grief, and identity. Every single one left with something they didn\'t have before: direction.',
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
