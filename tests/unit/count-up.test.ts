import { describe, expect, it } from 'vitest'
import { easeOutCubic } from '~/shared/lib/use-count-up'

describe('easeOutCubic', () => {
  it('pins the endpoints', () => {
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
  })
  it('is ahead of linear in the middle (ease-out)', () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5)
  })
})
