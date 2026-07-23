import InspirePoster from './templates/InspirePoster'
import { inspire, inspireDemo } from './tokens'

/**
 * Inspire — analyzed dark conference poster sample.
 * Defaults to draft/unpublished via filterTemplateCollections
 * (no Mongo publish record → draft). Admins publish from
 * Admin → Templates → Unpublished.
 */
export default {
  id: 'inspire',
  name: 'Inspire',
  brand: 'Style library',
  description:
    'Dark growth-conference poster — mega headline with “without” badge, 2×2 purple speaker frames, mint logistics + QR, sponsor row.',
  color: '#9B86FF',
  source: 'analyzed',
  principlesPath: 'src/samples/inspire/PRINCIPLES.md',
  templates: [
    {
      id: 'inspire-poster',
      name: 'Inspire Poster',
      description:
        'Instagram portrait (1080×1350) — SCALE WITHOUT LIMITS conference layout with speakers and mint registration slab.',
      tags: ['conference', 'speakers', 'dark', 'purple', 'mint', 'qr', 'sponsors', 'portrait'],
      width: inspire.size.width,
      height: inspire.size.height,
      sizeLabel: inspire.size.label,
      principlesPath: 'src/samples/inspire/PRINCIPLES.md',
      Component: InspirePoster,
      props: {
        width: inspire.size.width,
        height: inspire.size.height,
        ...inspireDemo,
      },
    },
  ],
}
