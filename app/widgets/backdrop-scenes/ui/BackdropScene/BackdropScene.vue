<script setup lang="ts">
import { computed } from 'vue'
import type { BackdropSide } from '~/widgets/backdrop-scenes/model/constants'
import { PEAK_OPACITY, SCENE_WIDTH_VW } from '~/widgets/backdrop-scenes/model/constants'

const props = defineProps<{
  src: string
  side: BackdropSide
  reveal: number
  drift: number
}>()

const maskGradient = computed(() => {
  const origin = props.side === 'left' ? 'left' : 'right'
  return `radial-gradient(135% 100% at ${origin} center, #000 24%, transparent 78%)`
})
</script>

<template>
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
    <NuxtImg
      :src="src"
      width="1200"
      height="1600"
      sizes="60vw"
      loading="lazy"
      alt=""
      aria-hidden="true"
      class="h-full w-full object-cover [mix-blend-mode:screen]"
      :style="{ maskImage: maskGradient, WebkitMaskImage: maskGradient }"
    />
  </div>
</template>
