/**
 * Dev-only visual QA mount for Inspire sample.
 * Open via /qa-inspire.html while `npm run dev` is running.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import inspire from '../samples/inspire/meta'
import '../styles/global.css'

const template = inspire.templates[0]
const Component = template.Component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ padding: 24, background: '#0a0a0c' }}>
      <div data-shot={template.id}>
        <Component {...(template.props || {})} />
      </div>
    </div>
  </StrictMode>,
)
