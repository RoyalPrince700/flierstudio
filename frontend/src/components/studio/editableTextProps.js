/** Shared props for EditableText wired to studio edit API. */
export function editableTextProps(studioEdit, path) {
  if (!studioEdit || !path) {
    return { path, editable: false }
  }
  return {
    path,
    editable: Boolean(studioEdit.enabled),
    focused: studioEdit.focusedPath === path,
    align: studioEdit.alignments?.[path],
    onFocusField: studioEdit.onFocusField,
    onChange: studioEdit.onChange,
    onExitTextEdit: studioEdit.onExitTextEdit,
  }
}
