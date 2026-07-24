import { CalendarDays, MessageCircle, Send, UserRound } from 'lucide-react'
import EditableImageSlot from '../../components/studio/EditableImageSlot'
import EditableText from '../../components/studio/EditableText'
import { editableImageProps } from '../../components/studio/editableImageProps'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { offerQuintet as t } from './tokens'
import './offer-quintet.css'

const DEFAULT_SPEAKERS = [
  {
    name: 'Mbata Rejoice',
    title: 'Personal growth coach / Founder, Joyce Writers Academy',
    photoSrc: '',
  },
  { name: 'Harrison Prince', title: 'Founder / CEO Height', photoSrc: '' },
  {
    name: 'Grace Harrison',
    title: 'Personal development and identity coach / Content writer',
    photoSrc: '',
  },
  {
    name: 'Iheanacho Victor',
    title: 'Creative Brand designer / Brand Strategist',
    photoSrc: '',
  },
  {
    name: 'Toria Dickson',
    title: 'Founder, ToriaX Marketing Agency / COO, Tokicard',
    photoSrc: '',
  },
]

function SpeakerCard({ person, index, isHost, hostLabel, studioEdit }) {
  const path = `speakers.${index}.photoSrc`
  const src = person.photoSrc || ''

  return (
    <article className="oq-flier__card">
      <div className="oq-flier__photo-wrap">
        <EditableImageSlot {...editableImageProps(studioEdit, path, Boolean(src))}>
          {src ? (
            <img className="oq-flier__photo" src={src} alt="" draggable={false} />
          ) : (
            <div className="oq-flier__photo-empty">
              <UserRound strokeWidth={1.6} aria-hidden />
            </div>
          )}
        </EditableImageSlot>
        {isHost ? (
          <span className="oq-flier__host">
            <EditableText as="span" value={hostLabel} {...editableTextProps(studioEdit, 'hostLabel')} />
          </span>
        ) : null}
      </div>
      <div className="oq-flier__card-body">
        <EditableText
          as="p"
          className="oq-flier__name"
          value={person.name}
          {...editableTextProps(studioEdit, `speakers.${index}.name`)}
        />
        <EditableText
          as="p"
          className="oq-flier__role"
          value={person.title}
          {...editableTextProps(studioEdit, `speakers.${index}.title`)}
        />
      </div>
    </article>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  )
}

/**
 * Offer Quintet — Learn & Earn workshop poster
 * Reference: sample/references/pintrest/earn.png
 * Intent: Who is teaching this Learn & Earn session, and what does access cost?
 */
export default function OfferQuintetFlier({
  width = t.size.width,
  height = t.size.height,
  present = 'JOYCE WRITERS ACADEMY PRESENT',
  titleLead = 'Learn &',
  titleMega = 'earn',
  versionBadge = '1.0',
  titleYear = '2026',
  ctaLabel = 'JOIN NOW',
  tagline = 'Turn your words into income.',
  speakersLabel = 'SPEAKERS',
  hostLabel = 'Host',
  telegramLabel = 'TELEGRAM',
  date = '1ST - 29TH FEB. 2026',
  feeLabel = 'ACCESS FEE',
  priceWas = 'N9999',
  priceNow = 'N4999',
  footerWhatsapp = '09067872844',
  footerSocial = 'Mbata Rejoice',
  speakers = DEFAULT_SPEAKERS,
  studioEdit,
}) {
  const people = DEFAULT_SPEAKERS.map((fallback, i) => ({
    ...fallback,
    ...(Array.isArray(speakers) ? speakers[i] : null),
  }))
  const row1 = people.slice(0, 3)
  const row2 = people.slice(3, 5)

  return (
    <article
      className="oq-flier"
      style={{
        width,
        height,
        '--oq-cream': t.colors.cream,
        '--oq-cream-deep': t.colors.creamDeep,
        '--oq-orange': t.colors.orange,
        '--oq-orange-deep': t.colors.orangeDeep,
        '--oq-orange-mid': t.colors.orangeMid,
        '--oq-brown': t.colors.brown,
        '--oq-brown-soft': t.colors.brownSoft,
        '--oq-card': t.colors.card,
        '--oq-card-border': t.colors.cardBorder,
        '--oq-ink': t.colors.ink,
        '--oq-ink-on-orange': t.colors.inkOnOrange,
        '--oq-host-red': t.colors.hostRed,
        '--oq-paper': t.colors.paper,
        '--oq-gold-light': t.colors.goldLight,
        '--oq-gold-mid': t.colors.goldMid,
        '--oq-gold-deep': t.colors.goldDeep,
        '--oq-display': t.fonts.display,
        '--oq-body': t.fonts.body,
        '--oq-script': t.fonts.script,
      }}
    >
      <div className="oq-flier__papers" aria-hidden>
        <span className="oq-flier__paper oq-flier__paper--tr" />
        <span className="oq-flier__paper oq-flier__paper--ml" />
      </div>

      <p className="oq-flier__present">
        <EditableText as="span" value={present} {...editableTextProps(studioEdit, 'present')} />
      </p>

      <div className="oq-flier__hero">
        <div className="oq-flier__title-stack">
          <EditableText
            as="span"
            className="oq-flier__title-lead"
            value={titleLead}
            {...editableTextProps(studioEdit, 'titleLead')}
          />
          <span className="oq-flier__earn-row">
            <EditableText
              as="span"
              className="oq-flier__earn"
              value={titleMega}
              {...editableTextProps(studioEdit, 'titleMega')}
            />
            <em className="oq-flier__badge">
              <EditableText as="span" value={versionBadge} {...editableTextProps(studioEdit, 'versionBadge')} />
            </em>
          </span>
          <span className="oq-flier__year-wrap">
            <EditableText
              as="span"
              className="oq-flier__year"
              value={titleYear}
              {...editableTextProps(studioEdit, 'titleYear')}
            />
            <span className="oq-flier__swoosh" aria-hidden />
          </span>
        </div>

        <div className="oq-flier__action">
          <EditableText
            as="span"
            className="oq-flier__join"
            value={ctaLabel}
            {...editableTextProps(studioEdit, 'ctaLabel')}
          />
          <span className="oq-flier__bubble">
            <EditableText as="span" value={tagline} {...editableTextProps(studioEdit, 'tagline')} />
          </span>
        </div>
      </div>

      <div className="oq-flier__speakers-head">
        <span className="oq-flier__rule" aria-hidden />
        <EditableText
          as="span"
          className="oq-flier__speakers-label"
          value={speakersLabel}
          {...editableTextProps(studioEdit, 'speakersLabel')}
        />
        <span className="oq-flier__rule" aria-hidden />
      </div>

      <div className="oq-flier__grid" role="group" aria-label="Speakers">
        <div className="oq-flier__row oq-flier__row--3">
          {row1.map((person, i) => (
            <SpeakerCard
              key={person.name}
              person={person}
              index={i}
              isHost={i === 0}
              hostLabel={hostLabel}
              studioEdit={studioEdit}
            />
          ))}
        </div>
        <div className="oq-flier__row oq-flier__row--2">
          {row2.map((person, i) => (
            <SpeakerCard
              key={person.name}
              person={person}
              index={i + 3}
              isHost={false}
              hostLabel={hostLabel}
              studioEdit={studioEdit}
            />
          ))}
        </div>
      </div>

      <div className="oq-flier__lower">
        <div className="oq-flier__meta-block">
          <div className="oq-flier__meta-line">
            <Send size={22} strokeWidth={2.4} aria-hidden />
            <EditableText as="span" value={telegramLabel} {...editableTextProps(studioEdit, 'telegramLabel')} />
          </div>
          <div className="oq-flier__meta-line">
            <CalendarDays size={22} strokeWidth={2.4} aria-hidden />
            <EditableText as="span" value={date} {...editableTextProps(studioEdit, 'date')} />
          </div>
          <div className="oq-flier__fee">
            <EditableText
              as="span"
              className="oq-flier__fee-label"
              value={feeLabel}
              {...editableTextProps(studioEdit, 'feeLabel')}
            />
            <div className="oq-flier__fee-blob">
              <EditableText
                as="span"
                className="oq-flier__fee-was"
                value={priceWas}
                {...editableTextProps(studioEdit, 'priceWas')}
              />
              <EditableText
                as="span"
                className="oq-flier__fee-now"
                value={priceNow}
                {...editableTextProps(studioEdit, 'priceNow')}
              />
            </div>
          </div>
        </div>

        <div className="oq-flier__chess" aria-hidden>
          <span className="oq-flier__chess-glow" />
          <span className="oq-flier__chess-piece" />
        </div>
      </div>

      <footer className="oq-flier__footer">
        <span className="oq-flier__contact">
          <MessageCircle size={18} strokeWidth={2.4} aria-hidden />
          <EditableText as="span" value={footerWhatsapp} {...editableTextProps(studioEdit, 'footerWhatsapp')} />
        </span>
        <span className="oq-flier__contact">
          <FacebookIcon />
          <EditableText as="span" value={footerSocial} {...editableTextProps(studioEdit, 'footerSocial')} />
        </span>
      </footer>
    </article>
  )
}
