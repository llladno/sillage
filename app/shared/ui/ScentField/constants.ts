// Ambient scent field — fine amber motes streaming top-to-bottom along a
// value-noise flow field, quickening and re-braiding as the page scrolls.

export const PARTICLE_COUNT = 640

// Per-mote base velocity along the flow field (px/frame).
export const SPEED_MIN = 0.12
export const SPEED_MAX = 0.55

// Draw size of a mote's glow sprite (px). Also drives its parallax depth.
export const SIZE_MIN = 2
export const SIZE_MAX = 15

// Per-mote peak opacity (they accumulate under additive blending).
export const ALPHA_MIN = 0.05
export const ALPHA_MAX = 0.16

// Steady downward drift added to every mote (px/frame), depth-scaled.
export const BASE_FALL = 0.3

// Smallest share of fall / scroll pull the tiniest (farthest) motes feel.
export const DEPTH_FLOOR = 0.45

// Flow field.
export const NOISE_SCALE = 0.0016 // screen px -> noise space
export const NOISE_MIDPOINT = 0.5 // noise output centre
export const FIELD_ANGLE_RANGE = 2.4 // radians of lateral swing around vertical
export const FLOW_DRIFT = 0.0009 // idle field evolution per frame
export const FLOW_SCROLL_GAIN = 0.0007 // extra field evolution per px scrolled

// Scroll coupling.
export const SCROLL_COUPLING = 0.12 // share of scroll delta folded into the fall
export const SCROLL_VELOCITY_DECAY = 0.92 // per-frame easing of carried scroll speed

export const SPAWN_MARGIN = 60

// Glow sprite (built once per tone).
export const SPRITE_SIZE = 64
export const GLOW_CORE_ALPHA = 0.9
export const GLOW_MID_STOP = 0.5
export const GLOW_MID_ALPHA = 0.26

// Mote tones — warm amber, gold, pale sand — over the near-black ground.
export const TONE_RGB = ['198, 118, 44', '226, 166, 96', '238, 214, 176']

// Value-noise hash constants.
export const HASH_PRIME_X = 374761393
export const HASH_PRIME_Y = 668265263
export const HASH_MIX = 1274126177
export const HASH_SHIFT_A = 13
export const HASH_SHIFT_B = 16
export const HASH_MAX = 4294967295
