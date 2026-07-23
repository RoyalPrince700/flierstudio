import { memo, useEffect, useMemo, useState } from 'react'

/**
 * Live mini-render of an artboard for the inspector Layers list / collapsed rail.
 * Mirrors SamplePreview scaling; strips studioEdit so thumbs stay non-interactive.
 */

function stripStudioEdit(props) {
  if (!props || typeof props !== 'object') return {}
  const { studioEdit: _studioEdit, ...rest } = props
  return rest
}

/** Stable signature of draft-visible props (ignores studioEdit / focus chrome). */
export function layerThumbSignature(item) {
  if (!item) return ''
  const props = stripStudioEdit(item.props)
  const content = props.content
  if (content && typeof content === 'object') {
    const speakers = Array.isArray(content.speakers)
      ? content.speakers.map((s) => s?.photoSrc || '').join(',')
      : ''
    const panelists = Array.isArray(content.panelists)
      ? content.panelists.map((p) => p?.photoSrc || '').join(',')
      : ''
    return [
      item.id,
      content.colorTheme || '',
      content.event?.logoMode || '',
      content.event?.logoSrc || '',
      content.event?.wordmark || '',
      content.event?.qrSrc || '',
      content.convener?.photoSrc || '',
      speakers,
      panelists,
      JSON.stringify(content.fonts || null),
      JSON.stringify(content.event?.logoLayout || null),
      JSON.stringify(content.imageFits || null),
    ].join('|')
  }
  try {
    return `${item.id}|${JSON.stringify(props)}`
  } catch {
    return String(item.id)
  }
}

function LayerThumb({ item, active = false, size = 'md' }) {
  const frameW = size === 'sm' ? 18 : 36
  const width = item?.width || 1080
  const height = item?.height || 1350
  const aspect = height / width
  const frameH = Math.max(22, Math.round(frameW * aspect))

  const signature = useMemo(() => layerThumbSignature(item), [item])
  const [settledSig, setSettledSig] = useState(signature)
  const [settledProps, setSettledProps] = useState(() => stripStudioEdit(item?.props))

  useEffect(() => {
    if (!item) return undefined
    const nextProps = stripStudioEdit(item.props)
    const delay = active ? 80 : 320
    const timer = window.setTimeout(() => {
      setSettledSig(signature)
      setSettledProps(nextProps)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [item, signature, active])

  if (!item?.Component) {
    return (
      <span
        className={`inspector__swatch inspector__swatch--fallback${size === 'sm' ? ' inspector__swatch--rail' : ''}`}
        style={item?.color ? { background: item.color } : undefined}
        aria-hidden
      />
    )
  }

  const Component = item.Component
  const scale = Math.min(frameW / width, frameH / height)
  const fitWidth = width * scale
  const fitHeight = height * scale

  return (
    <span
      className={`inspector__thumb${active ? ' is-active' : ''}${size === 'sm' ? ' inspector__thumb--sm' : ''}`}
      style={{ width: frameW, height: frameH }}
      aria-hidden
      data-thumb-sig={settledSig}
    >
      <span className="inspector__thumb-fit" style={{ width: fitWidth, height: fitHeight }}>
        <span
          className="inspector__thumb-scaler"
          style={{
            width,
            height,
            transform: `scale(${scale})`,
          }}
        >
          <Component {...settledProps} width={width} height={height} />
        </span>
      </span>
    </span>
  )
}

function propsEqual(prev, next) {
  return (
    prev.active === next.active &&
    prev.size === next.size &&
    prev.item?.id === next.item?.id &&
    prev.item?.Component === next.item?.Component &&
    prev.item?.width === next.item?.width &&
    prev.item?.height === next.item?.height &&
    layerThumbSignature(prev.item) === layerThumbSignature(next.item)
  )
}

export default memo(LayerThumb, propsEqual)
