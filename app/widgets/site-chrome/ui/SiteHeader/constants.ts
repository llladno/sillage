// The floating pill "sticks" and unfolds into a full-bleed bar as you scroll
// off the top — margins, radius and the top/side borders collapse to 0, only a
// hairline under the bar remains. Two thresholds (hysteresis) so a scroll
// position resting near the top can't flip the state back and forth.
export const CONDENSE_ENTER_PX = 8
export const CONDENSE_EXIT_PX = 2

// Duration of that unfold / re-fold, ms. Bound to the header's transition via
// an inline style so this stays the single source of the value.
export const CONDENSE_MS = 350
