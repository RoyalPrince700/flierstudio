/**
 * @deprecated Prefer project boards via `src/projects/registry.js`.
 * Kept as a thin re-export for older imports.
 */
import { DEFAULT_PROJECT_ID, getProject } from '../projects/registry'

const project = getProject(DEFAULT_PROJECT_ID)

export const BOARD_ITEMS = project.boardItems
export const BOARD_BOUNDS = project.bounds
export const DEFAULT_BOARD_ITEM_ID = project.defaultItemId
