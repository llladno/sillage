<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { clamp } from '~/shared/lib'
import {
  ALPHA_MAX,
  ALPHA_MIN,
  AMBER_RATIO,
  AMBER_RGB,
  CREAM_RGB,
  DRIFT_MAX,
  DRIFT_MIN,
  GLOW_SCALE,
  PARTICLE_COUNT,
  RADIUS_MAX,
  RADIUS_MIN,
  SCROLL_COUPLING,
  SCROLL_DEPTH_FLOOR,
  SCROLL_VELOCITY_DECAY,
  SPAWN_MARGIN,
  SWAY_AMPLITUDE,
  SWAY_SPEED,
} from '~/shared/ui/ScentField/constants'

type Particle = {
  x: number
  y: number
  radius: number
  drift: number
  alpha: number
  phase: number
  amber: boolean
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
  const particles: Particle[] = []

  const seed = () => {
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: between(RADIUS_MIN, RADIUS_MAX),
        drift: between(DRIFT_MIN, DRIFT_MAX),
        alpha: between(ALPHA_MIN, ALPHA_MAX),
        phase: Math.random() * Math.PI * 2,
        amber: Math.random() < AMBER_RATIO,
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
    if (particles.length === 0) seed()
  }

  // Fade in as the first section reaches the viewport — the hero stays clean.
  const updateGate = () => {
    const anchor = document.querySelector('#composition')
    if (!anchor) return
    const { top } = anchor.getBoundingClientRect()
    opacity.value = clamp(1 - top / window.innerHeight, 0, 1)
  }

  let lastScrollY = window.scrollY
  let scrollVelocity = 0
  const onScroll = () => {
    scrollVelocity += window.scrollY - lastScrollY
    lastScrollY = window.scrollY
    updateGate()
  }

  const step = (time: number) => {
    scrollVelocity *= SCROLL_VELOCITY_DECAY

    // Idle cheaply while the field is invisible (through the whole hero).
    if (opacity.value === 0) {
      frame = requestAnimationFrame(step)
      return
    }

    context.clearRect(0, 0, width, height)
    const fall = scrollVelocity * SCROLL_COUPLING

    for (const particle of particles) {
      const depth = particle.radius / RADIUS_MAX + SCROLL_DEPTH_FLOOR
      particle.y += particle.drift + fall * depth
      if (particle.y > height + SPAWN_MARGIN) {
        particle.y = -SPAWN_MARGIN
        particle.x = Math.random() * width
      } else if (particle.y < -SPAWN_MARGIN) {
        particle.y = height + SPAWN_MARGIN
        particle.x = Math.random() * width
      }

      const drawX =
        particle.x + Math.sin(time * SWAY_SPEED + particle.phase) * SWAY_AMPLITUDE
      const reach = particle.radius * GLOW_SCALE
      const rgb = particle.amber ? AMBER_RGB : CREAM_RGB
      const glow = context.createRadialGradient(
        drawX,
        particle.y,
        0,
        drawX,
        particle.y,
        reach,
      )
      glow.addColorStop(0, `rgba(${rgb}, ${particle.alpha})`)
      glow.addColorStop(1, `rgba(${rgb}, 0)`)
      context.fillStyle = glow
      context.beginPath()
      context.arc(drawX, particle.y, reach, 0, Math.PI * 2)
      context.fill()
    }

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
