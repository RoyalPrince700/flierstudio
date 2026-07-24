import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OfferQuintetFlier from '../fliers/offer-quintet/OfferQuintetFlier'
import '../styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OfferQuintetFlier />
  </StrictMode>,
)
