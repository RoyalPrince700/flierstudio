import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/ga'

/**
 * Tracks client-side route changes for GA4.
 * Initial pageview comes from the gtag config snippet in index.html.
 */
export default function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`
    trackPageView(path)
  }, [location.pathname, location.search, location.hash])

  return null
}
