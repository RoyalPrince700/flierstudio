import { toJpeg, toPng } from 'html-to-image'

/** Default 3× — e.g. 1080×1080 → 3240×3240 */
export const HD_SCALES = {
  '2x': { id: '2x', label: '2× HD', scale: 2 },
  '3x': { id: '3x', label: '3× Ultra', scale: 3 },
  '4x': { id: '4x', label: '4× Print', scale: 4 },
}

export const DEFAULT_HD_SCALE = '3x'

/**
 * Honest stage floors. Capture (html-to-image) has no byte progress — we creep
 * toward CAPTURE_CAP while it runs, then only jump to 100% after download fires.
 * Labels are user-facing (Flier Studio download), not engine jargon.
 */
export const EXPORT_PROGRESS = {
  started: { stage: 'started', progress: 0.04, label: 'Preparing your flier…' },
  assets: { stage: 'assets', progress: 0.12, label: 'Preparing your flier…' },
  clone: { stage: 'clone', progress: 0.22, label: 'Preparing your flier…' },
  cloneAssets: { stage: 'clone-assets', progress: 0.32, label: 'Preparing your flier…' },
  capturing: { stage: 'capturing', progress: 0.4, label: 'Downloading flier…' },
  encoded: { stage: 'encoded', progress: 0.9, label: 'Finishing download…' },
  downloading: { stage: 'downloading', progress: 0.95, label: 'Finishing download…' },
  done: { stage: 'done', progress: 1, label: 'Download ready' },
}

/** Soft ceiling while html-to-image runs — never mark complete early. */
const CAPTURE_CREEP_CAP = 0.88

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

async function waitForFontsAndImages(root) {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
      })
    }),
  )

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

/**
 * Clone the artboard off-screen at native 1:1 size so canvas zoom/pan
 * never softens the raster, then capture at HD scale.
 */
function mountExportClone(node, width, height) {
  const host = document.createElement('div')
  host.setAttribute('data-flier-export-host', 'true')
  host.style.cssText = [
    'position:fixed',
    'left:-100000px',
    'top:0',
    'width:' + width + 'px',
    'height:' + height + 'px',
    'opacity:1',
    'pointer-events:none',
    'z-index:-1',
    'overflow:hidden',
  ].join(';')

  const clone = node.cloneNode(true)
  clone.style.cssText = [
    'width:' + width + 'px',
    'height:' + height + 'px',
    'transform:none',
    'transform-origin:top left',
    'margin:0',
    'position:relative',
    'left:0',
    'top:0',
  ].join(';')

  // Strip studio-only edit chrome so it never appears in downloads
  clone.querySelectorAll('[data-studio-chrome]').forEach((el) => el.remove())
  clone.querySelectorAll('[contenteditable]').forEach((el) => {
    el.removeAttribute('contenteditable')
    el.classList.remove('is-focused', 'studio-editable')
  })
  clone.querySelectorAll('.studio-image-slot').forEach((el) => {
    el.classList.remove('is-focused', 'is-fitting', 'studio-image-slot')
  })

  // Soften export artifacts: backdrop-filter is poorly supported in foreignObject
  // and can muddy nearby text during html-to-image capture
  clone.querySelectorAll('*').forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    if (el.style.backdropFilter) el.style.backdropFilter = 'none'
    if (el.style.webkitBackdropFilter) el.style.webkitBackdropFilter = 'none'
  })
  const style = document.createElement('style')
  style.textContent =
    '[data-flier-export-host] * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }'
  clone.prepend(style)

  host.appendChild(clone)
  document.body.appendChild(host)
  return { host, clone }
}

function emitProgress(onProgress, info) {
  onProgress?.(info)
}

/**
 * While html-to-image has no byte progress, ease toward CAPTURE_CREEP_CAP.
 * Fast exports barely move; slow ones approach ~88% without finishing early.
 */
function startCaptureCreep(onProgress, from = EXPORT_PROGRESS.capturing.progress) {
  if (!onProgress) return () => {}
  const start = performance.now()
  const span = CAPTURE_CREEP_CAP - from
  // ~10s to near the soft ceiling; asymptote so we never hit 100% here
  const tauMs = 10_000

  const tick = () => {
    const t = (performance.now() - start) / tauMs
    const eased = 1 - Math.exp(-2.1 * Math.min(t, 2))
    const progress = Math.min(CAPTURE_CREEP_CAP - 0.005, from + span * eased)
    emitProgress(onProgress, {
      stage: 'capturing',
      progress,
      label: EXPORT_PROGRESS.capturing.label,
    })
  }

  tick()
  const id = window.setInterval(tick, 80)
  return () => window.clearInterval(id)
}

/**
 * Export a DOM node (the flier canvas) as a sharp HD PNG or JPG.
 *
 * @param {HTMLElement} node
 * @param {{
 *   format?: 'png' | 'jpg',
 *   filename?: string,
 *   quality?: number,
 *   width?: number,
 *   height?: number,
 *   scale?: number,
 *   onProgress?: (info: { stage: string, progress: number, label: string }) => void,
 * }} options
 */
export async function exportFlier(node, options = {}) {
  if (!node) throw new Error('Flier node is missing')

  const {
    format = 'png',
    filename = `flier-${Date.now()}`,
    quality = 1,
    width = node.offsetWidth || node.scrollWidth,
    height = node.offsetHeight || node.scrollHeight,
    scale = HD_SCALES[DEFAULT_HD_SCALE].scale,
    onProgress,
  } = options

  const exportWidth = Math.round(width * scale)
  const exportHeight = Math.round(height * scale)

  emitProgress(onProgress, EXPORT_PROGRESS.started)

  emitProgress(onProgress, EXPORT_PROGRESS.assets)
  await waitForFontsAndImages(node)

  emitProgress(onProgress, EXPORT_PROGRESS.clone)
  const { host, clone } = mountExportClone(node, width, height)

  try {
    emitProgress(onProgress, EXPORT_PROGRESS.cloneAssets)
    await waitForFontsAndImages(clone)

    const base = {
      cacheBust: true,
      pixelRatio: 1,
      width,
      height,
      canvasWidth: exportWidth,
      canvasHeight: exportHeight,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        width: `${width}px`,
        height: `${height}px`,
      },
    }

    emitProgress(onProgress, EXPORT_PROGRESS.capturing)
    const stopCreep = startCaptureCreep(onProgress)

    let dataUrl
    let ext
    try {
      if (format === 'jpg' || format === 'jpeg') {
        dataUrl = await toJpeg(clone, {
          ...base,
          quality,
          backgroundColor: '#ffffff',
        })
        ext = 'jpg'
      } else {
        dataUrl = await toPng(clone, base)
        ext = 'png'
      }
    } finally {
      stopCreep()
    }

    emitProgress(onProgress, EXPORT_PROGRESS.encoded)
    // Yield so UI can paint 90% before the download click
    await new Promise((resolve) => requestAnimationFrame(resolve))

    emitProgress(onProgress, EXPORT_PROGRESS.downloading)
    downloadDataUrl(dataUrl, `${filename}-${exportWidth}x${exportHeight}.${ext}`)

    emitProgress(onProgress, EXPORT_PROGRESS.done)
    return { width: exportWidth, height: exportHeight, scale }
  } finally {
    host.remove()
  }
}
