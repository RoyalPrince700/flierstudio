import PrayerChainFlier from '../../fliers/gracelife/PrayerChainFlier'
import { prayerChain } from './tokens'

const size = prayerChain.size

/**
 * GraceLife Prayer Chain — analyzed template collection.
 * Defaults to draft/unpublished via filterTemplateCollections
 * (no Mongo publish record → draft). Admins publish from
 * Admin → Templates → Unpublished.
 */
export default {
  id: 'prayer-chain',
  name: 'Prayer Chain',
  brand: 'GraceLife Church',
  description:
    'Warm gold gospel square — metallic chain frame, luminous field, city haze, blackletter Prayer Chain title.',
  color: '#F5C400',
  source: 'analyzed',
  principlesPath: 'src/samples/prayer-chain/PRINCIPLES.md',
  templates: [
    {
      id: 'prayer-chain',
      name: 'Prayer Chain',
      description:
        '5×5 in print square (1500×1500) — GraceLife fasting & prayer season announcement.',
      tags: ['church', 'prayer', 'gold', 'chain', 'gospel', 'square', 'print'],
      width: size.width,
      height: size.height,
      sizeLabel: size.label,
      principlesPath: 'prayerchaindesignguide.md',
      Component: PrayerChainFlier,
      props: {
        width: size.width,
        height: size.height,
        logoSrc: prayerChain.assets.logo,
        chainSrc: prayerChain.assets.chain,
        citySrc: prayerChain.assets.city,
        glowSrc: prayerChain.assets.glow,
        line1: 'Prayer',
        line2: 'Chain',
        support: '30 days fasting and prayer',
        date: '22nd to 31st of August 2026',
      },
    },
  ],
}
