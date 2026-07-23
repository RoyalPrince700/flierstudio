/** Studio font picker options — families must be loaded in index.html */
export const FONT_CATALOG = [
  { id: 'orbitron', label: 'Orbitron', stack: '"Orbitron", sans-serif' },
  { id: 'manrope', label: 'Manrope', stack: '"Manrope", sans-serif' },
  { id: 'bebas', label: 'Bebas Neue', stack: '"Bebas Neue", sans-serif' },
  { id: 'dm-sans', label: 'DM Sans', stack: '"DM Sans", sans-serif' },
  { id: 'syne', label: 'Syne', stack: '"Syne", sans-serif' },
  { id: 'montserrat', label: 'Montserrat', stack: '"Montserrat", sans-serif' },
  { id: 'space-grotesk', label: 'Space Grotesk', stack: '"Space Grotesk", sans-serif' },
  { id: 'outfit', label: 'Outfit', stack: '"Outfit", sans-serif' },
  { id: 'playfair', label: 'Playfair Display', stack: '"Playfair Display", serif' },
  { id: 'unifraktur', label: 'UnifrakturCook', stack: '"UnifrakturCook", serif' },
]

export function fontStackById(id) {
  return FONT_CATALOG.find((f) => f.id === id)?.stack ?? FONT_CATALOG[0].stack
}

export function fontIdByStack(stack) {
  const found = FONT_CATALOG.find((f) => f.stack === stack)
  return found?.id ?? null
}
