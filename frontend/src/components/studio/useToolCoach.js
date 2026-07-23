import { useCallback, useEffect, useRef, useState } from 'react'
import {
  COACH_KIND,
  TOOL_COACH,
  coachCopy,
  coachThresholds,
  isEditLikeHandTap,
  isPanLikeEmptyDrag,
} from '../../lib/toolCoach'

function now() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

function oppositeKind(kind) {
  return kind === COACH_KIND.USE_HAND ? COACH_KIND.USE_SELECT : COACH_KIND.USE_HAND
}

/**
 * Session-scoped tool coaching: reads gesture signals → auto-switch (+ optional toast).
 * Mobile (isNarrow): auto-switch on clear wrong-tool intent; brief rail blink.
 * Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want
 * gesture explanations again.
 * Non-blocking; short cooldowns debounce spam (see TOOL_COACH in toolCoach.js).
 */
export function useToolCoach({ isNarrow, enabled = true, onSwitchTool, currentTool }) {
  // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
  // const [suggestion, setSuggestion] = useState(null)
  const [highlightTool, setHighlightTool] = useState(null)

  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  const isNarrowRef = useRef(isNarrow)
  isNarrowRef.current = isNarrow

  const onSwitchToolRef = useRef(onSwitchTool)
  onSwitchToolRef.current = onSwitchTool

  const currentToolRef = useRef(currentTool)
  currentToolRef.current = currentTool

  const streakRef = useRef({
    emptyDrag: [],
    handTap: [],
  })
  const cooldownUntilRef = useRef({
    [COACH_KIND.USE_HAND]: 0,
    [COACH_KIND.USE_SELECT]: 0,
  })
  // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
  // const dismissCountRef = useRef({
  //   [COACH_KIND.USE_HAND]: 0,
  //   [COACH_KIND.USE_SELECT]: 0,
  // })
  // const activeKindRef = useRef(null)
  // const toastModeRef = useRef(null)
  const hideTimersRef = useRef([])

  const clearTimers = useCallback(() => {
    hideTimersRef.current.forEach((id) => clearTimeout(id))
    hideTimersRef.current = []
  }, [])

  const clearHighlight = useCallback(() => {
    clearTimers()
    setHighlightTool(null)
  }, [clearTimers])

  // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
  // const clearSuggestion = useCallback(() => {
  //   clearTimers()
  //   activeKindRef.current = null
  //   toastModeRef.current = null
  //   setSuggestion(null)
  //   setHighlightTool(null)
  // }, [clearTimers])

  const canSwitch = useCallback((kind, switchTo) => {
    if (!enabledRef.current) return false
    if (currentToolRef.current === switchTo) return false

    const t = now()
    if (t < (cooldownUntilRef.current[kind] || 0)) return false
    return true
  }, [])

  /** Brief rail blink so the auto-switch is visible without a popup. */
  const blinkTool = useCallback(
    (highlight) => {
      clearTimers()
      setHighlightTool(highlight)
      const blinkMs = TOOL_COACH.blinkCount * TOOL_COACH.blinkPeriodMs
      hideTimersRef.current.push(setTimeout(() => setHighlightTool(null), blinkMs + 80))
    },
    [clearTimers],
  )

  // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
  // const scheduleHide = useCallback(
  //   (kind, highlight) => {
  //     clearTimers()
  //     activeKindRef.current = kind
  //     setHighlightTool(highlight)
  //
  //     const blinkMs = TOOL_COACH.blinkCount * TOOL_COACH.blinkPeriodMs
  //     hideTimersRef.current.push(setTimeout(() => setHighlightTool(null), blinkMs + 80))
  //     hideTimersRef.current.push(
  //       setTimeout(() => {
  //         activeKindRef.current = null
  //         toastModeRef.current = null
  //         setSuggestion(null)
  //       }, TOOL_COACH.toastMs),
  //     )
  //   },
  //   [clearTimers],
  // )
  //
  // const showSuggestion = useCallback(
  //   (kind) => {
  //     const copy = coachCopy(kind)
  //     if (!canSwitch(kind, copy.switchTo)) return
  //     if ((dismissCountRef.current[kind] || 0) >= TOOL_COACH.maxDismissesPerKind) return
  //
  //     const t = now()
  //     toastModeRef.current = 'suggest'
  //     setSuggestion({ kind, ...copy })
  //     scheduleHide(kind, copy.highlightTool)
  //     cooldownUntilRef.current[kind] = t + TOOL_COACH.cooldownAfterShowMs
  //   },
  //   [canSwitch, scheduleHide],
  // )

  /**
   * Mobile path: switch tool immediately (+ rail blink). Toast UI commented out.
   */
  const autoSwitch = useCallback(
    (kind) => {
      const copy = coachCopy(kind, { auto: true })
      if (!canSwitch(kind, copy.switchTo)) return

      const t = now()
      onSwitchToolRef.current?.(copy.switchTo)
      // Optimistic — parent state updates async; avoid double-fire before re-render
      currentToolRef.current = copy.switchTo

      blinkTool(copy.highlightTool)

      // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
      // toastModeRef.current = 'status'
      // setSuggestion({ kind, ...copy })
      // scheduleHide(kind, copy.highlightTool)

      cooldownUntilRef.current[kind] = t + TOOL_COACH.cooldownAfterShowMs
      // Quiet the bounce-back kind briefly so we don't thrash Select ↔ Hand
      cooldownUntilRef.current[oppositeKind(kind)] = t + TOOL_COACH.cooldownAfterAutoMs
    },
    [blinkTool, canSwitch],
  )

  const coachForKind = useCallback(
    (kind) => {
      // Mobile: auto-switch only. Desktop suggestion toast disabled for now.
      if (isNarrowRef.current) autoSwitch(kind)
      // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
      // else showSuggestion(kind)
    },
    [autoSwitch],
  )

  // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
  // const dismiss = useCallback(() => {
  //   const kind = activeKindRef.current
  //   if (kind) {
  //     dismissCountRef.current[kind] = (dismissCountRef.current[kind] || 0) + 1
  //     cooldownUntilRef.current[kind] = now() + TOOL_COACH.cooldownAfterDismissMs
  //   }
  //   clearSuggestion()
  // }, [clearSuggestion])
  //
  // /** Suggest mode: accept primary CTA. Status mode: optional switch-back. */
  // const accept = useCallback(() => {
  //   const kind = activeKindRef.current
  //   const mode = toastModeRef.current
  //   if (!kind) {
  //     clearSuggestion()
  //     return
  //   }
  //
  //   if (mode === 'status') {
  //     const copy = coachCopy(kind, { auto: true })
  //     if (copy.switchBackTo) {
  //       onSwitchToolRef.current?.(copy.switchBackTo)
  //       currentToolRef.current = copy.switchBackTo
  //       cooldownUntilRef.current[kind] = now() + TOOL_COACH.cooldownAfterShowMs
  //       cooldownUntilRef.current[oppositeKind(kind)] = now() + TOOL_COACH.cooldownAfterAutoMs
  //     }
  //     clearSuggestion()
  //     return
  //   }
  //
  //   const copy = coachCopy(kind)
  //   if (copy?.switchTo) onSwitchToolRef.current?.(copy.switchTo)
  //   cooldownUntilRef.current[kind] = now() + TOOL_COACH.cooldownAfterShowMs
  //   clearSuggestion()
  // }, [clearSuggestion])

  const pruneStreak = (list, t) =>
    list.filter((stamp) => t - stamp <= TOOL_COACH.streakWindowMs)

  const onCoachSignal = useCallback(
    (signal) => {
      if (!enabledRef.current || !signal) return
      const thresholds = coachThresholds(isNarrowRef.current)
      const t = now()

      if (signal.type === 'select-empty-drag') {
        if (!isPanLikeEmptyDrag({ ...signal, thresholds })) return

        // Frame drags are noisier (finger wobble on select) — need strong move or streak
        const strong = signal.distance >= thresholds.emptyDragStrongPx
        if (signal.onFrame && !strong) {
          const next = pruneStreak(streakRef.current.emptyDrag, t)
          next.push(t)
          streakRef.current.emptyDrag = next
          streakRef.current.handTap = []
          // One extra than empty-canvas (empty already uses emptyDragStreak)
          const need = thresholds.emptyDragStreak + (isNarrowRef.current ? 1 : 0)
          if (next.length >= need) {
            coachForKind(COACH_KIND.USE_HAND)
          }
          return
        }

        const next = pruneStreak(streakRef.current.emptyDrag, t)
        next.push(t)
        streakRef.current.emptyDrag = next
        streakRef.current.handTap = []
        if (strong || next.length >= thresholds.emptyDragStreak) {
          coachForKind(COACH_KIND.USE_HAND)
        }
        return
      }

      if (signal.type === 'hand-edit-tap') {
        if (
          !isEditLikeHandTap({
            ...signal,
            thresholds,
          })
        ) {
          return
        }
        const next = pruneStreak(streakRef.current.handTap, t)
        next.push(t)
        streakRef.current.handTap = next
        streakRef.current.emptyDrag = []
        if (next.length >= thresholds.handTapStreak) {
          coachForKind(COACH_KIND.USE_SELECT)
        }
        return
      }

      // Successful select / pan resets the opposite streak
      if (signal.type === 'did-select') {
        streakRef.current.emptyDrag = []
        return
      }
      if (signal.type === 'did-pan') {
        streakRef.current.handTap = []
      }
    },
    [coachForKind],
  )

  useEffect(() => () => clearTimers(), [clearTimers])

  useEffect(() => {
    if (!enabled) clearHighlight()
  }, [enabled, clearHighlight])

  // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
  // // Manual tool changes: clear toast quietly (keep cooldown from show / auto)
  // useEffect(() => {
  //   const kind = activeKindRef.current
  //   if (!kind || !currentTool) return
  //   const mode = toastModeRef.current
  //   const wanted = coachCopy(kind, { auto: mode === 'status' }).switchTo
  //
  //   if (mode === 'suggest' && currentTool === wanted) {
  //     // User picked the suggested tool from the rail
  //     clearSuggestion()
  //     return
  //   }
  //   if (mode === 'status' && currentTool !== wanted) {
  //     // User left the auto-switched tool
  //     clearSuggestion()
  //   }
  // }, [currentTool, clearSuggestion])

  return {
    // Tool coach toast — temporarily disabled; auto-switch only. Uncomment if we want gesture explanations again.
    // suggestion,
    // dismissCoach: dismiss,
    // acceptCoach: accept,
    suggestion: null,
    highlightTool,
    onCoachSignal,
    dismissCoach: clearHighlight,
    acceptCoach: clearHighlight,
  }
}
