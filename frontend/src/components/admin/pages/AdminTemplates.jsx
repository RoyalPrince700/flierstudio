import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, ExternalLink, RefreshCw, Search } from 'lucide-react'
import { listTemplateCollections } from '../../../samples/registry'
import {
  buildCollectionSyncPayload,
  createCategory,
  mapCollectionPublishState,
  mapDesignCategories,
  mapUnpublishedDesigns,
  normalizeCategories,
  setCollectionPublishStatus,
  setDesignCategory,
  setDesignPublishStatus,
} from '../../../lib/templatePublish'
import { api } from '../../../lib/api'
import SamplePreview from '../../SamplePreview'
import '../../SamplesBoard.css'

const THUMB_WIDTH = 220
const THUMB_HEIGHT = 200
const ADD_CATEGORY_VALUE = '__add__'

const SEGMENTS = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'unpublished', label: 'Unpublished' },
]

function designIsPublished(collectionId, templateId, unpublishedDesignsMap) {
  const denied = unpublishedDesignsMap[collectionId] || []
  return !denied.includes(templateId)
}

function categoryLabelForSlug(categories, slug) {
  if (!slug) return null
  const match = categories.find((cat) => cat.slug === slug)
  return match?.label || slug
}

function DesignCategoryControl({
  collectionId,
  templateId,
  categories,
  currentSlug,
  busy,
  adding,
  onSelectCategory,
  onStartAdd,
  onCancelAdd,
  onCreateAndAssign,
}) {
  const [newLabel, setNewLabel] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!adding) setNewLabel('')
  }, [adding])

  async function handleCreate(e) {
    e.preventDefault()
    const label = newLabel.trim()
    if (!label || creating || busy) return
    setCreating(true)
    try {
      await onCreateAndAssign(collectionId, templateId, label)
      setNewLabel('')
    } finally {
      setCreating(false)
    }
  }

  if (adding) {
    return (
      <form className="admin-templates__category-add" onSubmit={handleCreate}>
        <label className="admin-templates__category-field">
          <span className="admin-templates__category-label">New category</span>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Wedding"
            disabled={creating || busy}
            autoFocus
          />
        </label>
        <div className="admin-templates__category-add-actions">
          <button
            type="submit"
            className="admin-board__mini admin-board__mini--primary"
            disabled={!newLabel.trim() || creating || busy}
          >
            {creating ? 'Adding…' : 'Add & assign'}
          </button>
          <button
            type="button"
            className="admin-board__mini admin-board__mini--ghost"
            disabled={creating || busy}
            onClick={onCancelAdd}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <label className="admin-templates__category-field">
      <span className="admin-templates__category-label">Category</span>
      <select
        className="admin-templates__category-select"
        value={currentSlug || ''}
        disabled={busy}
        aria-label={`Category for ${templateId}`}
        onChange={(e) => {
          const value = e.target.value
          if (value === ADD_CATEGORY_VALUE) {
            onStartAdd(collectionId, templateId)
            return
          }
          onSelectCategory(collectionId, templateId, value || null)
        }}
      >
        <option value="">No category</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.label}
          </option>
        ))}
        <option value={ADD_CATEGORY_VALUE}>Add category…</option>
      </select>
    </label>
  )
}

function CollectionCard({
  collection,
  status,
  unpublishedDesignsMap,
  designCategoriesMap,
  categories,
  expanded,
  onToggleExpand,
  busy,
  busyDesignId,
  busyCategoryId,
  addingCategoryKey,
  onTogglePublish,
  onToggleDesignPublish,
  onSelectCategory,
  onStartAddCategory,
  onCancelAddCategory,
  onCreateAndAssignCategory,
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
          to={`/studio/templates?collection=${encodeURIComponent(collection.id)}`}
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
            const designKey = `${collection.id}:${template.id}`
            const designPublished = designIsPublished(
              collection.id,
              template.id,
              unpublishedDesignsMap,
            )
            const designBusy = busyDesignId === designKey
            const categoryBusy = busyCategoryId === designKey
            const currentSlug = designCategoriesMap[collection.id]?.[template.id] || ''
            const currentLabel = categoryLabelForSlug(categories, currentSlug)
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
                  {currentLabel ? (
                    <span className="admin-templates__design-badge admin-templates__design-badge--category">
                      {currentLabel}
                    </span>
                  ) : null}
                  {isPublished && !designPublished ? (
                    <span className="admin-templates__design-note">
                      Hidden on public Templates and for non-admins
                    </span>
                  ) : null}
                  {!isPublished && designPublished ? (
                    <span className="admin-templates__design-note">
                      Group draft — not on public Templates yet
                    </span>
                  ) : null}
                </div>
                <div className="admin-templates__design-actions">
                  <DesignCategoryControl
                    collectionId={collection.id}
                    templateId={template.id}
                    categories={categories}
                    currentSlug={currentSlug}
                    busy={categoryBusy || designBusy || busy}
                    adding={addingCategoryKey === designKey}
                    onSelectCategory={onSelectCategory}
                    onStartAdd={onStartAddCategory}
                    onCancelAdd={onCancelAddCategory}
                    onCreateAndAssign={onCreateAndAssignCategory}
                  />
                  <button
                    type="button"
                    className={`admin-board__mini${designPublished ? '' : ' admin-board__mini--primary'}`}
                    disabled={designBusy || busy || categoryBusy}
                    onClick={() =>
                      onToggleDesignPublish(collection.id, template.id, designPublished)
                    }
                  >
                    {designPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
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
  designCategoriesMap,
  categories,
  expandedId,
  busyId,
  busyDesignId,
  busyCategoryId,
  addingCategoryKey,
  onToggleExpand,
  onTogglePublish,
  onToggleDesignPublish,
  onSelectCategory,
  onStartAddCategory,
  onCancelAddCategory,
  onCreateAndAssignCategory,
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
                designCategoriesMap={designCategoriesMap}
                categories={categories}
                expanded={expandedId === collection.id}
                onToggleExpand={onToggleExpand}
                busy={busyId === collection.id}
                busyDesignId={busyDesignId}
                busyCategoryId={busyCategoryId}
                addingCategoryKey={addingCategoryKey}
                onTogglePublish={onTogglePublish}
                onToggleDesignPublish={onToggleDesignPublish}
                onSelectCategory={onSelectCategory}
                onStartAddCategory={onStartAddCategory}
                onCancelAddCategory={onCancelAddCategory}
                onCreateAndAssignCategory={onCreateAndAssignCategory}
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

function applyCollectionCategoryState(row, collectionId, setters) {
  const { setUnpublishedDesignsMap, setCollectionPublishMap, setDesignCategoriesMap } = setters
  if (row?.unpublishedDesignIds) {
    setUnpublishedDesignsMap((prev) => ({
      ...prev,
      [collectionId]: row.unpublishedDesignIds,
    }))
  }
  if (row?.status) {
    setCollectionPublishMap((prev) => ({
      ...prev,
      [collectionId]: row.status,
    }))
  }
  if (row?.designCategories) {
    setDesignCategoriesMap((prev) => ({
      ...prev,
      [collectionId]: { ...row.designCategories },
    }))
  }
}

export default function AdminTemplates() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [collectionPublishMap, setCollectionPublishMap] = useState({})
  const [unpublishedDesignsMap, setUnpublishedDesignsMap] = useState({})
  const [designCategoriesMap, setDesignCategoriesMap] = useState({})
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState('all')
  const [busyId, setBusyId] = useState(null)
  const [busyDesignId, setBusyDesignId] = useState(null)
  const [busyCategoryId, setBusyCategoryId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [addingCategoryKey, setAddingCategoryKey] = useState(null)

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
      setDesignCategoriesMap(mapDesignCategories(rows))
      setCategories(normalizeCategories(data.categories))
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
      if (row?.designCategories) {
        setDesignCategoriesMap((prev) => ({
          ...prev,
          [collectionId]: { ...row.designCategories },
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
      if (row?.designCategories) {
        setDesignCategoriesMap((prev) => ({
          ...prev,
          [collectionId]: { ...row.designCategories },
        }))
      }
    } catch (err) {
      setError(err?.message || 'Could not update design')
    } finally {
      setBusyDesignId(null)
    }
  }

  async function selectDesignCategory(collectionId, templateId, categorySlug) {
    const key = `${collectionId}:${templateId}`
    setBusyCategoryId(key)
    setError('')
    setAddingCategoryKey(null)
    try {
      const row = await setDesignCategory(collectionId, templateId, categorySlug)
      applyCollectionCategoryState(row, collectionId, {
        setUnpublishedDesignsMap,
        setCollectionPublishMap,
        setDesignCategoriesMap,
      })
      // Ensure local map updates even if API omits empty object
      setDesignCategoriesMap((prev) => {
        const nextForCollection = { ...(prev[collectionId] || {}) }
        if (categorySlug) nextForCollection[templateId] = categorySlug
        else delete nextForCollection[templateId]
        return { ...prev, [collectionId]: nextForCollection }
      })
    } catch (err) {
      setError(err?.message || 'Could not update category')
    } finally {
      setBusyCategoryId(null)
    }
  }

  async function createAndAssignCategory(collectionId, templateId, label) {
    const key = `${collectionId}:${templateId}`
    setBusyCategoryId(key)
    setError('')
    try {
      const category = await createCategory(label)
      setCategories((prev) => normalizeCategories([...prev, category]))
      const row = await setDesignCategory(collectionId, templateId, category.slug)
      applyCollectionCategoryState(row, collectionId, {
        setUnpublishedDesignsMap,
        setCollectionPublishMap,
        setDesignCategoriesMap,
      })
      setDesignCategoriesMap((prev) => ({
        ...prev,
        [collectionId]: {
          ...(prev[collectionId] || {}),
          [templateId]: category.slug,
        },
      }))
      setAddingCategoryKey(null)
    } catch (err) {
      setError(err?.message || 'Could not create category')
      throw err
    } finally {
      setBusyCategoryId(null)
    }
  }

  function toggleExpand(collectionId) {
    setExpandedId((prev) => (prev === collectionId ? null : collectionId))
    setAddingCategoryKey(null)
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

  const segmentProps = {
    collectionPublishMap,
    unpublishedDesignsMap,
    designCategoriesMap,
    categories,
    expandedId,
    busyId,
    busyDesignId,
    busyCategoryId,
    addingCategoryKey,
    onToggleExpand: toggleExpand,
    onTogglePublish: togglePublish,
    onToggleDesignPublish: toggleDesignPublish,
    onSelectCategory: selectDesignCategory,
    onStartAddCategory: (collectionId, templateId) =>
      setAddingCategoryKey(`${collectionId}:${templateId}`),
    onCancelAddCategory: () => setAddingCategoryKey(null),
    onCreateAndAssignCategory: createAndAssignCategory,
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Templates</h1>
          <p className="admin-page__copy">
            Manage template groups and individual designs. A group must be published for any of
            its fliers to appear on the public{' '}
            <Link to="/templates">Templates</Link> page and in Studio at{' '}
            <Link to="/studio/templates">/studio/templates</Link>; you can still unpublish specific
            designs inside a published group. Assign a category per design for the public gallery.
            Open a group in the studio to QA before publishing.
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
        <span aria-hidden="true"> · </span>
        Categories {categories.length}
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
                  {...segmentProps}
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
                  {...segmentProps}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
