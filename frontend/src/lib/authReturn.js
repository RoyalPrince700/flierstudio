const STORAGE_KEY = 'flier-studio-auth-return'

/**
 * Only allow in-app Studio/Admin destinations (with optional query).
 * Blocks open redirects (//evil, https:, etc.).
 */
export function isSafeAuthReturn(path) {
  if (typeof path !== 'string') return false
  const trimmed = path.trim()
  if (!trimmed.startsWith('/')) return false
  if (trimmed.startsWith('//')) return false
  if (trimmed.includes('\\')) return false

  const pathOnly = trimmed.split(/[?#]/)[0]
  return (
    pathOnly === '/studio' ||
    pathOnly === '/studio/templates' ||
    pathOnly.startsWith('/admin')
  )
}

export function studioTemplateReturnPath(templateId) {
  if (!templateId || typeof templateId !== 'string') return '/studio'
  return `/studio?template=${encodeURIComponent(templateId.trim())}`
}

export function rememberAuthReturn(path) {
  if (!isSafeAuthReturn(path)) return false
  try {
    sessionStorage.setItem(STORAGE_KEY, path)
    return true
  } catch {
    return false
  }
}

/** Read without clearing — useful while login UI is showing. */
export function peekAuthReturn() {
  try {
    const path = sessionStorage.getItem(STORAGE_KEY)
    return isSafeAuthReturn(path) ? path : null
  } catch {
    return null
  }
}

/** Consume and clear. Defaults to /studio when nothing valid is stored. */
export function consumeAuthReturn(fallback = '/studio') {
  const path = peekAuthReturn()
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  return path || (isSafeAuthReturn(fallback) ? fallback : '/studio')
}

export function clearAuthReturn() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
