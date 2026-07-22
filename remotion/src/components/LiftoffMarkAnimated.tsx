import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'
import {
  DIAGONAL,
  MARK_CORNER_PATH,
  MARK_FULL_TILE_PATH,
  MARK_TILE_PATH,
  colors,
} from '../brand/tokens'
import { easeInOutQuint, easeOutCubic, easeOutQuint } from '../lib/easings'
import { beats } from '../lib/timeline'

const VIEW = 96
/** Peel distance in viewBox units along the 45° axis (negative = tucked toward tile). */
const PEEL_START = -7
const PEEL_REST = 0
/** Brief trail lead ahead of the corner during liftoff. */
const TRAIL_LEAD = 6

type MarkProps = {
  size: number
}

/**
 * Animated Liftoff mark — empty frame → tile → Signal cut → peel → settle → idle.
 * Geometry matches FSLogo.jsx; motion follows brand diagonal rules (no bounce / spin).
 */
export const LiftoffMarkAnimated: React.FC<MarkProps> = ({ size }) => {
  const frame = useCurrentFrame()

  // --- Frame breathe ---
  const frameIn = interpolate(frame, beats.frame, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })
  const framePulse = interpolate(
    frame,
    [beats.frame[0], beats.frame[0] + 20, beats.tile[0]],
    [0.96, 1.015, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easeOutCubic,
    },
  )
  const frameOpacity = interpolate(frame, [beats.tile[0], beats.tile[0] + 18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  })

  // --- Tile land ---
  const tileT = interpolate(frame, beats.tile, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })
  const tileScale = interpolate(tileT, [0, 1], [0.86, 1])
  const tileOpacity = interpolate(tileT, [0, 0.28, 1], [0, 1, 1])

  // --- Signal slice ---
  const sliceT = interpolate(frame, beats.slice, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutQuint,
  })
  const sliceLen = 56.57
  const sliceDash = sliceLen * (1 - sliceT)
  const sliceOpacity = interpolate(
    frame,
    [beats.slice[0], beats.slice[0] + 6, beats.peel[0] + 12],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  )

  // --- Peel / liftoff (MARK_CORNER_PATH is already at rest; we approach 0) ---
  const peelT = interpolate(frame, beats.peel, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })
  const peelDistance = interpolate(peelT, [0, 1], [PEEL_START, PEEL_REST])
  const cornerOpacity = interpolate(peelT, [0, 0.1, 1], [0, 1, 1])
  const trailOpacity = interpolate(peelT, [0.05, 0.3, 0.88], [0, 0.26, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const trailDistance = peelDistance + TRAIL_LEAD * (1 - peelT)

  const showSliced = frame >= beats.peel[0]
  const fullTileFade = interpolate(frame, [beats.peel[0], beats.peel[0] + 10], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const slicedFade = interpolate(frame, [beats.peel[0], beats.peel[0] + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // --- Settle (tiny precision scale — no overshoot) ---
  const settleT = interpolate(frame, beats.settle, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  })
  const markSettle = interpolate(settleT, [0, 1], [1.012, 1])

  // --- Idle micro-drift (± ~1.1 viewBox units along diagonal) ---
  const idleActive = frame >= beats.hold[0]
  const idlePhase = idleActive ? ((frame - beats.hold[0]) / 96) * Math.PI * 2 : 0
  const idleDrift = idleActive ? Math.sin(idlePhase) * 1.1 : 0
  const finalPeel = (frame >= beats.peel[1] ? PEEL_REST : peelDistance) + idleDrift

  const cx = DIAGONAL.x * finalPeel
  const cy = DIAGONAL.y * finalPeel
  const tx = DIAGONAL.x * trailDistance
  const ty = DIAGONAL.y * trailDistance

  const showFrame = frame < beats.tile[0] + 22
  const charge = interpolate(frame, [6, 26, 72], [0, 0.05, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${frame >= beats.settle[0] ? markSettle : 1})`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        fill="none"
        style={{ overflow: 'visible' }}
      >
        <circle cx={48} cy={48} r={42} fill={colors.signal} opacity={charge} />

        {showFrame ? (
          <g
            opacity={frameIn * frameOpacity}
            transform={`translate(48 48) scale(${framePulse}) translate(-48 -48)`}
          >
            <rect
              x={24}
              y={24}
              width={48}
              height={48}
              rx={12}
              stroke={colors.paper}
              strokeWidth={1.4}
              strokeDasharray="4 4"
              opacity={0.55}
            />
          </g>
        ) : null}

        <g
          opacity={tileOpacity}
          transform={`translate(48 48) scale(${tileScale}) translate(-48 -48)`}
        >
          {!showSliced || fullTileFade > 0.01 ? (
            <path
              d={MARK_FULL_TILE_PATH}
              fill={colors.paper}
              opacity={showSliced ? fullTileFade : 1}
            />
          ) : null}

          {showSliced ? (
            <path d={MARK_TILE_PATH} fill={colors.paper} opacity={slicedFade} />
          ) : null}

          <line
            x1={48}
            y1={12}
            x2={84}
            y2={48}
            stroke={colors.signal}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeDasharray={sliceLen}
            strokeDashoffset={sliceDash}
            opacity={sliceOpacity}
          />

          {trailOpacity > 0.01 ? (
            <path
              d={MARK_CORNER_PATH}
              fill={colors.signal}
              opacity={trailOpacity}
              transform={`translate(${tx} ${ty})`}
            />
          ) : null}

          <path
            d={MARK_CORNER_PATH}
            fill={colors.signal}
            opacity={cornerOpacity}
            transform={`translate(${cx} ${cy})`}
          />
        </g>
      </svg>
    </div>
  )
}
