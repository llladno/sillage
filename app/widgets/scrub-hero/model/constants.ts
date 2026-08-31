import type { HeroBeat } from '~/widgets/scrub-hero/model/types'

export const FRAME_COUNT = 121
export const FRAME_PATH_PREFIX = '/sequence/frame-'
export const FRAME_PATH_EXT = 'webp'
export const STAGE_SCROLL_VH = 320
export const USE_PLACEHOLDER = false
export const MOBILE_MAX_WIDTH = 768

export const HERO_BEATS: HeroBeat[] = [
  // `name` is not rendered as a visible beat (it is the <h1> and the flacon
  // engraving); kept here for the fallback list and the sr-only heading.
  { id: 'name', from: -0.12, to: 0.15, key: 'hero.beats.name' },
  // `from` below 0 so the first visible beat is up on load.
  { id: 'tagline', from: -0.05, to: 0.34, key: 'hero.beats.tagline' },
  { id: 'edition', from: 0.4, to: 0.62, key: 'hero.beats.edition' },
  { id: 'notesLead', from: 0.66, to: 0.84, key: 'hero.beats.notesLead' },
  // `to` past 1 so the final beat never fades back out at the end of the scrub.
  { id: 'cta', from: 0.88, to: 1.15, key: 'hero.beats.cta' },
]
