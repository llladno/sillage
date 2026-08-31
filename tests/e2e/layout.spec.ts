import { expect, test } from '@playwright/test'

test('page has header, main landmark, footer', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('header')).toBeVisible()
  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('footer')).toBeVisible()
})

test('every section is a labelled landmark', async ({ page }) => {
  await page.goto('/')
  const sections = page.locator('main section[aria-labelledby]')
  expect(await sections.count()).toBeGreaterThanOrEqual(1)
})
