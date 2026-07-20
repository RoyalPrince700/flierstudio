import { useEffect, useMemo, useState } from 'react'
import { FolderOpen, Search, X } from 'lucide-react'
import { listProjects } from '../../projects/registry'

export default function OpenDesignDialog({
  open,
  openTabIds,
  onClose,
  onOpen,
}) {
  const projects = useMemo(() => listProjects(), [])
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) setQuery('')
  }, [open])

  if (!open) return null

  const filtered = projects.filter((project) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      project.name.toLowerCase().includes(q) ||
      project.brand.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q)
    )
  })

  return (
    <div className="open-dialog" role="dialog" aria-modal="true" aria-label="Open design">
      <button type="button" className="open-dialog__backdrop" aria-label="Close" onClick={onClose} />
      <div className="open-dialog__panel">
        <header className="open-dialog__head">
          <div>
            <p className="open-dialog__eyebrow">Projects</p>
            <h2>Open design</h2>
          </div>
          <button type="button" className="open-dialog__icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2.25} />
          </button>
        </header>

        <label className="open-dialog__search">
          <Search size={14} strokeWidth={2.25} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
          />
        </label>

        <ul className="open-dialog__list">
          {filtered.map((project) => {
            const alreadyOpen = openTabIds.includes(project.id)
            return (
              <li key={project.id}>
                <button
                  type="button"
                  className="open-dialog__item"
                  onClick={() => onOpen(project.id)}
                >
                  <span
                    className="open-dialog__swatch"
                    style={{ background: project.color }}
                  />
                  <span className="open-dialog__text">
                    <strong>{project.name}</strong>
                    <small>
                      {project.brand} · {project.flierCount} flier
                      {project.flierCount === 1 ? '' : 's'}
                    </small>
                    <em>{project.description}</em>
                  </span>
                  <span className="open-dialog__action">
                    <FolderOpen size={14} strokeWidth={2.25} />
                    {alreadyOpen ? 'Focus' : 'Open'}
                  </span>
                </button>
              </li>
            )
          })}
          {!filtered.length ? (
            <li className="open-dialog__empty">No projects match that search.</li>
          ) : null}
        </ul>

        <p className="open-dialog__hint">
          Projects live in <code>src/projects/&lt;name&gt;/</code>. Each brand stays in its own folder.
        </p>
      </div>
    </div>
  )
}
