<script setup lang="ts">
import { Wordmark } from '~/shared/ui'
import { LocaleSwitch } from '~/widgets/site-chrome/ui/LocaleSwitch'
import { NAV_SECTIONS } from '~/shared/config/site'
import { useBag } from '~/shared/lib'

const { t } = useI18n()
const bag = useBag()
</script>

<template>
  <header
    class="panel sticky top-0 z-40 mx-3 mt-3 flex items-center justify-between gap-4 rounded-panel bg-ground/80 px-5 py-3 backdrop-blur"
  >
    <Wordmark class="text-sm" />
    <nav
      class="hidden gap-5 text-xs uppercase tracking-widest text-ink-dim sm:flex"
      aria-label="Sections"
    >
      <a
        v-for="item in NAV_SECTIONS"
        :key="item.id"
        :href="`#${item.id}`"
        class="hover:text-ink"
      >
        {{ t(item.labelKey) }}
      </a>
    </nav>
    <div class="flex items-center gap-4 text-xs">
      <span data-testid="bag-count">
        {{ t('acquire.bag', { count: bag.count.value }) }}
      </span>
      <LocaleSwitch />
    </div>
  </header>
</template>
