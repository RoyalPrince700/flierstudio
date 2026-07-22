import React from 'react'
import { interpolate } from 'remotion'
import { colors } from '../brand/tokens'
import { easeOutCubic } from '../lib/easings'
import { MARK_TILE } from './LiftoffMarkCraft'

type Props = {
  frame: number
  /** Stage size — outer rulers / craft workspace */
  size: number
  /**
   * Mark pixel size the tile construction must register to.
   * Defaults to `size`. When smaller, tile guides are centered on stage.
   */
  markSize?: number
  /** 0–1 overall guides visibility */
  opacity: number
  /** Progress of tile plot 0–1 */
  tileProgress: number
  /** Progress of radius craft 0–1 */
  radiusProgress: number
  /** Progress of diagonal guide 0–1 */
  diagonalProgress: number
  /**
   * Construction outline (sharp square sides) opacity.
   * Fade to 0 after radius is applied.
   */
  outlineOpacity?: number
  showMeasurements?: boolean
}

/**
 * Editorial construction overlays — rulers, guides, radius arcs, diagonal cut.
 * Premium & sparse; not CAD clutter.
 * Tile geometry shares the brand 96-grid with LiftoffMarkCraft (12 / 72 / r18).
 */
export const ConstructionGuides: React.FC<Props> = ({
  frame,
  size,
  markSize,
  opacity,
  tileProgress,
  radiusProgress,
  diagonalProgress,
  outlineOpacity = 1,
  showMeasurements = true,
}) => {
  if (opacity < 0.01) return null

  const tickPulse = 0.55 + 0.15 * Math.sin(frame * 0.08)
  const rulerIn = easeOutCubic(Math.min(1, opacity * 1.4))

  // Register tile guides to the same pixel box as the mark SVG
  const tileBox = markSize ?? size
  const tileOrigin = (size - tileBox) / 2
  const pad = tileBox * (MARK_TILE.x / 96)
  const tile = tileBox * (MARK_TILE.size / 96)
  const r = tileBox * (MARK_TILE.radius / 96)

  const sideDraw = interpolate(tileProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 1, 1, 1])
  const topDraw = interpolate(tileProgress, [0, 0.2, 0.45], [0, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const rightDraw = interpolate(tileProgress, [0.2, 0.45, 0.7], [0, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const bottomDraw = interpolate(tileProgress, [0.45, 0.7, 0.9], [0, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const leftDraw = interpolate(tileProgress, [0.7, 0.9, 1], [0, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const lineOpacity = 0.85 * outlineOpacity
  const diagLen = (Math.SQRT2 * (tileBox * 40)) / 96
  const diagDash = diagLen * (1 - diagonalProgress)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: rulerIn,
        pointerEvents: 'none',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {/* Outer construction frame */}
        <rect
          x={size * 0.04}
          y={size * 0.04}
          width={size * 0.92}
          height={size * 0.92}
          fill="none"
          stroke={colors.stone}
          strokeWidth={1}
          strokeDasharray="3 5"
          opacity={0.35 * tickPulse}
        />

        {/* Horizontal + vertical center guides */}
        <line
          x1={size / 2}
          y1={size * 0.06}
          x2={size / 2}
          y2={size * 0.94}
          stroke={colors.stone}
          strokeWidth={1}
          opacity={0.28}
        />
        <line
          x1={size * 0.06}
          y1={size / 2}
          x2={size * 0.94}
          y2={size / 2}
          stroke={colors.stone}
          strokeWidth={1}
          opacity={0.28}
        />

        {/* Ruler ticks — top */}
        {Array.from({ length: 13 }).map((_, i) => {
          const x = size * (0.1 + i * 0.066)
          const major = i % 3 === 0
          return (
            <line
              key={`t${i}`}
              x1={x}
              y1={size * 0.02}
              x2={x}
              y2={size * (major ? 0.045 : 0.032)}
              stroke={colors.mist}
              strokeWidth={major ? 1.2 : 0.8}
              opacity={0.4 * sideDraw}
            />
          )
        })}
        {/* Ruler ticks — left */}
        {Array.from({ length: 13 }).map((_, i) => {
          const y = size * (0.1 + i * 0.066)
          const major = i % 3 === 0
          return (
            <line
              key={`l${i}`}
              x1={size * 0.02}
              y1={y}
              x2={size * (major ? 0.045 : 0.032)}
              y2={y}
              stroke={colors.mist}
              strokeWidth={major ? 1.2 : 0.8}
              opacity={0.4 * sideDraw}
            />
          )
        })}

        {/* Tile construction — registered to markSize */}
        <g transform={`translate(${tileOrigin + pad} ${tileOrigin + pad})`}>
          {/* Sharp square outline — fades after radius craft */}
          {outlineOpacity > 0.01 ? (
            <>
              <line
                x1={0}
                y1={0}
                x2={tile * topDraw}
                y2={0}
                stroke={colors.paper}
                strokeWidth={1.6}
                strokeLinecap="square"
                opacity={lineOpacity}
              />
              <line
                x1={tile}
                y1={0}
                x2={tile}
                y2={tile * rightDraw}
                stroke={colors.paper}
                strokeWidth={1.6}
                strokeLinecap="square"
                opacity={lineOpacity}
              />
              <line
                x1={tile}
                y1={tile}
                x2={tile - tile * bottomDraw}
                y2={tile}
                stroke={colors.paper}
                strokeWidth={1.6}
                strokeLinecap="square"
                opacity={lineOpacity}
              />
              <line
                x1={0}
                y1={tile}
                x2={0}
                y2={tile - tile * leftDraw}
                stroke={colors.paper}
                strokeWidth={1.6}
                strokeLinecap="square"
                opacity={lineOpacity}
              />
            </>
          ) : null}

          {/* Radius arcs at four corners of the tile */}
          {(
            [
              `M 0 ${r} A ${r} ${r} 0 0 1 ${r} 0`,
              `M ${tile - r} 0 A ${r} ${r} 0 0 1 ${tile} ${r}`,
              `M ${tile} ${tile - r} A ${r} ${r} 0 0 1 ${tile - r} ${tile}`,
              `M ${r} ${tile} A ${r} ${r} 0 0 1 0 ${tile - r}`,
            ] as const
          ).map((d, i) => {
            const local = interpolate(radiusProgress, [i * 0.18, i * 0.18 + 0.35], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
            const arcFade = interpolate(radiusProgress, [0.75, 1], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
            if (local < 0.01 || arcFade < 0.01) return null
            return (
              <path
                key={`r${i}`}
                d={d}
                fill="none"
                stroke={colors.signal}
                strokeWidth={1.8}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - local}
                opacity={0.8 * arcFade}
              />
            )
          })}

          {/* Diagonal cut guide — aligns with brand slice from (48,12)→(84,48) */}
          <line
            x1={tile * (36 / 72)}
            y1={0}
            x2={tile}
            y2={tile * (36 / 72)}
            stroke={colors.signal}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={diagLen}
            strokeDashoffset={diagDash}
            opacity={0.2 + diagonalProgress * 0.75}
          />

          {showMeasurements && diagonalProgress > 0.4 ? (
            <text
              x={tile * 0.72}
              y={tile * 0.22}
              fill={colors.signal}
              fontSize={tileBox * 0.035}
              fontFamily="Space Grotesk, sans-serif"
              opacity={interpolate(diagonalProgress, [0.4, 0.7], [0, 0.8], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}
            >
              45°
            </text>
          ) : null}
        </g>
      </svg>
    </div>
  )
}
