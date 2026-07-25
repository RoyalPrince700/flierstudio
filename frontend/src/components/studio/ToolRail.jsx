import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  CopyPlus,
  Download,
  Hand,
  ImagePlus,
  LayoutGrid,
  Layers,
  Maximize2,
  Minus,
  Moon,
  MousePointer2,
  MoveHorizontal,
  Palette,
  Pencil,
  Plus,
  RotateCcw,
  Scaling,
  Scan,
  Sparkles,
  Sun,
  Trash2,
  Type,
  Upload,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { LiftoffMark } from '../../fliers/flier-studio/FSLogo'
import { fsTokens } from '../../design/flierStudioTokens'
import {
  DEFAULT_EMERGENCE_COLOR_THEME,
  EMERGENCE_COLOR_THEMES,
} from '../../design/emergenceThemes'
import { FONT_CATALOG, fontIdByStack, fontStackById } from '../../design/fontCatalog'
import { normalizeLogoMode } from '../../design/defaultBrandLogo'
import {
  STAGE_PEOPLE_MAX,
  STAGE_PEOPLE_MIN,
  clampStagePeopleCount,
} from '../../fliers/emergence/stagePeopleLayout'
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
  isLogoImagePath,
  nudgeLogoLayout,
  scaleLogoLayout,
} from '../../lib/logoLayout'
import { HD_SCALES } from '../../lib/exportFlier'
import { getByPath } from '../../lib/flierDraft'
import { isImagePath } from './editFocus'
import ExportProgress from './ExportProgress'
import LayerThumb from './LayerThumb'

const TOOLS = [
  { id: 'select', label: 'Move / Select (V)', dockLabel: 'Select', icon: MousePointer2 },
  { id: 'text', label: 'Text (T)', dockLabel: 'Text', icon: Type },
  { id: 'hand', label: 'Hand / Pan (H)', dockLabel: 'Hand', icon: Hand },
]

const ACTIONS = [
  { id: 'zoomIn', label: 'Zoom in (+)', dockLabel: 'Zoom in', icon: ZoomIn, phoneHide: false },
  { id: 'zoomOut', label: 'Zoom out (-)', dockLabel: 'Zoom out', icon: ZoomOut, phoneHide: false },
  { id: 'fit', label: 'Fit to screen (Ctrl+0)', dockLabel: 'Fit', icon: Maximize2, phoneHide: false },
  { id: 'zoom100', label: 'Zoom 100% (Ctrl+1)', dockLabel: '100%', icon: Scaling, phoneHide: true },
]

const ALIGN_OPTIONS = [
  { id: 'left', label: 'Left', icon: AlignLeft },
  { id: 'center', label: 'Center', icon: AlignCenter },
  { id: 'right', label: 'Right', icon: AlignRight },
  { id: 'justify', label: 'Justify', icon: AlignJustify },
]

const PEOPLE_COUNTS = Array.from(
  { length: STAGE_PEOPLE_MAX - STAGE_PEOPLE_MIN + 1 },
  (_, i) => STAGE_PEOPLE_MIN + i,
)

// TEMP: desktop device-mode scroll aids — remove after real-phone QA
const TEMP_DOCK_SCROLL_CHUNK = 160

function ToolBtnLabel({ children }) {
  return <span className="tool-btn__label">{children}</span>
}

function shortLayerName(name) {
  const s = String(name || 'Board').trim() || 'Board'
  return s.length > 10 ? `${s.slice(0, 9)}…` : s
}

// TEMP: desktop device-mode scroll aids — remove after real-phone QA
function useTempDockScroll(resetKey) {
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const overflow = max > 2
    setCanScrollLeft(overflow && el.scrollLeft > 2)
    setCanScrollRight(overflow && el.scrollLeft < max - 2)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.scrollLeft = 0
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollState) : null
    ro?.observe(el)
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro?.disconnect()
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, resetKey])

  const scrollByChunk = useCallback((dir) => {
    trackRef.current?.scrollBy({ left: dir * TEMP_DOCK_SCROLL_CHUNK, behavior: 'smooth' })
  }, [])

  return { trackRef, canScrollLeft, canScrollRight, scrollByChunk }
}

function DockBackButton({ onClick, label = 'Back' }) {
  return (
    <button
      type="button"
      className="tool-btn tool-btn--dock-back"
      title="Back"
      aria-label={label}
      onClick={onClick}
    >
      <ArrowLeft size={18} strokeWidth={2} />
      <ToolBtnLabel>Back</ToolBtnLabel>
    </button>
  )
}

function CapCutStrip({ children, ariaLabel }) {
  return (
    <div className="tool-rail__strip" role="toolbar" aria-label={ariaLabel}>
      <div className="tool-rail__strip-track">{children}</div>
    </div>
  )
}

function DockChip({
  id,
  dockLabel,
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
  children,
  className = '',
}) {
  return (
    <button
      type="button"
      className={`tool-btn${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
      disabled={disabled}
      data-tour={id ? `edit-menu-${id}` : undefined}
      onClick={onClick}
    >
      {children || (Icon ? <Icon size={18} strokeWidth={2} /> : null)}
      <ToolBtnLabel>{dockLabel}</ToolBtnLabel>
    </button>
  )
}

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
  exportError = '',
  onToggleInspector,
  onOpenEditMenu,
  onDockBack,
  /** Phone CapCut dock: 'main' | 'edit-menu' | 'layers' | 'themes' | 'fonts' | 'logo' | 'export-options' */
  dockMode = 'main',
  onEditMenuSelect,
  inspectorOpen = false,
  highlightTool = null,
  /** Layers mode */
  layers = [],
  selectedLayerId = null,
  onSelectLayer,
  onDuplicateLayer,
  onDeleteLayer,
  canDeleteLayer = true,
  /** Edit features — same handlers as EditPanel / Inspector */
  editContent = null,
  focusedPath = null,
  focusedKind = null,
  onEditChange,
  onFocusField,
  onPickImage,
  onClearImage,
  onImageFitChange,
  onLogoLayoutChange,
  onAlignChange,
  onResetDraft,
  onUseTextLogo,
  onUseImageLogo,
  onRestoreDefaultLogo,
  hasSavedEdits = false,
  /** Export options row */
  format = 'png',
  hdScaleId = '3x',
  onFormatChange,
  onHdScaleChange,
  onCopySize,
  exportWidth = 0,
  exportHeight = 0,
}) {
  const ThemeIcon = theme === 'dark' ? Sun : Moon
  const themeLabel = theme === 'dark' ? 'Light mode' : 'Dark mode'
  const { trackRef, canScrollLeft, canScrollRight, scrollByChunk } = useTempDockScroll(dockMode)

  const [dockStrip, setDockStrip] = useState(null)
  const [fontRole, setFontRole] = useState('display')

  useEffect(() => {
    setDockStrip(null)
    setFontRole('display')
  }, [dockMode])

  const inSubmenu = dockMode !== 'main'
  const showEditEntry = Boolean(onOpenEditMenu || onToggleInspector)
  const editEntryActive = dockMode !== 'main' || inspectorOpen

  const isEmergence = editContent?.kind === 'emergence'
  const imageFocused = focusedKind === 'image' || isImagePath(focusedPath)
  const logoFocused = imageFocused && isLogoImagePath(focusedPath)
  const textFocused = Boolean(focusedPath) && !imageFocused
  const wordmarkFocused = focusedPath === 'event.wordmark' || focusedPath === 'wordmark'
  const colorTheme = isEmergence
    ? editContent.colorTheme || DEFAULT_EMERGENCE_COLOR_THEME
    : null
  const fonts = editContent?.fonts || {}
  const displayId = fontIdByStack(fonts.display) || (isEmergence ? 'orbitron' : 'bebas')
  const bodyId = fontIdByStack(fonts.body) || (isEmergence ? 'manrope' : 'dm-sans')
  const activeFontId = fontRole === 'body' ? bodyId : displayId
  const logoMode = isEmergence ? normalizeLogoMode(editContent.event?.logoMode) : 'image'
  const logoSrcValue = isEmergence ? editContent.event?.logoSrc : editContent?.logoSrc
  const hasLogoImage = logoMode === 'image' && Boolean(String(logoSrcValue || '').trim())
  const logoLayout = clampLogoLayout(
    isEmergence ? editContent?.event?.logoLayout : editContent?.logoLayout,
  )
  const stageCount = isEmergence
    ? clampStagePeopleCount(editContent.stagePeopleCount)
    : STAGE_PEOPLE_MIN
  const includeConvener = isEmergence ? editContent.includeConvener !== false : true
  const showSpeakerStageBg = isEmergence ? editContent.showSpeakerStageBg !== false : true
  const currentAlign = focusedPath ? editContent?.alignments?.[focusedPath] || '' : ''
  const focusedImageSrc = useMemo(() => {
    if (!editContent || !focusedPath || !imageFocused || logoFocused) return ''
    const value = isEmergence
      ? getByPath(editContent, focusedPath)
      : getByPath(editContent.fields, focusedPath)
    return typeof value === 'string' ? value : ''
  }, [editContent, focusedPath, imageFocused, isEmergence, logoFocused])

  const photoFit = useMemo(
    () => getImageFit(editContent?.imageFits, focusedPath),
    [editContent?.imageFits, focusedPath],
  )

  const hdScale = HD_SCALES[hdScaleId]?.scale ?? 3
  const outW = exportWidth ? exportWidth * hdScale : 0
  const outH = exportHeight ? exportHeight * hdScale : 0

  function toggleStrip(id) {
    setDockStrip((s) => (s === id ? null : id))
  }

  function patchLogo(next) {
    onLogoLayoutChange?.(clampLogoLayout(next))
  }

  /** Single CapCut edit options row — no nested “Edit” screen. */
  const editMenuChips = useMemo(() => {
    const chips = []
    const photoContext = imageFocused && focusedPath && !logoFocused

    chips.push({
      id: 'layers',
      dockLabel: 'Layers',
      label: 'Layers',
      icon: Layers,
      onClick: () => onEditMenuSelect?.('layers'),
    })

    if (isEmergence) {
      chips.push({
        id: 'theme',
        dockLabel: 'Theme',
        label: 'Color theme',
        icon: Palette,
        onClick: () => onEditMenuSelect?.('theme'),
      })
    }

    chips.push({
      id: 'fonts',
      dockLabel: 'Fonts',
      label: 'Typography',
      icon: Type,
      disabled: !editContent,
      onClick: () => onEditMenuSelect?.('fonts'),
    })

    if (isEmergence) {
      chips.push({
        id: 'logo',
        dockLabel: 'Logo',
        label: 'Logo options',
        icon: ImagePlus,
        onClick: () => onEditMenuSelect?.('logo'),
      })
      if (!photoContext) {
        chips.push({
          id: 'upload',
          dockLabel: 'Upload',
          label: 'Upload logo',
          icon: Upload,
          onClick: () => {
            onFocusField?.('event.logoSrc', 'image')
            onPickImage?.('event.logoSrc')
          },
        })
      }
    }

    if (textFocused) {
      chips.push({
        id: 'align',
        dockLabel: 'Align',
        label: 'Text alignment',
        icon: AlignLeft,
        active: dockStrip === 'align',
        onClick: () => toggleStrip('align'),
      })
    }

    if (photoContext) {
      chips.push({
        id: 'photo',
        dockLabel: focusedImageSrc ? 'Replace' : 'Photo',
        label: focusedImageSrc ? 'Replace photo' : 'Add photo',
        icon: Upload,
        onClick: () => onPickImage?.(focusedPath),
      })
      if (focusedImageSrc) {
        chips.push({
          id: 'clear-photo',
          dockLabel: 'Clear',
          label: 'Clear photo',
          icon: X,
          onClick: () => onClearImage?.(focusedPath),
        })
        chips.push({
          id: 'crop',
          dockLabel: 'Crop',
          label: 'Photo crop zoom',
          icon: MoveHorizontal,
          active: dockStrip === 'crop',
          onClick: () => toggleStrip('crop'),
        })
      }
    }

    if (isEmergence && editContent?.stageFlex) {
      chips.push({
        id: 'people',
        dockLabel: 'People',
        label: 'People on stage',
        icon: Users,
        active: dockStrip === 'people',
        onClick: () => toggleStrip('people'),
      })
      // TEMP: hide on Cascade Flex Updated until convener edit is finished (allowConvener).
      if (editContent.allowConvener !== false) {
        chips.push({
          id: 'convener',
          dockLabel: 'Convener',
          label: 'Include convener column',
          icon: Users,
          active: includeConvener,
          onClick: () => onEditChange?.('includeConvener', !includeConvener),
        })
      }
      chips.push({
        id: 'stage-bg',
        dockLabel: 'Stage BG',
        label: 'Speaker stage background',
        icon: LayoutGrid,
        active: showSpeakerStageBg,
        onClick: () => onEditChange?.('showSpeakerStageBg', !showSpeakerStageBg),
      })
    }

    chips.push({
      id: 'export',
      dockLabel: 'Export',
      label: 'Export',
      icon: Download,
      onClick: () => onEditMenuSelect?.('export'),
    })

    if (hasSavedEdits) {
      chips.push({
        id: 'reset',
        dockLabel: 'Reset',
        label: 'Reset artboard edits',
        icon: RotateCcw,
        onClick: () => {
          if (window.confirm('Reset this artboard only to its defaults?')) {
            onResetDraft?.()
          }
        },
      })
    }

    return chips
  }, [
    dockStrip,
    editContent,
    focusedImageSrc,
    focusedPath,
    hasSavedEdits,
    imageFocused,
    includeConvener,
    showSpeakerStageBg,
    isEmergence,
    logoFocused,
    onClearImage,
    onEditChange,
    onEditMenuSelect,
    onFocusField,
    onPickImage,
    onResetDraft,
    textFocused,
  ])

  const logoActionChips = useMemo(() => {
    if (!isEmergence) return []
    const chips = [
      {
        id: 'logo-image',
        dockLabel: 'Image',
        label: 'Image logo',
        icon: ImagePlus,
        active: logoMode === 'image' && dockStrip !== 'logo-layout',
        onClick: () => onUseImageLogo?.(),
      },
      {
        id: 'logo-text',
        dockLabel: 'Text',
        label: 'Text logo',
        icon: Type,
        active: logoMode === 'text',
        onClick: () => {
          onUseTextLogo?.()
          onFocusField?.('event.wordmark', 'text')
        },
      },
      {
        id: 'logo-default',
        dockLabel: 'Default',
        label: 'Restore Flier Studio logo',
        icon: Sparkles,
        onClick: () => onRestoreDefaultLogo?.(),
      },
    ]
    if (hasLogoImage) {
      chips.push({
        id: 'logo-clear',
        dockLabel: 'Clear',
        label: 'Clear logo',
        icon: X,
        onClick: () => onClearImage?.('event.logoSrc'),
      })
      chips.push({
        id: 'logo-layout',
        dockLabel: 'Layout',
        label: 'Logo size and position',
        icon: MoveHorizontal,
        active: dockStrip === 'logo-layout',
        onClick: () => toggleStrip('logo-layout'),
      })
    }
    if (logoMode === 'text') {
      chips.push({
        id: 'wordmark',
        dockLabel: 'Edit',
        label: 'Edit text logo',
        icon: Pencil,
        active: wordmarkFocused,
        onClick: () => onFocusField?.('event.wordmark', 'text'),
      })
    }
    return chips
  }, [
    dockStrip,
    hasLogoImage,
    isEmergence,
    logoMode,
    onClearImage,
    onFocusField,
    onRestoreDefaultLogo,
    onUseImageLogo,
    onUseTextLogo,
    wordmarkFocused,
  ])

  function handleEditEntryClick() {
    if (onOpenEditMenu) onOpenEditMenu()
    else onToggleInspector?.()
  }

  function handleDockBack() {
    if (dockStrip) {
      setDockStrip(null)
      return
    }
    onDockBack?.()
  }

  const railClass = [
    'tool-rail',
    inSubmenu ? 'tool-rail--submenu' : '',
    dockMode === 'edit-menu' ? 'tool-rail--edit-menu' : '',
    dockMode === 'layers' ? 'tool-rail--layers' : '',
    dockMode === 'themes' ? 'tool-rail--themes' : '',
    dockMode === 'fonts' ? 'tool-rail--fonts' : '',
    dockMode === 'logo' ? 'tool-rail--logo' : '',
    dockMode === 'export-options' ? 'tool-rail--export-options' : '',
    dockStrip ? 'tool-rail--has-strip' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={railClass} aria-label={inSubmenu ? 'Edit dock' : 'Tools'}>
      {dockMode === 'export-options' && exportError ? (
        <div className="tool-rail__strip tool-rail__strip--error" role="status">
          <span className="tool-rail__export-error">{exportError}</span>
        </div>
      ) : null}

      {dockStrip === 'align' && textFocused ? (
        <CapCutStrip ariaLabel="Text alignment">
          {ALIGN_OPTIONS.map(({ id, label, icon: Icon }) => {
            const active = currentAlign === id
            return (
              <button
                key={id}
                type="button"
                className={`tool-rail__strip-chip${active ? ' is-active' : ''}`}
                title={label}
                aria-label={label}
                aria-pressed={active}
                onClick={() => onAlignChange?.(focusedPath, id)}
              >
                <Icon size={16} strokeWidth={2.25} />
                <span className="tool-rail__strip-label">{label}</span>
              </button>
            )
          })}
        </CapCutStrip>
      ) : null}

      {dockStrip === 'crop' && imageFocused && focusedPath && !logoFocused && focusedImageSrc ? (
        <CapCutStrip ariaLabel="Photo crop">
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Zoom out"
            aria-label="Zoom out"
            disabled={photoFit.scale <= IMAGE_FIT_MIN_SCALE + 0.001}
            onClick={() => onImageFitChange?.(focusedPath, zoomImageFit(photoFit, 1 / 1.15))}
          >
            <Minus size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Zoom −</span>
          </button>
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Zoom in"
            aria-label="Zoom in"
            disabled={photoFit.scale >= IMAGE_FIT_MAX_SCALE - 0.001}
            onClick={() => onImageFitChange?.(focusedPath, zoomImageFit(photoFit, 1.15))}
          >
            <Plus size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Zoom +</span>
          </button>
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Reset crop"
            aria-label="Reset crop"
            onClick={() => onImageFitChange?.(focusedPath, DEFAULT_IMAGE_FIT)}
          >
            <RotateCcw size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Reset</span>
          </button>
        </CapCutStrip>
      ) : null}

      {dockStrip === 'logo-layout' && hasLogoImage && onLogoLayoutChange ? (
        <CapCutStrip ariaLabel="Logo layout">
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Size −"
            aria-label="Logo size down"
            disabled={logoLayout.scale <= LOGO_SCALE_MIN + 0.001}
            onClick={() => patchLogo(scaleLogoLayout(logoLayout, 1 / LOGO_SCALE_STEP))}
          >
            <Minus size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Size −</span>
          </button>
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Size +"
            aria-label="Logo size up"
            disabled={logoLayout.scale >= LOGO_SCALE_MAX - 0.001}
            onClick={() => patchLogo(scaleLogoLayout(logoLayout, LOGO_SCALE_STEP))}
          >
            <Plus size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Size +</span>
          </button>
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Nudge left"
            aria-label="Nudge logo left"
            disabled={logoLayout.offsetX <= LOGO_OFFSET_X_MIN + 0.001}
            onClick={() => patchLogo(nudgeLogoLayout(logoLayout, -LOGO_NUDGE_X))}
          >
            <ChevronLeft size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Left</span>
          </button>
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Nudge right"
            aria-label="Nudge logo right"
            disabled={logoLayout.offsetX >= LOGO_OFFSET_X_MAX - 0.001}
            onClick={() => patchLogo(nudgeLogoLayout(logoLayout, LOGO_NUDGE_X))}
          >
            <ChevronRight size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Right</span>
          </button>
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Nudge up"
            aria-label="Nudge logo up"
            disabled={logoLayout.offsetY <= LOGO_OFFSET_Y_MIN + 0.001}
            onClick={() => patchLogo(nudgeLogoLayout(logoLayout, 0, -LOGO_NUDGE_Y))}
          >
            <ArrowUp size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Up</span>
          </button>
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Nudge down"
            aria-label="Nudge logo down"
            disabled={logoLayout.offsetY >= LOGO_OFFSET_Y_MAX - 0.001}
            onClick={() => patchLogo(nudgeLogoLayout(logoLayout, 0, LOGO_NUDGE_Y))}
          >
            <ArrowDown size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Down</span>
          </button>
          <button
            type="button"
            className="tool-rail__strip-chip"
            title="Reset layout"
            aria-label="Reset logo layout"
            onClick={() => patchLogo(DEFAULT_LOGO_LAYOUT)}
          >
            <RotateCcw size={16} strokeWidth={2.25} />
            <span className="tool-rail__strip-label">Reset</span>
          </button>
        </CapCutStrip>
      ) : null}

      {dockStrip === 'people' && isEmergence && editContent?.stageFlex ? (
        <CapCutStrip ariaLabel="People on stage">
          {PEOPLE_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              className={`tool-rail__strip-chip${stageCount === n ? ' is-active' : ''}`}
              title={`${n} people`}
              aria-label={`${n} people on stage`}
              aria-pressed={stageCount === n}
              onClick={() => onEditChange?.('stagePeopleCount', n)}
            >
              <Users size={14} strokeWidth={2.25} />
              <span className="tool-rail__strip-label">{n}</span>
            </button>
          ))}
        </CapCutStrip>
      ) : null}

      {/* TEMP: desktop device-mode scroll aids — remove after real-phone QA */}
      <button
        type="button"
        className="tool-rail__scroll-btn tool-rail__scroll-btn--prev"
        title="TEMP: scroll tools left (device-mode aid)"
        aria-label="Scroll tools left"
        disabled={!canScrollLeft}
        onClick={() => scrollByChunk(-1)}
      >
        <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
      </button>

      <div className="tool-rail__track" ref={trackRef}>
        {dockMode === 'edit-menu' ? (
          <>
            <DockBackButton onClick={handleDockBack} label="Back to tools" />
            <div className="tool-rail__divider" />
            <div className="tool-rail__group tool-rail__group--edit-menu" data-tour="edit-menu">
              {editMenuChips.map((chip) => (
                <DockChip key={chip.id} {...chip} />
              ))}
            </div>
          </>
        ) : null}

        {dockMode === 'themes' ? (
          <>
            <DockBackButton onClick={handleDockBack} label="Back to edit menu" />
            <div className="tool-rail__divider" />
            {isEmergence ? (
              <div
                className="tool-rail__group tool-rail__group--themes"
                data-tour="themes-dock"
                role="listbox"
                aria-label="Color theme"
              >
                {EMERGENCE_COLOR_THEMES.map((t) => {
                  const active = colorTheme === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="option"
                      className={`tool-btn tool-btn--theme${active ? ' is-active' : ''}`}
                      title={t.label}
                      aria-label={t.label}
                      aria-selected={active}
                      aria-pressed={active}
                      onClick={() => onEditChange?.('colorTheme', t.id)}
                    >
                      <span className="tool-rail__theme-swatch" aria-hidden>
                        {t.swatch.map((hex) => (
                          <span key={hex} style={{ background: hex }} />
                        ))}
                      </span>
                      <ToolBtnLabel>{t.label}</ToolBtnLabel>
                    </button>
                  )
                })}
              </div>
            ) : (
              <span className="tool-rail__empty">Themes for Emergence only</span>
            )}
          </>
        ) : null}

        {dockMode === 'fonts' ? (
          <>
            <DockBackButton onClick={handleDockBack} label="Back to edit menu" />
            <div className="tool-rail__divider" />
            <div className="tool-rail__group tool-rail__group--fonts" data-tour="fonts-dock">
              <div className="tool-rail__strip-seg" role="group" aria-label="Font role">
                <button
                  type="button"
                  className={fontRole === 'display' ? 'is-active' : ''}
                  aria-pressed={fontRole === 'display'}
                  onClick={() => setFontRole('display')}
                >
                  Display
                </button>
                <button
                  type="button"
                  className={fontRole === 'body' ? 'is-active' : ''}
                  aria-pressed={fontRole === 'body'}
                  onClick={() => setFontRole('body')}
                >
                  Body
                </button>
              </div>
              {FONT_CATALOG.map((font) => {
                const active = activeFontId === font.id
                return (
                  <button
                    key={font.id}
                    type="button"
                    className={`tool-btn tool-btn--font${active ? ' is-active' : ''}`}
                    title={font.label}
                    aria-label={font.label}
                    aria-pressed={active}
                    onClick={() =>
                      onEditChange?.(
                        fontRole === 'body' ? 'fonts.body' : 'fonts.display',
                        fontStackById(font.id),
                      )
                    }
                  >
                    <ToolBtnLabel>
                      <span style={{ fontFamily: font.stack }}>{font.label}</span>
                    </ToolBtnLabel>
                  </button>
                )
              })}
            </div>
          </>
        ) : null}

        {dockMode === 'logo' ? (
          <>
            <DockBackButton onClick={handleDockBack} label="Back to edit menu" />
            <div className="tool-rail__divider" />
            {isEmergence ? (
              <div className="tool-rail__group tool-rail__group--logo" data-tour="logo-dock">
                {logoActionChips.map((chip) => (
                  <DockChip key={chip.id} {...chip} />
                ))}
              </div>
            ) : (
              <span className="tool-rail__empty">Logo for Emergence only</span>
            )}
          </>
        ) : null}

        {dockMode === 'layers' ? (
          <>
            <DockBackButton onClick={handleDockBack} label="Back to edit menu" />
            <div className="tool-rail__divider" />
            <div className="tool-rail__group tool-rail__group--layers" data-tour="layers-dock">
              {layers.length === 0 ? (
                <span className="tool-rail__empty">No layers</span>
              ) : (
                layers.map((item) => {
                  const active = item.id === selectedLayerId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`tool-btn tool-btn--layer${active ? ' is-active' : ''}`}
                      title={item.name}
                      aria-label={item.name}
                      aria-pressed={active}
                      onClick={() => onSelectLayer?.(item.id)}
                    >
                      <LayerThumb item={item} active={active} size="md" />
                      <ToolBtnLabel>{shortLayerName(item.name)}</ToolBtnLabel>
                    </button>
                  )
                })
              )}
            </div>
            {selectedLayerId ? (
              <>
                <div className="tool-rail__divider" />
                <div className="tool-rail__group tool-rail__group--layer-actions">
                  <button
                    type="button"
                    className="tool-btn"
                    title="Duplicate layer"
                    aria-label="Duplicate layer"
                    onClick={() => onDuplicateLayer?.(selectedLayerId)}
                  >
                    <CopyPlus size={18} strokeWidth={2} />
                    <ToolBtnLabel>Duplicate</ToolBtnLabel>
                  </button>
                  <button
                    type="button"
                    className="tool-btn"
                    title="Delete layer"
                    aria-label="Delete layer"
                    disabled={!canDeleteLayer}
                    onClick={() => onDeleteLayer?.(selectedLayerId)}
                  >
                    <Trash2 size={18} strokeWidth={2} />
                    <ToolBtnLabel>Delete</ToolBtnLabel>
                  </button>
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {dockMode === 'export-options' ? (
          <>
            <DockBackButton onClick={handleDockBack} label="Back to edit menu" />
            <div className="tool-rail__divider" />
            <div className="tool-rail__group tool-rail__group--export" data-tour="export-dock">
              {['png', 'jpg'].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  className={`tool-btn${format === fmt ? ' is-active' : ''}`}
                  title={fmt.toUpperCase()}
                  aria-label={fmt.toUpperCase()}
                  aria-pressed={format === fmt}
                  onClick={() => onFormatChange?.(fmt)}
                >
                  <Download size={18} strokeWidth={2} />
                  <ToolBtnLabel>{fmt.toUpperCase()}</ToolBtnLabel>
                </button>
              ))}
              {Object.values(HD_SCALES).map((scale) => (
                <button
                  key={scale.id}
                  type="button"
                  className={`tool-btn${hdScaleId === scale.id ? ' is-active' : ''}`}
                  title={scale.label}
                  aria-label={scale.label}
                  aria-pressed={hdScaleId === scale.id}
                  onClick={() => onHdScaleChange?.(scale.id)}
                >
                  <Maximize2 size={18} strokeWidth={2} />
                  <ToolBtnLabel>{scale.id}</ToolBtnLabel>
                </button>
              ))}
              {outW && outH ? (
                <span className="tool-rail__export-size" title={`${outW}×${outH}`}>
                  {outW}×{outH}
                </span>
              ) : null}
              <button
                type="button"
                className="tool-btn"
                title="Copy artboard size"
                aria-label="Copy artboard size"
                disabled={!exportWidth}
                onClick={onCopySize}
              >
                <Copy size={18} strokeWidth={2} />
                <ToolBtnLabel>Copy</ToolBtnLabel>
              </button>
              <button
                type="button"
                className={`tool-btn tool-btn--accent tool-btn--export${busy ? ' is-busy' : ''}`}
                title={busy ? exportLabel : 'Download flier'}
                aria-label={busy ? exportLabel : 'Download flier'}
                aria-busy={busy || undefined}
                disabled={!canExport || busy}
                onClick={onExport}
              >
                {busy ? (
                  <>
                    <Download size={18} strokeWidth={2.25} aria-hidden />
                    <ToolBtnLabel>Export</ToolBtnLabel>
                    <ExportProgress progress={exportProgress} label={exportLabel} compact />
                  </>
                ) : (
                  <>
                    <Download size={18} strokeWidth={2.25} />
                    <ToolBtnLabel>Download</ToolBtnLabel>
                  </>
                )}
              </button>
            </div>
          </>
        ) : null}

        {dockMode === 'main' ? (
          <>
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
                <ToolBtnLabel>Templates</ToolBtnLabel>
              </button>
              {showEditEntry ? (
                <button
                  type="button"
                  className={`tool-btn tool-btn--mobile-panel${editEntryActive ? ' is-active' : ''}`}
                  title="Open layers, edit & export"
                  aria-label="Open layers, edit and export"
                  aria-pressed={editEntryActive}
                  data-tour="panel"
                  onClick={handleEditEntryClick}
                >
                  <Layers size={18} strokeWidth={2} />
                  <ToolBtnLabel>Edit</ToolBtnLabel>
                </button>
              ) : null}
            </div>

            <div className="tool-rail__divider" />

            <div className="tool-rail__group" data-tour="tools">
              {TOOLS.map(({ id, label, dockLabel, icon: Icon }) => (
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
                  <ToolBtnLabel>{dockLabel}</ToolBtnLabel>
                </button>
              ))}
            </div>

            <div className="tool-rail__divider" />

            <div className="tool-rail__group tool-rail__group--zoom">
              {ACTIONS.map(({ id, label, dockLabel, icon: Icon, phoneHide }) => (
                <button
                  key={id}
                  type="button"
                  className={`tool-btn${phoneHide ? ' tool-btn--phone-hide' : ''}`}
                  title={label}
                  aria-label={label}
                  onClick={() => onAction(id)}
                >
                  <Icon size={18} strokeWidth={2} />
                  <ToolBtnLabel>{dockLabel}</ToolBtnLabel>
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
                <ToolBtnLabel>Labels</ToolBtnLabel>
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
                <ToolBtnLabel>Grid</ToolBtnLabel>
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
              <ToolBtnLabel>Theme</ToolBtnLabel>
            </button>

            <button
              type="button"
              className={`tool-btn tool-btn--accent tool-btn--export${busy ? ' is-busy' : ''}`}
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
                  <ToolBtnLabel>Export</ToolBtnLabel>
                  <ExportProgress progress={exportProgress} label={exportLabel} compact />
                </>
              ) : (
                <>
                  <Download size={18} strokeWidth={2.25} />
                  <ToolBtnLabel>Export</ToolBtnLabel>
                </>
              )}
            </button>
          </>
        ) : null}
      </div>

      {/* TEMP: desktop device-mode scroll aids — remove after real-phone QA */}
      <button
        type="button"
        className="tool-rail__scroll-btn tool-rail__scroll-btn--next"
        title="TEMP: scroll tools right (device-mode aid)"
        aria-label="Scroll tools right"
        disabled={!canScrollRight}
        onClick={() => scrollByChunk(1)}
      >
        <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
      </button>
    </aside>
  )
}
