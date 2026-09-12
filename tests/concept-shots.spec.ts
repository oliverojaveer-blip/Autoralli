import { test } from '@playwright/test'

/**
 * Pildistaja, mitte test. Mõlemad režiimid kolmes suuruses.
 *
 *   npm run shots:concept
 *
 * Pildid tekivad kausta screenshots/concept-<režiim>-<vaade>.png
 */

const VIEWS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]

const MODES = [
  { name: 'normal', url: '/concept' },
  { name: 'race', url: '/concept?mode=race' },
]

for (const mode of MODES) {
  for (const view of VIEWS) {
    test(`pildista kontseptsioon ${mode.name} ${view.name}`, async ({ page }) => {
      await page.setViewportSize({ width: view.width, height: view.height })
      await page.goto(mode.url)
      await page.evaluate(() => document.fonts.ready.then(() => {}))

      // Esimese ekraani pilt enne kerimist: see on see, mida külastaja näeb.
      await page.waitForTimeout(1600)
      await page.screenshot({
        path: `screenshots/concept-${mode.name}-${view.name}-fold.png`,
        fullPage: false,
      })

      // Ilmumisanimatsioonid on viewport-põhised, keri leht korra läbi.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 140))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(900)

      await page.screenshot({
        path: `screenshots/concept-${mode.name}-${view.name}.png`,
        fullPage: true,
      })
    })
  }
}
