import { Hand, MousePointer2, X } from 'lucide-react'

/**
 * Short-lived, non-blocking tool coach toast.
 * Does not trap focus or block canvas interaction.
 *
 * Modes:
 * - suggest: primary “Switch to …” CTA (desktop)
 * - status: informational after mobile auto-switch; optional Switch back
 *
 * Tool coach toast — temporarily disabled; auto-switch only.
 * Studio.jsx + useToolCoach toast path are commented out. Uncomment if we want gesture explanations again.
 */
export default function ToolCoachToast({ suggestion, onAccept, onDismiss }) {
  if (!suggestion) return null

  const isStatus = suggestion.mode === 'status'
  const Icon = suggestion.switchTo === 'hand' ? Hand : MousePointer2
  const primaryLabel = isStatus
    ? suggestion.secondaryLabel
    : suggestion.actionLabel
  const showPrimary = Boolean(primaryLabel)

  return (
    <div className="tool-coach" role="status" aria-live="polite">
      <div className="tool-coach__body">
        <span className="tool-coach__icon" aria-hidden>
          <Icon size={16} strokeWidth={2.25} />
        </span>
        <p className="tool-coach__msg">{suggestion.message}</p>
      </div>
      <div className="tool-coach__actions">
        {showPrimary ? (
          <button
            type="button"
            className={`tool-coach__action${isStatus ? ' tool-coach__action--ghost' : ''}`}
            onClick={onAccept}
          >
            {primaryLabel}
          </button>
        ) : null}
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
