import { ref } from 'vue'

const DEFAULT_DURATION_MS = 900

export const easeOutCubic = (progress: number): number => 1 - Math.pow(1 - progress, 3)

export const useCountUp = (durationMs: number = DEFAULT_DURATION_MS) => {
  const value = ref(0)
  let frame = 0

  const set = (target: number) => {
    if (import.meta.client) cancelAnimationFrame(frame)
    value.value = target
  }

  const to = (target: number) => {
    if (!import.meta.client) {
      value.value = target
      return
    }
    cancelAnimationFrame(frame)
    const from = value.value
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      value.value = Math.round(from + (target - from) * easeOutCubic(progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }

  return { value, to, set }
}
