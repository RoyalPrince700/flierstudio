import { useMemo, useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import {
  filterTemplateCollections,
  listTemplateCollections,
} from '../samples/registry'
import { useTemplatePublish } from '../lib/templatePublish'
import SamplePreview from './SamplePreview'
import './SamplesBoard.css'

const THUMB_WIDTH = 220
const THUMB_HEIGHT = 200

/**
 * Templates browser for the studio canvas — click a template to open it in the editor.
 */
export default function TemplatesBoard({
  showGrid = true,
  openCollectionId,
  onOpenCollection,
  onCloseCollection,
  selectedTemplateId,
  onSelectTemplate,
  onUseTemplate,
}) {
  const {
    collectionPublishMap,
    unpublishedDesignsMap,
    loading,
    error,
    includeUnpublished,
    isAdmin,
  } = useTemplatePublish()
  const allCollections = useMemo(() => listTemplateCollections(), [])
  const collections = useMemo(
    () =>
      filterTemplateCollections(allCollections, {
        collectionPublishMap,
        unpublishedDesignsMap,
        includeUnpublished,
      }),
    [allCollections, collectionPublishMap, unpublishedDesignsMap, includeUnpublished],
  )
  const [query, setQuery] = useState('')

  function useTemplate(template) {
    onSelectTemplate?.(template.id)
    onUseTemplate?.(template)
  }

  const filtered = collections.filter((collection) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    if (
      collection.id.includes(q) ||
      collection.name.toLowerCase().includes(q) ||
      collection.brand.toLowerCase().includes(q) ||
      collection.description.toLowerCase().includes(q)
    ) {
      return true
    }
    return collection.templates.some(
      (template) =>
        template.id.includes(q) ||
        template.name.toLowerCase().includes(q) ||
        template.tags.some((tag) => String(tag).toLowerCase().includes(q)),
    )
  })

  const openCollection = openCollectionId
    ? collections.find((collection) => collection.id === openCollectionId) || null
    : null

  return (
    <div className={`samples-board${showGrid ? ' samples-board--grid' : ''}`}>
      <div className="samples-board__toolbar">
        {openCollection ? (
          <button type="button" className="samples-board__chip" onClick={onCloseCollection}>
            <ArrowLeft size={14} strokeWidth={2.25} />
            All templates
          </button>
        ) : null}
        <div className="samples-board__title">
          <strong>{openCollection ? openCollection.name : 'Templates'}</strong>
          <span>
            {openCollection
              ? `${openCollection.templateCount} template${openCollection.templateCount === 1 ? '' : 's'}`
              : `${collections.length} collection${collections.length === 1 ? '' : 's'}`}
          </span>
        </div>
        {!openCollection ? (
          <label className="samples-board__search">
            <Search size={14} strokeWidth={2.25} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
            />
          </label>
        ) : (
          <p className="samples-board__hint">Click a template to open it in the studio editor</p>
        )}
      </div>

      {error ? <p className="samples-board__hint samples-board__hint--error">{error}</p> : null}
      {loading ? <p className="samples-board__hint">Loading published templates…</p> : null}

      <div className="samples-board__scroll">
        {openCollection ? (
          <div className="samples-board__grid samples-board__grid--detail">
            {openCollection.templates.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`samples-card samples-card--template${
                  selectedTemplateId === template.id ? ' is-selected' : ''
                }`}
                onClick={() => useTemplate(template)}
              >
                <div className="samples-card__art">
                  <SamplePreview
                    template={template}
                    frameWidth={THUMB_WIDTH}
                    frameHeight={THUMB_HEIGHT}
                    fit="contain"
                  />
                  {isAdmin && template.designPublished === false ? (
                    <span className="samples-card__badge samples-card__badge--draft">Draft</span>
                  ) : null}
                </div>
                <div className="samples-card__body">
                  <strong>{template.name}</strong>
                  <small>{template.sizeLabel}</small>
                  <span className="samples-board__open">Open in studio</span>
                </div>
              </button>
            ))}
          </div>
        ) : filtered.length ? (
          <div className="samples-board__grid">
            {filtered.map((collection) => (
              <button
                key={collection.id}
                type="button"
                className="samples-card"
                onClick={() => {
                  if (collection.templateCount === 1 && collection.cover) {
                    useTemplate(collection.cover)
                    return
                  }
                  onOpenCollection(collection.id)
                }}
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
                  {collection.templateCount > 1 ? (
                    <span className="samples-card__badge">
                      {collection.templateCount} templates
                    </span>
                  ) : null}
                  {isAdmin && collection.publishStatus !== 'published' ? (
                    <span className="samples-card__badge samples-card__badge--draft">Draft</span>
                  ) : null}
                </div>
                <div className="samples-card__body">
                  <span
                    className="samples-card__swatch"
                    style={{ background: collection.color }}
                  />
                  <div className="samples-card__text">
                    <strong>{collection.name}</strong>
                    <small>{collection.brand}</small>
                    <em>{collection.description}</em>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="samples-board__blank">
            <h2>{loading ? 'Loading templates…' : 'No published template groups yet'}</h2>
            <p>
              {isAdmin
                ? 'Publish template groups from Admin → Templates to make them visible here for all users.'
                : 'Check back soon — new template groups are added regularly.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
