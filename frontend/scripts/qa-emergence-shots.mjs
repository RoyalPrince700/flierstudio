/**
 * Capture Emergence fliers at native 1080×1350 and check convener vs portraits.
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'tmp', 'qa-emergence')
const base = process.env.STUDIO_URL || 'http://localhost:5173'

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 2200, height: 1600 } })

await page.goto(base, { waitUntil: 'networkidle', timeout: 60000 })

const emergenceTab = page.locator('button, [role="tab"]').filter({ hasText: /Emergence/i }).first()
if (await emergenceTab.count()) {
  await emergenceTab.click()
  await page.waitForTimeout(500)
}

await page.waitForSelector('.e-flier', { timeout: 20000 })

const count = await page.locator('.e-flier').count()
console.log(`Found ${count} Emergence fliers`)

// Capture each flier alone at native size by cloning into a fixed host
const report = []
for (let i = 0; i < count; i++) {
  const info = await page.evaluate((index) => {
    const source = document.querySelectorAll('.e-flier')[index]
    if (!source) return null
    const id =
      [...source.classList].find((c) => c.startsWith('e-flier--'))?.replace('e-flier--', '') ||
      `item-${index}`

    document.getElementById('qa-export-host')?.remove()

    const host = document.createElement('div')
    host.id = 'qa-export-host'
    host.style.cssText =
      'position:fixed;left:0;top:0;width:1080px;height:1350px;z-index:99999;background:#061433;overflow:hidden;'
    const clone = source.cloneNode(true)
    clone.style.cssText = 'width:1080px;height:1350px;transform:none;margin:0;position:relative;'
    clone.querySelectorAll('[contenteditable]').forEach((el) => {
      el.removeAttribute('contenteditable')
      el.classList.remove('is-focused', 'studio-editable')
    })
    host.appendChild(clone)
    document.body.appendChild(host)

    function overlapArea(a, b) {
      const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
      const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
      return w * h
    }

    const convener = clone.querySelector('.e-convener')
    const slots = [...clone.querySelectorAll('.e-slot')]
    const c = convener?.getBoundingClientRect()
    const hits = c
      ? slots
          .map((el, slotIndex) => {
            const r = el.getBoundingClientRect()
            const area = overlapArea(c, r)
            return area > 4
              ? {
                  index: slotIndex,
                  area: Math.round(area),
                  name: el.querySelector('.e-slot__name')?.textContent?.trim() || '',
                }
              : null
          })
          .filter(Boolean)
      : []

    return {
      id,
      ok: hits.length === 0,
      overlappingSlots: hits.length,
      hits,
      convener: c
        ? {
            w: Math.round(c.width),
            h: Math.round(c.height),
            left: Math.round(c.left),
            top: Math.round(c.top),
            right: Math.round(c.right),
            bottom: Math.round(c.bottom),
          }
        : null,
    }
  }, i)

  if (!info) continue

  const path = join(outDir, `${info.id}-native.png`)
  await page.locator('#qa-export-host .e-flier').screenshot({ path, type: 'png' })
  console.log(`Wrote ${path}`)

  await page.evaluate(() => document.getElementById('qa-export-host')?.remove())
  report.push(info)
}
writeFileSync(join(outDir, 'overlap-report.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))

const failed = report.filter((r) => !r.ok)
if (failed.length) {
  console.error('QA FAIL: convener overlaps speaker/panelist slots')
  process.exitCode = 1
} else {
  console.log('QA PASS: no convener/slot overlaps')
}

await browser.close()
