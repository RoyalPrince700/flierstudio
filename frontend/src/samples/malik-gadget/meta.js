import { malikGadget } from './tokens'
import FlagshipTray from './templates/FlagshipTray'
import UpgradeHero from './templates/UpgradeHero'
import PocketSplit from './templates/PocketSplit'
import GadgetBurst from './templates/GadgetBurst'
import BoxStack from './templates/BoxStack'
import WeekPlans from './templates/WeekPlans'

const size = malikGadget.size

const templates = [
  {
    id: 'malik-gadget-flagship-tray',
    name: 'Flagship Tray',
    description: 'Glossy blue product tray with three phone slots.',
    tags: ['tray', 'product', 'light'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: FlagshipTray,
  },
  {
    id: 'malik-gadget-upgrade-hero',
    name: 'Upgrade Hero',
    description: 'Lifestyle person hero with pink headline mark.',
    tags: ['lifestyle', 'person', 'light'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: UpgradeHero,
  },
  {
    id: 'malik-gadget-pocket-split',
    name: 'Pocket Split',
    description: 'Navy split layout with quality seal.',
    tags: ['navy', 'split', 'seal'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: PocketSplit,
  },
  {
    id: 'malik-gadget-gadget-burst',
    name: 'Gadget Burst',
    description: 'Black premium floating product cluster.',
    tags: ['black', 'burst', 'premium'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: GadgetBurst,
  },
  {
    id: 'malik-gadget-box-stack',
    name: 'Box Stack',
    description: 'Strike-through headline with stacked product boxes.',
    tags: ['boxes', 'retail', 'light'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: BoxStack,
  },
  {
    id: 'malik-gadget-week-plans',
    name: 'Week Plans',
    description: 'Motivational two-tone headline + lifestyle hero.',
    tags: ['lifestyle', 'motivational'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: WeekPlans,
  },
]

/** Multi-template analyzed collection from inbox folder `malik-gadet` → id `malik-gadget` */
export default {
  id: 'malik-gadget',
  name: 'Malik Gadget',
  brand: 'Orbit Gadgets · demo',
  description:
    'Retail gadget promo system — shared logo/footer dock with six layout variations.',
  color: '#0b5fff',
  source: 'analyzed',
  principlesPath: 'src/samples/malik-gadget/PRINCIPLES.md',
  templates,
}
