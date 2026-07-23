import { Template } from '../models/Template.js'

const STATUS_RANK = { draft: 1, archived: 2, published: 3 }

let indexesReady = false

function statusRank(status) {
  return STATUS_RANK[status] || 0
}

/** Pick the canonical row when duplicate collectionIds exist. */
export function pickCanonicalTemplate(docs) {
  if (!docs?.length) return null
  return docs.reduce((best, row) => {
    if (!best) return row
    const rankDiff = statusRank(row.status) - statusRank(best.status)
    if (rankDiff > 0) return row
    if (rankDiff < 0) return best
    const bestTime = new Date(best.updatedAt || 0).getTime()
    const rowTime = new Date(row.updatedAt || 0).getTime()
    if (rowTime !== bestTime) return rowTime > bestTime ? row : best
    const bestCount = Number(best.templateCount) || 0
    const rowCount = Number(row.templateCount) || 0
    if (rowCount !== bestCount) return rowCount > bestCount ? row : best
    return String(best._id) < String(row._id) ? best : row
  }, null)
}

export function normalizeUnpublishedDesignIds(ids) {
  if (!Array.isArray(ids)) return []
  const seen = new Set()
  const out = []
  for (const id of ids) {
    const key = typeof id === 'string' ? id.trim() : ''
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out.sort((a, b) => a.localeCompare(b))
}

export function serializeTemplateCollection(row) {
  return {
    collectionId: row.collectionId,
    source: row.source,
    templateCount: row.templateCount,
    status: row.status,
    unpublishedDesignIds: normalizeUnpublishedDesignIds(row.unpublishedDesignIds),
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
  }
}

/** Collapse rows by collectionId, preferring published over draft. */
export function collapseTemplateCollections(rows) {
  const byId = new Map()
  for (const row of rows) {
    const prev = byId.get(row.collectionId)
    byId.set(row.collectionId, pickCanonicalTemplate(prev ? [prev, row] : [row]))
  }
  return [...byId.values()].sort((a, b) => a.collectionId.localeCompare(b.collectionId))
}

/**
 * Drop legacy per-flier unique index and ensure collectionId is unique.
 * Call only after duplicates are removed.
 * Safe to call repeatedly; runs once per process after first success.
 */
export async function ensureTemplateIndexes() {
  if (indexesReady) return
  try {
    await Template.collection.dropIndex('templateId_1')
  } catch (err) {
    if (err?.code !== 27 && err?.codeName !== 'IndexNotFound') {
      console.warn('Could not drop legacy templateId index:', err.message)
    }
  }

  // Replace a non-unique collectionId index with a unique one after dedupe.
  try {
    const indexes = await Template.collection.indexes()
    const collectionIdIndex = indexes.find(
      (idx) => idx.name === 'collectionId_1' || (idx.key?.collectionId === 1 && !idx.unique),
    )
    if (collectionIdIndex && !collectionIdIndex.unique) {
      await Template.collection.dropIndex(collectionIdIndex.name)
    }
  } catch (err) {
    if (err?.code !== 27 && err?.codeName !== 'IndexNotFound') {
      console.warn('Could not refresh collectionId index:', err.message)
    }
  }

  await Template.syncIndexes()
  indexesReady = true
}

/**
 * Keep one document per collectionId.
 * Preserves published/archived over draft; never demotes a published group.
 */
export async function dedupeTemplateCollections() {
  const groups = await Template.aggregate([
    {
      $group: {
        _id: '$collectionId',
        count: { $sum: 1 },
        ids: { $push: '$_id' },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ])

  for (const group of groups) {
    const docs = await Template.find({ collectionId: group._id })
    const winner = pickCanonicalTemplate(docs)
    if (!winner) continue

    const mergedCount = Math.max(
      0,
      ...docs.map((doc) => Number(doc.templateCount) || 0),
    )
    const mergedUnpublished = normalizeUnpublishedDesignIds(
      docs.flatMap((doc) => doc.unpublishedDesignIds || []),
    )
    const patch = {}
    if ((Number(winner.templateCount) || 0) < mergedCount) {
      patch.templateCount = mergedCount
    }
    if (!winner.source) {
      const withSource = docs.find((doc) => doc.source)
      if (withSource?.source) patch.source = withSource.source
    }
    const winnerUnpublished = normalizeUnpublishedDesignIds(winner.unpublishedDesignIds)
    if (mergedUnpublished.join('\0') !== winnerUnpublished.join('\0')) {
      patch.unpublishedDesignIds = mergedUnpublished
    }
    if (Object.keys(patch).length) {
      await Template.updateOne({ _id: winner._id }, { $set: patch })
    }

    await Template.deleteMany({
      collectionId: group._id,
      _id: { $ne: winner._id },
    })
  }
}

/**
 * Upsert catalog rows without resetting publish status or per-design overrides.
 * Creates missing collections as draft only ($setOnInsert).
 * New designs default to published (not present in unpublishedDesignIds).
 */
export async function syncTemplateCollectionCatalog(entries) {
  const valid = (Array.isArray(entries) ? entries : []).filter(
    (row) =>
      row?.collectionId &&
      (row.source === 'project' || row.source === 'analyzed'),
  )

  if (!valid.length) {
    const error = new Error('collections array required')
    error.status = 400
    throw error
  }

  // Dedupe before unique index + upserts so legacy per-flier rows cannot demote publish state.
  await dedupeTemplateCollections()
  await ensureTemplateIndexes()

  const ops = valid.map((row) => ({
    updateOne: {
      filter: { collectionId: row.collectionId },
      update: {
        $set: {
          templateCount: Number(row.templateCount) || 0,
          source: row.source,
        },
        $setOnInsert: {
          collectionId: row.collectionId,
          status: 'draft',
          unpublishedDesignIds: [],
        },
      },
      upsert: true,
    },
  }))

  try {
    await Template.bulkWrite(ops, { ordered: false })
  } catch (err) {
    // Duplicate key can still happen if a race inserts twice; clean up and continue.
    if (err?.code !== 11000) throw err
    await dedupeTemplateCollections()
  }

  await dedupeTemplateCollections()

  return collapseTemplateCollections(await Template.find().sort({ collectionId: 1 }))
}

export async function listTemplateCollectionRecords() {
  await dedupeTemplateCollections()
  await ensureTemplateIndexes()
  return collapseTemplateCollections(await Template.find().sort({ collectionId: 1 }))
}

export async function setTemplateCollectionStatus(collectionId, status, userId) {
  await dedupeTemplateCollections()
  await ensureTemplateIndexes()

  const patch = { status }
  if (status === 'published') {
    patch.publishedAt = new Date()
    patch.publishedBy = userId
  } else {
    patch.publishedAt = null
    patch.publishedBy = null
  }

  // Update every matching row first (legacy duplicates), then collapse.
  const updated = await Template.updateMany({ collectionId }, { $set: patch })
  if (!updated.matchedCount) {
    return null
  }

  await dedupeTemplateCollections()
  return Template.findOne({ collectionId })
}

/**
 * Set per-design publish inside a collection.
 * published:false adds templateId to the deny list; published:true removes it.
 * Does not change group status. Sync never clears these overrides.
 */
export async function setTemplateDesignPublished(collectionId, templateId, published) {
  const designId = typeof templateId === 'string' ? templateId.trim() : ''
  if (!collectionId || !designId) {
    const error = new Error('collectionId and templateId required')
    error.status = 400
    throw error
  }

  await dedupeTemplateCollections()
  await ensureTemplateIndexes()

  const row = await Template.findOne({ collectionId })
  if (!row) return null

  const current = new Set(normalizeUnpublishedDesignIds(row.unpublishedDesignIds))
  if (published) current.delete(designId)
  else current.add(designId)

  const next = normalizeUnpublishedDesignIds([...current])
  row.unpublishedDesignIds = next
  await row.save()
  return row
}
