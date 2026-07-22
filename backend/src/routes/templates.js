import { Router } from 'express'
import { Template } from '../models/Template.js'
import {
  collapseTemplateCollections,
  dedupeTemplateCollections,
  ensureTemplateIndexes,
} from '../lib/templateCollections.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/** Collection publish state for the templates library. */
router.get('/publish-state', requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin'
    await dedupeTemplateCollections()
    await ensureTemplateIndexes()

    const raw = await Template.find(isAdmin ? {} : { status: 'published' }).select(
      'collectionId status publishedAt updatedAt templateCount',
    )
    const records = collapseTemplateCollections(raw)

    const collections = Object.fromEntries(
      records.map((row) => [row.collectionId, row.status]),
    )
    const publishedCollectionIds = records
      .filter((row) => row.status === 'published')
      .map((row) => row.collectionId)

    return res.json({
      collections,
      publishedCollectionIds,
      isAdmin,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load template publish state' })
  }
})

export default router
