import { expect, test } from '@playwright/test'

test('selecting a size updates the price', async ({ page }) => {
  await page.goto('/')
  await page.locator('label', { hasText: '100 ml' }).click()
  await expect(page.getByTestId('price')).toHaveText('€260')
})

test('add to bag shows a toast and bumps the header count', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Add to bag' }).click()
  await expect(page.getByTestId('toasts')).toContainText('SILLAGE 01')
  await expect(page.getByTestId('bag-count')).toContainText('1')
})
