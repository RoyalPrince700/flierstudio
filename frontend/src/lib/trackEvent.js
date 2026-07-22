import { api } from './api'

/** Fire-and-forget usage event (never throws to callers). */
export function trackEvent({ action, projectId = '', designId = '', meta = {} }) {
  if (!action) return
  api('/api/events', {
    method: 'POST',
    body: { action, projectId, designId, meta },
  }).catch(() => {
    // analytics must not block UX
  })
}
