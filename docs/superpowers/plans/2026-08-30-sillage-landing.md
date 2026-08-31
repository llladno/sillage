# SILLAGE Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Nuxt 4 marketing site for the fictional fragrance house SILLAGE, centred on a scroll-scrubbed canvas hero that works today with a procedural placeholder and swaps to a real frame sequence with no code changes.

**Architecture:** Nuxt 4 SSG, light FSD (`app -> widgets -> entities -> shared`, downward imports only). The hero is a tall stage with a sticky inner layer; one GSAP ScrollTrigger writes a `progress` ref that drives a `<canvas>` painter and text beats. SSR always renders a static content-first fallback; the cinematic branch mounts client-side behind an `isMounted` gate. All commerce/newsletter behaviour is faked client-side.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript (strict), Tailwind v4 (CSS-first), GSAP + ScrollTrigger, Lenis, @nuxtjs/i18n v10, @nuxt/image, @vueuse/core, Playwright + @axe-core/playwright, Vitest (unit), ESLint (@nuxt/eslint flat) + Prettier + lefthook.

**Spec:** `docs/superpowers/specs/2026-08-30-sillage-landing-design.md`

## Global Constraints

- Node 24, pnpm 11. Package manager is pnpm only.
- TypeScript strict. If `typescript-eslint` breaks on TS 7, pin `typescript` to `5.9.3` via `pnpm-workspace.yaml` `overrides`.
- **Arrow functions only** — `func-style: expression`, never `function`.
- **Named constants** — every meaningful literal is `SCREAMING_SNAKE_CASE` in a `constants.ts`. Bare-allowed: `-1, 0, 1, 2` and array indices.
- **Readable names** — `id-length` min 3; no `p`, `e`, `el`, `ctx`, `idx`.
- **`~` imports only** — never `../` or `./`, in `.ts` or `.vue`, barrels included. `~` = `app/`.
- **Folder-per-component** — `ui/Name/{Name.vue, types.ts?, constants.ts?, index.ts}`. Slice-wide types -> `model/types.ts`; slice-wide constants -> `model/constants.ts`.
- No component auto-import — everything imported explicitly through a slice `index.ts`.
- Imports go downward only: `widgets` may import `entities`/`shared`; `entities` may import `shared`; `shared` imports nothing upward. ESLint `no-restricted-imports` enforces.
- **Prettier** — no semicolons, single quotes, trailing commas, print width 90.
- Tailwind: use generated theme utilities (`text-ink`, `bg-ground`, `border-line`, `text-accent`, `font-display`). Raw `var(--...)` only where no utility exists. No `tailwind.config.js`.
- Every user-facing string exists in **both** `i18n/locales/en.json` and `i18n/locales/fr.json`.
- Respect `prefers-reduced-motion` in every animation.
- Animation library: **GSAP only**.
- No data in query params; locale is in the path (`prefix_except_default`, default `en`).
- Images via `<NuxtImg>` with explicit `width`/`height`.
- Content is typed TS modules — no CMS, no `@nuxt/content`.
- Do **not** run `git commit` beyond the steps written in this plan; the repo owner commits their own work. Each task's final step commits exactly what that task produced.

### Fixed content (copy verbatim)

- House: **SILLAGE**. Product: **SILLAGE 01 — "Encre"**. Concept line (EN): *The smell of a letter you never sent.* Concept line (FR): *L'odeur d'une lettre jamais envoyée.*
- 50 ml · eau de parfum · hand-decanted.
- Notes EN — Top: `bergamot, pink pepper, cold-metal accord`; Heart: `iris, black tea, damask rose`; Base: `vetiver, ambrette, papyrus, incense`.
- Notes FR — Top: `bergamote, poivre rose, accord métal froid`; Heart: `iris, thé noir, rose de Damas`; Base: `vétiver, ambrette, papyrus, encens`.
- Sizes: `50 ml — €180`, `100 ml — €260`, `10 ml discovery — €35`.
- Theme tokens: ground `#0A0908`, ink `#F2EBE3`, ink-dim `#9A938A`, accent `#C8641E`, line `rgba(242,235,227,0.12)`.
- Fonts: display `Fraunces`, body `Hanken Grotesk` (Google Fonts `<link>`).

---

## File Structure

```
sillage/
  nuxt.config.ts            modules, i18n, head (fonts), site url, image
  app.config.ts             identity (SITE_NAME), socials, nothing secret
  eslint.config.mjs         @nuxt/eslint + arrow-only, id-length, no-magic-numbers, FSD direction
  .prettierrc.json          no semis, single quotes, trailing commas, width 90
  lefthook.yml              pre-commit: eslint --fix + prettier on staged
  playwright.config.ts      webServer: pnpm generate && pnpm preview
  vitest.config.ts          unit tests for shared/lib + pure helpers
  pnpm-workspace.yaml       allowBuilds for native deps; ts override if needed
  app/
    app.vue                 <NuxtLayout><NuxtPage/> + useLocaleHead + JSON-LD
    error.vue               minimal themed error page
    layouts/default.vue     <SiteHeader/> <main><slot/></main> <SiteFooter/> <ToastStack/>
    pages/index.vue         SSR plain stack of all sections; hero widget owns cinematic swap
    assets/css/main.css     @theme tokens, @utility (panel, hairline), base layer
    plugins/lenis.client.ts momentum scroll, skipped under reduced motion
    shared/
      config/  i18n.ts (LOCALES, Locale, DEFAULT_LOCALE)  site.ts (SITE_NAME, SITE_TAGLINE_KEY, NAV_SECTIONS)
      lib/     clamp.ts  ease.ts (beatOpacity)  use-reduced-motion.ts  use-scrub-frames.ts  use-fake-submit.ts  use-bag.ts  index.ts
      ui/      Wordmark/  Chip/  FieldText/  ToastStack/  SectionShell/  (each folder-per-component + index.ts)  index.ts (barrel)
    entities/
      fragrance/  model/types.ts (Fragrance, Note, Size)  model/data.ts (FRAGRANCE, getFragrance)
                  ui/NoteList/  ui/PriceTag/  ui/SizeSelect/  index.ts
    widgets/
      scrub-hero/  model/constants.ts  model/types.ts (HeroBeat)
                   ui/ScrubHero/  ui/ScrubCanvas/  ui/HeroBeats/  ui/HeroFallback/  index.ts
      composition/ model/constants.ts (TIERS)  ui/CompositionPyramid/  index.ts
      story/       ui/StorySection/  index.ts
      object/      ui/ObjectSection/  index.ts
      ritual/      model/constants.ts (RITUAL_STEPS keys)  ui/RitualSection/  index.ts
      acquire/     model/constants.ts (SIZES)  ui/AcquireSection/  index.ts
      newsletter/  model/constants.ts (EMAIL_RE)  ui/NewsletterSection/  index.ts
      site-chrome/ ui/SiteHeader/  ui/SiteFooter/  ui/LocaleSwitch/  index.ts
  i18n/locales/en.json  i18n/locales/fr.json
  public/  sequence/ (empty + README)  sequence-mobile/ (empty)  hero-poster.webp  object.webp  og/default.png  robots.txt (generated)
  scripts/gen-placeholder-assets.mjs
  tests/e2e/  hero.spec.ts  content.spec.ts  reduced-motion.spec.ts  acquire.spec.ts  newsletter.spec.ts  i18n.spec.ts  a11y.spec.ts
  tests/unit/  clamp.test.ts  ease.test.ts  scrub-frames.test.ts  email.test.ts  fragrance.test.ts
  README.md
```

---

## Task 1: Project scaffold + tooling

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `tsconfig.json` (extends `.nuxt`), `eslint.config.mjs`, `.prettierrc.json`, `lefthook.yml`, `pnpm-workspace.yaml`, `vitest.config.ts`, `playwright.config.ts`, `app/app.vue`, `app/pages/index.vue`, `app/assets/css/main.css`, `README.md`
- Create: `tests/e2e/smoke.spec.ts`, `tests/unit/clamp.test.ts`, `app/shared/lib/clamp.ts`, `app/shared/lib/index.ts`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `clamp(value: number, min: number, max: number): number` exported from `~/shared/lib`. Working `pnpm dev`, `pnpm generate`, `pnpm preview`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e`, `pnpm test:unit`.

- [ ] **Step 1: Scaffold Nuxt 4 and install deps**

```bash
cd /Users/grisha/Desktop/projects/sillage
pnpm dlx nuxi@latest init . --packageManager pnpm --gitInit false --force
pnpm add -D @nuxt/eslint eslint prettier eslint-config-prettier lefthook \
  @playwright/test @axe-core/playwright vitest @vue/test-utils happy-dom \
  vue-tsc
pnpm add @nuxtjs/i18n @nuxt/image @vueuse/nuxt @nuxtjs/sitemap @nuxtjs/robots \
  tailwindcss @tailwindcss/vite gsap lenis
pnpm exec playwright install chromium
```

- [ ] **Step 2: Write `package.json` scripts**

```jsonc
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "nuxt typecheck",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

- [ ] **Step 3: Write `nuxt.config.ts`**

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [require('@tailwindcss/vite')()] },
  nitro: { preset: 'static', prerender: { crawlLinks: true, routes: ['/'] } },
  site: { url: process.env.NUXT_PUBLIC_SITE_URL || 'https://sillage.example' },
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
```

Note: if `require` in `vite.plugins` errors under ESM, use a top `import tailwindcss from '@tailwindcss/vite'` and `plugins: [tailwindcss()]`.

- [ ] **Step 4: Write `eslint.config.mjs`**

```js
import withNuxt from './.nuxt/eslint.config.mjs'

const MAGIC_ALLOW = [-1, 0, 1, 2]

export default withNuxt({
  rules: {
    'func-style': ['error', 'expression'],
    'id-length': ['error', { min: 3, exceptions: ['to', 'as', 'id'] }],
    'no-magic-numbers': ['warn', { ignore: MAGIC_ALLOW, ignoreArrayIndexes: true }],
    'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
  },
})
```

- [ ] **Step 5: Write `.prettierrc.json`, `lefthook.yml`, `pnpm-workspace.yaml`**

```json
{ "semi": false, "singleQuote": true, "trailingComma": "all", "printWidth": 90 }
```

```yml
# lefthook.yml
pre-commit:
  commands:
    lint:
      glob: '*.{js,ts,vue,mjs}'
      run: pnpm eslint --fix {staged_files} && pnpm prettier --write {staged_files}
      stage_fixed: true
```

```yml
# pnpm-workspace.yaml
packages: []
onlyBuiltDependencies:
  - esbuild
  - lefthook
  - sharp
  - '@parcel/watcher'
```

- [ ] **Step 6: Write `app/assets/css/main.css` (tokens + base)**

```css
@import 'tailwindcss';

@theme {
  --color-ground: #0a0908;
  --color-ink: #f2ebe3;
  --color-ink-dim: #9a938a;
  --color-accent: #c8641e;
  --color-line: rgba(242, 235, 227, 0.12);
  --radius-panel: 14px;
  --radius-pill: 999px;
  --font-display: 'Fraunces', ui-serif, Georgia, serif;
  --font-sans: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html { color-scheme: dark; }
  body {
    background: var(--color-ground);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
}
```

- [ ] **Step 7: Write `app/app.vue`, `app/pages/index.vue`, `app/shared/lib/clamp.ts` + barrel**

```vue
<!-- app/app.vue -->
<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
```

```vue
<!-- app/pages/index.vue -->
<template>
  <main class="mx-auto max-w-3xl px-6 py-24">
    <h1 class="font-display text-5xl">SILLAGE</h1>
  </main>
</template>
```

```ts
// app/shared/lib/clamp.ts
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)
```

```ts
// app/shared/lib/index.ts
export { clamp } from '~/shared/lib/clamp'
```

- [ ] **Step 8: Write `vitest.config.ts` + failing unit test**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: { environment: 'happy-dom' },
  resolve: { alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) } },
})
```

```ts
// tests/unit/clamp.test.ts
import { describe, expect, it } from 'vitest'
import { clamp } from '~/shared/lib/clamp'

describe('clamp', () => {
  it('returns the value when inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it('clamps below min and above max', () => {
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(42, 0, 10)).toBe(10)
  })
})
```

- [ ] **Step 9: Run unit test**

Run: `pnpm test:unit`
Expected: PASS (2 tests).

- [ ] **Step 10: Write `playwright.config.ts` + smoke e2e**

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

const PORT = 3000

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  webServer: {
    command: 'pnpm generate && pnpm preview',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: `http://localhost:${PORT}` },
})
```

```ts
// tests/e2e/smoke.spec.ts
import { expect, test } from '@playwright/test'

test('homepage renders the wordmark', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'SILLAGE' })).toBeVisible()
})
```

- [ ] **Step 11: Run lint, typecheck, e2e**

Run: `pnpm lint && pnpm typecheck && pnpm test:e2e`
Expected: all PASS.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Nuxt 4 project + tooling"
```

---

## Task 2: Theme utilities, layout shell, Wordmark, SectionShell

**Files:**
- Modify: `app/assets/css/main.css` (add `@utility hairline`, `@utility panel`)
- Create: `app/layouts/default.vue`, `app/shared/config/site.ts`, `app/shared/ui/Wordmark/{Wordmark.vue,index.ts}`, `app/shared/ui/SectionShell/{SectionShell.vue,types.ts,index.ts}`, `app/shared/ui/index.ts`
- Modify: `app/pages/index.vue` (use SectionShell), `app/app.vue` (wrap in `<NuxtLayout>`)
- Create: `tests/e2e/layout.spec.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces:
  - `~/shared/config/site.ts`: `SITE_NAME = 'SILLAGE'`, `NAV_SECTIONS: readonly { id: string; labelKey: string }[]`.
  - `<Wordmark>` — renders `SILLAGE` in `font-display`, prop `as?: 'h1' | 'span'` (default `span`).
  - `<SectionShell>` — props `{ id: string; titleKey: string; headingLevel?: 2 | 3 }`; renders `<section :id :aria-labelledby>` with a visually-styled `<h2>` from `t(titleKey)` and a `<slot/>`.

- [ ] **Step 1: Write failing e2e**

```ts
// tests/e2e/layout.spec.ts
import { expect, test } from '@playwright/test'

test('page has header, main landmark, footer', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('header')).toBeVisible()
  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('footer')).toBeVisible()
})

test('every section is a labelled landmark', async ({ page }) => {
  await page.goto('/')
  const sections = page.locator('main section[aria-labelledby]')
  expect(await sections.count()).toBeGreaterThanOrEqual(1)
})
```

- [ ] **Step 2: Run e2e to verify it fails**

Run: `pnpm test:e2e tests/e2e/layout.spec.ts`
Expected: FAIL (no `<header>`/`<footer>`).

- [ ] **Step 3: Add utilities to `main.css`**

```css
@utility hairline {
  border-color: var(--color-line);
}
@utility panel {
  background: color-mix(in srgb, var(--color-ink) 4%, transparent);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-panel);
}
```

- [ ] **Step 4: Write `site.ts`, `Wordmark`, `SectionShell`, barrels**

```ts
// app/shared/config/site.ts
export const SITE_NAME = 'SILLAGE'

export const NAV_SECTIONS = [
  { id: 'composition', labelKey: 'nav.composition' },
  { id: 'story', labelKey: 'nav.story' },
  { id: 'object', labelKey: 'nav.object' },
  { id: 'ritual', labelKey: 'nav.ritual' },
  { id: 'acquire', labelKey: 'nav.acquire' },
] as const
```

```vue
<!-- app/shared/ui/Wordmark/Wordmark.vue -->
<script setup lang="ts">
import { SITE_NAME } from '~/shared/config/site'

withDefaults(defineProps<{ as?: 'h1' | 'span' }>(), { as: 'span' })
</script>

<template>
  <component :is="as" class="font-display tracking-[0.18em] uppercase">
    {{ SITE_NAME }}
  </component>
</template>
```

```vue
<!-- app/shared/ui/SectionShell/SectionShell.vue -->
<script setup lang="ts">
import type { SectionShellProps } from '~/shared/ui/SectionShell/types'

const props = withDefaults(defineProps<SectionShellProps>(), { headingLevel: 2 })
const { t } = useI18n()
const headingId = `${props.id}-title`
</script>

<template>
  <section :id="id" :aria-labelledby="headingId" class="mx-auto max-w-3xl px-6 py-24">
    <component
      :is="`h${headingLevel}`"
      :id="headingId"
      class="font-display text-3xl text-ink"
    >
      {{ t(titleKey) }}
    </component>
    <div class="mt-8"><slot /></div>
  </section>
</template>
```

```ts
// app/shared/ui/SectionShell/types.ts
export type SectionShellProps = {
  id: string
  titleKey: string
  headingLevel?: 2 | 3
}
```

Barrels: `Wordmark/index.ts`, `SectionShell/index.ts`, and `app/shared/ui/index.ts` re-exporting both. (i18n `useI18n` is auto-provided by `@nuxtjs/i18n`; if `t` keys are missing the component still renders the key — locales land in Task 3.)

- [ ] **Step 5: Write `app/layouts/default.vue` + update `app.vue` + `index.vue`**

```vue
<!-- app/layouts/default.vue -->
<template>
  <div class="min-h-dvh bg-ground text-ink">
    <header class="sticky top-0 z-40 flex items-center justify-between px-6 py-4">
      <Wordmark />
    </header>
    <main><slot /></main>
    <footer class="hairline mt-24 border-t px-6 py-12 text-sm text-ink-dim">
      <p>SILLAGE — a fictional project. No products are for sale.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Wordmark } from '~/shared/ui'
</script>
```

```vue
<!-- app/app.vue -->
<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

```vue
<!-- app/pages/index.vue -->
<template>
  <SectionShell id="composition" title-key="sections.composition.title">
    <p class="text-ink-dim">Placeholder.</p>
  </SectionShell>
</template>

<script setup lang="ts">
import { SectionShell } from '~/shared/ui'
</script>
```

- [ ] **Step 6: Run e2e + lint + typecheck**

Run: `pnpm test:e2e tests/e2e/layout.spec.ts && pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: theme utilities, layout shell, Wordmark + SectionShell"
```

---

## Task 3: i18n (en/fr) + LocaleSwitch + hreflang

**Files:**
- Modify: `nuxt.config.ts` (i18n block)
- Create: `app/shared/config/i18n.ts`, `i18n/locales/en.json`, `i18n/locales/fr.json`, `app/widgets/site-chrome/ui/LocaleSwitch/{LocaleSwitch.vue,index.ts}`, `app/widgets/site-chrome/index.ts`
- Modify: `app/app.vue` (add `useLocaleHead`), `app/layouts/default.vue` (mount `<LocaleSwitch>`)
- Create: `tests/e2e/i18n.spec.ts`

**Interfaces:**
- Consumes: `<Wordmark>` from `~/shared/ui`.
- Produces:
  - `~/shared/config/i18n.ts`: `LOCALES = ['en', 'fr'] as const`, `type Locale`, `DEFAULT_LOCALE = 'en'`.
  - `<LocaleSwitch>` — two links (`en` / `fr`) via `useSwitchLocalePath()`, current one `aria-current="true"`.
  - i18n keys used across the app (namespaces: `nav.*`, `sections.*.title`, `hero.*`, `composition.*`, `story.*`, `object.*`, `ritual.*`, `acquire.*`, `newsletter.*`, `meta.*`, `footer.*`).

- [ ] **Step 1: Write failing e2e**

```ts
// tests/e2e/i18n.spec.ts
import { expect, test } from '@playwright/test'

test('FR route renders French concept line', async ({ page }) => {
  await page.goto('/fr/')
  await expect(page.getByText('L’odeur d’une lettre jamais envoyée')).toBeVisible()
})

test('both routes expose hreflang alternates', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveCount(1)
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1)
})
```

- [ ] **Step 2: Run e2e to verify it fails**

Run: `pnpm test:e2e tests/e2e/i18n.spec.ts`
Expected: FAIL (route `/fr/` 404, no alternates).

- [ ] **Step 3: Configure i18n in `nuxt.config.ts`**

```ts
i18n: {
  strategy: 'prefix_except_default',
  defaultLocale: 'en',
  locales: [
    { code: 'en', language: 'en-US', file: 'en.json' },
    { code: 'fr', language: 'fr-FR', file: 'fr.json' },
  ],
  langDir: 'locales',
  baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://sillage.example',
},
```

- [ ] **Step 4: Write `i18n/locales/en.json` and `fr.json`**

Full key set (both files, FR translated):

```jsonc
// en.json
{
  "nav": { "composition": "Composition", "story": "Story", "object": "The Object", "ritual": "Ritual", "acquire": "Acquire" },
  "sections": {
    "composition": { "title": "Composition" },
    "story": { "title": "Story" },
    "object": { "title": "The Object" },
    "ritual": { "title": "Ritual" },
    "acquire": { "title": "Acquire" },
    "newsletter": { "title": "Stay on the trail" }
  },
  "hero": {
    "concept": "The smell of a letter you never sent.",
    "beats": {
      "name": "SILLAGE",
      "tagline": "The trail a scent leaves behind.",
      "edition": "01 — Encre",
      "notesLead": "Iris. Black tea. Wet ink.",
      "cta": "Acquire the edition"
    }
  },
  "composition": { "top": "Top", "heart": "Heart", "base": "Base" },
  "story": {
    "body": "Encre is built around the cold-metal smell of a fountain pen and the paper it never touched. Bergamot and pink pepper open sharp; iris and black tea settle into something unsaid; vetiver, papyrus and incense are the drawer you closed.",
    "perfumer": "Composed by an independent nose in Grasse, 2026."
  },
  "object": {
    "body": "A heavy rectangular flacon in clear glass, 50 ml, matte-black cap, debossed mark. Filled and sealed by hand in small batches."
  },
  "ritual": {
    "step1": "Two sprays on warm skin — the inside of the wrist, the base of the throat.",
    "step2": "Do not rub. Let the top notes burn off on their own.",
    "step3": "Wear it in the evening, or when you want the room to ask."
  },
  "acquire": {
    "sizeLabel": "Size",
    "add": "Add to bag",
    "added": "Added — SILLAGE 01, {size}",
    "bag": "Bag ({count})"
  },
  "newsletter": {
    "body": "One letter a season. No more than that.",
    "placeholder": "you@example.com",
    "submit": "Join",
    "invalid": "Enter a valid email address.",
    "success": "You’re on the list."
  },
  "meta": {
    "title": "SILLAGE 01 — Encre",
    "description": "The smell of a letter you never sent. An independent eau de parfum, hand-decanted in 50 ml."
  },
  "footer": { "disclaimer": "SILLAGE — a fictional project. No products are for sale." }
}
```

```jsonc
// fr.json  (same shape)
{
  "nav": { "composition": "Composition", "story": "Histoire", "object": "L’Objet", "ritual": "Rituel", "acquire": "Acquérir" },
  "sections": {
    "composition": { "title": "Composition" },
    "story": { "title": "Histoire" },
    "object": { "title": "L’Objet" },
    "ritual": { "title": "Rituel" },
    "acquire": { "title": "Acquérir" },
    "newsletter": { "title": "Garder le sillage" }
  },
  "hero": {
    "concept": "L’odeur d’une lettre jamais envoyée.",
    "beats": {
      "name": "SILLAGE",
      "tagline": "La traînée qu’un parfum laisse derrière lui.",
      "edition": "01 — Encre",
      "notesLead": "Iris. Thé noir. Encre humide.",
      "cta": "Acquérir l’édition"
    }
  },
  "composition": { "top": "Tête", "heart": "Cœur", "base": "Fond" },
  "story": {
    "body": "Encre est construit autour de l’odeur de métal froid d’un stylo-plume et du papier qu’il n’a jamais touché. Bergamote et poivre rose ouvrent, tranchants ; iris et thé noir s’installent dans le non-dit ; vétiver, papyrus et encens sont le tiroir que l’on a refermé.",
    "perfumer": "Composé par un nez indépendant à Grasse, 2026."
  },
  "object": {
    "body": "Un flacon rectangulaire lourd en verre transparent, 50 ml, bouchon noir mat, marque en creux. Rempli et scellé à la main en petites séries."
  },
  "ritual": {
    "step1": "Deux vaporisations sur peau chaude — l’intérieur du poignet, la base de la gorge.",
    "step2": "Ne pas frotter. Laisser les notes de tête s’éteindre seules.",
    "step3": "À porter le soir, ou quand on veut que la pièce pose la question."
  },
  "acquire": {
    "sizeLabel": "Contenance",
    "add": "Ajouter au panier",
    "added": "Ajouté — SILLAGE 01, {size}",
    "bag": "Panier ({count})"
  },
  "newsletter": {
    "body": "Une lettre par saison. Pas davantage.",
    "placeholder": "vous@exemple.com",
    "submit": "Rejoindre",
    "invalid": "Saisissez une adresse e-mail valide.",
    "success": "Vous êtes sur la liste."
  },
  "meta": {
    "title": "SILLAGE 01 — Encre",
    "description": "L’odeur d’une lettre jamais envoyée. Un eau de parfum indépendant, décanté à la main en 50 ml."
  },
  "footer": { "disclaimer": "SILLAGE — un projet fictif. Aucun produit n’est à vendre." }
}
```

- [ ] **Step 5: Write `i18n.ts`, `LocaleSwitch`, wire `useLocaleHead`**

```ts
// app/shared/config/i18n.ts
export const LOCALES = ['en', 'fr'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
```

```vue
<!-- app/widgets/site-chrome/ui/LocaleSwitch/LocaleSwitch.vue -->
<script setup lang="ts">
import { LOCALES } from '~/shared/config/i18n'

const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()
</script>

<template>
  <nav class="flex gap-2 text-sm uppercase" aria-label="Language">
    <NuxtLink
      v-for="code in LOCALES"
      :key="code"
      :to="switchLocalePath(code)"
      :aria-current="code === locale ? 'true' : undefined"
      :class="code === locale ? 'text-ink' : 'text-ink-dim'"
    >
      {{ code }}
    </NuxtLink>
  </nav>
</template>
```

```vue
<!-- app/app.vue -->
<script setup lang="ts">
const head = useLocaleHead({ addSeoAttributes: true })
const { t } = useI18n()
useHead({
  ...head.value,
  title: () => t('meta.title'),
  meta: [{ name: 'description', content: () => t('meta.description') }],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

Mount `<LocaleSwitch>` in `default.vue` header next to `<Wordmark>`. Update `index.vue` composition section to also render `{{ t('hero.concept') }}` somewhere so the FR test has a target (temporary — moves into hero in Task 7).

- [ ] **Step 6: Run e2e + lint + typecheck**

Run: `pnpm test:e2e tests/e2e/i18n.spec.ts && pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: i18n en/fr, LocaleSwitch, hreflang"
```

---

## Task 4: `fragrance` entity — types, data, getter

**Files:**
- Create: `app/entities/fragrance/model/types.ts`, `app/entities/fragrance/model/data.ts`, `app/entities/fragrance/index.ts`
- Create: `tests/unit/fragrance.test.ts`

**Interfaces:**
- Consumes: `Locale` from `~/shared/config/i18n`.
- Produces (exported from `~/entities/fragrance`):
  - `type NoteTier = 'top' | 'heart' | 'base'`
  - `type Size = { id: 'ml50' | 'ml100' | 'ml10'; label: string; priceEur: number }`
  - `type Fragrance = { edition: string; name: string; concept: string; notes: Record<NoteTier, string[]>; sizes: Size[] }`
  - `getFragrance(locale: Locale): Fragrance`

- [ ] **Step 1: Write failing unit test**

```ts
// tests/unit/fragrance.test.ts
import { describe, expect, it } from 'vitest'
import { getFragrance } from '~/entities/fragrance'

describe('getFragrance', () => {
  it('returns 3 tiers with the fixed EN notes', () => {
    const fragrance = getFragrance('en')
    expect(fragrance.notes.top).toEqual(['bergamot', 'pink pepper', 'cold-metal accord'])
    expect(fragrance.notes.heart).toEqual(['iris', 'black tea', 'damask rose'])
    expect(fragrance.notes.base).toEqual(['vetiver', 'ambrette', 'papyrus', 'incense'])
  })
  it('returns FR notes for fr', () => {
    expect(getFragrance('fr').notes.top).toEqual([
      'bergamote', 'poivre rose', 'accord métal froid',
    ])
  })
  it('offers three sizes with correct prices', () => {
    const sizes = getFragrance('en').sizes
    expect(sizes.map((size) => size.priceEur)).toEqual([180, 260, 35])
  })
})
```

- [ ] **Step 2: Run unit test to verify it fails**

Run: `pnpm test:unit tests/unit/fragrance.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Write `types.ts` + `data.ts` + barrel**

```ts
// app/entities/fragrance/model/types.ts
export type NoteTier = 'top' | 'heart' | 'base'

export type SizeId = 'ml50' | 'ml100' | 'ml10'

export type Size = { id: SizeId; label: string; priceEur: number }

export type Fragrance = {
  edition: string
  name: string
  concept: string
  notes: Record<NoteTier, string[]>
  sizes: Size[]
}
```

```ts
// app/entities/fragrance/model/data.ts
import type { Fragrance } from '~/entities/fragrance/model/types'
import type { Locale } from '~/shared/config/i18n'

const NOTES: Record<Locale, Fragrance['notes']> = {
  en: {
    top: ['bergamot', 'pink pepper', 'cold-metal accord'],
    heart: ['iris', 'black tea', 'damask rose'],
    base: ['vetiver', 'ambrette', 'papyrus', 'incense'],
  },
  fr: {
    top: ['bergamote', 'poivre rose', 'accord métal froid'],
    heart: ['iris', 'thé noir', 'rose de Damas'],
    base: ['vétiver', 'ambrette', 'papyrus', 'encens'],
  },
}

const CONCEPT: Record<Locale, string> = {
  en: 'The smell of a letter you never sent.',
  fr: 'L’odeur d’une lettre jamais envoyée.',
}

const SIZES: Record<Locale, Fragrance['sizes']> = {
  en: [
    { id: 'ml50', label: '50 ml', priceEur: 180 },
    { id: 'ml100', label: '100 ml', priceEur: 260 },
    { id: 'ml10', label: '10 ml discovery', priceEur: 35 },
  ],
  fr: [
    { id: 'ml50', label: '50 ml', priceEur: 180 },
    { id: 'ml100', label: '100 ml', priceEur: 260 },
    { id: 'ml10', label: '10 ml découverte', priceEur: 35 },
  ],
}

export const getFragrance = (locale: Locale): Fragrance => ({
  edition: 'SILLAGE 01',
  name: 'Encre',
  concept: CONCEPT[locale],
  notes: NOTES[locale],
  sizes: SIZES[locale],
})
```

```ts
// app/entities/fragrance/index.ts
export type { Fragrance, NoteTier, Size, SizeId } from '~/entities/fragrance/model/types'
export { getFragrance } from '~/entities/fragrance/model/data'
```

- [ ] **Step 4: Run unit test to verify it passes**

Run: `pnpm test:unit tests/unit/fragrance.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: fragrance entity (types, data, getFragrance)"
```

---

## Task 5: shared/lib helpers — ease, use-reduced-motion, use-fake-submit, use-bag

**Files:**
- Create: `app/shared/lib/ease.ts`, `app/shared/lib/use-reduced-motion.ts`, `app/shared/lib/use-fake-submit.ts`, `app/shared/lib/use-bag.ts`
- Modify: `app/shared/lib/index.ts`
- Create: `tests/unit/ease.test.ts`

**Interfaces:**
- Consumes: `clamp` from `~/shared/lib`.
- Produces (from `~/shared/lib`):
  - `beatOpacity(progress: number, from: number, to: number, fade?: number): number` — 0 outside `[from,to]`, ramps to 1 over `fade` (default `0.06`) at each edge.
  - `useReducedMotion(): Ref<boolean>` — SSR-safe (`false` on server), tracks `matchMedia('(prefers-reduced-motion: reduce)')` on client.
  - `useFakeSubmit(): { pending: Ref<boolean>; run: (onDone: () => void) => void }` — sets `pending` for `FAKE_SUBMIT_MS` (500) then calls `onDone`.
  - `useBag(): { count: Ref<number>; add: () => void }` — backed by `useState('bag', () => 0)`.

- [ ] **Step 1: Write failing unit test**

```ts
// tests/unit/ease.test.ts
import { describe, expect, it } from 'vitest'
import { beatOpacity } from '~/shared/lib/ease'

describe('beatOpacity', () => {
  it('is 0 outside the window', () => {
    expect(beatOpacity(0.1, 0.3, 0.6)).toBe(0)
    expect(beatOpacity(0.9, 0.3, 0.6)).toBe(0)
  })
  it('is 1 in the plateau', () => {
    expect(beatOpacity(0.45, 0.3, 0.6, 0.05)).toBe(1)
  })
  it('ramps between 0 and 1 at the leading edge', () => {
    const value = beatOpacity(0.32, 0.3, 0.6, 0.05)
    expect(value).toBeGreaterThan(0)
    expect(value).toBeLessThan(1)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:unit tests/unit/ease.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement the four helpers**

```ts
// app/shared/lib/ease.ts
import { clamp } from '~/shared/lib/clamp'

const DEFAULT_FADE = 0.06

export const beatOpacity = (
  progress: number,
  from: number,
  to: number,
  fade: number = DEFAULT_FADE,
): number => {
  if (progress <= from || progress >= to) return 0
  const rampIn = clamp((progress - from) / fade, 0, 1)
  const rampOut = clamp((to - progress) / fade, 0, 1)
  return Math.min(rampIn, rampOut)
}
```

```ts
// app/shared/lib/use-reduced-motion.ts
import { onBeforeUnmount, ref } from 'vue'

export const useReducedMotion = () => {
  const reduced = ref(false)
  if (import.meta.client) {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = query.matches
    const onChange = (event: MediaQueryListEvent) => {
      reduced.value = event.matches
    }
    query.addEventListener('change', onChange)
    onBeforeUnmount(() => query.removeEventListener('change', onChange))
  }
  return reduced
}
```

```ts
// app/shared/lib/use-fake-submit.ts
import { ref } from 'vue'

const FAKE_SUBMIT_MS = 500

export const useFakeSubmit = () => {
  const pending = ref(false)
  const run = (onDone: () => void) => {
    if (pending.value) return
    pending.value = true
    window.setTimeout(() => {
      pending.value = false
      onDone()
    }, FAKE_SUBMIT_MS)
  }
  return { pending, run }
}
```

```ts
// app/shared/lib/use-bag.ts
export const useBag = () => {
  const count = useState('bag', () => 0)
  const add = () => {
    count.value += 1
  }
  return { count, add }
}
```

Update `app/shared/lib/index.ts` to re-export all four plus `clamp`.

- [ ] **Step 4: Run unit test to verify it passes**

Run: `pnpm test:unit tests/unit/ease.test.ts`
Expected: PASS.

- [ ] **Step 5: Run lint + typecheck**

Run: `pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: shared lib helpers (ease, reduced-motion, fake-submit, bag)"
```

---

## Task 6: `useScrubFrames` composable

**Files:**
- Create: `app/shared/lib/use-scrub-frames.ts`
- Modify: `app/shared/lib/index.ts`
- Create: `tests/unit/scrub-frames.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (from `~/shared/lib`):
  - `frameUrl(prefix: string, index: number, ext: string): string` — 1-based, zero-padded to 4 (`frameUrl('/sequence/frame-', 7, 'webp') === '/sequence/frame-0007.webp'`).
  - `useScrubFrames(options: { prefix: string; count: number; ext: string; enabled: boolean }): { images: Ref<HTMLImageElement[]>; loaded: Ref<boolean> }` — when `enabled` is `false` (placeholder mode) returns `images: []`, `loaded: false` and loads nothing. When `true` and on client, preloads all frames, flips `loaded` once `>= LOAD_READY_RATIO` (0.85) resolve.

- [ ] **Step 1: Write failing unit test**

```ts
// tests/unit/scrub-frames.test.ts
import { describe, expect, it } from 'vitest'
import { frameUrl } from '~/shared/lib/use-scrub-frames'

describe('frameUrl', () => {
  it('zero-pads to four digits, 1-based', () => {
    expect(frameUrl('/sequence/frame-', 1, 'webp')).toBe('/sequence/frame-0001.webp')
    expect(frameUrl('/sequence/frame-', 120, 'webp')).toBe('/sequence/frame-0120.webp')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:unit tests/unit/scrub-frames.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `use-scrub-frames.ts`**

```ts
import { ref } from 'vue'

const PAD_WIDTH = 4
const LOAD_READY_RATIO = 0.85

export const frameUrl = (prefix: string, index: number, ext: string): string =>
  `${prefix}${String(index).padStart(PAD_WIDTH, '0')}.${ext}`

type ScrubFramesOptions = {
  prefix: string
  count: number
  ext: string
  enabled: boolean
}

export const useScrubFrames = (options: ScrubFramesOptions) => {
  const images = ref<HTMLImageElement[]>([])
  const loaded = ref(false)

  if (options.enabled && import.meta.client) {
    let settled = 0
    const readyThreshold = Math.ceil(options.count * LOAD_READY_RATIO)
    const bucket: HTMLImageElement[] = []
    for (let index = 1; index <= options.count; index += 1) {
      const image = new Image()
      const onSettle = () => {
        settled += 1
        if (settled >= readyThreshold && !loaded.value) {
          images.value = bucket
          loaded.value = true
        }
      }
      image.addEventListener('load', onSettle, { once: true })
      image.addEventListener('error', onSettle, { once: true })
      image.src = frameUrl(options.prefix, index, options.ext)
      bucket.push(image)
    }
  }

  return { images, loaded }
}
```

Re-export `frameUrl` and `useScrubFrames` from `~/shared/lib/index.ts`.

- [ ] **Step 4: Run unit test to verify it passes**

Run: `pnpm test:unit tests/unit/scrub-frames.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: useScrubFrames composable + frameUrl"
```

---

## Task 7: ScrubCanvas + procedural placeholder painter

**Files:**
- Create: `app/widgets/scrub-hero/model/constants.ts`, `app/widgets/scrub-hero/model/types.ts`, `app/widgets/scrub-hero/ui/ScrubCanvas/{ScrubCanvas.vue,index.ts}`, `app/widgets/scrub-hero/ui/ScrubCanvas/paint.ts`
- Create: `tests/unit/paint.test.ts`

**Interfaces:**
- Consumes: `frameUrl` (already), `clamp` from `~/shared/lib`.
- Produces:
  - `~/widgets/scrub-hero/model/constants.ts`: `FRAME_COUNT = 120`, `FRAME_PATH_PREFIX = '/sequence/frame-'`, `FRAME_PATH_EXT = 'webp'`, `STAGE_SCROLL_VH = 320`, `USE_PLACEHOLDER = true`, `MOBILE_MAX_WIDTH = 768`, `HERO_BEATS: HeroBeat[]`.
  - `~/widgets/scrub-hero/model/types.ts`: `type HeroBeat = { id: string; from: number; to: number; key: string }`.
  - `paint.ts`: `frameIndexFor(progress: number, count: number): number`; `paintPlaceholder(context: CanvasRenderingContext2D, progress: number, width: number, height: number): void`; `paintFrame(context, image, width, height): void` (cover fit).
  - `<ScrubCanvas :progress :images>` — renders a `<canvas>` with `data-frame` attribute (for e2e), repaints on `progress` change via `requestAnimationFrame`.

- [ ] **Step 1: Write failing unit test**

```ts
// tests/unit/paint.test.ts
import { describe, expect, it } from 'vitest'
import { frameIndexFor } from '~/widgets/scrub-hero/ui/ScrubCanvas/paint'

describe('frameIndexFor', () => {
  it('maps progress 0..1 to frame 0..count-1', () => {
    expect(frameIndexFor(0, 120)).toBe(0)
    expect(frameIndexFor(1, 120)).toBe(119)
    expect(frameIndexFor(0.5, 121)).toBe(60)
  })
  it('clamps out-of-range progress', () => {
    expect(frameIndexFor(-0.2, 120)).toBe(0)
    expect(frameIndexFor(1.5, 120)).toBe(119)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:unit tests/unit/paint.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write `constants.ts`, `types.ts`, `paint.ts`**

```ts
// app/widgets/scrub-hero/model/types.ts
export type HeroBeat = { id: string; from: number; to: number; key: string }
```

```ts
// app/widgets/scrub-hero/model/constants.ts
import type { HeroBeat } from '~/widgets/scrub-hero/model/types'

export const FRAME_COUNT = 120
export const FRAME_PATH_PREFIX = '/sequence/frame-'
export const FRAME_PATH_EXT = 'webp'
export const STAGE_SCROLL_VH = 320
export const USE_PLACEHOLDER = true
export const MOBILE_MAX_WIDTH = 768

export const HERO_BEATS: HeroBeat[] = [
  { id: 'name', from: 0.02, to: 0.2, key: 'hero.beats.name' },
  { id: 'tagline', from: 0.2, to: 0.42, key: 'hero.beats.tagline' },
  { id: 'edition', from: 0.44, to: 0.62, key: 'hero.beats.edition' },
  { id: 'notesLead', from: 0.64, to: 0.84, key: 'hero.beats.notesLead' },
  { id: 'cta', from: 0.86, to: 1, key: 'hero.beats.cta' },
]
```

```ts
// app/widgets/scrub-hero/ui/ScrubCanvas/paint.ts
import { clamp } from '~/shared/lib'

const CORE_MIN_RADIUS = 0.04
const CORE_MAX_RADIUS = 0.32
const BOTTLE_WIDTH_RATIO = 0.16
const BOTTLE_HEIGHT_RATIO = 0.42

export const frameIndexFor = (progress: number, count: number): number =>
  Math.round(clamp(progress, 0, 1) * (count - 1))

export const paintFrame = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
): void => {
  const scale = Math.max(width / image.width, height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  context.clearRect(0, 0, width, height)
  context.drawImage(
    image,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  )
}

export const paintPlaceholder = (
  context: CanvasRenderingContext2D,
  progress: number,
  width: number,
  height: number,
): void => {
  const eased = clamp(progress, 0, 1)
  context.fillStyle = '#0a0908'
  context.fillRect(0, 0, width, height)

  const centerX = width / 2
  const centerY = height / 2
  const coreRadius =
    (CORE_MIN_RADIUS + (CORE_MAX_RADIUS - CORE_MIN_RADIUS) * eased) * Math.min(width, height)
  const glow = context.createRadialGradient(
    centerX, centerY, 0, centerX, centerY, coreRadius,
  )
  glow.addColorStop(0, 'rgba(200,100,30,0.9)')
  glow.addColorStop(1, 'rgba(200,100,30,0)')

  context.save()
  context.translate(centerX, centerY)
  context.rotate(eased * Math.PI * 1.4)
  const bottleWidth = width * BOTTLE_WIDTH_RATIO
  const bottleHeight = height * BOTTLE_HEIGHT_RATIO
  context.fillStyle = 'rgba(242,235,227,0.08)'
  context.strokeStyle = 'rgba(242,235,227,0.35)'
  context.lineWidth = 2
  context.beginPath()
  context.roundRect(-bottleWidth / 2, -bottleHeight / 2, bottleWidth, bottleHeight, 12)
  context.fill()
  context.stroke()
  context.restore()

  context.fillStyle = glow
  context.beginPath()
  context.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
  context.fill()
}
```

- [ ] **Step 4: Run unit test to verify it passes**

Run: `pnpm test:unit tests/unit/paint.test.ts`
Expected: PASS.

- [ ] **Step 5: Write `<ScrubCanvas>`**

```vue
<!-- app/widgets/scrub-hero/ui/ScrubCanvas/ScrubCanvas.vue -->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { FRAME_COUNT } from '~/widgets/scrub-hero/model/constants'
import {
  frameIndexFor,
  paintFrame,
  paintPlaceholder,
} from '~/widgets/scrub-hero/ui/ScrubCanvas/paint'

const props = defineProps<{ progress: number; images: HTMLImageElement[] }>()

const canvas = ref<HTMLCanvasElement | null>(null)
const currentFrame = ref(0)

const render = () => {
  const element = canvas.value
  if (!element) return
  const context = element.getContext('2d')
  if (!context) return
  const { clientWidth, clientHeight } = element
  const ratio = window.devicePixelRatio || 1
  if (element.width !== clientWidth * ratio) {
    element.width = clientWidth * ratio
    element.height = clientHeight * ratio
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)

  const frame = frameIndexFor(props.progress, FRAME_COUNT)
  currentFrame.value = frame
  const image = props.images[frame]
  if (image && image.complete && image.naturalWidth > 0) {
    paintFrame(context, image, clientWidth, clientHeight)
  } else {
    paintPlaceholder(context, props.progress, clientWidth, clientHeight)
  }
}

watch(() => props.progress, () => requestAnimationFrame(render))
onMounted(render)
</script>

<template>
  <canvas
    ref="canvas"
    :data-frame="currentFrame"
    class="h-full w-full"
    aria-hidden="true"
  />
</template>
```

- [ ] **Step 6: Run lint + typecheck**

Run: `pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: ScrubCanvas + procedural placeholder painter"
```

---

## Task 8: HeroBeats + HeroFallback

**Files:**
- Create: `app/widgets/scrub-hero/ui/HeroBeats/{HeroBeats.vue,index.ts}`, `app/widgets/scrub-hero/ui/HeroFallback/{HeroFallback.vue,index.ts}`

**Interfaces:**
- Consumes: `HERO_BEATS` from `~/widgets/scrub-hero/model/constants`, `beatOpacity` from `~/shared/lib`, `<Wordmark>` from `~/shared/ui`, `getFragrance` from `~/entities/fragrance`.
- Produces:
  - `<HeroBeats :progress>` — absolutely-positioned stack; each beat's wrapper gets `style="opacity; transform: translateY(...)"` from `beatOpacity`. The `cta` beat renders an `<a href="#acquire">`.
  - `<HeroFallback>` — static: `<NuxtImg src="/hero-poster.webp" width="1600" height="900">` behind a scrim, `<Wordmark as="h1">`, concept line, all beat texts in normal flow, `<a href="#acquire">` CTA.

- [ ] **Step 1: Write `<HeroBeats>`**

```vue
<script setup lang="ts">
import { HERO_BEATS } from '~/widgets/scrub-hero/model/constants'
import { beatOpacity } from '~/shared/lib'

const props = defineProps<{ progress: number }>()
const { t } = useI18n()

const TRANSLATE_PX = 12

const styleFor = (from: number, to: number) => {
  const opacity = beatOpacity(props.progress, from, to)
  return { opacity, transform: `translateY(${(1 - opacity) * TRANSLATE_PX}px)` }
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0 grid place-items-center text-center">
    <p
      v-for="beat in HERO_BEATS"
      :key="beat.id"
      class="absolute px-6 font-display text-2xl text-ink transition-none sm:text-4xl"
      :style="styleFor(beat.from, beat.to)"
    >
      <a
        v-if="beat.id === 'cta'"
        href="#acquire"
        class="pointer-events-auto border-b border-accent pb-1 text-accent"
      >{{ t(beat.key) }}</a>
      <template v-else>{{ t(beat.key) }}</template>
    </p>
  </div>
</template>
```

- [ ] **Step 2: Write `<HeroFallback>`**

```vue
<script setup lang="ts">
import { Wordmark } from '~/shared/ui'
import { HERO_BEATS } from '~/widgets/scrub-hero/model/constants'

const { t } = useI18n()
</script>

<template>
  <section class="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-24">
    <NuxtImg
      src="/hero-poster.webp"
      width="1600"
      height="900"
      class="absolute inset-0 h-full w-full object-cover opacity-60"
      alt=""
    />
    <div class="absolute inset-0 bg-ground/70" />
    <div class="relative text-center">
      <Wordmark as="h1" class="block text-4xl sm:text-6xl" />
      <p class="mt-6 font-display text-lg text-ink-dim">{{ t('hero.concept') }}</p>
      <ul class="mt-10 space-y-2 font-display text-xl text-ink">
        <li v-for="beat in HERO_BEATS" :key="beat.id">{{ t(beat.key) }}</li>
      </ul>
      <a href="#acquire" class="mt-8 inline-block border-b border-accent pb-1 text-accent">
        {{ t('hero.beats.cta') }}
      </a>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Run lint + typecheck**

Run: `pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: HeroBeats + HeroFallback"
```

---

## Task 9: ScrubHero wiring + ScrollTrigger + page integration

**Files:**
- Create: `app/widgets/scrub-hero/ui/ScrubHero/{ScrubHero.vue,index.ts}`, `app/widgets/scrub-hero/index.ts`
- Create: `app/plugins/lenis.client.ts`
- Modify: `app/pages/index.vue` (render `<ScrubHero>` first, remove temp concept line)
- Create: `scripts/gen-placeholder-assets.mjs`, `public/sequence/README.md`
- Modify: `package.json` (add `"assets:placeholder": "node scripts/gen-placeholder-assets.mjs"`), run it to produce `public/hero-poster.webp`, `public/object.webp`, `public/og/default.png`
- Create: `tests/e2e/hero.spec.ts`, `tests/e2e/reduced-motion.spec.ts`

**Interfaces:**
- Consumes: `<ScrubCanvas>`, `<HeroBeats>`, `<HeroFallback>`, constants, `useScrubFrames`, `useReducedMotion`.
- Produces: `<ScrubHero>` exported from `~/widgets/scrub-hero`. Renders `<HeroFallback>` during SSR and until mounted; after mount, if not reduced-motion and viewport `> MOBILE_MAX_WIDTH`, renders the cinematic stage (tall wrapper + sticky inner + `<ScrubCanvas>` + `<HeroBeats>`) and drives `progress` from a GSAP ScrollTrigger.

- [ ] **Step 1: Write failing e2e**

```ts
// tests/e2e/hero.spec.ts
import { expect, test } from '@playwright/test'

test('scrolling the hero stage advances the scrubbed frame', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  const canvas = page.locator('canvas[data-frame]')
  await expect(canvas).toBeVisible()
  const startFrame = Number(await canvas.getAttribute('data-frame'))
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5))
  await page.waitForTimeout(200)
  const midFrame = Number(await canvas.getAttribute('data-frame'))
  expect(midFrame).toBeGreaterThan(startFrame)
})

test('late beat text appears only after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  const cta = page.getByRole('link', { name: /Acquire the edition/i }).first()
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(cta).toHaveCSS('opacity', '0')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(200)
  await expect(cta).not.toHaveCSS('opacity', '0')
})
```

```ts
// tests/e2e/reduced-motion.spec.ts
import { expect, test } from '@playwright/test'

test.use({ reducedMotion: 'reduce' })

test('reduced motion renders the static fallback, no tall stage', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('canvas[data-frame]')).toHaveCount(0)
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
  expect(bodyHeight).toBeLessThan(3000)
  await expect(page.getByText('The trail a scent leaves behind.')).toBeVisible()
})
```

- [ ] **Step 2: Run e2e to verify it fails**

Run: `pnpm test:e2e tests/e2e/hero.spec.ts tests/e2e/reduced-motion.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the placeholder-assets script + run it**

```js
// scripts/gen-placeholder-assets.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { Buffer } from 'node:buffer'

// 1x1 black pixels are enough — real art is dropped in later.
const BLACK_WEBP = Buffer.from(
  'UklGRhIAAABXRUJQVlA4TAYAAAAvQWxvAGs=', 'base64',
)
const BLACK_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

mkdirSync('public/og', { recursive: true })
mkdirSync('public/sequence', { recursive: true })
writeFileSync('public/hero-poster.webp', BLACK_WEBP)
writeFileSync('public/object.webp', BLACK_WEBP)
writeFileSync('public/og/default.png', BLACK_PNG)
console.log('placeholder assets written')
```

```md
<!-- public/sequence/README.md -->
Drop the real frame sequence here as `frame-0001.webp` … `frame-0120.webp`
(1600px wide, WebP, < ~4 MB total), replace `../hero-poster.webp` with the
real first frame, then set `USE_PLACEHOLDER = false` in
`app/widgets/scrub-hero/model/constants.ts`. No other code changes.
```

Run: `node scripts/gen-placeholder-assets.mjs`

- [ ] **Step 4: Write `<ScrubHero>`**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useReducedMotion, useScrubFrames } from '~/shared/lib'
import { ScrubCanvas } from '~/widgets/scrub-hero/ui/ScrubCanvas'
import { HeroBeats } from '~/widgets/scrub-hero/ui/HeroBeats'
import { HeroFallback } from '~/widgets/scrub-hero/ui/HeroFallback'
import {
  FRAME_COUNT,
  FRAME_PATH_EXT,
  FRAME_PATH_PREFIX,
  MOBILE_MAX_WIDTH,
  STAGE_SCROLL_VH,
  USE_PLACEHOLDER,
} from '~/widgets/scrub-hero/model/constants'

const reduced = useReducedMotion()
const isMounted = ref(false)
const isWide = ref(false)
const progress = ref(0)
const stage = ref<HTMLElement | null>(null)

const { images } = useScrubFrames({
  prefix: FRAME_PATH_PREFIX,
  count: FRAME_COUNT,
  ext: FRAME_PATH_EXT,
  enabled: !USE_PLACEHOLDER,
})

const cinematic = () => isMounted.value && !reduced.value && isWide.value

let cleanup: (() => void) | undefined

onMounted(async () => {
  isWide.value = window.innerWidth > MOBILE_MAX_WIDTH
  isMounted.value = true
  if (!cinematic()) return
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  const trigger = ScrollTrigger.create({
    trigger: stage.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      progress.value = self.progress
    },
  })
  cleanup = () => trigger.kill()
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <HeroFallback v-if="!cinematic()" />
  <div
    v-else
    ref="stage"
    class="relative"
    :style="{ height: `${STAGE_SCROLL_VH}vh` }"
  >
    <div class="sticky top-0 h-dvh overflow-hidden">
      <ScrubCanvas :progress="progress" :images="images" />
      <HeroBeats :progress="progress" />
    </div>
  </div>
</template>
```

- [ ] **Step 5: Write `app/plugins/lenis.client.ts`**

```ts
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const lenis = new Lenis({ lerp: 0.12 })
  const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
})
```

- [ ] **Step 6: Integrate into `app/pages/index.vue`**

```vue
<script setup lang="ts">
import { ScrubHero } from '~/widgets/scrub-hero'
import { SectionShell } from '~/shared/ui'
</script>

<template>
  <ScrubHero />
  <SectionShell id="composition" title-key="sections.composition.title">
    <p class="text-ink-dim">Placeholder — replaced in Task 10.</p>
  </SectionShell>
</template>
```

- [ ] **Step 7: Run e2e + unit + lint + typecheck**

Run: `pnpm test:unit && pnpm test:e2e tests/e2e/hero.spec.ts tests/e2e/reduced-motion.spec.ts tests/e2e/i18n.spec.ts && pnpm lint && pnpm typecheck`
Expected: PASS. If the `i18n.spec.ts` FR concept target moved, update it to assert on `page.locator('html[lang="fr-FR"]')` + a French nav label (`Histoire`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: ScrubHero stage + ScrollTrigger wiring + Lenis + placeholder assets"
```

---

## Task 10: CompositionPyramid + NoteList

**Files:**
- Create: `app/entities/fragrance/ui/NoteList/{NoteList.vue,index.ts}`, update `app/entities/fragrance/index.ts`
- Create: `app/widgets/composition/model/constants.ts`, `app/widgets/composition/ui/CompositionPyramid/{CompositionPyramid.vue,index.ts}`, `app/widgets/composition/index.ts`
- Modify: `app/pages/index.vue`
- Create: `tests/e2e/content.spec.ts`

**Interfaces:**
- Consumes: `getFragrance`, `NoteTier`, `useReducedMotion`, `SectionShell`.
- Produces:
  - `<NoteList :notes="string[]" :label="string">` — `<dl>` style: label + comma list, each note wrapped in a `<span>`.
  - `~/widgets/composition/model/constants.ts`: `TIERS: readonly NoteTier[] = ['top', 'heart', 'base']`, `STAGGER_S = 0.08`.
  - `<CompositionPyramid>` — `SectionShell` id `composition`; three `<NoteList>` (labels from `composition.top|heart|base`); on scroll into view, GSAP `from` stagger (skipped under reduced motion).

- [ ] **Step 1: Write failing e2e**

```ts
// tests/e2e/content.spec.ts
import { expect, test } from '@playwright/test'

test.use({ javaScriptEnabled: false })

test('all twelve notes are in the prerendered HTML', async ({ page }) => {
  await page.goto('/')
  for (const note of [
    'bergamot', 'pink pepper', 'cold-metal accord',
    'iris', 'black tea', 'damask rose',
    'vetiver', 'ambrette', 'papyrus', 'incense',
  ]) {
    await expect(page.getByText(note, { exact: false }).first()).toBeVisible()
  }
})

test('concept line and wordmark are in static HTML', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'SILLAGE' })).toBeVisible()
  await expect(page.getByText('The smell of a letter you never sent.')).toBeVisible()
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e tests/e2e/content.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write `<NoteList>` + `<CompositionPyramid>`**

```vue
<!-- app/entities/fragrance/ui/NoteList/NoteList.vue -->
<script setup lang="ts">
defineProps<{ notes: string[]; label: string }>()
</script>

<template>
  <div class="border-t border-line py-5" data-note-row>
    <p class="text-xs uppercase tracking-widest text-ink-dim">{{ label }}</p>
    <p class="mt-2 font-display text-xl">
      <span v-for="(note, index) in notes" :key="note">
        {{ note }}<span v-if="index < notes.length - 1"> · </span>
      </span>
    </p>
  </div>
</template>
```

```vue
<!-- app/widgets/composition/ui/CompositionPyramid/CompositionPyramid.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SectionShell } from '~/shared/ui'
import { getFragrance, NoteList } from '~/entities/fragrance'
import { useReducedMotion } from '~/shared/lib'
import { STAGGER_S, TIERS } from '~/widgets/composition/model/constants'

const { locale, t } = useI18n()
const fragrance = computed(() => getFragrance(locale.value as 'en' | 'fr'))
const reduced = useReducedMotion()
const root = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (reduced.value || !root.value) return
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  gsap.from(root.value.querySelectorAll('[data-note-row]'), {
    opacity: 0,
    y: 16,
    stagger: STAGGER_S,
    scrollTrigger: { trigger: root.value, start: 'top 75%' },
  })
})
</script>

<template>
  <SectionShell id="composition" title-key="sections.composition.title">
    <div ref="root">
      <NoteList
        v-for="tier in TIERS"
        :key="tier"
        :label="t(`composition.${tier}`)"
        :notes="fragrance.notes[tier]"
      />
    </div>
  </SectionShell>
</template>
```

```ts
// app/widgets/composition/model/constants.ts
import type { NoteTier } from '~/entities/fragrance'

export const TIERS: readonly NoteTier[] = ['top', 'heart', 'base']
export const STAGGER_S = 0.08
```

- [ ] **Step 4: Integrate into `index.vue` (replace composition placeholder)**

- [ ] **Step 5: Run e2e + lint + typecheck**

Run: `pnpm test:e2e tests/e2e/content.spec.ts && pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: CompositionPyramid + NoteList"
```

---

## Task 11: Story, Object, Ritual sections

**Files:**
- Create: `app/widgets/story/ui/StorySection/{StorySection.vue,index.ts}` + `app/widgets/story/index.ts`
- Create: `app/widgets/object/ui/ObjectSection/{ObjectSection.vue,index.ts}` + `app/widgets/object/index.ts`
- Create: `app/widgets/ritual/model/constants.ts`, `app/widgets/ritual/ui/RitualSection/{RitualSection.vue,index.ts}` + `app/widgets/ritual/index.ts`
- Modify: `app/pages/index.vue`
- Modify: `tests/e2e/content.spec.ts` (add assertions for story + ritual copy)

**Interfaces:**
- Consumes: `SectionShell`, i18n keys `story.*`, `object.*`, `ritual.*`.
- Produces: `<StorySection>`, `<ObjectSection>`, `<RitualSection>` — each `SectionShell`-wrapped, pure content, all text in SSR HTML. `RITUAL_STEPS = ['ritual.step1', 'ritual.step2', 'ritual.step3'] as const`.

- [ ] **Step 1: Extend `content.spec.ts`**

```ts
test('story and ritual copy are in static HTML', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('cold-metal smell of a fountain pen', { exact: false })).toBeVisible()
  await expect(page.getByText('Two sprays on warm skin', { exact: false })).toBeVisible()
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e tests/e2e/content.spec.ts`
Expected: FAIL (new test).

- [ ] **Step 3: Write the three sections**

```vue
<!-- StorySection.vue -->
<script setup lang="ts">
import { SectionShell } from '~/shared/ui'
const { t } = useI18n()
</script>
<template>
  <SectionShell id="story" title-key="sections.story.title">
    <p class="max-w-prose text-lg leading-relaxed">{{ t('story.body') }}</p>
    <p class="mt-6 text-sm text-ink-dim">{{ t('story.perfumer') }}</p>
  </SectionShell>
</template>
```

```vue
<!-- ObjectSection.vue -->
<script setup lang="ts">
import { SectionShell } from '~/shared/ui'
const { t } = useI18n()
</script>
<template>
  <SectionShell id="object" title-key="sections.object.title">
    <div class="grid gap-8 sm:grid-cols-2 sm:items-center">
      <NuxtImg
        src="/object.webp"
        width="800"
        height="1000"
        class="panel w-full"
        :alt="t('sections.object.title')"
      />
      <p class="text-lg leading-relaxed">{{ t('object.body') }}</p>
    </div>
  </SectionShell>
</template>
```

```vue
<!-- RitualSection.vue -->
<script setup lang="ts">
import { SectionShell } from '~/shared/ui'
import { RITUAL_STEPS } from '~/widgets/ritual/model/constants'
const { t } = useI18n()
</script>
<template>
  <SectionShell id="ritual" title-key="sections.ritual.title">
    <ol class="counter space-y-6">
      <li v-for="(key, index) in RITUAL_STEPS" :key="key" class="flex gap-4">
        <span class="font-display text-accent">{{ index + 1 }}</span>
        <p class="text-lg">{{ t(key) }}</p>
      </li>
    </ol>
  </SectionShell>
</template>
```

```ts
// app/widgets/ritual/model/constants.ts
export const RITUAL_STEPS = ['ritual.step1', 'ritual.step2', 'ritual.step3'] as const
```

- [ ] **Step 4: Integrate all three into `index.vue`**

- [ ] **Step 5: Run e2e + lint + typecheck**

Run: `pnpm test:e2e tests/e2e/content.spec.ts && pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: story, object, ritual sections"
```

---

## Task 12: Acquire section (SizeSelect, PriceTag, bag + toast)

**Files:**
- Create: `app/shared/ui/ToastStack/{ToastStack.vue,types.ts,index.ts}`, `app/shared/lib/use-toasts.ts`
- Create: `app/entities/fragrance/ui/SizeSelect/{SizeSelect.vue,index.ts}`, `app/entities/fragrance/ui/PriceTag/{PriceTag.vue,index.ts}`, update `app/entities/fragrance/index.ts`
- Create: `app/widgets/acquire/ui/AcquireSection/{AcquireSection.vue,index.ts}`, `app/widgets/acquire/index.ts`
- Modify: `app/shared/ui/index.ts`, `app/shared/lib/index.ts`, `app/layouts/default.vue` (mount `<ToastStack>` + bag count in header), `app/pages/index.vue`
- Create: `tests/e2e/acquire.spec.ts`

**Interfaces:**
- Consumes: `getFragrance`, `Size`, `useBag`, `useFakeSubmit`, i18n `acquire.*`.
- Produces:
  - `useToasts(): { toasts: Ref<{ id: number; text: string }[]>; push: (text: string) => void }` — module-singleton state via `useState('toasts')`; auto-removes after `TOAST_MS` (3200).
  - `<ToastStack>` — fixed bottom-right, renders `useToasts().toasts`, `role="status"`.
  - `<SizeSelect v-model="SizeId" :sizes>` — radiogroup, keyboard-navigable, `aria-label` from `acquire.sizeLabel`.
  - `<PriceTag :price="number">` — formats `€{price}` (no decimals).
  - `<AcquireSection>` — `SectionShell` id `acquire`; SizeSelect + PriceTag + "Add to bag" button -> `useFakeSubmit.run` -> `useBag.add()` + `useToasts.push(t('acquire.added', { size }))`.

- [ ] **Step 1: Write failing e2e**

```ts
// tests/e2e/acquire.spec.ts
import { expect, test } from '@playwright/test'

test('selecting a size updates the price', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: /100 ml/i }).check()
  await expect(page.getByTestId('price')).toHaveText('€260')
})

test('add to bag shows a toast and bumps the header count', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Add to bag/i }).click()
  await expect(page.getByRole('status')).toContainText('SILLAGE 01')
  await expect(page.getByTestId('bag-count')).toContainText('1')
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e tests/e2e/acquire.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write `use-toasts.ts` + `<ToastStack>`**

```ts
// app/shared/lib/use-toasts.ts
const TOAST_MS = 3200
let nextId = 0

export const useToasts = () => {
  const toasts = useState<{ id: number; text: string }[]>('toasts', () => [])
  const push = (text: string) => {
    const id = (nextId += 1)
    toasts.value = [...toasts.value, { id, text }]
    if (import.meta.client) {
      window.setTimeout(() => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id)
      }, TOAST_MS)
    }
  }
  return { toasts, push }
}
```

```vue
<!-- app/shared/ui/ToastStack/ToastStack.vue -->
<script setup lang="ts">
import { useToasts } from '~/shared/lib'
const { toasts } = useToasts()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2" role="status" aria-live="polite">
    <p v-for="toast in toasts" :key="toast.id" class="panel px-4 py-2 text-sm">
      {{ toast.text }}
    </p>
  </div>
</template>
```

- [ ] **Step 4: Write `<SizeSelect>`, `<PriceTag>`**

```vue
<!-- SizeSelect.vue -->
<script setup lang="ts">
import type { Size, SizeId } from '~/entities/fragrance'

defineProps<{ sizes: Size[]; label: string }>()
const model = defineModel<SizeId>({ required: true })
</script>

<template>
  <fieldset>
    <legend class="text-xs uppercase tracking-widest text-ink-dim">{{ label }}</legend>
    <div class="mt-3 flex flex-wrap gap-2" role="radiogroup" :aria-label="label">
      <label
        v-for="size in sizes"
        :key="size.id"
        class="cursor-pointer rounded-pill border px-4 py-2 text-sm"
        :class="model === size.id ? 'border-accent text-accent' : 'border-line text-ink-dim'"
      >
        <input
          v-model="model"
          type="radio"
          :value="size.id"
          class="sr-only"
          :aria-label="size.label"
        />
        {{ size.label }}
      </label>
    </div>
  </fieldset>
</template>
```

```vue
<!-- PriceTag.vue -->
<script setup lang="ts">
defineProps<{ price: number }>()
</script>
<template>
  <span data-testid="price" class="font-display text-2xl">€{{ price }}</span>
</template>
```

- [ ] **Step 5: Write `<AcquireSection>`**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SectionShell } from '~/shared/ui'
import { getFragrance, PriceTag, SizeSelect } from '~/entities/fragrance'
import type { SizeId } from '~/entities/fragrance'
import { useBag, useFakeSubmit, useToasts } from '~/shared/lib'

const { locale, t } = useI18n()
const fragrance = computed(() => getFragrance(locale.value as 'en' | 'fr'))
const selected = ref<SizeId>('ml50')
const current = computed(
  () => fragrance.value.sizes.find((size) => size.id === selected.value)!,
)

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
    <div class="mt-6 flex items-center gap-6">
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
```

- [ ] **Step 6: Mount `<ToastStack>` + bag count in `default.vue`**

Header gets `<span data-testid="bag-count">{{ t('acquire.bag', { count: bag.count.value }) }}</span>`; `<ToastStack />` before `</div>`.

- [ ] **Step 7: Run e2e + lint + typecheck**

Run: `pnpm test:e2e tests/e2e/acquire.spec.ts && pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: acquire section, size select, price tag, bag + toasts"
```

---

## Task 13: Newsletter section

**Files:**
- Create: `app/shared/ui/FieldText/{FieldText.vue,types.ts,index.ts}`, update `app/shared/ui/index.ts`
- Create: `app/widgets/newsletter/model/constants.ts`, `app/widgets/newsletter/ui/NewsletterSection/{NewsletterSection.vue,index.ts}`, `app/widgets/newsletter/index.ts`
- Modify: `app/pages/index.vue`
- Create: `tests/unit/email.test.ts`, `tests/e2e/newsletter.spec.ts`

**Interfaces:**
- Consumes: `FieldText`, `SectionShell`, `useFakeSubmit`, `useToasts`, i18n `newsletter.*`.
- Produces:
  - `~/widgets/newsletter/model/constants.ts`: `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - `<FieldText v-model :label :type :placeholder :error?>` — labelled input, `aria-invalid` + `aria-describedby` when `error` set.
  - `<NewsletterSection>` — `SectionShell` id `newsletter` (uses `sections.newsletter.title`); submit -> validate with `EMAIL_RE`; invalid -> inline `newsletter.invalid`; valid -> `useFakeSubmit` -> `useToasts.push(newsletter.success)` + clear field.

- [ ] **Step 1: Write failing unit + e2e**

```ts
// tests/unit/email.test.ts
import { describe, expect, it } from 'vitest'
import { EMAIL_RE } from '~/widgets/newsletter/model/constants'

describe('EMAIL_RE', () => {
  it('accepts a normal address', () => {
    expect(EMAIL_RE.test('a@b.co')).toBe(true)
  })
  it('rejects malformed input', () => {
    for (const bad of ['foo', 'foo@', '@b.co', 'a b@c.co', 'a@b']) {
      expect(EMAIL_RE.test(bad)).toBe(false)
    }
  })
})
```

```ts
// tests/e2e/newsletter.spec.ts
import { expect, test } from '@playwright/test'

test('invalid email shows inline error, no toast', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(/email/i).fill('foo')
  await page.getByRole('button', { name: /Join/i }).click()
  await expect(page.getByText('Enter a valid email address.')).toBeVisible()
  await expect(page.getByRole('status')).not.toContainText('list')
})

test('valid email clears the field and toasts', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(/email/i).fill('reader@example.com')
  await page.getByRole('button', { name: /Join/i }).click()
  await expect(page.getByRole('status')).toContainText('on the list')
  await expect(page.getByLabel(/email/i)).toHaveValue('')
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `pnpm test:unit tests/unit/email.test.ts && pnpm test:e2e tests/e2e/newsletter.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `EMAIL_RE`, `<FieldText>`, `<NewsletterSection>`**

```ts
// app/widgets/newsletter/model/constants.ts
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

```vue
<!-- app/shared/ui/FieldText/FieldText.vue -->
<script setup lang="ts">
import { useId } from 'vue'

defineProps<{ label: string; type?: string; placeholder?: string; error?: string }>()
const model = defineModel<string>({ required: true })
const fieldId = useId()
const errorId = `${fieldId}-error`
</script>

<template>
  <div>
    <label :for="fieldId" class="text-xs uppercase tracking-widest text-ink-dim">
      {{ label }}
    </label>
    <input
      :id="fieldId"
      v-model="model"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      class="mt-2 w-full border-b border-line bg-transparent py-2 outline-none focus:border-accent"
    />
    <p v-if="error" :id="errorId" class="mt-2 text-sm text-accent">{{ error }}</p>
  </div>
</template>
```

```vue
<!-- app/widgets/newsletter/ui/NewsletterSection/NewsletterSection.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { FieldText, SectionShell } from '~/shared/ui'
import { useFakeSubmit, useToasts } from '~/shared/lib'
import { EMAIL_RE } from '~/widgets/newsletter/model/constants'

const { t } = useI18n()
const email = ref('')
const error = ref('')
const { pending, run } = useFakeSubmit()
const { push } = useToasts()

const submit = () => {
  if (!EMAIL_RE.test(email.value)) {
    error.value = t('newsletter.invalid')
    return
  }
  error.value = ''
  run(() => {
    push(t('newsletter.success'))
    email.value = ''
  })
}
</script>

<template>
  <SectionShell id="newsletter" title-key="sections.newsletter.title">
    <p class="text-ink-dim">{{ t('newsletter.body') }}</p>
    <form class="mt-6 flex max-w-md items-end gap-4" @submit.prevent="submit">
      <FieldText
        v-model="email"
        type="email"
        :label="t('newsletter.title', 'Email')"
        :placeholder="t('newsletter.placeholder')"
        :error="error"
        class="flex-1"
      />
      <button
        type="submit"
        class="rounded-pill border border-accent px-5 py-2 text-sm text-accent disabled:opacity-50"
        :disabled="pending"
      >
        {{ t('newsletter.submit') }}
      </button>
    </form>
  </SectionShell>
</template>
```

Note: `getByLabel(/email/i)` needs an accessible name containing "email". Set the `FieldText` label for this instance to a dedicated key `newsletter.emailLabel` = `"Email"` / `"E-mail"` — add it to both locale files.

- [ ] **Step 4: Run unit + e2e + lint + typecheck**

Run: `pnpm test:unit && pnpm test:e2e tests/e2e/newsletter.spec.ts && pnpm lint && pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: newsletter section + FieldText + email validation"
```

---

## Task 14: Site chrome — header nav, footer, page assembly

**Files:**
- Create: `app/widgets/site-chrome/ui/SiteHeader/{SiteHeader.vue,index.ts}`, `app/widgets/site-chrome/ui/SiteFooter/{SiteFooter.vue,index.ts}`, update `app/widgets/site-chrome/index.ts`
- Modify: `app/layouts/default.vue` (use `<SiteHeader>` / `<SiteFooter>`), `app/pages/index.vue` (final section order)
- Modify: `tests/e2e/i18n.spec.ts` (assert French nav label present), `tests/e2e/layout.spec.ts` (nav anchors resolve)

**Interfaces:**
- Consumes: `<Wordmark>`, `<LocaleSwitch>`, `NAV_SECTIONS`, `useBag`, i18n `nav.*`, `footer.disclaimer`.
- Produces: `<SiteHeader>` — sticky glassy bar: `<Wordmark>`, anchor nav from `NAV_SECTIONS` (`href="#id"`), `<LocaleSwitch>`, bag count. Nav collapses to just wordmark + locale under `sm`. `<SiteFooter>` — wordmark, `footer.disclaimer`, year.

- [ ] **Step 1: Update failing e2e**

```ts
// add to tests/e2e/layout.spec.ts
test('header nav anchors point at real sections', async ({ page }) => {
  await page.goto('/')
  for (const id of ['composition', 'story', 'object', 'ritual', 'acquire']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e tests/e2e/layout.spec.ts`
Expected: FAIL if section ids missing / nav absent.

- [ ] **Step 3: Write `<SiteHeader>` + `<SiteFooter>`**

```vue
<!-- SiteHeader.vue -->
<script setup lang="ts">
import { Wordmark } from '~/shared/ui'
import { LocaleSwitch } from '~/widgets/site-chrome/ui/LocaleSwitch'
import { NAV_SECTIONS } from '~/shared/config/site'
import { useBag } from '~/shared/lib'

const { t } = useI18n()
const bag = useBag()
</script>

<template>
  <header
    class="panel sticky top-0 z-40 mx-3 mt-3 flex items-center justify-between rounded-panel px-5 py-3 backdrop-blur"
  >
    <Wordmark class="text-sm" />
    <nav class="hidden gap-5 text-xs uppercase tracking-widest text-ink-dim sm:flex">
      <a v-for="item in NAV_SECTIONS" :key="item.id" :href="`#${item.id}`">
        {{ t(item.labelKey) }}
      </a>
    </nav>
    <div class="flex items-center gap-4 text-xs">
      <span data-testid="bag-count">{{ t('acquire.bag', { count: bag.count.value }) }}</span>
      <LocaleSwitch />
    </div>
  </header>
</template>
```

```vue
<!-- SiteFooter.vue -->
<script setup lang="ts">
import { Wordmark } from '~/shared/ui'
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-32 border-t border-line px-6 py-12 text-sm text-ink-dim">
    <Wordmark class="text-xs" />
    <p class="mt-3">{{ t('footer.disclaimer') }}</p>
    <p class="mt-1">© {{ year }}</p>
  </footer>
</template>
```

- [ ] **Step 4: Final `default.vue` + `index.vue`**

```vue
<!-- app/layouts/default.vue -->
<script setup lang="ts">
import { SiteFooter, SiteHeader } from '~/widgets/site-chrome'
import { ToastStack } from '~/shared/ui'
</script>

<template>
  <div class="min-h-dvh bg-ground text-ink">
    <SiteHeader />
    <main><slot /></main>
    <SiteFooter />
    <ToastStack />
  </div>
</template>
```

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
import { ScrubHero } from '~/widgets/scrub-hero'
import { CompositionPyramid } from '~/widgets/composition'
import { StorySection } from '~/widgets/story'
import { ObjectSection } from '~/widgets/object'
import { RitualSection } from '~/widgets/ritual'
import { AcquireSection } from '~/widgets/acquire'
import { NewsletterSection } from '~/widgets/newsletter'
</script>

<template>
  <ScrubHero />
  <CompositionPyramid />
  <StorySection />
  <ObjectSection />
  <RitualSection />
  <AcquireSection />
  <NewsletterSection />
</template>
```

- [ ] **Step 5: Run full e2e + unit + lint + typecheck**

Run: `pnpm test:unit && pnpm test:e2e && pnpm lint && pnpm typecheck`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: site header nav + footer + final page assembly"
```

---

## Task 15: SEO (JSON-LD, meta, sitemap, robots) + a11y smoke

**Files:**
- Modify: `nuxt.config.ts` (`sitemap`, `robots` config), `app/app.vue` (JSON-LD `Product` script)
- Create: `app/shared/lib/use-product-jsonld.ts`, update `app/shared/lib/index.ts`
- Create: `tests/e2e/a11y.spec.ts`
- Modify: `tests/e2e/i18n.spec.ts` (canonical assertions)

**Interfaces:**
- Consumes: `getFragrance`, `useI18n`, `useRequestURL`.
- Produces: `useProductJsonld()` — injects `<script type="application/ld+json">` with `@type: Product`, `name: 'SILLAGE 01 — Encre'`, `brand: 'SILLAGE'`, `offers` array from `sizes` (price, `priceCurrency: 'EUR'`, `availability: 'https://schema.org/InStock'`).

- [ ] **Step 1: Write failing e2e**

```ts
// tests/e2e/a11y.spec.ts
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const path of ['/', '/fr/']) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    const serious = results.violations.filter((entry) =>
      ['serious', 'critical'].includes(entry.impact ?? ''),
    )
    expect(serious).toEqual([])
  })
}

test('product JSON-LD is present', async ({ page }) => {
  await page.goto('/')
  const ld = await page.locator('script[type="application/ld+json"]').textContent()
  expect(ld).toContain('"@type":"Product"')
  expect(ld).toContain('SILLAGE 01')
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e tests/e2e/a11y.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `useProductJsonld` + wire in `app.vue`; configure sitemap/robots**

```ts
// app/shared/lib/use-product-jsonld.ts
import { getFragrance } from '~/entities/fragrance'

export const useProductJsonld = () => {
  const { locale } = useI18n()
  const fragrance = getFragrance(locale.value as 'en' | 'fr')
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${fragrance.edition} — ${fragrance.name}`,
    brand: { '@type': 'Brand', name: 'SILLAGE' },
    description: fragrance.concept,
    offers: fragrance.sizes.map((size) => ({
      '@type': 'Offer',
      name: size.label,
      price: size.priceEur,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    })),
  }
  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonld) }],
  })
}
```

```ts
// nuxt.config.ts additions
sitemap: { autoLastmod: true },
robots: { sitemap: '/sitemap_index.xml' },
```

Call `useProductJsonld()` in `app.vue setup`.

- [ ] **Step 4: Extend `i18n.spec.ts` with canonical/lang assertions**

```ts
test('canonical + html lang per locale', async ({ page }) => {
  await page.goto('/fr/')
  await expect(page.locator('html')).toHaveAttribute('lang', /fr/)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
})
```

- [ ] **Step 5: Run full e2e + lint + typecheck**

Run: `pnpm test:e2e && pnpm lint && pnpm typecheck`
Expected: PASS. Fix any axe violations (likely: colour contrast on `text-ink-dim` — bump token to `#A79E93` if flagged; missing `<h1>` order; link names).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: product JSON-LD, sitemap, robots, a11y smoke"
```

---

## Task 16: README, performance pass, final green

**Files:**
- Create/replace: `README.md`
- Modify: `nuxt.config.ts` if needed (font `display=swap` already set; add `<link rel="preload">` for poster if LCP needs it)
- Create: `.github/` — skip (no CI per spec)

**Interfaces:**
- Consumes: everything.
- Produces: a README documenting commands + the "swap in real frames" procedure; a clean full test run.

- [ ] **Step 1: Write `README.md`**

Include: one-paragraph description, `pnpm install | dev | generate | preview | lint | typecheck | test:unit | test:e2e`, the `NUXT_PUBLIC_SITE_URL` note, and the verbatim "swap in real frames" steps from the spec section 5 / `public/sequence/README.md`. Note that `USE_PLACEHOLDER = true` ships the procedural hero.

- [ ] **Step 2: Production build + manual perf check**

Run: `NUXT_PUBLIC_SITE_URL=https://sillage.example pnpm generate`
Then: `pnpm preview` and check `.output/public` entry JS size (`du -sh .output/public/_nuxt/*.js | sort -h | tail`). Confirm GSAP is in an async chunk, not the entry. If entry > 180 KB gzip, lazy-load `lenis` too (dynamic import inside the plugin).

- [ ] **Step 3: Full test sweep**

Run: `pnpm test:unit && pnpm lint && pnpm typecheck && pnpm test:e2e`
Expected: everything green.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: README + performance pass"
```

---

## Self-Review

**1. Spec coverage:**

| Spec section | Task(s) |
| --- | --- |
| 2 Product content | 3 (i18n copy), 4 (notes/sizes data) |
| 3 Stack | 1 |
| 4 Light FSD structure | 1–2 (dirs), enforced by ESLint rule in 1 |
| 5 Scrub hero (component tree, scroll binding, useScrubFrames, constants, swap procedure) | 6, 7, 8, 9 |
| 6 Sections below hero | 10 (composition), 11 (story/object/ritual), 12 (acquire), 13 (newsletter) |
| 6 SiteHeader/Footer | 14 |
| 7 Theme tokens | 1 (`main.css`) |
| 8 SEO / head | 3 (locale head + meta), 15 (JSON-LD, sitemap, robots) |
| 9 Testing (7 spec files) | hero 9, content 10–11, reduced-motion 9, acquire 12, newsletter 13, i18n 3/14/15, a11y 15 |
| 10 Performance budgets | 16 |
| 11 Deployment | 1 (static preset), 16 (README) |
| 12 Not in v1 | respected — no backend, cart page, theme toggle, og-image module |
| 13 Open items | HERO_BEATS copy resolved in Task 3/7; placeholder assets in Task 9 script; Lenis kept, lazy-load fallback noted in Task 16 |

No gaps.

**2. Placeholder scan:** No "TBD"/"TODO"/"add error handling"-style steps. Every code step has real code. Axe-fix step names the likely violation (contrast) and the concrete remedy.

**3. Type consistency:**
- `SizeId` (`'ml50' | 'ml100' | 'ml10'`) defined in Task 4, used in Tasks 12 (`selected = ref<SizeId>('ml50')`) and `<SizeSelect>` model.
- `getFragrance(locale: Locale)` — Tasks 10/12/15 pass `locale.value as 'en' | 'fr'`; `Locale` is exactly `'en' | 'fr'` (Task 3), consistent.
- `useToasts().push(text)` / `toasts` shape `{ id, text }` — defined Task 12, consumed Tasks 12 & 13 identically.
- `useScrubFrames({ prefix, count, ext, enabled })` — signature defined Task 6, called Task 9 with those exact keys.
- `beatOpacity(progress, from, to, fade?)` — Task 5, used Task 8.
- `frameIndexFor(progress, count)` — Task 7, used in `<ScrubCanvas>` same task.
- `HeroBeat` (`{ id, from, to, key }`) — Task 7 types, used Tasks 7/8.
- `useBag()` returns `{ count, add }` — Task 5, used Tasks 12/14 (`bag.count.value`, `bag.add()`).

Consistent throughout.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-30-sillage-landing.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
