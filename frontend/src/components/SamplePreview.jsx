/**
 * Scales a native-size flier into a card thumbnail frame for the templates grid.
 * Pass frameHeight + fit="contain" for uniform library cards.
 */
export default function SamplePreview({
  template,
  frameWidth = 220,
  frameHeight,
  fit = 'native',
  className = '',
}) {
  if (!template?.Component) return null

  const Component = template.Component
  const contain = fit === 'contain' && frameHeight

  const scale = contain
    ? Math.min(frameWidth / template.width, frameHeight / template.height)
    : frameWidth / template.width

  const fitWidth = template.width * scale
  const fitHeight = template.height * scale
  const outerHeight = contain ? frameHeight : fitHeight

  return (
    <div
      className={`sample-preview${contain ? ' sample-preview--contain' : ''} ${className}`.trim()}
      style={{ width: frameWidth, height: outerHeight }}
    >
      <div
        className="sample-preview__fit"
        style={{ width: fitWidth, height: fitHeight }}
      >
        <div
          className="sample-preview__scaler"
          style={{
            width: template.width,
            height: template.height,
            transform: `scale(${scale})`,
          }}
        >
          <Component
            {...(template.props || {})}
            width={template.width}
            height={template.height}
          />
        </div>
      </div>
    </div>
  )
}
