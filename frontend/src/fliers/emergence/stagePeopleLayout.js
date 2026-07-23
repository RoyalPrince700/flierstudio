/** Cascade Stage Flex — dynamic stage people (1–10) with balanced row recipes. */

export const STAGE_PEOPLE_MIN = 1
export const STAGE_PEOPLE_MAX = 10
export const DEFAULT_STAGE_PEOPLE_COUNT = 6

const ACCENTS = ['amber', 'orange', 'cyan']

/**
 * Explicit row recipes (column counts per row). Incomplete last rows are centered in CSS.
 * | N  | Layout (convener on)           | Solo override      |
 * | 1  | 1 centered                     | —                  |
 * | 2  | 1×2                            | —                  |
 * | 3  | 1×3                            | —                  |
 * | 4  | 2×2                            | [4] single row     |
 * | 5  | 1×5 (single row always)        | same               |
 * | 6  | 3×2                            | —                  |
 * | 7  | 4 + 3 (last centered)          | —                  |
 * | 8  | 4×2                            | —                  |
 * | 9  | 3×3                            | —                  |
 * | 10 | 5×2                            | —                  |
 */
export const STAGE_PEOPLE_ROWS = {
  1: [1],
  2: [2],
  3: [3],
  4: [2, 2],
  5: [5],
  6: [3, 3],
  7: [4, 3],
  8: [4, 4],
  9: [3, 3, 3],
  10: [5, 5],
}

/** Solo (no convener) overrides — only where full width changes the recipe. */
export const STAGE_PEOPLE_ROWS_SOLO = {
  4: [4],
}

export function clampStagePeopleCount(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return DEFAULT_STAGE_PEOPLE_COUNT
  return Math.min(STAGE_PEOPLE_MAX, Math.max(STAGE_PEOPLE_MIN, Math.round(v)))
}

export function defaultStagePerson(index) {
  const n = index + 1
  const padded = String(n).padStart(2, '0')
  return {
    name: `PERSON ${padded}`,
    title: 'Title / Role',
    accent: ACCENTS[index % ACCENTS.length],
    photoSrc: '',
  }
}

function clonePerson(person = {}) {
  return {
    name: person.name || defaultStagePerson(0).name,
    title: person.title || 'Title / Role',
    accent: ACCENTS.includes(person.accent) ? person.accent : ACCENTS[0],
    photoSrc: person.photoSrc || '',
  }
}

/** Seed Flex defaults from classic 3 speakers + 3 panelists. */
export function seedStagePeopleFromLists(speakers = [], panelists = []) {
  const combined = [...speakers, ...panelists].map((person, i) => ({
    ...defaultStagePerson(i),
    ...clonePerson(person),
    accent: person?.accent || defaultStagePerson(i).accent,
  }))
  while (combined.length < DEFAULT_STAGE_PEOPLE_COUNT) {
    combined.push(defaultStagePerson(combined.length))
  }
  return combined.slice(0, DEFAULT_STAGE_PEOPLE_COUNT)
}

/**
 * Resolve visible stage people for a given count.
 * Preserves draft entries beyond count (not returned) so shrinking does not corrupt data.
 */
export function resolveStagePeople(draftPeople, count, seedPeople = []) {
  const n = clampStagePeopleCount(count)
  const source = Array.isArray(draftPeople) ? draftPeople : []
  const seed = Array.isArray(seedPeople) ? seedPeople : []
  const out = []
  for (let i = 0; i < n; i += 1) {
    const fallback = seed[i] || defaultStagePerson(i)
    out.push({
      ...clonePerson(fallback),
      ...(source[i] || {}),
      photoSrc: source[i]?.photoSrc ?? fallback.photoSrc ?? '',
      accent: ACCENTS.includes(source[i]?.accent)
        ? source[i].accent
        : fallback.accent || defaultStagePerson(i).accent,
    })
  }
  return out
}

/** Split people into recipe rows for balanced incomplete-row centering. */
export function stagePeopleRowGroups(people, { includeConvener = true } = {}) {
  const list = Array.isArray(people) ? people : []
  const n = clampStagePeopleCount(list.length || DEFAULT_STAGE_PEOPLE_COUNT)
  const solo = includeConvener === false
  const recipe =
    (solo && STAGE_PEOPLE_ROWS_SOLO[list.length]) ||
    (solo && STAGE_PEOPLE_ROWS_SOLO[n]) ||
    STAGE_PEOPLE_ROWS[list.length] ||
    STAGE_PEOPLE_ROWS[n] ||
    [list.length]
  const rows = []
  let offset = 0
  for (const cols of recipe) {
    rows.push({
      cols,
      people: list.slice(offset, offset + cols),
    })
    offset += cols
  }
  return rows
}

export function stagePeopleLayoutClass(count) {
  return `e-flex-people--n${clampStagePeopleCount(count)}`
}
