// As the reader scrolls, a large muted photograph surfaces behind the content
// for each section — alternating left / right — dimmed into the near-black
// ground. Rich, quiet, expensive.

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

// Opacity of a scene when its section fully occupies the viewport.
export const PEAK_OPACITY = 0.2

// Vertical parallax travel, px per viewport of scroll offset.
export const PARALLAX_PX = 74

// Scene box: width as a fraction of the viewport; intrinsic image size for
// the <img> aspect box (no CLS).
export const SCENE_WIDTH_VW = 52
export const SCENE_IMG_WIDTH = 1200
export const SCENE_IMG_HEIGHT = 1600
