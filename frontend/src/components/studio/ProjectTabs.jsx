import { X } from 'lucide-react'

export default function ProjectTabs({
  openTabs,
  activeProjectId,
  onSelect,
  onClose,
}) {
  return (
    <div className="project-tabs" role="tablist" aria-label="Open projects">
      <div className="project-tabs__list">
        {openTabs.map((project) => {
          const active = project.id === activeProjectId
          return (
            <div
              key={project.id}
              className={`project-tabs__tab${active ? ' is-active' : ''}`}
              role="tab"
              aria-selected={active}
            >
              <button
                type="button"
                className="project-tabs__main"
                onClick={() => onSelect(project.id)}
                title={`${project.name} · ${project.brand}`}
              >
                <span
                  className="project-tabs__dot"
                  style={{ background: project.color }}
                />
                <span className="project-tabs__name">{project.name}</span>
                <span className="project-tabs__count">{project.flierCount}</span>
              </button>
              <button
                type="button"
                className="project-tabs__close"
                title={`Close ${project.name}`}
                aria-label={`Close ${project.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onClose(project.id)
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
