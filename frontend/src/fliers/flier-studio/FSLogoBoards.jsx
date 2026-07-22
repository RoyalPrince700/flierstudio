import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { fsTokens } from '../../design/flierStudioTokens'
import BoardShell from './BoardShell'
import {
  AppIconTile,
  LiftoffMark,
  LogoHorizontal,
  LogoStacked,
  MARK_CORNER_PATH,
  MARK_TILE_PATH,
  Wordmark,
} from './FSLogo'
import './fs-boards.css'

const C = fsTokens.colors

/* ------------------------------------------------------------------ */
/* 02 — Primary logo reveal                                            */
/* ------------------------------------------------------------------ */
export function FSLogoRevealBoard({
  caption = 'The Liftoff — the moment a flier is posted.',
  studioEdit,
}) {
  return (
    <BoardShell index="02" chapter="Logo" theme="ink">
      <div className="fs-reveal">
        <div className="fs-reveal__stage">
          <LiftoffMark size={430} base={C.paper} corner={C.signal} />
        </div>
        <div className="fs-reveal__word">
          <Wordmark size={92} color={C.paper} />
        </div>
        <EditableText
          as="p"
          className="fs-reveal__caption"
          value={caption}
          {...editableTextProps(studioEdit, 'caption')}
        />
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* Construction diagram (used by board 03)                             */
/* ------------------------------------------------------------------ */
function ConstructionDiagram({ size = 470 }) {
  const grid = []
  for (let i = 0; i <= 8; i++) {
    grid.push(
      <line key={`v${i}`} x1={i * 12} y1="0" x2={i * 12} y2="96" stroke={C.mist} strokeWidth="0.5" />,
      <line key={`h${i}`} x1="0" y1={i * 12} x2="96" y2={i * 12} stroke={C.mist} strokeWidth="0.5" />,
    )
  }
  return (
    <svg width={size} viewBox="-10 -14 116 136" fill="none">
      <rect x="-10" y="-14" width="116" height="136" fill={C.white} rx="4" />
      {grid}
      {/* extended liftoff diagonal */}
      <line x1="26" y1="-10" x2="104" y2="68" stroke={C.signal} strokeWidth="0.9" strokeDasharray="3 3" />
      <path d={MARK_TILE_PATH} fill={C.ink} fillOpacity="0.92" />
      <path d={MARK_CORNER_PATH} fill={C.signal} />
      {/* radius guide */}
      <circle cx="30" cy="30" r="18" stroke={C.cobalt} strokeWidth="0.9" strokeDasharray="2.5 2.5" />
      <text x="30" y="27" textAnchor="middle" fontSize="6" fontFamily="Space Grotesk" fill={C.cobalt}>
        1.5x
      </text>
      {/* dimension ticks */}
      <line x1="12" y1="104" x2="84" y2="104" stroke={C.slate} strokeWidth="0.9" />
      <line x1="12" y1="101" x2="12" y2="107" stroke={C.slate} strokeWidth="0.9" />
      <line x1="84" y1="101" x2="84" y2="107" stroke={C.slate} strokeWidth="0.9" />
      <text x="48" y="114" textAnchor="middle" fontSize="6.5" fontFamily="Space Grotesk" fill={C.slate}>
        6x
      </text>
      <text x="34" y="-4" fontSize="6.5" fontFamily="Space Grotesk" fill={C.signal} textAnchor="end">
        45°
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 03 — Logo concept & construction                                    */
/* ------------------------------------------------------------------ */
export function FSConstructionBoard({
  headline = 'A corner lifts. A post goes up.',
  concept = 'The mark starts as the thing every design here lives on: an artboard. One corner slices away along a 45° diagonal and lifts up and to the right — a flier peeling off the wall, a post leaving for the feed. Frame, movement, publishing: one gesture.',
  geometry = 'Drawn on a 96-unit grid. The tile is a 6x square with corner radii of 1.5x; the slice runs at exactly 45°; the lifted corner keeps the tile’s outer radius so both shapes read as one object.',
  studioEdit,
}) {
  return (
    <BoardShell index="03" chapter="Construction">
      <div className="fs-cons">
        <p className="fsb-eyebrow">Concept — “The Liftoff”</p>
        <EditableText
          as="h1"
          className="fsb-display fs-cons__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-cons__cols">
          <div className="fs-cons__text">
            <EditableText
              as="p"
              className="fsb-copy"
              value={concept}
              {...editableTextProps(studioEdit, 'concept')}
            />
            <div className="fs-cons__steps">
              {[
                ['Frame', <LiftoffMark key="a" size={72} base={C.ink} corner={C.ink} />],
                ['Slice', <SliceStep key="b" />],
                ['Liftoff', <LiftoffMark key="c" size={72} base={C.ink} corner={C.signal} />],
              ].map(([label, node]) => (
                <div key={label} className="fs-cons__step">
                  {node}
                  <span className="fsb-label">{label}</span>
                </div>
              ))}
            </div>
            <EditableText
              as="p"
              className="fs-cons__geometry"
              value={geometry}
              {...editableTextProps(studioEdit, 'geometry')}
            />
          </div>
          <div className="fs-cons__diagram">
            <ConstructionDiagram size={470} />
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

function SliceStep() {
  return (
    <svg width="72" height="72" viewBox="0 0 96 96" fill="none">
      <path d={MARK_TILE_PATH} fill={C.ink} />
      <path d="M54 12 L66 12 Q84 12 84 30 L84 42 Z" fill={C.ink} fillOpacity="0.35" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 04 — Complete logo family                                           */
/* ------------------------------------------------------------------ */
export function FSFamilyBoard({
  headline = 'One mark, every situation.',
  studioEdit,
}) {
  return (
    <BoardShell index="04" chapter="Logo family">
      <div className="fs-fam">
        <EditableText
          as="h1"
          className="fsb-display fs-fam__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-fam__rows">
          <div className="fs-fam__row">
            <span className="fsb-label">Primary — horizontal lockup</span>
            <div className="fs-fam__stage fs-fam__stage--wide">
              <LogoHorizontal height={104} />
            </div>
          </div>
          <div className="fs-fam__pair">
            <div className="fs-fam__row">
              <span className="fsb-label">Stacked lockup</span>
              <div className="fs-fam__stage">
                <LogoStacked markSize={120} />
              </div>
            </div>
            <div className="fs-fam__row">
              <span className="fsb-label">Symbol · Wordmark</span>
              <div className="fs-fam__stage fs-fam__stage--split">
                <LiftoffMark size={118} />
                <Wordmark size={44} />
              </div>
            </div>
          </div>
          <div className="fs-fam__row">
            <span className="fsb-label">Color variants</span>
            <div className="fs-fam__variants">
              <div className="fs-fam__variant" style={{ background: C.white }}>
                <LiftoffMark size={86} />
                <span>Full color</span>
              </div>
              <div className="fs-fam__variant" style={{ background: C.ink, color: C.paper }}>
                <LiftoffMark size={86} base={C.paper} corner={C.signal} />
                <span>Reversed</span>
              </div>
              <div className="fs-fam__variant" style={{ background: C.white }}>
                <LiftoffMark size={86} base="#000" corner="#000" />
                <span>One-color black</span>
              </div>
              <div className="fs-fam__variant" style={{ background: C.signal, color: C.paper }}>
                <LiftoffMark size={86} base={C.white} corner={C.white} />
                <span>One-color white</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 05 — Symbol & app icon system                                       */
/* ------------------------------------------------------------------ */
export function FSSymbolBoard({
  headline = 'Built to survive 16 pixels.',
  support = 'Two shapes and one gap: the symbol keeps its meaning at dock size, tab size, and watch size. The app icon sets the ink tile on a Signal ground; the favicon reverses onto ink so it holds in dark browser chrome.',
  studioEdit,
}) {
  return (
    <BoardShell index="05" chapter="Symbol">
      <div className="fs-sym">
        <EditableText
          as="h1"
          className="fsb-display fs-sym__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fsb-copy fsb-copy--muted fs-sym__support"
          value={support}
          {...editableTextProps(studioEdit, 'support')}
        />
        <div className="fs-sym__icons">
          <div className="fs-sym__icon-cell">
            <AppIconTile size={236} />
            <span className="fsb-label">App icon · 1024</span>
          </div>
          <div className="fs-sym__icon-cell">
            <AppIconTile size={128} />
            <span className="fsb-label">128</span>
          </div>
          <div className="fs-sym__icon-cell">
            <AppIconTile size={64} />
            <span className="fsb-label">64</span>
          </div>
          <div className="fs-sym__icon-cell">
            <div className="fs-sym__favicons">
              <FaviconTile size={48} />
              <FaviconTile size={32} />
              <FaviconTile size={16} />
            </div>
            <span className="fsb-label">Favicon · 48 / 32 / 16</span>
          </div>
        </div>
        <div className="fs-sym__context">
          <div className="fs-sym__tab">
            <span className="fs-sym__tab-dot" />
            <FaviconTile size={18} />
            <span className="fs-sym__tab-title">Flier Studio — Artboard</span>
            <span className="fs-sym__tab-x">×</span>
          </div>
          <div className="fs-sym__dock">
            {['#20242E', '#20242E', 'icon', '#20242E', '#20242E'].map((v, i) =>
              v === 'icon' ? (
                <AppIconTile key={i} size={76} />
              ) : (
                <span key={i} className="fs-sym__dock-app" style={{ background: v }} />
              ),
            )}
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

function FaviconTile({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <rect width="96" height="96" rx="24" fill={C.ink} />
      <g transform="translate(48 51) scale(0.82) translate(-48 -48)">
        <path d={MARK_TILE_PATH} fill={C.paper} />
        <path d={MARK_CORNER_PATH} fill={C.signal} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 06 — Clear space, minimum size, incorrect usage                     */
/* ------------------------------------------------------------------ */
export function FSClearspaceBoard({
  headline = 'Give it room. Keep it whole.',
  rule = 'Clear space equals the height of the lifted corner (X) on all sides — nothing enters it. The symbol never renders below 24 px; the horizontal lockup never below 120 px wide.',
  studioEdit,
}) {
  const donts = [
    ['Don’t stretch', <LiftoffMark key="1" size={74} style={{ transform: 'scaleX(1.45)' }} />],
    ['Don’t rotate', <LiftoffMark key="2" size={74} style={{ transform: 'rotate(24deg)' }} />],
    ['Don’t recolor', <LiftoffMark key="3" size={74} base="#8A3FFC" corner="#3FDD78" />],
    [
      'Don’t add effects',
      <LiftoffMark key="4" size={74} style={{ filter: 'drop-shadow(5px 7px 5px rgba(0,0,0,0.45))' }} />,
    ],
    ['Don’t outline', <OutlineMark key="5" />],
    ['Don’t crowd it', <BusyMark key="6" />],
  ]
  return (
    <BoardShell index="06" chapter="Usage">
      <div className="fs-clear">
        <EditableText
          as="h1"
          className="fsb-display fs-clear__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-clear__top">
          <div className="fs-clear__space">
            <svg width="330" height="330" viewBox="0 0 160 160" fill="none">
              <rect x="8" y="8" width="144" height="144" fill={C.white} rx="6" />
              <rect
                x="32"
                y="32"
                width="96"
                height="96"
                stroke={C.signal}
                strokeWidth="1"
                strokeDasharray="4 4"
                fill="none"
              />
              <g transform="translate(32 32)">
                <path d={MARK_TILE_PATH} fill={C.ink} />
                <path d={MARK_CORNER_PATH} fill={C.signal} />
              </g>
              {['32 17', '32 145', '17 80', '145 80'].map((pos) => {
                const [x, y] = pos.split(' ')
                return (
                  <text
                    key={pos}
                    x={x}
                    y={y}
                    fontSize="9"
                    fontFamily="Space Grotesk"
                    fontWeight="600"
                    fill={C.slate}
                    textAnchor="middle"
                  >
                    X
                  </text>
                )
              })}
            </svg>
            <span className="fsb-label">Clear space = X (corner height)</span>
          </div>
          <div className="fs-clear__mins">
            <EditableText
              as="p"
              className="fsb-copy fs-clear__rule"
              value={rule}
              {...editableTextProps(studioEdit, 'rule')}
            />
            <div className="fs-clear__min-row">
              <div className="fs-clear__min">
                <LiftoffMark size={24} />
                <span className="fsb-label">Symbol min · 24 px</span>
              </div>
              <div className="fs-clear__min">
                <LogoHorizontal height={26} />
                <span className="fsb-label">Lockup min · 120 px</span>
              </div>
            </div>
          </div>
        </div>
        <p className="fsb-label fs-clear__dont-title">Incorrect usage</p>
        <div className="fs-clear__donts">
          {donts.map(([label, node]) => (
            <div key={label} className="fs-clear__dont">
              <div className="fs-clear__dont-stage">{node}</div>
              <span className="fs-clear__dont-label">
                <span className="fs-clear__x">✕</span> {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BoardShell>
  )
}

function OutlineMark() {
  return (
    <svg width="74" height="74" viewBox="0 0 96 96" fill="none">
      <path d={MARK_TILE_PATH} stroke={C.ink} strokeWidth="3" fill="none" />
      <path d={MARK_CORNER_PATH} stroke={C.signal} strokeWidth="3" fill="none" />
    </svg>
  )
}

function BusyMark() {
  return (
    <span className="fs-clear__busy">
      <span className="fs-clear__busy-text">SUMMER SALE · 50% OFF</span>
      <LiftoffMark size={58} base={C.ink} corner={C.signal} />
      <span className="fs-clear__busy-text">ENDS TONIGHT · ACT NOW</span>
    </span>
  )
}
