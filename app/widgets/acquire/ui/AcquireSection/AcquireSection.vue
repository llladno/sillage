<script setup lang="ts">
import { computed, ref } from 'vue'
import { SectionShell } from '~/shared/ui'
import { getFragrance, PriceTag, SizeSelect } from '~/entities/fragrance'
import type { Fragrance, SizeId } from '~/entities/fragrance'
import type { Locale } from '~/shared/config/i18n'
import { useBag, useFakeSubmit, useToasts } from '~/shared/lib'

const { locale, t } = useI18n()
const fragrance = computed<Fragrance>(() => getFragrance(locale.value as Locale))
const selected = ref<SizeId>('ml50')
const current = computed(() => {
  const match = fragrance.value.sizes.find((size) => size.id === selected.value)
  if (!match) throw new Error(`unknown size: ${selected.value}`)
  return match
})

const bag = useBag()
const { pending, run } = useFakeSubmit()
const { push } = useToasts()

const addToBag = () =>
  run(() => {
    bag.add()
    push(t('acquire.added', { size: current.value.label }))
  })
</script>

<template>
  <SectionShell id="acquire" title-key="sections.acquire.title">
    <SizeSelect
      v-model="selected"
      :sizes="fragrance.sizes"
      :label="t('acquire.sizeLabel')"
    />
    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <PriceTag :price="current.priceEur" />
      <button
        type="button"
        class="rounded-pill bg-accent px-6 py-3 text-sm text-ground disabled:opacity-50"
        :disabled="pending"
        @click="addToBag"
      >
        {{ t('acquire.add') }}
      </button>
    </div>
  </SectionShell>
</template>
