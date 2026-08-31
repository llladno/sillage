import { describe, expect, it } from 'vitest'
import { frameUrl } from '~/shared/lib/use-scrub-frames'

describe('frameUrl', () => {
  it('zero-pads to four digits, 1-based', () => {
    expect(frameUrl('/sequence/frame-', 1, 'webp')).toBe('/sequence/frame-0001.webp')
    expect(frameUrl('/sequence/frame-', 120, 'webp')).toBe('/sequence/frame-0120.webp')
  })
})
