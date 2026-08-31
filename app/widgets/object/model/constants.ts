export const PANEL_IDS = ['glass', 'cap', 'fill', 'batch'] as const

export type PanelId = (typeof PANEL_IDS)[number]

// Horizontal slider only runs above this width; below it stacks vertically.
export const OBJECT_MOBILE_MAX_WIDTH = 768
// Extra viewport-heights of scroll the sticky slider consumes.
export const SLIDER_SCROLL_VH = 220
// The flacon silhouette trails the panel track for a parallax offset.
export const SILHOUETTE_PARALLAX = 0.35
