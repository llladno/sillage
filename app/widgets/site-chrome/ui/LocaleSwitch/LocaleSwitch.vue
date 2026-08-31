<script setup lang="ts">
import { LOCALES } from '~/shared/config/i18n'

const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()
</script>

<template>
  <nav class="flex gap-2 text-sm uppercase" aria-label="Language">
    <NuxtLink
      v-for="code in LOCALES"
      :key="code"
      :to="switchLocalePath(code)"
      :aria-current="code === locale ? 'true' : undefined"
      :class="code === locale ? 'text-ink' : 'text-ink-dim'"
    >
      {{ code }}
    </NuxtLink>
  </nav>
</template>
