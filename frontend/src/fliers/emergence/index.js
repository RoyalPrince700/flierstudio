import EmergenceCascade from './EmergenceCascade'
import EmergenceCascadeGrid from './EmergenceCascadeGrid'
import EmergenceCascadeStage from './EmergenceCascadeStage'
import EmergenceClassic from './EmergenceClassic'
import EmergenceStageGrid from './EmergenceStageGrid'

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
  'stage-grid': {
    id: 'stage-grid',
    label: '3 · Stage Grid',
    description: 'Equal-size 3 speakers + 3 panelists beside a full-height convener; programme title above',
    Component: EmergenceStageGrid,
  },
  'cascade-grid': {
    id: 'cascade-grid',
    label: '4 · Cascade Grid',
    description: 'Cascade hero chrome + equal 3 speakers / 3 panelists + tall convener',
    Component: EmergenceCascadeGrid,
  },
  'cascade-stage': {
    id: 'cascade-stage',
    label: '5 · Cascade Stage',
    description: 'Cascade Hero top + Stage Grid speaker card unchanged',
    Component: EmergenceCascadeStage,
  },
}

export const DEFAULT_EMERGENCE_TEMPLATE = 'classic'
