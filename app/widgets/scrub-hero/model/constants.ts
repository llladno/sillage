import type { HeroBeat } from '~/widgets/scrub-hero/model/types'

export const FRAME_COUNT = 120
export const FRAME_PATH_PREFIX = '/sequence/frame-'
export const FRAME_PATH_EXT = 'webp'
export const STAGE_SCROLL_VH = 320
export const USE_PLACEHOLDER = true
export const MOBILE_MAX_WIDTH = 768

export const HERO_BEATS: HeroBeat[] = [
  // `from` below 0 so the first beat is already visible on load (progress 0).
  { id: 'name', from: -0.12, to: 0.2, key: 'hero.beats.name' },
  { id: 'tagline', from: 0.2, to: 0.42, key: 'hero.beats.tagline' },
  { id: 'edition', from: 0.44, to: 0.62, key: 'hero.beats.edition' },
  { id: 'notesLead', from: 0.64, to: 0.84, key: 'hero.beats.notesLead' },
  // `to` past 1 so the final beat never fades back out at the end of the scrub.
  { id: 'cta', from: 0.86, to: 1.15, key: 'hero.beats.cta' },
]
