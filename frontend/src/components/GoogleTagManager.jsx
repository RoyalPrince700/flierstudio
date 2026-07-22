import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { pushPageView } from '../lib/gtm'

/**
 * Pushes SPA route changes to the GTM dataLayer.
 * Initial page load is handled by the GTM snippet in index.html.
 */
export default function GoogleTagManager() {
  const location = useLocation()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    const path = `${location.pathname}${location.search}${location.hash}`
    pushPageView(path)
  }, [location.pathname, location.search, location.hash])

  return null
}
