/**
 * Default logo for editable flier logo slots (Emergence header, etc.).
 * Points at a dedicated public asset — does not touch identity tokens/boards.
 */
export const DEFAULT_BRAND_LOGO_SRC =
  '/assets/flier-studio/logo-horizontal-on-dark.png'

export const LOGO_MODES = Object.freeze(['image', 'text', 'none'])

/** Normalize draft logo mode; unknown values → image. */
export function normalizeLogoMode(mode) {
  return LOGO_MODES.includes(mode) ? mode : 'image'
}

/**
 * Resolve image src only in image mode.
 * Empty/cleared values stay empty — do not force the Flier Studio default.
 */
export function resolveBrandLogoSrc(src, logoMode = 'image') {
  if (normalizeLogoMode(logoMode) !== 'image') return ''
  return typeof src === 'string' && src.trim() ? src : ''
}
