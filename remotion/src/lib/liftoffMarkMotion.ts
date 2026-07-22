import { interpolate } from 'remotion'
import { easeInOutQuint, easeOutCubic, easeOutQuint } from './easings'

/** Peel distance in viewBox units along the 45° axis (negative = tucked toward tile). */
export const PEEL_START = -7
export const PEEL_REST = 0
/** Brief trail lead ahead of the corner during liftoff. */
export const TRAIL_LEAD = 6
export const SLICE_LEN = 56.57

export type LiftoffMarkBeats = {
  frame: readonly [number, number]
  tile: readonly [number, number]
  slice: readonly [number, number]
  peel: readonly [number, number]
  settle: readonly [number, number]
  hold?: readonly [number, number]
}

export type LiftoffMarkMotion = {
  frameIn: number
  framePulse: number
  frameOpacity: number
  showFrame: boolean
  charge: number
  tileScale: number
  tileOpacity: number
  sliceDash: number
  sliceOpacity: number
  peelDistance: number
  cornerOpacity: number
  trailOpacity: number
  trailDistance: number
  showSliced: boolean
  fullTileFade: number
  slicedFade: number
  markSettle: number
  markScale: number
  peelComplete: boolean
}

type Options = {
  /** Reveal idle micro-drift during hold — disabled in Act 1 logo hold. */
  idleDrift?: boolean
}

/**
 * Exact LiftoffMarkAnimated math — frame → tile → slice → peel → settle.
 * Source of truth ported from the short reveal; film Act 1 reuses this.
 */
export function computeLiftoffMarkMotion(
  frame: number,
  beats: LiftoffMarkBeats,
  options: Options = {},
): LiftoffMarkMotion {
  const { idleDrift = false } = options

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

  const tileT = interpolate(frame, beats.tile, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutQuint,
  })
  const tileScale = interpolate(tileT, [0, 1], [0.86, 1])
  const tileOpacity = interpolate(tileT, [0, 0.28, 1], [0, 1, 1])

  const sliceT = interpolate(frame, beats.slice, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutQuint,
  })
  const sliceDash = SLICE_LEN * (1 - sliceT)
  const sliceOpacity = interpolate(
    frame,
    [beats.slice[0], beats.slice[0] + 6, beats.peel[0] + 12],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  )

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

  const settleT = interpolate(frame, beats.settle, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  })
  const markSettle = interpolate(settleT, [0, 1], [1.012, 1])

  const holdStart = beats.hold?.[0] ?? beats.settle[1]
  const idleActive = idleDrift && frame >= holdStart
  const idlePhase = idleActive ? ((frame - holdStart) / 96) * Math.PI * 2 : 0
  const idleDriftOffset = idleActive ? Math.sin(idlePhase) * 1.1 : 0
  const peelComplete = frame >= beats.peel[1]
  const finalPeel =
    (peelComplete ? PEEL_REST : peelDistance) + idleDriftOffset

  const showFrame = frame < beats.tile[0] + 22
  const charge = interpolate(frame, [6, 26, 72], [0, 0.05, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return {
    frameIn,
    framePulse,
    frameOpacity,
    showFrame,
    charge,
    tileScale,
    tileOpacity,
    sliceDash,
    sliceOpacity,
    peelDistance: finalPeel,
    cornerOpacity,
    trailOpacity,
    trailDistance,
    showSliced,
    fullTileFade,
    slicedFade,
    markSettle,
    markScale: frame >= beats.settle[0] ? markSettle : 1,
    peelComplete,
  }
}
