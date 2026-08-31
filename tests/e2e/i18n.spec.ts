import { expect, test } from '@playwright/test'

test('FR route renders French nav labels', async ({ page }) => {
  await page.goto('/fr/')
  await expect(page.locator('html')).toHaveAttribute('lang', /fr/)
  await expect(page.getByRole('link', { name: 'Histoire', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Acquérir', exact: true })).toBeVisible()
})

test('both routes expose hreflang alternates', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveCount(1)
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1)
})

test('canonical + html lang per locale', async ({ page }) => {
  await page.goto('/fr/')
  await expect(page.locator('html')).toHaveAttribute('lang', /fr/)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
})
