import { Router } from 'express'
import { Template } from '../models/Template.js'
import { User } from '../models/User.js'
import {
  listTemplateCollectionRecords,
  serializeTemplateCollection,
  setTemplateCollectionStatus,
  syncTemplateCollectionCatalog,
  dedupeTemplateCollections,
  ensureTemplateIndexes,
} from '../lib/templateCollections.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/overview', async (_req, res) => {
  try {
    await dedupeTemplateCollections()
    await ensureTemplateIndexes()
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [userCount, adminCount, recentLogins, templateTotal, templatePublished, templateDraft] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ lastLoginAt: { $gte: since } }),
        Template.countDocuments(),
        Template.countDocuments({ status: 'published' }),
        Template.countDocuments({ status: 'draft' }),
      ])

    return res.json({
      overview: {
        userCount,
        adminCount,
        activeUsers30d: recentLogins,
        templateTotal,
        templatePublished,
        templateDraft,
      },
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

/** Sync static catalog collections into Mongo (creates draft records for new groups). */
router.post('/templates/sync', async (req, res) => {
  try {
    const records = await syncTemplateCollectionCatalog(req.body?.collections)
    return res.json({
      collections: records.map(serializeTemplateCollection),
    })
  } catch (err) {
    if (err?.status === 400) {
      return res.status(400).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: 'Could not sync template collections' })
  }
})

router.get('/templates', async (_req, res) => {
  try {
    const records = await listTemplateCollectionRecords()
    return res.json({
      collections: records.map(serializeTemplateCollection),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load template collections' })
  }
})

router.patch('/templates/collections/:collectionId', async (req, res) => {
  try {
    const status = req.body?.status
    if (status !== 'draft' && status !== 'published' && status !== 'archived') {
      return res.status(400).json({ error: 'status must be draft, published, or archived' })
    }

    const record = await setTemplateCollectionStatus(
      req.params.collectionId,
      status,
      req.user._id,
    )

    if (!record) {
      return res.status(404).json({ error: 'Collection not found — sync catalog first' })
    }

    return res.json({
      collection: serializeTemplateCollection(record),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not update collection' })
  }
})

export default router
