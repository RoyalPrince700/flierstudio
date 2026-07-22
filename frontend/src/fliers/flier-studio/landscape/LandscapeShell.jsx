import { fsTokens } from '../../../design/flierStudioTokens'
import { LiftoffMark } from '../FSLogo'
import './fs-l-shell.css'

const C = fsTokens.colors
const B = fsTokens.boardLandscape

const THEMES = {
  paper: {
    '--fs-bg': C.paper,
    '--fs-ink': C.ink,
    '--fs-muted': C.stone,
    '--fs-line': C.mist,
    '--fs-accent': C.signal,
    '--fs-card': C.white,
  },
  ink: {
    '--fs-bg': C.ink,
    '--fs-ink': C.paper,
    '--fs-muted': '#A39E92',
    '--fs-line': '#2E2C26',
    '--fs-accent': C.signal,
    '--fs-card': C.graphite,
  },
  signal: {
    '--fs-bg': C.signal,
    '--fs-ink': C.ink,
    '--fs-muted': '#8A1F04',
    '--fs-line': '#E63C10',
    '--fs-accent': C.paper,
    '--fs-card': '#FF5C34',
  },
  cobalt: {
    '--fs-bg': C.cobalt,
    '--fs-ink': C.white,
    '--fs-muted': '#A8B4F5',
    '--fs-line': '#3D5AE8',
    '--fs-accent': C.signal,
    '--fs-card': '#3350E0',
  },
}

const TOTAL = 16

/**
 * Editorial landscape chrome — 1600×1200 Behance / Pinterest case study.
 * Same identity voice as the portrait shell; recomposed for horizontal rhythm.
 */
export default function LandscapeShell({
  index,
  chapter,
  theme = 'paper',
  markBase,
  markCorner,
  bleed = false,
  className = '',
  children,
}) {
  const vars = THEMES[theme] || THEMES.paper
  const isDark = theme === 'ink'
  const isSignal = theme === 'signal'
  return (
    <article
      className={`fsl fsl--${theme}${bleed ? ' fsl--bleed' : ''} ${className}`}
      style={{
        width: B.width,
        height: B.height,
        '--fs-display': fsTokens.fonts.display,
        '--fs-body': fsTokens.fonts.body,
        '--fs-signal': C.signal,
        '--fs-cobalt': C.cobalt,
        '--fs-paper': C.paper,
        '--fs-black': C.ink,
        '--fsl-safe': `${fsTokens.spacing.landscapeSafe}px`,
        ...vars,
      }}
    >
      {!bleed ? (
        <header className="fsl__head">
          <span className="fsl__head-brand">
            <LiftoffMark
              size={30}
              base={markBase || (isDark ? C.paper : C.ink)}
              corner={markCorner || (isSignal ? C.paper : C.signal)}
            />
            <span className="fsl__head-name">Flier Studio — Identity System</span>
            <span className="fsl__head-format">Editorial · 1600×1200</span>
          </span>
          <span className="fsl__head-meta">
            <span className="fsl__head-chapter">{chapter}</span>
            <span className="fsl__head-index">
              {index} / {String(TOTAL).padStart(2, '0')}
            </span>
          </span>
        </header>
      ) : null}
      <div className={`fsl__body${bleed ? ' fsl__body--bleed' : ''}`}>{children}</div>
      {!bleed ? (
        <footer className="fsl__foot">
          <span>Brand Guidelines · V1.0 · 2026 · Landscape</span>
          <span className="fsl__foot-url">flierstudio.design</span>
        </footer>
      ) : null}
    </article>
  )
}

export { TOTAL as LANDSCAPE_TOTAL }
