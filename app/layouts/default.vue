<script setup lang="ts">
import { Wordmark, ToastStack } from '~/shared/ui'
import { LocaleSwitch } from '~/widgets/site-chrome'
import { useBag } from '~/shared/lib'

const { t } = useI18n()
const bag = useBag()
</script>

<template>
  <div class="min-h-dvh bg-ground text-ink">
    <header class="sticky top-0 z-40 flex items-center justify-between px-6 py-4">
      <Wordmark class="text-sm" />
      <div class="flex items-center gap-4 text-xs">
        <span data-testid="bag-count">
          {{ t('acquire.bag', { count: bag.count.value }) }}
        </span>
        <LocaleSwitch />
      </div>
    </header>
    <main><slot /></main>
    <footer class="hairline mt-24 border-t px-6 py-12 text-sm text-ink-dim">
      <p>{{ t('footer.disclaimer') }}</p>
    </footer>
    <ToastStack />
  </div>
</template>
