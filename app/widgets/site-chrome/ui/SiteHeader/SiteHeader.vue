<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Wordmark } from '~/shared/ui'
import { LocaleSwitch } from '~/widgets/site-chrome/ui/LocaleSwitch'
import { NAV_SECTIONS } from '~/shared/config/site'
import { useBag } from '~/shared/lib'
import { CONDENSE_SCROLL_PX } from '~/widgets/site-chrome/ui/SiteHeader/constants'

const { t } = useI18n()
const bag = useBag()

// Off the very top → the pill unfolds into a full-bleed bar (see the class
// binding below). rAF-throttled, same pattern as BackdropScenes.
const condensed = ref(false)
let ticking = false
let cleanup: (() => void) | undefined

onMounted(() => {
  const measure = () => {
    ticking = false
    condensed.value = window.scrollY > CONDENSE_SCROLL_PX
  }
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(measure)
  }
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  cleanup = () => window.removeEventListener('scroll', onScroll)
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <header
    :class="[
      'sticky top-0 z-40 flex items-center justify-between gap-4 border border-line px-5 py-3 backdrop-blur transition-[margin,border-radius,border-width,background-color] duration-[350ms] ease-out motion-reduce:transition-none',
      condensed
        ? 'mx-0 mt-0 rounded-b-panel rounded-t-none border-x-0 border-t-0 bg-ground/95'
        : 'mx-3 mt-3 rounded-panel bg-ground/80',
    ]"
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
