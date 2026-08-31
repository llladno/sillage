import { describe, expect, it } from 'vitest'
import { EMAIL_RE } from '~/widgets/newsletter/model/constants'

describe('EMAIL_RE', () => {
  it('accepts a normal address', () => {
    expect(EMAIL_RE.test('a@b.co')).toBe(true)
  })
  it('rejects malformed input', () => {
    for (const bad of ['foo', 'foo@', '@b.co', 'a b@c.co', 'a@b']) {
      expect(EMAIL_RE.test(bad)).toBe(false)
    }
  })
})
