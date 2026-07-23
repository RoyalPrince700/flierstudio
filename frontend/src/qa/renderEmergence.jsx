/**
 * Dev-only visual QA mount for Emergence templates.
 * Open via /qa-emergence.html while `npm run dev` is running.
 *
 * Cascade Stage Flex also mounts N=1,3,6,10 for DESIGN_QA acceptance.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EMERGENCE_TEMPLATES } from '../fliers/emergence'
import { createEmergenceContent } from '../lib/flierDraft'
import '../styles/global.css'

const FLEX_QA_COUNTS = [1, 2, 3, 4, 5, 6, 10]

function boardsForTemplate(template) {
  const Component = template.Component
  if (template.id !== 'cascade-stage-flex') {
    return [
      <div key={template.id} data-shot={template.id} style={{ marginBottom: 24 }}>
        <Component {...(template.props || {})} />
      </div>,
    ]
  }

  const countBoards = FLEX_QA_COUNTS.map((count) => {
    const content = createEmergenceContent()
    content.stagePeopleCount = count
    return (
      <div
        key={`${template.id}-n${count}`}
        data-shot={`${template.id}-n${count}`}
        style={{ marginBottom: 24 }}
      >
        <Component {...(template.props || {})} content={content} />
      </div>
    )
  })

  const soloBoards = [4, 5].map((count) => {
    const content = createEmergenceContent()
    content.stagePeopleCount = count
    content.includeConvener = false
    return (
      <div
        key={`${template.id}-n${count}-solo`}
        data-shot={`${template.id}-n${count}-solo`}
        style={{ marginBottom: 24 }}
      >
        <Component {...(template.props || {})} content={content} />
      </div>
    )
  })

  return [...countBoards, ...soloBoards]
}

const boards = Object.values(EMERGENCE_TEMPLATES).flatMap(boardsForTemplate)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ padding: 24 }}>{boards}</div>
  </StrictMode>,
)
