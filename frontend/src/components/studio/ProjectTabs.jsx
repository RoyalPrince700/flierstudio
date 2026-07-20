import { FolderOpen, Plus, X } from 'lucide-react'

export default function ProjectTabs({
  openTabs,
  activeProjectId,
  onSelect,
  onClose,
  onOpenDialog,
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

        <button
          type="button"
          className="project-tabs__add"
          title="Open design"
          aria-label="Open design"
          onClick={onOpenDialog}
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>

      <button
        type="button"
        className="project-tabs__open"
        onClick={onOpenDialog}
        title="Open design (Ctrl+O)"
      >
        <FolderOpen size={14} strokeWidth={2.25} />
        <span>Open design</span>
      </button>
    </div>
  )
}
