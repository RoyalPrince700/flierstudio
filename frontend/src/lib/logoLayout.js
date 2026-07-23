/**
 * Logo placement (uniform scale + optical nudge) — separate from photo imageFits.
 */
export const DEFAULT_LOGO_LAYOUT = Object.freeze({
  scale: 1,
  offsetX: 0,
  offsetY: 0,
})

export const LOGO_SCALE_MIN = 0.55
export const LOGO_SCALE_MAX = 1.75
export const LOGO_OFFSET_X_MIN = -40
export const LOGO_OFFSET_X_MAX = 40
export const LOGO_OFFSET_Y_MIN = -16
export const LOGO_OFFSET_Y_MAX = 16

/** Default Emergence header logo box before scale. */
export const LOGO_BASE_WIDTH = 280
export const LOGO_BASE_HEIGHT = 44

export const LOGO_SCALE_STEP = 1.12
export const LOGO_NUDGE_X = 6
export const LOGO_NUDGE_Y = 4

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export function clampLogoLayout(layout = {}) {
  return {
    scale: clamp(Number(layout.scale) || 1, LOGO_SCALE_MIN, LOGO_SCALE_MAX),
    offsetX: clamp(Number(layout.offsetX) || 0, LOGO_OFFSET_X_MIN, LOGO_OFFSET_X_MAX),
    offsetY: clamp(Number(layout.offsetY) || 0, LOGO_OFFSET_Y_MIN, LOGO_OFFSET_Y_MAX),
  }
}

export function scaleLogoLayout(layout, factor) {
  const cur = clampLogoLayout(layout)
  return clampLogoLayout({ ...cur, scale: cur.scale * factor })
}

export function nudgeLogoLayout(layout, dx = 0, dy = 0) {
  const cur = clampLogoLayout(layout)
  return clampLogoLayout({
    ...cur,
    offsetX: cur.offsetX + dx,
    offsetY: cur.offsetY + dy,
  })
}

/** CSS custom properties for `.e-header__logo`. */
export function logoLayoutCssVars(layout) {
  const { scale, offsetX, offsetY } = clampLogoLayout(layout)
  return {
    '--logo-scale': String(scale),
    '--logo-x': `${offsetX}px`,
    '--logo-y': `${offsetY}px`,
    '--logo-w': `${LOGO_BASE_WIDTH * scale}px`,
    '--logo-h': `${LOGO_BASE_HEIGHT * scale}px`,
  }
}

export function isLogoImagePath(path) {
  return Boolean(
    path &&
      (path === 'logoSrc' ||
        path === 'event.logoSrc' ||
        path.endsWith('.logoSrc')),
  )
}

export function isBrandFieldPath(path) {
  return Boolean(
    path &&
      (isLogoImagePath(path) ||
        path === 'event.wordmark' ||
        path === 'event.logoMode' ||
        path === 'wordmark'),
  )
}

