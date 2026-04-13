// Feature: prateeksha-psychic-coach, Property 10/11/16
import * as fc from 'fast-check'
import { ContactSchema, PostSchema, ServiceSchema } from './validations'

// Arbitraries
const nonEmptyString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0)

// Zod uses a strict email regex — build emails from safe alphanumeric parts
const safeLocalPart = fc
  .stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 20 })
const safeDomain = fc
  .stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 2, maxLength: 10 })
const validEmail = fc.tuple(safeLocalPart, safeDomain).map(([local, domain]) => `${local}@${domain}.com`)

const invalidEmail = fc.oneof(
  fc.constant(''),
  fc.constant('notanemail'),
  fc.constant('@nodomain'),
  fc.constant('missing@'),
  fc.string({ minLength: 1 }).filter((s) => !s.includes('@'))
)

/**
 * Property 10: Valid contact submission succeeds
 * Validates: Requirements 5.2
 */
describe('ContactSchema', () => {
  it('Property 10: accepts valid contact data (non-empty fields, valid email)', () => {
    fc.assert(
      fc.property(
        nonEmptyString,
        validEmail,
        nonEmptyString,
        nonEmptyString,
        (name, email, subject, message) => {
          const result = ContactSchema.safeParse({ name, email, subject, message })
          expect(result.success).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 11: Invalid contact submission returns errors
   * Validates: Requirements 5.3
   */
  it('Property 11: rejects when email is invalid', () => {
    fc.assert(
      fc.property(
        nonEmptyString,
        invalidEmail,
        nonEmptyString,
        nonEmptyString,
        (name, email, subject, message) => {
          const result = ContactSchema.safeParse({ name, email, subject, message })
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 11: rejects when name is empty', () => {
    fc.assert(
      fc.property(
        validEmail,
        nonEmptyString,
        nonEmptyString,
        (email, subject, message) => {
          const result = ContactSchema.safeParse({ name: '', email, subject, message })
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 11: rejects when subject is empty', () => {
    fc.assert(
      fc.property(
        nonEmptyString,
        validEmail,
        nonEmptyString,
        (name, email, message) => {
          const result = ContactSchema.safeParse({ name, email, subject: '', message })
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 11: rejects when message is empty', () => {
    fc.assert(
      fc.property(
        nonEmptyString,
        validEmail,
        nonEmptyString,
        (name, email, subject) => {
          const result = ContactSchema.safeParse({ name, email, subject, message: '' })
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Property 16: Empty required field rejects form
 * Validates: Requirements 7.7, 8.7
 */
describe('PostSchema — Property 16', () => {
  it('rejects when title is empty', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
        (slug) => {
          const result = PostSchema.safeParse({
            title: '',
            slug,
            excerpt: '',
            coverImage: '',
            tags: [],
            body: '',
            published: false,
          })
          expect(result.success).toBe(false)
          if (!result.success) {
            const fields = result.error.issues.map((i) => i.path[0])
            expect(fields).toContain('title')
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('ServiceSchema — Property 16', () => {
  it('rejects when name is empty', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (active) => {
          const result = ServiceSchema.safeParse({
            name: '',
            description: '',
            duration: '',
            price: '',
            bookingLink: '',
            active,
          })
          expect(result.success).toBe(false)
          if (!result.success) {
            const fields = result.error.issues.map((i) => i.path[0])
            expect(fields).toContain('name')
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
