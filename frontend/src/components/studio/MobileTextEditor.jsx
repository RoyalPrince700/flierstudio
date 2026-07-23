import { useEffect, useRef } from 'react'
import { Check, Type } from 'lucide-react'

/** Treat overlaps above this as a virtual keyboard (filters tiny chrome jitter). */
const KEYBOARD_OPEN_PX = 80
const DOCK_GAP_PX = 8

function fieldLabel(path) {
  if (!path) return 'Text'
  if (path === 'convener.label') return 'Convener label'
  if (path === 'event.timeNote') return 'Time note'
  if (path === 'event.dateNote') return 'Date note'
  if (path === 'event.ticketLabel') return 'Ticket label'
  if (path === 'event.programmeTitle') return 'Programme title'
  if (path === 'event.heroSeries') return 'Hero series'
  if (path === 'event.heroTheme') return 'Hero theme'
  if (path === 'event.heroCapsule') return 'Hero capsule'
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
  if (path.startsWith('stagePeople.')) {
    const [, index, field] = path.split('.')
    const n = Number(index) + 1
    if (field === 'name') return `Person ${n} name`
    if (field === 'title') return `Person ${n} title`
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
 * Bottom overlap of the layout viewport that is covered (keyboard / chrome).
 * visualViewport is the reliable signal on iOS Safari + Android Chrome.
 */
function readKeyboardInset() {
  const vv = window.visualViewport
  if (!vv) return 0
  return Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop))
}

function clearKeyboardDock(el) {
  el.classList.remove('is-keyboard-open')
  el.style.removeProperty('--studio-keyboard-inset')
  el.style.removeProperty('left')
  el.style.removeProperty('right')
  el.style.removeProperty('bottom')
  el.style.removeProperty('width')
  el.style.removeProperty('max-width')
}

/**
 * Mobile text edit dock — keeps the artboard visible while editing in a
 * readable 16px+ multiline field (avoids iOS page-zoom + transform scroll jumps).
 * Return inserts a new line; Done commits/closes. Soft keyboard docks via Visual Viewport.
 */
export default function MobileTextEditor({ path, value = '', onChange, onDone }) {
  const inputRef = useRef(null)
  const dockRef = useRef(null)

  useEffect(() => {
    const node = inputRef.current
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

  // Pin dock above the virtual keyboard while it is open.
  useEffect(() => {
    const dock = dockRef.current
    if (!dock) return undefined

    const vv = window.visualViewport

    function sync() {
      const inset = readKeyboardInset()
      if (inset >= KEYBOARD_OPEN_PX) {
        dock.classList.add('is-keyboard-open')
        dock.style.setProperty('--studio-keyboard-inset', `${inset}px`)
        // Fixed to the layout viewport so bottom inset tracks the keyboard
        // even when the shell/tool-rail layout does not resize (iOS Safari).
        dock.style.left = `${DOCK_GAP_PX}px`
        dock.style.right = `${DOCK_GAP_PX}px`
        dock.style.bottom = `calc(var(--studio-keyboard-inset) + ${DOCK_GAP_PX}px)`
        dock.style.width = 'auto'
        dock.style.maxWidth = `calc(100vw - ${DOCK_GAP_PX * 2}px)`
      } else {
        clearKeyboardDock(dock)
      }
    }

    sync()
    // Keyboard animation can lag focus — re-sync a couple times.
    const t1 = window.setTimeout(sync, 100)
    const t2 = window.setTimeout(sync, 350)

    vv?.addEventListener('resize', sync)
    vv?.addEventListener('scroll', sync)
    window.addEventListener('resize', sync)
    window.addEventListener('orientationchange', sync)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      vv?.removeEventListener('resize', sync)
      vv?.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
      window.removeEventListener('orientationchange', sync)
      clearKeyboardDock(dock)
    }
  }, [path])

  if (!path) return null

  return (
    <div
      ref={dockRef}
      className="mobile-text-editor"
      role="dialog"
      aria-label="Edit text"
    >
      <div className="mobile-text-editor__head">
        <Type size={14} strokeWidth={2.25} aria-hidden />
        <span className="mobile-text-editor__label">{fieldLabel(path)}</span>
        <button type="button" className="mobile-text-editor__done" onClick={onDone}>
          <Check size={16} strokeWidth={2.5} />
          Done
        </button>
      </div>
      <textarea
        ref={inputRef}
        className="mobile-text-editor__input"
        rows={4}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange?.(path, e.target.value)}
        onKeyDown={(e) => {
          // Stop studio shortcuts; never treat Enter as Done (Done is the button).
          e.stopPropagation()
        }}
        /* "enter" keeps Return = newline on iOS/Android soft keyboards.
           "done" remaps Return to dismiss and blocks multi-line editing. */
        enterKeyHint="enter"
        inputMode="text"
        autoCapitalize="sentences"
        autoCorrect="on"
        spellCheck
        aria-describedby="mobile-text-editor-hint"
      />
      <p id="mobile-text-editor-hint" className="mobile-text-editor__hint">
        Return = new line · Done when finished
      </p>
    </div>
  )
}
