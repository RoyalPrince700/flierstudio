import GlassStackSample from './GlassStackSample'
import { glassStack } from './tokens'

/** Registry entry for sample `glass-stack` */
export default {
  id: 'glass-stack',
  name: 'Glass Stack',
  description: 'Frosted glass panels stacked on a cool night glow — event meta + three speakers.',
  tags: ['glass', 'frosted', 'stack', 'night', 'speakers'],
  width: glassStack.size.width,
  height: glassStack.size.height,
  sizeLabel: 'Instagram Portrait · 1080×1350',
  principlesPath: 'src/samples/glass-stack/PRINCIPLES.md',
  group: 'Analyzed',
  Component: GlassStackSample,
}
