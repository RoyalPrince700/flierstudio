/**
 * Clickable image placeholder wrapper — focuses slot for PNG/JPEG upload.
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
  filledTitle = 'Click to replace photo',
}) {
  if (!editable) return children

  return (
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
        if (!hasImage) onPickImage?.(path)
      }}
      title={hasImage ? filledTitle : emptyTitle}
    >
      {children}
      <span className="studio-image-slot__hint" data-studio-chrome aria-hidden>
        {hasImage ? filledHint : emptyHint}
      </span>
    </div>
  )
}
