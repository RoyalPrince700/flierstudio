import { DEFAULT_BRAND_LOGO_SRC, normalizeLogoMode } from '../design/defaultBrandLogo'
import { emergence } from '../design/emergenceTokens'
import {
  DEFAULT_STAGE_PEOPLE_COUNT,
  clampStagePeopleCount,
  resolveStagePeople,
  seedStagePeopleFromLists,
} from '../fliers/emergence/stagePeopleLayout'
import { clampLogoLayout, DEFAULT_LOGO_LAYOUT } from './logoLayout'

export {
  loadSavedDrafts,
  saveDrafts,
  readImageAsDataUrl,
} from './draftStorage'

/** Props that are layout/config, not editable copy/media */
const LOCKED_PROP_KEYS = new Set([
  'width',
  'height',
  'variant',
  'useGrayBg',
  'Component',
  'studioEdit',
  'content',
  'alignments',
  'fonts',
  'imageFits',
])

function clonePerson(person) {
  return {
    name: person.name,
    title: person.title,
    accent: person.accent,
    photoSrc: person.photoSrc || '',
  }
}

/** Full editable content tree for Emergence boards (defaults from tokens). */
export function createEmergenceContent() {
  const speakers = emergence.speakers.map(clonePerson)
  const panelists = emergence.panelists.map(clonePerson)
  return {
    event: {
      ...emergence.event,
      keywords: [...emergence.event.keywords],
      logoMode: normalizeLogoMode(emergence.event.logoMode || 'image'),
      logoLayout: clampLogoLayout(emergence.event.logoLayout || DEFAULT_LOGO_LAYOUT),
    },
    speakers,
    panelists,
    /** Cascade Stage Flex — unified stage cast (classic boards ignore these). */
    stagePeopleCount: DEFAULT_STAGE_PEOPLE_COUNT,
    stagePeople: seedStagePeopleFromLists(speakers, panelists),
    includeConvener: true,
    convener: {
      label: emergence.event.convenerLabel,
      photoSrc: '',
    },
    fonts: { ...emergence.fonts },
    alignments: {},
    imageFits: {},
    colorTheme: 'ocean',
  }
}

export function getByPath(obj, path) {
  if (!path) return undefined
  return path.split('.').reduce((acc, key) => {
    if (acc == null) return undefined
    const index = Number(key)
    if (Array.isArray(acc) && !Number.isNaN(index) && String(index) === key) {
      return acc[index]
    }
    return acc[key]
  }, obj)
}

export function setByPath(obj, path, value) {
  const keys = path.split('.')
  const next = structuredClone(obj)
  let cursor = next
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i]
    const index = Number(key)
    const useIndex = Array.isArray(cursor) && !Number.isNaN(index) && String(index) === key
    const k = useIndex ? index : key
    if (cursor[k] == null || typeof cursor[k] !== 'object') {
      const nextKey = keys[i + 1]
      const nextIndex = Number(nextKey)
      cursor[k] =
        !Number.isNaN(nextIndex) && String(nextIndex) === nextKey ? [] : {}
    }
    cursor = cursor[k]
  }
  const last = keys[keys.length - 1]
  const lastIndex = Number(last)
  if (Array.isArray(cursor) && !Number.isNaN(lastIndex) && String(lastIndex) === last) {
    cursor[lastIndex] = value
  } else {
    cursor[last] = value
  }
  return next
}

export function mergeEmergenceDraft(draft) {
  const base = createEmergenceContent()
  if (!draft) return base
  const event = { ...base.event, ...draft.event }

  // Older drafts stored "9 AM PROMPT" / "15TH AUGUST 2026" as single fields
  if (event.time && /\sPROMPT$/i.test(event.time) && !draft.event?.timeNote) {
    event.timeNote = 'PROMPT'
    event.time = event.time.replace(/\sPROMPT$/i, '').trim()
  }
  if (event.date && /\sAUGUST\s+2026$/i.test(event.date) && !draft.event?.dateNote) {
    event.dateNote = 'AUGUST 2026'
    event.date = event.date.replace(/\sAUGUST\s+2026$/i, '').trim()
  }

  // Pre-split drafts bound Stage Grid / Cascade Stage programme title to event.theme.
  // Keep that look until the user edits programmeTitle on its own path.
  if (draft.event && !Object.prototype.hasOwnProperty.call(draft.event, 'programmeTitle')) {
    event.programmeTitle = event.theme
  }

  // Cascade hero used to share series/theme/capsule with the header.
  // Seed independent hero paths from the old shared values until edited.
  if (draft.event) {
    if (!Object.prototype.hasOwnProperty.call(draft.event, 'heroSeries')) {
      event.heroSeries = event.series
    }
    if (!Object.prototype.hasOwnProperty.call(draft.event, 'heroTheme')) {
      event.heroTheme = event.theme
    }
    if (!Object.prototype.hasOwnProperty.call(draft.event, 'heroCapsule')) {
      event.heroCapsule = event.capsule
    }
  }

  // Brand mark mode: image | text | none
  const hadLogoMode =
    draft.event && Object.prototype.hasOwnProperty.call(draft.event, 'logoMode')
  event.logoMode = normalizeLogoMode(event.logoMode)
  if (!hadLogoMode) {
    // Legacy drafts always showed an image lockup (often the forced default).
    event.logoMode = 'image'
    if (!event.logoSrc || !String(event.logoSrc).trim()) {
      event.logoSrc = DEFAULT_BRAND_LOGO_SRC
    }
  } else if (event.logoMode === 'image' && (!event.logoSrc || !String(event.logoSrc).trim())) {
    // Image mode with an explicit empty src → empty brand slot
    event.logoMode = 'none'
    event.logoSrc = ''
  }

  event.logoLayout = clampLogoLayout({
    ...DEFAULT_LOGO_LAYOUT,
    ...(base.event.logoLayout || {}),
    ...(draft.event?.logoLayout || {}),
  })

  const speakers = base.speakers.map((person, i) => ({
    ...person,
    ...(draft.speakers?.[i] || {}),
  }))
  const panelists = base.panelists.map((person, i) => ({
    ...person,
    ...(draft.panelists?.[i] || {}),
  }))

  // Flex: merge by index over selected count (not locked to token length 3+3).
  // Keep full draft.stagePeople in storage via setByPath; resolve trims/pads for render.
  const stagePeopleCount = clampStagePeopleCount(
    draft.stagePeopleCount ?? base.stagePeopleCount ?? DEFAULT_STAGE_PEOPLE_COUNT,
  )
  const stagePeople = resolveStagePeople(
    draft.stagePeople,
    stagePeopleCount,
    base.stagePeople,
  )
  const includeConvener =
    typeof draft.includeConvener === 'boolean'
      ? draft.includeConvener
      : base.includeConvener !== false

  return {
    event,
    speakers,
    panelists,
    stagePeopleCount,
    stagePeople,
    includeConvener,
    convener: { ...base.convener, ...draft.convener },
    fonts: { ...base.fonts, ...draft.fonts },
    alignments: { ...base.alignments, ...(draft.alignments || {}) },
    imageFits: draft.imageFits && typeof draft.imageFits === 'object' ? draft.imageFits : {},
    colorTheme: draft.colorTheme || base.colorTheme,
  }
}

export function getItemEditKind(item, projectId) {
  if (item?.editKind) return item.editKind
  if (projectId === 'emergence' || item?.id?.startsWith('emergence-')) return 'emergence'
  return 'props'
}

/** Seed a props-style draft from board item defaults (strings only). */
export function createPropsDraft(props = {}) {
  const draft = { alignments: {} }
  Object.entries(props).forEach(([key, value]) => {
    if (LOCKED_PROP_KEYS.has(key)) return
    if (typeof value === 'string') draft[key] = value
  })
  return draft
}

/**
 * Merge props-style artboard drafts onto template defaults.
 * Strings and nested object/array patches (e.g. speakers.0.photoSrc) must survive —
 * same path reliability Emergence gets from mergeEmergenceDraft.
 */
export function mergePropsDraft(baseProps = {}, draft) {
  const merged = { ...baseProps }
  if (!draft) {
    return { ...merged, alignments: {}, imageFits: {} }
  }
  Object.entries(draft).forEach(([key, value]) => {
    if (
      key === 'alignments' ||
      key === 'fonts' ||
      key === 'imageFits' ||
      LOCKED_PROP_KEYS.has(key)
    ) {
      return
    }
    if (value == null) return
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      merged[key] = value
      return
    }
    if (Array.isArray(value)) {
      const baseArr = Array.isArray(baseProps[key]) ? baseProps[key] : []
      const length = Math.max(baseArr.length, value.length)
      merged[key] = Array.from({ length }, (_, i) => {
        const baseItem = baseArr[i]
        const draftItem = value[i]
        if (draftItem == null) return baseItem
        if (
          draftItem &&
          typeof draftItem === 'object' &&
          !Array.isArray(draftItem) &&
          (baseItem == null || (typeof baseItem === 'object' && !Array.isArray(baseItem)))
        ) {
          return { ...(baseItem || {}), ...draftItem }
        }
        return draftItem
      })
      return
    }
    if (typeof value === 'object') {
      const baseObj =
        baseProps[key] && typeof baseProps[key] === 'object' && !Array.isArray(baseProps[key])
          ? baseProps[key]
          : {}
      merged[key] = { ...baseObj, ...value }
    }
  })
  return {
    ...merged,
    alignments: { ...(draft.alignments || {}) },
    fonts: draft.fonts ? { ...draft.fonts } : undefined,
    imageFits:
      draft.imageFits && typeof draft.imageFits === 'object' ? draft.imageFits : {},
  }
}

export function getArtboardDraft(drafts, projectId, itemId) {
  return drafts?.[projectId]?.[itemId] ?? null
}

export function patchArtboardDraft(drafts, projectId, itemId, path, value, editKind) {
  if (!projectId || !itemId) return drafts
  const projectDrafts = drafts[projectId] || {}
  const current =
    projectDrafts[itemId] ||
    (editKind === 'emergence' ? createEmergenceContent() : { alignments: {} })
  return {
    ...drafts,
    [projectId]: {
      ...projectDrafts,
      // Only this artboard id is rewritten — siblings keep their prior references.
      [itemId]: setByPath(current, path, value),
    },
  }
}

export function setArtboardAlignment(drafts, projectId, itemId, textPath, align, editKind) {
  const projectDrafts = drafts[projectId] || {}
  const current =
    projectDrafts[itemId] ||
    (editKind === 'emergence' ? createEmergenceContent() : { alignments: {} })
  return {
    ...drafts,
    [projectId]: {
      ...projectDrafts,
      [itemId]: {
        ...current,
        alignments: {
          ...(current.alignments || {}),
          [textPath]: align,
        },
      },
    },
  }
}

export function clearArtboardDraft(drafts, projectId, itemId) {
  const projectDrafts = { ...(drafts[projectId] || {}) }
  delete projectDrafts[itemId]
  const next = { ...drafts }
  if (Object.keys(projectDrafts).length) next[projectId] = projectDrafts
  else delete next[projectId]
  return next
}

/** Clone one artboard draft onto a new layer id (for Duplicate). */
export function copyArtboardDraft(drafts, projectId, fromId, toId) {
  if (!fromId || !toId || fromId === toId) return drafts
  const projectDrafts = drafts[projectId] || {}
  const source = projectDrafts[fromId]
  if (!source) return drafts
  return {
    ...drafts,
    [projectId]: {
      ...projectDrafts,
      [toId]: structuredClone(source),
    },
  }
}

/** Build inspector view-model for the selected artboard. */
export function buildEditViewModel(item, draft, projectId) {
  if (!item) return null
  const editKind = getItemEditKind(item, projectId)
  if (editKind === 'emergence') {
    const merged = mergeEmergenceDraft(draft)
    return {
      kind: 'emergence',
      boardId: item.id,
      stageFlex:
        item.id === 'emergence-cascade-stage-flex' ||
        item.props?.stageFlex === true ||
        item.id?.includes('cascade-stage-flex'),
      ...merged,
    }
  }
  const merged = mergePropsDraft(item.props || {}, draft)
  return {
    kind: 'props',
    fields: merged,
    alignments: merged.alignments || {},
    fonts: merged.fonts || {},
    imageFits: merged.imageFits || {},
  }
}

export function projectSupportsEditing() {
  return true
}
