<script setup lang="ts">
import { Wordmark } from '~/shared/ui'
import { HERO_BEATS } from '~/widgets/scrub-hero/model/constants'

const { t } = useI18n()

// `name` and `cta` beats are already the <h1> and the button below.
const CHROME_BEAT_IDS = ['name', 'cta']
const proseBeats = HERO_BEATS.filter((beat) => !CHROME_BEAT_IDS.includes(beat.id))
</script>

<template>
  <section class="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-24">
    <NuxtImg
      src="/hero-poster.webp"
      width="1600"
      height="900"
      class="absolute inset-0 h-full w-full object-cover opacity-60"
      alt=""
    />
    <div class="absolute inset-0 bg-ground/70" />
    <div class="relative text-center">
      <Wordmark as="h1" class="block text-4xl sm:text-6xl" />
      <p class="mt-6 font-display text-lg text-ink-dim">{{ t('hero.concept') }}</p>
      <ul class="mt-10 space-y-2 font-display text-xl text-ink">
        <li v-for="beat in proseBeats" :key="beat.id">{{ t(beat.key) }}</li>
      </ul>
      <a
        href="#acquire"
        class="mt-8 inline-block border-b border-accent pb-1 text-accent"
      >
        {{ t('hero.beats.cta') }}
      </a>
    </div>
  </section>
</template>
