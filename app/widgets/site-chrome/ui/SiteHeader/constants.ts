// Past this many pixels of scroll the floating pill "sticks" and unfolds into
// a full-bleed bar — margins, radius and the top/side borders collapse to 0,
// only a hairline under the bar remains.
export const CONDENSE_SCROLL_PX = 4

// Duration of that unfold / re-fold, ms. Mirrored in the template's
// `duration-[...]` utility; kept here so the value has one home.
export const CONDENSE_MS = 350
