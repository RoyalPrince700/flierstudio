/**
 * Standard export sizes by platform / format.
 *
 * Pick the size that matches the brief — never assume Instagram portrait
 * (1080×1350) for every board. Add a new entry here when a format is missing.
 */

export const FLIER_SIZES = {
  // Instagram / Meta
  'instagram-post': {
    id: 'instagram-post',
    label: 'Instagram Post',
    width: 1080,
    height: 1080,
    platform: 'instagram',
  },
  'instagram-portrait': {
    id: 'instagram-portrait',
    label: 'Instagram Portrait',
    width: 1080,
    height: 1350,
    platform: 'instagram',
  },
  'instagram-story': {
    id: 'instagram-story',
    label: 'Instagram Story / Reels cover',
    width: 1080,
    height: 1920,
    platform: 'instagram',
  },
  'facebook-post': {
    id: 'facebook-post',
    label: 'Facebook Post',
    width: 1200,
    height: 630,
    platform: 'facebook',
  },
  'facebook-story': {
    id: 'facebook-story',
    label: 'Facebook Story',
    width: 1080,
    height: 1920,
    platform: 'facebook',
  },

  // X (Twitter)
  'x-post': {
    id: 'x-post',
    label: 'X Post',
    width: 1600,
    height: 900,
    platform: 'x',
  },
  'x-header': {
    id: 'x-header',
    label: 'X Header',
    width: 1500,
    height: 500,
    platform: 'x',
  },

  // LinkedIn
  'linkedin-post': {
    id: 'linkedin-post',
    label: 'LinkedIn Post',
    width: 1200,
    height: 627,
    platform: 'linkedin',
  },
  'linkedin-square': {
    id: 'linkedin-square',
    label: 'LinkedIn Square',
    width: 1080,
    height: 1080,
    platform: 'linkedin',
  },

  // YouTube / Pinterest
  'youtube-thumbnail': {
    id: 'youtube-thumbnail',
    label: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    platform: 'youtube',
  },
  'pinterest-pin': {
    id: 'pinterest-pin',
    label: 'Pinterest Pin',
    width: 1000,
    height: 1500,
    platform: 'pinterest',
  },

  // Brand / portfolio boards (identity systems, not social feed)
  'brand-editorial': {
    id: 'brand-editorial',
    label: 'Brand Editorial (4:3)',
    width: 1600,
    height: 1200,
    platform: 'portfolio',
  },
  'brand-widescreen': {
    id: 'brand-widescreen',
    label: 'Brand Widescreen (16:9)',
    width: 1920,
    height: 1080,
    platform: 'portfolio',
  },

  // Print / square export
  'print-square-5in': {
    id: 'print-square-5in',
    label: 'Print Square 5×5 in (300 DPI)',
    width: 1500,
    height: 1500,
    platform: 'print',
  },
}

/** Neutral fallback when the brief does not name a size — square Instagram post. */
export const DEFAULT_SIZE = FLIER_SIZES['instagram-post']

/** Resolve a size id → size object. Unknown ids fall back to DEFAULT_SIZE. */
export function getFlierSize(id) {
  return FLIER_SIZES[id] ?? DEFAULT_SIZE
}

/**
 * Board + component props from a size id (or raw { width, height }).
 * Use in project.js: `...boardSize('instagram-story')`
 */
export function boardSize(idOrSize) {
  const size =
    typeof idOrSize === 'string'
      ? getFlierSize(idOrSize)
      : {
          width: idOrSize.width,
          height: idOrSize.height,
          label: idOrSize.label,
          id: idOrSize.id,
        }
  return {
    width: size.width,
    height: size.height,
    props: {
      width: size.width,
      height: size.height,
      ...(size.label ? { meta: `${size.label} · ${size.width}×${size.height}` } : null),
    },
  }
}
