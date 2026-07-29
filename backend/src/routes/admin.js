import { Router } from 'express'
import { Template } from '../models/Template.js'
import { User } from '../models/User.js'
import {
  createCategory,
  listCategories,
  setDesignCategory,
} from '../lib/categories.js'
import {
  listTemplateCollectionRecords,
  serializeTemplateCollection,
  setTemplateCollectionStatus,
  setTemplateDesignPublished,
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

router.delete('/users/:id', async (req, res) => {
  try {
    const targetId = req.params.id

    if (targetId === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own account' })
    }

    const user = await User.findById(targetId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' })
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last remaining admin' })
      }
    }

    await User.deleteOne({ _id: user._id })
    return res.json({ ok: true, deletedId: user._id.toString() })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not delete user' })
  }
})

/** Category catalog — seeds + admin-created custom labels. */
router.get('/categories', async (_req, res) => {
  try {
    const categories = await listCategories()
    return res.json({ categories })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load categories' })
  }
})

router.post('/categories', async (req, res) => {
  try {
    const category = await createCategory(req.body?.label)
    return res.status(201).json({ category })
  } catch (err) {
    if (err?.status === 400 || err?.status === 409) {
      return res.status(err.status).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: 'Could not create category' })
  }
})

/** Sync static catalog collections into Mongo (creates draft records for new groups). */
router.post('/templates/sync', async (req, res) => {
  try {
    const records = await syncTemplateCollectionCatalog(req.body?.collections)
    const categories = await listCategories()
    return res.json({
      collections: records.map(serializeTemplateCollection),
      categories,
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
    const [records, categories] = await Promise.all([
      listTemplateCollectionRecords(),
      listCategories(),
    ])
    return res.json({
      collections: records.map(serializeTemplateCollection),
      categories,
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

/** Per-design publish inside a collection (deny-list override; group status unchanged). */
router.patch('/templates/collections/:collectionId/designs/:templateId', async (req, res) => {
  try {
    const published = req.body?.published
    if (typeof published !== 'boolean') {
      return res.status(400).json({ error: 'published must be true or false' })
    }

    const record = await setTemplateDesignPublished(
      req.params.collectionId,
      req.params.templateId,
      published,
    )

    if (!record) {
      return res.status(404).json({ error: 'Collection not found — sync catalog first' })
    }

    return res.json({
      collection: serializeTemplateCollection(record),
    })
  } catch (err) {
    if (err?.status === 400) {
      return res.status(400).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: 'Could not update design publish state' })
  }
})

/**
 * Set or clear a design's primary category.
 * Body: { category: "event" } or { category: null } to clear.
 */
router.patch(
  '/templates/collections/:collectionId/designs/:templateId/category',
  async (req, res) => {
    try {
      if (!Object.prototype.hasOwnProperty.call(req.body || {}, 'category')) {
        return res.status(400).json({ error: 'category is required (slug string or null to clear)' })
      }

      const record = await setDesignCategory(
        req.params.collectionId,
        req.params.templateId,
        req.body.category,
      )

      if (!record) {
        return res.status(404).json({ error: 'Collection not found — sync catalog first' })
      }

      return res.json({
        collection: serializeTemplateCollection(record),
      })
    } catch (err) {
      if (err?.status === 400) {
        return res.status(400).json({ error: err.message })
      }
      console.error(err)
      return res.status(500).json({ error: 'Could not update design category' })
    }
  },
)

export default router
