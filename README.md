# SILLAGE

A single-page marketing site for a fictional niche fragrance house, built as a
portfolio piece. The centrepiece is a **scroll-scrubbed canvas hero**: a flacon
rotates, its cap lifts, a mist drifts off as a scent trail — the meaning of
_sillage_. Below it: composition pyramid, story, the object, ritual, a faked
"acquire" flow, and a faked newsletter.

Nothing is real — no commerce, no email capture. "Add to bag" and "Join" are
client-side theatre.

## Stack

Nuxt 4 (SSG) · Vue 3 · TypeScript strict · Tailwind v4 (CSS-first) ·
GSAP + ScrollTrigger (dynamic-imported, lazy) · @nuxtjs/i18n v10 (EN `/`,
FR `/fr/*`) · Playwright + axe · Vitest · ESLint (arrow-only, named constants,
`~` imports, light-FSD layering) + Prettier + lefthook.

## Commands

| Task              | Command                                            |
| ----------------- | -------------------------------------------------- |
| Install           | `pnpm install`                                     |
| Dev server        | `pnpm dev`                                         |
| Static build      | `pnpm generate` (set `NUXT_PUBLIC_SITE_URL`)       |
| Preview the build | `pnpm preview`                                     |
| Lint              | `pnpm lint` (fix: `pnpm lint:fix`)                 |
| Types             | `pnpm typecheck`                                   |
| Unit tests        | `pnpm test:unit`                                   |
| E2E               | `pnpm test:e2e` (`pnpm generate && preview` first) |
| Placeholder art   | `pnpm assets:placeholder`                          |

`pnpm test:e2e` serves the real static output on port **3100** (the machine's
other Nuxt project owns 3000).

## The scroll-scrub hero

Ships today with `USE_PLACEHOLDER = true`
(`app/widgets/scrub-hero/model/constants.ts`) — the canvas paints a procedural
rotating flacon, so the mechanism works with zero art. On a reduced-motion or
narrow viewport it renders a static fallback with every line of copy in the
prerendered HTML.

### Dropping in the real frame sequence

1. Export the hero animation as `frame-0001.webp` … `frame-0120.webp`
   (1600px wide, WebP, keep the set under ~4 MB total) into `public/sequence/`.
2. Replace `public/hero-poster.webp` with the real first frame.
3. Set `USE_PLACEHOLDER = false`.

No code changes; `pnpm test:e2e` stays green. Adjust `FRAME_COUNT` if the
sequence length differs.

## Content

All copy is typed TS + i18n JSON — `app/entities/fragrance/model/data.ts`
(notes, sizes, concept) and `i18n/locales/{en,fr}.json` (everything else).

## Performance

Eager entry JS ≈ 118 KB gzip. GSAP + ScrollTrigger load as a lazy chunk after
mount. `public/hero-poster.webp` is the LCP image on the fallback path —
optimise the real one.

## Not built (by design)

Real backend / commerce / payment, real email capture, CMS, multi-fragrance
catalogue, per-fragrance routes, cart page, theme toggle, analytics.
