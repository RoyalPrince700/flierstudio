import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

/**
 * Studio-matched confirm / notice dialog.
 * tone: 'danger' | 'default'
 */
export default function ConfirmDialog({
  open,
  title = 'Confirm',
  eyebrow = 'Studio',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  hideCancel = false,
  onConfirm,
  onClose,
}) {
  const confirmRef = useRef(null)

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

  if (!open) return null

  return (
    <div className="open-dialog confirm-dialog" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="open-dialog__backdrop" aria-label="Close" onClick={onClose} />
      <div className="open-dialog__panel confirm-dialog__panel">
        <header className="open-dialog__head">
          <div>
            <p className="open-dialog__eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="open-dialog__icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2.25} />
          </button>
        </header>

        <div className="confirm-dialog__body">
          <span
            className={`confirm-dialog__icon${tone === 'danger' ? ' confirm-dialog__icon--danger' : ''}`}
            aria-hidden
          >
            <AlertTriangle size={18} strokeWidth={2.25} />
          </span>
          <p className="confirm-dialog__message">{message}</p>
        </div>

        <div className="confirm-dialog__actions">
          {!hideCancel ? (
            <button type="button" className="confirm-dialog__btn confirm-dialog__btn--ghost" onClick={onClose}>
              {cancelLabel}
            </button>
          ) : null}
          <button
            ref={confirmRef}
            type="button"
            className={`confirm-dialog__btn${
              tone === 'danger' ? ' confirm-dialog__btn--danger' : ' confirm-dialog__btn--accent'
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
