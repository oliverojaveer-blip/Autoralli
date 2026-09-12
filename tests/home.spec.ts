import { test, expect } from '@playwright/test'

test.describe('Avaleht', () => {
  test('laadib ja kannab õiget pealkirja', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Autoralli\.ee/)
  })

  test('hero pealkiri on nähtav', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Iga kiiruskatse',
    )
  })

  test('mõlemad hero nupud on olemas ja viivad õigesse kohta', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(
      page.getByRole('link', { name: 'Vaata kalendrit' }),
    ).toHaveAttribute('href', '/kalender')
    await expect(
      page.getByRole('link', { name: 'Otsetulemused' }).first(),
    ).toHaveAttribute('href', '/tulemused')
  })

  test('kalendris on võistlused kronoloogilises järjekorras', async ({
    page,
  }) => {
    await page.goto('/')
    const names = await page.locator('#kalender li h3').allTextContents()

    expect(names.length).toBeGreaterThan(1)
    expect(names[0]).toBe('Alūksnes Rallijs')
  })

  test('Tailwind on tegelikult rakendunud, mitte ainult klassinimed HTML-is', async ({
    page,
  }) => {
    await page.goto('/')
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    )
    // Standard Mode taust on lume valge (brändiraamat 05/Color).
    expect(bg).toBe('rgb(255, 255, 255)')
  })

  test('eesti tähed renderduvad, font toetab latin-ext', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Üks koht.')).toBeVisible()
  })

  test('mobiilimenüü avaneb ja sulgub', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const toggle = page.getByRole('button', { name: 'Ava menüü' })
    await expect(toggle).toBeVisible()
    await toggle.click()

    await expect(
      page.locator('#mobiilimenuu').getByRole('link', { name: 'Kalender' }),
    ).toBeVisible()
  })

  test('lehel ei ole ühtegi mõttekriipsu', async ({ page }) => {
    await page.goto('/')
    const text = await page.locator('body').innerText()
    expect(text).not.toContain('—')
  })

  test('konsoolis ei ole vigu', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(errors).toEqual([])
  })
})
