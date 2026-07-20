import emergence from './emergence/project'
import femtech from './femtech/project'
import orbitGadgets from './orbit-gadgets/project'
import oxygenfm from './oxygenfm/project'
import royalPrince from './royal-prince/project'
import smipay from './smipay/project'
import starter from './starter/project'

/**
 * Master list of design projects in the codebase.
 * To add a brand: create src/projects/<id>/project.js and import it here.
 */
export const PROJECTS = [
  emergence,
  smipay,
  femtech,
  orbitGadgets,
  oxygenfm,
  royalPrince,
  starter,
]

export const PROJECT_MAP = Object.fromEntries(PROJECTS.map((project) => [project.id, project]))

export const DEFAULT_PROJECT_ID = 'emergence'

export function getProject(id) {
  return PROJECT_MAP[id] || null
}

export function listProjects() {
  return PROJECTS.map(({ id, name, brand, description, color, flierCount }) => ({
    id,
    name,
    brand,
    description,
    color,
    flierCount,
  }))
}
