import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'
import { spaceGrotesk } from '../brand/fonts'
import { brand, colors, type } from '../brand/tokens'
import { easeOutCubic } from '../lib/easings'
import { beats } from '../lib/timeline'

type Props = {
  fontSize: number
  gap?: number
}

/** Soft tagline — logo-first; only elevates the hold, never upstages the mark. */
export const AnimatedTagline: React.FC<Props> = ({ fontSize, gap = 28 }) => {
  const frame = useCurrentFrame()

  const t = interpolate(frame, beats.tagline, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  })

  return (
    <div
      style={{
        marginTop: gap,
        opacity: t * 0.72,
        transform: `translateY(${(1 - t) * 8}px)`,
        fontFamily: spaceGrotesk,
        fontSize,
        fontWeight: 500,
        letterSpacing: type.trackingDisplay,
        lineHeight: 1.3,
        color: colors.stone,
        textAlign: 'center',
        maxWidth: 720,
      }}
    >
      {brand.tagline}
    </div>
  )
}
