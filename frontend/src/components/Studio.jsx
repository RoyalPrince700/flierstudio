import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CircleHelp,
  Copy,
  CopyPlus,
  Download,
  Layers,
  LogOut,
  Maximize2,
  Moon,
  MoreHorizontal,
  Sun,
} from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useMediaQuery } from '../lib/useMediaQuery'
import { trackFlierDownload } from '../lib/gtm'
import { LiftoffMark } from '../fliers/flier-studio/FSLogo'
import { fsTokens } from '../design/flierStudioTokens'
import {
  DEFAULT_HD_SCALE,
  EXPORT_PROGRESS,
  HD_SCALES,
  exportFlier,
} from '../lib/exportFlier'
import {
  buildEditViewModel,
  clearArtboardDraft,
  copyArtboardDraft,
  getArtboardDraft,
  getByPath,
  getItemEditKind,
  loadSavedDrafts,
  mergeEmergenceDraft,
  mergePropsDraft,
  patchArtboardDraft,
  readImageAsDataUrl,
  saveDrafts,
  setArtboardAlignment,
} from '../lib/flierDraft'
import {
  DEFAULT_IMAGE_FIT,
  clampImageFit,
  imageFitDraftPath,
} from '../lib/imageFit'
import {
  clampLogoLayout,
  DEFAULT_LOGO_LAYOUT,
  isLogoImagePath,
} from '../lib/logoLayout'
import {
  DEFAULT_EMERGENCE_COLOR_THEME,
} from '../design/emergenceThemes'
import { DEFAULT_BRAND_LOGO_SRC } from '../design/defaultBrandLogo'
import {
  addTemplateLayer,
  deleteBoardLayer,
  duplicateBoardLayer,
  loadBoardLayouts,
  resolveProjectBoard,
  saveBoardLayouts,
  syncBoardLayoutWithProject,
  TEMPLATE_WORKSPACE_ID,
} from '../lib/boardLayout'
import {
  cloneStudioSnapshot,
  createStudioHistory,
  pushStudioHistory,
  redoStudioHistory,
  undoStudioHistory,
} from '../lib/studioHistory'
import {
  getProject,
  PROJECT_MAP,
} from '../projects/registry'
import {
  filterTemplateCollections,
  getTemplate,
  getTemplateCollection,
  listTemplateCollections,
} from '../samples/registry'
import { useTemplatePublish } from '../lib/templatePublish'
import { hasSeenStudioTour } from '../lib/studioTour'
import TemplatesBoard from './TemplatesBoard'
import Artboard from './studio/Artboard'
import ConfirmDialog from './studio/ConfirmDialog'
import ExportProgress from './studio/ExportProgress'
import Inspector from './studio/Inspector'
import MobileTextEditor from './studio/MobileTextEditor'
import ProjectTabs from './studio/ProjectTabs'
import StudioHelp from './studio/StudioHelp'
import StudioTour from './studio/StudioTour'
import ThemeRail from './studio/ThemeRail'
import ToolCoachToast from './studio/ToolCoachToast'
import ToolRail from './studio/ToolRail'
import { useToolCoach } from './studio/useToolCoach'
import './Studio.css'

const TABS_KEY_LEGACY = 'flier-studio-open-tabs'
const INSPECTOR_COLLAPSED_KEY = 'flier-studio-inspector-collapsed'
/** Brand-new accounts within this window never inherit legacy shared tabs. */
const NEW_USER_TAB_GUARD_MS = 15 * 60 * 1000

function tabsStorageKey(userId) {
  return userId ? `flier-studio-open-tabs:${userId}` : null
}

function isBrandNewAccount(user) {
  if (!user?.createdAt) return false
  const created = new Date(user.createdAt).getTime()
  if (Number.isNaN(created)) return false
  return Date.now() - created < NEW_USER_TAB_GUARD_MS
}

/** First name from Google display name, else email local-part, else friendly fallback. */
function displayFirstName(user) {
  const raw = String(user?.name || '').trim()
  if (raw) return raw.split(/\s+/)[0]
  const local = String(user?.email || '').split('@')[0].trim()
  if (local) return local.charAt(0).toUpperCase() + local.slice(1)
  return 'there'
}

function parseTabIds(raw) {
  try {
    const saved = JSON.parse(raw || 'null')
    if (Array.isArray(saved) && saved.length) {
      const valid = saved.filter((id) => PROJECT_MAP[id])
      if (valid.length) return valid
    }
  } catch {
    // ignore
  }
  return []
}

function readStoredTabs(user) {
  const userId = user?.id
  if (!userId) return []
  const key = tabsStorageKey(userId)
  if (!key) return []

  try {
    const scopedRaw = localStorage.getItem(key)
    if (scopedRaw != null) {
      return parseTabIds(scopedRaw)
    }

    const legacyRaw = localStorage.getItem(TABS_KEY_LEGACY)
    // New signups must not inherit another session's Emergence (etc.) tabs.
    if (!legacyRaw || isBrandNewAccount(user)) {
      if (legacyRaw && isBrandNewAccount(user)) {
        localStorage.removeItem(TABS_KEY_LEGACY)
      }
      return []
    }

    // Established account, first load after scoping: claim legacy once.
    localStorage.setItem(key, legacyRaw)
    localStorage.removeItem(TABS_KEY_LEGACY)
    return parseTabIds(legacyRaw)
  } catch {
    return []
  }
}

function clearLegacySharedTabs() {
  try {
    localStorage.removeItem(TABS_KEY_LEGACY)
  } catch {
    // ignore
  }
}

function createTabState(projectId) {
  const project = getProject(projectId)
  return {
    selectedId: project?.defaultItemId ?? null,
    zoom: 0.22,
    pan: { x: 64, y: 64 },
  }
}

export default function Studio({
  theme = 'dark',
  onThemeChange,
}) {
  const { user, logout, isAdmin } = useAuth()
  const userId = user?.id ?? null
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const frameRefs = useRef({})
  const shellRef = useRef(null)
  const panRef = useRef({ x: 64, y: 64 })
  const topbarMenuRef = useRef(null)
  const tabsUserRef = useRef(null)

  const isNarrow = useMediaQuery('(max-width: 900px)')
  const isPhone = useMediaQuery('(max-width: 640px)')

  const templatesOpen = location.pathname === '/templates'

  const [openTabIds, setOpenTabIds] = useState(() => readStoredTabs(user))
  const [activeProjectId, setActiveProjectId] = useState(
    () => readStoredTabs(user)[0] ?? null,
  )
  const [tabState, setTabState] = useState(() => {
    const initial = {}
    readStoredTabs(user).forEach((id) => {
      initial[id] = createTabState(id)
    })
    return initial
  })
  const [openTemplateCollectionId, setOpenTemplateCollectionId] = useState(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  const [primaryTool, setPrimaryTool] = useState('select')
  const [spaceHandActive, setSpaceHandActive] = useState(false)

  const {
    suggestion: toolCoachSuggestion,
    highlightTool: toolCoachHighlight,
    onCoachSignal,
    dismissCoach,
    acceptCoach,
  } = useToolCoach({
    isNarrow,
    // Skip while Space temporarily holds Hand — user already knows the tool
    enabled: !templatesOpen && !spaceHandActive,
    currentTool: primaryTool,
    onSwitchTool: (id) => {
      setPrimaryTool(id)
      setSpaceHandActive(false)
    },
  })
  const [format, setFormat] = useState('png')
  const [hdScaleId, setHdScaleId] = useState(DEFAULT_HD_SCALE)
  const [showLabels, setShowLabels] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [inspectorCollapsed, setInspectorCollapsed] = useState(() => {
    try {
      return localStorage.getItem(INSPECTOR_COLLAPSED_KEY) === '1'
    } catch {
      return false
    }
  })
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false)
  const [topbarMenuOpen, setTopbarMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportLabel, setExportLabel] = useState(EXPORT_PROGRESS.started.label)
  const [error, setError] = useState('')
  const [drafts, setDrafts] = useState({})
  const [draftsReady, setDraftsReady] = useState(false)
  const [boardLayouts, setBoardLayouts] = useState(() => loadBoardLayouts())
  const [deletePrompt, setDeletePrompt] = useState(null)
  const [noticePrompt, setNoticePrompt] = useState(null)
  const [focusedPath, setFocusedPath] = useState(null)
  const [focusedKind, setFocusedKind] = useState(null)
  const [pendingImagePath, setPendingImagePath] = useState(null)
  const fileInputRef = useRef(null)
  /** Sync guard — blocks duplicate exports before React re-renders `busy`. */
  const exportBusyRef = useRef(false)
  const draftsRef = useRef(drafts)
  const boardLayoutsRef = useRef(boardLayouts)
  const historyRef = useRef(createStudioHistory())

  draftsRef.current = drafts
  boardLayoutsRef.current = boardLayouts

  const recordHistory = useCallback((coalesceKey = null) => {
    pushStudioHistory(
      historyRef.current,
      cloneStudioSnapshot(draftsRef.current, boardLayoutsRef.current),
      coalesceKey,
    )
  }, [])

  const applyHistorySnapshot = useCallback((snapshot) => {
    if (!snapshot) return
    setDrafts(snapshot.drafts)
    setBoardLayouts(snapshot.boardLayouts)
    setFocusedPath(null)
    setFocusedKind(null)
  }, [])

  const undoChange = useCallback(() => {
    const previous = undoStudioHistory(
      historyRef.current,
      cloneStudioSnapshot(draftsRef.current, boardLayoutsRef.current),
    )
    applyHistorySnapshot(previous)
  }, [applyHistorySnapshot])

  const redoChange = useCallback(() => {
    const next = redoStudioHistory(
      historyRef.current,
      cloneStudioSnapshot(draftsRef.current, boardLayoutsRef.current),
    )
    applyHistorySnapshot(next)
  }, [applyHistorySnapshot])

  const project = activeProjectId ? getProject(activeProjectId) : null
  const resolvedBoard = useMemo(
    () =>
      project
        ? resolveProjectBoard(project, boardLayouts[activeProjectId])
        : { items: [], bounds: { width: 1000, height: 1000 } },
    [activeProjectId, boardLayouts, project],
  )
  const baseBoardItems = resolvedBoard.items
  const bounds = resolvedBoard.bounds ?? { width: 1000, height: 1000 }
  const currentTab = tabState[activeProjectId] ?? createTabState(activeProjectId)
  const selectedId = currentTab.selectedId
  const zoom = currentTab.zoom
  const pan = currentTab.pan
  panRef.current = pan
  const editEnabled = true
  const selectedBaseItem = selectedId
    ? baseBoardItems.find((item) => item.id === selectedId)
    : null
  const selectedEditKind = selectedId
    ? getItemEditKind(selectedBaseItem, activeProjectId)
    : 'props'

  const openTabs = useMemo(
    () => openTabIds.map((id) => getProject(id)).filter(Boolean),
    [openTabIds],
  )

  useEffect(() => {
    let cancelled = false
    loadSavedDrafts().then((saved) => {
      if (cancelled) return
      setDrafts(saved)
      setDraftsReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const getDraft = useCallback(
    (projectId, itemId) => getArtboardDraft(drafts, projectId, itemId),
    [drafts],
  )

  const patchDraft = useCallback(
    (projectId, itemId, path, value) => {
      const layout = boardLayouts[projectId]
      const { items } = resolveProjectBoard(getProject(projectId), layout)
      const item = items.find((entry) => entry.id === itemId)
      const editKind = getItemEditKind(item, projectId)
      recordHistory(`${projectId}:${itemId}:${path}`)
      setDrafts((prev) => patchArtboardDraft(prev, projectId, itemId, path, value, editKind))
    },
    [boardLayouts, recordHistory],
  )

  useEffect(() => {
    saveBoardLayouts(boardLayouts)
  }, [boardLayouts])

  /** Persist newly registered project boards into stale saved layouts. */
  useEffect(() => {
    if (!activeProjectId) return
    const projectRef = getProject(activeProjectId)
    if (!projectRef) return

    setBoardLayouts((prev) => {
      const current = prev[activeProjectId]
      const synced = syncBoardLayoutWithProject(current, projectRef)
      if (synced === current) return prev
      return { ...prev, [activeProjectId]: synced }
    })
  }, [activeProjectId])

  const handleDuplicateLayer = useCallback(
    (itemId) => {
      if (!activeProjectId || !itemId) return
      const projectRef = getProject(activeProjectId)
      const current = boardLayouts[activeProjectId]
      const { layout, newId: createdId } = duplicateBoardLayer(current, projectRef, itemId)
      if (!createdId) return
      recordHistory()
      setBoardLayouts((prev) => ({ ...prev, [activeProjectId]: layout }))
      setDrafts((prev) => copyArtboardDraft(prev, activeProjectId, itemId, createdId))
      setTabState((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...(prev[activeProjectId] ?? createTabState(activeProjectId)),
          selectedId: createdId,
        },
      }))
      setFocusedPath(null)
      setFocusedKind(null)
    },
    [activeProjectId, boardLayouts, recordHistory],
  )

  const handleDeleteLayer = useCallback(
    (itemId) => {
      if (!activeProjectId || !itemId) return
      const projectRef = getProject(activeProjectId)
      const current = boardLayouts[activeProjectId]
      const orderLen = current?.order?.length ?? projectRef?.boardItems?.length ?? 0
      if (orderLen <= 1) {
        setNoticePrompt({
          title: 'Can’t delete',
          message: 'Keep at least one layer on the board.',
        })
        return
      }
      const label =
        resolveProjectBoard(projectRef, current).items.find((i) => i.id === itemId)?.name ||
        'this layer'
      setDeletePrompt({ itemId, label })
    },
    [activeProjectId, boardLayouts],
  )

  const confirmDeleteLayer = useCallback(() => {
    if (!activeProjectId || !deletePrompt?.itemId) {
      setDeletePrompt(null)
      return
    }
    const itemId = deletePrompt.itemId
    const projectRef = getProject(activeProjectId)
    const current = boardLayouts[activeProjectId]
    const { layout, removedId, nextSelectedId } = deleteBoardLayer(
      current,
      projectRef,
      itemId,
    )
    setDeletePrompt(null)
    if (!removedId) return
    recordHistory()
    setBoardLayouts((prev) => ({ ...prev, [activeProjectId]: layout }))
    setDrafts((prev) => clearArtboardDraft(prev, activeProjectId, removedId))
    setTabState((prev) => {
      const tab = prev[activeProjectId] ?? createTabState(activeProjectId)
      if (tab.selectedId !== removedId) return prev
      return {
        ...prev,
        [activeProjectId]: { ...tab, selectedId: nextSelectedId },
      }
    })
    setFocusedPath(null)
    setFocusedKind(null)
    setError('')
  }, [activeProjectId, boardLayouts, deletePrompt, recordHistory])

  useEffect(() => {
    if (!draftsReady) return undefined
    let cancelled = false
    saveDrafts(drafts).then((ok) => {
      if (cancelled) return
      if (!ok) {
        setError('Could not save edits to browser storage. Try Reset on a few artboards, then re-add photos.')
      }
    })
    return () => {
      cancelled = true
    }
  }, [drafts, draftsReady])

  const handleFocusField = useCallback(
    (path, kind = 'text') => {
      setFocusedPath(path)
      setFocusedKind(kind)
      if (kind === 'text') {
        setPrimaryTool('text')
        setSpaceHandActive(false)
        // Keep artboard visible: close the inspector sheet while editing text on mobile.
        if (isNarrow) setMobileInspectorOpen(false)
      } else if (kind === 'image' && isNarrow) {
        // Logo / photo controls live in the Edit sheet on mobile.
        setMobileInspectorOpen(true)
      }
    },
    [isNarrow],
  )

  const frameFocusedTextInView = useCallback(
    (path) => {
      if (!isNarrow || !path || !selectedId || !activeProjectId) return
      const shell = shellRef.current
      const frame = frameRefs.current[selectedId]
      if (!shell || !frame) return
      const viewport = shell.querySelector('.artboard') || shell
      const el = frame.querySelector(`[data-edit-path="${CSS.escape(path)}"]`)
      if (!el) return

      const shellRect = viewport.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      // Reserve space for mobile text dock + bottom tool rail.
      const dockReserve = Math.min(200, shellRect.height * 0.38)
      const safe = {
        left: shellRect.left + 20,
        right: shellRect.right - 52,
        top: shellRect.top + 16,
        bottom: shellRect.bottom - dockReserve,
      }
      const fullyVisible =
        elRect.left >= safe.left &&
        elRect.right <= safe.right &&
        elRect.top >= safe.top &&
        elRect.bottom <= safe.bottom
      if (fullyVisible) return

      const targetX = (safe.left + safe.right) / 2
      const targetY = (safe.top + safe.bottom) / 2
      const dx = targetX - (elRect.left + elRect.width / 2)
      const dy = targetY - (elRect.top + elRect.height / 2)
      const currentPan = panRef.current
      // Gentle pan only — never change zoom (avoids extreme close-up).
      patchTab(activeProjectId, {
        pan: { x: currentPan.x + dx, y: currentPan.y + dy },
      })
    },
    [activeProjectId, isNarrow, selectedId],
  )

  useEffect(() => {
    if (!isNarrow || focusedKind !== 'text' || !focusedPath) return
    const id = window.requestAnimationFrame(() => frameFocusedTextInView(focusedPath))
    return () => window.cancelAnimationFrame(id)
  }, [focusedKind, focusedPath, frameFocusedTextInView, isNarrow])

  const handleExitTextEdit = useCallback(() => {
    setPrimaryTool((prev) => (prev === 'text' ? 'select' : prev))
    setFocusedPath(null)
    setFocusedKind(null)
  }, [])

  const handleAlignChange = useCallback(
    (textPath, align) => {
      if (!textPath || !selectedId) return
      recordHistory(`${activeProjectId}:${selectedId}:align:${textPath}`)
      setDrafts((prev) =>
        setArtboardAlignment(
          prev,
          activeProjectId,
          selectedId,
          textPath,
          align,
          selectedEditKind,
        ),
      )
      setPrimaryTool('text')
      setFocusedPath(textPath)
      setFocusedKind('text')
    },
    [activeProjectId, recordHistory, selectedEditKind, selectedId],
  )

  const handlePickImage = useCallback((path) => {
    setPendingImagePath(path)
    setFocusedPath(path)
    setFocusedKind('image')
    setPrimaryTool('select')
    // Must stay synchronous with the user gesture. Deferring (rAF) after a
    // confirm dialog unmounts drops activation and the picker never opens.
    fileInputRef.current?.click()
  }, [])

  const clearImageAt = useCallback(
    (projectId, itemId, path) => {
      if (!projectId || !itemId || !path) return
      const layout = boardLayouts[projectId]
      const { items } = resolveProjectBoard(getProject(projectId), layout)
      const item = items.find((entry) => entry.id === itemId)
      const editKind = getItemEditKind(item, projectId)
      const isEmergenceLogo = editKind === 'emergence' && isLogoImagePath(path)
      recordHistory(`${projectId}:${itemId}:${path}`)
      setDrafts((prev) => {
        let next = patchArtboardDraft(prev, projectId, itemId, path, '', editKind)
        // Brand logo: clear must empty the slot (not restore Flier Studio).
        if (isEmergenceLogo) {
          next = patchArtboardDraft(next, projectId, itemId, 'event.logoMode', 'none', editKind)
        }
        next = patchArtboardDraft(
          next,
          projectId,
          itemId,
          imageFitDraftPath(path),
          { ...DEFAULT_IMAGE_FIT },
          editKind,
        )
        return next
      })
    },
    [boardLayouts, recordHistory],
  )

  const handleClearImage = useCallback(
    (path) => {
      if (!selectedId) return
      clearImageAt(activeProjectId, selectedId, path)
    },
    [activeProjectId, clearImageAt, selectedId],
  )

  const handleImageFitChange = useCallback(
    (path, fit) => {
      if (!selectedId || !path) return
      patchDraft(
        activeProjectId,
        selectedId,
        imageFitDraftPath(path),
        clampImageFit(fit || DEFAULT_IMAGE_FIT),
      )
    },
    [activeProjectId, patchDraft, selectedId],
  )

  const handleLogoLayoutChange = useCallback(
    (layout) => {
      if (!selectedId) return
      patchDraft(
        activeProjectId,
        selectedId,
        'event.logoLayout',
        clampLogoLayout(layout || DEFAULT_LOGO_LAYOUT),
      )
    },
    [activeProjectId, patchDraft, selectedId],
  )

  const applyEmergenceBrand = useCallback(
    (projectId, itemId, { logoMode, logoSrc, wordmark, focusPath, focusKind }) => {
      if (!projectId || !itemId) return
      const layout = boardLayouts[projectId]
      const { items } = resolveProjectBoard(getProject(projectId), layout)
      const item = items.find((entry) => entry.id === itemId)
      const editKind = getItemEditKind(item, projectId)
      if (editKind !== 'emergence') return
      recordHistory(`${projectId}:${itemId}:event.logoMode`)
      setDrafts((prev) => {
        let next = prev
        if (logoMode != null) {
          next = patchArtboardDraft(next, projectId, itemId, 'event.logoMode', logoMode, editKind)
        }
        if (logoSrc !== undefined) {
          next = patchArtboardDraft(next, projectId, itemId, 'event.logoSrc', logoSrc, editKind)
        }
        if (wordmark != null) {
          next = patchArtboardDraft(next, projectId, itemId, 'event.wordmark', wordmark, editKind)
        }
        return next
      })
      if (focusPath) {
        setFocusedPath(focusPath)
        setFocusedKind(focusKind || (focusPath === 'event.wordmark' ? 'text' : 'image'))
      }
    },
    [boardLayouts, recordHistory],
  )

  const handleRestoreDefaultLogo = useCallback(
    (projectId, itemId) => {
      applyEmergenceBrand(projectId || activeProjectId, itemId || selectedId, {
        logoMode: 'image',
        logoSrc: DEFAULT_BRAND_LOGO_SRC,
        focusPath: 'event.logoSrc',
        focusKind: 'image',
      })
    },
    [activeProjectId, applyEmergenceBrand, selectedId],
  )

  const handleUseTextLogo = useCallback(
    (projectId, itemId) => {
      const pid = projectId || activeProjectId
      const iid = itemId || selectedId
      if (!pid || !iid) return
      const draft = getDraft(pid, iid)
      const merged = mergeEmergenceDraft(draft)
      const wordmark =
        merged.event?.wordmark?.trim() ||
        merged.event?.theme?.trim() ||
        'EMERGE'
      applyEmergenceBrand(pid, iid, {
        logoMode: 'text',
        wordmark,
        focusPath: 'event.wordmark',
        focusKind: 'text',
      })
    },
    [activeProjectId, applyEmergenceBrand, getDraft, selectedId],
  )

  const handleUseImageLogo = useCallback(
    (projectId, itemId) => {
      const pid = projectId || activeProjectId
      const iid = itemId || selectedId
      if (!pid || !iid) return
      const draft = getDraft(pid, iid)
      const merged = mergeEmergenceDraft(draft)
      const existing = typeof merged.event?.logoSrc === 'string' ? merged.event.logoSrc.trim() : ''
      applyEmergenceBrand(pid, iid, {
        logoMode: 'image',
        logoSrc: existing || DEFAULT_BRAND_LOGO_SRC,
        focusPath: 'event.logoSrc',
        focusKind: 'image',
      })
    },
    [activeProjectId, applyEmergenceBrand, getDraft, selectedId],
  )

  const handleResetDraft = useCallback(() => {
    if (!selectedId) return
    recordHistory()
    setDrafts((prev) => clearArtboardDraft(prev, activeProjectId, selectedId))
    setFocusedPath(null)
    setFocusedKind(null)
    setPrimaryTool('select')
    setError('')
  }, [activeProjectId, recordHistory, selectedId])

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0]
      const path = pendingImagePath
      e.target.value = ''
      setPendingImagePath(null)
      if (!file || !path || !selectedId) return

      const okType =
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        /\.(png|jpe?g)$/i.test(file.name)
      if (!okType) {
        setError('Please choose a PNG or JPEG image.')
        return
      }

      try {
        const dataUrl = await readImageAsDataUrl(file)
        if (!dataUrl) {
          setError('Could not read that image.')
          return
        }
        const layout = boardLayouts[activeProjectId]
        const { items } = resolveProjectBoard(getProject(activeProjectId), layout)
        const item = items.find((entry) => entry.id === selectedId)
        const editKind = getItemEditKind(item, activeProjectId)
        recordHistory(`${activeProjectId}:${selectedId}:${path}`)
        setDrafts((prev) => {
          let next = patchArtboardDraft(
            prev,
            activeProjectId,
            selectedId,
            path,
            dataUrl,
            editKind,
          )
          // Brand logo upload switches into image mode.
          if (editKind === 'emergence' && isLogoImagePath(path)) {
            next = patchArtboardDraft(
              next,
              activeProjectId,
              selectedId,
              'event.logoMode',
              'image',
              editKind,
            )
          }
          // New / replaced image starts at exact cover crop
          next = patchArtboardDraft(
            next,
            activeProjectId,
            selectedId,
            imageFitDraftPath(path),
            { ...DEFAULT_IMAGE_FIT },
            editKind,
          )
          return next
        })
        setError('')
      } catch (err) {
        console.error(err)
        setError('Could not process that image. Try a different PNG or JPEG.')
      }
    },
    [activeProjectId, boardLayouts, pendingImagePath, recordHistory, selectedId],
  )

  const boardItems = useMemo(() => {
    const items = baseBoardItems
    return items.map((item) => {
      const editKind = getItemEditKind(item, activeProjectId)
      const draft = getDraft(activeProjectId, item.id)
      const alignments =
        editKind === 'emergence'
          ? mergeEmergenceDraft(draft).alignments
          : mergePropsDraft(item.props || {}, draft).alignments

      const imageFits =
        editKind === 'emergence'
          ? mergeEmergenceDraft(draft).imageFits
          : mergePropsDraft(item.props || {}, draft).imageFits

      const studioEdit = {
        enabled: !spaceHandActive && (primaryTool === 'select' || primaryTool === 'text'),
        focusedPath: selectedId === item.id ? focusedPath : null,
        alignments: alignments || {},
        imageFits: imageFits || {},
        canvasReadOnly: isNarrow,
        onFocusField: (path, kind) => {
          if (selectedId !== item.id) {
            patchTab(activeProjectId, { selectedId: item.id })
          }
          handleFocusField(path, kind)
        },
        onChange: (path, value) => {
          patchDraft(activeProjectId, item.id, path, value)
        },
        onPickImage: (path) => {
          if (selectedId !== item.id) {
            patchTab(activeProjectId, { selectedId: item.id })
          }
          handlePickImage(path)
        },
        onClearImage: (path) => {
          if (selectedId !== item.id) {
            patchTab(activeProjectId, { selectedId: item.id })
          }
          clearImageAt(activeProjectId, item.id, path)
        },
        onImageFitChange: (path, fit) => {
          if (selectedId !== item.id) {
            patchTab(activeProjectId, { selectedId: item.id })
          }
          patchDraft(
            activeProjectId,
            item.id,
            imageFitDraftPath(path),
            clampImageFit(fit || DEFAULT_IMAGE_FIT),
          )
        },
        onLogoLayoutChange: (layout) => {
          if (selectedId !== item.id) {
            patchTab(activeProjectId, { selectedId: item.id })
          }
          patchDraft(
            activeProjectId,
            item.id,
            'event.logoLayout',
            clampLogoLayout(layout || DEFAULT_LOGO_LAYOUT),
          )
        },
        onRestoreDefaultLogo: () => {
          if (selectedId !== item.id) {
            patchTab(activeProjectId, { selectedId: item.id })
          }
          handleRestoreDefaultLogo(activeProjectId, item.id)
        },
        onUseTextLogo: () => {
          if (selectedId !== item.id) {
            patchTab(activeProjectId, { selectedId: item.id })
          }
          handleUseTextLogo(activeProjectId, item.id)
        },
        onUseImageLogo: () => {
          if (selectedId !== item.id) {
            patchTab(activeProjectId, { selectedId: item.id })
          }
          handleUseImageLogo(activeProjectId, item.id)
        },
        onExitTextEdit: handleExitTextEdit,
      }

      if (editKind === 'emergence') {
        return {
          ...item,
          props: {
            ...item.props,
            content: mergeEmergenceDraft(draft),
            studioEdit,
          },
        }
      }

      const merged = mergePropsDraft(item.props || {}, draft)
      return {
        ...item,
        props: {
          ...merged,
          studioEdit,
        },
      }
    })
  }, [
    activeProjectId,
    baseBoardItems,
    clearImageAt,
    focusedPath,
    getDraft,
    handleExitTextEdit,
    handleFocusField,
    handlePickImage,
    handleRestoreDefaultLogo,
    handleUseImageLogo,
    handleUseTextLogo,
    isNarrow,
    patchDraft,
    primaryTool,
    selectedId,
    spaceHandActive,
  ])

  const selected = useMemo(
    () => boardItems.find((item) => item.id === selectedId) || null,
    [boardItems, selectedId],
  )

  useEffect(() => {
    if (!baseBoardItems.length) return
    if (selectedId && baseBoardItems.some((item) => item.id === selectedId)) return
    patchTab(activeProjectId, { selectedId: baseBoardItems[0].id })
  }, [activeProjectId, baseBoardItems, selectedId])

  const editContent = useMemo(
    () => buildEditViewModel(selected, getDraft(activeProjectId, selectedId), activeProjectId),
    [activeProjectId, getDraft, selected, selectedId],
  )

  const tool = spaceHandActive ? 'hand' : primaryTool

  useEffect(() => {
    setFocusedPath(null)
    setFocusedKind(null)
    setPrimaryTool((prev) => (prev === 'text' ? 'select' : prev))
  }, [activeProjectId])

  const { collectionPublishMap, includeUnpublished, loading: publishLoading } = useTemplatePublish()
  const templateCollections = useMemo(
    () =>
      filterTemplateCollections(listTemplateCollections(), {
        collectionPublishMap,
        includeUnpublished,
      }),
    [includeUnpublished, collectionPublishMap],
  )
  const openTemplateCollection = openTemplateCollectionId
    ? getTemplateCollection(openTemplateCollectionId)
    : null
  const openTemplateCollectionFiltered =
    openTemplateCollection &&
    (includeUnpublished ||
      (collectionPublishMap[openTemplateCollection.id] ?? 'draft') === 'published')
      ? {
          ...openTemplateCollection,
          publishStatus: collectionPublishMap[openTemplateCollection.id] ?? 'draft',
        }
      : null

  const templatesInspectorItems = useMemo(() => {
    if (openTemplateCollectionFiltered) {
      return openTemplateCollectionFiltered.templates.map((template) => ({
        id: template.id,
        name: template.name,
        meta: template.sizeLabel,
        group: template.sizeLabel,
      }))
    }
    return templateCollections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      meta: `${collection.templateCount} templates`,
      group: collection.brand,
      color: collection.color,
    }))
  }, [openTemplateCollectionFiltered, templateCollections])

  useEffect(() => {
    // Drop the pre-scoping shared key after the current user has been considered.
    // Brand-new accounts already ignore it inside readStoredTabs.
    if (userId && !isBrandNewAccount(user)) {
      clearLegacySharedTabs()
    }
  }, [user, userId])

  useEffect(() => {
    if (!userId || tabsUserRef.current === userId) return
    tabsUserRef.current = userId
    const tabs = readStoredTabs(user)
    setOpenTabIds(tabs)
    setActiveProjectId(tabs[0] ?? null)
    setTabState(() => {
      const initial = {}
      tabs.forEach((id) => {
        initial[id] = createTabState(id)
      })
      return initial
    })
    frameRefs.current = {}
  }, [user, userId])

  useEffect(() => {
    const key = tabsStorageKey(userId)
    if (!key) return
    try {
      localStorage.setItem(key, JSON.stringify(openTabIds))
    } catch {
      // ignore
    }
  }, [openTabIds, userId])

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#/samples' || hash === '#samples' || hash === '#/templates' || hash === '#templates') {
      navigate('/templates', { replace: true })
      return
    }
    if (hash === '#/admin' || hash === '#admin') {
      navigate(isAdmin ? '/admin/overview' : '/studio', { replace: true })
      return
    }
    if (hash === '#/' || hash === '#') {
      navigate('/studio', { replace: true })
    }
  }, [navigate, isAdmin])

  /* Non-admins only restore tabs they can access: starter workspace or published collections. */
  useEffect(() => {
    if (isAdmin || publishLoading) return
    setOpenTabIds((prev) => {
      const next = prev.filter((id) => {
        if (id === TEMPLATE_WORKSPACE_ID) return true
        return (collectionPublishMap[id] ?? 'draft') === 'published'
      })
      return next.length === prev.length ? prev : next
    })
  }, [isAdmin, publishLoading, collectionPublishMap])

  useEffect(() => {
    if (isAdmin || publishLoading) return
    if (!activeProjectId) return
    const allowed =
      activeProjectId === TEMPLATE_WORKSPACE_ID ||
      (collectionPublishMap[activeProjectId] ?? 'draft') === 'published'
    if (allowed && openTabIds.includes(activeProjectId)) return
    setActiveProjectId(openTabIds[0] ?? null)
  }, [activeProjectId, collectionPublishMap, isAdmin, openTabIds, publishLoading])

  useEffect(() => {
    if (!templatesOpen) {
      setOpenTemplateCollectionId(null)
      setSelectedTemplateId(null)
    }
  }, [templatesOpen])

  function toggleTheme() {
    onThemeChange?.(theme === 'dark' ? 'light' : 'dark')
  }

  function toggleTemplates() {
    if (templatesOpen) {
      navigate('/studio')
      return
    }
    navigate('/templates')
  }

  function patchTab(projectId, patch) {
    setTabState((prev) => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] ?? createTabState(projectId)),
        ...patch,
      },
    }))
  }

  const fitToScreen = useCallback(() => {
    const shell = shellRef.current
    if (!shell || !project) return
    const rect = shell.getBoundingClientRect()
    const pad = 72
    const scaleX = (rect.width - pad * 2) / bounds.width
    const scaleY = (rect.height - pad * 2) / bounds.height
    const nextZoom = Math.min(scaleX, scaleY, 1)
    patchTab(activeProjectId, {
      zoom: nextZoom,
      pan: {
        x: (rect.width - bounds.width * nextZoom) / 2,
        y: (rect.height - bounds.height * nextZoom) / 2,
      },
    })
  }, [activeProjectId, bounds.height, bounds.width, project])

  useEffect(() => {
    fitToScreen()
  }, [activeProjectId]) // eslint-disable-line react-hooks/exhaustive-deps -- fit when switching projects

  useEffect(() => {
    function onResize() {
      fitToScreen()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [fitToScreen])

  const openTemplateInStudio = useCallback(
    (template) => {
      const full = getTemplate(template.id) || template
      if (!full?.Component) return

      const publishStatus = collectionPublishMap[full.collectionId] ?? 'draft'
      if (!isAdmin && publishStatus !== 'published') {
        setError('This template group is not available yet.')
        return
      }

      navigate('/studio')
      setOpenTemplateCollectionId(null)
      setSelectedTemplateId(null)
      frameRefs.current = {}
      setError('')

      if (full.source === 'project') {
        const projectId = full.collectionId
        const projectRef = getProject(projectId)
        if (projectRef) {
          const currentLayout = boardLayoutsRef.current[projectId]
          const synced = syncBoardLayoutWithProject(currentLayout, projectRef)
          if (synced !== currentLayout) {
            setBoardLayouts((prev) => ({ ...prev, [projectId]: synced }))
          }
        }
        setOpenTabIds((prev) => (prev.includes(projectId) ? prev : [...prev, projectId]))
        setTabState((prev) => ({
          ...prev,
          [projectId]: {
            ...(prev[projectId] ?? createTabState(projectId)),
            selectedId: full.id,
          },
        }))
        setActiveProjectId(projectId)
        return
      }

      const workspaceId = TEMPLATE_WORKSPACE_ID
      const projectRef = getProject(workspaceId)
      if (!projectRef) return

      const currentLayout = boardLayoutsRef.current[workspaceId]
      const { layout, newId } = addTemplateLayer(currentLayout, projectRef, full)
      if (!newId) return

      recordHistory()
      setBoardLayouts((prev) => ({ ...prev, [workspaceId]: layout }))
      setOpenTabIds((prev) => (prev.includes(workspaceId) ? prev : [...prev, workspaceId]))
      setTabState((prev) => ({
        ...prev,
        [workspaceId]: {
          ...(prev[workspaceId] ?? createTabState(workspaceId)),
          selectedId: newId,
        },
      }))
      setActiveProjectId(workspaceId)
    },
    [isAdmin, navigate, collectionPublishMap, recordHistory],
  )

  useEffect(() => {
    const collectionId = searchParams.get('collection')
    if (!collectionId || !templatesOpen) return
    setOpenTemplateCollectionId(collectionId)
    setSelectedTemplateId(null)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('collection')
      return next
    }, { replace: true })
  }, [searchParams, setSearchParams, templatesOpen])

  useEffect(() => {
    const templateId = searchParams.get('template')
    if (!templateId || !draftsReady) return
    const template = getTemplate(templateId)
    if (!template) return
    openTemplateInStudio(template)
    setSearchParams({}, { replace: true })
  }, [draftsReady, openTemplateInStudio, searchParams, setSearchParams])

  function handleTemplatesInspectorSelect(id) {
    if (openTemplateCollectionFiltered) {
      const template = openTemplateCollectionFiltered.templates.find((entry) => entry.id === id)
      if (template) openTemplateInStudio(template)
      return
    }
    setOpenTemplateCollectionId(id)
    setSelectedTemplateId(null)
  }

  const closeProject = useCallback(
    (projectId) => {
      setOpenTabIds((prev) => {
        const next = prev.filter((id) => id !== projectId)
        if (activeProjectId === projectId) {
          const index = prev.indexOf(projectId)
          const fallback = next.length ? next[Math.max(0, index - 1)] : null
          setActiveProjectId(fallback)
          frameRefs.current = {}
        }
        if (!next.length) {
          navigate('/studio')
        }
        return next
      })
      setTabState((prev) => {
        const next = { ...prev }
        delete next[projectId]
        return next
      })
    },
    [activeProjectId, navigate],
  )

  const handleExport = useCallback(async () => {
    if (!selected || exportBusyRef.current) return
    const node = frameRefs.current[selected.id]
    if (!node) {
      setError('Could not find the selected artboard.')
      return
    }

    exportBusyRef.current = true
    setBusy(true)
    setExportProgress(EXPORT_PROGRESS.started.progress)
    setExportLabel(EXPORT_PROGRESS.started.label)
    setError('')
    try {
      const scale = HD_SCALES[hdScaleId]?.scale ?? 3
      await exportFlier(node, {
        format,
        filename: `${selected.filename}-${Date.now()}`,
        width: selected.width,
        height: selected.height,
        scale,
        quality: 1,
        onProgress: ({ progress, label }) => {
          setExportProgress(progress)
          setExportLabel(label)
        },
      })
      trackFlierDownload({
        projectId: activeProjectId || '',
        designId: selected.sourceId || selected.id,
        format,
        hdScale: hdScaleId,
        width: selected.width,
        height: selected.height,
      })
      // Brief beat at 100% so completion reads before UI resets
      await new Promise((resolve) => window.setTimeout(resolve, 320))
    } catch (err) {
      console.error(err)
      setError('Export failed. Try again — if it keeps failing, check the console.')
      setExportProgress(0)
      setExportLabel(EXPORT_PROGRESS.started.label)
    } finally {
      exportBusyRef.current = false
      setBusy(false)
      setExportProgress(0)
    }
  }, [selected, format, hdScaleId, activeProjectId])

  const handleAction = useCallback(
    (actionId) => {
      if (actionId === 'zoomIn') {
        patchTab(activeProjectId, { zoom: Math.min(2.5, zoom * 1.12) })
      }
      if (actionId === 'zoomOut') {
        patchTab(activeProjectId, { zoom: Math.max(0.08, zoom / 1.12) })
      }
      if (actionId === 'fit') fitToScreen()
      if (actionId === 'zoom100') {
        patchTab(activeProjectId, { zoom: 1, pan: { x: 48, y: 48 } })
      }
    },
    [activeProjectId, fitToScreen, zoom],
  )

  useEffect(() => {
    function onKeyDown(e) {
      const tag = e.target?.tagName
      const inContentEditable = Boolean(e.target?.isContentEditable)
      const inFormField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'

      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        // Canvas text editing uses contentEditable — leave native caret undo alone until blur commits
        if (inContentEditable) return
        e.preventDefault()
        if (e.shiftKey) redoChange()
        else undoChange()
        return
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        if (inContentEditable) return
        e.preventDefault()
        redoChange()
        return
      }

      if (e.key === 'Escape') {
        if (isNarrow && focusedKind === 'text' && focusedPath) {
          handleExitTextEdit()
          return
        }
        if (mobileInspectorOpen) {
          setMobileInspectorOpen(false)
          return
        }
        if (topbarMenuOpen) {
          setTopbarMenuOpen(false)
          return
        }
      }

      if (inFormField || inContentEditable) return

      if (e.code === 'Space') {
        setSpaceHandActive(true)
        return
      }

      if (e.key === 'v' || e.key === 'V') setPrimaryTool('select')
      if (e.key === 't' || e.key === 'T') setPrimaryTool('text')
      if (e.key === 'h' || e.key === 'H') setPrimaryTool('hand')
      if (e.key === 'Escape' && primaryTool === 'text') {
        setPrimaryTool('select')
        setFocusedPath(null)
        setFocusedKind(null)
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }
      if (e.key === '+' || e.key === '=') handleAction('zoomIn')
      if (e.key === '-' || e.key === '_') handleAction('zoomOut')
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault()
        handleAction('fit')
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault()
        handleAction('zoom100')
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault()
        handleExport()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault()
        navigate('/templates')
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault()
        if (activeProjectId) closeProject(activeProjectId)
      }
    }

    function onKeyUp(e) {
      if (e.code === 'Space') {
        setSpaceHandActive(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [
    activeProjectId,
    closeProject,
    focusedKind,
    focusedPath,
    handleAction,
    handleExitTextEdit,
    handleExport,
    isNarrow,
    mobileInspectorOpen,
    navigate,
    primaryTool,
    redoChange,
    topbarMenuOpen,
    undoChange,
  ])

  useEffect(() => {
    if (!isNarrow) {
      setMobileInspectorOpen(false)
      setTopbarMenuOpen(false)
    }
  }, [isNarrow])

  useEffect(() => {
    if (!topbarMenuOpen) return undefined
    function onPointerDown(e) {
      if (topbarMenuRef.current && !topbarMenuRef.current.contains(e.target)) {
        setTopbarMenuOpen(false)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [topbarMenuOpen])

  useEffect(() => {
    if (hasSeenStudioTour()) return undefined
    // First-time tour starts on empty /studio welcome — not templates-first.
    if (!openTabIds.length && location.pathname !== '/studio') {
      navigate('/studio', { replace: true })
    }
    const timer = window.setTimeout(() => setTourOpen(true), 600)
    return () => window.clearTimeout(timer)
    // First visit only — do not re-run when the user later opens a template.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openHelp() {
    setTopbarMenuOpen(false)
    setTourOpen(false)
    setHelpOpen(true)
  }

  function startTour() {
    setTopbarMenuOpen(false)
    setHelpOpen(false)
    // Replay: prefer empty-studio welcome when there is no open design.
    if (!openTabIds.length && location.pathname !== '/studio') {
      navigate('/studio')
    }
    setTourOpen(true)
  }

  function closeTour() {
    setTourOpen(false)
  }

  function toggleInspectorCollapsed() {
    setInspectorCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(INSPECTOR_COLLAPSED_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  function toggleMobileInspector() {
    setMobileInspectorOpen((open) => !open)
    setTopbarMenuOpen(false)
  }

  async function handleCopySize() {
    if (!selected) return
    const text = `${selected.width}×${selected.height}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      setError('Clipboard unavailable.')
    }
  }

  const mobileTextEditing =
    isNarrow && !templatesOpen && focusedKind === 'text' && Boolean(focusedPath)

  const mobileTextValue = useMemo(() => {
    if (!mobileTextEditing || !editContent || !focusedPath) return ''
    if (editContent.kind === 'emergence') return getByPath(editContent, focusedPath) ?? ''
    return getByPath(editContent.fields, focusedPath) ?? ''
  }, [editContent, focusedPath, mobileTextEditing])

  const showThemeRail =
    isNarrow &&
    !templatesOpen &&
    !mobileInspectorOpen &&
    editContent?.kind === 'emergence' &&
    Boolean(selected)

  const studioAppClass = [
    'studio-app',
    isNarrow ? 'studio-app--narrow' : '',
    isPhone ? 'studio-app--phone' : '',
    isNarrow && mobileInspectorOpen ? 'is-inspector-sheet-open' : '',
    mobileTextEditing ? 'is-mobile-text-editing' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const studioEmpty = !project && !templatesOpen
  const openingTemplate = studioEmpty && Boolean(searchParams.get('template'))
  const firstName = displayFirstName(user)

  if (openingTemplate) {
    return (
      <div className="studio-app" data-theme={theme}>
        <div className="studio-empty-state">
          <LiftoffMark
            size={40}
            base={theme === 'dark' ? fsTokens.colors.paper : fsTokens.colors.ink}
            corner={fsTokens.colors.signal}
          />
          <h1 className="studio-empty-state__title">Opening template…</h1>
          <p className="studio-empty-state__copy">Loading your design into the studio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={studioAppClass} data-theme={theme}>
      <header className="studio-topbar">
        <div className="studio-topbar__left">
          <strong className="studio-topbar__brand">Flier Studio</strong>
          <span className="studio-topbar__sep studio-topbar__sep--brand" />
          <span className="studio-topbar__context">
            {templatesOpen ? 'Templates' : project?.name ?? 'Studio'}
          </span>
          <button
            type="button"
            className={`studio-topbar__chip${templatesOpen ? ' is-active' : ''}`}
            onClick={toggleTemplates}
            title="Browse design templates"
            data-tour="templates"
          >
            Templates
          </button>
          {isAdmin ? (
            <Link
              to="/admin/overview"
              className="studio-topbar__chip studio-topbar__chip--desktop-only"
              title="Admin console"
            >
              Admin
            </Link>
          ) : null}
          {isNarrow ? (
            <button
              type="button"
              className={`studio-topbar__chip studio-topbar__chip--panel${
                mobileInspectorOpen ? ' is-active' : ''
              }`}
              onClick={toggleMobileInspector}
              title="Open layers, edit & export"
              aria-label="Open layers, edit and export"
              aria-pressed={mobileInspectorOpen}
              data-tour="panel"
            >
              <Layers size={14} strokeWidth={2.25} />
              <span>Edit</span>
            </button>
          ) : null}
        </div>
        <div className="studio-topbar__center">
          {templatesOpen
            ? openTemplateCollectionFiltered
              ? openTemplateCollectionFiltered.name
              : 'Template library'
            : studioEmpty
              ? 'Your studio'
              : selected
                ? selected.name
                : 'No selection'}
        </div>
        <div className="studio-topbar__right">
          <div className="studio-topbar__user studio-topbar__chip--desktop-only" title={user?.email || ''}>
            {user?.avatar ? (
              <img className="studio-topbar__avatar" src={user.avatar} alt="" referrerPolicy="no-referrer" />
            ) : null}
            <span className="studio-topbar__user-name">
              {user?.name || 'Signed in'}
              {isAdmin ? ' · Admin' : ''}
            </span>
          </div>
          <button
            type="button"
            className="studio-topbar__chip studio-topbar__chip--icon studio-topbar__chip--desktop-only"
            onClick={openHelp}
            title="Studio guide"
            aria-label="Studio guide"
          >
            <CircleHelp size={14} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className="studio-topbar__chip studio-topbar__chip--icon studio-topbar__chip--desktop-only"
            onClick={() => logout()}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className="studio-topbar__chip studio-topbar__chip--icon studio-topbar__chip--desktop-only"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={14} strokeWidth={2.25} /> : <Moon size={14} strokeWidth={2.25} />}
          </button>
          {!templatesOpen && !studioEmpty ? (
            <div className="studio-topbar__zoom studio-topbar__chip--desktop-only">
              <button type="button" className="studio-topbar__chip" onClick={() => handleAction('zoomOut')}>
                −
              </button>
              <button type="button" className="studio-topbar__chip studio-topbar__chip--wide" onClick={fitToScreen}>
                {Math.round(zoom * 100)}%
              </button>
              <button type="button" className="studio-topbar__chip" onClick={() => handleAction('zoomIn')}>
                +
              </button>
            </div>
          ) : null}

          <div className="studio-topbar__menu" ref={topbarMenuRef}>
            <button
              type="button"
              className={`studio-topbar__chip studio-topbar__chip--icon studio-topbar__menu-btn${
                topbarMenuOpen ? ' is-active' : ''
              }`}
              onClick={() => setTopbarMenuOpen((open) => !open)}
              title="More"
              aria-label="More actions"
              aria-expanded={topbarMenuOpen}
            >
              <MoreHorizontal size={16} strokeWidth={2.25} />
            </button>
            {topbarMenuOpen ? (
              <div className="studio-topbar__menu-panel" role="menu">
                <div className="studio-topbar__menu-user">
                  {user?.avatar ? (
                    <img
                      className="studio-topbar__avatar"
                      src={user.avatar}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <div>
                    <strong>{user?.name || 'Signed in'}</strong>
                    <small>{user?.email || (isAdmin ? 'Admin' : 'Member')}</small>
                  </div>
                </div>
                {isAdmin ? (
                  <Link
                    to="/admin/overview"
                    className="studio-topbar__menu-item"
                    role="menuitem"
                    onClick={() => setTopbarMenuOpen(false)}
                  >
                    Admin console
                  </Link>
                ) : null}
                {!templatesOpen && !studioEmpty ? (
                  <button
                    type="button"
                    className="studio-topbar__menu-item"
                    role="menuitem"
                    onClick={() => {
                      fitToScreen()
                      setTopbarMenuOpen(false)
                    }}
                  >
                    Fit canvas · {Math.round(zoom * 100)}%
                  </button>
                ) : null}
                <button
                  type="button"
                  className="studio-topbar__menu-item"
                  role="menuitem"
                  onClick={openHelp}
                >
                  Studio guide
                </button>
                <button
                  type="button"
                  className="studio-topbar__menu-item"
                  role="menuitem"
                  onClick={startTour}
                >
                  Replay quick tour
                </button>
                <button
                  type="button"
                  className="studio-topbar__menu-item"
                  role="menuitem"
                  onClick={() => {
                    toggleTheme()
                    setTopbarMenuOpen(false)
                  }}
                >
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
                <button
                  type="button"
                  className="studio-topbar__menu-item studio-topbar__menu-item--danger"
                  role="menuitem"
                  onClick={() => {
                    setTopbarMenuOpen(false)
                    logout()
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <ProjectTabs
        openTabs={openTabs}
        activeProjectId={templatesOpen ? null : activeProjectId}
        onSelect={(id) => {
          navigate('/studio')
          setOpenTemplateCollectionId(null)
          setSelectedTemplateId(null)
          setActiveProjectId(id)
          frameRefs.current = {}
          setError('')
        }}
        onClose={closeProject}
      />

      <div
        className={`studio-body${
          !isNarrow && inspectorCollapsed ? ' studio-body--inspector-collapsed' : ''
        }`}
      >
        <ToolRail
          tool={tool}
          theme={theme}
          onToolChange={(id) => {
            setPrimaryTool(id)
            setSpaceHandActive(false)
          }}
          onAction={handleAction}
          onExport={handleExport}
          onToggleTheme={toggleTheme}
          onOpenTemplates={toggleTemplates}
          templatesActive={templatesOpen}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels((v) => !v)}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid((v) => !v)}
          canExport={!templatesOpen && Boolean(selected)}
          busy={busy}
          exportProgress={exportProgress}
          exportLabel={exportLabel}
          onToggleInspector={isNarrow ? toggleMobileInspector : undefined}
          inspectorOpen={mobileInspectorOpen}
          highlightTool={toolCoachHighlight}
        />

        {/* Phone: thin Signal line above bottom tool dock — does not displace icons */}
        {isPhone && busy ? (
          <div className="studio-export-chrome" aria-live="polite">
            <ExportProgress progress={exportProgress} label={exportLabel} line />
          </div>
        ) : null}

        <div className="studio-shell" ref={shellRef} data-tour="canvas">
          {templatesOpen ? (
            <TemplatesBoard
              showGrid={showGrid}
              openCollectionId={openTemplateCollectionId}
              onOpenCollection={(id) => {
                setOpenTemplateCollectionId(id)
                setSelectedTemplateId(null)
              }}
              onCloseCollection={() => {
                setOpenTemplateCollectionId(null)
                setSelectedTemplateId(null)
              }}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
              onUseTemplate={openTemplateInStudio}
            />
          ) : studioEmpty ? (
            <div className="studio-empty-state">
              <LiftoffMark
                size={40}
                base={theme === 'dark' ? fsTokens.colors.paper : fsTokens.colors.ink}
                corner={fsTokens.colors.signal}
              />
              <h1 className="studio-empty-state__title">Welcome, {firstName}</h1>
              <p className="studio-empty-state__copy">
                Your studio is empty. Pick a template to begin.
              </p>
              <button
                type="button"
                className="studio-empty-state__cta"
                data-tour="templates-cta"
                onClick={() => navigate('/templates')}
              >
                Templates
              </button>
            </div>
          ) : (
            <Artboard
              items={boardItems}
              selectedId={selectedId}
              tool={tool}
              zoom={zoom}
              pan={pan}
              showLabels={showLabels}
              showGrid={showGrid}
              frameRefs={frameRefs}
              onSelect={(id) => patchTab(activeProjectId, { selectedId: id })}
              onPanChange={(next) => patchTab(activeProjectId, { pan: next })}
              onZoomChange={(next) => patchTab(activeProjectId, { zoom: next })}
              onExitTextEdit={handleExitTextEdit}
              onCoachSignal={onCoachSignal}
            />
          )}

          <ToolCoachToast
            suggestion={toolCoachSuggestion}
            onAccept={acceptCoach}
            onDismiss={dismissCoach}
          />

          {showThemeRail ? (
            <ThemeRail
              activeThemeId={editContent.colorTheme || DEFAULT_EMERGENCE_COLOR_THEME}
              onChange={(themeId) => {
                if (!selectedId) return
                patchDraft(activeProjectId, selectedId, 'colorTheme', themeId)
              }}
            />
          ) : null}

          {mobileTextEditing ? (
            <MobileTextEditor
              path={focusedPath}
              value={typeof mobileTextValue === 'string' ? mobileTextValue : ''}
              onChange={(path, value) => {
                if (!selectedId) return
                patchDraft(activeProjectId, selectedId, path, value)
              }}
              onDone={handleExitTextEdit}
            />
          ) : null}

          <footer className={`studio-statusbar${isNarrow ? ' studio-statusbar--mobile' : ''}`}>
            {templatesOpen ? (
              <>
                <span className="studio-statusbar__tool">Templates</span>
                <span className="studio-statusbar__primary">
                  {openTemplateCollectionFiltered
                    ? `${openTemplateCollectionFiltered.name} · ${openTemplateCollectionFiltered.templateCount} templates`
                    : 'Click a template to open it in the studio editor'}
                </span>
                <span className="studio-statusbar__meta">{templateCollections.length} collections</span>
                <span className="studio-statusbar__meta">{showGrid ? 'Grid on' : 'Grid off'}</span>
              </>
            ) : studioEmpty ? (
              <>
                <span className="studio-statusbar__tool">Studio</span>
                <span className="studio-statusbar__primary">
                  Pick a template to open your first design
                </span>
              </>
            ) : (
              <>
                <span className="studio-statusbar__tool">
                  {tool === 'hand' ? 'Hand' : tool === 'text' ? 'Text' : editEnabled ? 'Move' : 'Select'}
                </span>
                <span
                  className={`studio-statusbar__primary${error ? ' is-error' : ''}${busy ? ' is-busy' : ''}`}
                  aria-live="polite"
                >
                  {busy
                    ? `${exportLabel} ${Math.round(exportProgress * 100)}%`
                    : error
                      ? error
                      : selected
                        ? isNarrow
                          ? `${selected.name} · ${selected.width}×${selected.height}`
                          : `${selected.name} · artboard ${selected.width}×${selected.height} · export ${selected.width * (HD_SCALES[hdScaleId]?.scale ?? 3)}×${selected.height * (HD_SCALES[hdScaleId]?.scale ?? 3)}`
                        : 'Click an artboard'}
                </span>
                {isNarrow && selected ? (
                  <div className="studio-statusbar__quick" role="toolbar" aria-label="Board actions">
                    <button
                      type="button"
                      className={`studio-statusbar__action studio-statusbar__action--export${busy ? ' is-busy' : ''}`}
                      title={busy ? exportLabel : 'Download flier'}
                      aria-label={busy ? exportLabel : 'Download flier'}
                      aria-busy={busy || undefined}
                      disabled={busy}
                      onClick={handleExport}
                    >
                      <Download size={16} strokeWidth={2.25} aria-hidden />
                      <span>Export</span>
                    </button>
                    <button
                      type="button"
                      className="studio-statusbar__action"
                      title="Copy artboard size"
                      aria-label="Copy size"
                      onClick={handleCopySize}
                    >
                      <Copy size={15} strokeWidth={2.25} />
                      <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      className="studio-statusbar__action"
                      title="Duplicate layer"
                      aria-label="Duplicate"
                      onClick={() => handleDuplicateLayer(selected.id)}
                    >
                      <CopyPlus size={15} strokeWidth={2.25} />
                      <span>Dup</span>
                    </button>
                    <button
                      type="button"
                      className="studio-statusbar__action"
                      title="Fit to screen"
                      aria-label="Fit"
                      onClick={fitToScreen}
                    >
                      <Maximize2 size={15} strokeWidth={2.25} />
                      <span>Fit</span>
                    </button>
                  </div>
                ) : null}
                <span className="studio-statusbar__meta">
                  {project?.name ?? 'Studio'} · {boardItems.length} boards
                </span>
                <span className="studio-statusbar__meta">{Math.round(zoom * 100)}%</span>
              </>
            )}
          </footer>
        </div>

        {isNarrow && mobileInspectorOpen ? (
          <button
            type="button"
            className="studio-sheet-backdrop"
            aria-label="Close panel"
            onClick={() => setMobileInspectorOpen(false)}
          />
        ) : null}

        <Inspector
          mode={templatesOpen ? 'templates' : 'board'}
          sheet={isNarrow}
          sheetOpen={mobileInspectorOpen}
          collapsed={isNarrow ? false : inspectorCollapsed}
          onToggleCollapsed={
            isNarrow ? () => setMobileInspectorOpen(false) : toggleInspectorCollapsed
          }
          items={boardItems}
          selectedId={selectedId}
          selected={selected}
          format={format}
          hdScaleId={hdScaleId}
          busy={busy}
          exportProgress={exportProgress}
          exportLabel={exportLabel}
          error={error}
          zoom={zoom}
          onSelect={(id) => patchTab(activeProjectId, { selectedId: id })}
          onFormatChange={setFormat}
          onHdScaleChange={setHdScaleId}
          onExport={handleExport}
          onCopySize={handleCopySize}
          onDuplicateLayer={handleDuplicateLayer}
          onDeleteLayer={handleDeleteLayer}
          canDeleteLayer={boardItems.length > 1}
          templatesItems={templatesInspectorItems}
          templatesSelectedId={
            openTemplateCollectionFiltered ? selectedTemplateId : openTemplateCollectionId
          }
          onTemplatesSelect={handleTemplatesInspectorSelect}
          templatesHint={
            openTemplateCollectionFiltered
              ? 'Click a template to open it in the studio editor.'
              : 'Open a template collection, then pick a layout to edit.'
          }
          editEnabled={!templatesOpen && editEnabled}
          editContent={editContent}
          focusedPath={focusedPath}
          focusedKind={focusedKind}
          onEditChange={(path, value) => {
            if (!selectedId) return
            patchDraft(activeProjectId, selectedId, path, value)
          }}
          onFocusField={handleFocusField}
          onPickImage={handlePickImage}
          onClearImage={handleClearImage}
          onImageFitChange={handleImageFitChange}
          onLogoLayoutChange={handleLogoLayoutChange}
          onRestoreDefaultLogo={() => handleRestoreDefaultLogo()}
          onUseTextLogo={() => handleUseTextLogo()}
          onUseImageLogo={() => handleUseImageLogo()}
          onAlignChange={handleAlignChange}
          onResetDraft={handleResetDraft}
          hasSavedEdits={Boolean(drafts[activeProjectId]?.[selectedId])}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        hidden
        onChange={handleFileChange}
      />

      <ConfirmDialog
        open={Boolean(deletePrompt)}
        eyebrow="Layers"
        title="Delete layer"
        message={
          deletePrompt
            ? `Delete “${deletePrompt.label}” from this board? This removes the artboard and its saved edits.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={confirmDeleteLayer}
        onClose={() => setDeletePrompt(null)}
      />

      <ConfirmDialog
        open={Boolean(noticePrompt)}
        eyebrow="Layers"
        title={noticePrompt?.title || 'Notice'}
        message={noticePrompt?.message || ''}
        confirmLabel="OK"
        hideCancel
        tone="default"
        onConfirm={() => setNoticePrompt(null)}
        onClose={() => setNoticePrompt(null)}
      />

      <StudioHelp
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        onReplayTour={startTour}
      />

      <StudioTour
        open={tourOpen}
        isNarrow={isNarrow}
        isPhone={isPhone}
        hasOpenDesign={openTabIds.length > 0 && !templatesOpen}
        templatesOpen={templatesOpen}
        onClose={closeTour}
        onEnsurePanelOpen={() => {
          if (isNarrow) setMobileInspectorOpen(true)
        }}
      />
    </div>
  )
}
