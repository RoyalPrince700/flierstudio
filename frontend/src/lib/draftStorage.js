/**
 * Persistent draft storage via IndexedDB (large quota).
 * Migrates once from the old localStorage key, then clears it.
 */

const DRAFTS_KEY = 'flier-studio-drafts'
const DB_NAME = 'flier-studio'
const DB_VERSION = 1
const STORE = 'drafts'
const RECORD_ID = 'all'

const EMERGENCE_ITEM_IDS = [
  'emergence-classic',
  'emergence-cascade',
  'emergence-stage-grid',
  'emergence-cascade-grid',
  'emergence-cascade-stage',
]

function isArtboardDraftMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  if (value.event || value.speakers || value.panelists) return false
  const keys = Object.keys(value)
  if (!keys.length) return true
  return keys.every(
    (key) => value[key] && typeof value[key] === 'object' && !Array.isArray(value[key]),
  )
}

/** Normalize raw saved JSON into drafts[projectId][itemId]. */
export function normalizeDrafts(parsed) {
  if (!parsed || typeof parsed !== 'object') return {}

  const next = {}
  for (const [projectId, value] of Object.entries(parsed)) {
    if (!value || typeof value !== 'object') continue

    if (isArtboardDraftMap(value)) {
      // Deep-clone each artboard so boards never share object references.
      next[projectId] = Object.fromEntries(
        Object.entries(value).map(([itemId, draft]) => [itemId, structuredClone(draft)]),
      )
      continue
    }

    if (projectId === 'emergence' && value.event) {
      const perBoard = {}
      EMERGENCE_ITEM_IDS.forEach((id) => {
        perBoard[id] = structuredClone(value)
      })
      next[projectId] = perBoard
      continue
    }

    if (value.event || Object.keys(value).some((k) => typeof value[k] === 'string')) {
      next[projectId] = { _legacy: value }
    }
  }
  return next
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('IndexedDB open failed'))
  })
}

function idbGet(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(RECORD_ID)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => reject(req.error || new Error('IndexedDB read failed'))
  })
}

function idbPut(db, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(value, RECORD_ID)
    tx.oncomplete = () => resolve(true)
    tx.onerror = () => reject(tx.error || new Error('IndexedDB write failed'))
  })
}

function readLegacyLocalStorage() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function clearLegacyLocalStorage() {
  try {
    localStorage.removeItem(DRAFTS_KEY)
  } catch {
    // ignore
  }
}

/**
 * Re-encode oversized data URLs so migrated drafts fit and load faster.
 */
async function shrinkDataUrl(dataUrl, { maxEdge = 1400, quality = 0.82 } = {}) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) return dataUrl
  // Skip already-small payloads (~300KB text ≈ fine)
  if (dataUrl.length < 350_000) return dataUrl

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
      const width = Math.max(1, Math.round(img.width * scale))
      const height = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      const preferPng = dataUrl.startsWith('data:image/png')
      resolve(
        preferPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality),
      )
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

async function shrinkDraftImages(value) {
  if (typeof value === 'string') return shrinkDataUrl(value)
  if (!value || typeof value !== 'object') return value
  if (Array.isArray(value)) {
    return Promise.all(value.map((entry) => shrinkDraftImages(entry)))
  }
  const next = {}
  for (const [key, entry] of Object.entries(value)) {
    next[key] = await shrinkDraftImages(entry)
  }
  return next
}

/**
 * Load drafts: IndexedDB first, then migrate localStorage once.
 */
export async function loadSavedDrafts() {
  try {
    const db = await openDb()
    const stored = await idbGet(db)
    if (stored && typeof stored === 'object') {
      db.close()
      clearLegacyLocalStorage()
      return normalizeDrafts(stored)
    }

    const legacy = readLegacyLocalStorage()
    if (legacy) {
      const normalized = normalizeDrafts(legacy)
      const shrunk = await shrinkDraftImages(normalized)
      await idbPut(db, shrunk)
      clearLegacyLocalStorage()
      db.close()
      return shrunk
    }

    db.close()
    return {}
  } catch (err) {
    console.error('Failed to load drafts from IndexedDB', err)
    const legacy = readLegacyLocalStorage()
    if (!legacy) return {}
    try {
      const normalized = normalizeDrafts(legacy)
      return await shrinkDraftImages(normalized)
    } catch {
      return normalizeDrafts(legacy)
    }
  }
}

/**
 * Persist drafts to IndexedDB. Returns false only if write fails.
 */
export async function saveDrafts(drafts) {
  try {
    const db = await openDb()
    await idbPut(db, drafts)
    db.close()
    clearLegacyLocalStorage()
    return true
  } catch (err) {
    console.error('Failed to save drafts to IndexedDB', err)
    return false
  }
}

/**
 * Read + compress an image for flier slots.
 * Resizes long edge and encodes as JPEG (or PNG if transparency likely).
 */
export async function readImageAsDataUrl(
  file,
  { maxEdge = 1400, quality = 0.82 } = {},
) {
  const preferPng = file.type === 'image/png'
  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // Fallback: raw FileReader without compression
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(reader.error || new Error('Could not read image'))
      reader.readAsDataURL(file)
    })
  }

  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Could not process image')
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const mime = preferPng ? 'image/png' : 'image/jpeg'
  const dataUrl = preferPng ? canvas.toDataURL(mime) : canvas.toDataURL(mime, quality)
  return dataUrl
}
