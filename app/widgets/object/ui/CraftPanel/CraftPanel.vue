<script setup lang="ts">
import type { PanelId } from '~/widgets/object/model/constants'

defineProps<{ id: PanelId; index: number }>()
const { t } = useI18n()

const ordinal = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <article class="flex flex-col justify-between gap-8">
    <span class="font-display text-5xl text-accent">{{ ordinal(index) }}</span>
    <div>
      <h3 class="font-display text-2xl text-ink">
        {{ t(`object.panels.${id}.title`) }}
      </h3>
      <p class="mt-3 max-w-xs text-ink-dim">{{ t(`object.panels.${id}.body`) }}</p>
    </div>
  </article>
</template>
