import { useState } from 'react'
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

  if (!editable) return children

  const openReplace = () => {
    setConfirmOpen(false)
    onPickImage?.(path)
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
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}
