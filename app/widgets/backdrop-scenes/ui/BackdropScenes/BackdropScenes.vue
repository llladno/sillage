<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { clamp } from '~/shared/lib'
import { BackdropScene } from '~/widgets/backdrop-scenes/ui/BackdropScene'
import {
  BACKDROP_SCENES,
  PARALLAX_PX,
  REVEAL_SPAN,
} from '~/widgets/backdrop-scenes/model/constants'

type SceneState = { reveal: number; drift: number }

const states = reactive<SceneState[]>(
  BACKDROP_SCENES.map(() => ({ reveal: 0, drift: 0 })),
)

let cleanup: (() => void) | undefined

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let ticking = false

  const measure = () => {
    ticking = false
    const viewportH = window.innerHeight
    BACKDROP_SCENES.forEach((scene, index) => {
      const anchor = document.getElementById(scene.anchorId)
      const target = states[index]
      if (!anchor || !target) return
      const rect = anchor.getBoundingClientRect()
      const centre = rect.top + rect.height / 2
      const offset = (centre - viewportH / 2) / viewportH
      target.reveal = clamp(1 - Math.abs(offset) / REVEAL_SPAN, 0, 1)
      target.drift = reduced ? 0 : offset * PARALLAX_PX
    })
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(measure)
  }

  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  cleanup = () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <BackdropScene
      v-for="(scene, index) in BACKDROP_SCENES"
      :key="scene.anchorId"
      :src="scene.src"
      :side="scene.side"
      :reveal="states[index]?.reveal ?? 0"
      :drift="states[index]?.drift ?? 0"
    />
  </div>
</template>
