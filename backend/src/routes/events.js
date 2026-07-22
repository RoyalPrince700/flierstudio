import { Router } from 'express'
import { Event } from '../models/Event.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const ALLOWED_ACTIONS = new Set([
  'view',
  'select',
  'edit',
  'upload_photo',
  'download',
  'favorite',
])

router.post('/', requireAuth, async (req, res) => {
  try {
    const action = req.body?.action
    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return res.status(400).json({ error: 'Invalid action' })
    }

    const projectId = String(req.body?.projectId || '').slice(0, 120)
    const designId = String(req.body?.designId || '').slice(0, 120)
    const meta =
      req.body?.meta && typeof req.body.meta === 'object' ? req.body.meta : {}

    await Event.create({
      userId: req.user._id,
      action,
      projectId,
      designId,
      meta,
    })

    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not record event' })
  }
})

export default router
