import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Copy, Search } from 'lucide-react'
import { getSampleCollection, listSampleCollections } from '../samples/registry'
import SamplePreview from './SamplePreview'
import SampleViewerModal from './SampleViewerModal'
import './SamplesBoard.css'

/**
 * Samples content for the studio canvas — uses the same shell/grid as the artboard.
 */
export default function SamplesBoard({
  showGrid = true,
  openCollectionId,
  onOpenCollection,
  onCloseCollection,
  selectedTemplateId,
  onSelectTemplate,
}) {
  const collections = useMemo(() => listSampleCollections(), [])
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [viewerTemplate, setViewerTemplate] = useState(null)

  function openTemplate(template) {
    onSelectTemplate?.(template.id)
    setViewerTemplate(template)
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

  const openCollection = openCollectionId ? getSampleCollection(openCollectionId) : null

  async function copyId(id) {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(id)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // ignore
    }
  }

  return (
    <div className={`samples-board${showGrid ? ' samples-board--grid' : ''}`}>
      <div className="samples-board__toolbar">
        {openCollection ? (
          <button type="button" className="samples-board__chip" onClick={onCloseCollection}>
            <ArrowLeft size={14} strokeWidth={2.25} />
            All samples
          </button>
        ) : null}
        <div className="samples-board__title">
          <strong>{openCollection ? openCollection.name : 'Samples'}</strong>
          <span>
            {openCollection
              ? `${openCollection.templateCount} template${openCollection.templateCount === 1 ? '' : 's'}`
              : `${collections.length} sample${collections.length === 1 ? '' : 's'}`}
          </span>
        </div>
        {!openCollection ? (
          <label className="samples-board__search">
            <Search size={14} strokeWidth={2.25} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search samples…"
            />
          </label>
        ) : (
          <p className="samples-board__hint">
            Click a template for full preview · <code>{openCollection.principlesPath}</code>
          </p>
        )}
      </div>

      <div className="samples-board__scroll">
        {openCollection ? (
          <div className="samples-board__grid samples-board__grid--detail">
            {openCollection.templates.map((template) => (
              <article
                key={template.id}
                className={`samples-card samples-card--template${
                  selectedTemplateId === template.id ? ' is-selected' : ''
                }`}
                onClick={() => openTemplate(template)}
              >
                <div className="samples-card__art">
                  <SamplePreview template={template} frameWidth={220} />
                </div>
                <div className="samples-card__body">
                  <strong>{template.name}</strong>
                  <code>{template.id}</code>
                  <small>{template.sizeLabel}</small>
                  <button
                    type="button"
                    className="samples-board__copy"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyId(template.id)
                    }}
                  >
                    {copied === template.id ? (
                      <Check size={14} strokeWidth={2.5} />
                    ) : (
                      <Copy size={14} strokeWidth={2.25} />
                    )}
                    {copied === template.id ? 'Copied' : 'Copy id'}
                  </button>
                </div>
              </article>
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
                    onOpenCollection(collection.id)
                    openTemplate(collection.cover)
                    return
                  }
                  onOpenCollection(collection.id)
                }}
                style={{ '--samples-accent': collection.color }}
              >
                <div className="samples-card__art">
                  {collection.cover ? (
                    <SamplePreview template={collection.cover} frameWidth={240} />
                  ) : (
                    <div className="samples-card__empty">No templates</div>
                  )}
                  {collection.templateCount > 1 ? (
                    <span className="samples-card__badge">
                      {collection.templateCount} templates
                    </span>
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
            <h2>No samples match</h2>
            <p>Try another search, or add designs under a project / sample inbox.</p>
          </div>
        )}
      </div>

      {viewerTemplate ? (
        <SampleViewerModal
          template={viewerTemplate}
          onClose={() => setViewerTemplate(null)}
        />
      ) : null}
    </div>
  )
}
