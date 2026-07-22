import {
  FSCoverBoard,
  FSMerchBoard,
  FSProductBoard,
  FSSocialBoard,
  FSStationeryBoard,
  FSWebBoard,
} from '../../fliers/flier-studio/FSAppBoards'
import {
  FSLogoOnColorBoard,
  FSPaletteBoard,
  FSPrimaryColorBoard,
} from '../../fliers/flier-studio/FSColorBoards'
import {
  FSClearspaceBoard,
  FSConstructionBoard,
  FSFamilyBoard,
  FSLogoRevealBoard,
  FSSymbolBoard,
} from '../../fliers/flier-studio/FSLogoBoards'
import { LOGO_DOWNLOAD_BOARDS } from '../../fliers/flier-studio/FSLogoDownloads'
import FSMotionBoard from '../../fliers/flier-studio/FSMotionBoard'
import {
  FSOverviewBoard,
  FSStrategyBoard,
  FSVoiceBoard,
} from '../../fliers/flier-studio/FSStrategyBoards'
import {
  FSIconographyBoard,
  FSPatternBoard,
  FSTypographyBoard,
} from '../../fliers/flier-studio/FSTypeBoards'
import { createProject } from '../layout'

const W = 1080
const H = 1350
const LOGO_S = 1080

const board = (num, id, name, Component, description) => ({
  id: `fs-${id}`,
  name: `${String(num).padStart(2, '0')} · ${name}`,
  group: 'Portrait · Social',
  description,
  width: W,
  height: H,
  filename: `flier-studio-${id}`,
  Component,
  props: {},
})

const logoBoard = ({ id, name, Component, description }) => ({
  id: `fs-dl-${id}`,
  name,
  group: 'Logo downloads',
  description,
  width: LOGO_S,
  height: LOGO_S,
  filename: `flier-studio-${id}`,
  Component,
  props: {},
})

/**
 * Flier Studio — Portrait / Social format (1080×1350) plus logo-download
 * squares (1080×1080). Sibling: Flier Studio · Editorial (1600×1200).
 */
export default createProject({
  id: 'flier-studio',
  name: 'Flier Studio · Portrait',
  brand: 'Flier Studio',
  description:
    'The Liftoff — portrait case study (1080×1350) and logo download boards (1080×1080). Open “Flier Studio · Editorial” for landscape.',
  color: '#FF4A1D',
  fliers: [
    board(1, 'strategy', 'Strategy', FSStrategyBoard, 'Purpose, positioning, audience, personality, values'),
    board(2, 'logo-reveal', 'Logo reveal', FSLogoRevealBoard, 'Primary mark on ink'),
    board(3, 'construction', 'Construction', FSConstructionBoard, 'Concept and geometry of The Liftoff'),
    board(4, 'logo-family', 'Logo family', FSFamilyBoard, 'Lockups and color variants'),
    board(5, 'symbol', 'Symbol & app icon', FSSymbolBoard, 'App icon, favicon, small-size tests'),
    board(6, 'clearspace', 'Clear space & usage', FSClearspaceBoard, 'Clear space, minimums, incorrect usage'),
    board(7, 'color-primary', 'Primary color', FSPrimaryColorBoard, 'Signal — the primary brand color'),
    board(8, 'palette', 'Palette', FSPaletteBoard, 'Full palette, semantics, accessibility'),
    board(9, 'logo-on-color', 'Logo on color', FSLogoOnColorBoard, 'The mark across brand grounds'),
    board(10, 'typography', 'Typography', FSTypographyBoard, 'Space Grotesk + Manrope system'),
    board(11, 'pattern', 'Graphic system', FSPatternBoard, 'Peel, hatch, and corner constellation'),
    board(12, 'iconography', 'Iconography', FSIconographyBoard, 'Lucide icon rules'),
    board(13, 'voice', 'Voice', FSVoiceBoard, 'Brand voice and sample messaging'),
    board(14, 'motion', 'Motion', FSMotionBoard, 'Motion-logo storyboard and principles'),
    board(15, 'social', 'Social', FSSocialBoard, 'Profile and post applications'),
    board(16, 'web', 'Website', FSWebBoard, 'Landing page application'),
    board(17, 'product', 'Product UI', FSProductBoard, 'Desktop studio and mobile UI'),
    board(18, 'stationery', 'Stationery', FSStationeryBoard, 'Business cards and letterhead'),
    board(19, 'cover', 'Document cover', FSCoverBoard, 'Guidelines / deck cover'),
    board(20, 'merch', 'Merch', FSMerchBoard, 'Tee, stickers, tote'),
    board(21, 'overview', 'Overview', FSOverviewBoard, 'Closing summary and contact'),
    ...LOGO_DOWNLOAD_BOARDS.map(logoBoard),
  ],
})
