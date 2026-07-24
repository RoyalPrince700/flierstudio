import { Gift, Mic, UserRound } from 'lucide-react'
import EditableImageSlot from '../../components/studio/EditableImageSlot'
import EditableText from '../../components/studio/EditableText'
import { editableImageProps } from '../../components/studio/editableImageProps'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { pillArcGallery as t } from './tokens'
import './pill-arc-gallery.css'

const DEFAULT_SPEAKERS = [
  { name: 'Adeniji Abdullahi', photoSrc: '' },
  { name: 'Paul Akinola', photoSrc: '' },
  { name: 'Afunku Mubarak', photoSrc: '' },
  { name: 'Nachristos', photoSrc: '' },
  { name: 'Fawwaz Yahaya', photoSrc: '' },
]

/**
 * Pill Arc Gallery — creative workshop poster
 * Reference: sample/references/pintrest/learn.png
 */
export default function PillArcGalleryFlier({
  width = t.size.width,
  height = t.size.height,
  titlePillA = 'From',
  titleWordA = 'Saturated',
  titlePillB = 'to',
  titleWordB = 'Standing out',
  subtitle = 'learn from masters in the game of creativity, how to build your creative voice.',
  dateLabel = 'Date',
  date = '3rd–4th October, 2026',
  registerLead = 'How fast are you to register',
  registerUrl = 'bit.ly/standout-demo',
  registerNote = 'or click the link attached.',
  incentive = 'most attentive designers wins 30gb data bundle!',
  hostLabel = 'Host',
  poweredBy = 'Powered by',
  brandPill = 'Studio Muk',
  speakers = DEFAULT_SPEAKERS,
  studioEdit,
}) {
  const people = DEFAULT_SPEAKERS.map((fallback, i) => ({
    ...fallback,
    ...(Array.isArray(speakers) ? speakers[i] : null),
  }))
  const hostIndex = 2

  return (
    <article
      className="pa-flier"
      style={{
        width,
        height,
        '--pa-yellow': t.colors.yellow,
        '--pa-yellow-soft': t.colors.yellowSoft,
        '--pa-yellow-glow': t.colors.yellowGlow,
        '--pa-maroon': t.colors.maroon,
        '--pa-maroon-deep': t.colors.maroonDeep,
        '--pa-ink': t.colors.ink,
        '--pa-ink-on-dark': t.colors.inkOnDark,
        '--pa-chip-border': t.colors.chipBorder,
        '--pa-cta-glow': t.colors.ctaGlow,
        '--pa-display': t.fonts.display,
        '--pa-body': t.fonts.body,
      }}
    >
      <div className="pa-flier__top">
        <div className="pa-flier__arc" aria-hidden />

        <h1 className="pa-flier__title">
          <span className="pa-flier__line">
            <em className="pa-flier__chip">
              <EditableText as="span" value={titlePillA} {...editableTextProps(studioEdit, 'titlePillA')} />
            </em>
            <EditableText
              as="span"
              className="pa-flier__word"
              value={titleWordA}
              {...editableTextProps(studioEdit, 'titleWordA')}
            />
          </span>
          <span className="pa-flier__line">
            <em className="pa-flier__chip pa-flier__chip--square">
              <EditableText as="span" value={titlePillB} {...editableTextProps(studioEdit, 'titlePillB')} />
            </em>
            <EditableText
              as="span"
              className="pa-flier__word pa-flier__word--under"
              value={titleWordB}
              {...editableTextProps(studioEdit, 'titleWordB')}
            />
          </span>
        </h1>

        <p className="pa-flier__sub">
          <EditableText as="span" value={subtitle} {...editableTextProps(studioEdit, 'subtitle')} />
        </p>

        <div className="pa-flier__gallery" role="group" aria-label="Speakers">
          {people.map((person, i) => {
            const isHost = i === hostIndex
            const path = `speakers.${i}.photoSrc`
            const src = person.photoSrc || ''
            return (
              <div
                key={i}
                className={`pa-flier__person${isHost ? ' pa-flier__person--host' : ''}`}
                style={{ '--pa-stagger': `${Math.abs(i - hostIndex) * 10}px` }}
              >
                <div className="pa-flier__badge">
                  {isHost ? (
                    <span className="pa-flier__host">
                      <EditableText as="span" value={hostLabel} {...editableTextProps(studioEdit, 'hostLabel')} />
                    </span>
                  ) : (
                    <span className="pa-flier__mic" aria-hidden>
                      <Mic size={14} strokeWidth={2.4} />
                    </span>
                  )}
                </div>
                <div className="pa-flier__frame">
                  <EditableImageSlot {...editableImageProps(studioEdit, path, Boolean(src))}>
                    {src ? (
                      <img className="pa-flier__photo" src={src} alt="" draggable={false} />
                    ) : (
                      <div className="pa-flier__photo-empty">
                        <UserRound strokeWidth={1.6} aria-hidden />
                      </div>
                    )}
                  </EditableImageSlot>
                </div>
                <EditableText
                  as="p"
                  className="pa-flier__name"
                  value={person.name}
                  {...editableTextProps(studioEdit, `speakers.${i}.name`)}
                />
              </div>
            )
          })}
        </div>
      </div>

      <footer className="pa-flier__footer">
        <div className="pa-flier__pattern" aria-hidden />
        <div className="pa-flier__dock">
          <div className="pa-flier__date">
            <EditableText
              as="span"
              className="pa-flier__date-label"
              value={dateLabel}
              {...editableTextProps(studioEdit, 'dateLabel')}
            />
            <EditableText
              as="span"
              className="pa-flier__date-main"
              value={date}
              {...editableTextProps(studioEdit, 'date')}
            />
          </div>

          <div className="pa-flier__cta">
            <EditableText
              as="span"
              className="pa-flier__cta-lead"
              value={registerLead}
              {...editableTextProps(studioEdit, 'registerLead')}
            />
            <EditableText
              as="span"
              className="pa-flier__cta-url"
              value={registerUrl}
              {...editableTextProps(studioEdit, 'registerUrl')}
            />
            <EditableText
              as="span"
              className="pa-flier__cta-note"
              value={registerNote}
              {...editableTextProps(studioEdit, 'registerNote')}
            />
          </div>

          <div className="pa-flier__perk">
            <Gift size={22} strokeWidth={2.2} aria-hidden />
            <EditableText as="span" value={incentive} {...editableTextProps(studioEdit, 'incentive')} />
          </div>
        </div>

        <div className="pa-flier__powered">
          <EditableText as="span" value={poweredBy} {...editableTextProps(studioEdit, 'poweredBy')} />
          <span className="pa-flier__brand-pill">
            <EditableText as="span" value={brandPill} {...editableTextProps(studioEdit, 'brandPill')} />
          </span>
        </div>
      </footer>
    </article>
  )
}
