<script setup lang="ts">
import { SectionShell } from '~/shared/ui'

const { t } = useI18n()
</script>

<template>
  <SectionShell id="object" title-key="sections.object.title">
    <div class="grid gap-8 sm:grid-cols-2 sm:items-center">
      <NuxtImg
        src="/object.webp"
        width="800"
        height="1000"
        class="panel w-full"
        :alt="t('sections.object.title')"
      />
      <p class="text-lg leading-relaxed">{{ t('object.body') }}</p>
    </div>
  </SectionShell>
</template>
