<script setup lang="ts">
import { useToasts } from '~/shared/lib'

const { toasts } = useToasts()
</script>

<template>
  <div
    data-testid="toasts"
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    role="status"
    aria-live="polite"
  >
    <p v-for="toast in toasts" :key="toast.id" class="panel px-4 py-2 text-sm">
      {{ toast.text }}
    </p>
  </div>
</template>
