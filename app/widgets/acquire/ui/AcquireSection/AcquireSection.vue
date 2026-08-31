<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SectionShell } from '~/shared/ui'
import { getFragrance, PriceTag, SizeSelect } from '~/entities/fragrance'
import type { Fragrance, SizeId } from '~/entities/fragrance'
import type { Locale } from '~/shared/config/i18n'
import { loadGsap, useBag, useCountUp, useFakeSubmit, useToasts } from '~/shared/lib'

const { locale, t } = useI18n()
const fragrance = computed<Fragrance>(() => getFragrance(locale.value as Locale))
const selected = ref<SizeId>('ml50')
const current = computed(() => {
  const match = fragrance.value.sizes.find((size) => size.id === selected.value)
  if (!match) throw new Error(`unknown size: ${selected.value}`)
  return match
})

const { value: shownPrice, to: countTo, set: countSet } = useCountUp()
countSet(current.value.priceEur)
const root = ref<HTMLElement | null>(null)
const hasEntered = ref(false)

watch(
  () => current.value.priceEur,
  (next) => (hasEntered.value ? countTo(next) : countSet(next)),
)

const bag = useBag()
const { pending, run } = useFakeSubmit()
const { push } = useToasts()

const addToBag = () =>
  run(() => {
    bag.add()
    push(t('acquire.added', { size: current.value.label }))
  })

let kill: (() => void) | undefined

onMounted(async () => {
  const context = await loadGsap()
  if (!context || !root.value) return
  const { gsap, ScrollTrigger } = context
  const element = root.value

  const scene = gsap.context(() => {
    gsap.from('[data-acquire-row]', {
      opacity: 0,
      y: 24,
      stagger: 0.12,
      duration: 0.6,
      scrollTrigger: {
        trigger: element,
        start: 'top 78%',
        onEnter: () => {
          hasEntered.value = true
          countTo(current.value.priceEur)
        },
      },
    })
  }, element)

  ScrollTrigger.refresh()
  kill = () => scene.revert()
})

onBeforeUnmount(() => kill?.())
</script>

<template>
  <SectionShell id="acquire" title-key="sections.acquire.title">
    <div
      ref="root"
      class="grid gap-10 sm:grid-cols-[minmax(0,22rem)_1fr] sm:items-center"
    >
      <div data-acquire-row class="panel overflow-hidden rounded-panel">
        <NuxtImg
          src="/acquire.webp"
          width="1000"
          height="1250"
          loading="lazy"
          class="aspect-[4/5] w-full object-cover"
          :alt="`${fragrance.edition} — ${fragrance.name}`"
        />
      </div>
      <div>
        <div data-acquire-row>
          <SizeSelect
            v-model="selected"
            :sizes="fragrance.sizes"
            :label="t('acquire.sizeLabel')"
          />
        </div>
        <div
          data-acquire-row
          class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
        >
          <PriceTag :price="shownPrice" />
          <button
            type="button"
            class="rounded-pill bg-accent px-6 py-3 text-sm text-ground disabled:opacity-50"
            :disabled="pending"
            @click="addToBag"
          >
            {{ t('acquire.add') }}
          </button>
        </div>
      </div>
    </div>
  </SectionShell>
</template>
