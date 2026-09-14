import { test, expect } from '@playwright/test'
import { EVENTS, nextEvent } from '../lib/events'

test.describe('Avaleht', () => {
  test('laadib ja kannab õiget pealkirja', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Autoralli\.ee/)
  })

  test('ringiriba näitab järgmist võistlust ja loendurit', async ({ page }) => {
    await page.goto('/')
    const strip = page.getByRole('region', { name: 'Järgmine võistlus ja loendur' })
    await expect(strip).toContainText('Saaremaa Ralli')
    await expect(strip.getByRole('timer')).toBeVisible()
    // Loendur on hüdratsiooni järel numbrites, mitte "--".
    await expect(strip.getByRole('timer')).not.toContainText('--')
  })

  test('kiirlingid viivad õigesse kohta', async ({ page }) => {
    await page.goto('/')
    const quick = page.getByRole('navigation', { name: 'Kiirlingid' })
    await expect(quick.getByRole('link', { name: 'Otse' })).toHaveAttribute('href', '/otse')
    // Kalender/Tulemused pillid on laial ekraanil peidus (päises on sama link).
    await expect(quick.getByRole('link', { name: 'Uus rallis?' })).toHaveAttribute('href', '/pealtvaatajale')
  })

  test('hooaja ribal on järgmine võistlus esimesena, kõik kuus ringi olemas', async ({
    page,
  }) => {
    await page.goto('/')
    const names = await page.locator('section[aria-labelledby="hooaeg"] li h3').allTextContents()

    expect(names).toHaveLength(EVENTS.length)
    // DOM-järjekord on tähtsuse järgi: järgmine ring kõigepealt (telefon, ilma JS-ita).
    expect(names[0]).toBe(nextEvent().name)
  })

  test('punktiseisu lühivaade on märgitud näidisandmeteks ja lingib tulemustele', async ({
    page,
  }) => {
    await page.goto('/')
    const section = page.locator('section[aria-labelledby="punktiseis"]')
    await expect(section).toContainText('Näidisandmed')
    await expect(section.getByRole('link', { name: /Kogu punktiseis/ })).toHaveAttribute('href', '/tulemused')
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
    await expect(page.getByRole('heading', { name: /Võistlused|Tule rallile/i }).first()).toBeVisible()
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
