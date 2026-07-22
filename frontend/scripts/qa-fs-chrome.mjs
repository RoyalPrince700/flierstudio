/** Quick screenshots of landing + login to verify brand harmonization. */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'tmp', 'qa-flier-studio')
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
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto(base, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1200)
await page.screenshot({ path: join(outDir, 'chrome-landing.png') })

await page.goto(`${base}/studio`, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1200)
await page.screenshot({ path: join(outDir, 'chrome-studio.png') })

await browser.close()
console.log('Done →', outDir)
