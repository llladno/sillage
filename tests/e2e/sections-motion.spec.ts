import { expect, test } from '@playwright/test'

test('the object slider advances horizontally on scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')

  const pin = page.locator('[data-slide-progress]')
  await expect(pin).toHaveCount(1)

  await pin.scrollIntoViewIfNeeded()
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(400)
  const start = Number(await pin.getAttribute('data-slide-progress'))

  await page.mouse.wheel(0, 1400)
  await page.waitForTimeout(400)
  const later = Number(await pin.getAttribute('data-slide-progress'))

  expect(later).toBeGreaterThan(start)
})

test('every craft panel is in the prerendered HTML', async ({ page }) => {
  await page.goto('/')
  for (const title of ['The glass', 'The cap', 'The fill', 'The batch']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  }
})

test('reduced motion stacks the object section, no pinned slider', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('[data-slide-progress]')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'The batch' })).toBeVisible()
})
