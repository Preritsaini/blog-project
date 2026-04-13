// Feature: prateeksha-psychic-coach, Property 10/11
import * as fc from 'fast-check'
import { ContactSchema } from '@/lib/validations'

// Arbitraries
const nonEmptyString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0)

// Build valid emails from safe alphanumeric parts (Zod uses strict email regex)
const safeLocalPart = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')),
  { minLength: 1, maxLength: 20 }
)
const safeDomain = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')),
  { minLength: 2, maxLength: 10 }
)
const validEmail = fc
  .tuple(safeLocalPart, safeDomain)
  .map(([local, domain]) => `${local}@${domain}.com`)

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
 *
 * Tests the ContactSchema validation step — the gate before saveContact is called.
 * Valid data must pass validation (success: true) so the Server Action proceeds to write.
 */
describe('ContactSchema — Property 10', () => {
  it('accepts valid contact data (non-empty fields, valid email)', () => {
    fc.assert(
      fc.property(
        nonEmptyString,
        validEmail,
        nonEmptyString,
        nonEmptyString,
        (name, email, subject, message) => {
          const result = ContactSchema.safeParse({ name, email, subject, message })
          expect(result.success).toBe(true)
          if (result.success) {
            // Validated data is available for Firestore write
            expect(result.data.name).toBeTruthy()
            expect(result.data.email).toContain('@')
            expect(result.data.subject).toBeTruthy()
            expect(result.data.message).toBeTruthy()
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Property 11: Invalid contact submission returns errors without writing to Firestore
 * Validates: Requirements 5.3
 *
 * Tests that invalid data fails validation — the Server Action returns errors
 * and never reaches the saveContact call.
 */
describe('ContactSchema — Property 11', () => {
  it('rejects when email is invalid', () => {
    fc.assert(
      fc.property(
        nonEmptyString,
        invalidEmail,
        nonEmptyString,
        nonEmptyString,
        (name, email, subject, message) => {
          const result = ContactSchema.safeParse({ name, email, subject, message })
          expect(result.success).toBe(false)
          if (!result.success) {
            const fields = result.error.flatten().fieldErrors
            expect(fields.email).toBeDefined()
            expect(fields.email!.length).toBeGreaterThan(0)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('rejects when name is empty', () => {
    fc.assert(
      fc.property(validEmail, nonEmptyString, nonEmptyString, (email, subject, message) => {
        const result = ContactSchema.safeParse({ name: '', email, subject, message })
        expect(result.success).toBe(false)
        if (!result.success) {
          const fields = result.error.flatten().fieldErrors
          expect(fields.name).toBeDefined()
        }
      }),
      { numRuns: 100 }
    )
  })

  it('rejects when subject is empty', () => {
    fc.assert(
      fc.property(nonEmptyString, validEmail, nonEmptyString, (name, email, message) => {
        const result = ContactSchema.safeParse({ name, email, subject: '', message })
        expect(result.success).toBe(false)
        if (!result.success) {
          const fields = result.error.flatten().fieldErrors
          expect(fields.subject).toBeDefined()
        }
      }),
      { numRuns: 100 }
    )
  })

  it('rejects when message is empty', () => {
    fc.assert(
      fc.property(nonEmptyString, validEmail, nonEmptyString, (name, email, subject) => {
        const result = ContactSchema.safeParse({ name, email, subject, message: '' })
        expect(result.success).toBe(false)
        if (!result.success) {
          const fields = result.error.flatten().fieldErrors
          expect(fields.message).toBeDefined()
        }
      }),
      { numRuns: 100 }
    )
  })

  it('rejects when multiple required fields are empty', () => {
    fc.assert(
      fc.property(fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean(), (n, e, s, m) => {
        // At least one field must be invalid
        if (!n && !e && !s && !m) return // skip all-valid case (handled by Property 10)
        const data = {
          name: n ? '' : 'Alice',
          email: e ? 'bad-email' : 'alice@example.com',
          subject: s ? '' : 'Hello',
          message: m ? '' : 'World',
        }
        // Only test when at least one field is invalid
        if (!n && !e && !s && !m) return
        const hasInvalid = n || e || s || m
        if (!hasInvalid) return

        const result = ContactSchema.safeParse(data)
        if (hasInvalid) {
          expect(result.success).toBe(false)
        }
      }),
      { numRuns: 100 }
    )
  })
})
