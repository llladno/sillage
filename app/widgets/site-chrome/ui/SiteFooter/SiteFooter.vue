<script setup lang="ts">
import { Wordmark } from '~/shared/ui'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-32 border-t border-line px-6 py-12 text-sm text-ink-dim">
    <Wordmark class="text-xs" />
    <p class="mt-3">{{ t('footer.disclaimer') }}</p>
    <p class="mt-1">© {{ year }}</p>
  </footer>
</template>
