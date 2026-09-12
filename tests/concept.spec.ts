import { test, expect } from '@playwright/test'

test.describe('Kontseptsioon /concept', () => {
  test('tavavaade laadib ja hero on nähtav', async ({ page }) => {
    await page.goto('/concept')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Kruus, mets ja')
    await expect(page.getByTestId('live-ticker')).toHaveCount(0)
    await expect(page.locator('#jargmine')).toContainText('Saaremaa Ralli')
  })

  test('?mode=race avab Race Mode otse', async ({ page }) => {
    await page.goto('/concept?mode=race')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('KK8')
    await expect(page.getByTestId('live-ticker')).toBeVisible()
    await expect(page.getByTestId('top3')).toContainText('M. Tammiste')
    await expect(page.getByTestId('organizer-notice')).toBeVisible()
  })

  test('prototüübi lüliti vahetab režiimi ja uuendab URL-i', async ({ page }) => {
    await page.goto('/concept')
    const sw = page.getByTestId('mode-switch')

    await sw.getByRole('radio', { name: 'Race Mode' }).click()
    await expect(page).toHaveURL(/mode=race/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('KK8', { timeout: 5000 })
    await expect(page.getByTestId('live-ticker')).toBeVisible()

    await sw.getByRole('radio', { name: 'Tavavaade' }).click()
    await expect(page).not.toHaveURL(/mode=race/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Kruus', { timeout: 5000 })
    await expect(page.getByTestId('live-ticker')).toHaveCount(0)
  })

  test('navigatsioon vahetab prioriteeti koos režiimiga', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/concept')
    const nav = page.getByRole('navigation').first()
    await expect(nav.getByRole('link', { name: 'Kalender' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Vaata otse' })).toHaveCount(0)

    await page.getByTestId('mode-switch').getByRole('radio', { name: 'Race Mode' }).click()
    await expect(nav.getByRole('link', { name: 'Vaata otse' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Tulemused' })).toBeVisible()
  })

  test('tulemuste vahekaart vahetab arvestust', async ({ page }) => {
    await page.goto('/concept?mode=race')
    const section = page.locator('#tulemused')
    await section.scrollIntoViewIfNeeded()
    await expect(section.getByTestId('leaderboard-table')).toContainText('M. Tammiste')
    await section.getByRole('tab', { name: 'Junior Challenge' }).click()
    await expect(section.getByTestId('leaderboard-table')).toContainText('A. Kask')
    await expect(section.getByTestId('leaderboard-table')).not.toContainText('M. Tammiste')
  })

  test('telefonis on Race Mode staatus, katse ja liider kohe nähtavad', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/concept?mode=race')
    await expect(page.getByTestId('live-ticker')).toBeInViewport()
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport()
    await expect(page.getByTestId('top3').locator('li').first()).toBeInViewport()
    // Tabel on telefonis kaardivaade
    await expect(page.getByTestId('leaderboard-cards')).toBeAttached()
    await expect(page.getByTestId('leaderboard-table')).toBeHidden()
  })

  test('lehel ei ole mõttekriipse ega konsoolivigu', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    for (const url of ['/concept', '/concept?mode=race']) {
      await page.goto(url)
      await page.waitForLoadState('networkidle')
      const text = await page.locator('body').innerText()
      expect(text).not.toContain('—')
    }
    expect(errors).toEqual([])
  })
})
