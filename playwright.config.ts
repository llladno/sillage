import { defineConfig } from '@playwright/test'

// Dedicated port — the machine's other Nuxt project owns :3000.
const PORT = 3100

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  // Scroll-scrub / Lenis timing is inherently jittery on a loaded CI box.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  webServer: {
    command: 'pnpm generate && pnpm preview',
    port: PORT,
    env: { PORT: String(PORT), NITRO_PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  use: { baseURL: `http://localhost:${PORT}` },
})
