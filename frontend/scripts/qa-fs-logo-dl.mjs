import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright-core')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(__dirname, '../public/assets/flier-studio/qa-logo-dl')
await fs.mkdir(out, { recursive: true })

const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: chrome, headless: true })
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 })
await page.goto('http://localhost:5173/qa-logo-downloads.html', { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForSelector('[data-board="logo-mark-on-signal"]', { timeout: 60000 })
await page.waitForTimeout(600)

const ids = [
  'logo-mark-on-signal',
  'logo-mark-on-ink',
  'logo-horizontal-on-paper',
  'logo-stacked-on-cobalt',
  'logo-wordmark-on-ink',
  'logo-app-icon-signal',
]
for (const id of ids) {
  const el = page.locator(`[data-board="${id}"]`)
  await el.scrollIntoViewIfNeeded()
  await el.screenshot({ path: path.join(out, `${id}.png`) })
  console.log('shot', id)
}
await browser.close()
