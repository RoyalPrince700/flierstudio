import CompassOnAir from '../../fliers/oxygenfm/CompassOnAir'
import { createProject } from '../layout'

const compassProps = {
  displayLine1: 'On',
  displayLine2: 'air',
  hostCredit: 'with Royal Prince on',
  showTitle: 'The Compass',
  tagline: 'The show that gives every career a roadmap.',
  scheduleLine1: 'Every Wednesday',
  scheduleLine2: '3pm–4pm',
  cta: 'Tune in live',
  station: 'OxygenFM 96.9',
  photoSrc: '/assets/myimages/royalprinceprofile.png',
}

/** OxygenFM — radio show promo boards */
export default createProject({
  id: 'oxygenfm',
  name: 'OxygenFM',
  brand: 'OxygenFM 96.9',
  description: 'Station promos for The Compass and OxygenFM shows.',
  color: '#2f6dff',
  fliers: [
    {
      id: 'oxygenfm-compass-on-air',
      name: 'The Compass · On Air',
      group: 'The Compass',
      description: 'Portrait 1080×1350 — on-air slab with host',
      width: 1080,
      height: 1350,
      filename: 'oxygenfm-the-compass-on-air',
      Component: CompassOnAir,
      props: {
        ...compassProps,
        format: 'portrait',
        width: 1080,
        height: 1350,
      },
    },
    {
      id: 'oxygenfm-compass-on-air-square',
      name: 'The Compass · On Air Square',
      group: 'The Compass',
      description: 'Square 1080×1080 — on-air slab with host',
      width: 1080,
      height: 1080,
      filename: 'oxygenfm-the-compass-on-air-square',
      Component: CompassOnAir,
      props: {
        ...compassProps,
        format: 'square',
        width: 1080,
        height: 1080,
      },
    },
  ],
})
