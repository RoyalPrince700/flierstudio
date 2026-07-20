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
 */
export default function EditableText({
  as: Tag = 'p',
  value = '',
  path,
  className = '',
  editable = false,
  focused = false,
  align,
  onFocusField,
  onChange,
  onExitTextEdit,
  style,
}) {
  const ref = useRef(null)
  const alignStyle = align ? { textAlign: align } : null
  const mergedStyle = { ...style, ...alignStyle }

  useLayoutEffect(() => {
    if (!editable) return
    const node = ref.current
    if (!node || document.activeElement === node) return
    const next = value ?? ''
    if (node.innerText !== next) node.innerText = next
  }, [value, editable])

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
        related.closest('.inspector'),
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
