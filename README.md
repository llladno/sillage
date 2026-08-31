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

The canvas scrubs a 121-frame WebP sequence in `public/sequence/`
(`USE_PLACEHOLDER = false`). It paints the nearest already-decoded frame while
the set streams in, with `public/hero-poster.webp` as the first-paint image, so
there is no flash. `USE_PLACEHOLDER = true` swaps back to a procedural flacon if
the sequence is ever missing. On reduced-motion or a narrow viewport it renders
a static fallback with every line of copy in the prerendered HTML.

### Regenerating the art

Source stills + the interpolation video live in `docs/content/`
(the `.mp4` is gitignored — keep it locally). Rebuild every `public/` asset:

```
node scripts/process-assets.mjs   # needs ffmpeg on PATH
```

Prompts used to generate the source art: `docs/image-prompts.md`.
If the frame count changes, update `FRAME_COUNT` in
`app/widgets/scrub-hero/model/constants.ts`.

## Content

All copy is typed TS + i18n JSON — `app/entities/fragrance/model/data.ts`
(notes, sizes, concept) and `i18n/locales/{en,fr}.json` (everything else).

## Performance

Eager entry JS ≈ 120 KB gzip. GSAP + ScrollTrigger + SplitText load as a lazy
chunk after mount. The hero frame sequence (~3.3 MB) is fetched after mount, off
the critical path; `public/hero-poster.webp` is the LCP image.

## Not built (by design)

Real backend / commerce / payment, real email capture, CMS, multi-fragrance
catalogue, per-fragrance routes, cart page, theme toggle, analytics.
