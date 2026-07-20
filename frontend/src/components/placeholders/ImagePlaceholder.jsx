import { ImageIcon } from 'lucide-react'
import './placeholders.css'

/**
 * Generic media slot for heroes, venues, products, maps, etc.
 */
export default function ImagePlaceholder({
  src,
  alt = '',
  label = 'Image',
  width = '100%',
  height,
  aspect = '16 / 9',
  radius = 16,
  showLabel = true,
  className = '',
  style,
}) {
  return (
    <div
      className={`ph-image ${className}`.trim()}
      style={{
        '--ph-width': typeof width === 'number' ? `${width}px` : width,
        ...(height
          ? { '--ph-height': typeof height === 'number' ? `${height}px` : height }
          : null),
        '--ph-aspect': aspect,
        '--ph-radius': typeof radius === 'number' ? `${radius}px` : radius,
        ...style,
      }}
    >
      {src ? (
        <img className="ph-image__img" src={src} alt={alt || label} />
      ) : (
        <div className="ph-image__meta">
          <ImageIcon className="ph-image__icon" strokeWidth={1.5} aria-hidden />
          {showLabel ? <span className="ph-image__label">{label}</span> : null}
        </div>
      )}
    </div>
  )
}
