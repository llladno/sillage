import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    preset: 'static',
    prerender: { crawlLinks: true, routes: ['/'] },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://sillage.example',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Hanken+Grotesk:wght@400;500&display=swap',
        },
      ],
    },
  },

  eslint: { config: { stylistic: false } },
})
