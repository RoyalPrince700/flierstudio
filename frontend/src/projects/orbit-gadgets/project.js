import FlagshipTrayFlier from '../../fliers/orbit-gadgets/FlagshipTrayFlier'
import OrbitPocketSplitFlier from '../../fliers/orbit-gadgets/OrbitPocketSplitFlier'
import OrbitGadgetBurstFlier from '../../fliers/orbit-gadgets/OrbitGadgetBurstFlier'
import { createProject } from '../layout'

/** Orbit Gadgets — retail promo boards using malik-gadget sample system */
export default createProject({
  id: 'orbit-gadgets',
  name: 'Orbit Gadgets',
  brand: 'Orbit Gadgets',
  description: 'Retail gadget promos based on the malik-gadget sample pack.',
  color: '#0b5fff',
  fliers: [
    {
      id: 'orbit-flagship-tray',
      name: 'Flagship Tray',
      group: 'Orbit Gadgets',
      description: 'malik-gadget-flagship-tray with generated phone product shots',
      width: 1080,
      height: 1350,
      filename: 'orbit-flagship-tray',
      Component: FlagshipTrayFlier,
    },
    {
      id: 'orbit-pocket-split',
      name: 'Pocket Split',
      group: 'Orbit Gadgets',
      description: 'Deep blue lifestyle split — copy left, upgrade hero right',
      width: 1080,
      height: 1350,
      filename: 'orbit-pocket-split',
      Component: OrbitPocketSplitFlier,
    },
    {
      id: 'orbit-gadget-burst',
      name: 'Gadget Burst',
      group: 'Orbit Gadgets',
      description: 'Black premium burst — floating gadget cluster',
      width: 1080,
      height: 1350,
      filename: 'orbit-gadget-burst',
      Component: OrbitGadgetBurstFlier,
    },
  ],
})
