import { getImageFit } from '../../lib/imageFit'

/** Shared props for EditableImageSlot from studioEdit + path. */
export function editableImageProps(studioEdit, path, hasImage = false) {
  if (!studioEdit || !path) {
    return {
      path,
      editable: false,
      focused: false,
      hasImage,
      imageFit: undefined,
      onFocusField: undefined,
      onPickImage: undefined,
      onClearImage: undefined,
      onImageFitChange: undefined,
    }
  }
  return {
    path,
    editable: Boolean(studioEdit.enabled),
    focused: studioEdit.focusedPath === path,
    hasImage,
    imageFit: getImageFit(studioEdit.imageFits, path),
    onFocusField: studioEdit.onFocusField,
    onPickImage: studioEdit.onPickImage,
    onClearImage: studioEdit.onClearImage,
    onImageFitChange: studioEdit.onImageFitChange,
  }
}
