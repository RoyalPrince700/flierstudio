/**
 * Capture Emergence fliers at native 1080×1350 for DESIGN_QA.
 */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'tmp', 'qa-emergence')
const base = process.env.STUDIO_URL || 'http://localhost:5173'
const only = process.argv[2]

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
const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } })

await page.goto(`${base}/qa-emergence.html`, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForSelector('.e-flier', { timeout: 20000 })
await page.evaluate(() => document.fonts.ready)

const ids = await page.$$eval('[data-shot]', (els) => els.map((el) => el.getAttribute('data-shot')))
console.log(`Found ${ids.length} Emergence fliers`)

for (const id of ids) {
  if (only && !id.includes(only)) continue
  const path = join(outDir, `${id}-native.png`)
  const flier = page.locator(`[data-shot="${id}"] .e-flier`).first()
  await flier.screenshot({ path, type: 'png' })
  console.log(`Wrote ${path}`)
}

await browser.close()
console.log('Done')
