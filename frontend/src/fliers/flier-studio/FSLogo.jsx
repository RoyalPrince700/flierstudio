import { fsTokens } from '../../design/flierStudioTokens'

/**
 * Flier Studio logo system — "The Liftoff".
 * A rounded artboard tile whose top-right corner peels away along a 45°
 * diagonal: the moment a flier is posted. The gap forms a send/growth
 * diagonal; the two-shape construction survives at favicon size.
 *
 * Geometry lives on a 96×96 grid:
 *  - tile: 72×72 rounded square (r18) at (12,12) with the corner sliced
 *    along the diagonal from (48,12) to (84,48)
 *  - corner: the sliced piece, inset 5 along the diagonal and lifted (+6,−6)
 */
export const MARK_TILE_PATH =
  'M48 12 L84 48 L84 66 Q84 84 66 84 L30 84 Q12 84 12 66 L12 30 Q12 12 30 12 Z'
export const MARK_CORNER_PATH = 'M59 6 L72 6 Q90 6 90 24 L90 37 Z'

const C = fsTokens.colors

export function LiftoffMark({
  size = 64,
  base = C.ink,
  corner = C.signal,
  className,
  style,
  title = 'Flier Studio',
}) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      role="img"
      aria-label={title}
    >
      <path d={MARK_TILE_PATH} fill={base} />
      <path d={MARK_CORNER_PATH} fill={corner} />
    </svg>
  )
}

export function Wordmark({
  size = 32,
  color = C.ink,
  accent,
  className,
  style,
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: fsTokens.fonts.display,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: fsTokens.type.trackingDisplay,
        lineHeight: 1,
        color,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      Flier<span style={{ color: accent || color, fontWeight: 500 }}> Studio</span>
    </span>
  )
}

export function LogoHorizontal({
  height = 48,
  base = C.ink,
  corner = C.signal,
  text = C.ink,
  className,
  style,
}) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: height * 0.3, ...style }}
    >
      <LiftoffMark size={height} base={base} corner={corner} />
      <Wordmark size={height * 0.52} color={text} />
    </span>
  )
}

export function LogoStacked({
  markSize = 96,
  base = C.ink,
  corner = C.signal,
  text = C.ink,
  className,
  style,
}) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: markSize * 0.24,
        ...style,
      }}
    >
      <LiftoffMark size={markSize} base={base} corner={corner} />
      <Wordmark size={markSize * 0.3} color={text} />
    </span>
  )
}

/** App icon / favicon tile: Signal ground, ink tile, paper corner. */
export function AppIconTile({ size = 96, radius, bg = C.signal, base = C.ink, corner = C.paper, className, style }) {
  const r = radius ?? size * 0.24
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      role="img"
      aria-label="Flier Studio app icon"
    >
      <rect width="96" height="96" rx={(r / size) * 96} fill={bg} />
      <g transform="translate(48 50) scale(0.72) translate(-48 -48)">
        <path d={MARK_TILE_PATH} fill={base} />
        <path d={MARK_CORNER_PATH} fill={corner} />
      </g>
    </svg>
  )
}
