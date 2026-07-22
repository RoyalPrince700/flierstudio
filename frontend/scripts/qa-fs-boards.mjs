/**
 * Screenshot Flier Studio identity boards for visual QA.
 * Requires: npm run dev (port 5173) and a Chromium for playwright-core.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright-core')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../public/assets/flier-studio/qa')
const base = process.env.QA_BASE || 'http://localhost:5173'

const BOARDS = [
  '01-strategy',
  '02-logo-reveal',
  '07-primary-color',
  '10-typography',
  '14-motion',
  '16-web',
  '17-product',
  '21-overview',
]

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    'C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe',
  ].filter(Boolean)
  for (const p of candidates) {
    try {
      await fs.access(p)
      return p
    } catch {
      /* try next */
    }
  }
  return null
}

async function main() {
  const executablePath = await findChrome()
  if (!executablePath) {
    console.error('No Chrome/Edge found for playwright-core')
    process.exit(1)
  }

  await fs.mkdir(outDir, { recursive: true })
  const browser = await chromium.launch({ executablePath, headless: true })
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1600 },
    deviceScaleFactor: 1,
  })

  await page.goto(`${base}/qa-boards.html`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForSelector('[data-board="01-strategy"]', { timeout: 60000 })
  // fonts settle
  await page.waitForTimeout(800)

  for (const id of BOARDS) {
    const el = page.locator(`[data-board="${id}"]`)
    await el.scrollIntoViewIfNeeded()
    await el.screenshot({ path: path.join(outDir, `${id}.png`) })
    console.log('shot', id)
  }

  await browser.close()
  console.log('QA shots →', outDir)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
