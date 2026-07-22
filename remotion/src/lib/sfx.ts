/**
 * Sound cue board for FlierStudioLogoFilm (~14.4s @ 60fps).
 * Existing assets live in `src/effects/`. Sparse premium mix.
 */
import click from '../effects/click.wav'
import swoosh from '../effects/swoosh.wav'
import scroll from '../effects/scroll.wav'
import pop from '../effects/pop.wav'
import ding from '../effects/ding.wav'
import chime from '../effects/chime.wav'
import sparkle from '../effects/sparkle.wav'

export const sfx = {
  click,
  swoosh,
  scroll,
  pop,
  ding,
  chime,
  sparkle,
} as const

export type SfxCue = {
  id: string
  from: number
  durationInFrames: number
  src: string
  volume: number
  playbackRate?: number
}

/**
 * Frame-accurate cues aligned with Act 1 opening + later acts.
 */
export const filmAudioCues: SfxCue[] = [
  // --- Act 1 Scene 1 (~3s reveal) ---
  {
    id: 'cursor-enter',
    from: 48,
    durationInFrames: 28,
    src: sfx.swoosh,
    volume: 0.2,
    playbackRate: 1.1,
  },
  {
    id: 'click-liftoff',
    from: 78,
    durationInFrames: 20,
    src: sfx.click,
    volume: 0.52,
  },
  {
    id: 'tile-land',
    from: 38,
    durationInFrames: 24,
    src: sfx.pop,
    volume: 0.22,
    playbackRate: 0.94,
  },
  {
    id: 'signal-cut',
    from: 80,
    durationInFrames: 22,
    src: sfx.sparkle,
    volume: 0.12,
    playbackRate: 1.12,
  },
  {
    id: 'liftoff-peel',
    from: 100,
    durationInFrames: 44,
    src: sfx.swoosh,
    volume: 0.48,
    playbackRate: 0.92,
  },
  {
    id: 'cursor-exit',
    from: 82,
    durationInFrames: 24,
    src: sfx.swoosh,
    volume: 0.14,
    playbackRate: 1.18,
  },

  // --- Act 1 Scene 2 (lockup shift) ---
  {
    id: 'logo-shift',
    from: 180,
    durationInFrames: 36,
    src: sfx.swoosh,
    volume: 0.22,
    playbackRate: 0.96,
  },
  {
    id: 'wordmark-appear',
    from: 220,
    durationInFrames: 24,
    src: sfx.ding,
    volume: 0.18,
  },

  // --- T1 SwipeWipe ---
  {
    id: 'swipe-t1',
    from: 390,
    durationInFrames: 36,
    src: sfx.swoosh,
    volume: 0.68,
    playbackRate: 0.84,
  },

  // --- Act 4 mockups ---
  {
    id: 'mock-press-1',
    from: 461,
    durationInFrames: 16,
    src: sfx.click,
    volume: 0.28,
  },
  {
    id: 'mock-scroll-1',
    from: 476,
    durationInFrames: 28,
    src: sfx.scroll,
    volume: 0.38,
  },
  {
    id: 'mock-press-2',
    from: 541,
    durationInFrames: 16,
    src: sfx.click,
    volume: 0.28,
  },
  {
    id: 'mock-scroll-2',
    from: 556,
    durationInFrames: 28,
    src: sfx.scroll,
    volume: 0.38,
  },
  {
    id: 'mock-scroll-3',
    from: 598,
    durationInFrames: 28,
    src: sfx.scroll,
    volume: 0.36,
  },
  {
    id: 'mock-press-3',
    from: 616,
    durationInFrames: 16,
    src: sfx.click,
    volume: 0.28,
  },

  // --- T4 SwipeWipe ---
  {
    id: 'swipe-t4',
    from: 672,
    durationInFrames: 34,
    src: sfx.swoosh,
    volume: 0.6,
    playbackRate: 0.86,
  },

  // --- Act 5 closing ---
  {
    id: 'slice-rejoin',
    from: 732,
    durationInFrames: 36,
    src: sfx.swoosh,
    volume: 0.34,
    playbackRate: 0.92,
  },
  {
    id: 'closing-resolve',
    from: 762,
    durationInFrames: 36,
    src: sfx.chime,
    volume: 0.24,
    playbackRate: 0.9,
  },
  {
    id: 'final-click',
    from: 774,
    durationInFrames: 20,
    src: sfx.click,
    volume: 0.4,
  },
]
