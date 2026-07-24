/**
 * Capture standalone Pinterest rewires at native size for DESIGN_QA.
 * Usage: node scripts/qa-pinterest-rewire.mjs [filter]
 */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'tmp', 'qa-pinterest-rewire')
const base = process.env.STUDIO_URL || 'http://localhost:5173'
const only = process.argv[2]

mkdirSync(outDir, { recursive: true })

async function launch() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ headless: true, channel })
    } catch {
      /* try next */
    }
  }
  throw new Error('No system Chrome/Edge found')
}

const browser = await launch()
const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } })

await page.goto(`${base}/qa-pinterest-rewire.html`, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForSelector('[data-shot] article', { timeout: 20000 })
await page.evaluate(() => document.fonts.ready)

const ids = await page.$$eval('[data-shot]', (els) => els.map((el) => el.getAttribute('data-shot')))
console.log(`Found ${ids.length} boards`)

for (const id of ids) {
  if (only && !id.includes(only)) continue
  const path = join(outDir, `${id}-native.png`)
  const flier = page.locator(`[data-shot="${id}"] article`).first()
  await flier.screenshot({ path, type: 'png' })
  console.log(`Wrote ${path}`)
}

await browser.close()
console.log('Done')
