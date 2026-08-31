import { expect, test } from '@playwright/test'

test('reduced motion renders the static fallback, no tall stage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('canvas[data-frame]')).toHaveCount(0)
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
  expect(bodyHeight).toBeLessThan(3000)
  await expect(page.getByText('The trail a scent leaves behind.')).toBeVisible()
})
