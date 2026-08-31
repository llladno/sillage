<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { clamp } from '~/shared/lib'
import {
  ALPHA_MAX,
  ALPHA_MIN,
  BAND_HALF_WIDTH_FRAC,
  BAND_MARGIN_FRAC,
  DEPTH_FLOOR,
  EDGE_FEATHER,
  FALL_MAX,
  FALL_MIN,
  GLOW_CORE_ALPHA,
  GLOW_MID_ALPHA,
  GLOW_MID_STOP,
  PARTICLE_COUNT,
  SCROLL_COUPLING,
  SCROLL_VELOCITY_DECAY,
  SIZE_MAX,
  SIZE_MIN,
  SPAWN_MARGIN,
  SPRITE_SIZE,
  SWAY_AMPLITUDE_FRAC,
  SWAY_SPEED,
  SWEEP_LEAD_FRAC,
  TONE_RGB,
} from '~/shared/ui/SillageTrail/constants'

type Mote = {
  offsetX: number
  y: number
  fall: number
  size: number
  alpha: number
  phase: number
  tone: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
const opacity = ref(0)

const between = (min: number, max: number) => min + Math.random() * (max - min)

let cleanup: (() => void) | undefined

onMounted(() => {
  const element = canvas.value
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!element || prefersReduced) return
  const context = element.getContext('2d')
  if (!context) return

  let width = 0
  let height = 0
  let frame = 0
  let lastScrollY = window.scrollY
  let scrollVelocity = 0
  const motes: Mote[] = []

  const sprites = TONE_RGB.map((rgb) => {
    const sprite = document.createElement('canvas')
    sprite.width = SPRITE_SIZE
    sprite.height = SPRITE_SIZE
    const paint = sprite.getContext('2d')
    if (paint) {
      const middle = SPRITE_SIZE / 2
      const glow = paint.createRadialGradient(middle, middle, 0, middle, middle, middle)
      glow.addColorStop(0, `rgba(${rgb}, ${GLOW_CORE_ALPHA})`)
      glow.addColorStop(GLOW_MID_STOP, `rgba(${rgb}, ${GLOW_MID_ALPHA})`)
      glow.addColorStop(1, `rgba(${rgb}, 0)`)
      paint.fillStyle = glow
      paint.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE)
    }
    return sprite
  })

  const halfBand = () => width * BAND_HALF_WIDTH_FRAC

  const seed = () => {
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      motes.push({
        offsetX: between(-halfBand(), halfBand()),
        y: Math.random() * height,
        fall: between(FALL_MIN, FALL_MAX),
        size: between(SIZE_MIN, SIZE_MAX),
        alpha: between(ALPHA_MIN, ALPHA_MAX),
        phase: Math.random() * Math.PI * 2,
        tone: Math.floor(Math.random() * sprites.length),
      })
    }
  }

  const resize = () => {
    const ratio = window.devicePixelRatio || 1
    width = window.innerWidth
    height = window.innerHeight
    element.width = width * ratio
    element.height = height * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    if (motes.length === 0) seed()
  }

  // Fade in as the first section reaches the viewport — the hero stays clean.
  const updateGate = () => {
    const anchor = document.querySelector('#composition')
    if (!anchor) return
    const { top } = anchor.getBoundingClientRect()
    opacity.value = clamp(1 - top / window.innerHeight, 0, 1)
  }

  // The band's centre migrates left → right as the reader moves from the
  // composition anchor to the bottom of the page.
  const bandCentreX = () => {
    const anchor = document.querySelector('#composition')
    if (!anchor) return width * BAND_MARGIN_FRAC
    const anchorTopDoc = anchor.getBoundingClientRect().top + window.scrollY
    const startY = anchorTopDoc - window.innerHeight * SWEEP_LEAD_FRAC
    const endY = document.documentElement.scrollHeight - window.innerHeight
    const span = Math.max(endY - startY, 1)
    const travelled = clamp((window.scrollY - startY) / span, 0, 1)
    return (BAND_MARGIN_FRAC + travelled * (1 - 2 * BAND_MARGIN_FRAC)) * width
  }

  const onScroll = () => {
    scrollVelocity += window.scrollY - lastScrollY
    lastScrollY = window.scrollY
    updateGate()
  }

  const step = (time: number) => {
    scrollVelocity *= SCROLL_VELOCITY_DECAY

    // Idle cheaply while the trail is invisible (through the whole hero).
    if (opacity.value === 0) {
      frame = requestAnimationFrame(step)
      return
    }

    context.clearRect(0, 0, width, height)
    context.globalCompositeOperation = 'lighter'

    const centreX = bandCentreX()
    const edge = halfBand()
    const swayMax = width * SWAY_AMPLITUDE_FRAC
    const pull = scrollVelocity * SCROLL_COUPLING

    for (const mote of motes) {
      const depth = mote.size / SIZE_MAX + DEPTH_FLOOR
      mote.y += (mote.fall + pull) * depth

      if (mote.y > height + SPAWN_MARGIN) {
        mote.y = -SPAWN_MARGIN
        mote.offsetX = between(-edge, edge)
      } else if (mote.y < -SPAWN_MARGIN) {
        mote.y = height + SPAWN_MARGIN
        mote.offsetX = between(-edge, edge)
      }

      const sway = Math.sin(time * SWAY_SPEED + mote.phase) * swayMax
      const drawX = centreX + mote.offsetX + sway
      const falloff = Math.pow(
        clamp(1 - Math.abs(mote.offsetX) / edge, 0, 1),
        EDGE_FEATHER,
      )

      context.globalAlpha = mote.alpha * falloff
      context.drawImage(
        sprites[mote.tone] ?? sprites[0]!,
        drawX - mote.size / 2,
        mote.y - mote.size / 2,
        mote.size,
        mote.size,
      )
    }

    context.globalAlpha = 1
    context.globalCompositeOperation = 'source-over'
    frame = requestAnimationFrame(step)
  }

  resize()
  updateGate()
  window.addEventListener('resize', resize)
  window.addEventListener('scroll', onScroll, { passive: true })
  frame = requestAnimationFrame(step)

  cleanup = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', onScroll)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 h-full w-full"
    :style="{ opacity }"
  />
</template>
