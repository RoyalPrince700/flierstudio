import { Hexagon } from 'lucide-react'
import './placeholders.css'

/**
 * Brand mark slot. Use initials / mark text, or pass `src` for a real logo.
 */
export default function LogoPlaceholder({
  src,
  alt = '',
  mark = 'LOGO',
  width = 72,
  height = 72,
  shape = 'rounded',
  showIcon = false,
  className = '',
  style,
}) {
  const shapeClass =
    shape === 'circle' ? 'ph-logo--circle' : shape === 'pill' ? 'ph-logo--pill' : ''

  return (
    <div
      className={`ph-logo ${shapeClass} ${className}`.trim()}
      style={{
        '--ph-width': typeof width === 'number' ? `${width}px` : width,
        '--ph-height': typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      aria-label={alt || mark || 'Logo placeholder'}
      role="img"
    >
      {src ? (
        <img className="ph-logo__img" src={src} alt={alt} />
      ) : showIcon ? (
        <Hexagon size={Math.round((typeof width === 'number' ? width : 72) * 0.42)} strokeWidth={1.75} />
      ) : (
        <span className="ph-logo__mark">{mark}</span>
      )}
    </div>
  )
}
