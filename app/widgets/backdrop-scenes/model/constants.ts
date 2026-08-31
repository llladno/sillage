// As the reader scrolls, a large muted photograph surfaces behind the content
// for each section — alternating left / right — screen-blended so only its
// highlights lift out of the near-black ground. Rich, quiet, expensive.

export type BackdropSide = 'left' | 'right'

export type BackdropSceneConfig = {
  anchorId: string
  src: string
  side: BackdropSide
}

export const BACKDROP_SCENES: BackdropSceneConfig[] = [
  { anchorId: 'composition', src: '/object/glass.webp', side: 'left' },
  { anchorId: 'story', src: '/story.webp', side: 'right' },
  { anchorId: 'object', src: '/object.webp', side: 'left' },
  { anchorId: 'ritual', src: '/object/fill.webp', side: 'right' },
  { anchorId: 'acquire', src: '/acquire.webp', side: 'left' },
  { anchorId: 'newsletter', src: '/object/cap.webp', side: 'right' },
]

// Fraction of a viewport height over which a scene fades from nothing to full
// as its centre travels toward the viewport centre.
export const REVEAL_SPAN = 0.92

// Opacity of a scene at full reveal (screen blend over near-black — only the
// bright parts of the image ever surface).
export const PEAK_OPACITY = 0.5

// Vertical parallax travel, px per viewport of scroll offset.
export const PARALLAX_PX = 88

// Scene box width, as a fraction of the viewport width.
export const SCENE_WIDTH_VW = 52
