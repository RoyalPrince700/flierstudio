/**
 * Bearer token fallback for cross-origin sessions.
 * Primary auth remains the httpOnly `flier_token` cookie; mobile Safari often
 * drops third-party cookies when the API host differs from the app origin.
 */
const STORAGE_KEY = 'flier_auth_token'

export function getAuthToken() {
  try {
    const token = localStorage.getItem(STORAGE_KEY)
    return token && typeof token === 'string' ? token : null
  } catch {
    return null
  }
}

export function setAuthToken(token) {
  if (!token || typeof token !== 'string') {
    clearAuthToken()
    return
  }
  try {
    localStorage.setItem(STORAGE_KEY, token)
  } catch {
    // ignore quota / private mode
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
