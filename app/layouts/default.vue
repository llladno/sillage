<script setup lang="ts">
import { Wordmark } from '~/shared/ui'
import { LocaleSwitch } from '~/widgets/site-chrome'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-dvh bg-ground text-ink">
    <header class="sticky top-0 z-40 flex items-center justify-between px-6 py-4">
      <Wordmark class="text-sm" />
      <LocaleSwitch />
    </header>
    <main><slot /></main>
    <footer class="hairline mt-24 border-t px-6 py-12 text-sm text-ink-dim">
      <p>{{ t('footer.disclaimer') }}</p>
    </footer>
  </div>
</template>
