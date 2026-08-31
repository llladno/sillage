<script setup lang="ts">
import { useId } from 'vue'
import type { FieldTextProps } from '~/shared/ui/FieldText/types'

const props = defineProps<FieldTextProps>()
const model = defineModel<string>({ required: true })
const fieldId = useId()
const errorId = `${fieldId}-error`
</script>

<template>
  <div>
    <label :for="fieldId" class="text-xs uppercase tracking-widest text-ink-dim">
      {{ label }}
    </label>
    <input
      :id="fieldId"
      v-model="model"
      :type="props.type ?? 'text'"
      :placeholder="placeholder"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      class="mt-2 w-full border-b border-line bg-transparent py-2 outline-none focus:border-accent"
    />
    <p v-if="error" :id="errorId" class="mt-2 text-sm text-accent">{{ error }}</p>
  </div>
</template>
