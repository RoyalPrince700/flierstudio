import { radioshow } from './tokens'
import OnAirSlab from './templates/OnAirSlab'
import WeekLineup from './templates/WeekLineup'
import MicHero from './templates/MicHero'

const size = radioshow.size

const templates = [
  {
    id: 'radioshow-on-air-slab',
    name: 'On Air Slab',
    description: 'Blue grid field with black polygon slab and floating audio icons.',
    tags: ['podcast', 'blue', 'slab', 'on-air'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: OnAirSlab,
  },
  {
    id: 'radioshow-week-lineup',
    name: 'Week Lineup',
    description: 'Orange grid with isometric guest schedule rows.',
    tags: ['podcast', 'schedule', 'orange', 'lineup'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: WeekLineup,
  },
  {
    id: 'radioshow-mic-hero',
    name: 'Mic Hero',
    description: 'Green grid with long-shadow title and mic prop.',
    tags: ['podcast', 'green', 'mic', 'hero'],
    width: size.width,
    height: size.height,
    sizeLabel: '1080×1350',
    Component: MicHero,
  },
]

/** Multi-template analyzed collection from references folder `radioshow` */
export default {
  id: 'radioshow',
  name: 'Radio Show',
  brand: 'Signal Room · demo',
  description:
    'Neo-brutal podcast promo system — shared grid field, isometric shadows, and orange listen CTA across three layouts.',
  color: '#2f6dff',
  source: 'analyzed',
  principlesPath: 'src/samples/radioshow/PRINCIPLES.md',
  templates,
}
