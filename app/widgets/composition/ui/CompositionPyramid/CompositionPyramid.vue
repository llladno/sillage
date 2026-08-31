<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SectionShell } from '~/shared/ui'
import { getFragrance, NoteList } from '~/entities/fragrance'
import { useReducedMotion } from '~/shared/lib'
import type { Locale } from '~/shared/config/i18n'
import { REVEAL_START, STAGGER_S, TIERS } from '~/widgets/composition/model/constants'

const { locale, t } = useI18n()
const fragrance = computed(() => getFragrance(locale.value as Locale))
const reduced = useReducedMotion()
const root = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (reduced.value || !root.value) return
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  gsap.from(root.value.querySelectorAll('[data-note-row]'), {
    opacity: 0,
    y: 16,
    stagger: STAGGER_S,
    scrollTrigger: { trigger: root.value, start: REVEAL_START },
  })
})
</script>

<template>
  <SectionShell id="composition" title-key="sections.composition.title">
    <div ref="root">
      <NoteList
        v-for="tier in TIERS"
        :key="tier"
        :label="t(`composition.${tier}`)"
        :notes="fragrance.notes[tier]"
      />
    </div>
  </SectionShell>
</template>
