<script setup lang="ts">
import type { PanelId } from '~/widgets/object/model/constants'

defineProps<{ id: PanelId; index: number }>()
const { t } = useI18n()

const ordinal = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <article class="flex flex-col gap-6">
    <div class="panel aspect-[3/4] overflow-hidden rounded-panel">
      <NuxtImg
        :src="`/object/${id}.webp`"
        width="900"
        height="1200"
        loading="lazy"
        data-panel-image
        class="h-[114%] w-full object-cover"
        :alt="t(`object.panels.${id}.title`)"
      />
    </div>
    <div class="flex items-baseline gap-4">
      <span class="font-display text-4xl text-accent">{{ ordinal(index) }}</span>
      <div>
        <h3 class="font-display text-xl text-ink">
          {{ t(`object.panels.${id}.title`) }}
        </h3>
        <p class="mt-2 max-w-xs text-sm text-ink-dim">
          {{ t(`object.panels.${id}.body`) }}
        </p>
      </div>
    </div>
  </article>
</template>
