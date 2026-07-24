import PillArcGalleryFlier from '../../fliers/pill-arc-gallery/PillArcGalleryFlier'
import { pillArcGallery } from '../../fliers/pill-arc-gallery/tokens'
import { createProject } from '../layout'

const { width, height } = pillArcGallery.size

const speakers = [
  { name: 'Adeniji Abdullahi', photoSrc: '' },
  { name: 'Paul Akinola', photoSrc: '' },
  { name: 'Afunku Mubarak', photoSrc: '' },
  { name: 'Nachristos', photoSrc: '' },
  { name: 'Fawwaz Yahaya', photoSrc: '' },
]

/** Pill Arc Gallery — yellow/maroon creative workshop from learn.png */
export default createProject({
  id: 'pill-arc-gallery',
  name: 'Pill Arc Gallery',
  brand: 'Pill Arc Gallery',
  description: 'Yellow arc spotlight + pill title + five portraits + glowing register dock.',
  color: '#ffd400',
  fliers: [
    {
      id: 'pill-arc-gallery-main',
      name: 'Pill Arc Gallery',
      group: 'Pill Arc Gallery',
      description: 'Reference: pintrest/learn.png',
      width,
      height,
      filename: 'pill-arc-gallery',
      Component: PillArcGalleryFlier,
      props: {
        width,
        height,
        speakers,
      },
    },
  ],
})
