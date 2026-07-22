import { useEffect, useRef } from 'react'
import { Check, Type } from 'lucide-react'

function fieldLabel(path) {
  if (!path) return 'Text'
  if (path === 'convener.label') return 'Convener label'
  if (path === 'event.timeNote') return 'Time note'
  if (path === 'event.dateNote') return 'Date note'
  if (path === 'event.ticketLabel') return 'Ticket label'
  if (path.startsWith('speakers.')) {
    const [, index, field] = path.split('.')
    const n = Number(index) + 1
    if (field === 'name') return `Speaker ${n} name`
    if (field === 'title') return `Speaker ${n} title`
  }
  if (path.startsWith('panelists.')) {
    const [, index, field] = path.split('.')
    const n = Number(index) + 1
    if (field === 'name') return `Panelist ${n} name`
    if (field === 'title') return `Panelist ${n} title`
  }
  if (path.startsWith('event.')) {
    const key = path.replace('event.', '').replace(/\.\d+$/, '')
    return key.charAt(0).toUpperCase() + key.slice(1)
  }
  const leaf = path.split('.').pop() || path
  return leaf
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

/**
 * Mobile text edit dock — keeps the artboard visible while editing in a
 * readable 16px+ field (avoids iOS page-zoom + transform scroll jumps).
 */
export default function MobileTextEditor({ path, value = '', onChange, onDone }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const id = window.setTimeout(() => {
      node.focus({ preventScroll: true })
      const len = node.value.length
      try {
        node.setSelectionRange(len, len)
      } catch {
        // ignore non-text inputs
      }
    }, 30)
    return () => window.clearTimeout(id)
  }, [path])

  if (!path) return null

  return (
    <div className="mobile-text-editor" role="dialog" aria-label="Edit text">
      <div className="mobile-text-editor__head">
        <Type size={14} strokeWidth={2.25} aria-hidden />
        <span className="mobile-text-editor__label">{fieldLabel(path)}</span>
        <button type="button" className="mobile-text-editor__done" onClick={onDone}>
          <Check size={16} strokeWidth={2.5} />
          Done
        </button>
      </div>
      <textarea
        ref={ref}
        className="mobile-text-editor__input"
        rows={3}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange?.(path, e.target.value)}
        enterKeyHint="done"
        autoCapitalize="sentences"
        autoCorrect="on"
        spellCheck
      />
    </div>
  )
}
