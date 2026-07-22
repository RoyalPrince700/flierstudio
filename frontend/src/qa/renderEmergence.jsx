/**
 * Dev-only visual QA mount for Emergence templates.
 * Open via /qa-emergence.html while `npm run dev` is running.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EMERGENCE_TEMPLATES } from '../fliers/emergence'
import '../styles/global.css'

const boards = Object.values(EMERGENCE_TEMPLATES).map((template) => {
  const Component = template.Component
  return (
    <div key={template.id} data-shot={template.id} style={{ marginBottom: 24 }}>
      <Component {...(template.props || {})} />
    </div>
  )
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ padding: 24 }}>{boards}</div>
  </StrictMode>,
)
