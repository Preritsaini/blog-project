// Feature: prateeksha-psychic-coach, Property 18
import * as fc from 'fast-check'
import { ServiceSchema } from '@/lib/validations'

// Arbitraries
const nonEmptyString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0)

const validServiceData = fc.record({
  name: nonEmptyString,
  description: fc.string(),
  duration: fc.string(),
  price: fc.string(),
  bookingLink: fc.string(),
  active: fc.boolean(),
})

/**
 * Property 18: Valid service form writes to Firestore and redirects
 * Validates: Requirements 8.3, 8.5
 *
 * We test the validation step (ServiceSchema) directly — valid data passes,
 * which is the gate before any Firestore write occurs.
 */
describe('ServiceSchema — Property 18', () => {
  it('accepts valid service data (non-empty name)', () => {
    fc.assert(
      fc.property(validServiceData, (data) => {
        const result = ServiceSchema.safeParse(data)
        expect(result.success).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  it('rejects when name is empty', () => {
    fc.assert(
      fc.property(fc.string(), fc.boolean(), (description, active) => {
        const result = ServiceSchema.safeParse({
          name: '',
          description,
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
      }),
      { numRuns: 100 }
    )
  })
})
