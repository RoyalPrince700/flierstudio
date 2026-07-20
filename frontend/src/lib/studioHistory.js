const MAX_HISTORY = 40
const COALESCE_MS = 600

/**
 * In-memory undo/redo for studio snapshots ({ drafts, boardLayouts }).
 * Coalesce rapid edits to the same key (e.g. typing in the Edit panel).
 */
export function createStudioHistory() {
  return {
    past: [],
    future: [],
    coalesceKey: null,
    coalesceAt: 0,
  }
}

export function pushStudioHistory(history, snapshot, coalesceKey = null) {
  const now = Date.now()
  if (
    coalesceKey &&
    history.coalesceKey === coalesceKey &&
    now - history.coalesceAt < COALESCE_MS &&
    history.past.length
  ) {
    history.coalesceAt = now
    return history
  }

  history.past.push(snapshot)
  if (history.past.length > MAX_HISTORY) history.past.shift()
  history.future = []
  history.coalesceKey = coalesceKey
  history.coalesceAt = now
  return history
}

export function undoStudioHistory(history, currentSnapshot) {
  if (!history.past.length) return null
  const previous = history.past.pop()
  history.future.unshift(currentSnapshot)
  if (history.future.length > MAX_HISTORY) history.future.pop()
  history.coalesceKey = null
  history.coalesceAt = 0
  return previous
}

export function redoStudioHistory(history, currentSnapshot) {
  if (!history.future.length) return null
  const next = history.future.shift()
  history.past.push(currentSnapshot)
  if (history.past.length > MAX_HISTORY) history.past.shift()
  history.coalesceKey = null
  history.coalesceAt = 0
  return next
}

export function cloneStudioSnapshot(drafts, boardLayouts) {
  return {
    drafts: structuredClone(drafts),
    boardLayouts: structuredClone(boardLayouts),
  }
}
