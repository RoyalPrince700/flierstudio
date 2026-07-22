/**
 * Flier Studio brand tokens — ported from frontend/src/design/flierStudioTokens.js
 * for the Remotion motion pipeline. Keep in sync with the product identity.
 */
export const colors = {
  signal: '#FF4A1D',
  signalDeep: '#C93007',
  cobalt: '#2545D9',
  ink: '#141310',
  paper: '#F5F1E8',
  graphite: '#26241F',
  slate: '#4B473F',
  stone: '#8F8A7E',
  mist: '#E4DED2',
  white: '#FFFFFF',
} as const

export const brand = {
  name: 'Flier Studio',
  tagline: 'Start with a template. Make it yours.',
  url: 'flierstudio.design',
} as const

export const type = {
  trackingDisplay: '-0.03em',
  trackingCaps: '0.22em',
} as const

/**
 * Approved Liftoff geometry on a 96×96 grid.
 * Source: frontend/src/fliers/flier-studio/FSLogo.jsx + public/assets/flier-studio/logo-mark.svg
 *
 * Tile: 72×72 rounded square (r18) at (12,12), sliced on diagonal (48,12)→(84,48).
 * Corner: MARK_CORNER_PATH at rest (lifted +6,−6); nested flush is rest − (+6,−6).
 */
export const MARK_TILE_PATH =
  'M48 12 L84 48 L84 66 Q84 84 66 84 L30 84 Q12 84 12 66 L12 30 Q12 12 30 12 Z'

export const MARK_CORNER_PATH = 'M59 6 L72 6 Q90 6 90 24 L90 37 Z'

/** Intact tile before the peel (full rounded square on the 96 grid). */
export const MARK_FULL_TILE_PATH =
  'M30 12 L66 12 Q84 12 84 30 L84 66 Q84 84 66 84 L30 84 Q12 84 12 66 L12 30 Q12 12 30 12 Z'

/** Unit vector along the 45° liftoff axis (up-right). */
export const DIAGONAL = { x: Math.SQRT1_2, y: -Math.SQRT1_2 } as const
