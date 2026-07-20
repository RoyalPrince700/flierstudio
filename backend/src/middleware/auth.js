import { User } from '../models/User.js'
import { COOKIE_NAME, verifyUserToken } from '../lib/tokens.js'

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) {
      return res.status(401).json({ error: 'Not signed in' })
    }

    const payload = verifyUserToken(token)
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' })
  }
  return next()
}
