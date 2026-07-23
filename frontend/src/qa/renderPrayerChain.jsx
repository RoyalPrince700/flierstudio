import { createRoot } from 'react-dom/client'
import PrayerChainFlier from '../fliers/gracelife/PrayerChainFlier'

createRoot(document.getElementById('root')).render(
  <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#1a1208', padding: 24 }}>
    <PrayerChainFlier />
  </div>,
)
