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

/**
 * Session-scoped tool coaching: reads gesture signals → blink + short toast.
 * Non-blocking; short cooldowns only debounce spam — suggestions keep returning
 * whenever wrong-tool intent is detected (see TOOL_COACH in toolCoach.js).
 */
export function useToolCoach({ isNarrow, enabled = true, onSwitchTool, currentTool }) {
  const [suggestion, setSuggestion] = useState(null)
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
  const dismissCountRef = useRef({
    [COACH_KIND.USE_HAND]: 0,
    [COACH_KIND.USE_SELECT]: 0,
  })
  const activeKindRef = useRef(null)
  const hideTimersRef = useRef([])

  const clearTimers = useCallback(() => {
    hideTimersRef.current.forEach((id) => clearTimeout(id))
    hideTimersRef.current = []
  }, [])

  const clearSuggestion = useCallback(() => {
    clearTimers()
    activeKindRef.current = null
    setSuggestion(null)
    setHighlightTool(null)
  }, [clearTimers])

  const showSuggestion = useCallback(
    (kind) => {
      if (!enabledRef.current) return
      if (activeKindRef.current === kind) return

      const copy = coachCopy(kind)
      if (currentToolRef.current === copy.switchTo) return

      const t = now()
      if (t < (cooldownUntilRef.current[kind] || 0)) return
      if ((dismissCountRef.current[kind] || 0) >= TOOL_COACH.maxDismissesPerKind) return

      clearTimers()
      activeKindRef.current = kind
      setSuggestion({ kind, ...copy })
      setHighlightTool(copy.highlightTool)

      cooldownUntilRef.current[kind] = t + TOOL_COACH.cooldownAfterShowMs

      const blinkMs = TOOL_COACH.blinkCount * TOOL_COACH.blinkPeriodMs
      hideTimersRef.current.push(
        setTimeout(() => setHighlightTool(null), blinkMs + 80),
      )
      hideTimersRef.current.push(
        setTimeout(() => {
          activeKindRef.current = null
          setSuggestion(null)
        }, TOOL_COACH.toastMs),
      )
    },
    [clearTimers],
  )

  const dismiss = useCallback(() => {
    const kind = activeKindRef.current
    if (kind) {
      dismissCountRef.current[kind] = (dismissCountRef.current[kind] || 0) + 1
      cooldownUntilRef.current[kind] = now() + TOOL_COACH.cooldownAfterDismissMs
    }
    clearSuggestion()
  }, [clearSuggestion])

  const accept = useCallback(() => {
    const kind = activeKindRef.current
    const copy = kind ? coachCopy(kind) : null
    if (copy?.switchTo) onSwitchToolRef.current?.(copy.switchTo)
    if (kind) {
      // Successful switch — shorter quiet period already set on show; bump a bit
      cooldownUntilRef.current[kind] = now() + TOOL_COACH.cooldownAfterShowMs
    }
    clearSuggestion()
  }, [clearSuggestion])

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
            showSuggestion(COACH_KIND.USE_HAND)
          }
          return
        }

        const next = pruneStreak(streakRef.current.emptyDrag, t)
        next.push(t)
        streakRef.current.emptyDrag = next
        streakRef.current.handTap = []
        if (strong || next.length >= thresholds.emptyDragStreak) {
          showSuggestion(COACH_KIND.USE_HAND)
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
          showSuggestion(COACH_KIND.USE_SELECT)
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
    [showSuggestion],
  )

  useEffect(() => () => clearTimers(), [clearTimers])

  useEffect(() => {
    if (!enabled) clearSuggestion()
  }, [enabled, clearSuggestion])

  // User already switched tools — drop the toast quietly (keep cooldown from show)
  useEffect(() => {
    const kind = activeKindRef.current
    if (!kind || !currentTool) return
    const wanted = coachCopy(kind).switchTo
    if (currentTool === wanted) clearSuggestion()
  }, [currentTool, clearSuggestion])

  return {
    suggestion,
    highlightTool,
    onCoachSignal,
    dismissCoach: dismiss,
    acceptCoach: accept,
  }
}
