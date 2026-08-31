<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { SectionShell } from '~/shared/ui'
import { getFragrance, NoteList } from '~/entities/fragrance'
import { loadGsap } from '~/shared/lib'
import type { Locale } from '~/shared/config/i18n'
import {
  BACKDROP_EDGE_MASK,
  BACKDROP_PARALLAX_PERCENT,
  DEFAULT_ROW_PARALLAX,
  REVEAL_START,
  ROW_PARALLAX_PERCENT,
  ROW_STAGGER_S,
  TIERS,
} from '~/widgets/composition/model/constants'

const { locale, t } = useI18n()
const fragrance = computed(() => getFragrance(locale.value as Locale))
const root = ref<HTMLElement | null>(null)

let kill: (() => void) | undefined

onMounted(async () => {
  const context = await loadGsap()
  if (!context || !root.value) return
  const { gsap, ScrollTrigger } = context
  const element = root.value

  const drift = gsap.context(() => {
    gsap.to('[data-backdrop]', {
      yPercent: -BACKDROP_PARALLAX_PERCENT,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    gsap.utils.toArray<HTMLElement>('[data-note-row]').forEach((row, index) => {
      gsap.to(row, {
        yPercent: ROW_PARALLAX_PERCENT[index] ?? DEFAULT_ROW_PARALLAX,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })
    gsap.from('[data-note-row]', {
      opacity: 0,
      xPercent: -6,
      stagger: ROW_STAGGER_S,
      duration: 0.7,
      scrollTrigger: { trigger: element, start: REVEAL_START },
    })
  }, element)

  ScrollTrigger.refresh()
  kill = () => drift.revert()
})

onBeforeUnmount(() => kill?.())
</script>

<template>
  <SectionShell id="composition" title-key="sections.composition.title">
    <div ref="root" class="relative overflow-x-clip">
      <div
        data-backdrop
        aria-hidden="true"
        class="pointer-events-none absolute -inset-x-6 top-1/2 flex -translate-y-1/2 flex-col font-display text-[16vw] uppercase leading-[0.82] tracking-tight text-ink/5"
        :style="{ maskImage: BACKDROP_EDGE_MASK, WebkitMaskImage: BACKDROP_EDGE_MASK }"
      >
        <span v-for="tier in TIERS" :key="tier">{{ t(`composition.${tier}`) }}</span>
      </div>
      <div class="relative z-10">
        <NoteList
          v-for="tier in TIERS"
          :key="tier"
          :label="t(`composition.${tier}`)"
          :notes="fragrance.notes[tier]"
        />
      </div>
    </div>
  </SectionShell>
</template>
