<script setup lang="ts">
import { Wordmark } from '~/shared/ui'
import { AUTHOR_NAME, AUTHOR_TELEGRAM_URL } from '~/shared/config/site'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-32 border-t border-line px-6 py-12 text-sm text-ink-dim">
    <Wordmark class="text-xs" />
    <p class="mt-3">{{ t('footer.disclaimer') }}</p>
    <p class="mt-1">© {{ year }}</p>
    <p class="mt-3 text-xs">
      develop &amp; design by
      <a
        :href="AUTHOR_TELEGRAM_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="underline decoration-dotted underline-offset-2 transition-colors hover:text-ink"
      >
        {{ AUTHOR_NAME }}
      </a>
    </p>
  </footer>
</template>
