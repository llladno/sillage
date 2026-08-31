<script setup lang="ts">
import { HERO_BEATS } from '~/widgets/scrub-hero/model/constants'
import { beatOpacity } from '~/shared/lib'

const props = defineProps<{ progress: number }>()
const { t } = useI18n()

const TRANSLATE_PX = 12

// `name` lives in the <h1> and on the flacon itself — no visible beat for it.
const beats = HERO_BEATS.filter((beat) => beat.id !== 'name')

const styleFor = (from: number, to: number) => {
  const opacity = beatOpacity(props.progress, from, to)
  return {
    opacity,
    transform: `translateY(${(1 - opacity) * TRANSLATE_PX}px)`,
  }
}
</script>

<template>
  <div
    class="pointer-events-none absolute inset-x-0 top-[18%] grid place-items-center text-center"
  >
    <p
      v-for="beat in beats"
      :key="beat.id"
      :data-beat="beat.id"
      class="absolute px-6 font-display text-2xl text-ink sm:text-4xl"
      :style="styleFor(beat.from, beat.to)"
    >
      <a
        v-if="beat.id === 'cta'"
        href="#acquire"
        class="pointer-events-auto border-b border-accent pb-1 text-accent"
      >
        {{ t(beat.key) }}
      </a>
      <template v-else>{{ t(beat.key) }}</template>
    </p>
  </div>
</template>
