import { expect, test } from '@playwright/test'

test('scrolling the hero stage advances the scrubbed frame', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  const canvas = page.locator('canvas[data-frame]')
  await expect(canvas).toBeVisible()
  const startFrame = Number(await canvas.getAttribute('data-frame'))
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5))
  await page.waitForTimeout(300)
  const midFrame = Number(await canvas.getAttribute('data-frame'))
  expect(midFrame).toBeGreaterThan(startFrame)
})

test('late beat text appears only after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  const ctaBeat = page.locator('[data-beat="cta"]')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(200)
  await expect(ctaBeat).toHaveCSS('opacity', '0')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
  await expect(ctaBeat).not.toHaveCSS('opacity', '0')
})
