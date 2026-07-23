import { Router } from 'express'
import { Template } from '../models/Template.js'
import {
  collapseTemplateCollections,
  dedupeTemplateCollections,
  ensureTemplateIndexes,
  normalizeUnpublishedDesignIds,
} from '../lib/templateCollections.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * Collection + per-design publish state for the templates library.
 *
 * Visibility for non-admins:
 * 1) Group status must be published
 * 2) Design must not appear in unpublishedDesignIds (deny list; missing = published)
 */
router.get('/publish-state', requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin'
    await dedupeTemplateCollections()
    await ensureTemplateIndexes()

    const raw = await Template.find(isAdmin ? {} : { status: 'published' }).select(
      'collectionId status publishedAt updatedAt templateCount unpublishedDesignIds',
    )
    const records = collapseTemplateCollections(raw)

    const collections = Object.fromEntries(
      records.map((row) => [row.collectionId, row.status]),
    )
    const unpublishedDesigns = Object.fromEntries(
      records.map((row) => [
        row.collectionId,
        normalizeUnpublishedDesignIds(row.unpublishedDesignIds),
      ]),
    )
    const publishedCollectionIds = records
      .filter((row) => row.status === 'published')
      .map((row) => row.collectionId)

    return res.json({
      collections,
      unpublishedDesigns,
      publishedCollectionIds,
      isAdmin,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load template publish state' })
  }
})

export default router
