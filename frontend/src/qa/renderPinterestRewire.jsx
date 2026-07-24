/**
 * Dev-only visual QA for standalone Pinterest rewires (not Emergence).
 * Open via /qa-pinterest-rewire.html while `npm run dev` is running.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OfferQuintetFlier from '../fliers/offer-quintet/OfferQuintetFlier'
import PillArcGalleryFlier from '../fliers/pill-arc-gallery/PillArcGalleryFlier'
import SkylineTrioFlier from '../fliers/skyline-trio/SkylineTrioFlier'
import offerQuintetProject from '../projects/offer-quintet/project'
import pillArcGalleryProject from '../projects/pill-arc-gallery/project'
import skylineTrioProject from '../projects/skyline-trio/project'
import '../styles/global.css'

const boards = [
  { id: 'skyline-trio-main', project: skylineTrioProject, Component: SkylineTrioFlier },
  { id: 'pill-arc-gallery-main', project: pillArcGalleryProject, Component: PillArcGalleryFlier },
  { id: 'offer-quintet-main', project: offerQuintetProject, Component: OfferQuintetFlier },
].map(({ id, project, Component }) => {
  const item = project.boardItems.find((b) => b.id === id) || project.boardItems[0]
  return (
    <div key={id} data-shot={id} style={{ marginBottom: 32 }}>
      <Component {...(item?.props || {})} />
    </div>
  )
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ padding: 24 }}>{boards}</div>
  </StrictMode>,
)
