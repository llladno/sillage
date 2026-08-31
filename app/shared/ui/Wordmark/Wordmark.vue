<script setup lang="ts">
import { SITE_NAME } from '~/shared/config/site'

withDefaults(defineProps<{ as?: 'h1' | 'span' }>(), { as: 'span' })
</script>

<template>
  <component :is="as" class="font-display uppercase tracking-[0.18em]">
    {{ SITE_NAME }}
  </component>
</template>
