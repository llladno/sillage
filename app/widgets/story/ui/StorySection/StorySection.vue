<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { SectionShell } from '~/shared/ui'
import { getFragrance } from '~/entities/fragrance'
import { loadGsap } from '~/shared/lib'
import type { Locale } from '~/shared/config/i18n'
import {
  BODY_LINE_STAGGER_S,
  BODY_START,
  LEAD_START,
  LEAD_WORD_STAGGER_S,
} from '~/widgets/story/model/constants'

const { locale, t } = useI18n()
const concept = computed(() => getFragrance(locale.value as Locale).concept)
const root = ref<HTMLElement | null>(null)

let kill: (() => void) | undefined

onMounted(async () => {
  const context = await loadGsap()
  if (!context || !root.value) return
  const { gsap, ScrollTrigger } = context
  const { SplitText } = await import('gsap/SplitText')
  gsap.registerPlugin(SplitText)
  const element = root.value

  const scene = gsap.context(() => {
    const lead = new SplitText('[data-lead]', { type: 'words', aria: 'none' })
    gsap.from(lead.words, {
      opacity: 0,
      yPercent: 60,
      stagger: LEAD_WORD_STAGGER_S,
      duration: 0.6,
      scrollTrigger: { trigger: '[data-lead]', start: LEAD_START },
    })

    const body = new SplitText('[data-body]', {
      type: 'lines',
      linesClass: 'overflow-hidden py-[0.1em]',
      aria: 'none',
    })
    gsap.from(body.lines, {
      yPercent: 110,
      opacity: 0,
      stagger: BODY_LINE_STAGGER_S,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-body]', start: BODY_START },
    })
  }, element)

  ScrollTrigger.refresh()
  kill = () => scene.revert()
})

onBeforeUnmount(() => kill?.())
</script>

<template>
  <SectionShell id="story" title-key="sections.story.title">
    <div ref="root">
      <p data-lead class="max-w-prose font-display text-3xl leading-tight text-ink">
        {{ concept }}
      </p>
      <p data-body class="mt-10 max-w-prose text-lg leading-relaxed">
        {{ t('story.body') }}
      </p>
      <p class="mt-6 text-sm text-ink-dim">{{ t('story.perfumer') }}</p>
    </div>
  </SectionShell>
</template>
