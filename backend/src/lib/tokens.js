import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'flier_token'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function authCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    // Cross-site SPA ↔ API needs None+Secure in prod. Partitioned (CHIPS) helps
    // Chrome third-party cookie restrictions; Safari may still drop the cookie.
    sameSite: isProd ? 'none' : 'lax',
    ...(isProd ? { partitioned: true } : {}),
    maxAge: SEVEN_DAYS_MS,
    path: '/',
  }
}

export function signUserToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
}

export function verifyUserToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

/** Prefer cookie; fall back to Authorization: Bearer <jwt>. */
export function getTokenFromRequest(req) {
  const cookieToken = req.cookies?.[COOKIE_NAME]
  if (cookieToken) return cookieToken

  const header = req.headers.authorization || req.headers.Authorization
  if (typeof header === 'string') {
    const match = /^Bearer\s+(.+)$/i.exec(header.trim())
    if (match?.[1]) return match[1].trim()
  }
  return null
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, authCookieOptions())
}

export function clearAuthCookie(res) {
  const { maxAge: _maxAge, ...clearOpts } = authCookieOptions()
  res.clearCookie(COOKIE_NAME, clearOpts)
}

export { COOKIE_NAME }
