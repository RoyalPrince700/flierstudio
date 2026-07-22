import React from 'react'
import {
  DIAGONAL,
  MARK_CORNER_PATH,
  MARK_TILE_PATH,
  colors,
} from '../brand/tokens'

/** Brand tile on 96 grid: origin 12, size 72, corner radius 18. */
export const MARK_TILE = { x: 12, y: 12, size: 72, radius: 18 } as const

/**
 * Nested Signal corner (pre-lift) — brand rest MARK_CORNER_PATH minus (+6,−6).
 * Shares the tile’s top-right radius (Q84 12 84 30) and sits flush on the
 * 45° cut. Source: FSLogo.jsx / logo-mark.svg geometry notes.
 */
export const MARK_CORNER_NESTED_PATH =
  'M53 12 L66 12 Q84 12 84 30 L84 43 Z'

type Props = {
  size: number
  /** 0 = hidden, 1 = full fill tile (pre-cut) */
  fullTile: number
  /** 0–1 corner radius progress (0 = sharp 90°, 1 = brand r18) */
  radius?: number
  /** 0–1 sliced tile body */
  slicedTile: number
  /** 0–1 corner visibility */
  corner: number
  /** Peel offset in viewBox units along diagonal (0 = rest geometry) */
  peel: number
  /** 0 = nested flush fit, 1 = brand lifted rest path */
  cornerLift?: number
  /** Trail opacity */
  trail?: number
  trailLead?: number
  base?: string
  cornerColor?: string
  style?: React.CSSProperties
}

/** Static / progress-driven Liftoff mark for multi-act scenes. */
export const LiftoffMarkCraft: React.FC<Props> = ({
  size,
  fullTile,
  radius = 1,
  slicedTile,
  corner,
  peel,
  cornerLift = 1,
  trail = 0,
  trailLead = 5,
  base = colors.paper,
  cornerColor = colors.signal,
  style,
}) => {
  const cx = DIAGONAL.x * peel
  const cy = DIAGONAL.y * peel
  const tx = DIAGONAL.x * (peel + trailLead)
  const ty = DIAGONAL.y * (peel + trailLead)
  const rx = MARK_TILE.radius * Math.max(0, Math.min(1, radius))
  const lift = Math.max(0, Math.min(1, cornerLift))
  const useNested = lift < 0.98

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      style={{ overflow: 'visible', ...style }}
    >
      {fullTile > 0.01 ? (
        <rect
          x={MARK_TILE.x}
          y={MARK_TILE.y}
          width={MARK_TILE.size}
          height={MARK_TILE.size}
          rx={rx}
          ry={rx}
          fill={base}
          opacity={fullTile}
        />
      ) : null}
      {slicedTile > 0.01 ? (
        <path d={MARK_TILE_PATH} fill={base} opacity={slicedTile} />
      ) : null}
      {trail > 0.01 ? (
        <path
          d={MARK_CORNER_PATH}
          fill={cornerColor}
          opacity={trail}
          transform={`translate(${tx} ${ty})`}
        />
      ) : null}
      {corner > 0.01 ? (
        useNested ? (
          <>
            <path
              d={MARK_CORNER_NESTED_PATH}
              fill={cornerColor}
              opacity={corner * (1 - lift)}
            />
            <path
              d={MARK_CORNER_PATH}
              fill={cornerColor}
              opacity={corner * lift}
              transform={`translate(${cx} ${cy})`}
            />
          </>
        ) : (
          <path
            d={MARK_CORNER_PATH}
            fill={cornerColor}
            opacity={corner}
            transform={`translate(${cx} ${cy})`}
          />
        )
      ) : null}
    </svg>
  )
}
