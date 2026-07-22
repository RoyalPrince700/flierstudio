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

/** Prefer published when collapsing duplicate collection rows from the API. */
export function mapCollectionPublishState(rowsOrMap) {
  if (!rowsOrMap) return {}
  if (!Array.isArray(rowsOrMap)) return { ...rowsOrMap }

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

export function useTemplatePublish() {
  const { isAdmin } = useAuth()
  const [collectionPublishMap, setCollectionPublishMap] = useState({})
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
    } catch (err) {
      setError(err?.message || 'Could not load template publish state')
      setCollectionPublishMap({})
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    collectionPublishMap,
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
