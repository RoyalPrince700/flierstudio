import {
  ArrowUpRight,
  Download,
  Frame,
  Hand,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  MousePointer2,
  Move,
  PenLine,
  Share2,
  Sparkle,
  SquareDashed,
  Type,
  ZoomIn,
} from 'lucide-react'
import EditableText from '../../../components/studio/EditableText'
import { editableTextProps } from '../../../components/studio/editableTextProps'
import { fsTokens } from '../../../design/flierStudioTokens'
import { LiftoffMark, LogoHorizontal, MARK_CORNER_PATH, MARK_TILE_PATH, Wordmark } from '../FSLogo'
import LandscapeShell from './LandscapeShell'
import './fs-l-boards.css'

const C = fsTokens.colors

/* ------------------------------------------------------------------ */
/* 08 — Primary color                                                  */
/* ------------------------------------------------------------------ */
export function LPrimaryColorBoard({
  headline = 'Signal.',
  support = 'The color of posters, warnings, and things worth stopping for. In a feed of safe blues, Signal is Flier Studio’s hand in the air — used sparingly, at full strength, always with intent.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="08" chapter="Color" theme="signal">
      <div className="fl-prime">
        <div className="fl-prime__left">
          <div className="fl-prime__specs">
            <span className="fsl-label">HEX FF4A1D</span>
            <span className="fsl-label">RGB 255 · 74 · 29</span>
            <span className="fsl-label">CMYK 0 · 71 · 89 · 0</span>
            <span className="fsl-label">PANTONE 172 C</span>
          </div>
          <EditableText
            as="h1"
            className="fl-prime__name"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fl-prime__support"
            value={support}
            {...editableTextProps(studioEdit, 'support')}
          />
        </div>
        <div className="fl-prime__mark">
          <LiftoffMark size={280} base={C.ink} corner={C.paper} />
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 09 — Palette + logo on color                                        */
/* ------------------------------------------------------------------ */
const PALETTE = [
  { name: 'Signal', hex: '#FF4A1D', role: 'Primary', ink: C.ink, big: true },
  { name: 'Ink', hex: '#141310', role: 'Text · dark', ink: C.paper, big: true },
  { name: 'Paper', hex: '#F5F1E8', role: 'Light grounds', ink: C.ink, big: true, border: true },
  { name: 'Cobalt', hex: '#2545D9', role: 'Secondary', ink: '#fff' },
  { name: 'Signal Deep', hex: '#C93007', role: 'Pressed', ink: '#fff' },
  { name: 'Graphite', hex: '#26241F', role: 'Surfaces', ink: C.paper },
  { name: 'Stone', hex: '#8F8A7E', role: 'Muted', ink: C.ink },
  { name: 'Mist', hex: '#E4DED2', role: 'Hairlines', ink: C.ink },
]

export function LPaletteBoard({
  headline = 'A poster palette, not a dashboard palette.',
  note = 'Warm neutrals keep the system feeling printed. Signal on Ink passes AA; body text on Paper is always Ink; Signal on Paper is display-only.',
  studioEdit,
}) {
  const cells = [
    { bg: C.paper, base: C.ink, corner: C.signal, text: C.ink, label: 'On Paper' },
    { bg: C.ink, base: C.paper, corner: C.signal, text: C.paper, label: 'On Ink' },
    { bg: C.signal, base: C.ink, corner: C.paper, text: C.ink, label: 'On Signal' },
    { bg: C.cobalt, base: C.white, corner: C.white, text: C.white, label: 'On Cobalt' },
  ]
  return (
    <LandscapeShell index="09" chapter="Palette">
      <div className="fl-pal">
        <div className="fl-pal__top">
          <EditableText
            as="h1"
            className="fsl-display fl-pal__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fsl-copy--muted fl-pal__note"
            value={note}
            {...editableTextProps(studioEdit, 'note')}
          />
        </div>
        <div className="fl-pal__grid">
          {PALETTE.map((c) => (
            <div
              key={c.name}
              className={`fl-pal__chip ${c.big ? 'fl-pal__chip--big' : ''}`}
              style={{
                background: c.hex,
                color: c.ink,
                boxShadow: c.border ? `inset 0 0 0 1.5px ${C.mist}` : 'none',
              }}
            >
              <span className="fl-pal__chip-name">{c.name}</span>
              <span className="fl-pal__chip-meta">
                {c.hex.toUpperCase()}
                <em>{c.role}</em>
              </span>
            </div>
          ))}
        </div>
        <div className="fl-pal__oncolor">
          {cells.map((cell) => (
            <div key={cell.label} className="fl-pal__oncell" style={{ background: cell.bg }}>
              <LogoHorizontal height={44} base={cell.base} corner={cell.corner} text={cell.text} />
              <span style={{ color: cell.text }}>{cell.label}</span>
            </div>
          ))}
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 10 — Typography                                                     */
/* ------------------------------------------------------------------ */
export function LTypographyBoard({
  headline = 'Grotesk voice, humanist body.',
  displayNote = 'Space Grotesk — display & numerals. Tight tracking (−3%), weight 700 or 500. Squared terminals echo the tile.',
  bodyNote = 'Manrope — UI & body. 400–800, generous line height (1.55). Calm where the display is opinionated.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="10" chapter="Typography">
      <div className="fl-type">
        <EditableText
          as="h1"
          className="fsl-display fl-type__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fl-type__cols">
          <div className="fl-type__specs">
            <div className="fl-type__spec">
              <div className="fl-type__glyph" style={{ fontFamily: fsTokens.fonts.display, color: C.signal }}>
                Aa
              </div>
              <div>
                <p className="fl-type__spec-name" style={{ fontFamily: fsTokens.fonts.display }}>
                  Space Grotesk
                </p>
                <EditableText
                  as="p"
                  className="fl-type__spec-note"
                  value={displayNote}
                  {...editableTextProps(studioEdit, 'displayNote')}
                />
              </div>
            </div>
            <div className="fl-type__spec">
              <div className="fl-type__glyph" style={{ fontFamily: fsTokens.fonts.body }}>
                Aa
              </div>
              <div>
                <p className="fl-type__spec-name" style={{ fontFamily: fsTokens.fonts.body }}>
                  Manrope
                </p>
                <EditableText
                  as="p"
                  className="fl-type__spec-note"
                  value={bodyNote}
                  {...editableTextProps(studioEdit, 'bodyNote')}
                />
              </div>
            </div>
          </div>
          <div className="fl-type__scale">
            <p className="fsl-label">Scale — 1.333 ratio</p>
            {[
              ['Display', 52, 700, fsTokens.fonts.display, 'Start with a template.'],
              ['Headline', 34, 700, fsTokens.fonts.display, 'Make it yours.'],
              ['Title', 24, 600, fsTokens.fonts.body, 'Every artboard keeps its own draft.'],
              ['Body', 18, 500, fsTokens.fonts.body, 'Change the words, photos, and colors.'],
              ['Caption', 13, 700, fsTokens.fonts.body, 'EXPORT · PNG · 3X · 1600 × 1200'],
            ].map(([label, size, weight, family, sample]) => (
              <div key={label} className="fl-type__scale-row">
                <span className="fl-type__scale-meta">
                  {label} · {size}
                </span>
                <span
                  className="fl-type__scale-sample"
                  style={{
                    fontSize: size,
                    fontWeight: weight,
                    fontFamily: family,
                    letterSpacing:
                      family === fsTokens.fonts.display
                        ? '-0.03em'
                        : label === 'Caption'
                          ? '0.14em'
                          : '0',
                  }}
                >
                  {sample}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 11 — Graphic system + iconography                                   */
/* ------------------------------------------------------------------ */
const ICONS = [
  [MousePointer2, 'Select'],
  [Hand, 'Pan'],
  [Type, 'Text'],
  [ImageIcon, 'Image'],
  [Frame, 'Artboard'],
  [Layers, 'Layers'],
  [LayoutGrid, 'Boards'],
  [Move, 'Move'],
  [ZoomIn, 'Zoom'],
  [PenLine, 'Edit'],
  [SquareDashed, 'Slot'],
  [Download, 'Export'],
  [Share2, 'Share'],
  [Sparkle, 'Sample'],
  [ArrowUpRight, 'Publish'],
]

export function LVisualLanguageBoard({
  headline = 'Everything echoes the liftoff.',
  note = 'Three devices: the peel, the 45° hatch, and the corner constellation. Lucide exclusively — 2 px stroke; Signal marks active state only.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="11" chapter="Visual language">
      <div className="fl-vis">
        <div className="fl-vis__head">
          <EditableText
            as="h1"
            className="fsl-display fl-vis__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fsl-copy--muted"
            value={note}
            {...editableTextProps(studioEdit, 'note')}
          />
        </div>
        <div className="fl-vis__row">
          <div className="fl-vis__devices">
            <div className="fl-vis__cell">
              <div className="fsl-peel fl-vis__peel" />
              <span className="fsl-label">The peel</span>
            </div>
            <div className="fl-vis__cell">
              <div className="fl-vis__hatch" />
              <span className="fsl-label">45° hatch</span>
            </div>
            <div className="fl-vis__cell fl-vis__cell--wide">
              <div className="fl-vis__constellation">
                {Array.from({ length: 16 }).map((_, i) => (
                  <svg key={i} width="48" height="48" viewBox="0 0 96 96" fill="none">
                    <path
                      d="M59 6 L72 6 Q90 6 90 24 L90 37 Z"
                      fill={i % 7 === 3 ? C.signal : i % 5 === 1 ? C.cobalt : C.ink}
                      transform="translate(-101 5) scale(2)"
                    />
                  </svg>
                ))}
              </div>
              <span className="fsl-label">Corner constellation</span>
            </div>
          </div>
          <div className="fl-vis__icons">
            <p className="fsl-label">Iconography · Lucide</p>
            <div className="fl-vis__ico-grid">
              {ICONS.map(([Icon, label], i) => (
                <div key={label} className={`fl-vis__ico ${i === 4 ? 'fl-vis__ico--active' : ''}`}>
                  <Icon size={28} strokeWidth={1.8} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="fl-vis__rule">
              <LiftoffMark size={22} base={C.ink} corner={C.signal} />
              <span>The mark is never used as a UI icon</span>
            </div>
          </div>
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 12 — Voice                                                          */
/* ------------------------------------------------------------------ */
export function LVoiceBoard({
  headline = 'Say it like a designer would.',
  principle1 = 'Direct. Short sentences that respect the reader’s time.',
  principle2 = 'Craft-literate. We talk about layout, rhythm, and hierarchy — plainly.',
  principle3 = 'Encouraging, never gushing. The work is the compliment.',
  sampleHero = 'Start with a template. Make it yours.',
  sampleSupport = 'Thousands of layouts ready — change the words, photos, and colors.',
  sampleCta = 'Open the studio',
  studioEdit,
}) {
  return (
    <LandscapeShell index="12" chapter="Voice">
      <div className="fl-voice">
        <div className="fl-voice__left">
          <EditableText
            as="h1"
            className="fsl-display fl-voice__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <div className="fl-voice__principles">
            {[
              ['principle1', principle1],
              ['principle2', principle2],
              ['principle3', principle3],
            ].map(([path, value], i) => (
              <div key={path} className="fl-voice__principle">
                <span className="fl-voice__num">{String(i + 1).padStart(2, '0')}</span>
                <EditableText
                  as="p"
                  className="fl-voice__principle-copy"
                  value={value}
                  {...editableTextProps(studioEdit, path)}
                />
              </div>
            ))}
          </div>
          <div className="fl-voice__dodont">
            <div>
              <p className="fl-voice__do">We say</p>
              <p className="fl-voice__phrase">“Start with a template.”</p>
              <p className="fl-voice__phrase">“Make it yours.”</p>
            </div>
            <div>
              <p className="fl-voice__dont">We never say</p>
              <p className="fl-voice__phrase fl-voice__phrase--strike">“Unleash your creativity!”</p>
              <p className="fl-voice__phrase fl-voice__phrase--strike">“Stunning designs in seconds!”</p>
            </div>
          </div>
        </div>
        <div className="fl-voice__sample fsl-peel">
          <span className="fsl-label">Hero headline</span>
          <EditableText
            as="p"
            className="fl-voice__sample-hero"
            value={sampleHero}
            {...editableTextProps(studioEdit, 'sampleHero')}
          />
          <EditableText
            as="p"
            className="fl-voice__sample-sub"
            value={sampleSupport}
            {...editableTextProps(studioEdit, 'sampleSupport')}
          />
          <span className="fl-voice__sample-btn">
            <EditableText as="span" value={sampleCta} {...editableTextProps(studioEdit, 'sampleCta')} />
          </span>
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 13 — Motion                                                         */
/* ------------------------------------------------------------------ */
function Frame1() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <rect
        x="24"
        y="24"
        width="48"
        height="48"
        rx="12"
        stroke={C.paper}
        strokeWidth="1.4"
        strokeDasharray="4 4"
        opacity="0.5"
      />
    </svg>
  )
}
function Frame2() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <g transform="translate(48 48) scale(0.86) translate(-48 -48)">
        <rect x="12" y="12" width="72" height="72" rx="18" fill={C.paper} />
      </g>
    </svg>
  )
}
function Frame3() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <rect x="12" y="12" width="72" height="72" rx="18" fill={C.paper} />
      <line x1="46" y1="10" x2="86" y2="50" stroke={C.signal} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
function Frame4() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <path d={MARK_TILE_PATH} fill={C.paper} />
      <path d="M55 10 L68 10 Q86 10 86 28 L86 41 Z" fill={C.signal} />
      <path d="M63 2 L76 2 Q94 2 94 20 L94 33 Z" fill={C.signal} opacity="0.28" />
    </svg>
  )
}
function Frame5() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <path d={MARK_TILE_PATH} fill={C.paper} />
      <path d={MARK_CORNER_PATH} fill={C.signal} />
    </svg>
  )
}

const FRAMES = [
  ['00:00', 'Empty artboard', Frame1],
  ['00:12', 'Tile lands', Frame2],
  ['00:26', 'Signal slice', Frame3],
  ['00:34', 'Liftoff', Frame4],
  ['00:48', 'Settle', Frame5],
]

export function LMotionBoard({
  headline = 'The mark animates the way the product feels.',
  note = 'One idea, 1.2 seconds: the artboard lands, the diagonal cuts, the corner lifts off. 240 ms ease-out-quint in product UI; nothing bounces, nothing spins.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="13" chapter="Motion" theme="ink">
      <div className="fl-mot">
        <div className="fl-mot__head">
          <EditableText
            as="h1"
            className="fsl-display fl-mot__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fsl-copy--muted"
            value={note}
            {...editableTextProps(studioEdit, 'note')}
          />
        </div>
        <div className="fl-mot__frames">
          {FRAMES.map(([time, caption, Comp], i) => (
            <div key={time} className="fl-mot__frame">
              <div className="fl-mot__stage">
                <Comp />
                {i === 4 ? (
                  <div className="fl-mot__stage-word">
                    <Wordmark size={11} color={C.paper} />
                  </div>
                ) : null}
              </div>
              <span className="fl-mot__time">{time}</span>
              <span className="fl-mot__caption">{caption}</span>
            </div>
          ))}
        </div>
        <div className="fl-mot__principles">
          {[
            ['Purposeful', 'Motion explains — reveals, transitions, exports.'],
            ['Diagonal', 'Enter and exit along the 45° liftoff axis.'],
            ['Fast', '240 ms standard · 480 ms hero · ease-out-quint.'],
          ].map(([title, copy]) => (
            <div key={title} className="fl-mot__principle">
              <span className="fl-mot__principle-title">{title}</span>
              <span className="fl-mot__principle-copy">{copy}</span>
            </div>
          ))}
        </div>
      </div>
    </LandscapeShell>
  )
}
