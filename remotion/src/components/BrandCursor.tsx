import React from 'react'
import { colors } from '../brand/tokens'
import type { CursorSample, CursorState } from '../lib/cursorPath'

type Props = {
  sample: CursorSample
  /** Pixel position (already converted from normalized) */
  x: number
  y: number
  scale?: number
}

/**
 * Brand cursor — lead performer for the logo film.
 * Dual-tone for readability on Ink / Paper / Signal.
 */
export const BrandCursor: React.FC<Props> = ({
  sample,
  x,
  y,
  scale = 1,
}) => {
  if (sample.opacity < 0.02) return null

  const press = sample.press
  const s = scale * (1 - press * 0.08)
  const tip = tipColor(sample.state)

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 28 * s,
        height: 36 * s,
        opacity: sample.opacity,
        transform: `translate(-2px, -2px) scale(${1 - press * 0.06})`,
        transformOrigin: 'top left',
        pointerEvents: 'none',
        zIndex: 100,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 28 36" fill="none">
        <path
          d="M4 2 L4 28 L10.5 22.5 L15 33.5 L18.2 32.1 L13.5 21.2 L22 21.2 Z"
          fill={colors.paper}
          stroke={colors.ink}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M4 2 L4 14 L12 12 Z"
          fill={tip}
          opacity={sample.state === 'draw' || sample.state === 'press' ? 1 : 0.85}
        />
        {(sample.state === 'draw' || sample.state === 'drag') && (
          <circle
            cx="6"
            cy="4"
            r="2.2"
            fill={colors.signal}
            opacity={0.9}
          />
        )}
      </svg>
    </div>
  )
}

function tipColor(state: CursorState): string {
  switch (state) {
    case 'draw':
    case 'drag':
    case 'press':
      return colors.signal
    case 'hover':
      return colors.signalDeep
    default:
      return colors.ink
  }
}
