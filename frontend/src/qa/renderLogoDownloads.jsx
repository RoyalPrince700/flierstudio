/**
 * Quick render of logo-download boards for visual QA.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LOGO_DOWNLOAD_BOARDS } from '../fliers/flier-studio/FSLogoDownloads'
import '../styles/global.css'

function App() {
  return (
    <div style={{ background: '#1a1814', padding: 32, display: 'grid', gap: 32, justifyContent: 'start' }}>
      {LOGO_DOWNLOAD_BOARDS.map(({ id, Component }) => (
        <div key={id} data-board={id} style={{ width: 1080, margin: '0 auto' }}>
          <Component />
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
