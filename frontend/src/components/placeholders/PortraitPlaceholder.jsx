import { UserRound } from 'lucide-react'
import './placeholders.css'

const SIZE_WIDTH = {
  sm: 120,
  md: 160,
  lg: 220,
}

/**
 * Flexible speaker / person slot for samples and unfinished brand fliers.
 * Pass `src` when a real photo is available; otherwise shows an icon frame.
 */
export default function PortraitPlaceholder({
  name,
  title,
  src,
  alt = '',
  size = 'md',
  width,
  aspect = '3 / 4',
  shape = 'rounded',
  variant = 'glass',
  accent = '#f4c430',
  showSlab = false,
  ink,
  className = '',
  style,
}) {
  const resolvedWidth = width ?? SIZE_WIDTH[size] ?? SIZE_WIDTH.md
  const sizeClass = SIZE_WIDTH[size] ? `ph-portrait--${size}` : ''
  const useSlab = showSlab || variant === 'slab'

  return (
    <div
      className={`ph-portrait ${sizeClass} ${className}`.trim()}
      style={{
        '--ph-width': typeof resolvedWidth === 'number' ? `${resolvedWidth}px` : resolvedWidth,
        '--ph-aspect': aspect,
        '--ph-accent': accent,
        ...(ink ? { '--ph-ink': ink } : null),
        ...style,
      }}
    >
      <div
        className={[
          'ph-portrait__frame',
          `ph-portrait__frame--${shape}`,
          `ph-portrait__frame--${variant}`,
        ].join(' ')}
      >
        {useSlab ? <span className="ph-portrait__slab" aria-hidden /> : null}
        <div className="ph-portrait__inner">
          {src ? (
            <img className="ph-portrait__img" src={src} alt={alt || name || ''} />
          ) : (
            <UserRound className="ph-portrait__icon" strokeWidth={1.75} aria-hidden />
          )}
        </div>
      </div>
      {name ? <p className="ph-portrait__name">{name}</p> : null}
      {title ? <p className="ph-portrait__title">{title}</p> : null}
    </div>
  )
}
