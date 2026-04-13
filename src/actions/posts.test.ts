// Feature: prateeksha-psychic-coach, Property 14/16
import * as fc from 'fast-check'
import { PostSchema } from '@/lib/validations'

// Arbitraries
const nonEmptyString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0)

const validSlug = fc
  .stringOf(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
    { minLength: 1, maxLength: 50 }
  )
  .filter((s) => /^[a-z0-9-]+$/.test(s))

const validUrl = fc.oneof(
  fc.constant(''),
  fc.tuple(
    fc.constantFrom('https', 'http'),
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 3, maxLength: 15 })
  ).map(([proto, domain]) => `${proto}://${domain}.com/image.jpg`)
)

const validPostData = fc.record({
  title: nonEmptyString,
  slug: validSlug,
  excerpt: fc.string(),
  coverImage: validUrl,
  tags: fc.array(fc.string()),
  body: fc.string(),
  published: fc.boolean(),
})

/**
 * Property 14: Valid post form writes to Firestore and redirects
 * Validates: Requirements 7.3, 7.5
 *
 * We test the validation step (PostSchema) directly — valid data passes,
 * which is the gate before any Firestore write occurs.
 */
describe('PostSchema — Property 14', () => {
  it('accepts valid post data (non-empty title, valid slug)', () => {
    fc.assert(
      fc.property(validPostData, (data) => {
        const result = PostSchema.safeParse(data)
        expect(result.success).toBe(true)
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * Property 16: Empty required field rejects form without writing to Firestore
 * Validates: Requirements 7.7
 */
describe('PostSchema — Property 16', () => {
  it('rejects when title is empty', () => {
    fc.assert(
      fc.property(validSlug, fc.string(), fc.boolean(), (slug, body, published) => {
        const result = PostSchema.safeParse({
          title: '',
          slug,
          excerpt: '',
          coverImage: '',
          tags: [],
          body,
          published,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          const fields = result.error.issues.map((i) => i.path[0])
          expect(fields).toContain('title')
        }
      }),
      { numRuns: 100 }
    )
  })

  it('rejects when slug is empty', () => {
    fc.assert(
      fc.property(nonEmptyString, fc.boolean(), (title, published) => {
        const result = PostSchema.safeParse({
          title,
          slug: '',
          excerpt: '',
          coverImage: '',
          tags: [],
          body: '',
          published,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          const fields = result.error.issues.map((i) => i.path[0])
          expect(fields).toContain('slug')
        }
      }),
      { numRuns: 100 }
    )
  })

  it('rejects when slug contains invalid characters', () => {
    // Slugs with uppercase or special chars (not a-z0-9-) should fail
    const invalidSlug = fc
      .string({ minLength: 1 })
      .filter((s) => s.length > 0 && !/^[a-z0-9-]+$/.test(s))

    fc.assert(
      fc.property(nonEmptyString, invalidSlug, (title, slug) => {
        const result = PostSchema.safeParse({
          title,
          slug,
          excerpt: '',
          coverImage: '',
          tags: [],
          body: '',
          published: false,
        })
        expect(result.success).toBe(false)
      }),
      { numRuns: 100 }
    )
  })
})
