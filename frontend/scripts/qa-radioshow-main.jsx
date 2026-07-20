import { createRoot } from 'react-dom/client'
import OnAirSlab from '../src/samples/radioshow/templates/OnAirSlab'
import WeekLineup from '../src/samples/radioshow/templates/WeekLineup'
import MicHero from '../src/samples/radioshow/templates/MicHero'
import '../src/styles/global.css'

function QaPage() {
  return (
    <div style={{ display: 'flex', gap: 24, padding: 24, background: '#222' }}>
      <OnAirSlab />
      <WeekLineup />
      <MicHero />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<QaPage />)
