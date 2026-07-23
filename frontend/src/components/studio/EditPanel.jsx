import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  Type,
  Upload,
  Users,
  X,
} from 'lucide-react'
import {
  STAGE_PEOPLE_MAX,
  STAGE_PEOPLE_MIN,
  clampStagePeopleCount,
} from '../../fliers/emergence/stagePeopleLayout'
import { FONT_CATALOG, fontIdByStack } from '../../design/fontCatalog'
import {
  DEFAULT_EMERGENCE_COLOR_THEME,
  EMERGENCE_COLOR_THEMES,
} from '../../design/emergenceThemes'
import { normalizeLogoMode } from '../../design/defaultBrandLogo'
import { getByPath } from '../../lib/flierDraft'
import {
  DEFAULT_IMAGE_FIT,
  IMAGE_FIT_MAX_SCALE,
  IMAGE_FIT_MIN_SCALE,
  getImageFit,
  zoomImageFit,
} from '../../lib/imageFit'
import {
  DEFAULT_LOGO_LAYOUT,
  LOGO_NUDGE_X,
  LOGO_NUDGE_Y,
  LOGO_OFFSET_X_MAX,
  LOGO_OFFSET_X_MIN,
  LOGO_OFFSET_Y_MAX,
  LOGO_OFFSET_Y_MIN,
  LOGO_SCALE_MAX,
  LOGO_SCALE_MIN,
  LOGO_SCALE_STEP,
  clampLogoLayout,
  isBrandFieldPath,
  isLogoImagePath,
  nudgeLogoLayout,
  scaleLogoLayout,
} from '../../lib/logoLayout'
import { isImagePath, resolveEditFocusMode } from './editFocus'

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
  if (path === 'event.logoSrc' || path === 'logoSrc') return 'Logo'
  if (path === 'event.wordmark') return 'Text logo'
  if (path === 'event.logoMode') return 'Brand mode'
  if (path === 'event.timeNote') return 'Time note'
  if (path === 'event.dateNote') return 'Date note'
  if (path === 'event.ticketLabel') return 'Ticket label'
  if (path === 'event.programmeTitle') return 'Programme title'
  if (path === 'event.heroSeries') return 'Hero series'
  if (path === 'event.heroTheme') return 'Hero theme'
  if (path === 'event.heroCapsule') return 'Hero capsule'
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
  if (path.startsWith('stagePeople.')) {
    const [, index, field] = path.split('.')
    const n = Number(index) + 1
    if (field === 'photoSrc') return `Person ${n} photo`
    if (field === 'name') return `Person ${n} name`
    if (field === 'title') return `Person ${n} title`
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

export default function EditPanel({
  content,
  focusedPath,
  focusedKind,
  onChange,
  onFocusField,
  onPickImage,
  onClearImage,
  onImageFitChange,
  onLogoLayoutChange,
  onRestoreDefaultLogo,
  onUseTextLogo,
  onUseImageLogo,
  onAlignChange,
  onResetDraft,
  hasSavedEdits = false,
}) {
  if (!content) {
    return (
      <div className="inspector__block edit-panel">
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
  const logoFocused = imageFocused && isLogoImagePath(focusedPath)
  const brandFocused = isBrandFieldPath(focusedPath)
  const focusMode = resolveEditFocusMode(focusedKind, focusedPath)
  const logoMode = isEmergence
    ? normalizeLogoMode(content.event?.logoMode)
    : 'image'
  const showBrandSection = isEmergence
  const currentAlign = focusedPath ? alignments?.[focusedPath] || '' : ''
  const logoLayout = clampLogoLayout(
    isEmergence ? content.event?.logoLayout : content.logoLayout,
  )
  const logoSrcValue = isEmergence ? content.event?.logoSrc : content.logoSrc
  const hasLogoImage = logoMode === 'image' && Boolean(String(logoSrcValue || '').trim())

  function patchFont(role, stack) {
    onChange(`fonts.${role}`, stack)
  }

  function patchLogo(next) {
    onLogoLayoutChange?.(clampLogoLayout(next))
  }

  const noteSection = (
    <p key="note" className="inspector__note">
      {focusMode === 'none' ? (
        <>
          Click text or a photo/logo on the artboard to edit. <kbd>T</kbd> text · Enter = new line ·
          click outside returns to Move (<kbd>V</kbd>).
        </>
      ) : (
        <>
          Edits save per artboard in this browser. <kbd>T</kbd> text · Enter = new line · click
          outside returns to Move (<kbd>V</kbd>).
        </>
      )}
    </p>
  )

  const stageCount = isEmergence
    ? clampStagePeopleCount(content.stagePeopleCount)
    : STAGE_PEOPLE_MIN
  const includeConvener = isEmergence ? content.includeConvener !== false : true

  const stageFlexSection =
    isEmergence && content.stageFlex ? (
      <div key="stage-flex" className="edit-panel__section">
        <div className="edit-panel__label">
          <Users size={13} strokeWidth={2.25} />
          People on stage
        </div>
        <div className="edit-panel__actions edit-panel__actions--crop">
          <button
            type="button"
            className="edit-panel__btn edit-panel__btn--ghost"
            disabled={stageCount <= STAGE_PEOPLE_MIN}
            aria-label="Fewer people"
            onClick={() => onChange('stagePeopleCount', stageCount - 1)}
          >
            <Minus size={14} strokeWidth={2.25} />
          </button>
          <label className="edit-panel__field edit-panel__field--inline">
            <select
              value={stageCount}
              aria-label="People on stage"
              onChange={(e) => onChange('stagePeopleCount', Number(e.target.value))}
            >
              {Array.from({ length: STAGE_PEOPLE_MAX - STAGE_PEOPLE_MIN + 1 }, (_, i) => {
                const n = STAGE_PEOPLE_MIN + i
                return (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'person' : 'people'}
                  </option>
                )
              })}
            </select>
          </label>
          <button
            type="button"
            className="edit-panel__btn edit-panel__btn--ghost"
            disabled={stageCount >= STAGE_PEOPLE_MAX}
            aria-label="More people"
            onClick={() => onChange('stagePeopleCount', stageCount + 1)}
          >
            <Plus size={14} strokeWidth={2.25} />
          </button>
        </div>
        <label className="edit-panel__field edit-panel__check">
          <input
            type="checkbox"
            checked={includeConvener}
            onChange={(e) => onChange('includeConvener', e.target.checked)}
          />
          <span>Include convener column</span>
        </label>
        <p className="inspector__note">
          Layout reflows for visual balance. Reducing count keeps hidden slot edits.
        </p>
      </div>
    ) : null

  const themeSection = isEmergence ? (
    <div key="theme" className="edit-panel__section">
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
  ) : null

  const typographySection = (
    <div key="type" className="edit-panel__section">
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
  )

  const textSection = (
    <div key="text" className="edit-panel__section">
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
  )

  const brandSection = showBrandSection ? (
    <div
      key="brand"
      className={`edit-panel__section${logoFocused || brandFocused ? ' edit-panel__section--priority' : ''}`}
    >
      <div className="edit-panel__label">
        <Sparkles size={13} strokeWidth={2.25} />
        Brand / Logo
      </div>
      <div className="inspector__segment" role="group" aria-label="Brand mode">
        <button
          type="button"
          className={logoMode === 'image' ? 'is-active' : ''}
          aria-pressed={logoMode === 'image'}
          onClick={() => onUseImageLogo?.()}
        >
          Image
        </button>
        <button
          type="button"
          className={logoMode === 'text' ? 'is-active' : ''}
          aria-pressed={logoMode === 'text'}
          onClick={() => onUseTextLogo?.()}
        >
          Text
        </button>
      </div>

      {logoMode === 'none' ? (
        <>
          <p className="inspector__note">No brand mark — pick one below.</p>
          <div className="edit-panel__actions">
            <button
              type="button"
              className="edit-panel__btn"
              onClick={() => {
                onFocusField?.('event.logoSrc', 'image')
                onPickImage?.('event.logoSrc')
              }}
            >
              <Upload size={14} strokeWidth={2.25} />
              Upload logo
            </button>
            <button
              type="button"
              className="edit-panel__btn edit-panel__btn--ghost"
              onClick={() => onRestoreDefaultLogo?.()}
            >
              <Sparkles size={14} strokeWidth={2.25} />
              Flier Studio logo
            </button>
            <button
              type="button"
              className="edit-panel__btn edit-panel__btn--ghost"
              onClick={() => onUseTextLogo?.()}
            >
              <Type size={14} strokeWidth={2.25} />
              Text logo
            </button>
          </div>
        </>
      ) : null}

      {logoMode === 'text' ? (
        <>
          <label className="edit-panel__field">
            <span>Text logo</span>
            <textarea
              rows={2}
              value={content.event?.wordmark || ''}
              onChange={(e) => onChange('event.wordmark', e.target.value)}
              onFocus={() => onFocusField?.('event.wordmark', 'text')}
            />
          </label>
          <div className="edit-panel__actions">
            <button
              type="button"
              className="edit-panel__btn edit-panel__btn--ghost"
              onClick={() => onUseImageLogo?.()}
            >
              <ImagePlus size={14} strokeWidth={2.25} />
              Switch to image
            </button>
            <button
              type="button"
              className="edit-panel__btn edit-panel__btn--ghost"
              onClick={() => onRestoreDefaultLogo?.()}
            >
              <Sparkles size={14} strokeWidth={2.25} />
              Flier Studio logo
            </button>
          </div>
        </>
      ) : null}

      {logoMode === 'image' ? (
        <>
          {hasLogoImage ? (
            <div className="edit-panel__preview">
              <img src={logoSrcValue} alt="" />
            </div>
          ) : (
            <p className="inspector__note">No logo image yet.</p>
          )}
          <div className="edit-panel__actions">
            <button
              type="button"
              className="edit-panel__btn"
              onClick={() => {
                onFocusField?.('event.logoSrc', 'image')
                onPickImage?.('event.logoSrc')
              }}
            >
              <Upload size={14} strokeWidth={2.25} />
              {hasLogoImage ? 'Replace logo' : 'Upload logo'}
            </button>
            {hasLogoImage ? (
              <button
                type="button"
                className="edit-panel__btn edit-panel__btn--ghost"
                onClick={() => onClearImage?.('event.logoSrc')}
              >
                <X size={14} strokeWidth={2.25} />
                Remove logo
              </button>
            ) : null}
            <button
              type="button"
              className="edit-panel__btn edit-panel__btn--ghost"
              onClick={() => onRestoreDefaultLogo?.()}
            >
              <Sparkles size={14} strokeWidth={2.25} />
              Use Flier Studio
            </button>
            <button
              type="button"
              className="edit-panel__btn edit-panel__btn--ghost"
              onClick={() => onUseTextLogo?.()}
            >
              <Type size={14} strokeWidth={2.25} />
              Use text instead
            </button>
          </div>

          {hasLogoImage && onLogoLayoutChange ? (
            <div className="edit-panel__logo-layout">
              <label className="edit-panel__field">
                <span>Size · {Math.round(logoLayout.scale * 100)}%</span>
                <input
                  type="range"
                  min={LOGO_SCALE_MIN}
                  max={LOGO_SCALE_MAX}
                  step={0.01}
                  value={logoLayout.scale}
                  onChange={(e) =>
                    patchLogo({ ...logoLayout, scale: Number(e.target.value) })
                  }
                  aria-label="Logo size"
                />
              </label>
              <div className="edit-panel__actions edit-panel__actions--crop">
                <button
                  type="button"
                  className="edit-panel__btn edit-panel__btn--ghost"
                  disabled={logoLayout.scale <= LOGO_SCALE_MIN + 0.001}
                  onClick={() => patchLogo(scaleLogoLayout(logoLayout, 1 / LOGO_SCALE_STEP))}
                >
                  <Minus size={14} strokeWidth={2.25} />
                  Size −
                </button>
                <button
                  type="button"
                  className="edit-panel__btn edit-panel__btn--ghost"
                  disabled={logoLayout.scale >= LOGO_SCALE_MAX - 0.001}
                  onClick={() => patchLogo(scaleLogoLayout(logoLayout, LOGO_SCALE_STEP))}
                >
                  <Plus size={14} strokeWidth={2.25} />
                  Size +
                </button>
              </div>
              <div className="edit-panel__actions edit-panel__actions--crop">
                <button
                  type="button"
                  className="edit-panel__btn edit-panel__btn--ghost"
                  disabled={logoLayout.offsetX <= LOGO_OFFSET_X_MIN + 0.001}
                  onClick={() => patchLogo(nudgeLogoLayout(logoLayout, -LOGO_NUDGE_X))}
                >
                  <ChevronLeft size={14} strokeWidth={2.25} />
                  Left
                </button>
                <button
                  type="button"
                  className="edit-panel__btn edit-panel__btn--ghost"
                  disabled={logoLayout.offsetX >= LOGO_OFFSET_X_MAX - 0.001}
                  onClick={() => patchLogo(nudgeLogoLayout(logoLayout, LOGO_NUDGE_X))}
                >
                  <ChevronRight size={14} strokeWidth={2.25} />
                  Right
                </button>
                <button
                  type="button"
                  className="edit-panel__btn edit-panel__btn--ghost"
                  onClick={() => patchLogo(DEFAULT_LOGO_LAYOUT)}
                >
                  <RotateCcw size={14} strokeWidth={2.25} />
                  Reset layout
                </button>
              </div>
              <div className="edit-panel__actions edit-panel__actions--crop">
                <button
                  type="button"
                  className="edit-panel__btn edit-panel__btn--ghost"
                  disabled={logoLayout.offsetY <= LOGO_OFFSET_Y_MIN + 0.001}
                  onClick={() => patchLogo(nudgeLogoLayout(logoLayout, 0, -LOGO_NUDGE_Y))}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="edit-panel__btn edit-panel__btn--ghost"
                  disabled={logoLayout.offsetY >= LOGO_OFFSET_Y_MAX - 0.001}
                  onClick={() => patchLogo(nudgeLogoLayout(logoLayout, 0, LOGO_NUDGE_Y))}
                >
                  Down
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  ) : null

  const imageSection = (
    <div
      key="image"
      className={`edit-panel__section${imageFocused && !logoFocused && !brandFocused ? ' edit-panel__section--priority' : ''}`}
    >
      <div className="edit-panel__label">
        <ImagePlus size={13} strokeWidth={2.25} />
        {imageFocused && focusedPath && !logoFocused && !brandFocused
          ? fieldLabel(focusedPath)
          : 'Photo / image slot'}
      </div>
      {imageFocused && focusedPath && !logoFocused ? (
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

          {focusedValue && onImageFitChange ? (
            <div className="edit-panel__actions edit-panel__actions--crop">
              {(() => {
                const fit = getImageFit(content?.imageFits, focusedPath)
                return (
                  <>
                    <button
                      type="button"
                      className="edit-panel__btn edit-panel__btn--ghost"
                      title="Zoom out"
                      aria-label="Zoom out"
                      disabled={fit.scale <= IMAGE_FIT_MIN_SCALE + 0.001}
                      onClick={() =>
                        onImageFitChange(focusedPath, zoomImageFit(fit, 1 / 1.15))
                      }
                    >
                      <Minus size={14} strokeWidth={2.25} />
                      Zoom −
                    </button>
                    <button
                      type="button"
                      className="edit-panel__btn edit-panel__btn--ghost"
                      title="Zoom in"
                      aria-label="Zoom in"
                      disabled={fit.scale >= IMAGE_FIT_MAX_SCALE - 0.001}
                      onClick={() =>
                        onImageFitChange(focusedPath, zoomImageFit(fit, 1.15))
                      }
                    >
                      <Plus size={14} strokeWidth={2.25} />
                      Zoom +
                    </button>
                    <button
                      type="button"
                      className="edit-panel__btn edit-panel__btn--ghost"
                      title="Reset crop"
                      aria-label="Reset crop"
                      onClick={() => onImageFitChange(focusedPath, DEFAULT_IMAGE_FIT)}
                    >
                      <RotateCcw size={14} strokeWidth={2.25} />
                      Reset crop
                    </button>
                  </>
                )
              })()}
            </div>
          ) : null}
        </>
      ) : (
        <p className="inspector__note">
          Click a person, speaker, panelist, convener, or QR slot to edit photos.
        </p>
      )}
    </div>
  )

  const resetSection = hasSavedEdits ? (
    <button
      key="reset"
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
  ) : null

  // Context-first section order (desktop sidebar + mobile sheet share this).
  let orderedSections
  if (focusMode === 'image') {
    // Logo/brand first; other photo slots first when those are selected.
    orderedSections =
      logoFocused || brandFocused
        ? [
            noteSection,
            brandSection,
            stageFlexSection,
            textSection,
            typographySection,
            themeSection,
            imageSection,
            resetSection,
          ]
        : [
            noteSection,
            imageSection,
            stageFlexSection,
            brandSection,
            textSection,
            typographySection,
            themeSection,
            resetSection,
          ]
  } else if (focusMode === 'text') {
    orderedSections = [
      noteSection,
      textSection,
      stageFlexSection,
      typographySection,
      themeSection,
      brandSection,
      imageSection,
      resetSection,
    ]
  } else {
    // Nothing focused — stage flex + theme first on Flex boards
    orderedSections = [
      noteSection,
      stageFlexSection,
      themeSection,
      typographySection,
      textSection,
      brandSection,
      imageSection,
      resetSection,
    ]
  }

  return (
    <div className="inspector__block edit-panel" data-focus-mode={focusMode}>
      {orderedSections.filter(Boolean)}
    </div>
  )
}
