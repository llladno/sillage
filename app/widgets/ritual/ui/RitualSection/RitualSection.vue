<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SectionShell } from '~/shared/ui'
import { loadGsap } from '~/shared/lib'
import {
  RITUAL_STEPS,
  SPINE_END,
  SPINE_START,
  STEP_STAGGER_S,
  STEP_START,
} from '~/widgets/ritual/model/constants'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)

let kill: (() => void) | undefined

onMounted(async () => {
  const context = await loadGsap()
  if (!context || !root.value) return
  const { gsap, ScrollTrigger } = context
  const element = root.value

  const scene = gsap.context(() => {
    gsap.fromTo(
      '[data-spine]',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: SPINE_START,
          end: SPINE_END,
          scrub: true,
        },
      },
    )
    gsap.from('[data-step]', {
      opacity: 0,
      x: 40,
      stagger: STEP_STAGGER_S,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: STEP_START },
    })
    gsap.from('[data-step-num]', {
      scale: 0.4,
      opacity: 0,
      transformOrigin: 'left center',
      stagger: STEP_STAGGER_S,
      duration: 0.6,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: element, start: STEP_START },
    })
  }, element)

  ScrollTrigger.refresh()
  kill = () => scene.revert()
})

onBeforeUnmount(() => kill?.())
</script>

<template>
  <SectionShell id="ritual" title-key="sections.ritual.title">
    <div ref="root" class="relative pl-10">
      <span
        data-spine
        aria-hidden="true"
        class="absolute left-1 top-2 bottom-2 w-px origin-top bg-accent/60"
      />
      <ol class="space-y-10">
        <li v-for="(key, index) in RITUAL_STEPS" :key="key" data-step class="flex gap-5">
          <span data-step-num class="font-display text-3xl leading-none text-accent">
            {{ index + 1 }}
          </span>
          <p class="max-w-md text-lg">{{ t(key) }}</p>
        </li>
      </ol>
    </div>
  </SectionShell>
</template>
