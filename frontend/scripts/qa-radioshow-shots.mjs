/**
 * Capture radioshow templates from dedicated QA page at native size.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'tmp', 'qa-radioshow')
const base = process.env.STUDIO_URL || 'http://localhost:5173'

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 3400, height: 1500 } })

await page.goto(`${base}/qa-radioshow.html`, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForSelector('article.rs', { timeout: 20000 })
await page.waitForTimeout(500)

const arts = page.locator('article.rs')
const count = await arts.count()
console.log(`Found ${count} artboards`)

for (let i = 0; i < count; i++) {
  const id = await arts.nth(i).evaluate((el) => {
    return [...el.classList].find((c) => c.startsWith('rs-') && c !== 'rs') || `t${i}`
  })
  const file = join(outDir, `${id}.png`)
  await arts.nth(i).screenshot({ path: file })
  console.log('Wrote', file)
}

await browser.close()
console.log('Done →', outDir)
