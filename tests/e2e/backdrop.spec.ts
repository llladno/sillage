import { expect, test } from '@playwright/test'

test('backdrop scenes are decorative and one per section', async ({ page }) => {
  await page.goto('/')
  const scenes = page.locator('[data-backdrop-scene]')
  await expect(scenes).toHaveCount(6)
  await expect(scenes.first()).toHaveAttribute('aria-hidden', 'true')
})

test('a scene surfaces as its section reaches the viewport centre', async ({ page }) => {
  await page.goto('/')

  const firstScene = page.locator('[data-backdrop-scene]').first()
  const opacityNow = () =>
    firstScene.evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity))

  expect(await opacityNow()).toBeLessThan(0.05)

  await page.locator('#composition').scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  expect(await opacityNow()).toBeGreaterThan(0)
})

test('reduced motion keeps the scenes but drops the parallax', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await page.locator('#composition').scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)

  const transform = await page
    .locator('[data-backdrop-scene]')
    .first()
    .evaluate((node) => getComputedStyle(node).transform)

  // translate3d(0, 0, 0) collapses to 'none' or an identity matrix
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform)
})
