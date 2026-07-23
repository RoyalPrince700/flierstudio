/** GTM container ID — keep in sync with the snippets in index.html */
export const GTM_ID = 'GTM-NKXHSN9P'

function ensureDataLayer() {
  if (typeof window === 'undefined') return null
  window.dataLayer = window.dataLayer || []
  return window.dataLayer
}

/** Push any GTM/dataLayer payload. Safe no-op outside the browser. */
export function pushDataLayer(payload) {
  const dataLayer = ensureDataLayer()
  if (!dataLayer || !payload || typeof payload !== 'object') return
  dataLayer.push(payload)
}

/** Push a SPA route change to the GTM dataLayer for History/virtual pageview tags. */
export function pushPageView(path) {
  pushDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: typeof document !== 'undefined' ? document.title : '',
  })
}

/**
 * Fire once when a flier download succeeds (icon, panel button, or Ctrl+E).
 * GTM: Custom Event trigger → Event name `flier_download`.
 */
export function trackFlierDownload({
  projectId = '',
  designId = '',
  format = '',
  hdScale = '',
  width,
  height,
} = {}) {
  pushDataLayer({
    event: 'flier_download',
    flier_project_id: projectId,
    flier_design_id: designId,
    flier_format: format,
    flier_hd_scale: hdScale,
    flier_width: width ?? '',
    flier_height: height ?? '',
  })
}
