import { emergence } from '../design/emergenceTokens'

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
  return {
    event: { ...emergence.event, keywords: [...emergence.event.keywords] },
    speakers: emergence.speakers.map(clonePerson),
    panelists: emergence.panelists.map(clonePerson),
    convener: {
      label: emergence.event.convenerLabel,
      photoSrc: '',
    },
    fonts: { ...emergence.fonts },
    alignments: {},
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

  return {
    event,
    speakers: base.speakers.map((person, i) => ({
      ...person,
      ...(draft.speakers?.[i] || {}),
    })),
    panelists: base.panelists.map((person, i) => ({
      ...person,
      ...(draft.panelists?.[i] || {}),
    })),
    convener: { ...base.convener, ...draft.convener },
    fonts: { ...base.fonts, ...draft.fonts },
    alignments: { ...base.alignments, ...(draft.alignments || {}) },
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

export function mergePropsDraft(baseProps = {}, draft) {
  const merged = { ...baseProps }
  if (!draft) {
    return { ...merged, alignments: {} }
  }
  Object.entries(draft).forEach(([key, value]) => {
    if (key === 'alignments' || key === 'fonts' || LOCKED_PROP_KEYS.has(key)) return
    if (typeof value === 'string') merged[key] = value
  })
  return {
    ...merged,
    alignments: { ...(draft.alignments || {}) },
    fonts: draft.fonts ? { ...draft.fonts } : undefined,
  }
}

export function getArtboardDraft(drafts, projectId, itemId) {
  return drafts?.[projectId]?.[itemId] ?? null
}

export function patchArtboardDraft(drafts, projectId, itemId, path, value, editKind) {
  const projectDrafts = drafts[projectId] || {}
  const current =
    projectDrafts[itemId] ||
    (editKind === 'emergence' ? createEmergenceContent() : { alignments: {} })
  return {
    ...drafts,
    [projectId]: {
      ...projectDrafts,
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
    return { kind: 'emergence', ...mergeEmergenceDraft(draft) }
  }
  const merged = mergePropsDraft(item.props || {}, draft)
  return {
    kind: 'props',
    fields: merged,
    alignments: merged.alignments || {},
    fonts: merged.fonts || {},
  }
}

export function projectSupportsEditing() {
  return true
}
