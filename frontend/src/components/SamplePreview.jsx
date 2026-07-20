/**
 * Scales a native-size flier into a fixed card frame for the Samples grid.
 */
export default function SamplePreview({
  template,
  frameWidth = 220,
  className = '',
}) {
  if (!template?.Component) return null

  const Component = template.Component
  const scale = frameWidth / template.width
  const frameHeight = template.height * scale

  return (
    <div
      className={`sample-preview ${className}`.trim()}
      style={{ width: frameWidth, height: frameHeight }}
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
  )
}
