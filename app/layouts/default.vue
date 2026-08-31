<script setup lang="ts">
import { ToastStack } from '~/shared/ui'
import { SiteFooter, SiteHeader } from '~/widgets/site-chrome'
</script>

<template>
  <div class="min-h-dvh bg-ground text-ink">
    <SiteHeader />
    <main><slot /></main>
    <SiteFooter />
    <ToastStack />
  </div>
</template>
