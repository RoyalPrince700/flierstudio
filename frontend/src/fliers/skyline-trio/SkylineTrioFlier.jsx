import {
  BadgeCheck,
  CalendarDays,
  Clock,
  Mail,
  Phone,
  UserRound,
  Video,
} from 'lucide-react'
import { LogoPlaceholder } from '../../components/placeholders'
import EditableImageSlot from '../../components/studio/EditableImageSlot'
import EditableText from '../../components/studio/EditableText'
import { editableImageProps } from '../../components/studio/editableImageProps'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { skylineTrio as t } from './tokens'
import './skyline-trio.css'

const DEFAULT_SPEAKERS = [
  {
    name: 'Daniel Oluwasusi',
    title: 'CEO, Dacom Digitals, Data analytics consultant',
    photoSrc: '',
  },
  {
    name: 'Oluwaseun Osunmakinde',
    title: 'CEO, ArcByte Digital Ltd.',
    photoSrc: '',
  },
  {
    name: 'Comfort Fatorisa',
    title: 'Community manager, Dacom Digitals',
    photoSrc: '',
  },
]

function AfricaOutline() {
  return (
    <svg className="st-flier__africa-svg" viewBox="0 0 240 280" fill="none" aria-hidden>
      <path
        d="M118 18 C 98 22, 88 38, 82 58 C 76 72, 68 78, 58 88 C 48 98, 42 112, 38 128 C 34 148, 28 162, 22 178 C 16 198, 18 218, 28 232 C 38 248, 52 258, 68 264 C 82 268, 96 272, 108 278 C 118 282, 128 278, 138 268 C 148 258, 158 248, 168 238 C 178 228, 188 218, 192 204 C 196 188, 198 172, 200 156 C 202 138, 204 122, 200 106 C 196 90, 188 76, 178 64 C 168 52, 156 42, 142 34 C 132 28, 124 20, 118 18 Z M 92 118 C 88 128, 86 140, 88 152 C 90 162, 96 170, 104 176 C 112 182, 122 184, 132 182 C 142 180, 150 174, 154 164 C 158 154, 156 142, 150 132 C 144 122, 134 116, 122 114 C 110 112, 98 108, 92 118 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PortraitPill({ person, index, studioEdit }) {
  const path = `speakers.${index}.photoSrc`
  const src = person.photoSrc || ''

  return (
    <div className="st-flier__person">
      <div className="st-flier__pill">
        <EditableImageSlot {...editableImageProps(studioEdit, path, Boolean(src))}>
          {src ? (
            <img className="st-flier__photo" src={src} alt="" draggable={false} />
          ) : (
            <div className="st-flier__photo-empty">
              <UserRound strokeWidth={1.5} aria-hidden />
            </div>
          )}
        </EditableImageSlot>
        <span className="st-flier__verified" aria-hidden>
          <BadgeCheck size={20} strokeWidth={2.4} />
        </span>
      </div>
      <EditableText
        as="p"
        className="st-flier__name"
        value={person.name}
        {...editableTextProps(studioEdit, `speakers.${index}.name`)}
      />
      <EditableText
        as="p"
        className="st-flier__role"
        value={person.title}
        {...editableTextProps(studioEdit, `speakers.${index}.title`)}
      />
    </div>
  )
}

/**
 * Skyline Trio — DACOM Digitals digital webinar poster
 * Reference: sample/references/pintrest/digital.png
 * Intent: Who is speaking, and when/where do I join?
 */
export default function SkylineTrioFlier({
  width = t.size.width,
  height = t.size.height,
  logoSrc = '',
  brandName = 'DACOM Digitals',
  headlineLine1 = "Harnessing Africa's",
  headlineLine2 = 'Digital Goldmine',
  subtitle = 'The Future of Data Analytics, Opportunities, and Challenges',
  date = '4th April, 2026',
  venue = 'Meeting holds Online (Zoom)',
  zone1 = '7pm Nigerian and Cameroon time',
  zone2 = '8pm Zambia time',
  zone3 = '6pm Ghana time',
  handle = 'Dacom digitals',
  email = 'dacomdigitals@gmail.com',
  phone = '+234 911 357 8740',
  speakers = DEFAULT_SPEAKERS,
  studioEdit,
}) {
  const people = DEFAULT_SPEAKERS.map((fallback, i) => ({
    ...fallback,
    ...(Array.isArray(speakers) ? speakers[i] : null),
  }))

  return (
    <article
      className="st-flier"
      style={{
        width,
        height,
        '--st-navy-top': t.colors.navyTop,
        '--st-navy-mid': t.colors.navyMid,
        '--st-navy-deep': t.colors.navyDeep,
        '--st-cyan': t.colors.cyan,
        '--st-cyan-bright': t.colors.cyanBright,
        '--st-cyan-soft': t.colors.cyanSoft,
        '--st-cyan-glow': t.colors.cyanGlow,
        '--st-ink': t.colors.ink,
        '--st-ink-muted': t.colors.inkMuted,
        '--st-footer': t.colors.footer,
        '--st-footer-ink': t.colors.footerInk,
        '--st-cube-top': t.colors.cubeTop,
        '--st-cube-face': t.colors.cubeFace,
        '--st-cube-shadow': t.colors.cubeShadow,
        '--st-display': t.fonts.display,
        '--st-body': t.fonts.body,
        '--st-safe-x': `${t.spacing.safeX}px`,
        '--st-safe-top': `${t.spacing.safeTop}px`,
      }}
    >
      <div className="st-flier__glow" aria-hidden />
      <div className="st-flier__grid" aria-hidden />

      <div className="st-flier__atmosphere" aria-hidden>
        <AfricaOutline />
        <div className="st-flier__skyline">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
      </div>

      <div className="st-flier__decor" aria-hidden>
        <div className="st-flier__chart">
          <svg viewBox="0 0 180 100" fill="none">
            <path
              d="M6 82 C 24 74, 34 58, 50 52 C 68 44, 78 62, 96 44 C 112 30, 128 22, 172 10"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="52" r="5.5" fill="currentColor" />
            <circle cx="96" cy="44" r="5.5" fill="currentColor" />
            <circle cx="172" cy="10" r="5.5" fill="currentColor" />
          </svg>
        </div>
        <div className="st-flier__cubes">
          <span className="st-flier__cube st-flier__cube--1" />
          <span className="st-flier__cube st-flier__cube--2" />
          <span className="st-flier__cube st-flier__cube--3" />
        </div>
      </div>

      <header className="st-flier__header">
        <div className="st-flier__brand">
          <EditableImageSlot {...editableImageProps(studioEdit, 'logoSrc', Boolean(logoSrc))}>
            <LogoPlaceholder
              src={logoSrc || undefined}
              mark="DD"
              width={52}
              height={52}
              shape="circle"
              style={{
                '--ph-surface': 'linear-gradient(145deg, var(--st-cyan-bright), var(--st-cyan))',
                '--ph-ink': '#031018',
                '--ph-border': '0',
              }}
            />
          </EditableImageSlot>
          <EditableText as="span" value={brandName} {...editableTextProps(studioEdit, 'brandName')} />
        </div>
      </header>

      <div className="st-flier__hero">
        <h1 className="st-flier__title">
          <EditableText as="span" value={headlineLine1} {...editableTextProps(studioEdit, 'headlineLine1')} />
          <EditableText as="span" value={headlineLine2} {...editableTextProps(studioEdit, 'headlineLine2')} />
        </h1>
        <p className="st-flier__sub">
          <EditableText as="span" value={subtitle} {...editableTextProps(studioEdit, 'subtitle')} />
        </p>
      </div>

      <div className="st-flier__gallery" role="group" aria-label="Speakers">
        {people.map((person, i) => (
          <PortraitPill key={i} person={person} index={i} studioEdit={studioEdit} />
        ))}
      </div>

      <div className="st-flier__meta">
        <div className="st-flier__meta-row">
          <div className="st-flier__meta-item">
            <CalendarDays size={24} strokeWidth={2} aria-hidden />
            <EditableText as="span" value={date} {...editableTextProps(studioEdit, 'date')} />
          </div>
          <span className="st-flier__rule" aria-hidden />
          <div className="st-flier__meta-item st-flier__meta-item--venue">
            <span className="st-flier__meet-badge" aria-hidden>
              <Video size={16} strokeWidth={2.4} />
            </span>
            <EditableText as="span" value={venue} {...editableTextProps(studioEdit, 'venue')} />
          </div>
        </div>

        <div className="st-flier__zones">
          <Clock size={22} strokeWidth={2} aria-hidden />
          <EditableText as="span" className="st-flier__zone" value={zone1} {...editableTextProps(studioEdit, 'zone1')} />
          <span className="st-flier__rule" aria-hidden />
          <EditableText as="span" className="st-flier__zone" value={zone2} {...editableTextProps(studioEdit, 'zone2')} />
          <span className="st-flier__rule" aria-hidden />
          <EditableText as="span" className="st-flier__zone" value={zone3} {...editableTextProps(studioEdit, 'zone3')} />
        </div>
      </div>

      <footer className="st-flier__footer">
        <span className="st-flier__social">
          <span className="st-flier__social-mark st-flier__social-mark--fb" aria-hidden>
            f
          </span>
          <span className="st-flier__social-mark st-flier__social-mark--ig" aria-hidden />
          <EditableText as="span" value={handle} {...editableTextProps(studioEdit, 'handle')} />
        </span>
        <span className="st-flier__contact">
          <Mail size={16} strokeWidth={2} aria-hidden />
          <EditableText as="span" value={email} {...editableTextProps(studioEdit, 'email')} />
        </span>
        <span className="st-flier__contact">
          <Phone size={16} strokeWidth={2} aria-hidden />
          <EditableText as="span" value={phone} {...editableTextProps(studioEdit, 'phone')} />
        </span>
      </footer>
    </article>
  )
}
