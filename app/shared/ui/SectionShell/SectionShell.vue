<script setup lang="ts">
import type { SectionShellProps } from '~/shared/ui/SectionShell/types'

const props = withDefaults(defineProps<SectionShellProps>(), { headingLevel: 2 })
const { t } = useI18n()
const headingId = `${props.id}-title`
</script>

<template>
  <section :id="id" :aria-labelledby="headingId" class="mx-auto max-w-3xl px-6 py-24">
    <component
      :is="`h${headingLevel}`"
      :id="headingId"
      class="font-display text-3xl text-ink"
    >
      {{ t(titleKey) }}
    </component>
    <div class="mt-8"><slot /></div>
  </section>
</template>
