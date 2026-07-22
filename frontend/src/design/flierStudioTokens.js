/**
 * Flier Studio brand tokens — the product's own identity system.
 *
 * Concept: "The Liftoff" — an artboard tile whose corner peels away
 * along a 45° diagonal at the moment a design is posted.
 * Primary color: Signal (vermilion) — the color of posters, of urgency,
 * of stopping the scroll. Neutrals are warm (ink + paper) to feel like
 * a print studio, not a SaaS dashboard. Cobalt is the refined heir of
 * the legacy #0d66d0 accent, kept as a secondary voice.
 */
export const fsTokens = {
  brand: {
    name: 'Flier Studio',
    tagline: 'Start with a template. Make it yours.',
    url: 'flierstudio.design',
  },
  colors: {
    // Core
    signal: '#FF4A1D', // primary — vermilion
    signalDeep: '#C93007', // pressed / print variant, AA on paper
    cobalt: '#2545D9', // secondary — refined heritage blue
    ink: '#141310', // warm near-black
    paper: '#F5F1E8', // warm off-white
    // Neutrals
    graphite: '#26241F', // surface on ink
    slate: '#4B473F', // borders / secondary text on paper
    stone: '#8F8A7E', // muted text
    mist: '#E4DED2', // hairlines on paper
    white: '#FFFFFF',
    // Semantic (UI)
    success: '#1E9E6A',
    warning: '#D98E04',
    danger: '#D64530',
    info: '#2545D9',
  },
  fonts: {
    display: "'Space Grotesk', 'Manrope', sans-serif",
    body: "'Manrope', 'DM Sans', sans-serif",
    mono: "'Space Grotesk', monospace",
  },
  type: {
    trackingDisplay: '-0.03em',
    trackingCaps: '0.22em',
  },
  radius: {
    tile: 0.25, // logo tile corner radius as fraction of tile size
    card: 20,
    control: 12,
    pill: 999,
  },
  spacing: {
    safe: 84, // board inset for the identity presentation (portrait)
    unit: 8,
    landscapeSafe: 72, // editorial landscape inset
  },
  board: {
    width: 1080,
    height: 1350,
  },
  /** Behance / Pinterest editorial case-study format (4:3). */
  boardLandscape: {
    width: 1600,
    height: 1200,
  },
  /** Optional widescreen scale of the editorial system (16:9). */
  boardWidescreen: {
    width: 1920,
    height: 1080,
  },
}

export default fsTokens
