import { fsTokens } from '../../design/flierStudioTokens'
import {
  AppIconTile,
  LiftoffMark,
  LogoHorizontal,
  LogoStacked,
  Wordmark,
} from './FSLogo'

const C = fsTokens.colors
const S = 1080

/**
 * Logo-only export artboard — solid ground, centered logo, nothing else.
 * Intent: “Download this logo file.”
 */
function LogoDownloadBoard({ bg, children }) {
  return (
    <article
      className="fs-logo-dl"
      style={{
        width: S,
        height: S,
        background: bg,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {children}
    </article>
  )
}

/* ---- Mark alone -------------------------------------------------- */

export function DlMarkOnPaper() {
  return (
    <LogoDownloadBoard bg={C.paper}>
      <LiftoffMark size={420} base={C.ink} corner={C.signal} />
    </LogoDownloadBoard>
  )
}

export function DlMarkOnWhite() {
  return (
    <LogoDownloadBoard bg={C.white}>
      <LiftoffMark size={420} base={C.ink} corner={C.signal} />
    </LogoDownloadBoard>
  )
}

export function DlMarkOnInk() {
  return (
    <LogoDownloadBoard bg={C.ink}>
      <LiftoffMark size={420} base={C.paper} corner={C.signal} />
    </LogoDownloadBoard>
  )
}

export function DlMarkOnSignal() {
  return (
    <LogoDownloadBoard bg={C.signal}>
      <LiftoffMark size={420} base={C.ink} corner={C.paper} />
    </LogoDownloadBoard>
  )
}

export function DlMarkOnSignalDeep() {
  return (
    <LogoDownloadBoard bg={C.signalDeep}>
      <LiftoffMark size={420} base={C.ink} corner={C.paper} />
    </LogoDownloadBoard>
  )
}

export function DlMarkOnCobalt() {
  return (
    <LogoDownloadBoard bg={C.cobalt}>
      <LiftoffMark size={420} base={C.white} corner={C.white} />
    </LogoDownloadBoard>
  )
}

export function DlMarkBlackOnPaper() {
  return (
    <LogoDownloadBoard bg={C.paper}>
      <LiftoffMark size={420} base={C.ink} corner={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlMarkWhiteOnInk() {
  return (
    <LogoDownloadBoard bg={C.ink}>
      <LiftoffMark size={420} base={C.white} corner={C.white} />
    </LogoDownloadBoard>
  )
}

/* ---- Horizontal lockup ------------------------------------------- */

export function DlHorizontalOnPaper() {
  return (
    <LogoDownloadBoard bg={C.paper}>
      <LogoHorizontal height={148} base={C.ink} corner={C.signal} text={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlHorizontalOnWhite() {
  return (
    <LogoDownloadBoard bg={C.white}>
      <LogoHorizontal height={148} base={C.ink} corner={C.signal} text={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlHorizontalOnInk() {
  return (
    <LogoDownloadBoard bg={C.ink}>
      <LogoHorizontal height={148} base={C.paper} corner={C.signal} text={C.paper} />
    </LogoDownloadBoard>
  )
}

export function DlHorizontalOnSignal() {
  return (
    <LogoDownloadBoard bg={C.signal}>
      <LogoHorizontal height={148} base={C.ink} corner={C.paper} text={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlHorizontalOnSignalDeep() {
  return (
    <LogoDownloadBoard bg={C.signalDeep}>
      <LogoHorizontal height={148} base={C.ink} corner={C.paper} text={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlHorizontalOnCobalt() {
  return (
    <LogoDownloadBoard bg={C.cobalt}>
      <LogoHorizontal height={148} base={C.white} corner={C.white} text={C.white} />
    </LogoDownloadBoard>
  )
}

/* ---- Stacked lockup ---------------------------------------------- */

export function DlStackedOnPaper() {
  return (
    <LogoDownloadBoard bg={C.paper}>
      <LogoStacked markSize={280} base={C.ink} corner={C.signal} text={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlStackedOnWhite() {
  return (
    <LogoDownloadBoard bg={C.white}>
      <LogoStacked markSize={280} base={C.ink} corner={C.signal} text={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlStackedOnInk() {
  return (
    <LogoDownloadBoard bg={C.ink}>
      <LogoStacked markSize={280} base={C.paper} corner={C.signal} text={C.paper} />
    </LogoDownloadBoard>
  )
}

export function DlStackedOnSignal() {
  return (
    <LogoDownloadBoard bg={C.signal}>
      <LogoStacked markSize={280} base={C.ink} corner={C.paper} text={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlStackedOnSignalDeep() {
  return (
    <LogoDownloadBoard bg={C.signalDeep}>
      <LogoStacked markSize={280} base={C.ink} corner={C.paper} text={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlStackedOnCobalt() {
  return (
    <LogoDownloadBoard bg={C.cobalt}>
      <LogoStacked markSize={280} base={C.white} corner={C.white} text={C.white} />
    </LogoDownloadBoard>
  )
}

/* ---- Wordmark alone ---------------------------------------------- */

export function DlWordmarkOnPaper() {
  return (
    <LogoDownloadBoard bg={C.paper}>
      <Wordmark size={88} color={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlWordmarkOnWhite() {
  return (
    <LogoDownloadBoard bg={C.white}>
      <Wordmark size={88} color={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlWordmarkOnInk() {
  return (
    <LogoDownloadBoard bg={C.ink}>
      <Wordmark size={88} color={C.paper} />
    </LogoDownloadBoard>
  )
}

export function DlWordmarkOnSignal() {
  return (
    <LogoDownloadBoard bg={C.signal}>
      <Wordmark size={88} color={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlWordmarkOnSignalDeep() {
  return (
    <LogoDownloadBoard bg={C.signalDeep}>
      <Wordmark size={88} color={C.ink} />
    </LogoDownloadBoard>
  )
}

export function DlWordmarkOnCobalt() {
  return (
    <LogoDownloadBoard bg={C.cobalt}>
      <Wordmark size={88} color={C.white} />
    </LogoDownloadBoard>
  )
}

/* ---- App icon / symbol square ------------------------------------ */

/** Primary app icon — Signal ground, ink tile, paper corner (full-bleed). */
export function DlAppIconSignal() {
  return (
    <LogoDownloadBoard bg={C.signal}>
      <AppIconTile size={1080} radius={0} bg={C.signal} base={C.ink} corner={C.paper} />
    </LogoDownloadBoard>
  )
}

/** App icon on Ink — paper tile, signal corner. */
export function DlAppIconInk() {
  return (
    <LogoDownloadBoard bg={C.ink}>
      <AppIconTile size={1080} radius={0} bg={C.ink} base={C.paper} corner={C.signal} />
    </LogoDownloadBoard>
  )
}

/** App icon on Paper — ink tile, signal corner. */
export function DlAppIconPaper() {
  return (
    <LogoDownloadBoard bg={C.paper}>
      <AppIconTile size={1080} radius={0} bg={C.paper} base={C.ink} corner={C.signal} />
    </LogoDownloadBoard>
  )
}

/** App icon on Cobalt — one-color white mark. */
export function DlAppIconCobalt() {
  return (
    <LogoDownloadBoard bg={C.cobalt}>
      <AppIconTile size={1080} radius={0} bg={C.cobalt} base={C.white} corner={C.white} />
    </LogoDownloadBoard>
  )
}

/**
 * Registry for the Flier Studio project — logo-download boards only.
 * Sidebar names are for studio navigation; artboards export logo-only.
 */
export const LOGO_DOWNLOAD_BOARDS = [
  // Mark
  {
    id: 'logo-mark-on-paper',
    name: 'Mark · Paper',
    Component: DlMarkOnPaper,
    description: 'Full-color mark on Paper',
  },
  {
    id: 'logo-mark-on-white',
    name: 'Mark · White',
    Component: DlMarkOnWhite,
    description: 'Full-color mark on White',
  },
  {
    id: 'logo-mark-on-ink',
    name: 'Mark · Ink',
    Component: DlMarkOnInk,
    description: 'Reversed mark on Ink',
  },
  {
    id: 'logo-mark-on-signal',
    name: 'Mark · Signal',
    Component: DlMarkOnSignal,
    description: 'Ink + paper mark on Signal',
  },
  {
    id: 'logo-mark-on-signal-deep',
    name: 'Mark · Signal Deep',
    Component: DlMarkOnSignalDeep,
    description: 'Ink + paper mark on Signal Deep',
  },
  {
    id: 'logo-mark-on-cobalt',
    name: 'Mark · Cobalt',
    Component: DlMarkOnCobalt,
    description: 'One-color white mark on Cobalt',
  },
  {
    id: 'logo-mark-black-on-paper',
    name: 'Mark · Black on Paper',
    Component: DlMarkBlackOnPaper,
    description: 'One-color black mark on Paper',
  },
  {
    id: 'logo-mark-white-on-ink',
    name: 'Mark · White on Ink',
    Component: DlMarkWhiteOnInk,
    description: 'One-color white mark on Ink',
  },
  // Horizontal
  {
    id: 'logo-horizontal-on-paper',
    name: 'Horizontal · Paper',
    Component: DlHorizontalOnPaper,
    description: 'Full-color horizontal lockup on Paper',
  },
  {
    id: 'logo-horizontal-on-white',
    name: 'Horizontal · White',
    Component: DlHorizontalOnWhite,
    description: 'Full-color horizontal lockup on White',
  },
  {
    id: 'logo-horizontal-on-ink',
    name: 'Horizontal · Ink',
    Component: DlHorizontalOnInk,
    description: 'Reversed horizontal lockup on Ink',
  },
  {
    id: 'logo-horizontal-on-signal',
    name: 'Horizontal · Signal',
    Component: DlHorizontalOnSignal,
    description: 'Horizontal lockup on Signal',
  },
  {
    id: 'logo-horizontal-on-signal-deep',
    name: 'Horizontal · Signal Deep',
    Component: DlHorizontalOnSignalDeep,
    description: 'Horizontal lockup on Signal Deep',
  },
  {
    id: 'logo-horizontal-on-cobalt',
    name: 'Horizontal · Cobalt',
    Component: DlHorizontalOnCobalt,
    description: 'One-color white horizontal on Cobalt',
  },
  // Stacked
  {
    id: 'logo-stacked-on-paper',
    name: 'Stacked · Paper',
    Component: DlStackedOnPaper,
    description: 'Full-color stacked lockup on Paper',
  },
  {
    id: 'logo-stacked-on-white',
    name: 'Stacked · White',
    Component: DlStackedOnWhite,
    description: 'Full-color stacked lockup on White',
  },
  {
    id: 'logo-stacked-on-ink',
    name: 'Stacked · Ink',
    Component: DlStackedOnInk,
    description: 'Reversed stacked lockup on Ink',
  },
  {
    id: 'logo-stacked-on-signal',
    name: 'Stacked · Signal',
    Component: DlStackedOnSignal,
    description: 'Stacked lockup on Signal',
  },
  {
    id: 'logo-stacked-on-signal-deep',
    name: 'Stacked · Signal Deep',
    Component: DlStackedOnSignalDeep,
    description: 'Stacked lockup on Signal Deep',
  },
  {
    id: 'logo-stacked-on-cobalt',
    name: 'Stacked · Cobalt',
    Component: DlStackedOnCobalt,
    description: 'One-color white stacked on Cobalt',
  },
  // Wordmark
  {
    id: 'logo-wordmark-on-paper',
    name: 'Wordmark · Paper',
    Component: DlWordmarkOnPaper,
    description: 'Ink wordmark on Paper',
  },
  {
    id: 'logo-wordmark-on-white',
    name: 'Wordmark · White',
    Component: DlWordmarkOnWhite,
    description: 'Ink wordmark on White',
  },
  {
    id: 'logo-wordmark-on-ink',
    name: 'Wordmark · Ink',
    Component: DlWordmarkOnInk,
    description: 'Paper wordmark on Ink',
  },
  {
    id: 'logo-wordmark-on-signal',
    name: 'Wordmark · Signal',
    Component: DlWordmarkOnSignal,
    description: 'Ink wordmark on Signal',
  },
  {
    id: 'logo-wordmark-on-signal-deep',
    name: 'Wordmark · Signal Deep',
    Component: DlWordmarkOnSignalDeep,
    description: 'Ink wordmark on Signal Deep',
  },
  {
    id: 'logo-wordmark-on-cobalt',
    name: 'Wordmark · Cobalt',
    Component: DlWordmarkOnCobalt,
    description: 'White wordmark on Cobalt',
  },
  // App icon
  {
    id: 'logo-app-icon-signal',
    name: 'App icon · Signal',
    Component: DlAppIconSignal,
    description: 'Primary app icon (full-bleed Signal)',
  },
  {
    id: 'logo-app-icon-ink',
    name: 'App icon · Ink',
    Component: DlAppIconInk,
    description: 'App icon on Ink',
  },
  {
    id: 'logo-app-icon-paper',
    name: 'App icon · Paper',
    Component: DlAppIconPaper,
    description: 'App icon on Paper',
  },
  {
    id: 'logo-app-icon-cobalt',
    name: 'App icon · Cobalt',
    Component: DlAppIconCobalt,
    description: 'App icon on Cobalt (one-color white)',
  },
]
