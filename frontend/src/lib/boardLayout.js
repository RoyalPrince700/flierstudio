import { layoutBoardItems } from '../projects/layout'
import { getTemplate } from '../samples/registry'

const STORAGE_KEY = 'flier-studio-board-layouts'

export const TEMPLATE_WORKSPACE_ID = 'starter'

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

/**
 * Merge any new default project boards into a persisted layout.
 * Keeps existing order, custom names, duplicates, and template layers.
 * Returns the same layout reference when nothing changed.
 */
export function syncBoardLayoutWithProject(layout, project) {
  const items = project?.boardItems ?? []
  if (!items.length) {
    return layout || { order: [], entries: {} }
  }
  if (!layout) return seedBoardLayout(project)

  let changed = false
  const order = [...layout.order]
  const entries = { ...layout.entries }

  for (const item of items) {
    if (!order.includes(item.id)) {
      order.push(item.id)
      entries[item.id] = { sourceId: item.id, name: item.name }
      changed = true
      continue
    }
    if (!entries[item.id]) {
      entries[item.id] = { sourceId: item.id, name: item.name }
      changed = true
    }
  }

  if (!changed) return layout
  return { order, entries }
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
  const active = syncBoardLayoutWithProject(layout, project)

  const raw = active.order
    .map((id) => {
      const entry = active.entries[id]
      if (!entry) return null

      if (entry.templateId) {
        const template = getTemplate(entry.templateId)
        if (!template?.Component) return null
        return {
          id,
          name: entry.name || template.name,
          description: template.description,
          width: template.width,
          height: template.height,
          Component: template.Component,
          props: template.props ?? {},
          filename: `template-${template.id}`,
          sourceId: entry.templateId,
          templateId: entry.templateId,
          editKind: 'props',
        }
      }

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
  const base = syncBoardLayoutWithProject(layout, project)
  const entry = base.entries[itemId]
  if (!entry) return { layout: base, newId: null }

  let baseName = entry.name || 'Design'
  if (entry.templateId) {
    const template = getTemplate(entry.templateId)
    if (!template) return { layout: base, newId: null }
    baseName = entry.name || template.name
  } else {
    const catalog = sourceCatalog(project)
    const source = catalog.get(entry.sourceId)
    if (!source) return { layout: base, newId: null }
    baseName = entry.name || source.name
  }

  const id =
    newId ||
    `${entry.templateId || entry.sourceId}__copy_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
  const copyName = nextCopyName(base, baseName)

  const index = base.order.indexOf(itemId)
  const order = [...base.order]
  order.splice(index < 0 ? order.length : index + 1, 0, id)

  const nextEntry = entry.templateId
    ? { templateId: entry.templateId, name: copyName }
    : { sourceId: entry.sourceId, name: copyName }

  return {
    layout: {
      order,
      entries: {
        ...base.entries,
        [id]: nextEntry,
      },
    },
    newId: id,
  }
}

/** Add a style-library template as a new layer on the workspace project. */
export function addTemplateLayer(layout, project, template, newId) {
  if (!template?.id || !template?.Component) {
    return { layout: syncBoardLayoutWithProject(layout, project), newId: null }
  }

  const base = syncBoardLayoutWithProject(layout, project)
  const id =
    newId ||
    `tpl_${template.id}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`

  return {
    layout: {
      order: [...base.order, id],
      entries: {
        ...base.entries,
        [id]: {
          templateId: template.id,
          name: template.name,
        },
      },
    },
    newId: id,
  }
}

export function deleteBoardLayer(layout, project, itemId) {
  const base = syncBoardLayoutWithProject(layout, project)
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
