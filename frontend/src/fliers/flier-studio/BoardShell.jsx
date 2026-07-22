import { fsTokens } from '../../design/flierStudioTokens'
import { LiftoffMark } from './FSLogo'
import './fs-shell.css'

const C = fsTokens.colors

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

/**
 * Shared chrome for every Flier Studio identity board.
 * One header rhythm + one footer rhythm = one continuous document.
 */
export default function BoardShell({
  index,
  chapter,
  theme = 'paper',
  markBase,
  markCorner,
  className = '',
  children,
}) {
  const vars = THEMES[theme] || THEMES.paper
  const isDark = theme === 'ink'
  const isSignal = theme === 'signal'
  return (
    <article
      className={`fsb fsb--${theme} ${className}`}
      style={{
        width: fsTokens.board.width,
        height: fsTokens.board.height,
        '--fs-display': fsTokens.fonts.display,
        '--fs-body': fsTokens.fonts.body,
        '--fs-signal': C.signal,
        '--fs-cobalt': C.cobalt,
        '--fs-paper': C.paper,
        '--fs-black': C.ink,
        ...vars,
      }}
    >
      <header className="fsb__head">
        <span className="fsb__head-brand">
          <LiftoffMark
            size={34}
            base={markBase || (isDark ? C.paper : C.ink)}
            corner={markCorner || (isSignal ? C.paper : C.signal)}
          />
          <span className="fsb__head-name">Flier Studio — Identity System</span>
        </span>
        <span className="fsb__head-meta">
          <span className="fsb__head-chapter">{chapter}</span>
          <span className="fsb__head-index">{index} / 21</span>
        </span>
      </header>
      <div className="fsb__body">{children}</div>
      <footer className="fsb__foot">
        <span>Brand Guidelines · V1.0 · 2026</span>
        <span className="fsb__foot-url">flierstudio.design</span>
      </footer>
    </article>
  )
}
