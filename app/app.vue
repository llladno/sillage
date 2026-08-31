<script setup lang="ts">
import { useProductJsonld } from '~/shared/lib'

const localeHead = useLocaleHead()
const { t } = useI18n()

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: [
    ...(localeHead.value.meta ?? []),
    { name: 'description', content: t('meta.description') },
    { property: 'og:title', content: t('meta.title') },
    { property: 'og:description', content: t('meta.description') },
    { property: 'og:image', content: '/og/default.png' },
    { property: 'og:type', content: 'website' },
  ],
  title: t('meta.title'),
}))

useProductJsonld()
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
