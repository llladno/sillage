<script setup lang="ts">
import type { Size, SizeId } from '~/entities/fragrance'

defineProps<{ sizes: Size[]; label: string }>()
const model = defineModel<SizeId>({ required: true })
</script>

<template>
  <fieldset>
    <legend class="text-xs uppercase tracking-widest text-ink-dim">
      {{ label }}
    </legend>
    <div class="mt-3 flex flex-wrap gap-2" role="radiogroup" :aria-label="label">
      <label
        v-for="size in sizes"
        :key="size.id"
        class="cursor-pointer rounded-pill border px-4 py-2 text-sm"
        :class="
          model === size.id ? 'border-accent text-accent' : 'border-line text-ink-dim'
        "
      >
        <input
          v-model="model"
          type="radio"
          :value="size.id"
          class="sr-only"
          :aria-label="size.label"
        />
        {{ size.label }}
      </label>
    </div>
  </fieldset>
</template>
