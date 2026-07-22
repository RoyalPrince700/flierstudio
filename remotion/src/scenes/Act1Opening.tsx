import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { spaceGrotesk } from '../brand/fonts'
import { colors, type } from '../brand/tokens'
import { LiftoffMarkMotionView } from '../components/LiftoffMarkMotionView'
import { easeOutCubic, easeOutQuint } from '../lib/easings'
import type { Layout } from '../lib/format'
import { film } from '../lib/timeline'

type Props = { layout: Layout }

/**
 * Act 1 — Opening (~6.7s).
 * Scene 1 (~3s): reveal-parity liftoff; single cursor click triggers peel.
 * Scene 2 (~3.7s): same mark slides left; wordmark resolves beside it.
 */
export const Act1Opening: React.FC<Props> = ({ layout }) => {
  const frame = useCurrentFrame()
  const a = film.act1
  const s1 = a.scene1
  const s2 = a.scene2
  const markSize = layout.markSize

  const actOpacity = interpolate(
    frame,
    [a.range[0], 10, a.range[1] - 18, a.range[1]],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const voidGlow = interpolate(frame, [0, 22, s1.range[1]], [0, 0.07, 0.025], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  })

  /** Lock motion at rest pose — same mark, no swap. */
  const motionFrame = Math.min(frame, s1.mark.settle[1])

  const lockupT = interpolate(frame, s2.markShift, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })

  const flierT = interpolate(frame, s2.wordmark, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })
  const studioT = interpolate(frame, [s2.wordmark[0] + 24, s2.wordmark[1]], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })

  const markX = interpolate(lockupT, [0, 1], [0, layout.isReel ? 0 : -72])
  const markY = interpolate(lockupT, [0, 1], [0, layout.isReel ? -36 : 0])
  const wordX = interpolate(lockupT, [0, 1], [layout.isReel ? 0 : 76, 0])
  const wordY = interpolate(lockupT, [0, 1], [layout.isReel ? 44 : 0, 0])
  const gap = layout.stackGap * (0.4 + lockupT * 0.45)

  return (
    <AbsoluteFill style={{ opacity: actOpacity, backgroundColor: colors.ink }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 52% 48% at 50% 45%, rgba(255,74,29,${voidGlow}) 0%, transparent 68%)`,
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: layout.isReel ? 'column' : 'row',
            alignItems: 'center',
            gap: layout.isReel ? gap : 16 + gap * 0.35,
          }}
        >
          <div
            style={{
              transform: `translate(${markX}px, ${markY}px)`,
            }}
          >
            <LiftoffMarkMotionView
              size={markSize}
              frame={motionFrame}
              beats={s1.mark}
              idleDrift={false}
            />
          </div>

          <div
            style={{
              transform: `translate(${wordX}px, ${wordY}px)`,
              opacity: flierT,
              maxWidth: flierT > 0.01 ? 640 : 0,
              overflow: 'hidden',
              fontFamily: spaceGrotesk,
              fontSize: layout.wordSize,
              fontWeight: 700,
              letterSpacing: type.trackingDisplay,
              color: colors.paper,
              whiteSpace: 'nowrap',
              lineHeight: 1,
            }}
          >
            Flier
            <span style={{ fontWeight: 500, opacity: 0.35 + studioT * 0.65 }}>
              {' '}
              Studio
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
