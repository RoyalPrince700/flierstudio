import VoidProfileAskSample from './VoidProfileAskSample'
import { voidProfileAsk } from './tokens'

/** Registry entry for sample `void-profile-ask` */
export default {
  id: 'void-profile-ask',
  name: 'Void Profile Ask',
  description:
    'Black void portfolio CTA — circular avatar, three-line ask, dual-circle bio link.',
  tags: ['void', 'black', 'profile', 'ask', 'cta', 'minimal', 'mono'],
  width: voidProfileAsk.size.width,
  height: voidProfileAsk.size.height,
  sizeLabel: 'Instagram Portrait · 1080×1350',
  principlesPath: 'src/samples/void-profile-ask/PRINCIPLES.md',
  group: 'Analyzed',
  Component: VoidProfileAskSample,
}
