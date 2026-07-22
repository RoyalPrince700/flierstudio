import React from 'react'
import { AbsoluteFill, interpolate } from 'remotion'
import { DIAGONAL, MARK_CORNER_PATH, colors } from '../brand/tokens'
import { easeInOutCubic, easeOutQuint } from '../lib/easings'
import type { Layout } from '../lib/format'

export type SlicePose = {
  /** Normalized center 0–1 */
  x: number
  y: number
  /** Scale relative to mark corner at rest (~1 = logo-sized corner) */
  scale: number
  opacity: number
  /** Extra peel offset in viewBox units */
  peel?: number
  rotation?: number
}

type Props = {
  layout: Layout
  pose: SlicePose
  color?: string
  /** When true, used as a full-bleed graphic plane */
  plane?: boolean
}

/** Interactive Liftoff corner — reusable cinematic motif. */
export const LiftoffSlice: React.FC<Props> = ({
  layout,
  pose,
  color = colors.signal,
  plane = false,
}) => {
  if (pose.opacity < 0.01) return null

  const base = plane
    ? Math.max(layout.width, layout.height) * 0.55
    : layout.markSize * 0.42

  const size = base * pose.scale
  const peel = pose.peel ?? 0
  const cx = DIAGONAL.x * peel
  const cy = DIAGONAL.y * peel

  return (
    <div
      style={{
        position: 'absolute',
        left: pose.x * layout.width,
        top: pose.y * layout.height,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${pose.rotation ?? 0}deg)`,
        opacity: pose.opacity,
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" style={{ overflow: 'visible' }}>
        <path
          d={MARK_CORNER_PATH}
          fill={color}
          transform={`translate(${cx} ${cy})`}
        />
      </svg>
    </div>
  )
}

/** Sample slice pose across a keyframe list. */
export function sampleSlicePose(
  frame: number,
  keys: Array<{ frame: number } & SlicePose>,
): SlicePose {
  if (keys.length === 0) {
    return { x: 0.5, y: 0.5, scale: 1, opacity: 0 }
  }
  if (frame <= keys[0].frame) return { ...keys[0] }
  const last = keys[keys.length - 1]
  if (frame >= last.frame) return { ...last }

  let i = 0
  while (i < keys.length - 1 && keys[i + 1].frame <= frame) i++
  const a = keys[i]
  const b = keys[i + 1]
  const t = Math.max(0, Math.min(1, (frame - a.frame) / Math.max(1, b.frame - a.frame)))
  const e = easeOutQuint(t)
  return {
    x: a.x + (b.x - a.x) * e,
    y: a.y + (b.y - a.y) * e,
    scale: a.scale + (b.scale - a.scale) * e,
    opacity: a.opacity + (b.opacity - a.opacity) * e,
    peel: (a.peel ?? 0) + ((b.peel ?? 0) - (a.peel ?? 0)) * e,
    rotation: (a.rotation ?? 0) + ((b.rotation ?? 0) - (a.rotation ?? 0)) * e,
  }
}

type WipeProps = {
  frame: number
  /** Inclusive window */
  range: readonly [number, number]
  layout: Layout
  /** Direction: diagonal up-right is brand-true */
  direction?: 'diagonal' | 'horizontal'
}

/**
 * Swipe wipe — scaled Liftoff slice covers then reveals the next world.
 * Fast, editorial, camera-covered energy.
 */
export const SwipeWipe: React.FC<WipeProps> = ({
  frame,
  range,
  layout,
  direction = 'diagonal',
}) => {
  const t = interpolate(frame, range, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  })
  if (t <= 0 || t >= 1) {
    // Still draw mid coverage
  }
  if (frame < range[0] - 2 || frame > range[1] + 2) return null

  const x =
    direction === 'horizontal'
      ? interpolate(t, [0, 1], [-0.2, 1.2])
      : interpolate(t, [0, 1], [-0.15, 1.15])
  const y =
    direction === 'horizontal'
      ? 0.5
      : interpolate(t, [0, 1], [1.05, -0.05])

  const scale = interpolate(t, [0, 0.45, 1], [2.2, 6.5, 2.4])
  const opacity = interpolate(t, [0, 0.12, 0.88, 1], [0, 1, 1, 0])

  return (
    <AbsoluteFill style={{ zIndex: 80, pointerEvents: 'none' }}>
      <LiftoffSlice
        layout={layout}
        plane
        pose={{ x, y, scale, opacity }}
        color={colors.signal}
      />
      {/* Ink veil while covered */}
      <AbsoluteFill
        style={{
          backgroundColor: colors.ink,
          opacity: interpolate(t, [0.2, 0.45, 0.55, 0.8], [0, 0.92, 0.92, 0]),
        }}
      />
    </AbsoluteFill>
  )
}

type MaskProps = {
  frame: number
  range: readonly [number, number]
  layout: Layout
  children: React.ReactNode
}

/**
 * Mask / hole reveal — next scene appears through an expanding slice aperture.
 */
export const MaskReveal: React.FC<MaskProps> = ({ frame, range, layout, children }) => {
  if (frame < range[0] || frame > range[1] + 8) {
    // Outside: if past, show children fully via parent; if before, hide
    if (frame > range[1]) return <>{children}</>
    return null
  }

  const t = interpolate(frame, range, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })

  // Aperture grows from slice-sized hole to full frame
  const hole = interpolate(t, [0, 1], [Math.min(layout.width, layout.height) * 0.08, Math.max(layout.width, layout.height) * 1.2])
  const cx = layout.width * 0.58
  const cy = layout.height * 0.38

  // Polygon approximating the corner silhouette as aperture (rotated diamond-ish)
  const clip = `circle(${hole}px at ${cx}px ${cy}px)`

  return (
    <AbsoluteFill style={{ zIndex: 50 }}>
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {children}
      </AbsoluteFill>
      {/* Slice silhouette rim at the aperture edge early on */}
      <LiftoffSlice
        layout={layout}
        pose={{
          x: 0.58,
          y: 0.38,
          scale: interpolate(t, [0, 0.5, 1], [1.4, 3.2, 0.2]),
          opacity: interpolate(t, [0, 0.35, 0.85], [1, 0.6, 0]),
        }}
      />
    </AbsoluteFill>
  )
}

type MorphProps = {
  frame: number
  range: readonly [number, number]
  layout: Layout
}

/**
 * Shape morph — slice scales/softens into a mockup card corner language,
 * then exits so Act 4 owns the frame.
 */
export const ShapeMorph: React.FC<MorphProps> = ({ frame, range, layout }) => {
  if (frame < range[0] || frame > range[1] + 4) return null

  const t = interpolate(frame, range, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  })

  // Start as Signal corner mid-frame; end as larger rounded card corner accent
  const x = interpolate(t, [0, 1], [0.55, 0.72])
  const y = interpolate(t, [0, 1], [0.42, 0.28])
  const scale = interpolate(t, [0, 0.55, 1], [1.2, 2.8, 1.6])
  const opacity = interpolate(t, [0, 0.15, 0.75, 1], [0, 1, 1, 0])

  // Companion “card” ghost that the slice becomes associated with
  const cardOpacity = interpolate(t, [0.35, 0.7, 1], [0, 0.85, 0])
  const cardScale = interpolate(t, [0.35, 1], [0.4, 1])

  return (
    <AbsoluteFill style={{ zIndex: 70, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: layout.isReel ? layout.width * 0.78 : layout.width * 0.42,
          height: layout.isReel ? layout.height * 0.36 : layout.height * 0.48,
          transform: `translate(-50%, -50%) scale(${cardScale})`,
          borderRadius: 18,
          background: colors.graphite,
          border: `1px solid rgba(245,241,232,0.12)`,
          opacity: cardOpacity,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 48,
            height: 48,
            background: colors.signal,
            clipPath: 'polygon(40% 0, 100% 0, 100% 60%)',
          }}
        />
      </div>
      <LiftoffSlice layout={layout} pose={{ x, y, scale, opacity }} />
    </AbsoluteFill>
  )
}
