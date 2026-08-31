<script setup lang="ts">
import { computed } from 'vue'
import type { BackdropSide } from '~/widgets/backdrop-scenes/model/constants'
import {
  PEAK_OPACITY,
  SCENE_IMG_HEIGHT,
  SCENE_IMG_WIDTH,
  SCENE_WIDTH_VW,
} from '~/widgets/backdrop-scenes/model/constants'

const props = defineProps<{
  src: string
  side: BackdropSide
  reveal: number
  drift: number
}>()

// Melt the inner edge and corners into the ground so text never fights it.
const maskGradient = computed(() => {
  const origin = props.side === 'left' ? 'left' : 'right'
  return `radial-gradient(135% 105% at ${origin} center, #000 22%, transparent 82%)`
})
</script>

<template>
  <!-- Plain <img>, not <NuxtImg>: this layer is client-only, so IPX never
       prerenders these URLs — the raw file in /public is what ships. -->
  <div
    data-backdrop-scene
    aria-hidden="true"
    class="absolute -top-[15%] h-[130%]"
    :class="side === 'left' ? 'left-0' : 'right-0'"
    :style="{
      width: `${SCENE_WIDTH_VW}vw`,
      opacity: reveal * PEAK_OPACITY,
      transform: `translate3d(0, ${drift}px, 0)`,
    }"
  >
    <img
      :src="src"
      :width="SCENE_IMG_WIDTH"
      :height="SCENE_IMG_HEIGHT"
      alt=""
      aria-hidden="true"
      decoding="async"
      loading="lazy"
      class="h-full w-full object-cover [filter:brightness(0.86)]"
      :style="{ maskImage: maskGradient, WebkitMaskImage: maskGradient }"
    />
  </div>
</template>
