import EditableText from '../../../components/studio/EditableText'
import { editableTextProps } from '../../../components/studio/editableTextProps'
import { fsTokens } from '../../../design/flierStudioTokens'
import {
  AppIconTile,
  LiftoffMark,
  LogoHorizontal,
  LogoStacked,
  MARK_CORNER_PATH,
  MARK_TILE_PATH,
  Wordmark,
} from '../FSLogo'
import LandscapeShell from './LandscapeShell'
import './fs-l-boards.css'

const C = fsTokens.colors

function ConstructionDiagram({ size = 520 }) {
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
      <line x1="26" y1="-10" x2="104" y2="68" stroke={C.signal} strokeWidth="0.9" strokeDasharray="3 3" />
      <path d={MARK_TILE_PATH} fill={C.ink} fillOpacity="0.92" />
      <path d={MARK_CORNER_PATH} fill={C.signal} />
      <circle cx="30" cy="30" r="18" stroke={C.cobalt} strokeWidth="0.9" strokeDasharray="2.5 2.5" />
      <text x="30" y="27" textAnchor="middle" fontSize="6" fontFamily="Space Grotesk" fill={C.cobalt}>
        1.5x
      </text>
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

function SliceStep() {
  return (
    <svg width="64" height="64" viewBox="0 0 96 96" fill="none">
      <path d={MARK_TILE_PATH} fill={C.ink} />
      <path d="M54 12 L66 12 Q84 12 84 30 L84 42 Z" fill={C.ink} fillOpacity="0.35" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 04 — Concept & construction                                         */
/* ------------------------------------------------------------------ */
export function LConstructionBoard({
  headline = 'A corner lifts. A post goes up.',
  concept = 'The mark starts as the thing every design here lives on: an artboard. One corner slices away along a 45° diagonal and lifts up and to the right — a flier peeling off the wall, a post leaving for the feed. Frame, movement, publishing: one gesture.',
  geometry = 'Drawn on a 96-unit grid. The tile is a 6x square with corner radii of 1.5x; the slice runs at exactly 45°; the lifted corner keeps the tile’s outer radius so both shapes read as one object.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="04" chapter="Construction">
      <div className="fl-cons">
        <div className="fl-cons__text">
          <p className="fsl-eyebrow">Concept — “The Liftoff”</p>
          <EditableText
            as="h1"
            className="fsl-display fl-cons__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fl-cons__concept"
            value={concept}
            {...editableTextProps(studioEdit, 'concept')}
          />
          <div className="fl-cons__steps">
            {[
              ['Frame', <LiftoffMark key="a" size={64} base={C.ink} corner={C.ink} />],
              ['Slice', <SliceStep key="b" />],
              ['Liftoff', <LiftoffMark key="c" size={64} base={C.ink} corner={C.signal} />],
            ].map(([label, node]) => (
              <div key={label} className="fl-cons__step">
                {node}
                <span className="fsl-label">{label}</span>
              </div>
            ))}
          </div>
          <EditableText
            as="p"
            className="fl-cons__geometry"
            value={geometry}
            {...editableTextProps(studioEdit, 'geometry')}
          />
        </div>
        <div className="fl-cons__diagram">
          <ConstructionDiagram size={540} />
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 05 — Logo family                                                    */
/* ------------------------------------------------------------------ */
export function LFamilyBoard({
  headline = 'One mark, every situation.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="05" chapter="Logo family">
      <div className="fl-fam">
        <div className="fl-fam__head">
          <EditableText
            as="h1"
            className="fsl-display fl-fam__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
        </div>
        <div className="fl-fam__grid">
          <div className="fl-fam__cell fl-fam__cell--hero">
            <span className="fsl-label">Primary — horizontal lockup</span>
            <div className="fl-fam__stage">
              <LogoHorizontal height={96} />
            </div>
          </div>
          <div className="fl-fam__cell">
            <span className="fsl-label">Stacked</span>
            <div className="fl-fam__stage">
              <LogoStacked markSize={110} />
            </div>
          </div>
          <div className="fl-fam__cell">
            <span className="fsl-label">Symbol · Wordmark</span>
            <div className="fl-fam__stage fl-fam__stage--split">
              <LiftoffMark size={100} />
              <Wordmark size={36} />
            </div>
          </div>
          <div className="fl-fam__cell fl-fam__cell--variants">
            <span className="fsl-label">Color variants</span>
            <div className="fl-fam__variants">
              <div className="fl-fam__variant" style={{ background: C.white }}>
                <LiftoffMark size={72} />
                <span>Full color</span>
              </div>
              <div className="fl-fam__variant" style={{ background: C.ink, color: C.paper }}>
                <LiftoffMark size={72} base={C.paper} corner={C.signal} />
                <span>Reversed</span>
              </div>
              <div className="fl-fam__variant" style={{ background: C.white }}>
                <LiftoffMark size={72} base="#000" corner="#000" />
                <span>One-color black</span>
              </div>
              <div className="fl-fam__variant" style={{ background: C.signal, color: C.paper }}>
                <LiftoffMark size={72} base={C.white} corner={C.white} />
                <span>One-color white</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 06 — Symbol & app icon                                              */
/* ------------------------------------------------------------------ */
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

export function LSymbolBoard({
  headline = 'Built to survive 16 pixels.',
  support = 'Two shapes and one gap: the symbol keeps its meaning at dock size, tab size, and watch size. The app icon sets the ink tile on a Signal ground; the favicon reverses onto ink so it holds in dark browser chrome.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="06" chapter="Symbol">
      <div className="fl-sym">
        <div className="fl-sym__copy">
          <EditableText
            as="h1"
            className="fsl-display fl-sym__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fsl-copy--muted"
            value={support}
            {...editableTextProps(studioEdit, 'support')}
          />
          <div className="fl-sym__context">
            <div className="fl-sym__tab">
              <FaviconTile size={16} />
              <span>Flier Studio — Artboard</span>
            </div>
            <div className="fl-sym__dock">
              {['#20242E', '#20242E', 'icon', '#20242E', '#20242E'].map((v, i) =>
                v === 'icon' ? (
                  <AppIconTile key={i} size={58} />
                ) : (
                  <span key={i} className="fl-sym__dock-app" style={{ background: v }} />
                ),
              )}
            </div>
          </div>
        </div>
        <div className="fl-sym__icons">
          <div className="fl-sym__icon-cell">
            <AppIconTile size={200} />
            <span className="fsl-label">App icon</span>
          </div>
          <div className="fl-sym__icon-cell">
            <AppIconTile size={96} />
            <span className="fsl-label">96</span>
          </div>
          <div className="fl-sym__icon-cell">
            <AppIconTile size={48} />
            <span className="fsl-label">48</span>
          </div>
          <div className="fl-sym__icon-cell">
            <div className="fl-sym__favicons">
              <FaviconTile size={40} />
              <FaviconTile size={28} />
              <FaviconTile size={16} />
            </div>
            <span className="fsl-label">Favicon</span>
          </div>
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 07 — Clear space & usage                                            */
/* ------------------------------------------------------------------ */
function OutlineMark() {
  return (
    <svg width="64" height="64" viewBox="0 0 96 96" fill="none">
      <path d={MARK_TILE_PATH} stroke={C.ink} strokeWidth="3" fill="none" />
      <path d={MARK_CORNER_PATH} stroke={C.signal} strokeWidth="3" fill="none" />
    </svg>
  )
}

export function LClearspaceBoard({
  headline = 'Give it room. Keep it whole.',
  rule = 'Clear space equals the height of the lifted corner (X) on all sides. Symbol never below 24 px; horizontal lockup never below 120 px wide.',
  studioEdit,
}) {
  const donts = [
    ['Don’t stretch', <LiftoffMark key="1" size={58} style={{ transform: 'scaleX(1.45)' }} />],
    ['Don’t rotate', <LiftoffMark key="2" size={58} style={{ transform: 'rotate(24deg)' }} />],
    ['Don’t recolor', <LiftoffMark key="3" size={58} base="#8A3FFC" corner="#3FDD78" />],
    [
      'Don’t add effects',
      <LiftoffMark key="4" size={58} style={{ filter: 'drop-shadow(5px 7px 5px rgba(0,0,0,0.45))' }} />,
    ],
    ['Don’t outline', <OutlineMark key="5" />],
  ]
  return (
    <LandscapeShell index="07" chapter="Usage">
      <div className="fl-clear">
        <div className="fl-clear__left">
          <EditableText
            as="h1"
            className="fsl-display fl-clear__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fl-clear__rule"
            value={rule}
            {...editableTextProps(studioEdit, 'rule')}
          />
          <div className="fl-clear__space">
            <svg width="280" height="280" viewBox="0 0 160 160" fill="none">
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
            <div className="fl-clear__mins">
              <div className="fl-clear__min">
                <LiftoffMark size={24} />
                <span className="fsl-label">Symbol min · 24 px</span>
              </div>
              <div className="fl-clear__min">
                <LogoHorizontal height={24} />
                <span className="fsl-label">Lockup min · 120 px</span>
              </div>
            </div>
          </div>
        </div>
        <div className="fl-clear__donts">
          <p className="fsl-label">Incorrect usage</p>
          <div className="fl-clear__dont-grid">
            {donts.map(([label, node]) => (
              <div key={label} className="fl-clear__dont">
                <div className="fl-clear__dont-stage">{node}</div>
                <span className="fl-clear__dont-label">
                  <span className="fl-clear__x">✕</span> {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LandscapeShell>
  )
}
