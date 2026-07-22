/** GTM container ID — keep in sync with the snippets in index.html */
export const GTM_ID = 'GTM-NKXHSN9P'

/** Push a SPA route change to the GTM dataLayer for History/virtual pageview tags. */
export function pushPageView(path) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'page_view',
    page_path: path,
    page_title: typeof document !== 'undefined' ? document.title : '',
  })
}
