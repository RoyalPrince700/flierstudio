import EmergenceCascadeStage from './EmergenceCascadeStage'
import EmergenceCascadeStageFlex from './EmergenceCascadeStageFlex'

export const EMERGENCE_TEMPLATES = {
  'cascade-stage': {
    id: 'cascade-stage',
    label: 'Cascade Stage',
    description: 'Cascade Hero top + Stage Grid speaker card unchanged',
    Component: EmergenceCascadeStage,
  },
  'cascade-stage-flex': {
    id: 'cascade-stage-flex',
    label: 'Cascade Stage Flex',
    description:
      'Cascade Stage with dynamic people on stage (1–10) and balanced grid recipes',
    Component: EmergenceCascadeStageFlex,
    props: { stageFlex: true },
  },
}

export const DEFAULT_EMERGENCE_TEMPLATE = 'cascade-stage'
