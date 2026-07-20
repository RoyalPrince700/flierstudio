import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'flier_token'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

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

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production'
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: SEVEN_DAYS_MS,
    path: '/',
  })
}

export function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production'
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  })
}

export { COOKIE_NAME }
