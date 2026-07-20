/** Capture CompassOnAir boards from the QA page at native size. */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'tmp', 'qa-compass')
const base = process.env.STUDIO_URL || 'http://localhost:5173'

mkdirSync(outDir, { recursive: true })

async function launch() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ headless: true, channel })
    } catch {
      /* try next channel */
    }
  }
  throw new Error('No system Chrome/Edge found')
}

const browser = await launch()
const page = await browser.newPage({ viewport: { width: 2400, height: 1500 } })

await page.goto(`${base}/qa-compass.html`, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForSelector('[data-shot]', { timeout: 20000 })
await page.waitForTimeout(600)

const shots = page.locator('[data-shot]')
const count = await shots.count()

for (let i = 0; i < count; i++) {
  const id = await shots.nth(i).getAttribute('data-shot')
  const file = join(outDir, `${id}.png`)
  await shots.nth(i).locator('article').screenshot({ path: file })
  console.log('Wrote', file)
}

await browser.close()
console.log('Done →', outDir)
