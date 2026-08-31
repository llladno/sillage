import type { NoteTier } from '~/entities/fragrance'

export const TIERS: readonly NoteTier[] = ['top', 'heart', 'base']

// Each note row drifts up at its own rate → layered parallax depth.
export const ROW_PARALLAX_PERCENT = [-6, -14, -24]
export const DEFAULT_ROW_PARALLAX = -6
// The oversized tier words behind the notes drift the other way.
export const BACKDROP_PARALLAX_PERCENT = 12
export const REVEAL_START = 'top 80%'
export const ROW_STAGGER_S = 0.12

// The watermark words bleed past the section — fade their top and bottom into
// the ground so there is no hard clipped edge.
export const BACKDROP_EDGE_MASK =
  'linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)'
