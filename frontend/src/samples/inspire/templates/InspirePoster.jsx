import { ArrowUpRight } from 'lucide-react'
import {
  ImagePlaceholder,
  LogoPlaceholder,
  PortraitPlaceholder,
} from '../../../components/placeholders'
import EditableImageSlot from '../../../components/studio/EditableImageSlot'
import EditableText from '../../../components/studio/EditableText'
import { editableImageProps } from '../../../components/studio/editableImageProps'
import { editableTextProps } from '../../../components/studio/editableTextProps'
import { applyImageFitStyle, getImageFit } from '../../../lib/imageFit'
import { inspire, inspireDemo } from '../tokens'
import '../inspire.css'

/** Decorative QR stand-in — not a real code; swap via qrSrc in studio. */
function QrFaux() {
  const cells = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
    [0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  ]
  const n = cells.length
  return (
    <svg
      className="sample-inspire__qr-faux"
      viewBox={`0 0 ${n} ${n}`}
      aria-hidden
      role="img"
    >
      <title>QR placeholder</title>
      <rect width={n} height={n} fill="#fff" />
      {cells.map((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0c0c10" /> : null,
        ),
      )}
    </svg>
  )
}

/**
 * Demo recreation for sample `inspire` / template `inspire-poster`.
 * Dark conference poster — purple frames, mint logistics, 2×2 speakers.
 * Placeholders + demo copy only (see PRINCIPLES.md).
 */
export default function InspirePoster({
  leftMark = inspireDemo.leftMark,
  leftLogoSrc = '',
  rightBrand = inspireDemo.rightBrand,
  headlineTop = inspireDemo.headlineTop,
  without = inspireDemo.without,
  headlineBottom = inspireDemo.headlineBottom,
  subhead = inspireDemo.subhead,
  speakersLabel = inspireDemo.speakersLabel,
  speakers = inspireDemo.speakers,
  dateLead = inspireDemo.dateLead,
  dateRest = inspireDemo.dateRest,
  time = inspireDemo.time,
  venue = inspireDemo.venue,
  cta = inspireDemo.cta,
  qrSrc = inspireDemo.qrSrc,
  sponsorsLabel = inspireDemo.sponsorsLabel,
  sponsors = inspireDemo.sponsors,
  width = inspire.size.width,
  height = inspire.size.height,
  studioEdit,
}) {
  const t = inspire
  const editable = Boolean(studioEdit?.enabled)
  const list = Array.isArray(speakers) && speakers.length ? speakers : inspireDemo.speakers
  const sponsorList =
    Array.isArray(sponsors) && sponsors.length ? sponsors : inspireDemo.sponsors

  return (
    <article
      className="sample-inspire"
      style={{
        width,
        height,
        '--in-bg': t.colors.bg,
        '--in-ink': t.colors.ink,
        '--in-ink-muted': t.colors.inkMuted,
        '--in-ink-soft': t.colors.inkSoft,
        '--in-purple': t.colors.purple,
        '--in-purple-deep': t.colors.purpleDeep,
        '--in-purple-soft': t.colors.purpleSoft,
        '--in-purple-blob': t.colors.purpleBlob,
        '--in-mint': t.colors.mint,
        '--in-mint-ink': t.colors.mintInk,
        '--in-mint-ink-soft': t.colors.mintInkSoft,
        '--in-nameplate': t.colors.nameplate,
        '--in-grid': t.colors.gridLine,
        '--in-geo': t.colors.geoStroke,
        '--in-speakers-rail': t.colors.speakersRail,
        '--in-display': t.fonts.display,
        '--in-body': t.fonts.body,
        '--in-safe-x': `${t.spacing.safeX}px`,
        '--in-safe-top': `${t.spacing.safeTop}px`,
        '--in-speakers-gap': `${t.spacing.speakersGap}px`,
        '--in-card-radius': `${t.spacing.cardRadius}px`,
        '--in-badge-rotate': t.effects.badgeRotate,
      }}
    >
      <div className="sample-inspire__bg" aria-hidden>
        <span className="sample-inspire__blob sample-inspire__blob--a" />
        <span className="sample-inspire__blob sample-inspire__blob--b" />
        <span className="sample-inspire__geo sample-inspire__geo--tri" />
        <span className="sample-inspire__geo sample-inspire__geo--sq" />
      </div>

      <div className="sample-inspire__safe">
        <header className="sample-inspire__header">
          <div className="sample-inspire__logo-left">
            <EditableImageSlot
              {...editableImageProps(studioEdit, 'leftLogoSrc', Boolean(leftLogoSrc))}
              enableFit={false}
            >
              <LogoPlaceholder
                src={leftLogoSrc || undefined}
                mark={leftMark}
                width={78}
                height={78}
                alt="Host logo"
              />
            </EditableImageSlot>
          </div>

          <div className="sample-inspire__logo-right">
            <div className="sample-inspire__geo-mark" aria-hidden>
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="sample-inspire__right-brand">
              <EditableText
                as="span"
                value={rightBrand}
                {...editableTextProps(studioEdit, 'rightBrand')}
              />
            </p>
          </div>
        </header>

        <div className="sample-inspire__headline-block">
          <h1 className="sample-inspire__mega">
            <EditableText
              as="span"
              value={headlineTop}
              {...editableTextProps(studioEdit, 'headlineTop')}
            />
          </h1>
          <div className="sample-inspire__badge-row">
            <span className="sample-inspire__badge">
              <EditableText
                as="span"
                value={without}
                {...editableTextProps(studioEdit, 'without')}
              />
            </span>
          </div>
          <p className="sample-inspire__mega">
            <EditableText
              as="span"
              value={headlineBottom}
              {...editableTextProps(studioEdit, 'headlineBottom')}
            />
          </p>
          <p className="sample-inspire__subhead">
            <EditableText
              as="span"
              value={subhead}
              {...editableTextProps(studioEdit, 'subhead')}
            />
          </p>
        </div>

        <section className="sample-inspire__speakers-zone" aria-label="Speakers">
          <div className="sample-inspire__rail">
            <p className="sample-inspire__rail-text">
              <EditableText
                as="span"
                value={speakersLabel}
                {...editableTextProps(studioEdit, 'speakersLabel')}
              />
            </p>
          </div>

          <div className="sample-inspire__grid">
            {list.slice(0, 4).map((speaker, index) => {
              const photoPath = `speakers.${index}.photoSrc`
              const namePath = `speakers.${index}.name`
              const titlePath = `speakers.${index}.title`
              const photoSrc = speaker.photoSrc || ''
              const imageFit = getImageFit(studioEdit?.imageFits, photoPath)
              const imgStyle = photoSrc ? applyImageFitStyle(imageFit) : undefined

              return (
                <article key={`${speaker.name}-${index}`} className="sample-inspire__card">
                  <span className="sample-inspire__card-blob" aria-hidden />
                  <div className="sample-inspire__card-media">
                    <EditableImageSlot
                      {...editableImageProps(studioEdit, photoPath, Boolean(photoSrc))}
                    >
                      {photoSrc ? (
                        <img
                          className="sample-inspire__card-photo"
                          src={photoSrc}
                          alt={speaker.name || ''}
                          style={imgStyle}
                          draggable={false}
                        />
                      ) : (
                        <PortraitPlaceholder
                          width="100%"
                          aspect="1 / 1"
                          shape="rect"
                          variant="flat"
                          accent={t.colors.purple}
                          ink={t.colors.ink}
                          style={{
                            '--ph-surface': 'transparent',
                            '--ph-fill': 'transparent',
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      )}
                    </EditableImageSlot>
                  </div>
                  <div className="sample-inspire__nameplate">
                    <div className="sample-inspire__nameplate-copy">
                      <p className="sample-inspire__speaker-name">
                        <EditableText
                          as="span"
                          value={speaker.name}
                          {...editableTextProps(studioEdit, namePath)}
                        />
                      </p>
                      <p className="sample-inspire__speaker-title">
                        <EditableText
                          as="span"
                          value={speaker.title}
                          {...editableTextProps(studioEdit, titlePath)}
                        />
                      </p>
                    </div>
                    <span className="sample-inspire__chip" aria-hidden>
                      <ArrowUpRight strokeWidth={2.5} />
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="sample-inspire__logistics" aria-label="Event details">
          <p className="sample-inspire__date">
            <span className="sample-inspire__date-lead">
              <EditableText
                as="span"
                value={dateLead}
                {...editableTextProps(studioEdit, 'dateLead')}
              />
            </span>{' '}
            <EditableText
              as="span"
              value={dateRest}
              {...editableTextProps(studioEdit, 'dateRest')}
            />
          </p>
          <span className="sample-inspire__divider" aria-hidden />
          <p className="sample-inspire__time">
            <EditableText as="span" value={time} {...editableTextProps(studioEdit, 'time')} />
          </p>
          <div className="sample-inspire__venue-block">
            <p className="sample-inspire__venue">
              <EditableText as="span" value={venue} {...editableTextProps(studioEdit, 'venue')} />
            </p>
            <p className="sample-inspire__cta">
              <EditableText as="span" value={cta} {...editableTextProps(studioEdit, 'cta')} />
            </p>
          </div>
          <div className="sample-inspire__qr">
            <EditableImageSlot
              {...editableImageProps(studioEdit, 'qrSrc', Boolean(qrSrc))}
              enableFit={false}
            >
              {qrSrc ? (
                <ImagePlaceholder
                  src={qrSrc}
                  label="QR"
                  width={118}
                  height={118}
                  aspect="1 / 1"
                  radius={0}
                  showLabel={false}
                  style={{
                    '--ph-surface': '#ffffff',
                    '--ph-ink': '#1a1a1e',
                  }}
                />
              ) : (
                <QrFaux />
              )}
            </EditableImageSlot>
          </div>
        </section>

        <footer className="sample-inspire__sponsors">
          <p className="sample-inspire__sponsors-label">
            <EditableText
              as="span"
              value={sponsorsLabel}
              {...editableTextProps(studioEdit, 'sponsorsLabel')}
            />
          </p>
          <div className="sample-inspire__sponsors-row">
            {sponsorList.slice(0, 4).map((sponsor, index) => {
              const srcPath = `sponsors.${index}.src`
              const markPath = `sponsors.${index}.mark`
              const src = sponsor.src || ''
              return (
                <div key={`${sponsor.mark}-${index}`} className="sample-inspire__sponsor-slot">
                  <EditableImageSlot
                    {...editableImageProps(studioEdit, srcPath, Boolean(src))}
                    enableFit={false}
                  >
                    {src ? (
                      <LogoPlaceholder src={src} mark={sponsor.mark} width={120} height={36} />
                    ) : (
                      <LogoPlaceholder mark={sponsor.mark || 'LOGO'} width={120} height={36} />
                    )}
                  </EditableImageSlot>
                  {editable ? (
                    <span className="sr-only">
                      <EditableText
                        as="span"
                        value={sponsor.mark}
                        {...editableTextProps(studioEdit, markPath)}
                      />
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </footer>

        <div className="sample-inspire__bottom-bar" aria-hidden />
      </div>
    </article>
  )
}
