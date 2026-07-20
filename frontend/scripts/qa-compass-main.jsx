import { createRoot } from 'react-dom/client'
import CompassOnAir from '../src/fliers/oxygenfm/CompassOnAir'
import '../src/styles/global.css'

function QaPage() {
  return (
    <div style={{ display: 'flex', gap: 24, padding: 24, background: '#222' }}>
      <div data-shot="compass-portrait">
        <CompassOnAir format="portrait" width={1080} height={1350} />
      </div>
      <div data-shot="compass-square">
        <CompassOnAir format="square" width={1080} height={1080} />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<QaPage />)
