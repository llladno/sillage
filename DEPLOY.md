# Deploy — Cloudflare (Workers Static Assets)

The prerendered site (`nuxt generate` → `.output/public`) ships as a Cloudflare
**Worker with Static Assets** — no server code. Config: [`wrangler.jsonc`](./wrangler.jsonc).

## Setup (once) — connect the repo

Cloudflare dashboard → **Workers & Pages → Create → Import a repository** →
pick `llladno/sillage`. In _Set up your application_:

| Field                   | Value                                        |
| ----------------------- | -------------------------------------------- |
| Worker name             | `sillage-encre`                              |
| Production branch       | `main`                                       |
| Build command           | `pnpm generate`                              |
| Deploy command          | `npx wrangler deploy` _(default — leave it)_ |
| Non-production branches | `npx wrangler versions upload` _(default)_   |

Under **Build → Variables and Secrets** add a **build** variable:

| Name                   | Value                            |
| ---------------------- | -------------------------------- |
| `NUXT_PUBLIC_SITE_URL` | the site's final URL (see below) |

- The API token prompt ("a new token will be created automatically") — just
  allow it; Cloudflare wires the deploy token for you.
- `.node-version` pins Node 22. pnpm is detected from `pnpm-lock.yaml` +
  `packageManager`.

**Save and deploy.** Every push to `main` now builds and deploys; other
branches get a preview version URL.

### The site URL

A Worker is served at `https://sillage-encre.<your-subdomain>.workers.dev`.
After the first deploy, copy that URL into the `NUXT_PUBLIC_SITE_URL` build
variable and redeploy — it feeds `<link rel="canonical">`, `hreflang`, the
sitemap and the Product JSON-LD. Or add a **Custom Domain** (Worker → Settings
→ Domains & Routes) and point the variable at that instead.

## Manual deploy (fallback)

```bash
pnpm wrangler login   # one time
pnpm deploy           # nuxt generate → wrangler deploy
```

`pnpm deploy:preview` uploads a preview version (its own URL, not production).

## Caching

[`public/_headers`](./public/_headers) — honoured by Static Assets — pins a
one-year immutable cache on `/_nuxt/*`, `/_ipx/*` and the `/sequence/*` scroll
frames. HTML is left uncached so redeploys show up immediately.
`not_found_handling: "404-page"` in `wrangler.jsonc` serves the prerendered
`404.html` for unknown paths.
