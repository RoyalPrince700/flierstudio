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
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { fsTokens } from '../../design/flierStudioTokens'
import BoardShell from './BoardShell'
import { LiftoffMark } from './FSLogo'
import './fs-boards.css'

const C = fsTokens.colors

/* ------------------------------------------------------------------ */
/* 10 — Typography system                                              */
/* ------------------------------------------------------------------ */
export function FSTypographyBoard({
  headline = 'Grotesk voice, humanist body.',
  displayNote = 'Space Grotesk — display & numerals. Tight tracking (−3%), weight 700 or 500. Its squared terminals echo the tile; its quirks keep the brand from feeling like every other sans.',
  bodyNote = 'Manrope — UI & body. 400–800, generous line height (1.55). Calm where the display is opinionated.',
  studioEdit,
}) {
  return (
    <BoardShell index="10" chapter="Typography">
      <div className="fs-type">
        <EditableText
          as="h1"
          className="fsb-display fs-type__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-type__specimens">
          <div className="fs-type__spec">
            <div className="fs-type__glyph" style={{ fontFamily: fsTokens.fonts.display }}>
              Aa
            </div>
            <div className="fs-type__spec-info">
              <p className="fs-type__spec-name" style={{ fontFamily: fsTokens.fonts.display }}>
                Space Grotesk
              </p>
              <p
                className="fs-type__spec-chars"
                style={{ fontFamily: fsTokens.fonts.display }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 →
              </p>
              <EditableText
                as="p"
                className="fs-type__spec-note"
                value={displayNote}
                {...editableTextProps(studioEdit, 'displayNote')}
              />
            </div>
          </div>
          <div className="fs-type__spec">
            <div
              className="fs-type__glyph fs-type__glyph--body"
              style={{ fontFamily: fsTokens.fonts.body }}
            >
              Aa
            </div>
            <div className="fs-type__spec-info">
              <p className="fs-type__spec-name" style={{ fontFamily: fsTokens.fonts.body }}>
                Manrope
              </p>
              <p className="fs-type__spec-chars" style={{ fontFamily: fsTokens.fonts.body }}>
                abcdefghijklmnopqrstuvwxyz 0123456789 ?!&
              </p>
              <EditableText
                as="p"
                className="fs-type__spec-note"
                value={bodyNote}
                {...editableTextProps(studioEdit, 'bodyNote')}
              />
            </div>
          </div>
        </div>
        <div className="fs-type__scale">
          <p className="fsb-label">Scale — 1.333 ratio</p>
          <div className="fs-type__scale-rows">
            {[
              ['Display', 64, 700, fsTokens.fonts.display, 'Start with a template.'],
              ['Headline', 40, 700, fsTokens.fonts.display, 'Make it yours.'],
              ['Title', 27, 600, fsTokens.fonts.body, 'Every artboard keeps its own draft.'],
              ['Body', 20, 500, fsTokens.fonts.body, 'Thousands of layouts ready — change the words, photos, and colors.'],
              ['Caption', 15, 700, fsTokens.fonts.body, 'EXPORT · PNG · 3X · 1080 × 1350'],
            ].map(([label, size, weight, family, sample]) => (
              <div key={label} className="fs-type__scale-row">
                <span className="fs-type__scale-meta">
                  {label} · {size}
                </span>
                <span
                  className="fs-type__scale-sample"
                  style={{
                    fontSize: size,
                    fontWeight: weight,
                    fontFamily: family,
                    letterSpacing: family === fsTokens.fonts.display ? '-0.03em' : label === 'Caption' ? '0.14em' : '0',
                  }}
                >
                  {sample}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 11 — Graphic pattern & supporting elements                          */
/* ------------------------------------------------------------------ */
export function FSPatternBoard({
  headline = 'Everything echoes the liftoff.',
  note = 'Three devices, no decoration: the peel (a sliced top-right corner on cards and photos), the 45° hatch (texture for grounds and dividers), and the corner constellation (the lifted piece, repeated as pattern). If an element doesn’t echo the diagonal, it doesn’t ship.',
  photoNote = 'Photography shows real boards and real work — full-bleed artboards, honest UI, no stock “creative desk” clichés. Crop photos with the peel when framing.',
  studioEdit,
}) {
  return (
    <BoardShell index="11" chapter="Graphic system">
      <div className="fs-pat">
        <EditableText
          as="h1"
          className="fsb-display fs-pat__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fsb-copy fsb-copy--muted fs-pat__note"
          value={note}
          {...editableTextProps(studioEdit, 'note')}
        />
        <div className="fs-pat__grid">
          <div className="fs-pat__cell">
            <div className="fsb-peel fs-pat__peel-demo">
              <span className="fs-pat__peel-corner" />
            </div>
            <span className="fsb-label">The peel — cards & frames</span>
          </div>
          <div className="fs-pat__cell">
            <div className="fs-pat__hatch" />
            <span className="fsb-label">45° hatch — grounds</span>
          </div>
          <div className="fs-pat__cell fs-pat__cell--wide">
            <div className="fs-pat__constellation">
              {Array.from({ length: 24 }).map((_, i) => (
                <svg key={i} width="64" height="64" viewBox="0 0 96 96" fill="none">
                  <path
                    d="M59 6 L72 6 Q90 6 90 24 L90 37 Z"
                    fill={i % 7 === 3 ? C.signal : i % 5 === 1 ? C.cobalt : C.ink}
                    fillOpacity={i % 7 === 3 || i % 5 === 1 ? 1 : 0.85}
                    transform="translate(-101 5) scale(2)"
                  />
                </svg>
              ))}
            </div>
            <span className="fsb-label">Corner constellation — pattern fills</span>
          </div>
        </div>
        <EditableText
          as="p"
          className="fsb-copy fsb-copy--muted fs-pat__photo"
          value={photoNote}
          {...editableTextProps(studioEdit, 'photoNote')}
        />
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 12 — Iconography                                                    */
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

export function FSIconographyBoard({
  headline = 'One line weight. One family.',
  note = 'Lucide, exclusively — 2 px stroke, round joins, drawn on the same grid discipline as the mark. Icons are Ink on Paper and Paper on Ink; Signal is reserved for the active state, never for decoration.',
  studioEdit,
}) {
  return (
    <BoardShell index="12" chapter="Iconography">
      <div className="fs-ico">
        <EditableText
          as="h1"
          className="fsb-display fs-ico__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fsb-copy fsb-copy--muted fs-ico__note"
          value={note}
          {...editableTextProps(studioEdit, 'note')}
        />
        <div className="fs-ico__grid">
          {ICONS.map(([Icon, label], i) => (
            <div key={label} className={`fs-ico__cell ${i === 4 ? 'fs-ico__cell--active' : ''}`}>
              <Icon size={44} strokeWidth={1.8} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="fs-ico__rules">
          <div className="fs-ico__rule">
            <span className="fs-ico__rule-chip">
              <Frame size={22} strokeWidth={1.8} />
            </span>
            <span>2 px stroke at 24 px — scale stroke with size</span>
          </div>
          <div className="fs-ico__rule">
            <span className="fs-ico__rule-chip fs-ico__rule-chip--active">
              <Frame size={22} strokeWidth={1.8} />
            </span>
            <span>Signal marks the active tool only</span>
          </div>
          <div className="fs-ico__rule">
            <span className="fs-ico__rule-chip">
              <LiftoffMark size={22} base={C.ink} corner={C.signal} />
            </span>
            <span>The mark is never used as an icon</span>
          </div>
        </div>
      </div>
    </BoardShell>
  )
}
