import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { spaceGrotesk } from '../brand/fonts'
import { colors, type } from '../brand/tokens'
import { LiftoffMarkCraft } from '../components/LiftoffMarkCraft'
import { easeInOutCubic } from '../lib/easings'
import type { Layout } from '../lib/format'
import { film } from '../lib/timeline'

type Props = { layout: Layout }
type MockId = 'studio' | 'landing' | 'phone' | 'icon'

/** Act 4 — Applications (~4 mockups, tight scroll). */
export const Act4Mockups: React.FC<Props> = ({ layout }) => {
  const frame = useCurrentFrame()
  const a = film.act4

  const actOpacity = interpolate(
    frame,
    [a.range[0], a.range[0] + 12, a.range[1] - 20, a.range[1]],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const scroll = interpolate(
    frame,
    [a.mock1[0], a.mock2[0], a.mock3[0], a.mock4[0], a.mock4[1]],
    [0, 1, 2, 3, 3.1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOutCubic },
  )

  const cardH = layout.isReel ? layout.height * 0.4 : layout.height * 0.58
  const cardW = layout.isReel ? layout.width * 0.86 : layout.width * 0.52
  const gap = layout.isReel ? 36 : 44

  const mocks: { id: MockId; label: string }[] = [
    { id: 'studio', label: 'Studio' },
    { id: 'landing', label: 'Web' },
    { id: 'phone', label: 'Social' },
    { id: 'icon', label: 'App icon' },
  ]

  return (
    <AbsoluteFill style={{ opacity: actOpacity, backgroundColor: colors.ink, overflow: 'hidden' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap,
            transform: `translateY(${-scroll * (cardH + gap)}px)`,
            width: cardW,
          }}
        >
          {mocks.map((m, i) => {
            const dist = Math.abs(scroll - i)
            const focus = interpolate(dist, [0, 0.8], [1, 0.5], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
            return (
              <div key={m.id} style={{ opacity: focus, transform: `scale(${0.94 + focus * 0.06})` }}>
                <MockCard id={m.id} label={m.label} width={cardW} height={cardH} layout={layout} />
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

const MockCard: React.FC<{
  id: MockId
  label: string
  width: number
  height: number
  layout: Layout
}> = ({ id, label, width, height, layout }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 18,
      background: colors.graphite,
      border: '1px solid rgba(245,241,232,0.1)',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(245,241,232,0.08)',
      }}
    >
      <span
        style={{
          fontFamily: spaceGrotesk,
          fontSize: 11,
          letterSpacing: type.trackingCaps,
          textTransform: 'uppercase',
          color: colors.stone,
        }}
      >
        {label}
      </span>
      <span style={{ width: 7, height: 7, borderRadius: 7, background: colors.signal }} />
    </div>
    <div style={{ flex: 1, position: 'relative' }}>
      {id === 'studio' && <StudioMock layout={layout} />}
      {id === 'landing' && <LandingMock layout={layout} />}
      {id === 'phone' && <PhoneMock layout={layout} />}
      {id === 'icon' && <IconMock />}
    </div>
  </div>
)

const StudioMock: React.FC<{ layout: Layout }> = ({ layout }) => (
  <div style={{ display: 'flex', height: '100%' }}>
    <div
      style={{
        width: layout.isReel ? 44 : 52,
        background: colors.ink,
        borderRight: '1px solid rgba(245,241,232,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 14,
        gap: 12,
      }}
    >
      <LiftoffMarkCraft size={20} fullTile={0} slicedTile={1} corner={1} peel={0} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            borderRadius: 5,
            background: i === 0 ? 'rgba(255,74,29,0.28)' : 'rgba(245,241,232,0.08)',
          }}
        />
      ))}
    </div>
    <div style={{ flex: 1, background: '#1a1814', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: '52%',
          aspectRatio: '4/5',
          background: colors.paper,
          borderRadius: 8,
          boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  </div>
)

const LandingMock: React.FC<{ layout: Layout }> = ({ layout }) => (
  <div style={{ height: '100%', background: colors.ink, padding: layout.isReel ? 18 : 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: colors.signal,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LiftoffMarkCraft
          size={14}
          fullTile={0}
          slicedTile={1}
          corner={1}
          peel={0}
          base={colors.white}
          cornerColor={colors.white}
        />
      </div>
      <span
        style={{
          fontFamily: spaceGrotesk,
          fontWeight: 700,
          fontSize: 13,
          color: colors.paper,
          letterSpacing: type.trackingDisplay,
        }}
      >
        Flier<span style={{ fontWeight: 500 }}> Studio</span>
      </span>
      <div style={{ flex: 1 }} />
      <div
        style={{
          padding: '5px 10px',
          borderRadius: 7,
          background: colors.signal,
          fontFamily: spaceGrotesk,
          fontSize: 10,
          fontWeight: 600,
          color: colors.white,
        }}
      >
        Open Studio
      </div>
    </div>
    <div
      style={{
        fontFamily: spaceGrotesk,
        fontWeight: 700,
        fontSize: layout.isReel ? 24 : 32,
        color: colors.paper,
        letterSpacing: type.trackingDisplay,
        lineHeight: 1.1,
        maxWidth: '92%',
      }}
    >
      Start with a template. Make it <span style={{ color: colors.signal }}>yours</span>.
    </div>
  </div>
)

const PhoneMock: React.FC<{ layout: Layout }> = ({ layout }) => (
  <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1a1814' }}>
    <div
      style={{
        width: layout.isReel ? '56%' : '40%',
        aspectRatio: '9/19',
        borderRadius: 24,
        background: colors.ink,
        border: `3px solid ${colors.slate}`,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            background: colors.signal,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LiftoffMarkCraft
            size={15}
            fullTile={0}
            slicedTile={1}
            corner={1}
            peel={0}
            base={colors.ink}
            cornerColor={colors.paper}
          />
        </div>
        <div style={{ fontFamily: spaceGrotesk, fontSize: 9, fontWeight: 700, color: colors.paper }}>flierstudio</div>
      </div>
      <div
        style={{
          flex: 1,
          borderRadius: 10,
          background: colors.paper,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LiftoffMarkCraft size={42} fullTile={0} slicedTile={1} corner={1} peel={0} base={colors.ink} />
      </div>
    </div>
  </div>
)

const IconMock: React.FC = () => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: `radial-gradient(circle at 50% 40%, ${colors.graphite}, ${colors.ink})`,
      gap: 28,
    }}
  >
    <div
      style={{
        width: 108,
        height: 108,
        borderRadius: 26,
        background: colors.signal,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 14px 36px rgba(255,74,29,0.35)',
      }}
    >
      <LiftoffMarkCraft
        size={64}
        fullTile={0}
        slicedTile={1}
        corner={1}
        peel={0}
        base={colors.ink}
        cornerColor={colors.paper}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '7px 10px',
          background: colors.graphite,
          borderRadius: 9,
          border: '1px solid rgba(245,241,232,0.1)',
        }}
      >
        <LiftoffMarkCraft
          size={16}
          fullTile={0}
          slicedTile={1}
          corner={1}
          peel={0}
          base={colors.paper}
          cornerColor={colors.signal}
        />
        <span style={{ fontFamily: spaceGrotesk, fontSize: 11, color: colors.stone }}>flierstudio.design</span>
      </div>
      <span
        style={{
          fontFamily: spaceGrotesk,
          fontSize: 10,
          letterSpacing: type.trackingCaps,
          textTransform: 'uppercase',
          color: colors.stone,
        }}
      >
        App icon · Favicon
      </span>
    </div>
  </div>
)
