import { describe, expect, it } from 'vitest'
import { getFragrance } from '~/entities/fragrance'

describe('getFragrance', () => {
  it('returns 3 tiers with the fixed EN notes', () => {
    const fragrance = getFragrance('en')
    expect(fragrance.notes.top).toEqual(['bergamot', 'pink pepper', 'cold-metal accord'])
    expect(fragrance.notes.heart).toEqual(['iris', 'black tea', 'damask rose'])
    expect(fragrance.notes.base).toEqual(['vetiver', 'ambrette', 'papyrus', 'incense'])
  })

  it('returns FR notes for fr', () => {
    expect(getFragrance('fr').notes.top).toEqual([
      'bergamote',
      'poivre rose',
      'accord métal froid',
    ])
  })

  it('offers three sizes with correct prices', () => {
    const sizes = getFragrance('en').sizes
    expect(sizes.map((size) => size.priceEur)).toEqual([180, 260, 35])
  })
})
