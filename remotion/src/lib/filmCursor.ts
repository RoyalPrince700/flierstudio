import type { CursorKeyframe } from './cursorPath'
import { markViewToNorm, type Layout } from './format'
import { film, FILM_DURATION } from './timeline'

/** Inside upper-right Signal region — liftoff click (96-grid). */
export const ACT1_MARK = {
  cutClick: [69, 24] as const,
} as const

/**
 * Film cursor — appears once in Act 1 Scene 1 only.
 * Moves to cut corner → single click → immediate exit.
 */
export function getFilmCursorKeys(layout: Layout): CursorKeyframe[] {
  const cutPos = markViewToNorm(ACT1_MARK.cutClick[0], ACT1_MARK.cutClick[1], layout)
  const s1 = film.act1.scene1

  return [
    { frame: 0, x: cutPos.x, y: cutPos.y, state: 'exit', opacity: 0 },
    { frame: s1.cursorEnter[0], x: cutPos.x, y: 0.74, state: 'move', opacity: 1 },
    { frame: s1.cursorEnter[1], x: cutPos.x, y: cutPos.y, state: 'hover' },
    { frame: s1.cursorClick, x: cutPos.x, y: cutPos.y, state: 'press' },
    { frame: s1.cursorExit[0], x: cutPos.x, y: cutPos.y, state: 'hover', opacity: 1 },
    { frame: s1.cursorExit[1], x: 1.06, y: 0.62, state: 'exit', opacity: 0 },
    { frame: FILM_DURATION, x: 1.06, y: 0.62, state: 'exit', opacity: 0 },
  ]
}
