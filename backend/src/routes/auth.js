import { Router } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { User } from '../models/User.js'
import {
  clearAuthCookie,
  setAuthCookie,
  signUserToken,
} from '../lib/tokens.js'
import { requireAuth } from '../middleware/auth.js'
import { sendWelcomeEmailSafe } from '../mailtrap/emails.js'

const router = Router()

function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not set')
  }
  return new OAuth2Client(clientId)
}

async function upsertGoogleUser(payload) {
  const googleId = payload.sub
  const email = String(payload.email || '').toLowerCase()
  const name = payload.name || email.split('@')[0] || 'User'
  const avatar = payload.picture || ''

  if (!googleId || !email) {
    throw new Error('Google account is missing email')
  }

  const adminEmail = String(process.env.ADMIN_EMAIL || '').toLowerCase()
  const shouldBeAdmin = Boolean(adminEmail) && email === adminEmail

  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  })

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      avatar,
      role: shouldBeAdmin ? 'admin' : 'user',
      lastLoginAt: new Date(),
    })
    return { user, isNew: true }
  }

  user.googleId = user.googleId || googleId
  user.name = name || user.name
  user.avatar = avatar || user.avatar
  user.lastLoginAt = new Date()
  if (shouldBeAdmin && user.role !== 'admin') {
    user.role = 'admin'
  }
  await user.save()
  return { user, isNew: false }
}

router.post('/google', async (req, res) => {
  try {
    const credential = req.body?.credential
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ error: 'Missing Google credential' })
    }

    const client = getGoogleClient()
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload) {
      return res.status(401).json({ error: 'Invalid Google token' })
    }

    const { user, isNew } = await upsertGoogleUser(payload)
    const token = signUserToken(user)
    setAuthCookie(res, token)

    // First-time Google sign-in only — never block auth on mail failure
    if (isNew) {
      sendWelcomeEmailSafe(user)
    }

    return res.json({ user: user.toSafeJSON() })
  } catch (err) {
    console.error('Google auth failed', err)
    return res.status(401).json({ error: 'Google sign-in failed' })
  }
})

router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user.toSafeJSON() })
})

router.post('/logout', (req, res) => {
  clearAuthCookie(res)
  return res.json({ ok: true })
})

export default router
