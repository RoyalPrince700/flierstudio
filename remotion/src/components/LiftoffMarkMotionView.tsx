import React from 'react'
import {
  DIAGONAL,
  MARK_CORNER_PATH,
  MARK_FULL_TILE_PATH,
  MARK_TILE_PATH,
  colors,
} from '../brand/tokens'
import {
  computeLiftoffMarkMotion,
  SLICE_LEN,
  type LiftoffMarkBeats,
} from '../lib/liftoffMarkMotion'

const VIEW = 96

type Props = {
  size: number
  frame: number
  beats: LiftoffMarkBeats
  idleDrift?: boolean
}

/**
 * Renders Liftoff mark from `computeLiftoffMarkMotion` — same output as
 * LiftoffMarkAnimated, with explicit frame + beats for film scenes.
 */
export const LiftoffMarkMotionView: React.FC<Props> = ({
  size,
  frame,
  beats,
  idleDrift = false,
}) => {
  const m = computeLiftoffMarkMotion(frame, beats, { idleDrift })

  const cx = DIAGONAL.x * m.peelDistance
  const cy = DIAGONAL.y * m.peelDistance
  const tx = DIAGONAL.x * m.trailDistance
  const ty = DIAGONAL.y * m.trailDistance

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${m.markScale})`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        fill="none"
        style={{ overflow: 'visible' }}
      >
        <circle cx={48} cy={48} r={42} fill={colors.signal} opacity={m.charge} />

        {m.showFrame ? (
          <g
            opacity={m.frameIn * m.frameOpacity}
            transform={`translate(48 48) scale(${m.framePulse}) translate(-48 -48)`}
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
          opacity={m.tileOpacity}
          transform={`translate(48 48) scale(${m.tileScale}) translate(-48 -48)`}
        >
          {!m.showSliced || m.fullTileFade > 0.01 ? (
            <path
              d={MARK_FULL_TILE_PATH}
              fill={colors.paper}
              opacity={m.showSliced ? m.fullTileFade : 1}
            />
          ) : null}

          {m.showSliced ? (
            <path d={MARK_TILE_PATH} fill={colors.paper} opacity={m.slicedFade} />
          ) : null}

          <line
            x1={48}
            y1={12}
            x2={84}
            y2={48}
            stroke={colors.signal}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeDasharray={SLICE_LEN}
            strokeDashoffset={m.sliceDash}
            opacity={m.sliceOpacity}
          />

          {m.trailOpacity > 0.01 ? (
            <path
              d={MARK_CORNER_PATH}
              fill={colors.signal}
              opacity={m.trailOpacity}
              transform={`translate(${tx} ${ty})`}
            />
          ) : null}

          {m.cornerOpacity > 0.01 ? (
            <path
              d={MARK_CORNER_PATH}
              fill={colors.signal}
              opacity={m.cornerOpacity}
              transform={`translate(${cx} ${cy})`}
            />
          ) : null}
        </g>
      </svg>
    </div>
  )
}
