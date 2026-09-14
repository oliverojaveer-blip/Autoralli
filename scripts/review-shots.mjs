import { chromium } from '@playwright/test'
const out = process.argv[2] || '.impeccable/review'
const views = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'user-800', width: 800, height: 754 },
]
const browser = await chromium.launch()
for (const v of views) {
  const page = await browser.newPage({ viewport: { width: v.width, height: v.height } })
  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${out}/${v.name}.png`, fullPage: true })
  await page.screenshot({ path: `${out}/${v.name}-fold.png` })
  await page.close()
}
await browser.close()
console.log('ok')
