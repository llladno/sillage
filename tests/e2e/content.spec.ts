import { expect, test } from '@playwright/test'

test.use({ javaScriptEnabled: false })

test('all twelve notes are in the prerendered HTML', async ({ page }) => {
  await page.goto('/')
  for (const note of [
    'bergamot',
    'pink pepper',
    'cold-metal accord',
    'iris',
    'black tea',
    'damask rose',
    'vetiver',
    'ambrette',
    'papyrus',
    'incense',
  ]) {
    await expect(page.getByText(note, { exact: false }).first()).toBeVisible()
  }
})

test('concept line and wordmark are in static HTML', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('SILLAGE')
  await expect(
    page.getByText('The smell of a letter you never sent.').first(),
  ).toBeVisible()
})

test('story and ritual copy are in static HTML', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByText('cold-metal smell of a fountain pen', { exact: false }),
  ).toBeVisible()
  await expect(page.getByText('Two sprays on warm skin', { exact: false })).toBeVisible()
})
