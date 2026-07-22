import {
  Download,
  Hand,
  LayoutGrid,
  Layers,
  Maximize2,
  Moon,
  MousePointer2,
  Scaling,
  Scan,
  Sun,
  Type,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { LiftoffMark } from '../../fliers/flier-studio/FSLogo'
import { fsTokens } from '../../design/flierStudioTokens'
import ExportProgress from './ExportProgress'

const TOOLS = [
  { id: 'select', label: 'Move / Select (V)', icon: MousePointer2 },
  { id: 'text', label: 'Text (T)', icon: Type },
  { id: 'hand', label: 'Hand / Pan (H)', icon: Hand },
]

const ACTIONS = [
  { id: 'zoomIn', label: 'Zoom in (+)', icon: ZoomIn, phoneHide: false },
  { id: 'zoomOut', label: 'Zoom out (-)', icon: ZoomOut, phoneHide: false },
  { id: 'fit', label: 'Fit to screen (Ctrl+0)', icon: Maximize2, phoneHide: true },
  { id: 'zoom100', label: 'Zoom 100% (Ctrl+1)', icon: Scaling, phoneHide: true },
]

export default function ToolRail({
  tool,
  theme,
  onToolChange,
  onAction,
  onExport,
  onToggleTheme,
  onOpenTemplates,
  templatesActive = false,
  showLabels,
  onToggleLabels,
  showGrid,
  onToggleGrid,
  canExport,
  busy,
  exportProgress = 0,
  exportLabel = 'Preparing your flier…',
  onToggleInspector,
  inspectorOpen = false,
  /** Brief coach highlight: 'hand' | 'select' | null */
  highlightTool = null,
}) {
  const ThemeIcon = theme === 'dark' ? Sun : Moon
  const themeLabel = theme === 'dark' ? 'Light mode' : 'Dark mode'

  return (
    <aside className="tool-rail" aria-label="Tools">
      <div className="tool-rail__brand" title="Flier Studio">
        <LiftoffMark
          size={22}
          base={theme === 'dark' ? fsTokens.colors.paper : fsTokens.colors.ink}
          corner={fsTokens.colors.signal}
        />
      </div>

      <div className="tool-rail__group" data-tour="templates-group">
        <button
          type="button"
          className={`tool-btn${templatesActive ? ' is-active' : ''}`}
          title="Templates (Ctrl+O)"
          aria-label="Templates"
          aria-pressed={templatesActive}
          data-tour="templates-rail"
          onClick={onOpenTemplates}
        >
          <LayoutGrid size={18} strokeWidth={2} />
        </button>
        {onToggleInspector ? (
          <button
            type="button"
            className={`tool-btn tool-btn--mobile-panel${inspectorOpen ? ' is-active' : ''}`}
            title="Open layers, edit & export"
            aria-label="Open layers, edit and export"
            aria-pressed={inspectorOpen}
            data-tour="panel"
            onClick={onToggleInspector}
          >
            <Layers size={18} strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <div className="tool-rail__divider" />

      <div className="tool-rail__group" data-tour="tools">
        {TOOLS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`tool-btn${tool === id ? ' is-active' : ''}${
              highlightTool === id ? ' is-coach-blink' : ''
            }`}
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

      <div className="tool-rail__group tool-rail__group--zoom">
        {ACTIONS.map(({ id, label, icon: Icon, phoneHide }) => (
          <button
            key={id}
            type="button"
            className={`tool-btn${phoneHide ? ' tool-btn--phone-hide' : ''}`}
            title={label}
            aria-label={label}
            onClick={() => onAction(id)}
          >
            <Icon size={18} strokeWidth={2} />
          </button>
        ))}
      </div>

      <div className="tool-rail__divider tool-rail__divider--view" />

      <div className="tool-rail__group tool-rail__group--view">
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
        className="tool-btn tool-rail__theme-btn"
        title={themeLabel}
        aria-label={themeLabel}
        onClick={onToggleTheme}
      >
        <ThemeIcon size={18} strokeWidth={2} />
      </button>

      {/* Desktop / tablet side rail only — hidden on phone bottom dock (≤640) */}
      <button
        type="button"
        className={`tool-btn tool-btn--accent tool-btn--export tool-btn--phone-hide${busy ? ' is-busy' : ''}`}
        title={busy ? exportLabel : 'Download flier (Ctrl+E)'}
        aria-label={busy ? exportLabel : 'Download flier'}
        aria-busy={busy || undefined}
        data-tour="export"
        disabled={!canExport || busy}
        onClick={onExport}
      >
        {busy ? (
          <>
            <Download size={18} strokeWidth={2.25} aria-hidden />
            <ExportProgress progress={exportProgress} label={exportLabel} compact />
          </>
        ) : (
          <Download size={18} strokeWidth={2.25} />
        )}
      </button>
    </aside>
  )
}
