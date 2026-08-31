<script setup lang="ts">
import { SillageTrail, ToastStack } from '~/shared/ui'
import { SiteFooter, SiteHeader } from '~/widgets/site-chrome'
</script>

<template>
  <div class="relative min-h-dvh bg-ground text-ink">
    <ClientOnly>
      <SillageTrail />
    </ClientOnly>
    <SiteHeader />
    <main class="relative z-10"><slot /></main>
    <SiteFooter />
    <ToastStack />
  </div>
</template>
