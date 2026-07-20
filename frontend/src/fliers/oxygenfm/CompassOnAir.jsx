import { Mic, Radio, Volume2 } from 'lucide-react'
import EditableImageSlot from '../../components/studio/EditableImageSlot'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { gridField, radioshow } from '../../samples/radioshow/tokens'
import './compass-on-air.css'

const PROFILE = '/assets/myimages/royalprinceprofile.png'

/**
 * OxygenFM · The Compass — sample `radioshow-on-air-slab`
 * Full-height black slab bleeding off the left edge (reference silhouette),
 * host portrait + floating audio chips balancing the right column.
 * @param {'portrait' | 'square'} format — 1080×1350 or 1080×1080
 */
export default function CompassOnAir({
  displayLine1 = 'On',
  displayLine2 = 'air',
  hostCredit = 'with Royal Prince on',
  showTitle = 'The Compass',
  tagline = 'The show that gives every career a roadmap.',
  scheduleLine1 = 'Every Wednesday',
  scheduleLine2 = '3pm–4pm',
  cta = 'Tune in live',
  station = 'OxygenFM 96.9',
  photoSrc = PROFILE,
  format = 'portrait',
  width = 1080,
  height = format === 'square' ? 1080 : 1350,
  studioEdit,
}) {
  const t = radioshow
  const editable = Boolean(studioEdit?.enabled)
  const photoPath = 'photoSrc'
  const isSquare = format === 'square'

  return (
    <article
      className={`compass-air${isSquare ? ' compass-air--square' : ''}`}
      style={{
        width,
        height,
        '--rs-blue': t.colors.blue,
        '--rs-orange': t.colors.orange,
        '--rs-green': t.colors.green,
        '--rs-black': t.colors.black,
        '--rs-white': t.colors.white,
        '--rs-display': t.fonts.display,
        '--rs-body': t.fonts.body,
        '--rs-ui': t.fonts.ui,
        '--rs-safe': `${isSquare ? 48 : t.spacing.safe}px`,
        ...gridField(t.colors.blue, t.colors.blueGrid),
      }}
    >
      <div className="compass-air__safe">
        <div className="compass-air__stage">
          <div className="compass-air__copy">
            <h1 className="compass-air__display">
              <span className="compass-air__wrap compass-air__wrap--display">
                <EditableText
                  as="span"
                  value={displayLine1}
                  {...editableTextProps(studioEdit, 'displayLine1')}
                />
              </span>
              <span className="compass-air__wrap compass-air__wrap--display">
                <EditableText
                  as="span"
                  value={displayLine2}
                  {...editableTextProps(studioEdit, 'displayLine2')}
                />
              </span>
            </h1>

            <p className="compass-air__host-credit">
              <span className="compass-air__wrap compass-air__wrap--host">
                <EditableText
                  as="span"
                  value={hostCredit}
                  {...editableTextProps(studioEdit, 'hostCredit')}
                />
              </span>
            </p>

            <p className="compass-air__show">
              <span className="compass-air__wrap compass-air__wrap--show">
                <EditableText
                  as="span"
                  value={showTitle}
                  {...editableTextProps(studioEdit, 'showTitle')}
                />
              </span>
            </p>

            <p className="compass-air__tagline">
              <span className="compass-air__wrap compass-air__wrap--tagline">
                <EditableText
                  as="span"
                  value={tagline}
                  {...editableTextProps(studioEdit, 'tagline')}
                />
              </span>
            </p>

            <p className="compass-air__schedule">
              <span className="compass-air__wrap compass-air__wrap--schedule">
                <EditableText
                  as="span"
                  value={scheduleLine1}
                  {...editableTextProps(studioEdit, 'scheduleLine1')}
                />
              </span>
              <span className="compass-air__wrap compass-air__wrap--schedule">
                <EditableText
                  as="span"
                  value={scheduleLine2}
                  {...editableTextProps(studioEdit, 'scheduleLine2')}
                />
              </span>
            </p>

            <div className="compass-air__cta-row">
              <span className="compass-air__wrap compass-air__wrap--cta">
                <span className="compass-air__cta">
                  <EditableText
                    as="span"
                    value={cta}
                    {...editableTextProps(studioEdit, 'cta')}
                  />
                </span>
              </span>
            </div>

            <div className="compass-air__tail" aria-hidden />
          </div>

          <span
            className="compass-air__chip compass-air__chip--speaker"
            aria-hidden
          >
            <Volume2 size={56} strokeWidth={2.75} />
          </span>

          <div className="compass-air__host">
            <EditableImageSlot
              path={photoPath}
              editable={editable}
              focused={studioEdit?.focusedPath === photoPath}
              hasImage={Boolean(photoSrc)}
              onFocusField={studioEdit?.onFocusField}
              onPickImage={studioEdit?.onPickImage}
              emptyHint="Add host"
              filledHint="Replace"
            >
              <div className="compass-air__portrait">
                {photoSrc ? (
                  <img src={photoSrc} alt="" className="compass-air__photo" />
                ) : (
                  <div className="compass-air__photo-empty" aria-hidden />
                )}
                <span className="compass-air__mic-badge" aria-hidden>
                  <Mic size={30} strokeWidth={2.75} />
                </span>
              </div>
            </EditableImageSlot>
          </div>

          <span className="compass-air__chip compass-air__chip--mic" aria-hidden>
            <Mic size={44} strokeWidth={2.75} />
          </span>
        </div>

        <footer className="compass-air__footer">
          <div className="compass-air__brand">
            <span className="compass-air__brand-mark" aria-hidden>
              <Radio size={34} strokeWidth={2.5} />
            </span>
            <EditableText
              as="span"
              className="compass-air__brand-name"
              value={station}
              {...editableTextProps(studioEdit, 'station')}
            />
          </div>
        </footer>
      </div>
    </article>
  )
}
