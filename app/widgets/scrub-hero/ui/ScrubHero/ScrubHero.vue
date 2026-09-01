<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { clamp, useReducedMotion, useScrubFrames } from '~/shared/lib'
import { ScrubCanvas } from '~/widgets/scrub-hero/ui/ScrubCanvas'
import { HeroBeats } from '~/widgets/scrub-hero/ui/HeroBeats'
import { HeroFallback } from '~/widgets/scrub-hero/ui/HeroFallback'
import {
  FRAME_COUNT,
  FRAME_PATH_EXT,
  FRAME_PATH_PREFIX,
  HERO_FADE_END,
  HERO_FADE_START,
  HERO_MIN_OPACITY,
  MOBILE_MAX_WIDTH,
  STAGE_SCROLL_VH,
  USE_PLACEHOLDER,
} from '~/widgets/scrub-hero/model/constants'

const { t } = useI18n()
const reduced = useReducedMotion()
const isMounted = ref(false)
const isWide = ref(false)
const progress = ref(0)
const stage = ref<HTMLElement | null>(null)

const { images, settled } = useScrubFrames({
  prefix: FRAME_PATH_PREFIX,
  count: FRAME_COUNT,
  ext: FRAME_PATH_EXT,
  enabled: !USE_PLACEHOLDER,
})

const isCinematic = () => isMounted.value && !reduced.value && isWide.value

// Full opacity through the run, then dissolves to HERO_MIN_OPACITY as the scrub
// finishes and the sticky layer scrolls away.
const canvasOpacity = computed(() => {
  const span = HERO_FADE_END - HERO_FADE_START
  const fade = clamp((progress.value - HERO_FADE_START) / span, 0, 1)
  return 1 - fade * (1 - HERO_MIN_OPACITY)
})

let cleanup: (() => void) | undefined

onMounted(async () => {
  isWide.value = window.innerWidth > MOBILE_MAX_WIDTH
  isMounted.value = true
  await nextTick()
  if (!isCinematic() || !stage.value) return

  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  const trigger = ScrollTrigger.create({
    trigger: stage.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      progress.value = self.progress
    },
  })
  ScrollTrigger.refresh()
  cleanup = () => trigger.kill()
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <HeroFallback v-if="!isCinematic()" />
  <div v-else ref="stage" class="relative" :style="{ height: `${STAGE_SCROLL_VH}vh` }">
    <h1 class="sr-only">{{ t('hero.h1') }}</h1>
    <div
      class="sticky top-0 flex h-dvh items-center justify-center overflow-hidden bg-black"
    >
      <div
        class="relative aspect-video w-full max-w-[min(84vw,1180px)]"
        :style="{ opacity: canvasOpacity }"
      >
        <ScrubCanvas
          :progress="progress"
          :images="images"
          :settled="settled"
          fit="contain"
        />
        <!-- edges + base melt into pure black -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0"
          style="
            background:
              radial-gradient(ellipse 78% 82% at 50% 46%, transparent 55%, #000 92%),
              linear-gradient(to bottom, transparent 62%, #000 100%);
          "
        />
      </div>
      <HeroBeats :progress="progress" />
    </div>
  </div>
</template>
