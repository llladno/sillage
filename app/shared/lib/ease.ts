import { clamp } from '~/shared/lib/clamp'

const DEFAULT_FADE = 0.06

export const beatOpacity = (
  progress: number,
  from: number,
  to: number,
  fade: number = DEFAULT_FADE,
): number => {
  if (progress <= from || progress >= to) return 0
  const rampIn = clamp((progress - from) / fade, 0, 1)
  const rampOut = clamp((to - progress) / fade, 0, 1)
  return Math.min(rampIn, rampOut)
}
