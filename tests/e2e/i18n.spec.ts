import { expect, test } from '@playwright/test'

test('FR route renders French concept line', async ({ page }) => {
  await page.goto('/fr/')
  await expect(page.getByText('L’odeur d’une lettre jamais envoyée')).toBeVisible()
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
