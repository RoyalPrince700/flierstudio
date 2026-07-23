/**
 * Per-slot image crop inside a cover frame.
 * Stored on each artboard draft under nested `imageFits.<path>` (via setByPath).
 *
 * Model: img uses object-fit: cover at scale 1, then
 *   transform: translate(x%, y%) scale(s)  with origin center.
 * scale ≥ 1 (cannot shrink below cover); x/y are element-% offsets, clamped
 * so the frame never shows empty edges.
 */

export const DEFAULT_IMAGE_FIT = Object.freeze({ scale: 1, x: 0, y: 0 })
export const IMAGE_FIT_MAX_SCALE = 3
export const IMAGE_FIT_MIN_SCALE = 1

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

/** Max |x| / |y| (as fraction of element size) that keeps cover at this scale. */
export function maxPanForScale(scale) {
  const s = Math.max(IMAGE_FIT_MIN_SCALE, scale)
  return (s - 1) / (2 * s)
}

export function clampImageFit(fit = DEFAULT_IMAGE_FIT) {
  const scale = clamp(
    Number(fit?.scale) || IMAGE_FIT_MIN_SCALE,
    IMAGE_FIT_MIN_SCALE,
    IMAGE_FIT_MAX_SCALE,
  )
  const max = maxPanForScale(scale)
  return {
    scale,
    x: clamp(Number(fit?.x) || 0, -max, max),
    y: clamp(Number(fit?.y) || 0, -max, max),
  }
}

/** Read fit for an image path from draft.imageFits (nested via path segments). */
export function getImageFit(imageFits, path) {
  if (!imageFits || !path) return { ...DEFAULT_IMAGE_FIT }
  const keys = path.split('.')
  let cursor = imageFits
  for (const key of keys) {
    if (cursor == null || typeof cursor !== 'object') return { ...DEFAULT_IMAGE_FIT }
    const index = Number(key)
    cursor =
      Array.isArray(cursor) && !Number.isNaN(index) && String(index) === key
        ? cursor[index]
        : cursor[key]
  }
  if (!cursor || typeof cursor !== 'object') return { ...DEFAULT_IMAGE_FIT }
  if (cursor.scale == null && cursor.x == null && cursor.y == null) {
    return { ...DEFAULT_IMAGE_FIT }
  }
  return clampImageFit(cursor)
}

/** Inline style for an <img> inside an overflow:hidden frame. */
export function applyImageFitStyle(fit) {
  const { scale, x, y } = clampImageFit(fit)
  return {
    objectFit: 'cover',
    objectPosition: 'center',
    transform: `translate(${x * 100}%, ${y * 100}%) scale(${scale})`,
    transformOrigin: 'center center',
    width: '100%',
    height: '100%',
    willChange: scale !== 1 || x !== 0 || y !== 0 ? 'transform' : undefined,
  }
}

/** CSS custom properties for `.studio-image-slot` → descendant img rules. */
export function imageFitCssVars(fit) {
  const { scale, x, y } = clampImageFit(fit)
  return {
    '--fit-scale': String(scale),
    '--fit-x': `${x * 100}%`,
    '--fit-y': `${y * 100}%`,
  }
}

export function imageFitDraftPath(imagePath) {
  return `imageFits.${imagePath}`
}

export function zoomImageFit(fit, factor, anchorX = 0, anchorY = 0) {
  const current = clampImageFit(fit)
  const nextScale = clamp(
    current.scale * factor,
    IMAGE_FIT_MIN_SCALE,
    IMAGE_FIT_MAX_SCALE,
  )
  if (nextScale === current.scale) return current
  // Keep point under anchor stable-ish when zooming
  const t = nextScale / current.scale
  return clampImageFit({
    scale: nextScale,
    x: current.x * t + anchorX * (1 - t),
    y: current.y * t + anchorY * (1 - t),
  })
}

export function panImageFit(fit, dxFraction, dyFraction) {
  const current = clampImageFit(fit)
  return clampImageFit({
    scale: current.scale,
    x: current.x + dxFraction,
    y: current.y + dyFraction,
  })
}
