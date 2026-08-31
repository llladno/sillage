<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useReducedMotion, useScrubFrames } from '~/shared/lib'
import { ScrubCanvas } from '~/widgets/scrub-hero/ui/ScrubCanvas'
import { HeroBeats } from '~/widgets/scrub-hero/ui/HeroBeats'
import { HeroFallback } from '~/widgets/scrub-hero/ui/HeroFallback'
import {
  FRAME_COUNT,
  FRAME_PATH_EXT,
  FRAME_PATH_PREFIX,
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

const { images } = useScrubFrames({
  prefix: FRAME_PATH_PREFIX,
  count: FRAME_COUNT,
  ext: FRAME_PATH_EXT,
  enabled: !USE_PLACEHOLDER,
})

const isCinematic = () => isMounted.value && !reduced.value && isWide.value

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
    <h1 class="sr-only">{{ t('hero.beats.name') }} — {{ t('hero.concept') }}</h1>
    <div class="sticky top-0 h-dvh overflow-hidden">
      <ScrubCanvas :progress="progress" :images="images" />
      <HeroBeats :progress="progress" />
    </div>
  </div>
</template>
