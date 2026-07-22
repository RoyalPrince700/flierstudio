import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'
import { spaceGrotesk } from '../brand/fonts'
import { DIAGONAL, colors, type } from '../brand/tokens'
import { easeOutQuint } from '../lib/easings'
import { beats } from '../lib/timeline'

type Props = {
  fontSize: number
  gap?: number
}

/**
 * Wordmark resolves after the mark — “Flier” 700 + “ Studio” 500.
 * Enters along the 45° diagonal; never competes with the peel.
 */
export const AnimatedWordmark: React.FC<Props> = ({ fontSize, gap = 0 }) => {
  const frame = useCurrentFrame()

  const t = interpolate(frame, beats.wordmark, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })

  const opacity = t
  const travel = (1 - t) * 26
  const x = -DIAGONAL.x * travel
  const y = -DIAGONAL.y * travel

  const studioT = interpolate(frame, [beats.wordmark[0] + 8, beats.wordmark[1]], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })

  return (
    <div
      style={{
        marginTop: gap,
        opacity,
        transform: `translate(${x}px, ${y}px)`,
        fontFamily: spaceGrotesk,
        fontSize,
        fontWeight: 700,
        letterSpacing: type.trackingDisplay,
        lineHeight: 1,
        color: colors.paper,
        whiteSpace: 'nowrap',
        textAlign: 'center',
      }}
    >
      Flier
      <span style={{ fontWeight: 500, opacity: 0.35 + studioT * 0.65 }}> Studio</span>
    </div>
  )
}
