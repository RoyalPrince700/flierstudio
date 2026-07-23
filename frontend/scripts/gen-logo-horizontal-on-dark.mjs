/**
 * One-shot: render Flier Studio horizontal lockup (on-dark) to a
 * transparent PNG under public/assets/flier-studio/. Does not touch
 * identity boards or brand tokens.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright-core')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../public/assets/flier-studio')
const outPng = path.join(outDir, 'logo-horizontal-on-dark.png')

const MARK_TILE =
  'M48 12 L84 48 L84 66 Q84 84 66 84 L30 84 Q12 84 12 66 L12 30 Q12 12 30 12 Z'
const MARK_CORNER = 'M59 6 L72 6 Q90 6 90 24 L90 37 Z'

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
  <style>
    html, body { margin: 0; background: transparent; }
    #lockup {
      display: inline-flex;
      align-items: center;
      gap: 28px;
      padding: 12px 16px;
      box-sizing: border-box;
    }
    .wm {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 50px;
      font-weight: 700;
      letter-spacing: -1.5px;
      line-height: 1;
      color: #FFFFFF;
      white-space: nowrap;
    }
    .wm span { font-weight: 500; }
  </style>
</head>
<body>
  <div id="lockup">
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="${MARK_TILE}" fill="#FFFFFF"/>
      <path d="${MARK_CORNER}" fill="#FF4A1D"/>
    </svg>
    <div class="wm">Flier<span> Studio</span></div>
  </div>
</body>
</html>`

const chrome =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

await fs.mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ executablePath: chrome, headless: true })
const page = await browser.newPage({
  viewport: { width: 640, height: 200 },
  deviceScaleFactor: 2,
})
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(async () => {
  await document.fonts.ready
})
await page.waitForTimeout(400)
const el = page.locator('#lockup')
await el.screenshot({ path: outPng, omitBackground: true })
await browser.close()
console.log('wrote', outPng)
