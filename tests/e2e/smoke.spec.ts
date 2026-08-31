import { expect, test } from '@playwright/test'

test('homepage renders with an h1 and the SILLAGE title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toContainText('SILLAGE')
  await expect(page).toHaveTitle(/SILLAGE/)
})
