<script setup lang="ts">
import { ref } from 'vue'
import { LOCALES } from '~/shared/config/i18n'
import { LOCALE_LABELS } from '~/widgets/site-chrome/ui/LocaleSwitch/constants'

const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const close = () => {
  open.value = false
}
const toggle = () => {
  open.value = !open.value
}

// Rows are real <a> in the static HTML (v-show, not v-if) so crawlLinks and
// hreflang discovery still see both locales.
onClickOutside(root, close)
onKeyStroke('Escape', close)
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="flex items-center gap-1.5 text-sm uppercase text-ink-dim transition-colors hover:text-ink"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="toggle"
    >
      {{ locale }}
      <span class="sr-only">— change language</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 10 6"
        class="h-1.5 w-2.5 transition-transform duration-200 motion-reduce:transition-none"
        :class="{ 'rotate-180': open }"
      >
        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </button>

    <Transition name="dropdown">
      <ul
        v-show="open"
        class="panel absolute -right-5 top-full z-50 mt-4 min-w-40 overflow-hidden rounded-panel bg-ground/90 py-1 backdrop-blur"
      >
        <li v-for="code in LOCALES" :key="code">
          <NuxtLink
            :to="switchLocalePath(code)"
            class="flex items-center justify-between gap-4 px-4 py-2 text-sm transition-colors hover:bg-ink/5"
            :class="code === locale ? 'text-ink' : 'text-ink-dim'"
            :aria-current="code === locale ? 'true' : undefined"
            @click="close"
          >
            {{ LOCALE_LABELS[code] }}
            <svg
              v-if="code === locale"
              aria-hidden="true"
              viewBox="0 0 12 10"
              class="h-2.5 w-3 shrink-0 text-accent"
            >
              <path
                d="M1 5l3.6 3.6L11 1"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              />
            </svg>
          </NuxtLink>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: none;
  }
}
</style>
