import {
  Copy,
  Download,
  FileImage,
  Layers,
  Link2,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  CopyPlus,
  Trash2,
  X,
} from 'lucide-react'
import { HD_SCALES } from '../../lib/exportFlier'
import EditPanel from './EditPanel'

export default function Inspector({
  items,
  selectedId,
  selected,
  format,
  hdScaleId,
  busy,
  error,
  zoom,
  onSelect,
  onFormatChange,
  onHdScaleChange,
  onExport,
  onCopySize,
  onDuplicateLayer,
  onDeleteLayer,
  canDeleteLayer = true,
  mode = 'board',
  templatesItems = [],
  templatesSelectedId = null,
  onTemplatesSelect,
  templatesHint = '',
  editEnabled = false,
  editContent = null,
  focusedPath = null,
  focusedKind = null,
  onEditChange,
  onFocusField,
  onPickImage,
  onClearImage,
  onAlignChange,
  onResetDraft,
  hasSavedEdits = false,
  collapsed = false,
  onToggleCollapsed,
  sheet = false,
  sheetOpen = false,
}) {
  const scale = HD_SCALES[hdScaleId]?.scale ?? 3
  const outW = selected ? selected.width * scale : 0
  const outH = selected ? selected.height * scale : 0
  const templatesMode = mode === 'templates'
  const adminMode = mode === 'admin'
  const layerItems = templatesMode ? templatesItems : items
  const closeLabel = sheet ? 'Close panel' : 'Collapse sidebar'
  const CloseIcon = sheet ? X : PanelRightClose
  const sheetHidden = sheet && !sheetOpen

  function sheetHandle() {
    if (!sheet) return null
    return (
      <div className="inspector__sheet-handle" aria-hidden>
        <span />
      </div>
    )
  }

  if (collapsed && !sheet) {
    return (
      <aside className="inspector inspector--collapsed" aria-label="Inspector">
        <button
          type="button"
          className="inspector__rail-btn"
          title="Expand sidebar"
          aria-label="Expand sidebar"
          aria-expanded={false}
          onClick={onToggleCollapsed}
        >
          <PanelRightOpen size={16} strokeWidth={2.25} />
        </button>

        <div className="inspector__rail-divider" />

        <button
          type="button"
          className="inspector__rail-btn"
          title={templatesMode ? 'Templates' : adminMode ? 'Admin' : 'Layers'}
          aria-label={templatesMode ? 'Templates' : adminMode ? 'Admin' : 'Layers'}
          onClick={onToggleCollapsed}
        >
          <Layers size={16} strokeWidth={2.25} />
        </button>

        {!adminMode ? (
          <ul className="inspector__rail-layers">
            {layerItems.map((item) => {
              const active =
                (templatesMode ? templatesSelectedId : selectedId) === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`inspector__rail-swatch${active ? ' is-active' : ''}`}
                    title={item.name}
                    aria-label={item.name}
                    aria-pressed={active}
                    onClick={() =>
                      templatesMode ? onTemplatesSelect?.(item.id) : onSelect(item.id)
                    }
                  >
                    <span
                      className="inspector__swatch"
                      style={item.color ? { background: item.color } : undefined}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}

        <div className="inspector__rail-spacer" />

        {editEnabled ? (
          <button
            type="button"
            className="inspector__rail-btn"
            title="Edit — expand sidebar"
            aria-label="Edit — expand sidebar"
            onClick={onToggleCollapsed}
          >
            <Pencil size={16} strokeWidth={2.25} />
          </button>
        ) : null}

        {!templatesMode && !adminMode ? (
          <button
            type="button"
            className="inspector__rail-btn inspector__rail-btn--accent"
            title={
              selected
                ? `Export ${outW}×${outH} ${format.toUpperCase()}`
                : 'Select an artboard to export'
            }
            aria-label="Export"
            disabled={busy || !selected}
            onClick={onExport}
          >
            <Download size={16} strokeWidth={2.25} />
          </button>
        ) : null}
      </aside>
    )
  }

  if (adminMode) {
    return (
      <aside
        className={`inspector${sheet ? ' inspector--sheet' : ''}`}
        aria-label="Inspector"
        aria-hidden={sheetHidden || undefined}
      >
        {sheetHandle()}
        <header className="inspector__head">
          <Layers size={14} strokeWidth={2.25} />
          <span>Admin</span>
          <button
            type="button"
            className="inspector__collapse-btn"
            title={closeLabel}
            aria-label={closeLabel}
            aria-expanded={true}
            onClick={onToggleCollapsed}
          >
            <CloseIcon size={14} strokeWidth={2.25} />
          </button>
        </header>
        <div className="inspector__block">
          <p className="inspector__note">
            {templatesHint || 'Review users and activity. Only admins can open this tab.'}
          </p>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={`inspector${sheet ? ' inspector--sheet' : ''}`}
      aria-label="Inspector"
      aria-hidden={sheetHidden || undefined}
      data-tour="inspector"
    >
      {sheetHandle()}
      <header className="inspector__head">
        <Layers size={14} strokeWidth={2.25} />
        <span>{templatesMode ? 'Templates' : 'Layers'}</span>
        <button
          type="button"
          className="inspector__collapse-btn"
          title={closeLabel}
          aria-label={closeLabel}
          aria-expanded={true}
          onClick={onToggleCollapsed}
        >
          <CloseIcon size={14} strokeWidth={2.25} />
        </button>
      </header>

      <ul className="inspector__layers">
        {layerItems.map((item) => {
          const active =
            (templatesMode ? templatesSelectedId : selectedId) === item.id
          return (
            <li key={item.id} className={`inspector__layer-row${active ? ' is-active' : ''}`}>
              <button
                type="button"
                className={`inspector__layer${active ? ' is-active' : ''}`}
                onClick={() => (templatesMode ? onTemplatesSelect?.(item.id) : onSelect(item.id))}
              >
                <span
                  className="inspector__swatch"
                  style={item.color ? { background: item.color } : undefined}
                />
                <span className="inspector__layer-text">
                  <strong>{item.name}</strong>
                  <small>{item.group || item.meta}</small>
                </span>
              </button>

              {!templatesMode ? (
                <div className="inspector__layer-actions">
                  <button
                    type="button"
                    className="inspector__layer-action"
                    title="Duplicate layer"
                    aria-label={`Duplicate ${item.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicateLayer?.(item.id)
                    }}
                  >
                    <CopyPlus size={13} strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    className="inspector__layer-action inspector__layer-action--danger"
                    title={canDeleteLayer ? 'Delete layer' : 'Keep at least one layer'}
                    aria-label={`Delete ${item.name}`}
                    disabled={!canDeleteLayer}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteLayer?.(item.id)
                    }}
                  >
                    <Trash2 size={13} strokeWidth={2.25} />
                  </button>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      {templatesMode ? (
        <>
          <div className="inspector__block">
            <p className="inspector__note">
              {templatesHint ||
                'Click a template to open it in the studio editor.'}
            </p>
          </div>
          <div className="inspector__tips">
            <p>Templates stay inside the studio canvas.</p>
            <p>Use the grid icon again to return to boards.</p>
          </div>
        </>
      ) : (
        <>
          {editEnabled ? (
            <>
              <header className="inspector__head">
                <Pencil size={14} strokeWidth={2.25} />
                <span>Edit</span>
              </header>
              <EditPanel
                content={editContent}
                focusedPath={focusedPath}
                focusedKind={focusedKind}
                onChange={onEditChange}
                onFocusField={onFocusField}
                onPickImage={onPickImage}
                onClearImage={onClearImage}
                onAlignChange={onAlignChange}
                onResetDraft={onResetDraft}
                hasSavedEdits={hasSavedEdits}
              />
            </>
          ) : null}

          <header className="inspector__head">
            <FileImage size={14} strokeWidth={2.25} />
            <span>Export</span>
          </header>

          {selected ? (
            <div className="inspector__block">
              <div className="inspector__meta">
                <p className="inspector__name">{selected.name}</p>
                <p className="inspector__desc">{selected.description}</p>
              </div>

              <div className="inspector__row">
                <span>Artboard</span>
                <code>{selected.width}</code>
                <span>×</span>
                <code>{selected.height}</code>
                <button
                  type="button"
                  className="inspector__icon-btn"
                  title="Copy artboard size"
                  aria-label="Copy artboard size"
                  onClick={onCopySize}
                >
                  <Copy size={14} strokeWidth={2.25} />
                </button>
              </div>

              <div className="inspector__row inspector__row--stack">
                <span>Quality</span>
                <div className="inspector__segment inspector__segment--wrap">
                  {Object.values(HD_SCALES).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={hdScaleId === item.id ? 'is-active' : ''}
                      onClick={() => onHdScaleChange(item.id)}
                      title={`${item.label} → ${selected.width * item.scale}×${selected.height * item.scale}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="inspector__row">
                <span>Output</span>
                <code className="inspector__code-wide">
                  {outW}×{outH}
                </code>
                <span className="inspector__badge">HD</span>
              </div>

              <div className="inspector__row">
                <span>Format</span>
                <div className="inspector__segment">
                  {['png', 'jpg'].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={format === value ? 'is-active' : ''}
                      onClick={() => onFormatChange(value)}
                    >
                      {value.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="inspector__row">
                <span>View zoom</span>
                <code>{Math.round(zoom * 100)}%</code>
                <Link2 size={13} strokeWidth={2} className="inspector__muted-icon" />
              </div>

              <p className="inspector__note">
                Export captures at full HD — preview zoom does not affect sharpness. Larger scale =
                sharper, bigger file.
              </p>

              <button
                type="button"
                className="inspector__export"
                disabled={busy}
                onClick={onExport}
                title={`Download ${outW}×${outH} ${format.toUpperCase()}`}
              >
                <Download size={16} strokeWidth={2.25} />
                <span>{busy ? 'Exporting HD…' : `Export ${scale}×`}</span>
              </button>

              {error ? <p className="inspector__error">{error}</p> : null}
            </div>
          ) : (
            <p className="inspector__empty">Select an artboard to export.</p>
          )}

          <div className="inspector__tips inspector__tips--desktop">
            <p>
              <kbd>V</kbd> Move · <kbd>T</kbd> Text · <kbd>H</kbd> Hand
            </p>
            <p>
              Scroll to pan · <kbd>Ctrl</kbd>+scroll to zoom
            </p>
            <p>
              <kbd>Ctrl</kbd>+<kbd>Z</kbd> Undo · <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> Redo
            </p>
            <p>Enter = new line · click outside text returns to Move</p>
            <p>
              <kbd>+</kbd> <kbd>-</kbd> Zoom · <kbd>⌘/Ctrl</kbd>+<kbd>0</kbd> Fit
            </p>
          </div>
          <div className="inspector__tips inspector__tips--mobile">
            <p>Pinch to zoom · two-finger drag to pan · Hand tool for one-finger pan</p>
            <p>Tap text on the board to edit · use Export above for format &amp; HD</p>
          </div>
        </>
      )}
    </aside>
  )
}
