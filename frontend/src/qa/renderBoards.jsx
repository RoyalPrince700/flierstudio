/**
 * Dev-only visual QA mount for Flier Studio identity boards.
 * Open via /qa-boards.html while `npm run dev` is running.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  FSCoverBoard,
  FSMerchBoard,
  FSProductBoard,
  FSSocialBoard,
  FSStationeryBoard,
  FSWebBoard,
} from '../fliers/flier-studio/FSAppBoards'
import {
  FSLogoOnColorBoard,
  FSPaletteBoard,
  FSPrimaryColorBoard,
} from '../fliers/flier-studio/FSColorBoards'
import {
  FSClearspaceBoard,
  FSConstructionBoard,
  FSFamilyBoard,
  FSLogoRevealBoard,
  FSSymbolBoard,
} from '../fliers/flier-studio/FSLogoBoards'
import FSMotionBoard from '../fliers/flier-studio/FSMotionBoard'
import {
  FSOverviewBoard,
  FSStrategyBoard,
  FSVoiceBoard,
} from '../fliers/flier-studio/FSStrategyBoards'
import {
  FSIconographyBoard,
  FSPatternBoard,
  FSTypographyBoard,
} from '../fliers/flier-studio/FSTypeBoards'
import '../styles/global.css'

const BOARDS = [
  ['01-strategy', FSStrategyBoard],
  ['02-logo-reveal', FSLogoRevealBoard],
  ['03-construction', FSConstructionBoard],
  ['04-family', FSFamilyBoard],
  ['05-symbol', FSSymbolBoard],
  ['06-clearspace', FSClearspaceBoard],
  ['07-primary-color', FSPrimaryColorBoard],
  ['08-palette', FSPaletteBoard],
  ['09-logo-on-color', FSLogoOnColorBoard],
  ['10-typography', FSTypographyBoard],
  ['11-pattern', FSPatternBoard],
  ['12-iconography', FSIconographyBoard],
  ['13-voice', FSVoiceBoard],
  ['14-motion', FSMotionBoard],
  ['15-social', FSSocialBoard],
  ['16-web', FSWebBoard],
  ['17-product', FSProductBoard],
  ['18-stationery', FSStationeryBoard],
  ['19-cover', FSCoverBoard],
  ['20-merch', FSMerchBoard],
  ['21-overview', FSOverviewBoard],
]

function App() {
  return (
    <div style={{ background: '#1a1814', padding: 40, display: 'grid', gap: 48, justifyContent: 'start' }}>
      {BOARDS.map(([id, Comp]) => (
        <div key={id} data-board={id} style={{ width: 1080, margin: '0 auto' }}>
          <Comp />
        </div>
      ))}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
