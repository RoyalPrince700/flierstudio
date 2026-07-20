import { QrCode, Zap } from 'lucide-react'
import { emergence } from '../../../design/emergenceTokens'
import EditableImageSlot from '../../../components/studio/EditableImageSlot'
import EditableText from '../../../components/studio/EditableText'
import { editableTextProps } from '../../../components/studio/editableTextProps'
import './emergence-chrome.css'

export function EmergenceBackground() {
  return (
    <div className="e-bg" aria-hidden>
      <div className="e-bg__image" />
      <div className="e-bg__vignette" />
    </div>
  )
}

export function EmergenceHeader({ event = emergence.event, showZap = true, studioEdit }) {
  const { wordmark, series, theme, capsule } = event

  return (
    <header className="e-header">
      <div className="e-header__brand">
        <EditableText
          as="p"
          className="e-header__wordmark"
          value={wordmark}
          {...editableTextProps(studioEdit, 'event.wordmark')}
        />
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

      <div className="e-header__partners">
        <span className="e-header__partner">CGC</span>
        <span className="e-header__partner e-header__partner--soft">Cloudde</span>
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
            emptyHint="Add QR"
            filledHint="Replace"
            emptyTitle="Click to add QR code image"
            filledTitle="Click to replace QR code"
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

  const frame = (
    <div className={`e-convener__frame${src ? ' e-convener__frame--filled' : ''}`}>
      {src ? (
        <img className="e-convener__img" src={src} alt="" />
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
          onFocusField={studioEdit.onFocusField}
          onPickImage={studioEdit.onPickImage}
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
