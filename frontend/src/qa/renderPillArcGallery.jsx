import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PillArcGalleryFlier from '../fliers/pill-arc-gallery/PillArcGalleryFlier'
import '../styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PillArcGalleryFlier />
  </StrictMode>,
)
