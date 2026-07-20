/** CSS grid overlay on a solid field color. */
export function gridField(color, line = 'rgba(255,255,255,0.2)') {
  return {
    backgroundColor: color,
    backgroundImage: `
      linear-gradient(${line} 2px, transparent 2px),
      linear-gradient(90deg, ${line} 2px, transparent 2px)
    `,
    backgroundSize: '48px 48px',
  }
}

/** Shared tokens for sample collection: radioshow */
export const radioshow = {
  id: 'radioshow',
  size: { width: 1080, height: 1350 },
  colors: {
    blue: '#2f6dff',
    blueDeep: '#1e4fd4',
    blueGrid: 'rgba(255,255,255,0.22)',
    orange: '#ff6a12',
    orangeDeep: '#e85a08',
    orangeGrid: 'rgba(255,255,255,0.18)',
    green: '#3dcc4a',
    greenDeep: '#2fb03a',
    greenGrid: 'rgba(255,255,255,0.2)',
    black: '#0a0a0a',
    white: '#ffffff',
    ink: '#0a0a0a',
  },
  fonts: {
    display: '"Bebas Neue", "Impact", "Arial Black", sans-serif',
    body: '"DM Sans", "Segoe UI", sans-serif',
    ui: '"Manrope", "DM Sans", sans-serif',
  },
  spacing: {
    safe: 56,
    radius: 14,
    ctaRadius: 12,
    shadow: 18,
  },
  demo: {
    brand: 'Signal Room',
    mark: 'SR',
    cta: 'Listen today on Spotify',
    handle: '@signalroom',
  },
}
