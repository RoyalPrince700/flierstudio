import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import PublicPageShell from './PublicPageShell'
import SamplePreview from '../SamplePreview'
import {
  filterTemplateCollections,
  listTemplateCollections,
} from '../../samples/registry'
import { ApiError } from '../../lib/api'
import { rememberAuthReturn, studioTemplateReturnPath } from '../../lib/authReturn'
import { fetchPublicPublishState } from '../../lib/templatePublish'
import './TemplatesPage.css'

/** Approximate pin content width — pairs with CSS `column-width`. */
const PIN_WIDTH = 236

/**
 * Category chip policy (public /templates):
 * - Chips come only from the public API category catalog (admin-managed),
 *   already limited to categories assigned to ≥1 visible published design.
 * - Uncategorized designs appear under **All** only — no separate
 *   “Uncategorized” chip (keeps the bar focused on real categories).
 * - Search + active chip compose; empty states distinguish no inventory vs
 *   no matches for the current filter.
 */

function pinMatchesQuery(pin, q) {
  if (!q) return true
  const { template, collection } = pin
  return (
    template.id.includes(q) ||
    template.name.toLowerCase().includes(q) ||
    (template.sizeLabel || '').toLowerCase().includes(q) ||
    (template.tags || []).some((tag) => String(tag).toLowerCase().includes(q)) ||
    collection.id.includes(q) ||
    collection.name.toLowerCase().includes(q) ||
    collection.brand.toLowerCase().includes(q) ||
    collection.description.toLowerCase().includes(q)
  )
}

function emptyStateCopy({ hasPublished, activeChip, query, chipLabel }) {
  const q = query.trim()
  if (!hasPublished) {
    return {
      title: 'No published templates yet',
      body: 'Check back soon — new designs are published regularly.',
      action: 'studio',
    }
  }
  if (activeChip !== 'all' && q) {
    return {
      title: `No “${chipLabel}” designs match your search`,
      body: 'Try different keywords, or clear filters to browse everything published.',
      action: 'clear',
    }
  }
  if (activeChip !== 'all') {
    return {
      title: `No published “${chipLabel}” designs`,
      body: 'This category has no visible designs right now. Choose All or another category.',
      action: 'clear',
    }
  }
  if (q) {
    return {
      title: 'No matching published designs',
      body: 'Try a different search, or clear it to see all published designs.',
      action: 'clear',
    }
  }
  return {
    title: 'No matching published designs',
    body: 'Clear filters to see everything published.',
    action: 'clear',
  }
}

export default function TemplatesPage() {
  const navigate = useNavigate()
  const [collectionPublishMap, setCollectionPublishMap] = useState({})
  const [unpublishedDesignsMap, setUnpublishedDesignsMap] = useState({})
  const [designCategoriesMap, setDesignCategoriesMap] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activeChip, setActiveChip] = useState('all')

  useEffect(() => {
    const prev = document.title
    document.title = 'Templates — Flier Studio'
    return () => {
      document.title = prev
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        // Single public payload: publish maps + category catalog + per-design categories.
        // No hardcoded category list — chips are fully data-driven from admin DB.
        const data = await fetchPublicPublishState()
        if (cancelled) return
        setCollectionPublishMap(data.collectionPublishMap)
        setUnpublishedDesignsMap(data.unpublishedDesignsMap)
        setDesignCategoriesMap(data.designCategoriesMap || {})
        setCategories(data.categories || [])
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof ApiError
            ? err.message
            : 'Could not load published templates. Please try again.'
        setError(message)
        setCollectionPublishMap({})
        setUnpublishedDesignsMap({})
        setDesignCategoriesMap({})
        setCategories([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const allCollections = useMemo(() => listTemplateCollections(), [])
  const collections = useMemo(
    () =>
      filterTemplateCollections(allCollections, {
        collectionPublishMap,
        unpublishedDesignsMap,
        includeUnpublished: false,
      }),
    [allCollections, collectionPublishMap, unpublishedDesignsMap],
  )

  /** Flatten published collections → individual design pins. */
  const pins = useMemo(() => {
    const out = []
    for (const collection of collections) {
      for (const template of collection.templates || []) {
        const categorySlug =
          designCategoriesMap[collection.id]?.[template.id] || null
        out.push({
          key: `${collection.id}:${template.id}`,
          collection,
          template,
          categorySlug,
        })
      }
    }
    return out
  }, [collections, designCategoriesMap])

  /** All + API categories that still have ≥1 visible pin (defensive vs stale payload). */
  const chips = useMemo(() => {
    const counts = new Map()
    for (const pin of pins) {
      if (!pin.categorySlug) continue
      counts.set(pin.categorySlug, (counts.get(pin.categorySlug) || 0) + 1)
    }

    const list = [{ id: 'all', label: 'All', count: pins.length }]
    for (const cat of categories) {
      const count = counts.get(cat.slug) || 0
      if (count > 0) list.push({ id: cat.slug, label: cat.label, count })
    }
    return list
  }, [pins, categories])

  useEffect(() => {
    if (activeChip === 'all') return
    if (!chips.some((chip) => chip.id === activeChip)) {
      setActiveChip('all')
    }
  }, [chips, activeChip])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return pins.filter((pin) => {
      if (activeChip !== 'all' && pin.categorySlug !== activeChip) return false
      return pinMatchesQuery(pin, q)
    })
  }, [pins, activeChip, query])

  const activeChipLabel =
    chips.find((chip) => chip.id === activeChip)?.label || activeChip

  const empty = emptyStateCopy({
    hasPublished: pins.length > 0,
    activeChip,
    query,
    chipLabel: activeChipLabel,
  })

  function openTemplateInStudio(templateId) {
    const returnTo = studioTemplateReturnPath(templateId)
    rememberAuthReturn(returnTo)
    navigate(returnTo)
  }

  function clearFilters() {
    setQuery('')
    setActiveChip('all')
  }

  return (
    <PublicPageShell
      title="Templates"
      lead="Browse published designs. Open any pin in Studio to edit — sign in when prompted."
      wide
    >
      <section className="pub-templates" aria-live="polite">
        <div className="pub-templates__toolbar">
          <div className="pub-templates__heading">
            <strong>Published designs</strong>
            <span>
              {loading
                ? 'Loading…'
                : `${filtered.length} design${filtered.length === 1 ? '' : 's'}`}
            </span>
          </div>

          <label className="pub-templates__search">
            <Search size={14} strokeWidth={2.25} aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search designs…"
              disabled={loading || (!error && pins.length === 0)}
            />
          </label>
        </div>

        {!loading && !error && pins.length > 0 ? (
          <div
            className="pub-templates__chips"
            role="tablist"
            aria-label="Filter by category"
          >
            {chips.map((chip) => {
              const active = activeChip === chip.id
              return (
                <button
                  key={chip.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`pub-templates__chip${active ? ' is-active' : ''}`}
                  onClick={() => setActiveChip(chip.id)}
                >
                  {chip.label}
                  <span className="pub-templates__chip-count">{chip.count}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        {error ? (
          <p className="pub-templates__status pub-templates__status--err" role="alert">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="pub-templates__status">Loading published templates…</p>
        ) : null}

        {!loading && !error && filtered.length ? (
          <div className="pub-templates__masonry">
            {filtered.map((pin) => {
              const { template, collection, categorySlug } = pin
              const category = categorySlug
                ? categories.find((cat) => cat.slug === categorySlug)
                : null
              return (
                <button
                  key={pin.key}
                  type="button"
                  className="pub-templates__pin"
                  style={{
                    '--pub-templates-accent': collection.color,
                    '--pin-ar': `${template.width} / ${template.height}`,
                  }}
                  onClick={() => openTemplateInStudio(template.id)}
                >
                  <div className="pub-templates__pin-art">
                    <div className="pub-templates__pin-scaler">
                      <div className="pub-templates__pin-scaler-inner">
                        <SamplePreview
                          template={template}
                          frameWidth={PIN_WIDTH}
                          fit="native"
                        />
                      </div>
                    </div>
                    <span className="pub-templates__pin-cta">
                      Open in Studio
                      <ArrowRight size={14} strokeWidth={2.25} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="pub-templates__pin-meta">
                    <strong>{template.name}</strong>
                    <small>
                      {collection.brand}
                      {template.sizeLabel ? ` · ${template.sizeLabel}` : ''}
                    </small>
                    {category ? (
                      <span className="pub-templates__pin-cat">{category.label}</span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        ) : null}

        {!loading && !error && !filtered.length ? (
          <div className="pub-templates__blank">
            <h2>{empty.title}</h2>
            <p>{empty.body}</p>
            {empty.action === 'clear' ? (
              <button
                type="button"
                className="l-btn l-btn--ghost l-btn--small"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            ) : (
              <Link to="/studio" className="l-btn l-btn--primary l-btn--small">
                Open Studio
              </Link>
            )}
          </div>
        ) : null}
      </section>
    </PublicPageShell>
  )
}
