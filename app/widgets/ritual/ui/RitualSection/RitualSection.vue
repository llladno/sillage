<script setup lang="ts">
import { SectionShell } from '~/shared/ui'
import { RITUAL_STEPS } from '~/widgets/ritual/model/constants'

const { t } = useI18n()
</script>

<template>
  <SectionShell id="ritual" title-key="sections.ritual.title">
    <ol class="space-y-6">
      <li v-for="(key, index) in RITUAL_STEPS" :key="key" class="flex gap-4">
        <span class="font-display text-accent">{{ index + 1 }}</span>
        <p class="text-lg">{{ t(key) }}</p>
      </li>
    </ol>
  </SectionShell>
</template>
