import EmergenceCascadeStage from './EmergenceCascadeStage'
import EmergenceCascadeStageFlex from './EmergenceCascadeStageFlex'
import EmergenceCascadeFlexUpdated from './EmergenceCascadeFlexUpdated'

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
  'cascade-flex-updated': {
    id: 'cascade-flex-updated',
    label: 'Cascade Flex Updated',
    description:
      'Independent Flex variant — N=6 portrait cards, trayless stage, clearer type',
    Component: EmergenceCascadeFlexUpdated,
    // TEMP: allowConvener: false — re-enable when convener edit is finished (set true / remove).
    props: {
      stageFlex: true,
      allowConvener: false,
      content: { showSpeakerStageBg: false, includeConvener: false },
    },
  },
}

export const DEFAULT_EMERGENCE_TEMPLATE = 'cascade-stage'
