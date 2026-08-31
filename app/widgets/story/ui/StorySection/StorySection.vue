<script setup lang="ts">
import { SectionShell } from '~/shared/ui'

const { t } = useI18n()
</script>

<template>
  <SectionShell id="story" title-key="sections.story.title">
    <p class="max-w-prose text-lg leading-relaxed">{{ t('story.body') }}</p>
    <p class="mt-6 text-sm text-ink-dim">{{ t('story.perfumer') }}</p>
  </SectionShell>
</template>
