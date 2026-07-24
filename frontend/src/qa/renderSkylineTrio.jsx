import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SkylineTrioFlier from '../fliers/skyline-trio/SkylineTrioFlier'
import '../styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SkylineTrioFlier />
  </StrictMode>,
)
