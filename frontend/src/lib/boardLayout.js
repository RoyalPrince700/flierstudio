import { layoutBoardItems } from '../projects/layout'

const STORAGE_KEY = 'flier-studio-board-layouts'

/** Snapshot of a project's default layer list (ids only — Components stay on the project). */
export function seedBoardLayout(project) {
  const items = project?.boardItems ?? []
  return {
    order: items.map((item) => item.id),
    entries: Object.fromEntries(
      items.map((item) => [
        item.id,
        {
          sourceId: item.id,
          name: item.name,
        },
      ]),
    ),
  }
}

function sourceCatalog(project) {
  const map = new Map()
  ;(project?.boardItems ?? []).forEach((item) => {
    map.set(item.id, item)
  })
  return map
}

/** Resolve laid-out board items + bounds from project + optional layout override. */
export function resolveProjectBoard(project, layout) {
  const catalog = sourceCatalog(project)
  const active = layout || seedBoardLayout(project)

  const raw = active.order
    .map((id) => {
      const entry = active.entries[id]
      if (!entry) return null
      const source = catalog.get(entry.sourceId)
      if (!source) return null
      return {
        ...source,
        id,
        name: entry.name || source.name,
        filename: `${source.filename || entry.sourceId}-${id === entry.sourceId ? 'main' : 'copy'}`,
        sourceId: entry.sourceId,
      }
    })
    .filter(Boolean)

  return layoutBoardItems(raw)
}

export function duplicateBoardLayer(layout, project, itemId, newId) {
  const base = layout || seedBoardLayout(project)
  const entry = base.entries[itemId]
  if (!entry) return { layout: base, newId: null }

  const catalog = sourceCatalog(project)
  const source = catalog.get(entry.sourceId)
  if (!source) return { layout: base, newId: null }

  const id =
    newId ||
    `${entry.sourceId}__copy_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
  const copyName = nextCopyName(base, entry.name || source.name)

  const index = base.order.indexOf(itemId)
  const order = [...base.order]
  order.splice(index < 0 ? order.length : index + 1, 0, id)

  return {
    layout: {
      order,
      entries: {
        ...base.entries,
        [id]: {
          sourceId: entry.sourceId,
          name: copyName,
        },
      },
    },
    newId: id,
  }
}

export function deleteBoardLayer(layout, project, itemId) {
  const base = layout || seedBoardLayout(project)
  if (base.order.length <= 1) {
    return { layout: base, removedId: null, nextSelectedId: base.order[0] || null }
  }

  const order = base.order.filter((id) => id !== itemId)
  const entries = { ...base.entries }
  delete entries[itemId]

  const removedIndex = base.order.indexOf(itemId)
  const nextSelectedId =
    order[Math.min(Math.max(removedIndex, 0), order.length - 1)] || order[0] || null

  return {
    layout: { order, entries },
    removedId: itemId,
    nextSelectedId,
  }
}

function nextCopyName(layout, baseName) {
  const root = String(baseName || 'Design').replace(/\s+Copy(?:\s+\d+)?$/i, '')
  const names = Object.values(layout.entries).map((e) => e.name)
  let n = 1
  let candidate = `${root} Copy`
  while (names.includes(candidate)) {
    n += 1
    candidate = `${root} Copy ${n}`
  }
  return candidate
}

export function loadBoardLayouts() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (raw && typeof raw === 'object') return raw
  } catch {
    // ignore
  }
  return {}
}

export function saveBoardLayouts(layouts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts))
    return true
  } catch {
    return false
  }
}
