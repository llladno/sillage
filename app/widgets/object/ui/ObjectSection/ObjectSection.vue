<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { SectionShell } from '~/shared/ui'
import { loadGsap, useReducedMotion } from '~/shared/lib'
import { CraftPanel } from '~/widgets/object/ui/CraftPanel'
import {
  OBJECT_MOBILE_MAX_WIDTH,
  PANEL_IDS,
  SILHOUETTE_PARALLAX,
  SLIDER_SCROLL_VH,
} from '~/widgets/object/model/constants'

const { t } = useI18n()
const reduced = useReducedMotion()
const isMounted = ref(false)
const isWide = ref(false)
const slideProgress = ref(0)
const stage = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)

const isCinematic = () => isMounted.value && isWide.value && !reduced.value

let kill: (() => void) | undefined

onMounted(async () => {
  isWide.value = window.innerWidth > OBJECT_MOBILE_MAX_WIDTH
  isMounted.value = true
  await nextTick()

  const context = await loadGsap()
  if (!context || !isCinematic() || !stage.value || !track.value) return
  const { gsap, ScrollTrigger } = context
  const stageEl = stage.value
  const trackEl = track.value

  // Sticky inner layer (no ScrollTrigger pin) → no pin-spacer, so triggers in
  // sections below this one keep their positions.
  const scene = gsap.context(() => {
    const distance = () => Math.max(trackEl.scrollWidth - window.innerWidth, 1)
    const shared = {
      trigger: stageEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true as const,
      invalidateOnRefresh: true,
    }
    gsap.to(trackEl, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        ...shared,
        onUpdate: (self) => {
          slideProgress.value = self.progress
        },
      },
    })
    gsap.to('[data-silhouette]', {
      x: () => -distance() * SILHOUETTE_PARALLAX,
      ease: 'none',
      scrollTrigger: shared,
    })
  }, stageEl)

  ScrollTrigger.refresh()
  kill = () => scene.revert()
})

onBeforeUnmount(() => kill?.())
</script>

<template>
  <SectionShell id="object" title-key="sections.object.title">
    <!-- SSR / reduced-motion / mobile: plain vertical stack -->
    <div v-if="!isCinematic()" class="space-y-16">
      <p class="max-w-prose text-lg leading-relaxed">{{ t('object.body') }}</p>
      <CraftPanel
        v-for="(panelId, index) in PANEL_IDS"
        :id="panelId"
        :key="panelId"
        :index="index"
      />
    </div>

    <!-- Desktop: full-bleed sticky horizontal slider -->
    <div
      v-else
      ref="stage"
      :data-slide-progress="slideProgress.toFixed(2)"
      class="relative left-1/2 w-screen -translate-x-1/2"
      :style="{ height: `${SLIDER_SCROLL_VH}vh` }"
    >
      <div class="sticky top-0 flex h-dvh items-center overflow-hidden">
        <div
          data-silhouette
          aria-hidden="true"
          class="pointer-events-none absolute right-[10%] top-1/2 h-[44vh] w-[13vh] -translate-y-1/2 rounded-[16px] border border-line bg-gradient-to-b from-ink/10 to-ink/[0.02] shadow-[0_0_140px_50px_rgba(200,100,30,0.14)]"
        />
        <div
          ref="track"
          class="flex items-center gap-[10vw] pl-[8vw] pr-[50vw] will-change-transform"
        >
          <CraftPanel
            v-for="(panelId, index) in PANEL_IDS"
            :id="panelId"
            :key="panelId"
            :index="index"
            class="w-[68vw] shrink-0 sm:w-[30vw]"
          />
        </div>
      </div>
    </div>
  </SectionShell>
</template>
