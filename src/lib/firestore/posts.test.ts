// Feature: prateeksha-psychic-coach, Property 1/2/3/8
import * as fc from 'fast-check'
import {
  filterRecentPosts,
  filterPublishedPosts,
  filterRelatedPosts,
  filterActiveServices,
  type BlogPost,
  type Service,
} from './utils'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Arbitrary for a BlogPost. */
const blogPostArb = (overrides?: Partial<BlogPost>) =>
  fc
    .record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1 }),
      slug: fc.string({ minLength: 1 }),
      excerpt: fc.string(),
      body: fc.string(),
      coverImage: fc.string(),
      tags: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }),
      published: fc.boolean(),
      publishedAt: fc.integer({ min: 0, max: 2_000_000_000_000 }),
      createdAt: fc.integer({ min: 0, max: 2_000_000_000_000 }),
      updatedAt: fc.integer({ min: 0, max: 2_000_000_000_000 }),
    })
    .map((p) => ({ ...p, ...overrides }) as BlogPost)

/** Arbitrary for a published BlogPost. */
const publishedPostArb = blogPostArb({ published: true })

/** Arbitrary for a Service. */
const serviceArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1 }),
  description: fc.string(),
  duration: fc.string(),
  price: fc.string(),
  bookingLink: fc.string(),
  active: fc.boolean(),
  createdAt: fc.integer({ min: 0, max: 2_000_000_000_000 }),
  updatedAt: fc.integer({ min: 0, max: 2_000_000_000_000 }),
})

// ---------------------------------------------------------------------------
// Property 1: Homepage shows the three most recent published posts
// Validates: Requirements 1.2
// ---------------------------------------------------------------------------
describe('filterRecentPosts', () => {
  it('Property 1: returns at most 3 posts', () => {
    fc.assert(
      fc.property(fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }), (posts) => {
        const result = filterRecentPosts(posts, 3)
        expect(result.length).toBeLessThanOrEqual(3)
      }),
      { numRuns: 100 }
    )
  })

  it('Property 1: returns only published posts', () => {
    fc.assert(
      fc.property(fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }), (posts) => {
        const result = filterRecentPosts(posts, 3)
        result.forEach((p) => expect(p.published).toBe(true))
      }),
      { numRuns: 100 }
    )
  })

  it('Property 1: returns the most recent published posts (descending order)', () => {
    fc.assert(
      fc.property(
        fc.array(publishedPostArb, { minLength: 4, maxLength: 20 }),
        (posts) => {
          const result = filterRecentPosts(posts, 3)
          // All published posts sorted desc
          const allSorted = [...posts].sort(
            (a, b) => b.publishedAt - a.publishedAt
          )
          const top3 = allSorted.slice(0, 3)
          expect(result.map((p) => p.id)).toEqual(top3.map((p) => p.id))
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 1: respects custom limit', () => {
    fc.assert(
      fc.property(
        fc.array(publishedPostArb, { minLength: 0, maxLength: 20 }),
        fc.integer({ min: 1, max: 10 }),
        (posts, limit) => {
          const result = filterRecentPosts(posts, limit)
          expect(result.length).toBeLessThanOrEqual(limit)
          expect(result.length).toBeLessThanOrEqual(posts.filter((p) => p.published).length)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 3: Blog listing is in reverse chronological order
// Validates: Requirements 2.1
// ---------------------------------------------------------------------------
describe('filterPublishedPosts', () => {
  it('Property 3: result is sorted by publishedAt descending', () => {
    fc.assert(
      fc.property(fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }), (posts) => {
        const result = filterPublishedPosts(posts)
        for (let i = 1; i < result.length; i++) {
          expect(result[i - 1].publishedAt).toBeGreaterThanOrEqual(
            result[i].publishedAt
          )
        }
      }),
      { numRuns: 100 }
    )
  })

  it('Property 3: result contains only published posts', () => {
    fc.assert(
      fc.property(fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }), (posts) => {
        const result = filterPublishedPosts(posts)
        result.forEach((p) => expect(p.published).toBe(true))
      }),
      { numRuns: 100 }
    )
  })

  it('Property 3: result contains all published posts from input', () => {
    fc.assert(
      fc.property(fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }), (posts) => {
        const result = filterPublishedPosts(posts)
        const publishedIds = new Set(posts.filter((p) => p.published).map((p) => p.id))
        const resultIds = new Set(result.map((p) => p.id))
        expect(resultIds).toEqual(publishedIds)
      }),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 8: Related posts share at least one tag and are capped at three
// Validates: Requirements 3.5
// ---------------------------------------------------------------------------
describe('filterRelatedPosts', () => {
  it('Property 8: returns at most 3 related posts', () => {
    fc.assert(
      fc.property(
        publishedPostArb,
        fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }),
        (sourcePost, otherPosts) => {
          const result = filterRelatedPosts(sourcePost, otherPosts, 3)
          expect(result.length).toBeLessThanOrEqual(3)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 8: every returned post shares at least one tag with the source post', () => {
    fc.assert(
      fc.property(
        publishedPostArb,
        fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }),
        (sourcePost, otherPosts) => {
          const result = filterRelatedPosts(sourcePost, otherPosts, 3)
          const sourceTags = new Set(sourcePost.tags)
          result.forEach((p) => {
            const hasSharedTag = p.tags.some((t) => sourceTags.has(t))
            expect(hasSharedTag).toBe(true)
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 8: source post is never included in related posts', () => {
    fc.assert(
      fc.property(
        publishedPostArb,
        fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }),
        (sourcePost, otherPosts) => {
          // Include the source post in the pool to test exclusion
          const pool = [...otherPosts, sourcePost]
          const result = filterRelatedPosts(sourcePost, pool, 3)
          result.forEach((p) => expect(p.id).not.toBe(sourcePost.id))
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 8: only published posts are returned', () => {
    fc.assert(
      fc.property(
        publishedPostArb,
        fc.array(blogPostArb(), { minLength: 0, maxLength: 20 }),
        (sourcePost, otherPosts) => {
          const result = filterRelatedPosts(sourcePost, otherPosts, 3)
          result.forEach((p) => expect(p.published).toBe(true))
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ---------------------------------------------------------------------------
// Property 2: Only active services are displayed
// Validates: Requirements 1.3, 4.1
// ---------------------------------------------------------------------------
describe('filterActiveServices', () => {
  it('Property 2: returns only services where active === true', () => {
    fc.assert(
      fc.property(fc.array(serviceArb, { minLength: 0, maxLength: 20 }), (services) => {
        const result = filterActiveServices(services)
        result.forEach((s) => expect(s.active).toBe(true))
      }),
      { numRuns: 100 }
    )
  })

  it('Property 2: no inactive service appears in the result', () => {
    fc.assert(
      fc.property(fc.array(serviceArb, { minLength: 0, maxLength: 20 }), (services) => {
        const result = filterActiveServices(services)
        const inactiveIds = new Set(services.filter((s) => !s.active).map((s) => s.id))
        result.forEach((s) => expect(inactiveIds.has(s.id)).toBe(false))
      }),
      { numRuns: 100 }
    )
  })

  it('Property 2: all active services from input are included in result', () => {
    fc.assert(
      fc.property(fc.array(serviceArb, { minLength: 0, maxLength: 20 }), (services) => {
        const result = filterActiveServices(services)
        const activeIds = new Set(services.filter((s) => s.active).map((s) => s.id))
        const resultIds = new Set(result.map((s) => s.id))
        expect(resultIds).toEqual(activeIds)
      }),
      { numRuns: 100 }
    )
  })
})
