import {
  Download,
  FolderOpen,
  Frame,
  Hand,
  LayoutGrid,
  Maximize2,
  Moon,
  MousePointer2,
  Scan,
  Scaling,
  Sun,
  Type,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

const TOOLS = [
  { id: 'select', label: 'Move / Select (V)', icon: MousePointer2 },
  { id: 'text', label: 'Text (T)', icon: Type },
  { id: 'hand', label: 'Hand / Pan (H)', icon: Hand },
]

const ACTIONS = [
  { id: 'zoomIn', label: 'Zoom in (+)', icon: ZoomIn },
  { id: 'zoomOut', label: 'Zoom out (-)', icon: ZoomOut },
  { id: 'fit', label: 'Fit to screen (Ctrl+0)', icon: Maximize2 },
  { id: 'zoom100', label: 'Zoom 100% (Ctrl+1)', icon: Scaling },
]

export default function ToolRail({
  tool,
  theme,
  onToolChange,
  onAction,
  onExport,
  onToggleTheme,
  onOpenDialog,
  onOpenSamples,
  samplesActive = false,
  showLabels,
  onToggleLabels,
  showGrid,
  onToggleGrid,
  canExport,
  busy,
}) {
  const ThemeIcon = theme === 'dark' ? Sun : Moon
  const themeLabel = theme === 'dark' ? 'Light mode' : 'Dark mode'

  return (
    <aside className="tool-rail" aria-label="Tools">
      <div className="tool-rail__brand" title="Flier Studio">
        <Frame size={18} strokeWidth={2.25} />
      </div>

      <div className="tool-rail__group">
        <button
          type="button"
          className="tool-btn"
          title="Open design (Ctrl+O)"
          aria-label="Open design"
          onClick={onOpenDialog}
        >
          <FolderOpen size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className={`tool-btn${samplesActive ? ' is-active' : ''}`}
          title="Samples"
          aria-label="Samples"
          aria-pressed={samplesActive}
          onClick={onOpenSamples}
        >
          <LayoutGrid size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="tool-rail__divider" />

      <div className="tool-rail__group">
        {TOOLS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`tool-btn${tool === id ? ' is-active' : ''}`}
            title={label}
            aria-label={label}
            aria-pressed={tool === id}
            onClick={() => onToolChange(id)}
          >
            <Icon size={18} strokeWidth={2} />
          </button>
        ))}
      </div>

      <div className="tool-rail__divider" />

      <div className="tool-rail__group">
        {ACTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="tool-btn"
            title={label}
            aria-label={label}
            onClick={() => onAction(id)}
          >
            <Icon size={18} strokeWidth={2} />
          </button>
        ))}
      </div>

      <div className="tool-rail__divider" />

      <div className="tool-rail__group">
        <button
          type="button"
          className={`tool-btn${showLabels ? ' is-active' : ''}`}
          title="Toggle frame labels"
          aria-label="Toggle frame labels"
          aria-pressed={showLabels}
          onClick={onToggleLabels}
        >
          <Scan size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className={`tool-btn${showGrid ? ' is-active' : ''}`}
          title="Toggle board grid"
          aria-label="Toggle board grid"
          aria-pressed={showGrid}
          onClick={onToggleGrid}
        >
          <span className="tool-btn__grid" />
        </button>
      </div>

      <div className="tool-rail__spacer" />

      <button
        type="button"
        className="tool-btn"
        title={themeLabel}
        aria-label={themeLabel}
        onClick={onToggleTheme}
      >
        <ThemeIcon size={18} strokeWidth={2} />
      </button>

      <button
        type="button"
        className="tool-btn tool-btn--accent"
        title={busy ? 'Exporting…' : 'Export selection (Ctrl+E)'}
        aria-label="Export selection"
        disabled={!canExport || busy}
        onClick={onExport}
      >
        <Download size={18} strokeWidth={2.25} />
      </button>
    </aside>
  )
}
