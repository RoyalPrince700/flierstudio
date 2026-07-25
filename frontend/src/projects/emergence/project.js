import { EMERGENCE_TEMPLATES } from '../../fliers/emergence'
import { emergence } from '../../design/emergenceTokens'
import { createProject } from '../layout'

/* Default catalog size is portrait; Cascade Stage Flex overrides to a
 * growing landscape banner when stagePeopleCount ≥ 9 (see stagePeopleLayout). */
const fliers = Object.values(EMERGENCE_TEMPLATES).map((template) => ({
  id: `emergence-${template.id}`,
  name: template.label.replace(/^\d+\s·\s/, ''),
  group: 'Emergence',
  description: template.description,
  width: emergence.size.width,
  height: emergence.size.height,
  filename: `emergence-${template.id}`,
  Component: template.Component,
  editKind: 'emergence',
  props: template.props || {},
}))

/** Emerge / Emergence conference flier templates */
export default createProject({
  id: 'emergence',
  name: 'Emergence',
  brand: 'Emerge',
  description:
    'Emerge conference fliers — Cascade Stage, Cascade Stage Flex, and Cascade Flex Updated.',
  color: '#3A8DFF',
  fliers,
})
