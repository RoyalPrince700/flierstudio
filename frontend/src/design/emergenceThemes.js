/** Color themes for Emergence fliers — chrome/background only; photos untouched. */

export const EMERGENCE_COLOR_THEMES = [
  {
    id: 'ocean',
    label: 'Ocean',
    swatch: ['#1E42A3', '#5EB6FF', '#B6FF00'],
    colors: {
      navyDeep: '#061433',
      navy: '#0B1E6E',
      royal: '#102E8D',
      royalMid: '#1E42A3',
      cardLight: '#7EC8FF',
      card: '#5EB6FF',
      cardDeep: '#3A8DFF',
      inkSoft: '#D7E6FF',
      lime: '#B6FF00',
      limeInk: '#0A1400',
      amber: '#FFB800',
      orange: '#FF8A3D',
      inkDark: '#061433',
    },
  },
  {
    id: 'verdant',
    label: 'Verdant',
    swatch: ['#0F5C38', '#4ADE80', '#D4FF00'],
    colors: {
      navyDeep: '#041A10',
      navy: '#0A3D24',
      royal: '#0F5C38',
      royalMid: '#1A7A4C',
      cardLight: '#86EFAC',
      card: '#4ADE80',
      cardDeep: '#22C55E',
      inkSoft: '#D1FAE5',
      lime: '#D4FF00',
      limeInk: '#0A1400',
      amber: '#FBBF24',
      orange: '#F59E0B',
      inkDark: '#041A10',
    },
  },
  {
    id: 'violet',
    label: 'Violet',
    swatch: ['#4C1D95', '#A78BFA', '#F0FF3D'],
    colors: {
      navyDeep: '#1A0B2E',
      navy: '#2E1065',
      royal: '#4C1D95',
      royalMid: '#6D28D9',
      cardLight: '#C4B5FD',
      card: '#A78BFA',
      cardDeep: '#8B5CF6',
      inkSoft: '#EDE9FE',
      lime: '#F0FF3D',
      limeInk: '#141400',
      amber: '#FBBF24',
      orange: '#FB7185',
      inkDark: '#1A0B2E',
    },
  },
  {
    id: 'ember',
    label: 'Ember',
    swatch: ['#9A3412', '#FB923C', '#FFE500'],
    colors: {
      navyDeep: '#1C0A05',
      navy: '#7C2D12',
      royal: '#9A3412',
      royalMid: '#C2410C',
      cardLight: '#FDBA74',
      card: '#FB923C',
      cardDeep: '#F97316',
      inkSoft: '#FFEDD5',
      lime: '#FFE500',
      limeInk: '#1A1400',
      amber: '#FBBF24',
      orange: '#EF4444',
      inkDark: '#1C0A05',
    },
  },
  {
    id: 'teal',
    label: 'Teal',
    swatch: ['#115E59', '#2DD4BF', '#B6FF00'],
    colors: {
      navyDeep: '#042F2E',
      navy: '#0F766E',
      royal: '#115E59',
      royalMid: '#0D9488',
      cardLight: '#5EEAD4',
      card: '#2DD4BF',
      cardDeep: '#14B8A6',
      inkSoft: '#CCFBF1',
      lime: '#B6FF00',
      limeInk: '#0A1400',
      amber: '#FBBF24',
      orange: '#FB923C',
      inkDark: '#042F2E',
    },
  },
]

export const DEFAULT_EMERGENCE_COLOR_THEME = 'ocean'

export function getEmergenceColorTheme(themeId) {
  return (
    EMERGENCE_COLOR_THEMES.find((t) => t.id === themeId) ||
    EMERGENCE_COLOR_THEMES.find((t) => t.id === DEFAULT_EMERGENCE_COLOR_THEME)
  )
}

/** CSS custom properties for an Emergence artboard root. */
export function emergenceThemeCssVars(themeId) {
  const { colors } = getEmergenceColorTheme(themeId)
  return {
    '--e-navy-deep': colors.navyDeep,
    '--e-navy': colors.navy,
    '--e-royal': colors.royal,
    '--e-royal-mid': colors.royalMid,
    '--e-card-light': colors.cardLight,
    '--e-card': colors.card,
    '--e-card-deep': colors.cardDeep,
    '--e-ink-soft': colors.inkSoft,
    '--e-lime': colors.lime,
    '--e-lime-ink': colors.limeInk,
    '--e-amber': colors.amber,
    '--e-orange': colors.orange,
    '--e-ink-dark': colors.inkDark,
  }
}
