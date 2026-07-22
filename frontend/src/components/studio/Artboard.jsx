import { useEffect, useRef } from 'react'

function touchPair(touches) {
  return [
    { x: touches[0].clientX, y: touches[0].clientY },
    { x: touches[1].clientX, y: touches[1].clientY },
  ]
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function hitMeta(target) {
  if (!(target instanceof Element)) {
    return { overFrame: false, overEditable: false }
  }
  const overFrame = Boolean(target.closest('.artboard__frame'))
  const overEditable = Boolean(
    target.closest('.studio-editable') ||
      target.closest('[data-edit-path]') ||
      target.closest('.studio-image-slot'),
  )
  return { overFrame, overEditable }
}

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
  onCoachSignal,
}) {
  const viewportRef = useRef(null)
  const dragRef = useRef(null)
  const gestureRef = useRef(null)
  const panZoomRef = useRef({ pan, zoom })
  const coachRef = useRef(onCoachSignal)
  panZoomRef.current = { pan, zoom }
  coachRef.current = onCoachSignal

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

  // Pinch-zoom + two-finger pan (mobile). Desktop wheel/keyboard untouched.
  useEffect(() => {
    const node = viewportRef.current
    if (!node) return undefined

    function onTouchStart(e) {
      if (e.touches.length < 2) return
      e.preventDefault()
      const [a, b] = touchPair(e.touches)
      const rect = node.getBoundingClientRect()
      const mid = midpoint(a, b)
      const { pan: currentPan, zoom: currentZoom } = panZoomRef.current
      const localX = mid.x - rect.left
      const localY = mid.y - rect.top
      gestureRef.current = {
        startDist: Math.max(distance(a, b), 1),
        startZoom: currentZoom,
        worldX: (localX - currentPan.x) / currentZoom,
        worldY: (localY - currentPan.y) / currentZoom,
      }
      dragRef.current = null
    }

    function onTouchMove(e) {
      const gesture = gestureRef.current
      if (!gesture || e.touches.length < 2) return
      e.preventDefault()
      const [a, b] = touchPair(e.touches)
      const rect = node.getBoundingClientRect()
      const mid = midpoint(a, b)
      const localX = mid.x - rect.left
      const localY = mid.y - rect.top
      const nextZoom = Math.min(
        2.5,
        Math.max(0.08, gesture.startZoom * (distance(a, b) / gesture.startDist)),
      )
      onZoomChange(nextZoom)
      onPanChange({
        x: localX - gesture.worldX * nextZoom,
        y: localY - gesture.worldY * nextZoom,
      })
    }

    function onTouchEnd(e) {
      if (e.touches.length < 2) gestureRef.current = null
    }

    node.addEventListener('touchstart', onTouchStart, { passive: false })
    node.addEventListener('touchmove', onTouchMove, { passive: false })
    node.addEventListener('touchend', onTouchEnd)
    node.addEventListener('touchcancel', onTouchEnd)
    return () => {
      node.removeEventListener('touchstart', onTouchStart)
      node.removeEventListener('touchmove', onTouchMove)
      node.removeEventListener('touchend', onTouchEnd)
      node.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [onPanChange, onZoomChange])

  function beginPan(e, meta = {}) {
    dragRef.current = {
      mode: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      originX: pan.x,
      originY: pan.y,
      startTime: performance.now(),
      pointerType: e.pointerType || 'mouse',
      moved: 0,
      ...meta,
    }
  }

  function beginProbePan(e) {
    dragRef.current = {
      mode: 'probe-pan',
      startX: e.clientX,
      startY: e.clientY,
      startTime: performance.now(),
      pointerType: e.pointerType || 'mouse',
      moved: 0,
    }
  }

  function finishDrag(e) {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag) return

    const endX = e?.clientX ?? drag.startX
    const endY = e?.clientY ?? drag.startY
    const dist = Math.hypot(endX - drag.startX, endY - drag.startY)
    const durationMs = performance.now() - drag.startTime
    const moved = Math.max(drag.moved || 0, dist)

    if (drag.mode === 'probe-pan') {
      coachRef.current?.({
        type: 'select-empty-drag',
        distance: moved,
        durationMs,
        pointerType: drag.pointerType,
      })
      return
    }

    if (drag.mode === 'pan') {
      // Short press on a board/editable while Hand is active → likely edit intent
      coachRef.current?.({
        type: 'hand-edit-tap',
        distance: moved,
        durationMs,
        overFrame: Boolean(drag.overFrame),
        overEditable: Boolean(drag.overEditable),
        pointerType: drag.pointerType,
      })
      if (moved > 16) {
        coachRef.current?.({ type: 'did-pan' })
      }
    }
  }

  function onPointerDown(e) {
    if (e.button !== 0 && e.button !== 1) return
    if (gestureRef.current) return

    const meta = hitMeta(e.target)
    const wantsPan = tool === 'hand' || e.button === 1

    if (wantsPan) {
      e.preventDefault()
      beginPan(e, meta)
      e.currentTarget.setPointerCapture(e.pointerId)
      return
    }

    // Select / Text: empty-canvas drag often means "I wanted to pan"
    if ((tool === 'select' || tool === 'text') && !meta.overFrame) {
      beginProbePan(e)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  function onPointerMove(e) {
    const drag = dragRef.current
    if (!drag) return

    const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY)
    drag.moved = Math.max(drag.moved || 0, dist)

    if (drag.mode === 'pan') {
      onPanChange({
        x: drag.originX + (e.clientX - drag.startX),
        y: drag.originY + (e.clientY - drag.startY),
      })
    }
  }

  function onPointerUp(e) {
    finishDrag(e)
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

    // Mobile often drags on the board itself expecting pan — probe that intent.
    // Skip when the press starts on an editable slot (likely edit, not pan).
    const meta = hitMeta(e.target)
    if ((tool === 'select' || tool === 'text') && !meta.overEditable && e.button === 0) {
      dragRef.current = {
        mode: 'probe-frame-pan',
        startX: e.clientX,
        startY: e.clientY,
        startTime: performance.now(),
        pointerType: e.pointerType || 'mouse',
        moved: 0,
        frameId: id,
      }
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    } else {
      coachRef.current?.({ type: 'did-select', id })
    }
  }

  function onFramePointerMove(e) {
    const drag = dragRef.current
    if (!drag || drag.mode !== 'probe-frame-pan') return
    const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY)
    drag.moved = Math.max(drag.moved || 0, dist)
  }

  function onFramePointerUp(e) {
    const drag = dragRef.current
    if (!drag || drag.mode !== 'probe-frame-pan') return
    const endX = e?.clientX ?? drag.startX
    const endY = e?.clientY ?? drag.startY
    const dist = Math.hypot(endX - drag.startX, endY - drag.startY)
    const durationMs = performance.now() - drag.startTime
    const moved = Math.max(drag.moved || 0, dist)
    dragRef.current = null

    if (moved < 12) {
      // Genuine tap-to-select — not a pan attempt
      coachRef.current?.({ type: 'did-select', id: drag.frameId })
      return
    }

    coachRef.current?.({
      type: 'select-empty-drag',
      distance: moved,
      durationMs,
      pointerType: drag.pointerType,
      onFrame: true,
    })
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
      onPointerCancel={onPointerUp}
      onPointerLeave={(e) => {
        // Only end if we lost the pointer (no capture) — capture keeps drag alive
        if (dragRef.current && e.currentTarget.hasPointerCapture?.(e.pointerId)) return
        if (dragRef.current && !e.buttons) finishDrag(e)
      }}
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
              onPointerMove={onFramePointerMove}
              onPointerUp={onFramePointerUp}
              onPointerCancel={onFramePointerUp}
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
