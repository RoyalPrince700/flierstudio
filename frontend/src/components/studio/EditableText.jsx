import { useLayoutEffect, useRef } from 'react'

function normalizeEditableText(raw) {
  return String(raw ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+|\n+$/g, '')
}

/**
 * Click-to-edit text for flier canvases.
 * Enter inserts a new line; blur commits and can exit the text tool.
 *
 * On mobile (`canvasReadOnly`), taps select the field for the sheet editor
 * instead of focusing contentEditable (avoids browser zoom / scroll jumps).
 */
export default function EditableText({
  as: Tag = 'p',
  value = '',
  path,
  className = '',
  editable = false,
  focused = false,
  align,
  canvasReadOnly = false,
  onFocusField,
  onChange,
  onExitTextEdit,
  style,
}) {
  const ref = useRef(null)
  const alignStyle = align ? { textAlign: align } : null
  const mergedStyle = { ...style, ...alignStyle }

  useLayoutEffect(() => {
    if (!editable || canvasReadOnly) return
    const node = ref.current
    if (!node || document.activeElement === node) return
    const next = value ?? ''
    if (node.innerText !== next) node.innerText = next
  }, [value, editable, canvasReadOnly])

  if (!editable) {
    return (
      <Tag className={`studio-text ${className}`.trim()} style={mergedStyle}>
        {value}
      </Tag>
    )
  }

  function commit(next) {
    const cleaned = normalizeEditableText(next)
    if (cleaned !== normalizeEditableText(value)) onChange?.(path, cleaned)
  }

  function shouldKeepTextTool(related) {
    if (!related || !(related instanceof Element)) return false
    return Boolean(
      related.closest('.studio-editable') ||
        related.closest('.edit-panel') ||
        related.closest('.inspector') ||
        related.closest('.mobile-text-editor'),
    )
  }

  function selectForSheetEdit(e) {
    e.stopPropagation()
    e.preventDefault()
    onFocusField?.(path, 'text')
  }

  // Mobile: tap selects for the dock editor — never focus contentEditable on-canvas.
  if (canvasReadOnly) {
    return (
      <Tag
        ref={ref}
        className={`studio-text studio-editable studio-editable--sheet${focused ? ' is-focused' : ''} ${className}`.trim()}
        style={mergedStyle}
        data-edit-path={path}
        role="button"
        tabIndex={0}
        aria-pressed={focused}
        onPointerDown={selectForSheetEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onFocusField?.(path, 'text')
          }
        }}
      >
        {value}
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref}
      className={`studio-text studio-editable${focused ? ' is-focused' : ''} ${className}`.trim()}
      style={mergedStyle}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-edit-path={path}
      onPointerDown={(e) => e.stopPropagation()}
      onFocus={() => onFocusField?.(path, 'text')}
      onBlur={(e) => {
        commit(e.currentTarget.innerText ?? '')
        if (!shouldKeepTextTool(e.relatedTarget)) onExitTextEdit?.()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.currentTarget.blur()
          return
        }
        e.stopPropagation()
      }}
    />
  )
}
