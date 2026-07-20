import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import AdminBoard from './admin/AdminBoard'
import {
  DEFAULT_HD_SCALE,
  HD_SCALES,
  exportFlier,
} from '../lib/exportFlier'
import {
  buildEditViewModel,
  clearArtboardDraft,
  copyArtboardDraft,
  getArtboardDraft,
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
  deleteBoardLayer,
  duplicateBoardLayer,
  loadBoardLayouts,
  resolveProjectBoard,
  saveBoardLayouts,
} from '../lib/boardLayout'
import {
  cloneStudioSnapshot,
  createStudioHistory,
  pushStudioHistory,
  redoStudioHistory,
  undoStudioHistory,
} from '../lib/studioHistory'
import {
  DEFAULT_PROJECT_ID,
  getProject,
  PROJECT_MAP,
} from '../projects/registry'
import { getSampleCollection, listSampleCollections } from '../samples/registry'
import SamplesBoard from './SamplesBoard'
import Artboard from './studio/Artboard'
import ConfirmDialog from './studio/ConfirmDialog'
import Inspector from './studio/Inspector'
import OpenDesignDialog from './studio/OpenDesignDialog'
import ProjectTabs from './studio/ProjectTabs'
import ToolRail from './studio/ToolRail'
import './Studio.css'

const TABS_KEY = 'flier-studio-open-tabs'

function getInitialTabs() {
  try {
    const saved = JSON.parse(localStorage.getItem(TABS_KEY) || 'null')
    if (Array.isArray(saved) && saved.length) {
      const valid = saved.filter((id) => PROJECT_MAP[id])
      if (valid.length) return valid
    }
  } catch {
    // ignore
  }
  return [DEFAULT_PROJECT_ID]
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
  const location = useLocation()
  const navigate = useNavigate()
  const frameRefs = useRef({})
  const shellRef = useRef(null)

  const samplesOpen = location.pathname === '/samples'
  const adminOpen = location.pathname === '/admin'

  const [openTabIds, setOpenTabIds] = useState(getInitialTabs)
  const [activeProjectId, setActiveProjectId] = useState(() => getInitialTabs()[0])
  const [tabState, setTabState] = useState(() => {
    const initial = {}
    getInitialTabs().forEach((id) => {
      initial[id] = createTabState(id)
    })
    return initial
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [openSampleCollectionId, setOpenSampleCollectionId] = useState(null)
  const [selectedSampleTemplateId, setSelectedSampleTemplateId] = useState(null)

  const [primaryTool, setPrimaryTool] = useState('select')
  const [spaceHandActive, setSpaceHandActive] = useState(false)
  const [format, setFormat] = useState('png')
  const [hdScaleId, setHdScaleId] = useState(DEFAULT_HD_SCALE)
  const [showLabels, setShowLabels] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [busy, setBusy] = useState(false)
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

  const project = getProject(activeProjectId)
  const resolvedBoard = useMemo(
    () => resolveProjectBoard(project, boardLayouts[activeProjectId]),
    [activeProjectId, boardLayouts, project],
  )
  const baseBoardItems = resolvedBoard.items
  const bounds = resolvedBoard.bounds ?? { width: 1000, height: 1000 }
  const currentTab = tabState[activeProjectId] ?? createTabState(activeProjectId)
  const selectedId = currentTab.selectedId
  const zoom = currentTab.zoom
  const pan = currentTab.pan
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

  const handleFocusField = useCallback((path, kind = 'text') => {
    setFocusedPath(path)
    setFocusedKind(kind)
    if (kind === 'text') {
      setPrimaryTool('text')
      setSpaceHandActive(false)
    }
  }, [])

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
    requestAnimationFrame(() => fileInputRef.current?.click())
  }, [])

  const handleClearImage = useCallback(
    (path) => {
      if (!selectedId) return
      patchDraft(activeProjectId, selectedId, path, '')
    },
    [activeProjectId, patchDraft, selectedId],
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
        patchDraft(activeProjectId, selectedId, path, dataUrl)
        setError('')
      } catch (err) {
        console.error(err)
        setError('Could not process that image. Try a different PNG or JPEG.')
      }
    },
    [activeProjectId, patchDraft, pendingImagePath, selectedId],
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

      const studioEdit = {
        enabled: !spaceHandActive && (primaryTool === 'select' || primaryTool === 'text'),
        focusedPath: selectedId === item.id ? focusedPath : null,
        alignments: alignments || {},
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
    focusedPath,
    getDraft,
    handleExitTextEdit,
    handleFocusField,
    handlePickImage,
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

  const sampleCollections = useMemo(() => listSampleCollections(), [])
  const openSampleCollection = openSampleCollectionId
    ? getSampleCollection(openSampleCollectionId)
    : null

  const samplesInspectorItems = useMemo(() => {
    if (openSampleCollection) {
      return openSampleCollection.templates.map((template) => ({
        id: template.id,
        name: template.name,
        meta: template.sizeLabel,
        group: template.sizeLabel,
      }))
    }
    return sampleCollections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      meta: `${collection.templateCount} templates`,
      group: collection.brand,
      color: collection.color,
    }))
  }, [openSampleCollection, sampleCollections])

  useEffect(() => {
    try {
      localStorage.setItem(TABS_KEY, JSON.stringify(openTabIds))
    } catch {
      // ignore
    }
  }, [openTabIds])

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#/samples' || hash === '#samples') {
      navigate('/samples', { replace: true })
      return
    }
    if (hash === '#/admin' || hash === '#admin') {
      navigate(isAdmin ? '/admin' : '/', { replace: true })
      return
    }
    if (hash === '#/' || hash === '#') {
      navigate('/', { replace: true })
    }
  }, [navigate, isAdmin])

  useEffect(() => {
    if (adminOpen && !isAdmin) {
      navigate('/', { replace: true })
    }
  }, [adminOpen, isAdmin, navigate])

  useEffect(() => {
    if (!samplesOpen) {
      setOpenSampleCollectionId(null)
      setSelectedSampleTemplateId(null)
    }
  }, [samplesOpen])

  function toggleTheme() {
    onThemeChange?.(theme === 'dark' ? 'light' : 'dark')
  }

  function toggleSamples() {
    navigate(samplesOpen ? '/' : '/samples')
  }

  function toggleAdmin() {
    if (!isAdmin) return
    navigate(adminOpen ? '/' : '/admin')
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

  const openProject = useCallback((projectId) => {
    const next = getProject(projectId)
    if (!next) return

    navigate('/')
    setOpenSampleCollectionId(null)
    setSelectedSampleTemplateId(null)
    setOpenTabIds((prev) => (prev.includes(projectId) ? prev : [...prev, projectId]))
    setTabState((prev) =>
      prev[projectId] ? prev : { ...prev, [projectId]: createTabState(projectId) },
    )
    setActiveProjectId(projectId)
    frameRefs.current = {}
    setDialogOpen(false)
    setError('')
  }, [navigate])

  function handleSamplesInspectorSelect(id) {
    if (openSampleCollection) {
      setSelectedSampleTemplateId(id)
      return
    }
    setOpenSampleCollectionId(id)
    setSelectedSampleTemplateId(null)
  }

  const closeProject = useCallback(
    (projectId) => {
      setOpenTabIds((prev) => {
        if (prev.length <= 1) return prev
        const next = prev.filter((id) => id !== projectId)
        if (activeProjectId === projectId) {
          const index = prev.indexOf(projectId)
          const fallback = next[Math.max(0, index - 1)]
          setActiveProjectId(fallback)
          frameRefs.current = {}
        }
        return next
      })
      setTabState((prev) => {
        const next = { ...prev }
        delete next[projectId]
        return next
      })
    },
    [activeProjectId],
  )

  const handleExport = useCallback(async () => {
    if (!selected) return
    const node = frameRefs.current[selected.id]
    if (!node) {
      setError('Could not find the selected artboard.')
      return
    }

    setBusy(true)
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
      })
    } catch (err) {
      console.error(err)
      setError('Export failed. Check the console.')
    } finally {
      setBusy(false)
    }
  }, [selected, format, hdScaleId])

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
      if (actionId === 'open') setDialogOpen(true)
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
        setDialogOpen(true)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault()
        closeProject(activeProjectId)
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
  }, [activeProjectId, closeProject, handleAction, handleExport, primaryTool, redoChange, undoChange])

  async function handleCopySize() {
    if (!selected) return
    const text = `${selected.width}×${selected.height}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      setError('Clipboard unavailable.')
    }
  }

  if (!project) {
    return (
      <div className="studio-app" data-theme={theme}>
        <p className="studio-empty">No project open. Use Open design to start.</p>
        <button type="button" onClick={() => setDialogOpen(true)}>
          Open design
        </button>
        <OpenDesignDialog
          open={dialogOpen}
          openTabIds={openTabIds}
          onClose={() => setDialogOpen(false)}
          onOpen={openProject}
        />
      </div>
    )
  }

  return (
    <div className="studio-app" data-theme={theme}>
      <header className="studio-topbar">
        <div className="studio-topbar__left">
          <strong>Flier Studio</strong>
          <span className="studio-topbar__sep" />
          <span>{adminOpen ? 'Admin' : samplesOpen ? 'Samples' : project.name}</span>
          <button
            type="button"
            className={`studio-topbar__chip${samplesOpen ? ' is-active' : ''}`}
            onClick={toggleSamples}
            title="Browse design samples"
          >
            Samples
          </button>
          {isAdmin ? (
            <button
              type="button"
              className={`studio-topbar__chip${adminOpen ? ' is-active' : ''}`}
              onClick={toggleAdmin}
              title="Admin dashboard"
            >
              Admin
            </button>
          ) : null}
        </div>
        <div className="studio-topbar__center">
          {adminOpen
            ? 'Users & activity'
            : samplesOpen
              ? openSampleCollection
                ? openSampleCollection.name
                : 'Sample library'
              : selected
                ? selected.name
                : 'No selection'}
        </div>
        <div className="studio-topbar__right">
          <div className="studio-topbar__user" title={user?.email || ''}>
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
            className="studio-topbar__chip studio-topbar__chip--icon"
            onClick={() => logout()}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className="studio-topbar__chip studio-topbar__chip--icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={14} strokeWidth={2.25} /> : <Moon size={14} strokeWidth={2.25} />}
          </button>
          {!samplesOpen && !adminOpen ? (
            <>
              <button type="button" className="studio-topbar__chip" onClick={() => handleAction('zoomOut')}>
                −
              </button>
              <button type="button" className="studio-topbar__chip studio-topbar__chip--wide" onClick={fitToScreen}>
                {Math.round(zoom * 100)}%
              </button>
              <button type="button" className="studio-topbar__chip" onClick={() => handleAction('zoomIn')}>
                +
              </button>
            </>
          ) : null}
        </div>
      </header>

      <ProjectTabs
        openTabs={openTabs}
        activeProjectId={samplesOpen || adminOpen ? null : activeProjectId}
        onSelect={(id) => {
          navigate('/')
          setOpenSampleCollectionId(null)
          setSelectedSampleTemplateId(null)
          setActiveProjectId(id)
          frameRefs.current = {}
          setError('')
        }}
        onClose={closeProject}
        onOpenDialog={() => setDialogOpen(true)}
      />

      <div className="studio-body">
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
          onOpenDialog={() => setDialogOpen(true)}
          onOpenSamples={toggleSamples}
          samplesActive={samplesOpen}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels((v) => !v)}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid((v) => !v)}
          canExport={!samplesOpen && !adminOpen && Boolean(selected)}
          busy={busy}
        />

        <div className="studio-shell" ref={shellRef}>
          {adminOpen && isAdmin ? (
            <AdminBoard />
          ) : samplesOpen ? (
            <SamplesBoard
              showGrid={showGrid}
              openCollectionId={openSampleCollectionId}
              onOpenCollection={(id) => {
                setOpenSampleCollectionId(id)
                setSelectedSampleTemplateId(null)
              }}
              onCloseCollection={() => {
                setOpenSampleCollectionId(null)
                setSelectedSampleTemplateId(null)
              }}
              selectedTemplateId={selectedSampleTemplateId}
              onSelectTemplate={setSelectedSampleTemplateId}
            />
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
            />
          )}

          <footer className="studio-statusbar">
            {adminOpen ? (
              <>
                <span>Admin</span>
                <span>Users, logins, and design activity</span>
                <span>Admin only</span>
              </>
            ) : samplesOpen ? (
              <>
                <span>Samples</span>
                <span>
                  {openSampleCollection
                    ? `${openSampleCollection.name} · ${openSampleCollection.templateCount} templates`
                    : 'Click a sample to preview or open templates'}
                </span>
                <span>{sampleCollections.length} collections</span>
                <span>{showGrid ? 'Grid on' : 'Grid off'}</span>
              </>
            ) : (
              <>
                <span>
                  {tool === 'hand' ? 'Hand' : tool === 'text' ? 'Text' : editEnabled ? 'Move' : 'Select'}
                </span>
                <span>
                  {selected
                    ? `${selected.name} · artboard ${selected.width}×${selected.height} · export ${selected.width * (HD_SCALES[hdScaleId]?.scale ?? 3)}×${selected.height * (HD_SCALES[hdScaleId]?.scale ?? 3)}`
                    : 'Click an artboard'}
                </span>
                <span>
                  {project.name} · {boardItems.length} boards
                </span>
                <span>{Math.round(zoom * 100)}%</span>
              </>
            )}
          </footer>
        </div>

        <Inspector
          mode={adminOpen ? 'admin' : samplesOpen ? 'samples' : 'board'}
          items={boardItems}
          selectedId={selectedId}
          selected={selected}
          format={format}
          hdScaleId={hdScaleId}
          busy={busy}
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
          samplesItems={samplesInspectorItems}
          samplesSelectedId={
            openSampleCollection ? selectedSampleTemplateId : openSampleCollectionId
          }
          onSamplesSelect={handleSamplesInspectorSelect}
          samplesHint={
            adminOpen
              ? 'Admin view — manage users and review activity.'
              : openSampleCollection
                ? 'Click a template to preview full-screen and download for your phone.'
                : 'Open a sample collection to browse its template variations.'
          }
          editEnabled={!samplesOpen && !adminOpen && editEnabled}
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

      <OpenDesignDialog
        open={dialogOpen}
        openTabIds={openTabIds}
        onClose={() => setDialogOpen(false)}
        onOpen={openProject}
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
    </div>
  )
}
