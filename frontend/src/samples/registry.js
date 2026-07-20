import glassStack from './glass-stack/meta'
import malikGadget from './malik-gadget/meta'
import radioshow from './radioshow/meta'
import voidProfileAsk from './void-profile-ask/meta'
import { PROJECTS } from '../projects/registry'

/**
 * Analyzed collections from sample/inbox (folder = one collection with N templates).
 * Single-template packs can still export `templates: [one]`.
 */
export const ANALYZED_COLLECTIONS = [
  normalizeCollection({
    id: 'glass-stack',
    name: glassStack.name,
    brand: 'Style library',
    description: glassStack.description,
    color: '#7b5cff',
    source: 'analyzed',
    principlesPath: glassStack.principlesPath,
    templates: [
      {
        id: glassStack.id,
        name: glassStack.name,
        description: glassStack.description,
        tags: glassStack.tags,
        width: glassStack.width,
        height: glassStack.height,
        sizeLabel: glassStack.sizeLabel,
        Component: glassStack.Component,
        props: glassStack.props,
      },
    ],
  }),
  normalizeCollection(malikGadget),
  normalizeCollection(radioshow),
  normalizeCollection({
    id: 'void-profile-ask',
    name: voidProfileAsk.name,
    brand: 'Style library',
    description: voidProfileAsk.description,
    color: '#d8d8d8',
    source: 'analyzed',
    principlesPath: voidProfileAsk.principlesPath,
    templates: [
      {
        id: voidProfileAsk.id,
        name: voidProfileAsk.name,
        description: voidProfileAsk.description,
        tags: voidProfileAsk.tags,
        width: voidProfileAsk.width,
        height: voidProfileAsk.height,
        sizeLabel: voidProfileAsk.sizeLabel,
        Component: voidProfileAsk.Component,
        props: voidProfileAsk.props,
      },
    ],
  }),
]

const PRINCIPLES_BY_PROJECT = {
  emergence: 'emergencedesignguide.md',
  starter: 'src/design/tokens.js',
  smipay: 'src/projects/smipay/project.js',
  femtech: 'src/projects/femtech/project.js',
  'orbit-gadgets': 'src/samples/malik-gadget/PRINCIPLES.md',
  oxygenfm: 'src/samples/radioshow/PRINCIPLES.md',
  'royal-prince': 'src/samples/void-profile-ask/PRINCIPLES.md',
}

function sizeLabel(width, height) {
  return `${width}×${height}`
}

function normalizeCollection(collection) {
  const templates = (collection.templates || []).map((template) => ({
    ...template,
    tags: template.tags ?? [],
    sizeLabel: template.sizeLabel || sizeLabel(template.width, template.height),
    principlesPath: template.principlesPath || collection.principlesPath,
    props: template.props ?? {},
  }))
  return {
    ...collection,
    templates,
    cover: templates[0] || null,
    templateCount: templates.length,
  }
}

function templateFromBoardItem(item, project) {
  return {
    id: item.id,
    name: item.name,
    description: item.description || `${project.name} board`,
    tags: [project.id, project.brand, item.group].filter(Boolean).map(String),
    width: item.width,
    height: item.height,
    sizeLabel: sizeLabel(item.width, item.height),
    principlesPath: PRINCIPLES_BY_PROJECT[project.id] || `src/projects/${project.id}/`,
    Component: item.Component,
    props: item.props ?? {},
  }
}

/**
 * Collections shown on Samples:
 * 1) Project boards (Emergence, Smipay, …)
 * 2) Analyzed inbox collections (each folder = its own card)
 */
export function listSampleCollections() {
  const projectCollections = PROJECTS.map((project) => {
    const templates = (project.boardItems ?? []).map((item) =>
      templateFromBoardItem(item, project),
    )
    return {
      id: project.id,
      name: project.name,
      brand: project.brand,
      description: project.description,
      color: project.color,
      source: 'project',
      principlesPath: PRINCIPLES_BY_PROJECT[project.id] || `src/projects/${project.id}/`,
      templates,
      cover: templates[0] || null,
      templateCount: templates.length,
    }
  })

  return [...projectCollections, ...ANALYZED_COLLECTIONS]
}

export function getSampleCollection(id) {
  return listSampleCollections().find((collection) => collection.id === id) || null
}

/** Flat lookup by template id (e.g. malik-gadget-flagship-tray). */
export function getSample(id) {
  for (const collection of listSampleCollections()) {
    const match = collection.templates.find((template) => template.id === id)
    if (match) {
      return { ...match, collectionId: collection.id, collectionName: collection.name }
    }
  }
  return null
}

export function listSamples() {
  return listSampleCollections().flatMap((collection) =>
    collection.templates.map((template) => ({
      ...template,
      group: collection.name,
      source: collection.source,
      collectionId: collection.id,
    })),
  )
}
