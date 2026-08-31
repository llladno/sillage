import { describe, expect, it } from 'vitest'
import { clamp } from '~/shared/lib/clamp'

describe('clamp', () => {
  it('returns the value when inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it('clamps below min and above max', () => {
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(42, 0, 10)).toBe(10)
  })
})
