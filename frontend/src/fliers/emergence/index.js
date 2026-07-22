import EmergenceCascade from './EmergenceCascade'
import EmergenceClassic from './EmergenceClassic'

export const EMERGENCE_TEMPLATES = {
  classic: {
    id: 'classic',
    label: '1 · Classic Tilt',
    description: 'Closest to the reference — tilted cyan gallery card',
    Component: EmergenceClassic,
  },
  cascade: {
    id: 'cascade',
    label: '2 · Cascade Hero',
    description: 'Oversized theme + cascading portrait frames',
    Component: EmergenceCascade,
  },
}

export const DEFAULT_EMERGENCE_TEMPLATE = 'classic'
