# SILLAGE — scroll-scrub landing (design spec)

Date: 2026-08-30
Status: approved for planning

## 1. What this is

A single-page marketing site for a fictional niche fragrance house, **SILLAGE**,
built as a portfolio showcase piece. The centrepiece is a scroll-scrubbed hero:
a perfume flacon on pure black rotates, its cap lifts, a fine mist sprays and
drifts off as a scent trail — the visual meaning of *sillage* (the trail a scent
leaves). Below the hero, standard product-launch sections.

The scrub technique (buttery, frame-accurate, scroll-driven) is the flex. Pure
black background is deliberate: it removes the interpolation artefacts that make
AI-generated footage look bad when scrubbed slowly.

Not a real brand. No real commerce — "add to bag" and newsletter are faked
client-side.

## 2. Product content (fictional, fixed)

**SILLAGE 01 — "Encre"** (Ink). Concept line: *"The smell of a letter you never
sent."* 50 ml · eau de parfum · hand-decanted.

Olfactory pyramid:

| Tier  | Notes |
| ----- | ----- |
| Top   | bergamot, pink pepper, cold-metal accord |
| Heart | iris, black tea, damask rose |
| Base  | vetiver, ambrette, papyrus, incense |

Sizes offered in Acquire: 50 ml (€180), 100 ml (€260), 10 ml discovery (€35).

FR copy is a faithful translation of the EN copy (this is a French-flavoured
house, so FR matters).

## 3. Stack

- **Nuxt 4** + Vue 3 + TypeScript strict. SSG via `nuxt generate`, Nitro
  `static` preset, route prerendered.
- **Tailwind v4**, CSS-first. Tokens + custom utilities in
  `app/assets/css/main.css` (`@theme`, `@utility`). No `tailwind.config.js`.
- **GSAP + ScrollTrigger** — the only animation library. Loaded via dynamic
  `import()` in `onMounted`, never on the SSR path.
- **Lenis** — momentum scroll (`app/plugins/lenis.client.ts`), skipped under
  reduced motion.
- **@nuxtjs/i18n v10** — `prefix_except_default`, default `en`, plus `fr`. EN at
  `/`, FR at `/fr/*`. UI strings in `i18n/locales/{en,fr}.json`. Canonical +
  hreflang via `useLocaleHead()` in `app/app.vue`.
- **@nuxtjs/sitemap** + **@nuxtjs/robots**.
- **@nuxt/image** for all raster images (`<NuxtImg>`, explicit width/height).
- **@vueuse/core** for `useReducedMotion`, `useIntersectionObserver`, etc.
- **Playwright** e2e + **@axe-core/playwright** a11y smoke. `test:e2e` runs
  `generate` + `preview` first (tests the real static output).
- **ESLint** flat config extending `@nuxt/eslint` (`stylistic: false`), plus
  `func-style: expression` (arrow-only), `id-length` (min 3), `no-magic-numbers`
  (allow `-1,0,1,2` + array indices), per-layer `no-restricted-imports` for FSD
  direction. **Prettier** — no semis, single quotes, trailing commas, width 90.
  **lefthook** runs both on staged files pre-commit.
- TypeScript pinned via `pnpm-workspace.yaml` overrides if `typescript-eslint`
  needs it (mirror the portfolio pin only if a break appears).

## 4. Architecture — light FSD

Layers under `app/`, outer -> inner: **app -> widgets -> entities -> shared**.
Imports go downward only (ESLint enforced). Everything imported explicitly
through a slice `index.ts` — no component auto-import.

```
app/
  shared/
    config/      i18n.ts (LOCALES, Locale), site.ts (SITE_NAME, ACCENT, nav)
    lib/         clamp.ts, use-reduced-motion.ts, use-scrub-frames.ts,
                 use-fake-submit.ts  (+ index.ts barrel)
    ui/          Wordmark/, Chip/, FieldText/, ToastStack/, SectionShell/
  entities/
    fragrance/   model/{types.ts,data.ts}  ui/{NoteList/,PriceTag/,SizeSelect/}
                 index.ts -> getFragrance, Fragrance, NoteList, PriceTag, SizeSelect
  widgets/
    scrub-hero/  model/constants.ts (FRAME_COUNT, FRAME_PATH_*, STAGE_SCROLL_VH,
                   USE_PLACEHOLDER, HERO_BEATS, MOBILE_MAX_WIDTH)
                 model/types.ts (HeroBeat)
                 ui/{ScrubHero/,ScrubCanvas/,HeroBeats/,HeroFallback/}
    composition/ model/constants.ts  ui/CompositionPyramid/
    story/       ui/StorySection/
    object/      ui/ObjectSection/
    ritual/      ui/RitualSection/
    acquire/     model/constants.ts (SIZES)  ui/AcquireSection/
    newsletter/  model/constants.ts (EMAIL_RE)  ui/NewsletterSection/
    site-chrome/ ui/{SiteHeader/,SiteFooter/,LocaleSwitch/}
  pages/index.vue
  layouts/default.vue
  app.vue          app.config.ts
i18n/locales/{en,fr}.json
public/
  sequence/        real frames go here later: frame-0001.webp ... frame-0120.webp
  sequence-mobile/ optional lighter set
  og/default.png
  hero-poster.webp (first frame; used by SSR fallback + <video> poster)
tests/e2e/
  hero.spec.ts  content.spec.ts  reduced-motion.spec.ts  acquire.spec.ts
  newsletter.spec.ts  i18n.spec.ts  a11y.spec.ts
scripts/
  gen-placeholder-poster.mjs  (writes a black hero-poster.webp so builds pass
                               before real assets exist)
```

Folder-per-component: `ui/Name/{Name.vue, types.ts?, constants.ts?, index.ts}`.
Slice-wide types -> `model/types.ts`; slice-wide constants -> `model/constants.ts`.

## 5. The scrub hero — detail

### Component tree

- `<ScrubHero>` — owns the tall stage (`height: STAGE_SCROLL_VH vh`) with an
  inner `position: sticky; top: 0; height: 100vh` layer. Decides cinematic vs
  fallback from `useReducedMotion()` + viewport width (`MOBILE_MAX_WIDTH`), both
  evaluated client-side after mount (`isMounted` gate) so SSR and first client
  paint always render `<HeroFallback>` -> no hydration mismatch.
- `<ScrubCanvas :progress>` — a `<canvas>` sized to the stage (devicePixelRatio
  aware). Paints frame for `progress`:
  - if `useScrubFrames` has images loaded -> `drawImage` with cover math
    (`frameIndex = Math.round(progress * (FRAME_COUNT - 1))`).
  - else -> `paintPlaceholder(ctx, progress)`: a procedurally drawn rounded-rect
    flacon rotating on black with a radial orange core glow whose radius tracks
    `progress`. No assets required. Keeps the whole mechanism demoable and
    testable now.
- `<HeroBeats :progress>` — renders `HERO_BEATS`. Each beat
  `{ id, from, to, key }`: opacity + slight `translateY` derived from `progress`
  via a small easing helper (visible when `from <= progress <= to`, fading at the
  edges). Text via `t(beat.key)`.
- `<HeroFallback>` — static: `<NuxtImg src="/hero-poster.webp">` behind a scrim,
  `<h1>` wordmark, every beat's text stacked as normal flow. Section is normal
  height (not `STAGE_SCROLL_VH`). This is the SSR HTML -> content-first, SEO-safe.

### Scroll binding

`onMounted` (cinematic branch only): dynamic-import GSAP + ScrollTrigger,
register, create one ScrollTrigger on the stage:
`start: 'top top'`, `end: 'bottom bottom'`, `scrub: true`,
`onUpdate: (self) => { progress.value = self.progress }`.
`progress` is a plain `ref`, passed to `<ScrubCanvas>` and `<HeroBeats>`.
`onUnmounted` -> `ScrollTrigger.getAll().forEach(t => t.kill())`.

### `useScrubFrames(prefix, count, ext)`

Returns `{ images: Ref<HTMLImageElement[]>, loaded: Ref<boolean>, progress:
Ref<number> }`. On call (client only): builds URLs
`${prefix}${String(n).padStart(4,'0')}.${ext}` for `n` in `1..count`,
`new Image()` each, resolves count on load/error. Sets `loaded` when
`>= LOAD_READY_RATIO` are done. If `USE_PLACEHOLDER` is true, it no-ops and
`loaded` stays false so the canvas uses `paintPlaceholder`.

### Constants (`widgets/scrub-hero/model/constants.ts`)

`FRAME_COUNT = 120`, `FRAME_PATH_PREFIX = '/sequence/frame-'`,
`FRAME_PATH_EXT = 'webp'`, `STAGE_SCROLL_VH = 320`, `USE_PLACEHOLDER = true`,
`MOBILE_MAX_WIDTH = 768`, `LOAD_READY_RATIO = 0.85`, `HERO_BEATS` (5 beats with
`from`/`to` in 0..1 and i18n keys `hero.beats.*`).

### Switching to real assets (documented in README)

1. Drop `frame-0001.webp` ... `frame-0120.webp` into `public/sequence/`
   (1600px wide, WebP, < ~4 MB total).
2. Replace `public/hero-poster.webp` with the real first frame.
3. Set `USE_PLACEHOLDER = false`.
   No code changes. `pnpm test:e2e` still green.

## 6. Sections below the hero

Each is a widget wrapping content in `shared/ui/SectionShell` (the
`<section id aria-labelledby>` landmark + padded block + `<h2>`).

1. **CompositionPyramid** — three tiers (top / heart / base). Each tier's
   `<NoteList>` (from `entities/fragrance`) staggers in on scroll via
   `useIntersectionObserver` + a GSAP `from` tween (reduced-motion -> no tween,
   just visible).
2. **StorySection** — concept paragraph + perfumer blurb. Pure text, in SSR HTML.
3. **ObjectSection** — `<NuxtImg>` of the bottle (placeholder image shipped) +
   craft copy (glass, 50 ml, hand-decant).
4. **RitualSection** — 3 numbered steps (pulse points, layering, when to wear).
5. **AcquireSection** — `<SizeSelect>` (radio group, `SIZES` from
   `acquire/model/constants.ts`), `<PriceTag>` reacts to selection, "Add to bag"
   button -> `useFakeSubmit` pushes a `<ToastStack>` toast ("Added — SILLAGE 01,
   50 ml"). Bag count lives in a `useState('bag')`; header shows it.
6. **NewsletterSection** — `<FieldText type="email">`, submit validates against
   `EMAIL_RE`; invalid -> inline error, valid -> `useFakeSubmit` -> success
   toast + field clears. Nothing leaves the browser.

`<SiteHeader>` — `<Wordmark>` + `<LocaleSwitch>` + bag count. Sticky, glassy,
appears after hero. `<SiteFooter>` — wordmark, fake legal links, "fictional
project" disclaimer.

## 7. Theme

Single committed dark theme — no toggle. Tokens in `main.css` `@theme`:

- `--color-ground: #0A0908`
- `--color-ink: #F2EBE3` (text)
- `--color-ink-dim: #9A938A`
- `--color-accent: #C8641E` (amber)
- `--color-line: rgba(242,235,227,0.12)`
- `--radius-panel`, `--radius-pill`
- `--font-display: 'Fraunces'` , body stays `--font-sans: 'Hanken Grotesk'`

Fonts via a Google Fonts `<link>` in `nuxt.config.ts` `app.head`. Use generated
utilities (`text-ink`, `bg-ground`, `border-line`, `text-accent`,
`font-display`) — never `[var(--...)]`.

`prefers-reduced-motion` respected in every animation. `prefers-color-scheme`
is irrelevant here (site is dark-only) but the page still sets an explicit
`background` on `body`.

## 8. SEO / head

- `useLocaleHead()` wired in `app.vue` -> canonical + hreflang for en/fr.
- Per-locale `<title>` / `<meta description>` from i18n (`meta.title`,
  `meta.description`).
- `og:image` -> `/og/default.png` (static placeholder shipped).
- Sitemap index at `/sitemap_index.xml`, robots points at it.
- JSON-LD `Product` block (name, brand, offers) rendered server-side from
  `getFragrance` — real content in the HTML.

## 9. Testing (Playwright, against the static build)

- `hero.spec.ts` — with motion enabled: scrolling through the stage changes
  what `<HeroBeats>` shows (beat 1 visible near top, last beat visible near
  bottom); canvas is present and its painted frame changes (spy on a
  `data-frame` attribute `<ScrubCanvas>` writes for test observability).
- `content.spec.ts` — prerendered HTML (JS disabled) contains: `<h1>` SILLAGE,
  all 12 note names, the concept line, story text, all size prices, footer
  disclaimer.
- `reduced-motion.spec.ts` — `prefers-reduced-motion: reduce` -> `<HeroFallback>`
  rendered, stage is ~1 viewport tall (not 320vh), all beat texts visible at
  once.
- `acquire.spec.ts` — select 100 ml -> price updates to EUR 260; "Add to bag" ->
  toast appears, header bag count increments.
- `newsletter.spec.ts` — `foo` -> inline error, no toast; `a@b.co` -> success
  toast, field cleared.
- `i18n.spec.ts` — `/fr/` renders French note names + concept line; `<link
  rel="alternate" hreflang="fr">` and `hreflang="en"` present on both routes.
- `a11y.spec.ts` — `@axe-core/playwright` on `/` and `/fr/`, no serious/critical
  violations; every interactive control reachable by keyboard with a visible
  focus ring.

`playwright.config.ts` `webServer` runs `pnpm generate && pnpm preview`
(`reuseExistingServer` in dev).

## 10. Performance budgets

- LCP < 2.5s mobile. Poster frame optimised WebP/AVIF ~1600px.
- Entry JS < ~180 KB gzip. GSAP + ScrollTrigger dynamic-imported after mount.
- Frame sequence (when real) fetched after mount, not render-blocking; 120
  frames, < ~4 MB total; separate `sequence-mobile/` or poster-only on
  `<= MOBILE_MAX_WIDTH`.
- CLS ~ 0 — fallback and cinematic reserve the same space.

## 11. Deployment

- `nuxt generate` -> `dist/`. `NUXT_PUBLIC_SITE_URL` env for canonical/sitemap.
- No CI, no remote for now — local git repo. README documents:
  `pnpm install | dev | generate | preview | lint | typecheck | test:e2e`
  and the "swap in real frames" steps from section 5.
- Initial commit: scaffold + this spec. Further commits left to the repo owner
  (matches the owner's no-auto-commit preference on their other project — ask
  before committing implementation work).

## 12. Explicitly not in v1

Real backend / commerce / payment, real email capture, CMS, multi-fragrance
catalogue, separate routes per fragrance, blog, cart page (bag is a
count + toast only), theme toggle, `nuxt-og-image` (static OG only), analytics.

## 13. Open items for the plan

- Exact `HERO_BEATS` copy (EN + FR) — draft in the plan, refine in
  implementation.
- Placeholder bottle/object images — generate a simple black-on-black poster via
  `scripts/gen-placeholder-poster.mjs`; object image can be a CSS-drawn stand-in
  until a real render exists.
- Whether Lenis is worth it for a single page or a plain CSS `scroll-behavior`
  suffices — decide in the plan.
