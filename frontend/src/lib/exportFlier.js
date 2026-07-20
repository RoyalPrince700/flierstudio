import { toJpeg, toPng } from 'html-to-image'

/** Default 3× — e.g. 1080×1350 → 3240×4050 */
export const HD_SCALES = {
  '2x': { id: '2x', label: '2× HD', scale: 2 },
  '3x': { id: '3x', label: '3× Ultra', scale: 3 },
  '4x': { id: '4x', label: '4× Print', scale: 4 },
}

export const DEFAULT_HD_SCALE = '3x'

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
    el.classList.remove('is-focused', 'studio-image-slot')
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
  } = options

  const exportWidth = Math.round(width * scale)
  const exportHeight = Math.round(height * scale)

  await waitForFontsAndImages(node)

  const { host, clone } = mountExportClone(node, width, height)

  try {
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

    if (format === 'jpg' || format === 'jpeg') {
      const dataUrl = await toJpeg(clone, {
        ...base,
        quality,
        backgroundColor: '#ffffff',
      })
      downloadDataUrl(dataUrl, `${filename}-${exportWidth}x${exportHeight}.jpg`)
      return { width: exportWidth, height: exportHeight, scale }
    }

    const dataUrl = await toPng(clone, base)
    downloadDataUrl(dataUrl, `${filename}-${exportWidth}x${exportHeight}.png`)
    return { width: exportWidth, height: exportHeight, scale }
  } finally {
    host.remove()
  }
}
