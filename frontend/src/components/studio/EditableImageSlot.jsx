import { useRef, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

/**
 * Clickable image placeholder wrapper — focuses slot for PNG/JPEG upload.
 * Empty: click opens picker. Filled: click asks to confirm replace.
 * Hint badge is marked data-studio-chrome and stripped on export.
 */
export default function EditableImageSlot({
  path,
  editable = false,
  focused = false,
  hasImage = false,
  onFocusField,
  onPickImage,
  children,
  className = '',
  emptyHint = 'Add photo',
  filledHint = 'Replace',
  emptyTitle = 'Click to add PNG or JPEG',
  filledTitle = 'Click to change photo',
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  // Mobile browsers can deliver a click-through to the slot after the overlay
  // unmounts; ignore that synthetic re-open for a short window.
  const ignoreSlotClickUntil = useRef(0)

  if (!editable) return children

  const armClickThroughGuard = () => {
    ignoreSlotClickUntil.current = Date.now() + 450
  }

  const closeConfirm = () => {
    armClickThroughGuard()
    setConfirmOpen(false)
  }

  const openReplace = () => {
    armClickThroughGuard()
    // Pick while still in the user-gesture turn, then close.
    // Deferring the file input click (e.g. rAF after unmount) loses activation
    // on some browsers and makes Change appear to do nothing.
    onPickImage?.(path)
    setConfirmOpen(false)
  }

  return (
    <>
      <div
        className={`studio-image-slot${focused ? ' is-focused' : ''} ${className}`.trim()}
        data-edit-path={path}
        onPointerDown={(e) => {
          e.stopPropagation()
          onFocusField?.(path, 'image')
        }}
        onClick={(e) => {
          e.stopPropagation()
          onFocusField?.(path, 'image')
          if (Date.now() < ignoreSlotClickUntil.current) return
          if (!hasImage) {
            onPickImage?.(path)
            return
          }
          setConfirmOpen(true)
        }}
        title={hasImage ? filledTitle : emptyTitle}
      >
        {children}
        <span className="studio-image-slot__hint" data-studio-chrome aria-hidden>
          {hasImage ? filledHint : emptyHint}
        </span>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        eyebrow="Image"
        title="Change image?"
        message="Do you want to change this image?"
        confirmLabel="Change"
        cancelLabel="Cancel"
        tone="image"
        onConfirm={openReplace}
        onClose={closeConfirm}
      />
    </>
  )
}
