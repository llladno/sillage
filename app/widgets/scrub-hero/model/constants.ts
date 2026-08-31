import type { HeroBeat } from '~/widgets/scrub-hero/model/types'

export const FRAME_COUNT = 121
export const FRAME_PATH_PREFIX = '/sequence/frame-'
export const FRAME_PATH_EXT = 'webp'
// Shorter stage → the 121 frames pass under less scroll, so the scrub reads
// faster and a dropped frame is on screen for less time.
export const STAGE_SCROLL_VH = 215
export const USE_PLACEHOLDER = false
export const MOBILE_MAX_WIDTH = 768

// The scrub canvas dissolves into the ground over the tail of the scroll, so the
// hand-off to the next section is a fade, not a cut.
export const HERO_FADE_START = 0.8
export const HERO_FADE_END = 1
export const HERO_MIN_OPACITY = 0

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
