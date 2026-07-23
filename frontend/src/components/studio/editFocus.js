import { isBrandFieldPath } from '../../lib/logoLayout'

function isImagePath(path) {
  return Boolean(
    path &&
      (path.endsWith('photoSrc') ||
        path.endsWith('Src') ||
        path.endsWith('Image') ||
        path === 'backgroundImage' ||
        path === 'logoSrc'),
  )
}

/** Context focus for EditPanel section priority: image (incl. logo/brand) | text | none */
export function resolveEditFocusMode(focusedKind, focusedPath) {
  const imageFocused = focusedKind === 'image' || isImagePath(focusedPath)
  const brandFocused = isBrandFieldPath(focusedPath)
  if (imageFocused || brandFocused) return 'image'
  if (focusedPath) return 'text'
  return 'none'
}

export { isImagePath }
