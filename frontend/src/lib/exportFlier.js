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
 * toward CAPTURE_CAP while it runs, then only jump to 100% after the file was
 * actually presented (download click, share sheet, or preview tab).
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
  sharing: { stage: 'downloading', progress: 0.95, label: 'Opening share sheet…' },
  preview: { stage: 'downloading', progress: 0.95, label: 'Opening image…' },
  done: { stage: 'done', progress: 1, label: 'Download ready' },
  doneShare: { stage: 'done', progress: 1, label: 'Share sheet open — Save Image' },
  donePreview: {
    stage: 'done',
    progress: 1,
    label: 'Long-press image → Add to Photos',
  },
}

/** Soft ceiling while html-to-image runs — never mark complete early. */
const CAPTURE_CREEP_CAP = 0.88

/** iPhone / iPad / iPod, including iPadOS desktop-class UA with touch. */
function isAppleTouchDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/.test(ua)) return true
  // iPadOS 13+ may report as MacIntel with touch
  if (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1) {
    return true
  }
  return false
}

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return res.blob()
}

function canShareImageFile(file) {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false
  }
  if (typeof navigator.canShare === 'function') {
    try {
      return navigator.canShare({ files: [file] })
    } catch {
      return false
    }
  }
  // Older iOS Safari: share exists but canShare may not — try files there.
  return isAppleTouchDevice()
}

/**
 * Desktop / Android: blob object URL + download attribute (more reliable than
 * giant data-URL hrefs). Revoke after the browser has a chance to start.
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 2_000)
  }
}

/**
 * After capture, user-gesture is usually gone — iOS needs a fresh tap for
 * Web Share / window.open. Show an in-page sheet with Share + long-press fallback.
 *
 * @returns {Promise<{ delivery: 'share' | 'preview', cancelled: boolean }>}
 */
function showIosSaveSheet(blob, filename, file, onProgress) {
  emitProgress(onProgress, {
    stage: 'downloading',
    progress: 0.95,
    label: 'Tap Save to Photos…',
  })

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(blob)
    const overlay = document.createElement('div')
    overlay.setAttribute('data-flier-ios-save', 'true')
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-label', 'Save exported flier')
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:2147483646',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:flex-end',
      'padding:max(16px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))',
      'box-sizing:border-box',
      'background:rgba(8,10,14,0.72)',
      '-webkit-backdrop-filter:blur(8px)',
      'backdrop-filter:blur(8px)',
      'font-family:system-ui,-apple-system,sans-serif',
      'color:#f4f4f5',
    ].join(';')

    const sheet = document.createElement('div')
    sheet.style.cssText = [
      'width:min(420px,100%)',
      'max-height:min(88vh,720px)',
      'overflow:auto',
      'background:#16181d',
      'border-radius:16px',
      'padding:16px',
      'box-shadow:0 16px 48px rgba(0,0,0,0.45)',
      'display:flex',
      'flex-direction:column',
      'gap:12px',
    ].join(';')

    const title = document.createElement('p')
    title.textContent = 'Save your flier'
    title.style.cssText = 'margin:0;font-size:17px;font-weight:650;letter-spacing:-0.01em'

    const hint = document.createElement('p')
    hint.textContent = canShareImageFile(file)
      ? 'Tap Save to Photos for the share sheet, then Save Image. Or long-press the preview → Add to Photos.'
      : 'Long-press the preview → Add to Photos (or Save to Files).'
    hint.style.cssText =
      'margin:0;font-size:13px;line-height:1.4;color:#a1a1aa'

    const img = document.createElement('img')
    img.src = objectUrl
    img.alt = 'Exported flier preview'
    img.style.cssText = [
      'width:100%',
      'height:auto',
      'max-height:52vh',
      'object-fit:contain',
      'border-radius:10px',
      'background:#0c0e12',
      'display:block',
      '-webkit-touch-callout:default',
      'user-select:none',
    ].join(';')

    const actions = document.createElement('div')
    actions.style.cssText = 'display:flex;flex-direction:column;gap:8px'

    const finish = (result) => {
      overlay.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
      resolve(result)
    }

    if (canShareImageFile(file)) {
      const shareBtn = document.createElement('button')
      shareBtn.type = 'button'
      shareBtn.textContent = 'Save to Photos'
      shareBtn.style.cssText = [
        'appearance:none',
        'border:0',
        'border-radius:12px',
        'padding:14px 16px',
        'font-size:16px',
        'font-weight:600',
        'background:#f4f4f5',
        'color:#111',
        'cursor:pointer',
      ].join(';')
      shareBtn.addEventListener('click', async () => {
        shareBtn.disabled = true
        emitProgress(onProgress, EXPORT_PROGRESS.sharing)
        try {
          await navigator.share({ files: [file], title: filename })
          emitProgress(onProgress, EXPORT_PROGRESS.doneShare)
          finish({ delivery: 'share', cancelled: false })
        } catch (err) {
          shareBtn.disabled = false
          if (err?.name === 'AbortError') {
            // User closed the sheet — keep overlay so they can try again or dismiss.
            emitProgress(onProgress, {
              stage: 'downloading',
              progress: 0.95,
              label: 'Share cancelled — tap Save again or Done',
            })
            return
          }
          emitProgress(onProgress, {
            stage: 'downloading',
            progress: 0.95,
            label: 'Share unavailable — long-press the image',
          })
        }
      })
      actions.appendChild(shareBtn)
    }

    const doneBtn = document.createElement('button')
    doneBtn.type = 'button'
    doneBtn.textContent = canShareImageFile(file) ? 'Done' : 'Got it'
    doneBtn.style.cssText = [
      'appearance:none',
      'border:0',
      'border-radius:12px',
      'padding:12px 16px',
      'font-size:15px',
      'font-weight:560',
      'background:#2a2d34',
      'color:#f4f4f5',
      'cursor:pointer',
    ].join(';')
    doneBtn.addEventListener('click', () => {
      // Preview was shown in-app — user can long-press; treat as presented.
      emitProgress(onProgress, EXPORT_PROGRESS.donePreview)
      finish({ delivery: 'preview', cancelled: false })
    })
    actions.appendChild(doneBtn)

    const cancelBtn = document.createElement('button')
    cancelBtn.type = 'button'
    cancelBtn.textContent = 'Cancel'
    cancelBtn.style.cssText = [
      'appearance:none',
      'border:0',
      'background:transparent',
      'padding:8px',
      'font-size:14px',
      'color:#a1a1aa',
      'cursor:pointer',
    ].join(';')
    cancelBtn.addEventListener('click', () => {
      finish({ delivery: 'preview', cancelled: true })
    })
    actions.appendChild(cancelBtn)

    sheet.append(title, hint, img, actions)
    overlay.appendChild(sheet)
    document.body.appendChild(overlay)
  })
}

/**
 * Present the captured image where the user can actually find it.
 * - iOS: in-page Save sheet → Web Share (fresh tap) or long-press preview
 * - Desktop/Android: blob + <a download>
 *
 * @returns {Promise<{ delivery: 'share' | 'download' | 'preview', cancelled: boolean }>}
 */
async function presentExportedImage(blob, filename, onProgress) {
  const mime = blob.type || 'application/octet-stream'
  const file = new File([blob], filename, { type: mime })

  if (isAppleTouchDevice()) {
    return showIosSaveSheet(blob, filename, file, onProgress)
  }

  emitProgress(onProgress, EXPORT_PROGRESS.downloading)
  downloadBlob(blob, filename)
  emitProgress(onProgress, EXPORT_PROGRESS.done)
  return { delivery: 'download', cancelled: false }
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
 * Note: 4× exports can OOM on older phones; prefer 2×/3× on iOS if capture fails.
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
 * @returns {Promise<{
 *   width: number,
 *   height: number,
 *   scale: number,
 *   delivery: 'share' | 'download' | 'preview' | null,
 *   cancelled: boolean,
 * }>}
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
    // Yield so UI can paint 90% before presentation
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const outName = `${filename}-${exportWidth}x${exportHeight}.${ext}`
    const blob = await dataUrlToBlob(dataUrl)
    // Drop the huge data URL string ASAP on memory-tight devices
    dataUrl = null

    const presented = await presentExportedImage(blob, outName, onProgress)

    return {
      width: exportWidth,
      height: exportHeight,
      scale,
      delivery: presented.cancelled ? null : presented.delivery,
      cancelled: presented.cancelled,
    }
  } finally {
    host.remove()
  }
}
