import { easeInOutCubic, easeOutCubic, easeOutQuint } from './easings'

export type CursorState = 'idle' | 'move' | 'hover' | 'press' | 'draw' | 'drag' | 'exit'

export type CursorKeyframe = {
  frame: number
  /** Normalized 0–1 position in composition space */
  x: number
  y: number
  state?: CursorState
  /** Optional opacity override */
  opacity?: number
}

export type CursorSample = {
  x: number
  y: number
  state: CursorState
  opacity: number
  /** 0–1 press squash */
  press: number
}

const clamp01 = (t: number) => Math.max(0, Math.min(1, t))

/**
 * Sample a keyframed cursor path.
 * Sharp & decisive — wobble only while traveling, never while idle/press.
 */
export function sampleCursor(
  frame: number,
  keys: CursorKeyframe[],
): CursorSample {
  if (keys.length === 0) {
    return { x: 0.5, y: 0.5, state: 'idle', opacity: 0, press: 0 }
  }

  if (frame <= keys[0].frame) {
    const k = keys[0]
    return {
      x: k.x,
      y: k.y,
      state: k.state ?? 'idle',
      opacity: k.opacity ?? 0,
      press: k.state === 'press' ? 1 : 0,
    }
  }

  const last = keys[keys.length - 1]
  if (frame >= last.frame) {
    return {
      x: last.x,
      y: last.y,
      state: last.state ?? 'idle',
      opacity: last.opacity ?? (last.state === 'exit' ? 0 : 1),
      press: last.state === 'press' ? 1 : 0,
    }
  }

  let i = 0
  while (i < keys.length - 1 && keys[i + 1].frame <= frame) i++
  const a = keys[i]
  const b = keys[i + 1]
  const span = Math.max(1, b.frame - a.frame)
  const t = clamp01((frame - a.frame) / span)

  const traveling = Math.hypot(b.x - a.x, b.y - a.y) > 0.008
  const e =
    a.state === 'drag' || b.state === 'drag'
      ? easeInOutCubic(t)
      : traveling
        ? easeOutQuint(t)
        : easeOutCubic(t)

  const state = (t < 0.5 ? a.state : b.state) ?? 'move'
  const settled = state === 'idle' || state === 'hover' || state === 'press' || state === 'exit'

  // Tiny anticipation only mid-travel — never idle dancing
  const wobble =
    traveling && !settled
      ? Math.sin(frame * 0.31) * 0.0006
      : 0

  const opacity = interpolateOpacity(a, b, e)
  const press =
    state === 'press'
      ? 1
      : a.state === 'press' && t < 0.35
        ? 1 - t / 0.35
        : b.state === 'press' && t > 0.7
          ? (t - 0.7) / 0.3
          : 0

  return {
    x: a.x + (b.x - a.x) * e + wobble,
    y: a.y + (b.y - a.y) * e + wobble * 0.5,
    state,
    opacity,
    press,
  }
}

function interpolateOpacity(a: CursorKeyframe, b: CursorKeyframe, t: number) {
  const ao = a.opacity ?? (a.state === 'exit' ? 0 : 1)
  const bo = b.opacity ?? (b.state === 'exit' ? 0 : 1)
  return ao + (bo - ao) * t
}
