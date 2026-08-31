<script setup lang="ts">
defineProps<{ price: number }>()
</script>

<template>
  <span data-testid="price" class="block font-display text-3xl text-ink">
    €{{ price }}
  </span>
</template>
