import { describe, expect, it } from 'vitest'
import { frameIndexFor } from '~/widgets/scrub-hero/ui/ScrubCanvas/paint'

describe('frameIndexFor', () => {
  it('maps progress 0..1 to frame 0..count-1', () => {
    expect(frameIndexFor(0, 120)).toBe(0)
    expect(frameIndexFor(1, 120)).toBe(119)
    expect(frameIndexFor(0.5, 121)).toBe(60)
  })
  it('clamps out-of-range progress', () => {
    expect(frameIndexFor(-0.2, 120)).toBe(0)
    expect(frameIndexFor(1.5, 120)).toBe(119)
  })
})
