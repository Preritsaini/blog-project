// Feature: prateeksha-psychic-coach, Property 19
// Feature: prateeksha-psychic-coach, Property 20
import * as fc from 'fast-check'

// Mock Firestore and Firebase Admin so imports of page files don't hit the DB
jest.mock('@/lib/firestore/posts', () => ({
  getAllPosts: jest.fn(),
  getPostBySlug: jest.fn(),
  getRelatedPosts: jest.fn(),
}))
jest.mock('@/lib/firestore/services', () => ({
  getActiveServices: jest.fn(),
}))
jest.mock('@/lib/firestore/contacts', () => ({
  saveContact: jest.fn(),
}))
jest.mock('@/lib/firebase/admin', () => ({ adminApp: {} }))
jest.mock('@/actions/contact', () => ({
  submitContact: jest.fn(),
}))
jest.mock('@/components/ui/ContactForm', () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock('server-only', () => ({}))

import { buildSitemapEntries } from './sitemap'
import { buildPostMetadata } from './blog/[slug]/page'
import { metadata as homeMetadata } from './page'
import { metadata as blogMetadata } from './blog/page'
import { metadata as servicesMetadata } from './services/page'
import { metadata as contactMetadata } from './contact/page'
import type { BlogPost } from '@/lib/firestore/utils'
import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ts(ms: number) {
  return {
    toDate: () => new Date(ms),
    toMillis: () => ms,
  } as unknown as import('firebase-admin/firestore').Timestamp
}

const nonEmptyString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0)

const slugArb = fc
  .stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), {
    minLength: 1,
    maxLength: 40,
  })
  .filter((s) => /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s) || /^[a-z0-9]$/.test(s))

const blogPostArb: fc.Arbitrary<BlogPost> = fc.record({
  id: fc.uuid(),
  title: nonEmptyString,
  slug: slugArb,
  excerpt: nonEmptyString,
  body: nonEmptyString,
  coverImage: fc
    .tuple(
      fc.constantFrom('https://example.com', 'https://cdn.test'),
      fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-z0-9]+$/.test(s))
    )
    .map(([base, path]) => `${base}/${path}.jpg`),
  tags: fc.array(nonEmptyString, { minLength: 0, maxLength: 5 }),
  published: fc.constant(true),
  publishedAt: fc.integer({ min: 1_000_000_000_000, max: 2_000_000_000_000 }).map(ts),
  createdAt: fc.integer({ min: 1_000_000_000_000, max: 2_000_000_000_000 }).map(ts),
  updatedAt: fc.integer({ min: 1_000_000_000_000, max: 2_000_000_000_000 }).map(ts),
})

const siteUrl = 'https://example.com'

// ---------------------------------------------------------------------------
// Property 19: Sitemap includes all public routes and all post slugs
// Validates: Requirements 9.1
// ---------------------------------------------------------------------------
describe('buildSitemapEntries — Property 19', () => {
  const STATIC_PATHS = ['', '/about', '/blog', '/services', '/contact']

  it('always includes all four static routes', () => {
    fc.assert(
      fc.property(fc.array(slugArb, { minLength: 0, maxLength: 20 }), (slugs) => {
        const entries = buildSitemapEntries(slugs, siteUrl)
        const urls = entries.map((e) => e.url)
        for (const path of STATIC_PATHS) {
          expect(urls).toContain(`${siteUrl}${path}`)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('includes exactly one entry per post slug', () => {
    fc.assert(
      fc.property(fc.uniqueArray(slugArb, { minLength: 0, maxLength: 20 }), (slugs) => {
        const entries = buildSitemapEntries(slugs, siteUrl)
        const urls = entries.map((e) => e.url)
        for (const slug of slugs) {
          const expected = `${siteUrl}/blog/${slug}`
          const count = urls.filter((u) => u === expected).length
          expect(count).toBe(1)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('total entry count equals 4 static + number of slugs', () => {
    fc.assert(
      fc.property(fc.uniqueArray(slugArb, { minLength: 0, maxLength: 20 }), (slugs) => {
        const entries = buildSitemapEntries(slugs, siteUrl)
        expect(entries.length).toBe(STATIC_PATHS.length + slugs.length)
      }),
      { numRuns: 100 }
    )
  })

  it('no post entries appear in the static route list', () => {
    fc.assert(
      fc.property(fc.array(slugArb, { minLength: 1, maxLength: 10 }), (slugs) => {
        const entries = buildSitemapEntries(slugs, siteUrl)
        const postUrls = entries
          .map((e) => e.url)
          .filter((u) => u.includes('/blog/'))
        for (const url of postUrls) {
          // Must be a /blog/[slug] URL, not just /blog
          expect(url).toMatch(/\/blog\/.+/)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('every entry has a lastModified Date', () => {
    fc.assert(
      fc.property(fc.array(slugArb, { minLength: 0, maxLength: 10 }), (slugs) => {
        const entries = buildSitemapEntries(slugs, siteUrl)
        for (const entry of entries) {
          expect(entry.lastModified).toBeInstanceOf(Date)
        }
      }),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 20: Every public page metadata includes canonical URL, OG, and Twitter
// Validates: Requirements 9.3, 9.4, 9.5
// ---------------------------------------------------------------------------

function assertMetadataCompleteness(meta: Metadata, _label: string) {
  // canonical
  expect(meta.alternates?.canonical).toBeTruthy()

  // openGraph fields
  const og = meta.openGraph as Record<string, unknown> | undefined
  expect(og).toBeDefined()
  expect(og!.title).toBeTruthy()
  expect(og!.description).toBeTruthy()
  expect(og!.url).toBeTruthy()
  expect(og!.type).toBeTruthy()
  const ogImages = og!.images
  expect(ogImages).toBeDefined()
  const ogImageList = Array.isArray(ogImages) ? ogImages : [ogImages]
  expect(ogImageList.length).toBeGreaterThan(0)

  // twitter fields
  const tw = meta.twitter as Record<string, unknown> | undefined
  expect(tw).toBeDefined()
  expect(tw!.card).toBeTruthy()
  expect(tw!.title).toBeTruthy()
  expect(tw!.description).toBeTruthy()
  const twImages = tw!.images
  expect(twImages).toBeDefined()
  const twImageList = Array.isArray(twImages) ? twImages : [twImages]
  expect(twImageList.length).toBeGreaterThan(0)
}

describe('Static page metadata — Property 20', () => {
  it('homepage metadata is complete', () => {
    assertMetadataCompleteness(homeMetadata, 'homepage')
  })

  it('blog listing metadata is complete', () => {
    assertMetadataCompleteness(blogMetadata, 'blog listing')
  })

  it('services metadata is complete', () => {
    assertMetadataCompleteness(servicesMetadata, 'services')
  })

  it('contact metadata is complete', () => {
    assertMetadataCompleteness(contactMetadata, 'contact')
  })
})

describe('buildPostMetadata — Property 20 (dynamic blog post)', () => {
  it('for any blog post, generated metadata is complete', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const meta = buildPostMetadata(post, siteUrl)
        assertMetadataCompleteness(meta, `blog post "${post.slug}"`)
      }),
      { numRuns: 100 }
    )
  })
})
