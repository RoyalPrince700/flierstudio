import SkylineTrioFlier from '../../fliers/skyline-trio/SkylineTrioFlier'
import { createProject } from '../layout'

const DEFAULT_SPEAKERS = [
  {
    name: 'Daniel Oluwasusi',
    title: 'CEO, Dacom Digitals, Data analytics consultant',
    photoSrc: '',
  },
  {
    name: 'Oluwaseun Osunmakinde',
    title: 'CEO, ArcByte Digital Ltd.',
    photoSrc: '',
  },
  {
    name: 'Comfort Fatorisa',
    title: 'Community manager, Dacom Digitals',
    photoSrc: '',
  },
]

/** Skyline Trio — navy/cyan webinar from pintrest/digital.png (735×959 → 1080×1409) */
export default createProject({
  id: 'skyline-trio',
  name: 'Skyline Trio',
  brand: 'Skyline Trio',
  description: 'Navy + cyan digital webinar — three speaker pills, timezone meta, contact footer.',
  color: '#00aeef',
  fliers: [
    {
      id: 'skyline-trio',
      name: 'Skyline Trio',
      group: 'Skyline Trio',
      description: 'Reference: pintrest/digital.png',
      width: 1080,
      height: 1409,
      filename: 'skyline-trio',
      Component: SkylineTrioFlier,
      props: {
        width: 1080,
        height: 1409,
        logoSrc: '',
        brandName: 'DACOM Digitals',
        headlineLine1: "Harnessing Africa's",
        headlineLine2: 'Digital Goldmine',
        subtitle: 'The Future of Data Analytics, Opportunities, and Challenges',
        date: '4th April, 2026',
        venue: 'Meeting holds Online (Zoom)',
        zone1: '7pm Nigerian and Cameroon time',
        zone2: '8pm Zambia time',
        zone3: '6pm Ghana time',
        handle: 'Dacom digitals',
        email: 'dacomdigitals@gmail.com',
        phone: '+234 911 357 8740',
        speakers: DEFAULT_SPEAKERS,
      },
    },
  ],
})
