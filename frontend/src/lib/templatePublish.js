import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api } from './api'
import { listTemplateCollections } from '../samples/registry'

export function buildCollectionSyncPayload() {
  return listTemplateCollections().map((collection) => ({
    collectionId: collection.id,
    source: collection.source,
    templateCount: collection.templateCount,
  }))
}

const STATUS_RANK = { draft: 1, archived: 2, published: 3 }

function normalizeIdList(ids) {
  if (!Array.isArray(ids)) return []
  const seen = new Set()
  const out = []
  for (const id of ids) {
    const key = typeof id === 'string' ? id.trim() : ''
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out
}

/**
 * Prefer published when collapsing duplicate collection rows from the API.
 * Accepts either a status map `{ id: status }` or an array of collection records.
 */
export function mapCollectionPublishState(rowsOrMap) {
  if (!rowsOrMap) return {}
  if (!Array.isArray(rowsOrMap)) {
    const next = {}
    for (const [id, value] of Object.entries(rowsOrMap)) {
      if (typeof value === 'string') next[id] = value
      else if (value && typeof value.status === 'string') next[id] = value.status
    }
    return next
  }

  const next = {}
  for (const row of rowsOrMap) {
    const id = row?.collectionId
    if (!id) continue
    const status = row.status || 'draft'
    const prev = next[id]
    if (!prev || (STATUS_RANK[status] || 0) >= (STATUS_RANK[prev] || 0)) {
      next[id] = status
    }
  }
  return next
}

/**
 * Map of collectionId → unpublished design template ids (deny list).
 * Accepts publish-state `unpublishedDesigns` map or admin sync collection rows.
 */
export function mapUnpublishedDesigns(rowsOrMap) {
  if (!rowsOrMap) return {}
  if (!Array.isArray(rowsOrMap)) {
    const next = {}
    for (const [id, value] of Object.entries(rowsOrMap)) {
      if (Array.isArray(value)) next[id] = normalizeIdList(value)
      else if (value && Array.isArray(value.unpublishedDesignIds)) {
        next[id] = normalizeIdList(value.unpublishedDesignIds)
      }
    }
    return next
  }

  const next = {}
  for (const row of rowsOrMap) {
    const id = row?.collectionId
    if (!id) continue
    const ids = normalizeIdList(row.unpublishedDesignIds)
    const prev = next[id] || []
    next[id] = normalizeIdList([...prev, ...ids])
  }
  return next
}

/**
 * Design is visible to non-admins when the group is published and the design
 * is not on the deny list. Admins (includeUnpublished) see everything.
 */
export function isDesignPublished(
  collectionId,
  templateId,
  {
    collectionPublishMap = {},
    unpublishedDesignsMap = {},
    includeUnpublished = false,
  } = {},
) {
  if (includeUnpublished) return true
  if (!collectionId || !templateId) return false
  if ((collectionPublishMap[collectionId] ?? 'draft') !== 'published') return false
  const denied = unpublishedDesignsMap[collectionId] || []
  return !denied.includes(templateId)
}

export function useTemplatePublish() {
  const { isAdmin } = useAuth()
  const [collectionPublishMap, setCollectionPublishMap] = useState({})
  const [unpublishedDesignsMap, setUnpublishedDesignsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (isAdmin) {
        await api('/api/admin/templates/sync', {
          method: 'POST',
          body: { collections: buildCollectionSyncPayload() },
        })
      }
      const data = await api('/api/templates/publish-state')
      setCollectionPublishMap(mapCollectionPublishState(data.collections || {}))
      setUnpublishedDesignsMap(mapUnpublishedDesigns(data.unpublishedDesigns || {}))
    } catch (err) {
      setError(err?.message || 'Could not load template publish state')
      setCollectionPublishMap({})
      setUnpublishedDesignsMap({})
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    collectionPublishMap,
    unpublishedDesignsMap,
    loading,
    error,
    refresh,
    isAdmin,
    includeUnpublished: isAdmin,
  }
}

export async function setCollectionPublishStatus(collectionId, status) {
  const data = await api(
    `/api/admin/templates/collections/${encodeURIComponent(collectionId)}`,
    {
      method: 'PATCH',
      body: { status },
    },
  )
  return data.collection
}

export async function setDesignPublishStatus(collectionId, templateId, published) {
  const data = await api(
    `/api/admin/templates/collections/${encodeURIComponent(collectionId)}/designs/${encodeURIComponent(templateId)}`,
    {
      method: 'PATCH',
      body: { published },
    },
  )
  return data.collection
}
