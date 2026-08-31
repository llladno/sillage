// A single vertical "sillage" trail — a soft column of amber sand that
// tracks the viewport, pours downward with the scroll, and drifts across
// the screen left-to-right as the reader moves down the page.

export const PARTICLE_COUNT = 210

// Horizontal geometry, as fractions of the viewport width.
export const BAND_MARGIN_FRAC = 0.13 // keep the trail's travel off the very edges
export const BAND_HALF_WIDTH_FRAC = 0.09 // half-width of the sand column
export const SWAY_AMPLITUDE_FRAC = 0.022 // sideways breathing of a mote within the band

// Where the left-to-right sweep begins: this fraction of a viewport height of
// the composition anchor must be on screen before the band leaves the left edge.
export const SWEEP_LEAD_FRAC = 0.5

// Vertical motion (viewport px per frame).
export const FALL_MIN = 0.35
export const FALL_MAX = 1.05

// Scroll coupling — the sand descends with the scroll.
export const SCROLL_COUPLING = 0.16 // share of the scroll delta folded into the fall
export const SCROLL_VELOCITY_DECAY = 0.9 // per-frame easing of carried scroll speed

export const SWAY_SPEED = 0.0004

// Depth / render.
export const SIZE_MIN = 2
export const SIZE_MAX = 13
export const DEPTH_FLOOR = 0.45
export const ALPHA_MIN = 0.05
export const ALPHA_MAX = 0.18
export const EDGE_FEATHER = 1.8 // exponent on the 0..1 band-edge falloff

export const SPAWN_MARGIN = 60

// Glow sprite (built once per tone).
export const SPRITE_SIZE = 64
export const GLOW_CORE_ALPHA = 0.9
export const GLOW_MID_STOP = 0.5
export const GLOW_MID_ALPHA = 0.26

// Trail tones — warm amber, gold, pale sand — over the near-black ground.
export const TONE_RGB = ['198, 118, 44', '226, 166, 96', '238, 214, 176']
