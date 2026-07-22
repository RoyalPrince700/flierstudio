import emergence from './emergence/project'
import femtech from './femtech/project'
import flierStudio from './flier-studio/project'
import flierStudioEditorial from './flier-studio-editorial/project'
import orbitGadgets from './orbit-gadgets/project'
import oxygenfm from './oxygenfm/project'
import royalPrince from './royal-prince/project'
import smipay from './smipay/project'
import starter from './starter/project'

/**
 * Master list of design projects in the codebase.
 * To add a brand: create src/projects/<id>/project.js and import it here.
 *
 * Flier Studio identity ships in two formats:
 * - flier-studio → Portrait / Social (1080×1350)
 * - flier-studio-editorial → Landscape / Editorial (1600×1200)
 */
export const PROJECTS = [
  flierStudio,
  flierStudioEditorial,
  emergence,
  smipay,
  femtech,
  orbitGadgets,
  oxygenfm,
  royalPrince,
  starter,
]

export const PROJECT_MAP = Object.fromEntries(PROJECTS.map((project) => [project.id, project]))

/** @deprecated Not used for post-login entry. Users land on /templates; studio opens only after a template is selected (or restored open tabs). */
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
