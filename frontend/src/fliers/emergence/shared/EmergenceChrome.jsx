import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Plus, QrCode, Sparkles, Type, Zap } from 'lucide-react'
import {
  normalizeLogoMode,
  resolveBrandLogoSrc,
} from '../../../design/defaultBrandLogo'
import { emergence } from '../../../design/emergenceTokens'
import EditableImageSlot from '../../../components/studio/EditableImageSlot'
import EditableText from '../../../components/studio/EditableText'
import { editableTextProps } from '../../../components/studio/editableTextProps'
import { applyImageFitStyle, getImageFit } from '../../../lib/imageFit'
import {
  clampLogoLayout,
  DEFAULT_LOGO_LAYOUT,
  logoLayoutCssVars,
} from '../../../lib/logoLayout'
import './emergence-chrome.css'

export function EmergenceBackground() {
  return (
    <div className="e-bg" aria-hidden>
      <div className="e-bg__image" />
      <div className="e-bg__vignette" />
    </div>
  )
}

function BrandChooser({ open, onClose, onUpload, onFlierStudio, onText }) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) onClose?.()
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('pointerdown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={rootRef}
      className="e-header__brand-chooser"
      data-studio-chrome
      role="menu"
      aria-label="Add brand mark"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button type="button" role="menuitem" onClick={onUpload}>
        <ImagePlus size={14} strokeWidth={2.25} />
        Upload logo
      </button>
      <button type="button" role="menuitem" onClick={onFlierStudio}>
        <Sparkles size={14} strokeWidth={2.25} />
        Use Flier Studio logo
      </button>
      <button type="button" role="menuitem" onClick={onText}>
        <Type size={14} strokeWidth={2.25} />
        Use text logo
      </button>
    </div>
  )
}

function BrandMark({ event, studioEdit }) {
  const logoPath = 'event.logoSrc'
  const wordmarkPath = 'event.wordmark'
  const logoMode = normalizeLogoMode(event.logoMode)
  const logoSrc = resolveBrandLogoSrc(event.logoSrc, logoMode)
  const hasLogoImage = logoMode === 'image' && Boolean(logoSrc)
  const logoLayout = clampLogoLayout(event.logoLayout || DEFAULT_LOGO_LAYOUT)
  const logoVars = logoLayoutCssVars(logoLayout)
  const editable = Boolean(studioEdit?.enabled)
  const focusedPath = studioEdit?.focusedPath
  const [chooserOpen, setChooserOpen] = useState(false)

  const openChooser = () => {
    studioEdit?.onFocusField?.(logoPath, 'image')
    setChooserOpen(true)
  }

  const useTextLogo = () => {
    setChooserOpen(false)
    studioEdit?.onUseTextLogo?.()
  }

  const useFlierStudio = () => {
    setChooserOpen(false)
    studioEdit?.onRestoreDefaultLogo?.()
  }

  const uploadLogo = () => {
    setChooserOpen(false)
    studioEdit?.onPickImage?.(logoPath)
  }

  if (logoMode === 'text') {
    const textFocused = focusedPath === wordmarkPath
    return (
      <div className="e-header__logo-slot e-header__logo-slot--text" style={logoVars}>
        <EditableText
          as="p"
          className="e-header__wordmark"
          value={event.wordmark || 'EMERGE'}
          {...editableTextProps(studioEdit, wordmarkPath)}
        />
        {editable && textFocused ? (
          <div
            className="e-header__wordmark-chrome"
            data-studio-chrome
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="e-header__wordmark-chrome-btn"
              onClick={() => studioEdit?.onUseImageLogo?.()}
            >
              <ImagePlus size={12} strokeWidth={2.5} />
              Image logo
            </button>
            <button
              type="button"
              className="e-header__wordmark-chrome-btn"
              onClick={useFlierStudio}
            >
              <Sparkles size={12} strokeWidth={2.5} />
              Flier Studio
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  if (hasLogoImage) {
    const logoFrame = (
      <div className="e-header__logo" style={logoVars}>
        <img className="e-header__logo-img" src={logoSrc} alt="" draggable={false} />
      </div>
    )

    if (!editable) return logoFrame

    return (
      <EditableImageSlot
        className="e-header__logo-slot"
        path={logoPath}
        editable
        focused={focusedPath === logoPath}
        hasImage
        variant="logo"
        logoLayout={logoLayout}
        onLogoLayoutChange={studioEdit.onLogoLayoutChange}
        onFocusField={studioEdit.onFocusField}
        onPickImage={studioEdit.onPickImage}
        onClearImage={studioEdit.onClearImage}
        onUseTextLogo={useTextLogo}
        onRestoreDefaultLogo={useFlierStudio}
        enableFit={false}
        emptyHint="Add brand"
        filledHint="Select"
        emptyTitle="Add brand mark"
        filledTitle="Click to select · size and nudge in chrome"
      >
        {logoFrame}
      </EditableImageSlot>
    )
  }

  // Empty brand (none) — edit-only hit target with explicit recovery
  if (!editable) return null

  return (
    <div
      className={`e-header__logo-slot e-header__brand-empty${focusedPath === logoPath ? ' is-focused' : ''}`}
      data-edit-path={logoPath}
      data-studio-chrome
      style={logoVars}
    >
      <button
        type="button"
        className="e-header__brand-add"
        onPointerDown={(e) => {
          e.stopPropagation()
          studioEdit?.onFocusField?.(logoPath, 'image')
        }}
        onClick={(e) => {
          e.stopPropagation()
          openChooser()
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        Add brand
      </button>
      <BrandChooser
        open={chooserOpen}
        onClose={() => setChooserOpen(false)}
        onUpload={uploadLogo}
        onFlierStudio={useFlierStudio}
        onText={useTextLogo}
      />
    </div>
  )
}

export function EmergenceHeader({ event = emergence.event, showZap = true, studioEdit }) {
  const { series, theme, capsule } = event
  const logoMode = normalizeLogoMode(event.logoMode)
  const logoLayout = clampLogoLayout(event.logoLayout || DEFAULT_LOGO_LAYOUT)
  const logoVars =
    logoMode === 'image' ? logoLayoutCssVars(logoLayout) : logoLayoutCssVars(DEFAULT_LOGO_LAYOUT)

  return (
    <header className="e-header" style={logoVars}>
      <div className="e-header__brand">
        <BrandMark event={event} studioEdit={studioEdit} />
        <EditableText
          as="p"
          className="e-header__series"
          value={series}
          {...editableTextProps(studioEdit, 'event.series')}
        />
      </div>

      <div className="e-header__theme">
        <EditableText
          as="span"
          className="e-header__theme-text"
          value={theme}
          {...editableTextProps(studioEdit, 'event.theme')}
        />
        <EditableText
          as="span"
          className="e-header__capsule"
          value={capsule}
          {...editableTextProps(studioEdit, 'event.capsule')}
        />
        {showZap ? <Zap className="e-header__zap" strokeWidth={2.25} /> : null}
      </div>

      <div className="e-header__mark" aria-hidden>
        <span className="e-header__mark-orbit" />
        <span className="e-header__mark-wing e-header__mark-wing--a" />
        <span className="e-header__mark-wing e-header__mark-wing--b" />
        <span className="e-header__mark-core" />
        <span className="e-header__mark-slash" />
        <span className="e-header__mark-spark" />
      </div>
    </header>
  )
}


function FooterMotif() {
  return (
    <div className="e-footer__motif" aria-hidden>
      <span className="e-footer__shape e-footer__shape--clover" />
      <span className="e-footer__shape e-footer__shape--plus" />
      <span className="e-footer__shape e-footer__shape--bloom" />
      <span className="e-footer__shape e-footer__shape--arc" />
    </div>
  )
}

function MetaStack({ main, note, mainPath, notePath, studioEdit }) {
  return (
    <div className="e-footer__stack">
      <EditableText
        as="p"
        className="e-footer__stack-main"
        value={main}
        {...editableTextProps(studioEdit, mainPath)}
      />
      <EditableText
        as="p"
        className="e-footer__stack-sub"
        value={note}
        {...editableTextProps(studioEdit, notePath)}
      />
    </div>
  )
}

export function EmergenceFooter({ event = emergence.event, compact = false, studioEdit }) {
  const {
    city,
    venue,
    time,
    timeNote = 'PROMPT',
    date,
    dateNote = 'AUGUST 2026',
    ticketLabel = 'Get Ticket:',
    url,
    qrSrc = '',
  } = event
  const editable = Boolean(studioEdit?.enabled)
  const qrPath = 'event.qrSrc'
  const focusedPath = studioEdit?.focusedPath

  const qrBox = (
    <div className={`e-footer__qr-box${qrSrc ? ' e-footer__qr-box--filled' : ''}`}>
      {qrSrc ? (
        <img className="e-footer__qr-img" src={qrSrc} alt="" />
      ) : (
        <div className="e-footer__qr-empty">
          <QrCode className="e-footer__qr-icon" strokeWidth={1.75} aria-hidden />
          <span>QR CODE</span>
        </div>
      )}
    </div>
  )

  return (
    <footer className={`e-footer${compact ? ' e-footer--compact' : ''}`}>
      <div className="e-footer__logistics">
        <div className="e-footer__place">
          <EditableText
            as="p"
            className="e-footer__city"
            value={city}
            {...editableTextProps(studioEdit, 'event.city')}
          />
          <EditableText
            as="p"
            className="e-footer__venue"
            value={venue}
            {...editableTextProps(studioEdit, 'event.venue')}
          />
        </div>

        <span className="e-footer__sep" aria-hidden />

        <MetaStack
          main={time}
          note={timeNote}
          mainPath="event.time"
          notePath="event.timeNote"
          studioEdit={studioEdit}
        />

        <MetaStack
          main={date}
          note={dateNote}
          mainPath="event.date"
          notePath="event.dateNote"
          studioEdit={studioEdit}
        />
      </div>

      <FooterMotif />

      <div className="e-footer__qr">
        {editable ? (
          <EditableImageSlot
            path={qrPath}
            editable
            focused={focusedPath === qrPath}
            hasImage={Boolean(qrSrc)}
            onFocusField={studioEdit.onFocusField}
            onPickImage={studioEdit.onPickImage}
            onClearImage={studioEdit.onClearImage}
            enableFit={false}
            emptyHint="Add QR"
            filledHint="Select"
            emptyTitle="Click to add QR code image"
            filledTitle="Click to select · then Replace or Remove"
          >
            {qrBox}
          </EditableImageSlot>
        ) : (
          qrBox
        )}
        <p className="e-footer__ticket">
          <EditableText
            as="span"
            className="e-footer__ticket-label"
            value={ticketLabel}
            {...editableTextProps(studioEdit, 'event.ticketLabel')}
          />{' '}
          <EditableText
            as="span"
            className="e-footer__url"
            value={url}
            {...editableTextProps(studioEdit, 'event.url')}
          />
        </p>
      </div>
    </footer>
  )
}

export function KeywordStrip({ event = emergence.event, studioEdit }) {
  const keywords = event.keywords || []

  return (
    <div className="e-keywords">
      {keywords.map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 ? <span className="e-keywords__sep">·</span> : null}
          <EditableText
            as="span"
            value={word}
            {...editableTextProps(studioEdit, `event.keywords.${i}`)}
          />
        </span>
      ))}
    </div>
  )
}

export function ConvenerSlot({
  className = '',
  label = emergence.event.convenerLabel,
  src = '',
  studioEdit,
}) {
  const editable = Boolean(studioEdit?.enabled)
  const focusedPath = studioEdit?.focusedPath
  const photoPath = 'convener.photoSrc'
  const imageFit = getImageFit(studioEdit?.imageFits, photoPath)
  const imgStyle = src ? applyImageFitStyle(imageFit) : undefined

  const frame = (
    <div className={`e-convener__frame${src ? ' e-convener__frame--filled' : ''}`}>
      {src ? (
        <img
          className="e-convener__img"
          src={src}
          alt=""
          style={imgStyle}
          draggable={false}
        />
      ) : (
        <div className="e-convener__empty">
          <span>SPEAKER / CONVENER IMAGE</span>
        </div>
      )}
    </div>
  )

  return (
    <div className={`e-convener ${className}`.trim()}>
      {editable ? (
        <EditableImageSlot
          path={photoPath}
          editable
          focused={focusedPath === photoPath}
          hasImage={Boolean(src)}
          imageFit={imageFit}
          onFocusField={studioEdit.onFocusField}
          onPickImage={studioEdit.onPickImage}
          onClearImage={studioEdit.onClearImage}
          onImageFitChange={studioEdit.onImageFitChange}
        >
          {frame}
        </EditableImageSlot>
      ) : (
        frame
      )}
      <EditableText
        as="p"
        className="e-convener__label"
        value={label}
        {...editableTextProps(studioEdit, 'convener.label')}
      />
    </div>
  )
}
