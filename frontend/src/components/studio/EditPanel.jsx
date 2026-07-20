import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ImagePlus,
  Palette,
  Type,
  Upload,
  X,
} from 'lucide-react'
import { FONT_CATALOG, fontIdByStack } from '../../design/fontCatalog'
import {
  DEFAULT_EMERGENCE_COLOR_THEME,
  EMERGENCE_COLOR_THEMES,
} from '../../design/emergenceThemes'
import { getByPath } from '../../lib/flierDraft'

const ALIGN_OPTIONS = [
  { id: 'left', label: 'Left', icon: AlignLeft },
  { id: 'center', label: 'Center', icon: AlignCenter },
  { id: 'right', label: 'Right', icon: AlignRight },
  { id: 'justify', label: 'Justify', icon: AlignJustify },
]

function fieldLabel(path) {
  if (!path) return 'Field'
  if (path === 'convener.photoSrc') return 'Convener photo'
  if (path === 'convener.label') return 'Convener label'
  if (path === 'event.qrSrc') return 'QR code'
  if (path === 'event.timeNote') return 'Time note'
  if (path === 'event.dateNote') return 'Date note'
  if (path === 'event.ticketLabel') return 'Ticket label'
  if (path.startsWith('speakers.')) {
    const [, index, field] = path.split('.')
    const n = Number(index) + 1
    if (field === 'photoSrc') return `Speaker ${n} photo`
    if (field === 'name') return `Speaker ${n} name`
    if (field === 'title') return `Speaker ${n} title`
  }
  if (path.startsWith('panelists.')) {
    const [, index, field] = path.split('.')
    const n = Number(index) + 1
    if (field === 'photoSrc') return `Panelist ${n} photo`
    if (field === 'name') return `Panelist ${n} name`
    if (field === 'title') return `Panelist ${n} title`
  }
  if (path.startsWith('event.')) {
    const key = path.replace('event.', '').replace(/\.\d+$/, '')
    return key.charAt(0).toUpperCase() + key.slice(1)
  }
  const leaf = path.split('.').pop() || path
  return leaf
    .replace(/([A-Z])/g, ' $1')
    .replace(/Src$/i, ' photo')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function isImagePath(path) {
  return Boolean(
    path &&
      (path.endsWith('photoSrc') ||
        path.endsWith('Src') ||
        path.endsWith('Image') ||
        path === 'backgroundImage' ||
        path === 'logoSrc'),
  )
}

export default function EditPanel({
  content,
  focusedPath,
  focusedKind,
  onChange,
  onFocusField,
  onPickImage,
  onClearImage,
  onAlignChange,
  onResetDraft,
  hasSavedEdits = false,
}) {
  if (!content) {
    return (
      <div className="inspector__block">
        <p className="inspector__note">
          Select an artboard to edit text, fonts, and photos. Each design layer saves on its own.
        </p>
      </div>
    )
  }

  const isEmergence = content.kind === 'emergence'
  const fonts = isEmergence ? content.fonts : content.fonts || {}
  const alignments = isEmergence ? content.alignments : content.alignments || {}
  const displayId = fontIdByStack(fonts?.display) || (isEmergence ? 'orbitron' : 'bebas')
  const bodyId = fontIdByStack(fonts?.body) || (isEmergence ? 'manrope' : 'dm-sans')
  const colorTheme = isEmergence
    ? content.colorTheme || DEFAULT_EMERGENCE_COLOR_THEME
    : null

  const focusedValue = focusedPath
    ? isEmergence
      ? getByPath(content, focusedPath)
      : getByPath(content.fields, focusedPath)
    : ''
  const imageFocused = focusedKind === 'image' || isImagePath(focusedPath)
  const currentAlign = focusedPath ? alignments?.[focusedPath] || '' : ''

  function patchFont(role, stack) {
    onChange(`fonts.${role}`, stack)
  }

  return (
    <div className="inspector__block edit-panel">
      <p className="inspector__note">
        Edits save per artboard in this browser. <kbd>T</kbd> text · Enter = new line · click outside
        returns to Move (<kbd>V</kbd>).
      </p>

      {isEmergence ? (
        <div className="edit-panel__section">
          <div className="edit-panel__label">
            <Palette size={13} strokeWidth={2.25} />
            Color theme
          </div>
          <div className="edit-panel__themes" role="listbox" aria-label="Color theme">
            {EMERGENCE_COLOR_THEMES.map((theme) => {
              const active = colorTheme === theme.id
              return (
                <button
                  key={theme.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`edit-panel__theme${active ? ' is-active' : ''}`}
                  title={theme.label}
                  onClick={() => onChange('colorTheme', theme.id)}
                >
                  <span className="edit-panel__theme-swatch" aria-hidden>
                    {theme.swatch.map((hex) => (
                      <span key={hex} style={{ background: hex }} />
                    ))}
                  </span>
                  <span className="edit-panel__theme-label">{theme.label}</span>
                </button>
              )
            })}
          </div>
          <p className="inspector__note">
            Switches background and chrome colors. Photos and placeholders stay as-is.
          </p>
        </div>
      ) : null}

      <div className="edit-panel__section">
        <div className="edit-panel__label">
          <Type size={13} strokeWidth={2.25} />
          Typography
        </div>
        <label className="edit-panel__field">
          <span>Display font</span>
          <select
            value={displayId}
            onChange={(e) => {
              const font = FONT_CATALOG.find((f) => f.id === e.target.value)
              if (font) patchFont('display', font.stack)
            }}
          >
            {FONT_CATALOG.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
        <label className="edit-panel__field">
          <span>Body font</span>
          <select
            value={bodyId}
            onChange={(e) => {
              const font = FONT_CATALOG.find((f) => f.id === e.target.value)
              if (font) patchFont('body', font.stack)
            }}
          >
            {FONT_CATALOG.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="edit-panel__section">
        <div className="edit-panel__label">
          <Type size={13} strokeWidth={2.25} />
          {focusedPath && !imageFocused ? fieldLabel(focusedPath) : 'Selected text'}
        </div>
        {focusedPath && !imageFocused ? (
          <>
            <label className="edit-panel__field">
              <span>Content</span>
              <textarea
                rows={4}
                value={typeof focusedValue === 'string' ? focusedValue : ''}
                onChange={(e) => onChange(focusedPath, e.target.value)}
                onFocus={() => onFocusField?.(focusedPath, 'text')}
              />
            </label>
            <div className="edit-panel__field">
              <span>Align</span>
              <div className="edit-panel__align">
                {ALIGN_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={currentAlign === id ? 'is-active' : ''}
                    title={label}
                    aria-label={label}
                    aria-pressed={currentAlign === id}
                    onClick={() => onAlignChange?.(focusedPath, id)}
                  >
                    <Icon size={14} strokeWidth={2.25} />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="inspector__note">Click any text on this artboard.</p>
        )}
      </div>

      <div className="edit-panel__section">
        <div className="edit-panel__label">
          <ImagePlus size={13} strokeWidth={2.25} />
          {imageFocused && focusedPath ? fieldLabel(focusedPath) : 'Photo / image slot'}
        </div>
        {imageFocused && focusedPath ? (
          <>
            {typeof focusedValue === 'string' && focusedValue ? (
              <div className="edit-panel__preview">
                <img src={focusedValue} alt="" />
              </div>
            ) : (
              <p className="inspector__note">No image yet — upload a PNG or JPEG.</p>
            )}
            <div className="edit-panel__actions">
              <button type="button" className="edit-panel__btn" onClick={() => onPickImage(focusedPath)}>
                <Upload size={14} strokeWidth={2.25} />
                {focusedValue ? 'Replace photo' : 'Add photo'}
              </button>
              {focusedValue ? (
                <button
                  type="button"
                  className="edit-panel__btn edit-panel__btn--ghost"
                  onClick={() => onClearImage(focusedPath)}
                >
                  <X size={14} strokeWidth={2.25} />
                  Clear
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <p className="inspector__note">Click an image placeholder on this artboard.</p>
        )}
      </div>

      {hasSavedEdits ? (
        <button
          type="button"
          className="edit-panel__btn edit-panel__btn--ghost edit-panel__btn--wide"
          onClick={() => {
            if (window.confirm('Reset this artboard only to its defaults?')) {
              onResetDraft?.()
            }
          }}
        >
          Reset this artboard
        </button>
      ) : null}
    </div>
  )
}
