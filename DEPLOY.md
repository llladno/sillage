# Deploy — Cloudflare Pages

Fully static build (`nuxt generate` → `.output/public`) served on Cloudflare
Pages, project **`sillage`** → `https://sillage.pages.dev`. Config in
[`wrangler.jsonc`](./wrangler.jsonc).

## CI/CD (default)

`.github/workflows/deploy.yml` deploys on every push to **`main`**:
`pnpm install → lint → typecheck → test:unit → nuxt generate →
wrangler pages deploy`. The full e2e suite runs separately in
`ci.yml` on pull requests.

### One-time GitHub setup

1. **Cloudflare API token** — [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   → _Create Token_ → template **"Edit Cloudflare Workers"** (or a custom token
   with **Account · Cloudflare Pages · Edit**).
2. **Account ID** — Cloudflare dashboard → _Workers & Pages_ → right sidebar.
3. Repo → _Settings → Secrets and variables → Actions_ → add secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. First run creates the Pages project `sillage` automatically. Nothing to
   click in the Cloudflare dashboard.

Trigger a deploy manually any time from the **Actions** tab → _Deploy_ →
_Run workflow_.

## Manual deploy (fallback)

```bash
pnpm wrangler login   # one time
pnpm deploy           # nuxt generate → wrangler pages deploy
```

`pnpm deploy:preview` ships to a throwaway preview URL instead of production.

## Custom domain

`NUXT_PUBLIC_SITE_URL` feeds canonical tags, hreflang, the sitemap and the
Product JSON-LD (default `https://sillage.pages.dev`, set in `nuxt.config.ts`).

1. Pages → project `sillage` → **Custom domains** → add it.
2. Set a repo **variable** `NUXT_PUBLIC_SITE_URL=https://your-domain`
   (_Settings → Secrets and variables → Actions → Variables_). The next push
   picks it up. For a manual deploy: `NUXT_PUBLIC_SITE_URL=https://your-domain pnpm deploy`.

## Caching

[`public/_headers`](./public/_headers) pins a one-year immutable cache on
`/_nuxt/*`, `/_ipx/*` and the `/sequence/*` scroll frames. HTML is left
uncached so redeploys show up immediately.
