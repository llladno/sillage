# Deploy — Cloudflare Pages

Fully static build (`nuxt generate` → `.output/public`) on Cloudflare Pages,
project **`sillage-encre`** → `https://sillage-encre.pages.dev`.

## Setup (once) — connect the repo

Cloudflare _Workers & Pages_ → **Create** → **Pages** → **Connect to Git** →
pick `llladno/sillage`, then:

| Field                  | Value            |
| ---------------------- | ---------------- |
| Project name           | `sillage-encre`  |
| Production branch      | `main`           |
| Framework preset       | `Nuxt.js`        |
| Build command          | `pnpm generate`  |
| Build output directory | `.output/public` |

**Environment variables** (Settings → Environment variables → Production):

| Name                   | Value                             |
| ---------------------- | --------------------------------- |
| `NUXT_PUBLIC_SITE_URL` | `https://sillage-encre.pages.dev` |

`.node-version` pins Node 22 for the build. pnpm is picked up from
`pnpm-lock.yaml` + the `packageManager` field.

After that, **every push to `main` builds and deploys automatically.** PRs get a
preview URL. The full Playwright suite runs in GitHub Actions (`ci.yml`) on PRs.

> If a project already exists under a different name, delete it first
> (_Settings → Delete project_) — Pages project names can't be renamed.

## Manual deploy (fallback)

If the dashboard build ever breaks:

```bash
pnpm wrangler login   # one time
pnpm deploy           # nuxt generate → wrangler pages deploy
```

`pnpm deploy:preview` ships to a throwaway preview URL.

## Custom domain

`NUXT_PUBLIC_SITE_URL` feeds canonical tags, `hreflang`, the sitemap and the
Product JSON-LD.

1. Pages → project → **Custom domains** → add it.
2. Change the `NUXT_PUBLIC_SITE_URL` production variable to
   `https://your-domain`, then redeploy (Deployments → Retry, or push).

## Caching

[`public/_headers`](./public/_headers) pins a one-year immutable cache on
`/_nuxt/*`, `/_ipx/*` and the `/sequence/*` scroll frames. HTML is left
uncached so redeploys show up immediately.
