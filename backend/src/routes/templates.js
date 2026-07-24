import { Router } from 'express'
import { Template } from '../models/Template.js'
import {
  buildDesignCategoriesMap,
  filterCategoriesForPublic,
  listCategories,
} from '../lib/categories.js'
import {
  collapseTemplateCollections,
  dedupeTemplateCollections,
  ensureTemplateIndexes,
  normalizeUnpublishedDesignIds,
} from '../lib/templateCollections.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * Build the collections / unpublishedDesigns / publishedCollectionIds maps
 * from collapsed Template rows. Callers decide which rows to include.
 *
 * @param {object} options
 * @param {boolean} [options.includeCategories]
 * @param {object[]} [options.categories] full catalog from DB
 * @param {boolean} [options.omitUnpublishedDesigns] strip deny-listed design assignments
 * @param {boolean} [options.publicCategoryCatalog] only categories used by remaining assignments
 */
function buildPublishStatePayload(
  records,
  {
    includeCategories = false,
    categories = [],
    omitUnpublishedDesigns = false,
    publicCategoryCatalog = false,
  } = {},
) {
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

  const payload = { collections, unpublishedDesigns, publishedCollectionIds }

  if (includeCategories) {
    const designCategories = buildDesignCategoriesMap(records, {
      omitUnpublishedDesigns,
    })
    payload.designCategories = designCategories
    payload.categories = publicCategoryCatalog
      ? filterCategoriesForPublic(categories, designCategories)
      : categories
  }

  return payload
}

/**
 * Categories used by at least one publicly visible published design.
 * No auth. Does not expose draft collection inventory.
 */
router.get('/categories', async (_req, res) => {
  try {
    await dedupeTemplateCollections()
    await ensureTemplateIndexes()

    const [raw, categories] = await Promise.all([
      Template.find({ status: 'published' }).select(
        'collectionId status unpublishedDesignIds designCategories',
      ),
      listCategories(),
    ])
    const records = collapseTemplateCollections(raw).filter(
      (row) => row.status === 'published',
    )
    const designCategories = buildDesignCategoriesMap(records, {
      omitUnpublishedDesigns: true,
    })

    return res.json({
      categories: filterCategoriesForPublic(categories, designCategories),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load categories' })
  }
})

/**
 * Public marketing visibility — no auth.
 * Returns only published collections and their per-design deny lists.
 * Draft/archived inventory and admin fields are never included.
 * Categories = catalog rows assigned to visible published designs only.
 * designCategories omits deny-listed designs.
 */
router.get('/publish-state/public', async (_req, res) => {
  try {
    await dedupeTemplateCollections()
    await ensureTemplateIndexes()

    const [raw, categories] = await Promise.all([
      Template.find({ status: 'published' }).select(
        'collectionId status unpublishedDesignIds designCategories',
      ),
      listCategories(),
    ])
    const records = collapseTemplateCollections(raw).filter(
      (row) => row.status === 'published',
    )

    return res.json(
      buildPublishStatePayload(records, {
        includeCategories: true,
        categories,
        omitUnpublishedDesigns: true,
        publicCategoryCatalog: true,
      }),
    )
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load public template publish state' })
  }
})

/**
 * Collection + per-design publish state for the templates library (Studio).
 *
 * Visibility for non-admins:
 * 1) Group status must be published
 * 2) Design must not appear in unpublishedDesignIds (deny list; missing = published)
 *
 * Includes full category catalog + designCategories (admins see drafts too).
 */
router.get('/publish-state', requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin'
    await dedupeTemplateCollections()
    await ensureTemplateIndexes()

    const [raw, categories] = await Promise.all([
      Template.find(isAdmin ? {} : { status: 'published' }).select(
        'collectionId status publishedAt updatedAt templateCount unpublishedDesignIds designCategories',
      ),
      listCategories(),
    ])
    const records = collapseTemplateCollections(raw)

    return res.json({
      ...buildPublishStatePayload(records, {
        includeCategories: true,
        categories,
        // Non-admins: hide deny-listed design assignments; full catalog for Studio.
        omitUnpublishedDesigns: !isAdmin,
        publicCategoryCatalog: false,
      }),
      isAdmin,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Could not load template publish state' })
  }
})

export default router
