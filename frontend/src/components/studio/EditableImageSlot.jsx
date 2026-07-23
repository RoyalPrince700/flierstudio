import { useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
} from 'lucide-react'
import {
  DEFAULT_IMAGE_FIT,
  IMAGE_FIT_MAX_SCALE,
  IMAGE_FIT_MIN_SCALE,
  clampImageFit,
  getImageFit,
  imageFitCssVars,
  panImageFit,
  zoomImageFit,
} from '../../lib/imageFit'
import {
  DEFAULT_LOGO_LAYOUT,
  LOGO_NUDGE_X,
  LOGO_OFFSET_X_MAX,
  LOGO_OFFSET_X_MIN,
  LOGO_SCALE_MAX,
  LOGO_SCALE_MIN,
  LOGO_SCALE_STEP,
  clampLogoLayout,
  nudgeLogoLayout,
  scaleLogoLayout,
} from '../../lib/logoLayout'

/**
 * Clickable image placeholder — select-first crop UX.
 * Empty: tap/click anywhere on the slot opens the picker (or onEmptyClick for
 * logo brand chooser). On mobile, pick runs on pointerup so it is not lost when
 * focus opens the Edit sheet.
 * Filled: click focuses only (no modal). Focused chrome:
 *   Photo: − / + / reset | Replace / Remove
 *   Logo:  size −/+ · ← → · reset | text | Flier Studio | Replace / Remove
 * Mobile: filled photos stay on-canvas (sheet stays closed); logos may open Edit.
 */
export default function EditableImageSlot({
  path,
  editable = false,
  focused = false,
  hasImage = false,
  imageFit: imageFitProp,
  imageFits,
  onFocusField,
  onPickImage,
  onClearImage,
  onImageFitChange,
  variant = 'photo',
  logoLayout: logoLayoutProp,
  onLogoLayoutChange,
  onUseTextLogo,
  onRestoreDefaultLogo,
  onEmptyClick,
  children,
  className = '',
  emptyHint = 'Add photo',
  filledHint = 'Select',
  emptyTitle = 'Click to add PNG or JPEG',
  filledTitle = 'Click to select · drag to pan · scroll to zoom',
  enableFit = true,
}) {
  const ignoreSlotClickUntil = useRef(0)
  const dragRef = useRef(null)
  const emptyTapRef = useRef(null)
  const slotRef = useRef(null)
  const fitRef = useRef(DEFAULT_IMAGE_FIT)
  const logoRef = useRef(DEFAULT_LOGO_LAYOUT)

  const isLogo = variant === 'logo'
  const fit = clampImageFit(
    imageFitProp || getImageFit(imageFits, path) || DEFAULT_IMAGE_FIT,
  )
  fitRef.current = fit
  const logoLayout = clampLogoLayout(logoLayoutProp || DEFAULT_LOGO_LAYOUT)
  logoRef.current = logoLayout

  const canFit = !isLogo && enableFit && hasImage && typeof onImageFitChange === 'function'
  const canLogoLayout = isLogo && hasImage && typeof onLogoLayoutChange === 'function'
  const showChrome = focused && hasImage

  const focusImage = () => {
    onFocusField?.(path, 'image', { hasImage, variant })
  }

  useEffect(() => {
    const node = slotRef.current
    if (!editable || !node || !focused) return undefined

    if (canFit) {
      function onWheel(e) {
        e.preventDefault()
        e.stopPropagation()
        const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08
        onImageFitChange(path, zoomImageFit(fitRef.current, factor))
      }
      node.addEventListener('wheel', onWheel, { passive: false })
      return () => node.removeEventListener('wheel', onWheel)
    }

    if (canLogoLayout) {
      function onWheel(e) {
        e.preventDefault()
        e.stopPropagation()
        const factor = e.deltaY < 0 ? LOGO_SCALE_STEP : 1 / LOGO_SCALE_STEP
        onLogoLayoutChange(scaleLogoLayout(logoRef.current, factor))
      }
      node.addEventListener('wheel', onWheel, { passive: false })
      return () => node.removeEventListener('wheel', onWheel)
    }

    return undefined
  }, [editable, canFit, canLogoLayout, focused, onImageFitChange, onLogoLayoutChange, path])

  if (!editable) return children

  const armClickThroughGuard = () => {
    ignoreSlotClickUntil.current = Date.now() + 450
  }

  const activateEmptySlot = () => {
    if (typeof onEmptyClick === 'function') {
      focusImage()
      onEmptyClick()
      return
    }
    // Pick first while the user gesture is still active; focus/sheet can follow.
    onPickImage?.(path)
    focusImage()
  }

  const commitFit = (next) => {
    if (!canFit) return
    onImageFitChange(path, clampImageFit(next))
  }

  const commitLogo = (next) => {
    if (!canLogoLayout) return
    onLogoLayoutChange(clampLogoLayout(next))
  }

  const handleReplace = (e) => {
    e.stopPropagation()
    onPickImage?.(path)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onClearImage?.(path)
  }

  const onPointerDownDrag = (e) => {
    if (!focused || e.button !== 0) return
    if (e.target.closest('[data-studio-chrome]')) return
    if (!canFit && !canLogoLayout) return
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    dragRef.current = {
      mode: canLogoLayout ? 'logo' : 'fit',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height),
      fit: fitRef.current,
      logo: logoRef.current,
      artScale: 1,
    }
    const artboard = el.closest('.artboard__stage, .e-flier, [data-export-root]')
    if (artboard) {
      const ar = artboard.getBoundingClientRect()
      const aw = artboard.offsetWidth || ar.width
      if (aw > 0) dragRef.current.artScale = ar.width / aw
    }
    el.setPointerCapture?.(e.pointerId)
  }

  const onPointerMoveDrag = (e) => {
    const emptyTap = emptyTapRef.current
    if (emptyTap && emptyTap.pointerId === e.pointerId) {
      const dist = Math.hypot(e.clientX - emptyTap.startX, e.clientY - emptyTap.startY)
      if (dist > 10) emptyTap.moved = true
    }

    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const dx = e.clientX - drag.lastX
    const dy = e.clientY - drag.lastY
    drag.lastX = e.clientX
    drag.lastY = e.clientY
    const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY)
    if (dist > 4) drag.moved = true
    if (!drag.moved) return
    e.preventDefault()
    e.stopPropagation()
    if (drag.mode === 'logo') {
      const scale = drag.artScale || 1
      const next = nudgeLogoLayout(drag.logo, dx / scale, 0)
      drag.logo = next
      commitLogo(next)
      return
    }
    const next = panImageFit(drag.fit, dx / drag.width, dy / drag.height)
    drag.fit = next
    commitFit(next)
  }

  const endPointerDrag = (e) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const moved = drag.moved
    dragRef.current = null
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      /* already released */
    }
    if (moved) armClickThroughGuard()
  }

  const endEmptyTap = (e) => {
    const emptyTap = emptyTapRef.current
    if (!emptyTap || emptyTap.pointerId !== e.pointerId) return
    emptyTapRef.current = null
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      /* already released */
    }
    if (emptyTap.moved) return
    // Pick while still in the user gesture — before/without depending on click,
    // which mobile loses when focus opens the Edit sheet.
    activateEmptySlot()
    armClickThroughGuard()
  }

  const fitVars = canFit ? imageFitCssVars(fit) : undefined

  let title = emptyTitle
  if (hasImage) {
    if (focused) {
      if (canFit) title = 'Drag to pan · scroll to zoom'
      else if (canLogoLayout) title = 'Drag to nudge · scroll to resize'
      else title = 'Selected — use on-slot controls'
    } else {
      title = filledTitle
    }
  }

  return (
    <div
      ref={slotRef}
      className={`studio-image-slot${hasImage ? '' : ' studio-image-slot--empty'}${focused ? ' is-focused' : ''}${canFit ? ' studio-image-slot--fitted' : ''}${canFit && focused ? ' is-fitting' : ''}${canLogoLayout && focused ? ' is-logo-editing' : ''} ${className}`.trim()}
      data-edit-path={path}
      style={fitVars}
      onPointerDown={(e) => {
        if (e.button !== 0 && e.button !== -1) return
        e.stopPropagation()
        if (e.target.closest('[data-studio-chrome]')) return

        if (!hasImage) {
          // Do not focus yet — opening the mobile Edit sheet on pointerdown
          // swallows the subsequent click and blocks the file picker gesture.
          emptyTapRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            moved: false,
          }
          try {
            e.currentTarget.setPointerCapture?.(e.pointerId)
          } catch {
            /* ignore */
          }
          return
        }

        // Focus (and close Edit sheet on filled photos) so pan is not covered.
        focusImage()
        onPointerDownDrag(e)
      }}
      onPointerMove={onPointerMoveDrag}
      onPointerUp={(e) => {
        endEmptyTap(e)
        endPointerDrag(e)
      }}
      onPointerCancel={(e) => {
        emptyTapRef.current = null
        endPointerDrag(e)
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (e.target.closest('[data-studio-chrome]')) return
        if (Date.now() < ignoreSlotClickUntil.current) return
        if (!hasImage) {
          // Desktop / browsers that synthesize click without our pointerup path.
          activateEmptySlot()
          armClickThroughGuard()
          return
        }
        focusImage()
      }}
      title={title}
    >
      {children}
      <span className="studio-image-slot__hint" data-studio-chrome aria-hidden>
        {hasImage
          ? focused
            ? canFit
              ? 'Pan · Zoom'
              : canLogoLayout
                ? 'Size · Nudge'
                : 'Selected'
            : filledHint
          : emptyHint}
      </span>
      {showChrome ? (
        <div
          className="studio-image-slot__fit-chrome"
          data-studio-chrome
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {canFit ? (
            <>
              <button
                type="button"
                className="studio-image-slot__fit-btn"
                title="Zoom out"
                aria-label="Zoom out"
                disabled={fit.scale <= IMAGE_FIT_MIN_SCALE + 0.001}
                onClick={() => commitFit(zoomImageFit(fit, 1 / 1.15))}
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="studio-image-slot__fit-btn"
                title="Zoom in"
                aria-label="Zoom in"
                disabled={fit.scale >= IMAGE_FIT_MAX_SCALE - 0.001}
                onClick={() => commitFit(zoomImageFit(fit, 1.15))}
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="studio-image-slot__fit-btn"
                title="Reset crop"
                aria-label="Reset crop"
                onClick={() => commitFit(DEFAULT_IMAGE_FIT)}
              >
                <RotateCcw size={12} strokeWidth={2.5} />
              </button>
              <span className="studio-image-slot__fit-sep" aria-hidden />
            </>
          ) : null}
          {canLogoLayout ? (
            <>
              <button
                type="button"
                className="studio-image-slot__fit-btn"
                title="Smaller"
                aria-label="Make logo smaller"
                disabled={logoLayout.scale <= LOGO_SCALE_MIN + 0.001}
                onClick={() => commitLogo(scaleLogoLayout(logoLayout, 1 / LOGO_SCALE_STEP))}
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="studio-image-slot__fit-btn"
                title="Larger"
                aria-label="Make logo larger"
                disabled={logoLayout.scale >= LOGO_SCALE_MAX - 0.001}
                onClick={() => commitLogo(scaleLogoLayout(logoLayout, LOGO_SCALE_STEP))}
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="studio-image-slot__fit-btn"
                title="Move left"
                aria-label="Nudge logo left"
                disabled={logoLayout.offsetX <= LOGO_OFFSET_X_MIN + 0.001}
                onClick={() => commitLogo(nudgeLogoLayout(logoLayout, -LOGO_NUDGE_X))}
              >
                <ChevronLeft size={12} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="studio-image-slot__fit-btn"
                title="Move right"
                aria-label="Nudge logo right"
                disabled={logoLayout.offsetX >= LOGO_OFFSET_X_MAX - 0.001}
                onClick={() => commitLogo(nudgeLogoLayout(logoLayout, LOGO_NUDGE_X))}
              >
                <ChevronRight size={12} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="studio-image-slot__fit-btn"
                title="Reset layout"
                aria-label="Reset logo size and position"
                onClick={() => commitLogo(DEFAULT_LOGO_LAYOUT)}
              >
                <RotateCcw size={12} strokeWidth={2.5} />
              </button>
              <span className="studio-image-slot__fit-sep" aria-hidden />
              {typeof onUseTextLogo === 'function' ? (
                <button
                  type="button"
                  className="studio-image-slot__fit-btn"
                  title="Use text logo"
                  aria-label="Use text logo instead"
                  onClick={(e) => {
                    e.stopPropagation()
                    onUseTextLogo()
                  }}
                >
                  <Type size={12} strokeWidth={2.5} />
                </button>
              ) : null}
              {typeof onRestoreDefaultLogo === 'function' ? (
                <button
                  type="button"
                  className="studio-image-slot__fit-btn"
                  title="Use Flier Studio logo"
                  aria-label="Restore Flier Studio logo"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRestoreDefaultLogo()
                  }}
                >
                  <Sparkles size={12} strokeWidth={2.5} />
                </button>
              ) : null}
              {onUseTextLogo || onRestoreDefaultLogo ? (
                <span className="studio-image-slot__fit-sep" aria-hidden />
              ) : null}
            </>
          ) : null}
          <button
            type="button"
            className="studio-image-slot__fit-btn"
            title="Replace image"
            aria-label="Replace image"
            onClick={handleReplace}
          >
            <ImagePlus size={12} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            className="studio-image-slot__fit-btn studio-image-slot__fit-btn--danger"
            title={isLogo ? 'Remove logo' : 'Remove image'}
            aria-label={isLogo ? 'Remove logo' : 'Remove image'}
            onClick={handleRemove}
          >
            <Trash2 size={12} strokeWidth={2.5} />
          </button>
        </div>
      ) : null}
    </div>
  )
}
