import { useEffect, useRef } from 'react'
import {
  Download,
  LayoutGrid,
  MousePointer2,
  Pencil,
  PlayCircle,
  X,
  ZoomIn,
} from 'lucide-react'
import './StudioHelp.css'

const BASICS = [
  {
    icon: LayoutGrid,
    title: 'Open a template',
    body: 'Go to Templates, pick a layout, and it opens as a project you can edit.',
  },
  {
    icon: MousePointer2,
    title: 'Select an artboard',
    body: 'Click (or tap) a flier on the canvas. Edits and export use that selection.',
  },
  {
    icon: Pencil,
    title: 'Edit text & images',
    body: 'Use the side panel — or Panel on mobile — or click text and photo slots on the board.',
  },
  {
    icon: ZoomIn,
    title: 'Move around',
    body: 'Select / Text / Hand tools. Desktop: scroll to pan, Ctrl+scroll to zoom. Mobile: pinch and two-finger drag.',
  },
  {
    icon: Download,
    title: 'Export',
    body: 'Download from the Export button (Ctrl+E). Choose format and HD scale in the panel when you need them.',
  },
]

/**
 * Lightweight always-available studio guide (checklist, not a docs site).
 */
export default function StudioHelp({ open, onClose, onReplayTour }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="open-dialog studio-help" role="dialog" aria-modal="true" aria-label="Studio guide">
      <button type="button" className="open-dialog__backdrop" aria-label="Close" onClick={onClose} />
      <div className="open-dialog__panel studio-help__panel">
        <header className="open-dialog__head">
          <div>
            <p className="open-dialog__eyebrow">Guide</p>
            <h2>How to use the studio</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="open-dialog__icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </header>

        <ul className="studio-help__list">
          {BASICS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="studio-help__item">
              <span className="studio-help__icon" aria-hidden="true">
                <Icon size={16} strokeWidth={2.25} />
              </span>
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="studio-help__footer">
          <button
            type="button"
            className="studio-help__replay"
            onClick={() => {
              onClose?.()
              onReplayTour?.()
            }}
          >
            <PlayCircle size={16} strokeWidth={2.25} />
            Replay quick tour
          </button>
          <button type="button" className="studio-help__done" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
