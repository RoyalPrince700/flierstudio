import { Hand, MousePointer2, X } from 'lucide-react'

/**
 * Short-lived, non-blocking tool coach toast.
 * Does not trap focus or block canvas interaction.
 */
export default function ToolCoachToast({ suggestion, onAccept, onDismiss }) {
  if (!suggestion) return null

  const Icon = suggestion.switchTo === 'hand' ? Hand : MousePointer2

  return (
    <div className="tool-coach" role="status" aria-live="polite">
      <div className="tool-coach__body">
        <span className="tool-coach__icon" aria-hidden>
          <Icon size={16} strokeWidth={2.25} />
        </span>
        <p className="tool-coach__msg">{suggestion.message}</p>
      </div>
      <div className="tool-coach__actions">
        <button type="button" className="tool-coach__action" onClick={onAccept}>
          {suggestion.actionLabel}
        </button>
        <button
          type="button"
          className="tool-coach__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X size={14} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  )
}
