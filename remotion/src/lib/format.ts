import { REEL_HEIGHT, REEL_WIDTH, HEIGHT, WIDTH } from './timeline'

export type FilmFormat = 'cinematic' | 'reel'

export type Layout = {
  format: FilmFormat
  width: number
  height: number
  shortSide: number
  /** Safe content inset from edges */
  safe: number
  markSize: number
  wordSize: number
  tagSize: number
  stackGap: number
  /** Construction stage size (viewBox mapped) */
  stageSize: number
  mockScale: number
  cursorScale: number
  isReel: boolean
}

export const getLayout = (format: FilmFormat): Layout => {
  const isReel = format === 'reel'
  const width = isReel ? REEL_WIDTH : WIDTH
  const height = isReel ? REEL_HEIGHT : HEIGHT
  const shortSide = Math.min(width, height)
  const safe = isReel ? 72 : 96

  return {
    format,
    width,
    height,
    shortSide,
    safe,
    markSize: Math.round(shortSide * (isReel ? 0.38 : 0.26)),
    wordSize: Math.round(shortSide * (isReel ? 0.072 : 0.052)),
    tagSize: Math.round(shortSide * (isReel ? 0.028 : 0.022)),
    stackGap: Math.round(shortSide * (isReel ? 0.05 : 0.042)),
    stageSize: Math.round(shortSide * (isReel ? 0.62 : 0.42)),
    mockScale: isReel ? 0.92 : 0.78,
    cursorScale: isReel ? 1.15 : 1,
    isReel,
  }
}

/** Map normalized 0–1 stage coords into pixel space centered on canvas. */
export const stageToScreen = (
  nx: number,
  ny: number,
  layout: Layout,
  stagePx: number,
): { x: number; y: number } => {
  const left = (layout.width - stagePx) / 2
  const top = (layout.height - stagePx) / 2
  return {
    x: left + nx * stagePx,
    y: top + ny * stagePx,
  }
}

/**
 * Map a point on the centered Liftoff mark (96×96 viewBox) to normalized
 * composition coords (0–1). Used to land the cursor on exact craft geometry.
 */
export const markViewToNorm = (
  viewX: number,
  viewY: number,
  layout: Layout,
): { x: number; y: number } => {
  const mark = layout.markSize
  const left = (layout.width - mark) / 2
  const top = (layout.height - mark) / 2
  return {
    x: (left + (viewX / 96) * mark) / layout.width,
    y: (top + (viewY / 96) * mark) / layout.height,
  }
}
