import { createRoot } from 'react-dom/client'
import project from '../src/projects/flier-studio/project'
import '../src/styles/global.css'

function QaPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: 40, background: '#222' }}>
      {project.boardItems.map((item) => (
        <div key={item.id} data-shot={item.id} style={{ width: item.width }}>
          <item.Component {...(item.props || {})} />
        </div>
      ))}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<QaPage />)
