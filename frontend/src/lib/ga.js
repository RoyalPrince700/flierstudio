/** GA4 measurement ID — keep in sync with the gtag snippet in index.html */
export const GA_MEASUREMENT_ID = 'G-ES5TN8DH9G'

/** Send a SPA page view to GA4 (initial load is handled by gtag config in index.html). */
export function trackPageView(path) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}
