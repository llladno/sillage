import { expect, test } from '@playwright/test'

test('reduced motion renders the static fallback, no tall scrub stage', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  // No canvas — the cinematic branch never mounts.
  await expect(page.locator('canvas[data-frame]')).toHaveCount(0)

  // The hero is one viewport tall, not the 320vh scrub stage.
  const heroHeight = await page
    .locator('main > div > section')
    .first()
    .evaluate((node) => node.getBoundingClientRect().height)
  const viewport = page.viewportSize()
  expect(heroHeight).toBeLessThan((viewport?.height ?? 720) * 1.5)

  await expect(page.getByText('The trail a scent leaves behind.')).toBeVisible()
})
