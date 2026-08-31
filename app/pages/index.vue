<script setup lang="ts">
import { SectionShell } from '~/shared/ui'

const { t } = useI18n()
</script>

<template>
  <div>
    <section class="mx-auto max-w-3xl px-6 pt-24">
      <h1 class="font-display text-5xl uppercase tracking-[0.18em]">SILLAGE</h1>
      <p class="mt-6 font-display text-lg text-ink-dim">{{ t('hero.concept') }}</p>
    </section>
    <SectionShell id="composition" title-key="sections.composition.title">
      <p class="text-ink-dim">Placeholder — replaced in Task 10.</p>
    </SectionShell>
  </div>
</template>
