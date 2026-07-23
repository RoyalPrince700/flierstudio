/**
 * GraceLife Prayer Chain — color, type, layout tokens.
 * Sampled from prayerchainflier.jpg + Photoshop build notes.
 * Full recipe: frontend/prayerchaindesignguide.md
 */

export const prayerChain = {
  size: {
    id: 'print-square-5in',
    width: 1500,
    height: 1500,
    label: 'Print Square 5×5 in · 1500×1500',
  },

  colors: {
    /** Near-white luminous core */
    core: '#FFF8E0',
    /** Soft center yellow */
    glowMid: '#FFE566',
    /** Saturated field / edge yellow */
    field: '#F5C400',
    /** Deep edge / vignette gold */
    fieldDeep: '#E0A800',
    /** Display + logo ink (deep chocolate gold) */
    ink: '#3D2808',
    /** Support / date ink */
    inkSoft: '#4A3200',
    /** Lighten-brush yellow on type */
    sheen: '#FFE566',
    /** Soft-light yellow map */
    mapYellow: 'rgba(255, 200, 0, 0.28)',
    /** Soft-light warm red/amber map */
    mapWarm: 'rgba(220, 80, 20, 0.22)',
    /** Shadow cool cast (color balance) */
    shadowCool: 'rgba(40, 70, 140, 0.12)',
    /** Highlight warm cast */
    highlightWarm: 'rgba(255, 90, 40, 0.1)',
  },

  fonts: {
    /** Substitute for American Trial blackletter */
    display: '"UnifrakturCook", "UnifrakturMaguntia", "Times New Roman", serif',
    support: '"Playfair Display", "Georgia", serif',
  },

  type: {
    displaySize: 210,
    displayLineHeight: 0.86,
    supportSize: 28,
    supportTracking: '-0.045em',
    dateSize: 34,
    dateTracking: '-0.02em',
  },

  spacing: {
    safe: 72,
    logoTop: 88,
    logoWidth: 200,
    logoHeight: 162,
    titleBlockTop: 460,
    supportGap: 32,
    dateGap: 24,
  },

  effects: {
    grainOpacity: 0.15,
    cityOpacity: 0.62,
    glowBlur: 135,
    chainBlur: 1.6,
    softLightOpacity: 0.28,
  },

  assets: {
    logo: '/assets/gracelife/logo.png',
    chain: '/assets/gracelife/chain-with-red-link.png',
    city: '/assets/gracelife/cityscape.jpg',
    glow: '/assets/gracelife/yellow-abstract.jpeg',
  },
}

export default prayerChain
