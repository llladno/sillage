<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { clamp } from '~/shared/lib'
import {
  ALPHA_MAX,
  ALPHA_MIN,
  BASE_FALL,
  DEPTH_FLOOR,
  FIELD_ANGLE_RANGE,
  FLOW_DRIFT,
  FLOW_SCROLL_GAIN,
  GLOW_CORE_ALPHA,
  GLOW_MID_ALPHA,
  GLOW_MID_STOP,
  HASH_MAX,
  HASH_MIX,
  HASH_PRIME_X,
  HASH_PRIME_Y,
  HASH_SHIFT_A,
  HASH_SHIFT_B,
  NOISE_MIDPOINT,
  NOISE_SCALE,
  PARTICLE_COUNT,
  SCROLL_COUPLING,
  SCROLL_VELOCITY_DECAY,
  SIZE_MAX,
  SIZE_MIN,
  SPAWN_MARGIN,
  SPEED_MAX,
  SPEED_MIN,
  SPRITE_SIZE,
  TONE_RGB,
} from '~/shared/ui/ScentField/constants'

type Mote = {
  x: number
  y: number
  speed: number
  size: number
  alpha: number
  tone: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
const opacity = ref(0)

const between = (min: number, max: number) => min + Math.random() * (max - min)

const hashCell = (xCell: number, yCell: number) => {
  const blended = xCell * HASH_PRIME_X + yCell * HASH_PRIME_Y
  const churned = (blended ^ (blended >>> HASH_SHIFT_A)) * HASH_MIX
  return ((churned ^ (churned >>> HASH_SHIFT_B)) >>> 0) / HASH_MAX
}

const easeCell = (fraction: number) => fraction * fraction * (3 - 2 * fraction)

// Value-noise flow field — organic streams without a noise library.
const flowNoise = (xCoord: number, yCoord: number) => {
  const xBase = Math.floor(xCoord)
  const yBase = Math.floor(yCoord)
  const xFraction = easeCell(xCoord - xBase)
  const yFraction = easeCell(yCoord - yBase)
  const cornerTopLeft = hashCell(xBase, yBase)
  const cornerTopRight = hashCell(xBase + 1, yBase)
  const cornerLowLeft = hashCell(xBase, yBase + 1)
  const cornerLowRight = hashCell(xBase + 1, yBase + 1)
  const edgeTop = cornerTopLeft + (cornerTopRight - cornerTopLeft) * xFraction
  const edgeLow = cornerLowLeft + (cornerLowRight - cornerLowLeft) * xFraction
  return edgeTop + (edgeLow - edgeTop) * yFraction
}

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
  let flowOffset = 0
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

  const seed = () => {
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: between(SPEED_MIN, SPEED_MAX),
        size: between(SIZE_MIN, SIZE_MAX),
        alpha: between(ALPHA_MIN, ALPHA_MAX),
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

  const onScroll = () => {
    scrollVelocity += window.scrollY - lastScrollY
    lastScrollY = window.scrollY
    updateGate()
  }

  const step = () => {
    scrollVelocity *= SCROLL_VELOCITY_DECAY
    flowOffset += FLOW_DRIFT + Math.abs(scrollVelocity) * FLOW_SCROLL_GAIN

    // Idle cheaply while the field is invisible (through the whole hero).
    if (opacity.value === 0) {
      frame = requestAnimationFrame(step)
      return
    }

    context.clearRect(0, 0, width, height)
    context.globalCompositeOperation = 'lighter'
    const pull = scrollVelocity * SCROLL_COUPLING

    for (const mote of motes) {
      const depth = mote.size / SIZE_MAX + DEPTH_FLOOR
      const field = flowNoise(mote.x * NOISE_SCALE, mote.y * NOISE_SCALE + flowOffset)
      const angle = (field - NOISE_MIDPOINT) * FIELD_ANGLE_RANGE
      mote.x += Math.sin(angle) * mote.speed
      mote.y += Math.cos(angle) * mote.speed + (BASE_FALL + pull) * depth

      if (mote.y > height + SPAWN_MARGIN) {
        mote.y = -SPAWN_MARGIN
        mote.x = Math.random() * width
      } else if (mote.y < -SPAWN_MARGIN) {
        mote.y = height + SPAWN_MARGIN
        mote.x = Math.random() * width
      }
      if (mote.x > width + SPAWN_MARGIN) mote.x = -SPAWN_MARGIN
      else if (mote.x < -SPAWN_MARGIN) mote.x = width + SPAWN_MARGIN

      context.globalAlpha = mote.alpha
      context.drawImage(
        sprites[mote.tone] ?? sprites[0]!,
        mote.x - mote.size / 2,
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
