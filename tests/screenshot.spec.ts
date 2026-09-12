import { test } from '@playwright/test'

/**
 * See ei ole test vaid pildistaja.
 *
 *   npx playwright test tests/screenshot.spec.ts --project=chromium
 *
 * Pildid tekivad kausta screenshots/. Saada need Claude'ile, siis ta näeb
 * täpselt sama pilti mis sina ja saab disaini kohta midagi sisulist öelda.
 */

const VIEWS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

for (const view of VIEWS) {
  test(`pildista avaleht ${view.name}`, async ({ page }) => {
    await page.setViewportSize({ width: view.width, height: view.height })
    await page.goto('/')

    // Fondid peavad olema laetud, muidu pildistame Times New Romani.
    await page.evaluate(() => document.fonts.ready.then(() => {}))

    // Reveal animatsioonid on viewport-põhised, keri leht korra läbi.
    await page.evaluate(async () => {
      const step = window.innerHeight
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 250))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(600)

    await page.screenshot({
      path: `screenshots/avaleht-${view.name}.png`,
      fullPage: true,
    })
  })
}
