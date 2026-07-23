import { Router } from 'express'
import { sendContactMessage } from '../mailtrap/emails.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME = 120
const MAX_EMAIL = 254
const MAX_SUBJECT = 200
const MAX_MESSAGE = 5000

function asString(value) {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

router.post('/', async (req, res) => {
  try {
    const rawName = asString(req.body?.name).trim()
    const rawEmail = asString(req.body?.email).trim().toLowerCase()
    const rawSubject = asString(req.body?.subject).trim()
    const rawMessage = asString(req.body?.message).trim()

    if (!rawName) {
      return res.status(400).json({ error: 'Name is required' })
    }
    if (rawName.length > MAX_NAME) {
      return res.status(400).json({ error: 'Name is too long' })
    }
    if (!rawEmail || !EMAIL_RE.test(rawEmail)) {
      return res.status(400).json({ error: 'A valid email is required' })
    }
    if (rawEmail.length > MAX_EMAIL) {
      return res.status(400).json({ error: 'Email is too long' })
    }
    if (rawSubject.length > MAX_SUBJECT) {
      return res.status(400).json({ error: 'Subject is too long' })
    }
    if (!rawMessage) {
      return res.status(400).json({ error: 'Message is required' })
    }
    if (rawMessage.length > MAX_MESSAGE) {
      return res.status(400).json({ error: 'Message is too long' })
    }

    await sendContactMessage({
      name: rawName,
      email: rawEmail,
      message: rawMessage,
      subject: rawSubject || undefined,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact form email failed', {
      message: err?.message || String(err),
    })
    return res.status(500).json({
      error: 'Could not send your message. Please try again or email us directly.',
    })
  }
})

export default router
