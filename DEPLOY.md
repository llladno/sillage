# Deploy — Cloudflare Pages

The site is a fully static build (`nuxt generate` → `.output/public`) served on
Cloudflare Pages. Config lives in [`wrangler.jsonc`](./wrangler.jsonc)
(project `sillage`, output `.output/public`).

## One-time setup

```bash
pnpm wrangler login
```

Opens the browser and authorises Wrangler against your Cloudflare account.
Nothing to click in the Cloudflare dashboard — the first deploy creates the
Pages project `sillage` automatically.

## Every deploy

```bash
pnpm deploy
```

Runs `nuxt generate` then `wrangler pages deploy`. Ships to production at
`https://sillage.pages.dev`.

Preview build (unique URL, not production):

```bash
pnpm deploy:preview
```

## Site URL

`NUXT_PUBLIC_SITE_URL` feeds canonical tags, hreflang, the sitemap and the
Product JSON-LD. It defaults to `https://sillage.pages.dev` (in
`nuxt.config.ts`). For a custom domain:

1. Pages → the `sillage` project → **Custom domains** → add it.
2. Deploy with the domain set:
   ```bash
   NUXT_PUBLIC_SITE_URL=https://your-domain pnpm deploy
   ```

## Caching

[`public/_headers`](./public/_headers) pins a one-year immutable cache on
`/_nuxt/*`, `/_ipx/*` and the `/sequence/*` scroll frames. HTML stays
uncached so redeploys are picked up immediately.
