import { expect, test } from '@playwright/test'

test('invalid email shows inline error, no toast', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(/e.?mail/i).fill('foo')
  await page.getByRole('button', { name: /Join/i }).click()
  await expect(page.getByText('Enter a valid email address.')).toBeVisible()
  await expect(page.getByTestId('toasts')).not.toContainText('list')
})

test('valid email clears the field and toasts', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(/e.?mail/i).fill('reader@example.com')
  await page.getByRole('button', { name: /Join/i }).click()
  await expect(page.getByTestId('toasts')).toContainText('on the list')
  await expect(page.getByLabel(/e.?mail/i)).toHaveValue('')
})
