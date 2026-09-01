import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const path of ['/', '/fr/', '/ru/']) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // Oversized tier words behind the notes: aria-hidden decoration that
      // repeats the visible TOP / HEART / BASE labels — pure decoration
      // under WCAG 1.4.3, exempt from contrast.
      .exclude('[data-backdrop]')
      .analyze()
    const serious = results.violations.filter((entry) =>
      ['serious', 'critical'].includes(entry.impact ?? ''),
    )
    expect(serious).toEqual([])
  })
}

test('product JSON-LD is present and enriched', async ({ page }) => {
  await page.goto('/')
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent()
  const data = JSON.parse(jsonLd ?? '{}')
  expect(data['@type']).toBe('Product')
  expect(data.name).toContain('SILLAGE 01')
  expect(data.category).toBe('Perfume')
  expect(data.image).toMatch(/\/og\/default\.png$/)
  expect(data.releaseDate).toBe('2026')
  expect(Array.isArray(data.offers)).toBe(true)
})

test('homepage title and meta description carry the category keyword', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/eau de parfum/i)
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute('content')
  expect(description).toMatch(/niche eau de parfum/i)
  expect((description ?? '').length).toBeLessThanOrEqual(160)
})
