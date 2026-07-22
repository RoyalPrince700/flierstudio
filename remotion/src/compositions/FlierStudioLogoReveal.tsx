import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { colors } from '../brand/tokens'
import { AnimatedTagline } from '../components/AnimatedTagline'
import { AnimatedWordmark } from '../components/AnimatedWordmark'
import { LiftoffMarkAnimated } from '../components/LiftoffMarkAnimated'
import { easeOutCubic } from '../lib/easings'

export type LogoRevealProps = {
  /** Show soft tagline under the wordmark during the hold. */
  showTagline?: boolean
}

/**
 * FlierStudioLogoReveal — cinematic Liftoff logo story.
 * Mark + wordmark + brand color only. No product UI.
 */
export const FlierStudioLogoReveal: React.FC<LogoRevealProps> = ({
  showTagline = true,
}) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  const shortSide = Math.min(width, height)
  const markSize = Math.round(shortSide * 0.3)
  const wordSize = Math.round(shortSide * 0.058)
  const tagSize = Math.round(shortSide * 0.024)
  const stackGap = Math.round(shortSide * 0.048)

  const voidGlow = interpolate(frame, [0, 22, 55], [0, 0.07, 0.025], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  })

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 52% 48% at 50% 45%, rgba(255,74,29,${voidGlow}) 0%, transparent 68%)`,
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <LiftoffMarkAnimated size={markSize} />
        <AnimatedWordmark fontSize={wordSize} gap={stackGap} />
        {showTagline ? (
          <AnimatedTagline fontSize={tagSize} gap={Math.round(stackGap * 0.55)} />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
