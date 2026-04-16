// Feature: prateeksha-psychic-coach, Property 5
// Feature: prateeksha-psychic-coach, Property 6
// Feature: prateeksha-psychic-coach, Property 7
import * as fc from 'fast-check'

// Mock Firestore modules — tests only exercise pure builder functions
jest.mock('@/lib/firestore/posts', () => ({
  getPostBySlug: jest.fn(),
  getRelatedPosts: jest.fn(),
}))
jest.mock('server-only', () => ({}))

import { buildPostMetadata, buildArticleJsonLd } from './page'
import type { BlogPost } from '@/lib/firestore/utils'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const nonEmptyString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0)

const blogPostArb: fc.Arbitrary<BlogPost> = fc.record({
  id: fc.uuid(),
  title: nonEmptyString,
  slug: fc
    .stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), {
      minLength: 1,
      maxLength: 40,
    })
    .filter((s) => /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s) || /^[a-z0-9]$/.test(s)),
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
  publishedAt: fc.integer({ min: 1_000_000_000_000, max: 2_000_000_000_000 }),
  createdAt: fc.integer({ min: 1_000_000_000_000, max: 2_000_000_000_000 }),
  updatedAt: fc.integer({ min: 1_000_000_000_000, max: 2_000_000_000_000 }),
})

const siteUrl = 'https://example.com'

// ---------------------------------------------------------------------------
// Property 6: generateMetadata maps post fields correctly
// Validates: Requirements 3.2
// ---------------------------------------------------------------------------
describe('buildPostMetadata — Property 6', () => {
  it('title matches post title', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const meta = buildPostMetadata(post, siteUrl)
        expect(meta.title).toBe(post.title)
      }),
      { numRuns: 100 }
    )
  })

  it('description matches post excerpt', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const meta = buildPostMetadata(post, siteUrl)
        expect(meta.description).toBe(post.excerpt)
      }),
      { numRuns: 100 }
    )
  })

  it('openGraph.images contains the post cover image URL', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const meta = buildPostMetadata(post, siteUrl)
        const images = meta.openGraph?.images
        expect(images).toBeDefined()
        const imageList = Array.isArray(images) ? images : [images]
        const urls = imageList.map((img) =>
          typeof img === 'string' ? img : (img as { url: string }).url
        )
        expect(urls).toContain(post.coverImage)
      }),
      { numRuns: 100 }
    )
  })

  it('alternates.canonical matches /blog/[slug]', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const meta = buildPostMetadata(post, siteUrl)
        expect(meta.alternates?.canonical).toBe(`${siteUrl}/blog/${post.slug}`)
      }),
      { numRuns: 100 }
    )
  })

  it('twitter card fields are populated', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const meta = buildPostMetadata(post, siteUrl)
        expect(meta.twitter?.title).toBe(post.title)
        expect(meta.twitter?.description).toBe(post.excerpt)
        expect(meta.twitter?.card).toBe('summary_large_image')
      }),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 7: JSON-LD Article schema contains all required fields
// Validates: Requirements 3.3, 9.7
// ---------------------------------------------------------------------------
describe('buildArticleJsonLd — Property 7', () => {
  it('@type is Article', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const jsonLd = buildArticleJsonLd(post, siteUrl) as Record<string, unknown>
        expect(jsonLd['@type']).toBe('Article')
      }),
      { numRuns: 100 }
    )
  })

  it('headline is non-empty and matches post title', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const jsonLd = buildArticleJsonLd(post, siteUrl) as Record<string, unknown>
        expect(typeof jsonLd.headline).toBe('string')
        expect((jsonLd.headline as string).length).toBeGreaterThan(0)
        expect(jsonLd.headline).toBe(post.title)
      }),
      { numRuns: 100 }
    )
  })

  it('datePublished is non-empty ISO string', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const jsonLd = buildArticleJsonLd(post, siteUrl) as Record<string, unknown>
        expect(typeof jsonLd.datePublished).toBe('string')
        expect((jsonLd.datePublished as string).length).toBeGreaterThan(0)
      }),
      { numRuns: 100 }
    )
  })

  it('dateModified is non-empty ISO string', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const jsonLd = buildArticleJsonLd(post, siteUrl) as Record<string, unknown>
        expect(typeof jsonLd.dateModified).toBe('string')
        expect((jsonLd.dateModified as string).length).toBeGreaterThan(0)
      }),
      { numRuns: 100 }
    )
  })

  it('author is non-empty', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const jsonLd = buildArticleJsonLd(post, siteUrl) as Record<string, unknown>
        expect(jsonLd.author).toBeDefined()
        const author = jsonLd.author as Record<string, unknown>
        expect(typeof author.name).toBe('string')
        expect((author.name as string).length).toBeGreaterThan(0)
      }),
      { numRuns: 100 }
    )
  })

  it('image is non-empty and matches post coverImage', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const jsonLd = buildArticleJsonLd(post, siteUrl) as Record<string, unknown>
        expect(typeof jsonLd.image).toBe('string')
        expect((jsonLd.image as string).length).toBeGreaterThan(0)
        expect(jsonLd.image).toBe(post.coverImage)
      }),
      { numRuns: 100 }
    )
  })

  it('description is non-empty and matches post excerpt', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const jsonLd = buildArticleJsonLd(post, siteUrl) as Record<string, unknown>
        expect(typeof jsonLd.description).toBe('string')
        expect((jsonLd.description as string).length).toBeGreaterThan(0)
        expect(jsonLd.description).toBe(post.excerpt)
      }),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 5: Individual post page renders all required fields
// Validates: Requirements 3.1
// (Tests the pure builder functions that produce the data rendered on the page)
// ---------------------------------------------------------------------------
describe('Post page data builders — Property 5', () => {
  it('metadata contains title, description, canonical, OG image, and twitter fields', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const meta = buildPostMetadata(post, siteUrl)
        // title
        expect(meta.title).toBeTruthy()
        // description (excerpt)
        expect(meta.description).toBeTruthy()
        // canonical
        expect(meta.alternates?.canonical).toContain(post.slug)
        // OG image (cover image)
        const images = meta.openGraph?.images
        expect(images).toBeDefined()
        // twitter
        expect(meta.twitter).toBeDefined()
      }),
      { numRuns: 100 }
    )
  })

  it('JSON-LD contains all fields needed to render the post page', () => {
    fc.assert(
      fc.property(blogPostArb, (post) => {
        const jsonLd = buildArticleJsonLd(post, siteUrl) as Record<string, unknown>
        // All required fields present and non-empty
        expect(jsonLd['@type']).toBe('Article')
        expect(jsonLd.headline).toBeTruthy()
        expect(jsonLd.datePublished).toBeTruthy()
        expect(jsonLd.dateModified).toBeTruthy()
        expect(jsonLd.author).toBeTruthy()
        expect(jsonLd.image).toBeTruthy()
        expect(jsonLd.description).toBeTruthy()
      }),
      { numRuns: 100 }
    )
  })
})
