import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { spaceGrotesk } from '../brand/fonts'
import { brand, colors, type } from '../brand/tokens'
import { LiftoffMarkCraft } from '../components/LiftoffMarkCraft'
import { LiftoffSlice, sampleSlicePose } from '../components/transitions'
import { easeOutQuint } from '../lib/easings'
import type { Layout } from '../lib/format'
import { film } from '../lib/timeline'

type Props = { layout: Layout }

/**
 * Act 5 — Closing. Slice rejoins the mark; clean lockup + tagline; hold.
 */
export const Act5Closing: React.FC<Props> = ({ layout }) => {
  const frame = useCurrentFrame()
  const a = film.act5

  const actOpacity = interpolate(frame, [a.range[0], a.range[0] + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const lockupT = interpolate(frame, a.returnLockup, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })
  const tagT = interpolate(frame, a.tagline, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })

  const rejoin = interpolate(frame, a.sliceRejoin, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })

  // Traveling slice returns to rest on the mark, then fades as mark corner owns it
  const slicePose = sampleSlicePose(frame, [
    { frame: a.range[0], x: 0.72, y: 0.28, scale: 2.4, opacity: 0 },
    { frame: a.sliceRejoin[0], x: 0.62, y: 0.34, scale: 1.8, opacity: 1 },
    { frame: a.sliceRejoin[1] - 10, x: 0.52, y: 0.42, scale: 1, opacity: 1 },
    { frame: a.sliceRejoin[1], x: 0.52, y: 0.42, scale: 0.85, opacity: 0 },
  ])

  const markCorner = interpolate(rejoin, [0.55, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const idle =
    frame >= a.hold[0]
      ? Math.sin(((frame - a.hold[0]) / 72) * Math.PI * 2) * 0.85
      : 0

  const markSize = Math.round(layout.markSize * (layout.isReel ? 0.88 : 0.82))

  return (
    <AbsoluteFill style={{ opacity: actOpacity, backgroundColor: colors.ink }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 46% 38% at 50% 44%, rgba(255,74,29,${0.05 * lockupT}) 0%, transparent 68%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          opacity: lockupT,
          transform: `translateY(${(1 - lockupT) * 12}px)`,
        }}
      >
        <LiftoffMarkCraft
          size={markSize}
          fullTile={0}
          slicedTile={1}
          corner={markCorner}
          peel={idle}
        />
        <div
          style={{
            marginTop: layout.stackGap,
            fontFamily: spaceGrotesk,
            fontSize: layout.wordSize,
            fontWeight: 700,
            letterSpacing: type.trackingDisplay,
            color: colors.paper,
            whiteSpace: 'nowrap',
          }}
        >
          Flier<span style={{ fontWeight: 500 }}> Studio</span>
        </div>
        <div
          style={{
            marginTop: layout.stackGap * 0.5,
            fontFamily: spaceGrotesk,
            fontSize: layout.tagSize,
            fontWeight: 500,
            letterSpacing: type.trackingDisplay,
            color: colors.stone,
            opacity: tagT * 0.75,
            textAlign: 'center',
            maxWidth: layout.isReel ? layout.width * 0.78 : 620,
          }}
        >
          {brand.tagline}
        </div>
      </AbsoluteFill>

      <LiftoffSlice layout={layout} pose={slicePose} />
    </AbsoluteFill>
  )
}
