import { Category } from '../models/Category.js'
import { Template } from '../models/Template.js'
import {
  dedupeTemplateCollections,
  ensureTemplateIndexes,
  toPlainDesignCategories,
} from './templateCollections.js'

/** Popular seeds — upserted on API startup; never wipe custom categories. */
export const SEED_CATEGORIES = [
  { slug: 'event', label: 'Event', sortOrder: 10, isSeed: true },
  { slug: 'birthday', label: 'Birthday / Happy Birthday', sortOrder: 20, isSeed: true },
  { slug: 'business-flyer', label: 'Business flyer', sortOrder: 30, isSeed: true },
  { slug: 'new-month', label: 'New month', sortOrder: 40, isSeed: true },
]

export function slugifyCategoryLabel(label) {
  const raw = typeof label === 'string' ? label.trim().toLowerCase() : ''
  const slug = raw
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return slug
}

export function serializeCategory(row) {
  if (!row) return null
  if (typeof row.toJSONSafe === 'function') return row.toJSONSafe()
  return {
    id: row._id?.toString?.() || row.id,
    slug: row.slug,
    label: row.label,
    sortOrder: row.sortOrder,
    isSeed: Boolean(row.isSeed),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

/** Ensure seed categories exist. Safe to call repeatedly. */
export async function seedCategories() {
  for (const cat of SEED_CATEGORIES) {
    await Category.updateOne(
      { slug: cat.slug },
      {
        $setOnInsert: {
          slug: cat.slug,
          label: cat.label,
          sortOrder: cat.sortOrder,
          isSeed: true,
        },
      },
      { upsert: true },
    )
  }
  return listCategories()
}

export async function listCategories() {
  const rows = await Category.find().sort({ sortOrder: 1, label: 1 })
  return rows.map(serializeCategory)
}

export async function createCategory(label) {
  const trimmed = typeof label === 'string' ? label.trim() : ''
  if (!trimmed) {
    const error = new Error('label is required')
    error.status = 400
    throw error
  }

  const slug = slugifyCategoryLabel(trimmed)
  if (!slug) {
    const error = new Error('label must contain letters or numbers')
    error.status = 400
    throw error
  }

  const existing = await Category.findOne({ slug })
  if (existing) {
    const error = new Error(`Category already exists: ${slug}`)
    error.status = 409
    throw error
  }

  const maxSort = await Category.findOne().sort({ sortOrder: -1 }).select('sortOrder')
  const sortOrder = (Number(maxSort?.sortOrder) || 0) + 10

  const row = await Category.create({
    slug,
    label: trimmed,
    sortOrder,
    isSeed: false,
  })
  return serializeCategory(row)
}

export async function findCategoryBySlug(slug) {
  const key = typeof slug === 'string' ? slug.trim().toLowerCase() : ''
  if (!key) return null
  return Category.findOne({ slug: key })
}

/**
 * Set or clear a design's primary category on the Template collection doc.
 * categorySlug null/empty clears. Sync never wipes designCategories.
 */
export async function setDesignCategory(collectionId, templateId, categorySlug) {
  const designId = typeof templateId === 'string' ? templateId.trim() : ''
  if (!collectionId || !designId) {
    const error = new Error('collectionId and templateId required')
    error.status = 400
    throw error
  }

  let nextSlug = null
  if (categorySlug != null && String(categorySlug).trim() !== '') {
    nextSlug = String(categorySlug).trim().toLowerCase()
    const cat = await findCategoryBySlug(nextSlug)
    if (!cat) {
      const error = new Error(`Unknown category: ${nextSlug}`)
      error.status = 400
      throw error
    }
  }

  await dedupeTemplateCollections()
  await ensureTemplateIndexes()

  const row = await Template.findOne({ collectionId })
  if (!row) return null

  const map = toPlainDesignCategories(row.designCategories)
  if (nextSlug) map[designId] = nextSlug
  else delete map[designId]

  row.designCategories = map
  row.markModified('designCategories')
  await row.save()
  return row
}

/**
 * Build collectionId → { templateId: categorySlug } from Template rows.
 * Optionally omit designs on the unpublished deny list (for public payloads).
 */
export function buildDesignCategoriesMap(records, { omitUnpublishedDesigns = false } = {}) {
  const out = {}
  for (const row of records || []) {
    const collectionId = row?.collectionId
    if (!collectionId) continue
    const cats = toPlainDesignCategories(row.designCategories)
    if (!Object.keys(cats).length) continue

    if (!omitUnpublishedDesigns) {
      out[collectionId] = cats
      continue
    }

    const denied = new Set(
      Array.isArray(row.unpublishedDesignIds) ? row.unpublishedDesignIds : [],
    )
    const filtered = {}
    for (const [templateId, slug] of Object.entries(cats)) {
      if (denied.has(templateId)) continue
      filtered[templateId] = slug
    }
    if (Object.keys(filtered).length) out[collectionId] = filtered
  }
  return out
}

/** Slugs referenced by a designCategories map ({ collectionId: { templateId: slug } }). */
export function collectUsedCategorySlugs(designCategoriesMap) {
  const used = new Set()
  for (const byDesign of Object.values(designCategoriesMap || {})) {
    if (!byDesign || typeof byDesign !== 'object') continue
    for (const slug of Object.values(byDesign)) {
      if (typeof slug === 'string' && slug) used.add(slug)
    }
  }
  return used
}

/**
 * Public-safe category list: only catalog rows assigned to at least one
 * published (non-denied) design. Unused / draft-only categories stay private.
 */
export function filterCategoriesForPublic(categories, designCategoriesMap) {
  const used = collectUsedCategorySlugs(designCategoriesMap)
  return (categories || []).filter((cat) => cat?.slug && used.has(cat.slug))
}
