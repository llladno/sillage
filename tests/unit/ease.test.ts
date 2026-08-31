import { describe, expect, it } from 'vitest'
import { beatOpacity } from '~/shared/lib/ease'

describe('beatOpacity', () => {
  it('is 0 outside the window', () => {
    expect(beatOpacity(0.1, 0.3, 0.6)).toBe(0)
    expect(beatOpacity(0.9, 0.3, 0.6)).toBe(0)
  })
  it('is 1 in the plateau', () => {
    expect(beatOpacity(0.45, 0.3, 0.6, 0.05)).toBe(1)
  })
  it('ramps between 0 and 1 at the leading edge', () => {
    const value = beatOpacity(0.32, 0.3, 0.6, 0.05)
    expect(value).toBeGreaterThan(0)
    expect(value).toBeLessThan(1)
  })
})
