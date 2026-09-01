# Deploy — Cloudflare (Workers Static Assets)

The prerendered site (`nuxt generate` → `.output/public`) ships as a Cloudflare
**Worker with Static Assets** — no server code. Live at
`https://sillage.mansurov.workers.dev`. Config: [`wrangler.jsonc`](./wrangler.jsonc).

## Setup (once) — connect the repo

Cloudflare dashboard → **Workers & Pages → Create → Import a repository** →
pick `llladno/sillage`.

- **Worker name** — auto-derived from the repo (`sillage`), shown at the top,
  not an editable field. `wrangler.jsonc`'s `name` matches it.
- **Build command** — `pnpm generate` (this is the only field you must set).
- **Deploy command** — leave the default `npx wrangler deploy`
  (`npx wrangler versions upload` for non-production branches).
- The API-token prompt ("a new token will be created automatically") — allow it.
- `.node-version` pins Node 22; pnpm is picked up from `pnpm-lock.yaml` +
  `packageManager`.

**Save and deploy.** First build ~2–3 min. Every push to `main` builds and
deploys after that; other branches get a preview version URL.

### The site URL

The Worker is served at `https://sillage.mansurov.workers.dev`, which is the
default in `nuxt.config.ts`. To move to a custom domain: Worker →
**Settings → Domains & Routes** → add it, then set a **build** variable
(**Settings → Build → Variables and Secrets**):

| Name                   | Value                 |
| ---------------------- | --------------------- |
| `NUXT_PUBLIC_SITE_URL` | `https://your-domain` |

and redeploy — it feeds `<link rel="canonical">`, `hreflang`, the sitemap and
the Product JSON-LD (otherwise they use the default in
`nuxt.config.ts`). A custom domain: Worker → **Settings → Domains & Routes**.

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
