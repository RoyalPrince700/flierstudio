import EmergenceCascade from './EmergenceCascade'
import EmergenceClassic from './EmergenceClassic'
import EmergenceRibbon from './EmergenceRibbon'
import EmergenceSplit from './EmergenceSplit'

export const EMERGENCE_TEMPLATES = {
  classic: {
    id: 'classic',
    label: '1 · Classic Tilt',
    description: 'Closest to the reference — tilted cyan gallery card',
    Component: EmergenceClassic,
  },
  ribbon: {
    id: 'ribbon',
    label: '2 · Flat Ribbon',
    description: 'Lime ribbon band + flat card, no tilt',
    Component: EmergenceRibbon,
  },
  split: {
    id: 'split',
    label: '3 · Split Stage',
    description: 'Theme rail left, portrait grid right',
    Component: EmergenceSplit,
  },
  cascade: {
    id: 'cascade',
    label: '4 · Cascade Hero',
    description: 'Oversized theme + cascading portrait frames',
    Component: EmergenceCascade,
  },
}

export const DEFAULT_EMERGENCE_TEMPLATE = 'classic'
