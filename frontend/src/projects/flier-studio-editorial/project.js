import {
  LApplicationsBoard,
  LClearspaceBoard,
  LConstructionBoard,
  LCoverBoard,
  LDigitalBoard,
  LFamilyBoard,
  LLogoRevealBoard,
  LMotionBoard,
  LOverviewBoard,
  LPaletteBoard,
  LPrimaryColorBoard,
  LStrategyBoard,
  LSymbolBoard,
  LTypographyBoard,
  LVisualLanguageBoard,
  LVoiceBoard,
} from '../../fliers/flier-studio/landscape'
import { createProject } from '../layout'

const W = 1600
const H = 1200

const board = (num, id, name, Component, description) => ({
  id: `fs-ed-${id}`,
  name: `${String(num).padStart(2, '0')} · ${name}`,
  group: 'Landscape · Editorial',
  description,
  width: W,
  height: H,
  filename: `flier-studio-editorial-${id}`,
  Component,
  props: {},
})

/**
 * Flier Studio — Landscape / Editorial format (1600×1200).
 * Same Liftoff identity as the portrait deck; recomposed for Behance / Pinterest.
 * Sibling: Flier Studio · Portrait (1080×1350) — do not mix or overwrite.
 */
export default createProject({
  id: 'flier-studio-editorial',
  name: 'Flier Studio · Editorial',
  brand: 'Flier Studio',
  description:
    'The Liftoff — landscape editorial case study (1600×1200). Sibling of Flier Studio · Portrait (1080×1350).',
  color: '#FF4A1D',
  fliers: [
    board(1, 'cover', 'Cover', LCoverBoard, 'Case study opening'),
    board(2, 'strategy', 'Strategy', LStrategyBoard, 'Purpose, positioning, personality'),
    board(3, 'logo-reveal', 'Logo reveal', LLogoRevealBoard, 'Primary mark on ink'),
    board(4, 'construction', 'Construction', LConstructionBoard, 'Concept and geometry'),
    board(5, 'logo-family', 'Logo family', LFamilyBoard, 'Lockups and color variants'),
    board(6, 'symbol', 'Symbol & app icon', LSymbolBoard, 'App icon and favicon system'),
    board(7, 'usage', 'Clear space & usage', LClearspaceBoard, 'Clear space, minimums, don’ts'),
    board(8, 'signal', 'Primary color', LPrimaryColorBoard, 'Signal'),
    board(9, 'palette', 'Palette', LPaletteBoard, 'Full palette and logo on color'),
    board(10, 'typography', 'Typography', LTypographyBoard, 'Space Grotesk + Manrope'),
    board(11, 'visual-language', 'Visual language', LVisualLanguageBoard, 'Pattern + iconography'),
    board(12, 'voice', 'Voice', LVoiceBoard, 'Brand voice and samples'),
    board(13, 'motion', 'Motion', LMotionBoard, 'Motion-logo storyboard'),
    board(14, 'digital', 'Digital', LDigitalBoard, 'Social and website'),
    board(15, 'applications', 'Applications', LApplicationsBoard, 'Product UI, stationery, merch'),
    board(16, 'overview', 'Overview', LOverviewBoard, 'Closing summary'),
  ],
})
