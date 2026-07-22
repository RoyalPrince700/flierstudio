import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { fsTokens } from '../../design/flierStudioTokens'
import BoardShell from './BoardShell'
import { LiftoffMark, LogoHorizontal } from './FSLogo'
import './fs-boards.css'

const C = fsTokens.colors

/* ------------------------------------------------------------------ */
/* 07 — Primary brand color                                            */
/* ------------------------------------------------------------------ */
export function FSPrimaryColorBoard({
  headline = 'Signal.',
  support = 'The color of posters, warnings, and things worth stopping for. In a feed of safe blues, Signal is Flier Studio’s hand in the air — used sparingly, at full strength, always with intent.',
  studioEdit,
}) {
  return (
    <BoardShell index="07" chapter="Color" theme="signal">
      <div className="fs-prime">
        <div className="fs-prime__specs">
          <span className="fsb-label fs-prime__spec">HEX FF4A1D</span>
          <span className="fsb-label fs-prime__spec">RGB 255 · 74 · 29</span>
          <span className="fsb-label fs-prime__spec">CMYK 0 · 71 · 89 · 0</span>
          <span className="fsb-label fs-prime__spec">PANTONE 172 C</span>
        </div>
        <EditableText
          as="h1"
          className="fs-prime__name"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fs-prime__support"
          value={support}
          {...editableTextProps(studioEdit, 'support')}
        />
        <div className="fs-prime__mark">
          <LiftoffMark size={132} base={C.ink} corner={C.paper} />
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 08 — Complete palette                                               */
/* ------------------------------------------------------------------ */
const PALETTE = [
  { name: 'Signal', hex: '#FF4A1D', role: 'Primary · display, accents, CTA', ink: C.ink, big: true },
  { name: 'Ink', hex: '#141310', role: 'Text · dark grounds', ink: C.paper, big: true },
  { name: 'Paper', hex: '#F5F1E8', role: 'Light grounds', ink: C.ink, big: true, border: true },
  { name: 'Cobalt', hex: '#2545D9', role: 'Secondary · links, info', ink: '#fff' },
  { name: 'Signal Deep', hex: '#C93007', role: 'Pressed · small text on paper', ink: '#fff' },
  { name: 'Graphite', hex: '#26241F', role: 'Surfaces on ink', ink: C.paper },
  { name: 'Stone', hex: '#8F8A7E', role: 'Muted text', ink: C.ink },
  { name: 'Mist', hex: '#E4DED2', role: 'Hairlines', ink: C.ink },
]

const SEMANTIC = [
  { name: 'Success', hex: '#1E9E6A' },
  { name: 'Warning', hex: '#D98E04' },
  { name: 'Danger', hex: '#D64530' },
  { name: 'Info', hex: '#2545D9' },
]

export function FSPaletteBoard({
  headline = 'A poster palette, not a dashboard palette.',
  note = 'Warm neutrals keep the system feeling printed, not corporate. Signal on Ink passes AA (5.5:1); body text on Paper is always Ink (15.9:1); Signal on Paper is display-only (3:1 — 24 px bold and up). White on Cobalt passes AA at 7.2:1.',
  studioEdit,
}) {
  return (
    <BoardShell index="08" chapter="Palette">
      <div className="fs-pal">
        <EditableText
          as="h1"
          className="fsb-display fs-pal__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-pal__grid">
          {PALETTE.map((c) => (
            <div
              key={c.name}
              className={`fs-pal__chip ${c.big ? 'fs-pal__chip--big' : ''}`}
              style={{
                background: c.hex,
                color: c.ink,
                boxShadow: c.border ? `inset 0 0 0 1.5px ${C.mist}` : 'none',
              }}
            >
              <span className="fs-pal__chip-name">{c.name}</span>
              <span className="fs-pal__chip-meta">
                {c.hex.toUpperCase()}
                <em>{c.role}</em>
              </span>
            </div>
          ))}
        </div>
        <div className="fs-pal__bottom">
          <div className="fs-pal__semantic">
            <p className="fsb-label">Semantic — product UI only</p>
            <div className="fs-pal__sem-row">
              {SEMANTIC.map((s) => (
                <div key={s.name} className="fs-pal__sem">
                  <span className="fs-pal__sem-dot" style={{ background: s.hex }} />
                  <span>{s.name}</span>
                  <code>{s.hex.toUpperCase()}</code>
                </div>
              ))}
            </div>
          </div>
          <EditableText
            as="p"
            className="fs-pal__note"
            value={note}
            {...editableTextProps(studioEdit, 'note')}
          />
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 09 — Logo on brand colors                                           */
/* ------------------------------------------------------------------ */
export function FSLogoOnColorBoard({
  headline = 'The mark holds on every ground.',
  studioEdit,
}) {
  const cells = [
    { bg: C.paper, base: C.ink, corner: C.signal, text: C.ink, label: 'On Paper — full color' },
    { bg: C.ink, base: C.paper, corner: C.signal, text: C.paper, label: 'On Ink — reversed' },
    { bg: C.signal, base: C.ink, corner: C.paper, text: C.ink, label: 'On Signal — ink + paper' },
    { bg: C.cobalt, base: C.white, corner: C.white, text: C.white, label: 'On Cobalt — one-color white' },
  ]
  return (
    <BoardShell index="09" chapter="Color + logo">
      <div className="fs-onc">
        <EditableText
          as="h1"
          className="fsb-display fs-onc__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-onc__grid">
          {cells.map((cell) => (
            <div key={cell.label} className="fs-onc__cell" style={{ background: cell.bg }}>
              <LogoHorizontal height={64} base={cell.base} corner={cell.corner} text={cell.text} />
              <span className="fs-onc__cell-label" style={{ color: cell.text }}>
                {cell.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BoardShell>
  )
}
