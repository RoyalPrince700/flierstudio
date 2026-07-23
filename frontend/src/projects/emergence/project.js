import { EMERGENCE_TEMPLATES } from '../../fliers/emergence'
import { emergence } from '../../design/emergenceTokens'
import { createProject } from '../layout'

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
    'Emerge conference fliers — Cascade Stage (fixed 6) + Cascade Stage Flex (dynamic 1–10).',
  color: '#3A8DFF',
  fliers,
})
