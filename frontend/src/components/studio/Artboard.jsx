import { useEffect, useRef } from 'react'

export default function Artboard({
  items,
  selectedId,
  tool,
  zoom,
  pan,
  showLabels,
  showGrid,
  frameRefs,
  onSelect,
  onPanChange,
  onZoomChange,
  onExitTextEdit,
}) {
  const viewportRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    const node = viewportRef.current
    if (!node) return undefined

    function onWheel(e) {
      e.preventDefault()

      // Ctrl/Cmd + scroll zooms; plain scroll pans the canvas
      if (e.ctrlKey || e.metaKey) {
        const rect = node.getBoundingClientRect()
        const cursorX = e.clientX - rect.left
        const cursorY = e.clientY - rect.top
        const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08
        const nextZoom = Math.min(2.5, Math.max(0.08, zoom * factor))

        const worldX = (cursorX - pan.x) / zoom
        const worldY = (cursorY - pan.y) / zoom

        onZoomChange(nextZoom)
        onPanChange({
          x: cursorX - worldX * nextZoom,
          y: cursorY - worldY * nextZoom,
        })
        return
      }

      let dx = e.deltaX
      let dy = e.deltaY
      if (e.shiftKey && dx === 0) {
        dx = dy
        dy = 0
      }
      onPanChange({
        x: pan.x - dx,
        y: pan.y - dy,
      })
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [zoom, pan, onPanChange, onZoomChange])

  function beginPan(e) {
    dragRef.current = {
      mode: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      originX: pan.x,
      originY: pan.y,
    }
  }

  function onPointerDown(e) {
    if (e.button !== 0 && e.button !== 1) return
    const wantsPan = tool === 'hand' || e.button === 1
    if (wantsPan) {
      e.preventDefault()
      beginPan(e)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  function onPointerMove(e) {
    const drag = dragRef.current
    if (!drag || drag.mode !== 'pan') return
    onPanChange({
      x: drag.originX + (e.clientX - drag.startX),
      y: drag.originY + (e.clientY - drag.startY),
    })
  }

  function onPointerUp() {
    dragRef.current = null
  }

  function onFramePointerDown(e, id) {
    if (tool === 'hand') return
    e.stopPropagation()
    onSelect(id)
    const target = e.target
    const onText =
      target instanceof Element &&
      (target.closest?.('.studio-editable') || target.closest?.('[data-edit-path]'))
    if (tool === 'text' && !onText) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      onExitTextEdit?.()
    }
  }

  const cursor =
    tool === 'hand'
      ? dragRef.current
        ? 'grabbing'
        : 'grab'
      : tool === 'text'
        ? 'text'
        : 'default'

  return (
    <div
      ref={viewportRef}
      className={`artboard${showGrid ? ' artboard--grid' : ''}`}
      style={{ cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onMouseDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (tool === 'text') {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
          onExitTextEdit?.()
        }
        if (tool === 'select' || tool === 'text') onSelect(null)
      }}
    >
      <div
        className="artboard__world"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {items.map((item) => {
          const Component = item.Component
          const selected = selectedId === item.id
          return (
            <div
              key={item.id}
              className={`artboard__frame${selected ? ' is-selected' : ''}`}
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
              }}
              onPointerDown={(e) => onFramePointerDown(e, item.id)}
            >
              {showLabels ? (
                <div
                  className="artboard__label"
                  style={{ transform: `scale(${1 / zoom})` }}
                >
                  <span>{item.name}</span>
                  <small>
                    {item.width}×{item.height}
                  </small>
                </div>
              ) : null}

              <div
                className="artboard__canvas"
                ref={(node) => {
                  frameRefs.current[item.id] = node
                }}
              >
                <Component {...item.props} />
              </div>

              {selected ? <div className="artboard__selection" aria-hidden /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
