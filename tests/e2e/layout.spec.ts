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

test('the header pill unfolds into a full-bleed bar once scrolled', async ({ page }) => {
  await page.goto('/')
  const header = page.locator('header')

  const box = (property: string) =>
    header.evaluate(
      (node, prop) => getComputedStyle(node).getPropertyValue(prop),
      property,
    )

  // At the very top: a floating pill — inset, rounded, bordered all round.
  expect(await box('margin-left')).not.toBe('0px')
  expect(await box('border-top-width')).not.toBe('0px')

  await page.evaluate(() => window.scrollTo(0, 400))
  await page.waitForTimeout(600)

  // Stuck: flush to the edges, top square, bottom corners rounded, only the
  // bottom hairline left.
  expect(await box('margin-left')).toBe('0px')
  expect(await box('border-top-width')).toBe('0px')
  expect(await box('border-bottom-width')).not.toBe('0px')
  expect(await box('border-top-left-radius')).toBe('0px')
  expect(await box('border-bottom-left-radius')).not.toBe('0px')
})

test('a normal load pins scroll to the top', async ({ page }) => {
  await page.goto('/')
  // The client plugin sets this during hydration — poll rather than read once.
  await expect.poll(() => page.evaluate(() => history.scrollRestoration)).toBe('manual')
})

test('a #section deep link keeps native scroll restoration (not force-reset)', async ({
  page,
}) => {
  await page.goto('/#ritual')
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => history.scrollRestoration)).toBe('auto')
})

test('header nav anchors point at real sections', async ({ page }) => {
  await page.goto('/')
  for (const id of ['composition', 'story', 'object', 'ritual', 'acquire']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
})
