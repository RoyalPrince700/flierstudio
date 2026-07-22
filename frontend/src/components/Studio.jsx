import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircleHelp, LogOut, Moon, MoreHorizontal, PanelBottom, Sun } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { trackEvent } from '../lib/trackEvent'
import { useMediaQuery } from '../lib/useMediaQuery'
import { LiftoffMark } from '../fliers/flier-studio/FSLogo'
import { fsTokens } from '../design/flierStudioTokens'
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
  addTemplateLayer,
  deleteBoardLayer,
  duplicateBoardLayer,
  loadBoardLayouts,
  resolveProjectBoard,
  saveBoardLayouts,
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
import Inspector from './studio/Inspector'
import ProjectTabs from './studio/ProjectTabs'
import StudioHelp from './studio/StudioHelp'
import StudioTour from './studio/StudioTour'
import ToolRail from './studio/ToolRail'
import './Studio.css'

const TABS_KEY = 'flier-studio-open-tabs'
const INSPECTOR_COLLAPSED_KEY = 'flier-studio-inspector-collapsed'

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
  return []
}

function getInitialActiveProjectId() {
  return getInitialTabs()[0] ?? null
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
  const [searchParams, setSearchParams] = useSearchParams()
  const frameRefs = useRef({})
  const shellRef = useRef(null)
  const topbarMenuRef = useRef(null)

  const isNarrow = useMediaQuery('(max-width: 900px)')
  const isPhone = useMediaQuery('(max-width: 640px)')

  const templatesOpen = location.pathname === '/templates'

  const [openTabIds, setOpenTabIds] = useState(getInitialTabs)
  const [activeProjectId, setActiveProjectId] = useState(getInitialActiveProjectId)
  const [tabState, setTabState] = useState(() => {
    const initial = {}
    getInitialTabs().forEach((id) => {
      initial[id] = createTabState(id)
    })
    return initial
  })
  const [openTemplateCollectionId, setOpenTemplateCollectionId] = useState(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  const [primaryTool, setPrimaryTool] = useState('select')
  const [spaceHandActive, setSpaceHandActive] = useState(false)
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

  const trackEditRef = useRef(null)

  const patchDraft = useCallback(
    (projectId, itemId, path, value) => {
      const layout = boardLayouts[projectId]
      const { items } = resolveProjectBoard(getProject(projectId), layout)
      const item = items.find((entry) => entry.id === itemId)
      const editKind = getItemEditKind(item, projectId)
      recordHistory(`${projectId}:${itemId}:${path}`)
      setDrafts((prev) => patchArtboardDraft(prev, projectId, itemId, path, value, editKind))

      if (trackEditRef.current) window.clearTimeout(trackEditRef.current)
      trackEditRef.current = window.setTimeout(() => {
        trackEvent({
          action: 'edit',
          projectId,
          designId: item?.sourceId || itemId,
          meta: { path },
        })
      }, 1200)
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
    try {
      localStorage.setItem(TABS_KEY, JSON.stringify(openTabIds))
    } catch {
      // ignore
    }
  }, [openTabIds])

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#/samples' || hash === '#samples' || hash === '#/templates' || hash === '#templates') {
      navigate('/templates', { replace: true })
      return
    }
    if (hash === '#/admin' || hash === '#admin') {
      navigate(isAdmin ? '/admin/overview' : '/templates', { replace: true })
      return
    }
    if (hash === '#/' || hash === '#') {
      navigate('/templates', { replace: true })
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
      navigate(openTabIds.length ? '/studio' : '/templates')
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

      trackEvent({
        action: 'select',
        projectId: full.collectionId || '',
        designId: full.id,
        meta: { source: full.source, from: 'templates' },
      })

      navigate('/studio')
      setOpenTemplateCollectionId(null)
      setSelectedTemplateId(null)
      frameRefs.current = {}
      setError('')

      if (full.source === 'project') {
        const projectId = full.collectionId
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
          navigate('/templates')
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
      trackEvent({
        action: 'download',
        projectId: activeProjectId,
        designId: selected.sourceId || selected.id,
        meta: { format, hdScaleId },
      })
    } catch (err) {
      console.error(err)
      setError('Export failed. Check the console.')
    } finally {
      setBusy(false)
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
    handleAction,
    handleExport,
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
    const timer = window.setTimeout(() => setTourOpen(true), 600)
    return () => window.clearTimeout(timer)
  }, [])

  function openHelp() {
    setTopbarMenuOpen(false)
    setTourOpen(false)
    setHelpOpen(true)
  }

  function startTour() {
    setTopbarMenuOpen(false)
    setHelpOpen(false)
    setTourOpen(true)
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

  const studioAppClass = [
    'studio-app',
    isNarrow ? 'studio-app--narrow' : '',
    isPhone ? 'studio-app--phone' : '',
    isNarrow && mobileInspectorOpen ? 'is-inspector-sheet-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (!project && !templatesOpen) {
    if (searchParams.get('template')) {
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
    return <Navigate to="/templates" replace />
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
              title="Layers, edit & export"
              aria-pressed={mobileInspectorOpen}
              data-tour="panel"
            >
              <PanelBottom size={14} strokeWidth={2.25} />
              <span>Panel</span>
            </button>
          ) : null}
        </div>
        <div className="studio-topbar__center">
          {templatesOpen
            ? openTemplateCollectionFiltered
              ? openTemplateCollectionFiltered.name
              : 'Template library'
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
          {!templatesOpen ? (
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
                {!templatesOpen ? (
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
          onToggleInspector={isNarrow ? toggleMobileInspector : undefined}
          inspectorOpen={mobileInspectorOpen}
        />

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
            {templatesOpen ? (
              <>
                <span>Templates</span>
                <span className="studio-statusbar__primary">
                  {openTemplateCollectionFiltered
                    ? `${openTemplateCollectionFiltered.name} · ${openTemplateCollectionFiltered.templateCount} templates`
                    : 'Click a template to open it in the studio editor'}
                </span>
                <span className="studio-statusbar__meta">{templateCollections.length} collections</span>
                <span className="studio-statusbar__meta">{showGrid ? 'Grid on' : 'Grid off'}</span>
              </>
            ) : (
              <>
                <span>
                  {tool === 'hand' ? 'Hand' : tool === 'text' ? 'Text' : editEnabled ? 'Move' : 'Select'}
                </span>
                <span className="studio-statusbar__primary">
                  {selected
                    ? `${selected.name} · artboard ${selected.width}×${selected.height} · export ${selected.width * (HD_SCALES[hdScaleId]?.scale ?? 3)}×${selected.height * (HD_SCALES[hdScaleId]?.scale ?? 3)}`
                    : 'Click an artboard'}
                </span>
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
        onClose={() => setTourOpen(false)}
        onEnsurePanelOpen={() => {
          if (isNarrow) setMobileInspectorOpen(true)
        }}
      />
    </div>
  )
}
