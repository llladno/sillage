<div align="center">

# SILLAGE

**A scroll-driven landing page for a fictional niche fragrance house.**

[![CI](https://github.com/llladno/sillage/actions/workflows/ci.yml/badge.svg)](https://github.com/llladno/sillage/actions/workflows/ci.yml)

[**Live → sillage-encre.pages.dev**](https://sillage-encre.pages.dev) &nbsp;·&nbsp; English &nbsp;|&nbsp; [Русский](#-русский)

</div>

---

_Sillage_ (fr., "wake") — the trail a scent leaves behind. The site is one page:
a scroll-scrubbed canvas hero where a flacon turns and a mist drifts off, then
the fragrance's composition pyramid, its story, the object itself, the ritual,
a faked "acquire" flow and a faked newsletter.

Nothing here is real — no commerce, no e-mail capture. "Add to bag" and "Join"
are client-side theatre. It's a portfolio piece.

## Highlights

- **Scroll-scrubbed hero** — a 121-frame WebP sequence painted on `<canvas>`,
  streamed after mount with a poster frame for a flash-free LCP. Falls back to a
  static hero under reduced motion or on a narrow viewport, with every line of
  copy in the prerendered HTML.
- **Momentum scrolling** — Lenis driven off the GSAP ticker, so every
  ScrollTrigger stays locked to the smoothed position. Disabled under
  `prefers-reduced-motion`.
- **Backdrop scenes** — large muted photographs surface behind the content as
  each section reaches the viewport, alternating left / right with a parallax
  drift.
- **Condensing header** — a floating pill at the top that unfolds into a
  full-bleed bar once you scroll, with hysteresis so it can't flicker.
- **Three locales** — EN at `/`, FR at `/fr/`, RU at `/ru/`
  (`prefix_except_default`), a custom language dropdown, full `hreflang` +
  canonical + a localized sitemap.
- **SEO** — per-locale `<title>` / meta, Product JSON-LD, `@nuxtjs/sitemap` +
  `@nuxtjs/robots`.
- **Static** — `nuxt generate`, every route prerendered, zero server runtime.

## Stack

Nuxt 4 (SSG) · Vue 3 · TypeScript (strict) · Tailwind v4 (CSS-first, no config
file) · GSAP + ScrollTrigger + SplitText (lazy-imported) · Lenis · `@nuxt/image`
· `@nuxtjs/i18n` v10 · `@nuxtjs/sitemap` + `@nuxtjs/robots` · Playwright +
`@axe-core/playwright` · Vitest · ESLint (arrow-only, named constants, `~`
imports, FSD layering) + Prettier + lefthook.

## Quick start

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

| Task              | Command                                            |
| ----------------- | -------------------------------------------------- |
| Dev server        | `pnpm dev`                                         |
| Static build      | `pnpm generate`                                    |
| Preview the build | `pnpm preview`                                     |
| Lint / fix        | `pnpm lint` · `pnpm lint:fix`                      |
| Types             | `pnpm typecheck`                                   |
| Unit tests        | `pnpm test:unit`                                   |
| E2E (+ a11y)      | `pnpm test:e2e` (builds & serves on port **3100**) |
| Deploy            | `pnpm deploy` — see [DEPLOY.md](./DEPLOY.md)       |

## Architecture — light FSD

Layers under `app/`, imports flow downward only (ESLint-enforced):

```
app/
  pages/        index.vue — the single page
  widgets/      scrub-hero · backdrop-scenes · composition · story · object
                ritual · acquire · newsletter · site-chrome
  entities/     fragrance — typed content (notes, sizes, concept)
  shared/       config · lib (composables) · ui (dumb components)
  plugins/      lenis.client.ts
i18n/locales/   en.json · fr.json · ru.json
public/         sequence/ (121 frames) · images · _headers
```

Content is typed TS + i18n JSON: `app/entities/fragrance/model/data.ts` for the
fragrance itself, `i18n/locales/*.json` for everything else. Every meaningful
literal is a named constant in a `model/constants.ts`.

### Regenerating the hero art

Source stills + the interpolation video live in `docs/content/` (the `.mp4` is
gitignored — keep it locally). Rebuild every `public/` asset:

```bash
node scripts/process-assets.mjs   # needs ffmpeg on PATH
```

If the frame count changes, update `FRAME_COUNT` in
`app/widgets/scrub-hero/model/constants.ts`.

## Deployment

Push to `main` → **Cloudflare** builds `nuxt generate` and deploys it as a
Worker with Static Assets. Non-`main` branches get a preview URL; the full
Playwright suite runs via GitHub Actions (`ci.yml`). Setup and the manual
`pnpm deploy` fallback: [**DEPLOY.md**](./DEPLOY.md).

## Not built (by design)

Real backend / commerce / payment · real e-mail capture · CMS · multi-fragrance
catalogue · per-fragrance routes · cart page · analytics.

<br>

---

<div align="center">

## 🇷🇺 Русский

**Скролл-лендинг вымышленного дома нишевой парфюмерии.**

[**Онлайн → sillage-encre.pages.dev**](https://sillage-encre.pages.dev) &nbsp;·&nbsp; [English](#sillage) &nbsp;|&nbsp; Русский

</div>

---

_Sillage_ (фр. «шлейф») — след, который аромат оставляет за собой. Сайт — одна
страница: герой на `<canvas>`, «проматываемый» скроллом (флакон поворачивается,
с него сходит дымка), затем пирамида композиции аромата, его история, сам
объект, ритуал, бутафорский флоу «покупки» и бутафорская рассылка.

Ничего настоящего — ни магазина, ни сбора почты. «В корзину» и «Подписаться» —
клиентский театр. Это портфолио-проект.

## Ключевое

- **Скролл-скраб герой** — секвенция из 121 WebP-кадра, рисуется на `<canvas>`,
  подгружается после монтирования, постер-кадр закрывает первую отрисовку (LCP
  без вспышки). Под `prefers-reduced-motion` и на узком вьюпорте — статичный
  вариант, весь текст уже в пререндер-HTML.
- **Инерционный скролл** — Lenis на тикере GSAP, все ScrollTrigger привязаны к
  сглаженной позиции. Отключается при `prefers-reduced-motion`.
- **Фоновые сцены** — крупные приглушённые фотографии всплывают за контентом,
  когда секция входит во вьюпорт, поочерёдно слева / справа, с параллаксом.
- **Сжимающийся хедер** — плавающая «пилюля» вверху разворачивается в
  полноширинную планку при скролле, с гистерезисом против мерцания.
- **Три локали** — EN на `/`, FR на `/fr/`, RU на `/ru/`
  (`prefix_except_default`), кастомный дропдаун языка, полные `hreflang` +
  canonical + локализованный sitemap.
- **SEO** — `<title>` / meta по локалям, Product JSON-LD, `@nuxtjs/sitemap` +
  `@nuxtjs/robots`.
- **Статика** — `nuxt generate`, все маршруты пререндерятся, серверного
  рантайма нет.

## Стек

Nuxt 4 (SSG) · Vue 3 · TypeScript (strict) · Tailwind v4 (CSS-first, без
конфига) · GSAP + ScrollTrigger + SplitText (ленивый импорт) · Lenis ·
`@nuxt/image` · `@nuxtjs/i18n` v10 · `@nuxtjs/sitemap` + `@nuxtjs/robots` ·
Playwright + `@axe-core/playwright` · Vitest · ESLint (только стрелочные
функции, именованные константы, импорты через `~`, слои FSD) + Prettier +
lefthook.

## Быстрый старт

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

| Задача              | Команда                                              |
| ------------------- | ---------------------------------------------------- |
| Дев-сервер          | `pnpm dev`                                           |
| Статическая сборка  | `pnpm generate`                                      |
| Предпросмотр сборки | `pnpm preview`                                       |
| Линт / фикс         | `pnpm lint` · `pnpm lint:fix`                        |
| Типы                | `pnpm typecheck`                                     |
| Юнит-тесты          | `pnpm test:unit`                                     |
| E2E (+ a11y)        | `pnpm test:e2e` (сборка и раздача на порту **3100**) |
| Деплой              | `pnpm deploy` — см. [DEPLOY.md](./DEPLOY.md)         |

## Архитектура — облегчённый FSD

Слои внутри `app/`, импорты только вниз (следит ESLint):

```
app/
  pages/        index.vue — единственная страница
  widgets/      scrub-hero · backdrop-scenes · composition · story · object
                ritual · acquire · newsletter · site-chrome
  entities/     fragrance — типизированный контент (ноты, объёмы, концепт)
  shared/       config · lib (композаблы) · ui (тупые компоненты)
  plugins/      lenis.client.ts
i18n/locales/   en.json · fr.json · ru.json
public/         sequence/ (121 кадр) · изображения · _headers
```

Контент — типизированный TS + i18n JSON: `app/entities/fragrance/model/data.ts`
для самого аромата, `i18n/locales/*.json` для остального. Каждый значимый
литерал — именованная константа в `model/constants.ts`.

### Перегенерация арта героя

Исходные кадры и видео-интерполяция лежат в `docs/content/` (`.mp4` в
`.gitignore` — держи локально). Пересобрать все ассеты `public/`:

```bash
node scripts/process-assets.mjs   # нужен ffmpeg в PATH
```

Если число кадров изменилось — поправь `FRAME_COUNT` в
`app/widgets/scrub-hero/model/constants.ts`.

## Деплой

Пуш в `main` → **Cloudflare** собирает `nuxt generate` и деплоит как Worker со
Static Assets. Не-`main` ветки получают preview-URL; полный прогон Playwright —
через GitHub Actions (`ci.yml`). Настройка и ручной `pnpm deploy`:
[**DEPLOY.md**](./DEPLOY.md).

## Намеренно не сделано

Настоящий бэкенд / магазин / оплата · реальный сбор почты · CMS · каталог из
нескольких ароматов · отдельные маршруты на аромат · страница корзины ·
аналитика.
