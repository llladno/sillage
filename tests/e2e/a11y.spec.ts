import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const path of ['/', '/fr/']) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    const serious = results.violations.filter((entry) =>
      ['serious', 'critical'].includes(entry.impact ?? ''),
    )
    expect(serious).toEqual([])
  })
}

test('product JSON-LD is present', async ({ page }) => {
  await page.goto('/')
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent()
  expect(jsonLd).toContain('"@type":"Product"')
  expect(jsonLd).toContain('SILLAGE 01')
})
