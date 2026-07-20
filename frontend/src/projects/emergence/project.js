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
  props: {},
}))

/** Kinesis / Emergence conference fliers only */
export default createProject({
  id: 'emergence',
  name: 'Emergence',
  brand: 'Kinesis · Cloudde',
  description: 'Kinesis ’26 conference flier set — classic, ribbon, split, cascade.',
  color: '#3A8DFF',
  fliers,
})
