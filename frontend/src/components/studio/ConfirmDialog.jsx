import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, ImageIcon, X } from 'lucide-react'

function portalHost() {
  if (typeof document === 'undefined') return null
  // Stay inside .studio-app so --studio-* theme tokens apply (body has none).
  // Still escapes transformed artboards; StudioHelp already mounts here successfully.
  return document.querySelector('.studio-app') || document.body
}

/**
 * Studio-matched confirm / notice dialog.
 * Portaled to .studio-app (fallback: body) so chrome stays viewport-fixed
 * above transformed artboards while inheriting studio theme tokens.
 * tone: 'danger' | 'default' | 'image'
 *
 * Optional third action: secondaryLabel + onSecondary (e.g. Remove image).
 */
export default function ConfirmDialog({
  open,
  title = 'Confirm',
  eyebrow = 'Studio',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  secondaryLabel,
  tone = 'danger',
  secondaryTone = 'danger',
  hideCancel = false,
  onConfirm,
  onSecondary,
  onClose,
}) {
  const confirmRef = useRef(null)
  const host = portalHost()

  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault()
        onConfirm?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onConfirm])

  useEffect(() => {
    if (open) confirmRef.current?.focus()
  }, [open])

  if (!open || !host) return null

  const Icon = tone === 'image' ? ImageIcon : AlertTriangle
  const iconDanger = tone === 'danger'
  const btnAccent = tone !== 'danger'
  const hasSecondary = Boolean(secondaryLabel && onSecondary)

  const stop = (e) => {
    e.stopPropagation()
  }

  return createPortal(
    <div
      className="open-dialog confirm-dialog"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onPointerDown={stop}
      onClick={stop}
    >
      <button
        type="button"
        className="open-dialog__backdrop"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation()
          onClose?.()
        }}
      />
      <div className="open-dialog__panel confirm-dialog__panel" onClick={stop}>
        <header className="open-dialog__head">
          <div>
            <p className="open-dialog__eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <button
            type="button"
            className="open-dialog__icon-btn"
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </header>

        <div className="confirm-dialog__body">
          <span
            className={`confirm-dialog__icon${iconDanger ? ' confirm-dialog__icon--danger' : ''}`}
            aria-hidden
          >
            <Icon size={18} strokeWidth={2.25} />
          </span>
          <p className="confirm-dialog__message">{message}</p>
        </div>

        <div
          className={`confirm-dialog__actions${hasSecondary ? ' confirm-dialog__actions--triple' : ''}`}
        >
          {!hideCancel ? (
            <button
              type="button"
              className="confirm-dialog__btn confirm-dialog__btn--ghost"
              onClick={(e) => {
                e.stopPropagation()
                onClose?.()
              }}
            >
              {cancelLabel}
            </button>
          ) : null}
          <button
            ref={confirmRef}
            type="button"
            className={`confirm-dialog__btn${
              btnAccent ? ' confirm-dialog__btn--accent' : ' confirm-dialog__btn--danger'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onConfirm?.()
            }}
          >
            {confirmLabel}
          </button>
          {hasSecondary ? (
            <button
              type="button"
              className={`confirm-dialog__btn${
                secondaryTone === 'danger'
                  ? ' confirm-dialog__btn--danger'
                  : ' confirm-dialog__btn--ghost'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onSecondary?.()
              }}
            >
              {secondaryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    host,
  )
}
