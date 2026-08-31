<script setup lang="ts">
import { ToastStack } from '~/shared/ui'
import { BackdropScenes } from '~/widgets/backdrop-scenes'
import { SiteFooter, SiteHeader } from '~/widgets/site-chrome'
</script>

<template>
  <div class="relative min-h-dvh bg-ground text-ink">
    <ClientOnly>
      <BackdropScenes />
    </ClientOnly>
    <SiteHeader />
    <main class="relative z-10"><slot /></main>
    <SiteFooter />
    <ToastStack />
  </div>
</template>
