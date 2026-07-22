/**
 * Behavior-aware tool coaching: thresholds + cooldown rules.
 * Session-only (in-memory). Tuned for finger ambiguity on mobile.
 */

export const TOOL_COACH = {
  /** How many times the tool button blinks when suggested */
  blinkCount: 4,
  blinkPeriodMs: 320,
  /** Toast auto-hides */
  toastMs: 5200,
  /** After a suggestion shows (auto or action), wait before same kind again */
  cooldownAfterShowMs: 50_000,
  /** After explicit dismiss (X), longer quiet period for that kind */
  cooldownAfterDismissMs: 120_000,
  /** After N dismisses of the same kind, suppress for the rest of the session */
  maxDismissesPerKind: 2,
  /** Rolling window for streak counting */
  streakWindowMs: 4500,
}

/** Mobile / coarse pointer — easier to trigger (one finger does everything) */
export const TOOL_COACH_MOBILE = {
  emptyDragMinPx: 28,
  emptyDragMinMs: 160,
  emptyDragStreak: 1,
  /** Single long empty drag also counts */
  emptyDragStrongPx: 56,
  handTapMaxPx: 14,
  handTapMaxMs: 420,
  handTapStreak: 1,
}

/** Desktop — slightly stricter so mouse users aren't nagged */
export const TOOL_COACH_DESKTOP = {
  emptyDragMinPx: 40,
  emptyDragMinMs: 180,
  emptyDragStreak: 2,
  emptyDragStrongPx: 90,
  handTapMaxPx: 8,
  handTapMaxMs: 320,
  handTapStreak: 2,
}

export const COACH_KIND = {
  USE_HAND: 'use-hand',
  USE_SELECT: 'use-select',
}

export function coachThresholds(isNarrow) {
  return isNarrow ? TOOL_COACH_MOBILE : TOOL_COACH_DESKTOP
}

export function coachCopy(kind) {
  if (kind === COACH_KIND.USE_HAND) {
    return {
      message: 'Trying to drag the canvas? Use the Hand tool.',
      actionLabel: 'Switch to Hand',
      highlightTool: 'hand',
      switchTo: 'hand',
    }
  }
  return {
    message: 'Trying to edit? Switch to Select.',
    actionLabel: 'Switch to Select',
    highlightTool: 'select',
    switchTo: 'select',
  }
}

/**
 * Decide whether an empty-canvas drag while on Select looks like a pan attempt.
 */
export function isPanLikeEmptyDrag({ distance, durationMs, thresholds }) {
  if (distance >= thresholds.emptyDragStrongPx) return true
  return distance >= thresholds.emptyDragMinPx && durationMs >= thresholds.emptyDragMinMs
}

/**
 * Short press on a frame/editable while Hand is active → edit intent.
 * Long drag is legitimate pan (even if it started on a board).
 */
export function isEditLikeHandTap({ distance, durationMs, overFrame, overEditable, thresholds }) {
  if (!overFrame && !overEditable) return false
  return distance <= thresholds.handTapMaxPx && durationMs <= thresholds.handTapMaxMs
}
