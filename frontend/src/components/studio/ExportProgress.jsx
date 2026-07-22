/**
 * Signal-orange export progress.
 * - compact: icon-sized control (desktop tool rail / inspector rail)
 * - labeled: wide export button / status
 * - line: thin full-width chrome bar (mobile, above bottom dock)
 * progress: 0–1
 */
export default function ExportProgress({
  progress = 0,
  label = 'Preparing your flier…',
  compact = false,
  line = false,
  className = '',
}) {
  const pct = Math.round(Math.min(100, Math.max(0, progress * 100)))
  const fill = Math.min(1, Math.max(0, progress))
  const classes = [
    'export-progress',
    line
      ? 'export-progress--line'
      : compact
        ? 'export-progress--compact'
        : 'export-progress--labeled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={classes}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
    >
      {!compact && !line ? (
        <span className="export-progress__meta">
          <span className="export-progress__label">{label}</span>
          <span className="export-progress__pct">{pct}%</span>
        </span>
      ) : null}
      <span className="export-progress__track" aria-hidden>
        <span className="export-progress__fill" style={{ transform: `scaleX(${fill})` }} />
      </span>
    </span>
  )
}
