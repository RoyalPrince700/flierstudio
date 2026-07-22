/**
 * Dev-only visual QA mount for Flier Studio editorial landscape boards.
 * Open via /qa-editorial.html while `npm run dev` is running.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
} from '../fliers/flier-studio/landscape'
import '../styles/global.css'

const BOARDS = [
  ['01-cover', LCoverBoard],
  ['02-strategy', LStrategyBoard],
  ['03-logo-reveal', LLogoRevealBoard],
  ['04-construction', LConstructionBoard],
  ['05-family', LFamilyBoard],
  ['06-symbol', LSymbolBoard],
  ['07-usage', LClearspaceBoard],
  ['08-signal', LPrimaryColorBoard],
  ['09-palette', LPaletteBoard],
  ['10-typography', LTypographyBoard],
  ['11-visual', LVisualLanguageBoard],
  ['12-voice', LVoiceBoard],
  ['13-motion', LMotionBoard],
  ['14-digital', LDigitalBoard],
  ['15-applications', LApplicationsBoard],
  ['16-overview', LOverviewBoard],
]

function App() {
  return (
    <div style={{ background: '#1a1814', padding: 40, display: 'grid', gap: 48, justifyContent: 'start' }}>
      {BOARDS.map(([id, Comp]) => (
        <div key={id} data-board={id} style={{ width: 1600, margin: '0 auto' }}>
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
