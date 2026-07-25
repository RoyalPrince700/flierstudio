/** Cascade Stage Flex — dynamic stage people (1–10) with balanced row recipes. */

import { getFlierSize } from '../../lib/sizes'

export const STAGE_PEOPLE_MIN = 1
export const STAGE_PEOPLE_MAX = 10
export const DEFAULT_STAGE_PEOPLE_COUNT = 6

/** N≥9 switches Flex artboard to a growing landscape banner; N≤8 stays portrait. */
export const STAGE_FLEX_BANNER_MIN_COUNT = 9
export const STAGE_FLEX_PORTRAIT_SIZE_ID = 'instagram-portrait'

/** Banner strip: fixed portrait holders; artboard width grows with N (+ optional convener). */
export const STAGE_FLEX_BANNER_SLOT_W = 176
export const STAGE_FLEX_BANNER_SLOT_H = 320
export const STAGE_FLEX_BANNER_GAP = 12
/** Stage + card horizontal padding that wraps the people row. */
export const STAGE_FLEX_BANNER_PAD_X = 120
/** Header + hero + tall row + keywords + compact footer. */
export const STAGE_FLEX_BANNER_HEIGHT = 960

const ACCENTS = ['amber', 'orange', 'cyan']

/**
 * Explicit row recipes (column counts per row). Incomplete last rows are centered in CSS.
 * | N  | Layout (convener on)           | Solo override      |
 * | 1  | 1 centered                     | —                  |
 * | 2  | 1×2                            | —                  |
 * | 3  | 1×3                            | —                  |
 * | 4  | 1×4 (single row always)        | same ([4])         |
 * | 5  | 1×5 (single row always)        | same               |
 * | 6  | 3×2 (full-card; +cnv equal-w)  | —                  |
 * | 7  | 4 + 3 centered (equal slots)   | —                  |
 * | 8  | 4×2 (full-card; +cnv equal-w)  | —                  |
 * | 9  | 1×9 banner strip               | —                  |
 * | 10 | 1×10 banner strip              | —                  |
 */
export const STAGE_PEOPLE_ROWS = {
  1: [1],
  2: [2],
  3: [3],
  4: [4],
  5: [5],
  6: [3, 3],
  7: [4, 3],
  8: [4, 4],
  9: [9],
  10: [10],
}

/** Solo (no convener) overrides — kept for N=4 clarity (same recipe as with-convener). */
export const STAGE_PEOPLE_ROWS_SOLO = {
  4: [4],
}

export function clampStagePeopleCount(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return DEFAULT_STAGE_PEOPLE_COUNT
  return Math.min(STAGE_PEOPLE_MAX, Math.max(STAGE_PEOPLE_MIN, Math.round(v)))
}

/** True when Flex should use the landscape banner canvas. */
export function isStageFlexBannerCount(count) {
  return clampStagePeopleCount(count) >= STAGE_FLEX_BANNER_MIN_COUNT
}

/**
 * Resolved export / artboard size for Cascade Stage Flex.
 * N≤8 → 1080×1350 portrait.
 * N≥9 → landscape banner; width wraps one portrait row (+ convener when on).
 */
export function resolveStageFlexBoardSize(count, { includeConvener = true } = {}) {
  const n = clampStagePeopleCount(count)
  if (!isStageFlexBannerCount(n)) {
    return getFlierSize(STAGE_FLEX_PORTRAIT_SIZE_ID)
  }

  const withConvener = includeConvener !== false
  const holders = withConvener ? n + 1 : n
  const gaps = Math.max(0, holders - 1)
  const rowWidth =
    holders * STAGE_FLEX_BANNER_SLOT_W + gaps * STAGE_FLEX_BANNER_GAP
  const width = STAGE_FLEX_BANNER_PAD_X + rowWidth

  return {
    id: 'emergence-flex-banner',
    label: `Emergence Flex Banner (${n}${withConvener ? '+cnv' : ' solo'})`,
    width,
    height: STAGE_FLEX_BANNER_HEIGHT,
    platform: 'portfolio',
    slotWidth: STAGE_FLEX_BANNER_SLOT_W,
    slotHeight: STAGE_FLEX_BANNER_SLOT_H,
    gap: STAGE_FLEX_BANNER_GAP,
  }
}

/** CSS custom properties for the N≥9 single-row banner strip. */
export function stageFlexBannerCssVars(count, { includeConvener = true } = {}) {
  if (!isStageFlexBannerCount(count)) return {}
  const withConvener = includeConvener !== false
  return {
    '--e-flex-banner-slot-w': `${STAGE_FLEX_BANNER_SLOT_W}px`,
    '--e-flex-banner-slot-h': `${STAGE_FLEX_BANNER_SLOT_H}px`,
    '--e-flex-col-gap': `${STAGE_FLEX_BANNER_GAP}px`,
    '--e-flex-row-gap': '0px',
    '--e-flex-ref-h': `${STAGE_FLEX_BANNER_SLOT_H}px`,
    '--e-flex-convener-h': `${STAGE_FLEX_BANNER_SLOT_H + 8}px`,
    '--e-flex-slot-basis': `${STAGE_FLEX_BANNER_SLOT_W}px`,
    '--e-flex-banner-holders': String(
      withConvener ? clampStagePeopleCount(count) + 1 : clampStagePeopleCount(count),
    ),
  }
}

/** Detect any Emergence Flex board (Cascade Stage Flex or Cascade Flex Updated). */
export function isEmergenceCascadeStageFlexItem(item) {
  if (!item) return false
  if (item.props?.stageFlex === true) return true
  const id = String(item.id || '')
  const sourceId = String(item.sourceId || '')
  return (
    id === 'emergence-cascade-stage-flex' ||
    sourceId === 'emergence-cascade-stage-flex' ||
    id === 'emergence-cascade-flex-updated' ||
    sourceId === 'emergence-cascade-flex-updated' ||
    id.includes('cascade-stage-flex') ||
    sourceId.includes('cascade-stage-flex') ||
    id.includes('cascade-flex-updated') ||
    sourceId.includes('cascade-flex-updated')
  )
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
