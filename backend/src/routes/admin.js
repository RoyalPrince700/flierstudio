import { Router } from 'express'
import { Event } from '../models/Event.js'
import { User } from '../models/User.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/overview', async (_req, res) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [userCount, adminCount, eventCount, recentLogins, topDesigns] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      Event.countDocuments({ createdAt: { $gte: since } }),
      User.countDocuments({ lastLoginAt: { $gte: since } }),
      Event.aggregate([
        {
          $match: {
            action: { $in: ['download', 'select', 'edit'] },
            createdAt: { $gte: since },
            designId: { $ne: '' },
          },
        },
        {
          $group: {
            _id: { projectId: '$projectId', designId: '$designId', action: '$action' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
    ])

    return res.json({
      overview: {
        userCount,
        adminCount,
        eventCount30d: eventCount,
        activeUsers30d: recentLogins,
      },
      topDesigns: topDesigns.map((row) => ({
        projectId: row._id.projectId,
        designId: row._id.designId,
        action: row._id.action,
        count: row.count,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load admin overview' })
  }
})

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(200)
    return res.json({ users: users.map((u) => u.toSafeJSON()) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load users' })
  }
})

router.get('/events', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200)
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email avatar role')

    return res.json({
      events: events.map((event) => ({
        id: event._id.toString(),
        action: event.action,
        projectId: event.projectId,
        designId: event.designId,
        meta: event.meta,
        createdAt: event.createdAt,
        user: event.userId
          ? {
              id: event.userId._id.toString(),
              name: event.userId.name,
              email: event.userId.email,
              avatar: event.userId.avatar,
              role: event.userId.role,
            }
          : null,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load events' })
  }
})

router.patch('/users/:id/role', async (req, res) => {
  try {
    const role = req.body?.role
    if (role !== 'user' && role !== 'admin') {
      return res.status(400).json({ error: 'role must be user or admin' })
    }

    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own admin role' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    )
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json({ user: user.toSafeJSON() })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not update role' })
  }
})

export default router
