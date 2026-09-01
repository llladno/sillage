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
  // Fake submit waits 500ms before the toast; background-tab timer throttling
  // in CI can stretch that, so give the assertion room.
  await expect(page.getByTestId('toasts')).toContainText('on the list', {
    timeout: 10000,
  })
  await expect(page.getByLabel(/e.?mail/i)).toHaveValue('')
})
