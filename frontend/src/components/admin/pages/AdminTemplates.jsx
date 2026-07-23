import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, ExternalLink, RefreshCw, Search } from 'lucide-react'
import { listTemplateCollections } from '../../../samples/registry'
import {
  buildCollectionSyncPayload,
  mapCollectionPublishState,
  mapUnpublishedDesigns,
  setCollectionPublishStatus,
  setDesignPublishStatus,
} from '../../../lib/templatePublish'
import { api } from '../../../lib/api'
import SamplePreview from '../../SamplePreview'
import '../../SamplesBoard.css'

const THUMB_WIDTH = 220
const THUMB_HEIGHT = 200

const SEGMENTS = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'unpublished', label: 'Unpublished' },
]

function designIsPublished(collectionId, templateId, unpublishedDesignsMap) {
  const denied = unpublishedDesignsMap[collectionId] || []
  return !denied.includes(templateId)
}

function CollectionCard({
  collection,
  status,
  unpublishedDesignsMap,
  expanded,
  onToggleExpand,
  busy,
  busyDesignId,
  onTogglePublish,
  onToggleDesignPublish,
}) {
  const isPublished = status === 'published'
  const unpublishedCount = (collection.templates || []).filter(
    (template) => !designIsPublished(collection.id, template.id, unpublishedDesignsMap),
  ).length

  return (
    <article
      className={`samples-card admin-templates__card${expanded ? ' admin-templates__card--expanded' : ''}`}
      style={{ '--samples-accent': collection.color }}
    >
      <div className="samples-card__art">
        {collection.cover ? (
          <SamplePreview
            template={collection.cover}
            frameWidth={THUMB_WIDTH}
            frameHeight={THUMB_HEIGHT}
            fit="contain"
          />
        ) : (
          <div className="samples-card__empty">No templates</div>
        )}
        <span className="samples-card__badge">
          {collection.templateCount} template
          {collection.templateCount === 1 ? '' : 's'}
        </span>
        <span
          className={`admin-templates__status samples-card__badge samples-card__badge--draft${isPublished ? ' admin-templates__status--published' : ''}`}
        >
          {isPublished ? 'Published' : 'Draft'}
        </span>
        {isPublished && unpublishedCount > 0 ? (
          <span className="samples-card__badge samples-card__badge--draft admin-templates__status-partial">
            {unpublishedCount} design{unpublishedCount === 1 ? '' : 's'} hidden
          </span>
        ) : null}
      </div>
      <div className="samples-card__body">
        <span className="samples-card__swatch" style={{ background: collection.color }} />
        <div className="samples-card__text">
          <strong>{collection.name}</strong>
          <small>{collection.brand}</small>
          <em>{collection.description}</em>
        </div>
      </div>
      <div className="admin-templates__card-actions">
        <button
          type="button"
          className="admin-board__mini admin-board__mini--ghost"
          onClick={() => onToggleExpand(collection.id)}
          aria-expanded={expanded}
        >
          {expanded ? <ChevronDown size={12} strokeWidth={2.25} /> : <ChevronRight size={12} strokeWidth={2.25} />}
          {expanded ? 'Hide designs' : 'Manage designs'}
        </button>
        <Link
          to={`/templates?collection=${encodeURIComponent(collection.id)}`}
          className="admin-board__mini admin-board__mini--ghost"
        >
          <ExternalLink size={12} strokeWidth={2.25} />
          Open group
        </Link>
        <button
          type="button"
          className={`admin-board__mini${isPublished ? '' : ' admin-board__mini--primary'}`}
          disabled={busy}
          onClick={() => onTogglePublish(collection.id, status)}
        >
          {isPublished ? 'Unpublish group' : 'Publish group'}
        </button>
      </div>
      {expanded ? (
        <ul className="admin-templates__designs">
          {(collection.templates || []).map((template) => {
            const designPublished = designIsPublished(
              collection.id,
              template.id,
              unpublishedDesignsMap,
            )
            const designBusy = busyDesignId === `${collection.id}:${template.id}`
            return (
              <li key={template.id} className="admin-templates__design">
                <div className="admin-templates__design-meta">
                  <strong>{template.name}</strong>
                  <code>{template.id}</code>
                  <span
                    className={`admin-templates__design-badge${designPublished ? ' is-published' : ''}`}
                  >
                    {designPublished ? 'Published' : 'Unpublished'}
                  </span>
                  {isPublished && !designPublished ? (
                    <span className="admin-templates__design-note">Hidden from non-admins</span>
                  ) : null}
                  {!isPublished && designPublished ? (
                    <span className="admin-templates__design-note">
                      Group draft — not public yet
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={`admin-board__mini${designPublished ? '' : ' admin-board__mini--primary'}`}
                  disabled={designBusy || busy}
                  onClick={() =>
                    onToggleDesignPublish(collection.id, template.id, designPublished)
                  }
                >
                  {designPublished ? 'Unpublish' : 'Publish'}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </article>
  )
}

function SegmentSection({
  title,
  count,
  emptyTitle,
  emptyCopy,
  collections,
  collectionPublishMap,
  unpublishedDesignsMap,
  expandedId,
  busyId,
  busyDesignId,
  onToggleExpand,
  onTogglePublish,
  onToggleDesignPublish,
}) {
  return (
    <section className="admin-templates__segment">
      <header className="admin-templates__segment-head">
        <h2 className="admin-templates__segment-title">{title}</h2>
        <span className="admin-templates__segment-count">{count}</span>
      </header>
      {collections.length ? (
        <div className="samples-board__grid">
          {collections.map((collection) => {
            const status = collectionPublishMap[collection.id] ?? 'draft'
            return (
              <CollectionCard
                key={collection.id}
                collection={collection}
                status={status}
                unpublishedDesignsMap={unpublishedDesignsMap}
                expanded={expandedId === collection.id}
                onToggleExpand={onToggleExpand}
                busy={busyId === collection.id}
                busyDesignId={busyDesignId}
                onTogglePublish={onTogglePublish}
                onToggleDesignPublish={onToggleDesignPublish}
              />
            )
          })}
        </div>
      ) : (
        <div className="samples-board__blank admin-templates__segment-empty">
          <h2>{emptyTitle}</h2>
          <p>{emptyCopy}</p>
        </div>
      )}
    </section>
  )
}

export default function AdminTemplates() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [collectionPublishMap, setCollectionPublishMap] = useState({})
  const [unpublishedDesignsMap, setUnpublishedDesignsMap] = useState({})
  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState('all')
  const [busyId, setBusyId] = useState(null)
  const [busyDesignId, setBusyDesignId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const collections = useMemo(() => listTemplateCollections(), [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api('/api/admin/templates/sync', {
        method: 'POST',
        body: { collections: buildCollectionSyncPayload() },
      })
      const rows = data.collections || []
      setCollectionPublishMap(mapCollectionPublishState(rows))
      setUnpublishedDesignsMap(mapUnpublishedDesigns(rows))
    } catch (err) {
      setError(err?.message || 'Could not load template collections')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function togglePublish(collectionId, currentStatus) {
    setBusyId(collectionId)
    setError('')
    try {
      const nextStatus = currentStatus === 'published' ? 'draft' : 'published'
      const row = await setCollectionPublishStatus(collectionId, nextStatus)
      setCollectionPublishMap((prev) => ({
        ...prev,
        [collectionId]: row?.status || nextStatus,
      }))
      if (row?.unpublishedDesignIds) {
        setUnpublishedDesignsMap((prev) => ({
          ...prev,
          [collectionId]: row.unpublishedDesignIds,
        }))
      }
    } catch (err) {
      setError(err?.message || 'Could not update collection')
    } finally {
      setBusyId(null)
    }
  }

  async function toggleDesignPublish(collectionId, templateId, currentlyPublished) {
    const key = `${collectionId}:${templateId}`
    setBusyDesignId(key)
    setError('')
    try {
      const row = await setDesignPublishStatus(collectionId, templateId, !currentlyPublished)
      setUnpublishedDesignsMap((prev) => ({
        ...prev,
        [collectionId]: row?.unpublishedDesignIds || [],
      }))
      if (row?.status) {
        setCollectionPublishMap((prev) => ({
          ...prev,
          [collectionId]: row.status,
        }))
      }
    } catch (err) {
      setError(err?.message || 'Could not update design')
    } finally {
      setBusyDesignId(null)
    }
  }

  function toggleExpand(collectionId) {
    setExpandedId((prev) => (prev === collectionId ? null : collectionId))
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return collections
    return collections.filter(
      (collection) =>
        collection.id.includes(q) ||
        collection.name.toLowerCase().includes(q) ||
        collection.brand.toLowerCase().includes(q) ||
        collection.description.toLowerCase().includes(q) ||
        collection.templates.some(
          (template) =>
            template.id.includes(q) || template.name.toLowerCase().includes(q),
        ),
    )
  }, [collections, query])

  const { published, unpublished } = useMemo(() => {
    const publishedList = []
    const unpublishedList = []
    for (const collection of filtered) {
      const status = collectionPublishMap[collection.id] ?? 'draft'
      if (status === 'published') publishedList.push(collection)
      else unpublishedList.push(collection)
    }
    return { published: publishedList, unpublished: unpublishedList }
  }, [filtered, collectionPublishMap])

  const publishedCount = published.length
  const unpublishedCount = unpublished.length
  const showPublished = segment === 'all' || segment === 'published'
  const showUnpublished = segment === 'all' || segment === 'unpublished'
  const noMatches =
    (segment === 'all' && !publishedCount && !unpublishedCount) ||
    (segment === 'published' && !publishedCount) ||
    (segment === 'unpublished' && !unpublishedCount)

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Templates</h1>
          <p className="admin-page__copy">
            Manage template groups and individual designs. A group must be published for any of
            its fliers to appear on <Link to="/templates">/templates</Link>; you can still
            unpublish specific designs inside a published group. Open a group in the studio to QA
            before publishing.
          </p>
        </div>
        <button type="button" className="admin-board__refresh" onClick={load} disabled={loading}>
          <RefreshCw size={14} strokeWidth={2.25} />
          Sync & refresh
        </button>
      </div>

      {error ? <p className="admin-board__error">{error}</p> : null}
      {loading ? <p className="admin-board__status">Syncing catalog…</p> : null}

      <div className="admin-board__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-board__stat">
          <span className="admin-board__stat-label">Groups</span>
          <strong>{collections.length}</strong>
        </div>
        <div className="admin-board__stat">
          <span className="admin-board__stat-label">Published</span>
          <strong>
            {loading
              ? '—'
              : Object.values(collectionPublishMap).filter((s) => s === 'published').length}
          </strong>
        </div>
        <div className="admin-board__stat">
          <span className="admin-board__stat-label">Draft / hidden</span>
          <strong>
            {loading
              ? '—'
              : collections.length -
                Object.values(collectionPublishMap).filter((s) => s === 'published').length}
          </strong>
        </div>
      </div>

      <div className="admin-templates__toolbar">
        <label className="admin-templates__filter">
          <Search size={14} strokeWidth={2.25} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search groups or designs…"
          />
        </label>
        <div className="admin-templates__segments" role="tablist" aria-label="Publish status">
          {SEGMENTS.map((item) => {
            const count =
              item.id === 'published'
                ? publishedCount
                : item.id === 'unpublished'
                  ? unpublishedCount
                  : publishedCount + unpublishedCount
            const active = segment === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`admin-templates__segment-tab${active ? ' is-active' : ''}`}
                onClick={() => setSegment(item.id)}
              >
                {item.label}
                <span className="admin-templates__segment-tab-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="admin-templates__segment-summary" aria-live="polite">
        Published {publishedCount}
        <span aria-hidden="true"> · </span>
        Unpublished {unpublishedCount}
      </p>

      <div className="samples-board samples-board--grid admin-templates__grid">
        <div className="samples-board__scroll admin-templates__scroll">
          {noMatches ? (
            <div className="samples-board__blank">
              <h2>{query.trim() ? 'No groups match' : 'No groups here'}</h2>
              <p>
                {query.trim()
                  ? 'Try another search term or switch segments.'
                  : segment === 'published'
                    ? 'Publish a group to see it here.'
                    : segment === 'unpublished'
                      ? 'All matching groups are published.'
                      : 'Sync the catalog to load template groups.'}
              </p>
            </div>
          ) : (
            <div className="admin-templates__segments-stack">
              {showPublished ? (
                <SegmentSection
                  title="Published"
                  count={publishedCount}
                  emptyTitle="No published groups"
                  emptyCopy={
                    query.trim()
                      ? 'No published groups match this search.'
                      : 'Publish a group, then manage individual designs if needed.'
                  }
                  collections={published}
                  collectionPublishMap={collectionPublishMap}
                  unpublishedDesignsMap={unpublishedDesignsMap}
                  expandedId={expandedId}
                  busyId={busyId}
                  busyDesignId={busyDesignId}
                  onToggleExpand={toggleExpand}
                  onTogglePublish={togglePublish}
                  onToggleDesignPublish={toggleDesignPublish}
                />
              ) : null}
              {showUnpublished ? (
                <SegmentSection
                  title="Unpublished"
                  count={unpublishedCount}
                  emptyTitle="No unpublished groups"
                  emptyCopy={
                    query.trim()
                      ? 'No draft or hidden groups match this search.'
                      : 'Draft and hidden groups will appear here.'
                  }
                  collections={unpublished}
                  collectionPublishMap={collectionPublishMap}
                  unpublishedDesignsMap={unpublishedDesignsMap}
                  expandedId={expandedId}
                  busyId={busyId}
                  busyDesignId={busyDesignId}
                  onToggleExpand={toggleExpand}
                  onTogglePublish={togglePublish}
                  onToggleDesignPublish={toggleDesignPublish}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
