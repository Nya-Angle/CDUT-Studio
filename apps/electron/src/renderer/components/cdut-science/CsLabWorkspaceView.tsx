/**
 * CsLabWorkspaceView — CDUT Science 沉浸式科研工作台
 *
 * 布局：顶栏 + 左侧六维资产导航 + 中央 1/4 颗粒度分屏舞台 + 右侧上下文抽屉。
 * 交互：文件摄取、资产拖拽定向投射、跨窗格拖拽胶囊、Word 导入/导出/同步。
 */

import * as React from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { Editor } from '@tiptap/core'
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Brain,
  Download,
  FileUp,
  FlaskConical,
  FolderOpen,
  HardDrive,
  Loader2,
  Lock,
  Network,
  RefreshCw,
  Server,
  Sparkles,
  Upload,
  Wrench,
} from 'lucide-react'
import type {
  CsLabAssetSummary,
  CsLabCanvasDocument,
  CsLabCapsule,
  CsLabCapsuleLineage,
  CsLabCellRef,
  CsLabLiteratureItem,
  CsLabManuscript,
  CsLabManuscriptSummary,
  CsLabMolAsset,
  CsLabPlotUpdatedEvent,
  CsLabStructureFocusedEvent,
  CsLabTablePayload,
} from '@profer/shared'
import { detectIsMac, detectIsWindows } from '@profer/ui'
import { cn } from '@/lib/utils'
import { resolveWindowControlsRightInset } from '@/lib/window-controls-layout'
import {
  CSLAB_PANE_IDS,
  cslabActiveLabIdAtom,
  cslabActivePaneIdAtom,
  cslabAssetDragAtom,
  cslabAssetsAtom,
  cslabDrawerAtom,
  cslabHpcMfaAtom,
  cslabIngestProgressAtom,
  cslabManuscriptsAtom,
  cslabPaneCanvasesAtom,
  cslabPaneLiteratureAtom,
  cslabPanePlotsAtom,
  cslabPlotListAtom,
  cslabPaneLoadingAtom,
  cslabPaneManuscriptsAtom,
  cslabPaneMolAtom,
  cslabPaneTablesAtom,
  cslabPanesAtom,
  cslabRunSeedAtom,
  cslabSnapshotAtom,
  cslabSplitLayoutAtom,
  cslabStaleCapsulesAtom,
  cslabTileTargetAtom,
  cslabToastAtom,
  cslabToolSeedAtom,
  cslabZoteroStatusAtom,
  type CsLabPaneId,
  type CsLabPaneState,
  type CsLabPdfSelection,
  type CsLabSplitLayout,
} from '@/atoms/cslab-atoms'
import { CsLabAssetRail } from './CsLabAssetRail'
import { resolveAssetCapability } from './cslab-capability'
import { CsLabSlideDrawer } from './CsLabSlideDrawer'
import { CsLabSplitControls } from './CsLabSplitControls'
import { CsLabStageGrid } from './CsLabStageGrid'
import { CsLabTileOverlay } from './CsLabTileOverlay'
import { CsLabPlotDigitizerPanel } from './CsLabPlotDigitizerPanel'
import { CsLabFormulaPanel } from './CsLabFormulaPanel'
import { CsLabLiteratureBrainPanel } from './CsLabLiteratureBrainPanel'
import { CsLabZoteroPanel } from './CsLabZoteroPanel'
import { CsLabRunTimeline } from './CsLabRunTimeline'
import { CsLabNotesPanel } from './CsLabNotesPanel'
import { CsLabToolsPanel } from './CsLabToolsPanel'
import { CsLabNetworkSharePanel } from './CsLabNetworkSharePanel'
import { CsLabHpcPanel } from './CsLabHpcPanel'
import { useCsLabVault } from './use-cslab-vault'
import {
  applyUpdatedCapsule,
  collectCapsulesFromDoc,
} from './cslab-capsule-node'
import {
  CSLAB_CELL_MIME,
  buildCapsuleAttrs,
  type CsLabAssetDragPayload,
} from './cslab-dnd'
import { useCsLabEvents } from './use-cslab-events'

interface CsLabWorkspaceViewProps {
  labId: string
}

const LAYER_LABELS: Record<string, string> = {
  lit: '文献',
  fact: '事实',
  note: '笔记',
  node: '推演节点',
  proto: '规程',
  run: '实验批次',
  raw: '原始数据',
  table: '数据表',
  fig: '图表',
  mol: '结构模型',
  doc: '文稿',
  capsule: '胶囊',
}

const LAYOUT_SHORTCUTS: Record<string, CsLabSplitLayout> = {
  '1': 'single',
  '2': 'split-vertical',
  '3': 'split-horizontal',
  '4': 'grid-4',
}

function emptyPane(id: CsLabPaneId): CsLabPaneState {
  return {
    id,
    viewType: 'empty',
    assetUri: undefined,
    manuscriptUri: undefined,
    literatureUri: undefined,
    molUri: undefined,
    figureUri: undefined,
    datasetDisplayMode: undefined,
    activeSeriesKeys: undefined,
    canvasRelPath: undefined,
    canvasMtimeMs: undefined,
    pdfInitialPage: undefined,
  }
}

function emptyPaneRecord(): Record<CsLabPaneId, CsLabPaneState> {
  return CSLAB_PANE_IDS.reduce(
    (acc, id) => {
      acc[id] = emptyPane(id)
      return acc
    },
    {} as Record<CsLabPaneId, CsLabPaneState>,
  )
}

function emptyBooleanRecord(): Record<CsLabPaneId, boolean> {
  return CSLAB_PANE_IDS.reduce(
    (acc, id) => {
      acc[id] = false
      return acc
    },
    {} as Record<CsLabPaneId, boolean>,
  )
}

function visiblePaneIds(layout: CsLabSplitLayout, activePaneId: CsLabPaneId): CsLabPaneId[] {
  if (layout === 'single') return [activePaneId]
  if (layout === 'grid-4') return CSLAB_PANE_IDS
  return ['pane-1', 'pane-2']
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleString('zh-CN', { hour12: false })
  } catch {
    return '—'
  }
}

function cloneDocJson(docJson: unknown): { type: string; content: Array<Record<string, unknown>> } {
  try {
    const parsed = JSON.parse(JSON.stringify(docJson)) as {
      type?: string
      content?: Array<Record<string, unknown>>
    }
    return {
      type: parsed.type ?? 'doc',
      content: Array.isArray(parsed.content) ? parsed.content : [],
    }
  } catch {
    return { type: 'doc', content: [] }
  }
}

export function CsLabWorkspaceView({ labId }: CsLabWorkspaceViewProps): React.ReactElement {
  const isWindows = React.useMemo(() => detectIsWindows(), [])
  const isMac = React.useMemo(() => detectIsMac(), [])

  const snapshot = useAtomValue(cslabSnapshotAtom)
  const [assets, setAssets] = useAtom(cslabAssetsAtom)
  const [manuscripts, setManuscripts] = useAtom(cslabManuscriptsAtom)
  const [panes, setPanes] = useAtom(cslabPanesAtom)
  const [activePaneId, setActivePaneId] = useAtom(cslabActivePaneIdAtom)
  const [layout, setLayout] = useAtom(cslabSplitLayoutAtom)
  const [paneTables, setPaneTables] = useAtom(cslabPaneTablesAtom)
  const [panePlots, setPanePlots] = useAtom(cslabPanePlotsAtom)
  const [plotList, setPlotList] = useAtom(cslabPlotListAtom)
  const [paneManuscripts, setPaneManuscripts] = useAtom(cslabPaneManuscriptsAtom)
  const [paneLiterature, setPaneLiterature] = useAtom(cslabPaneLiteratureAtom)
  const [paneCanvases, setPaneCanvases] = useAtom(cslabPaneCanvasesAtom)
  const [paneMol, setPaneMol] = useAtom(cslabPaneMolAtom)
  const [zoteroStatus, setZoteroStatus] = useAtom(cslabZoteroStatusAtom)
  const [toolSeed, setToolSeed] = useAtom(cslabToolSeedAtom)
  const [runSeed, setRunSeed] = useAtom(cslabRunSeedAtom)
  const [paneLoading, setPaneLoading] = useAtom(cslabPaneLoadingAtom)
  const [assetDrag, setAssetDrag] = useAtom(cslabAssetDragAtom)
  const [tileTarget, setTileTarget] = useAtom(cslabTileTargetAtom)
  const [drawer, setDrawer] = useAtom(cslabDrawerAtom)
  const [hpcMfa, setHpcMfa] = useAtom(cslabHpcMfaAtom)
  const [mfaValue, setMfaValue] = React.useState('')
  const [staleCapsules, setStaleCapsules] = useAtom(cslabStaleCapsulesAtom)
  const progress = useAtomValue(cslabIngestProgressAtom)
  const setActiveLabId = useSetAtom(cslabActiveLabIdAtom)
  const setToast = useSetAtom(cslabToastAtom)
  const setSnapshot = useSetAtom(cslabSnapshotAtom)
  const toast = useAtomValue(cslabToastAtom)
  /** AI 写回后的撤销浮条状态（10 秒自动消失）。 */
  const [undoState, setUndoState] = React.useState<{ token: string; plotId: string } | null>(null)
  const undoTimerRef = React.useRef<number | null>(null)

  const [loading, setLoading] = React.useState(true)
  const [savingPanes, setSavingPanes] = React.useState<Record<CsLabPaneId, boolean>>(
    emptyBooleanRecord,
  )
  const [dirtyPanes, setDirtyPanes] = React.useState<Record<CsLabPaneId, boolean>>(
    emptyBooleanRecord,
  )
  const [paneTitles, setPaneTitles] = React.useState<Record<CsLabPaneId, string>>(
    () =>
      CSLAB_PANE_IDS.reduce(
        (acc, id) => {
          acc[id] = ''
          return acc
        },
        {} as Record<CsLabPaneId, string>,
      ),
  )
  const [dragging, setDragging] = React.useState(false)
  const [lineage, setLineage] = React.useState<CsLabCapsuleLineage | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const dragDepth = React.useRef(0)
  const editorRefs = React.useRef<Record<CsLabPaneId, Editor | null>>({
    'pane-1': null,
    'pane-2': null,
    'pane-3': null,
    'pane-4': null,
  })
  const docxInputRef = React.useRef<HTMLInputElement | null>(null)
  const bootstrappedLabRef = React.useRef<string | null>(null)

  const showToast = React.useCallback(
    (kind: 'info' | 'success' | 'error', text: string, action?: { label: string; path: string }): void => {
      setToast({ kind, text, action })
    },
    [setToast],
  )

  React.useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(timer)
  }, [toast, setToast])

  // 组件卸载时清理撤销浮条定时器
  React.useEffect(() => {
    return () => {
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current)
    }
  }, [])

  const handleUndoPlot = React.useCallback(async (): Promise<void> => {
    if (!undoState) return
    const snapshot = undoState
    setUndoState(null)
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current)
      undoTimerRef.current = null
    }
    try {
      const result = await window.electronAPI.cslab.undoPlotUpdate({
        labId,
        plotId: snapshot.plotId,
        undoToken: snapshot.token,
      })
      setPanePlots((previous) => ({ ...previous, [activePaneId]: result.plot }))
      showToast('success', '已撤销 AI 对图表的修改')
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : '撤销失败')
    }
  }, [activePaneId, labId, setPanePlots, showToast, undoState])

  const patchPane = React.useCallback(
    (paneId: CsLabPaneId, patch: Partial<CsLabPaneState>): void => {
      setPanes((previous) => ({
        ...previous,
        [paneId]: { ...previous[paneId], ...patch },
      }))
      // 切换到非 3D 视图时立即释放结构文本，避免无谓内存占用。
      if (patch.viewType && patch.viewType !== 'mol') {
        setPaneMol((previous) => ({ ...previous, [paneId]: null }))
      }
    },
    [setPanes, setPaneMol],
  )

  const refreshAssets = React.useCallback(async (): Promise<void> => {
    const [nextAssets, nextManuscripts, nextSnapshot] = await Promise.all([
      window.electronAPI.cslab.listAssets(labId),
      window.electronAPI.cslab.listManuscripts(labId),
      window.electronAPI.cslab.getLabSnapshot(labId),
    ])
    setAssets(nextAssets)
    setManuscripts(nextManuscripts)
    setSnapshot(nextSnapshot)
  }, [labId, setAssets, setManuscripts, setSnapshot])

  // Vault 监听与索引生命周期（切换实验室/卸载时显式关闭 watcher）。
  useCsLabVault(labId, refreshAssets)

  // 工具目录热解析常驻监听：用户新增/修改 tools/*.py 后自动刷新清单。
  React.useEffect(() => {
    void window.electronAPI.cslab.startCustomToolWatch(labId).catch(() => undefined)
    return () => {
      void window.electronAPI.cslab.stopCustomToolWatch(labId).catch(() => undefined)
    }
  }, [labId])

  // ===== 窗格打开逻辑 =====

  const focusPane = React.useCallback(
    (paneId: CsLabPaneId): void => {
      setActivePaneId(paneId)
      const visible = visiblePaneIds(layout, paneId)
      if (!visible.includes(paneId)) {
        // 目标窗格在 3/4 号位且当前布局不展示时，切换到田字格使其可见。
        setLayout('grid-4')
      }
    },
    [layout, setActivePaneId, setLayout],
  )

  const openPlotInPane = React.useCallback(
    async (paneId: CsLabPaneId, plotId: string): Promise<void> => {
      setPaneLoading((previous) => ({ ...previous, [paneId]: true }))
      try {
        const plot = await window.electronAPI.cslab.loadPlot({ labId, plotId })
        if (!plot) throw new Error('绘图文档不存在')
        setPanePlots((previous) => ({ ...previous, [paneId]: plot }))
        patchPane(paneId, {
          viewType: 'origin-plot',
          plotId,
          assetUri: undefined,
          manuscriptUri: undefined,
          literatureUri: undefined,
          figureUri: undefined,
          molUri: undefined,
        })
      } catch (error) {
        showToast('error', error instanceof Error ? error.message : '绘图读取失败')
      } finally {
        setPaneLoading((previous) => ({ ...previous, [paneId]: false }))
      }
    },
    [labId, patchPane, setPaneLoading, setPanePlots, showToast],
  )

  const openTableInPane = React.useCallback(
    async (paneId: CsLabPaneId, uri: string): Promise<void> => {
      patchPane(paneId, {
        viewType: 'table',
        assetUri: uri,
        manuscriptUri: undefined,
        literatureUri: undefined,
        figureUri: undefined,
        molUri: undefined,
        datasetDisplayMode: 'split',
        activeSeriesKeys: undefined,
      })
      setPaneManuscripts((previous) => ({ ...previous, [paneId]: null }))
      setPaneLiterature((previous) => ({ ...previous, [paneId]: null }))
      setPaneCanvases((previous) => ({ ...previous, [paneId]: null }))
      setPaneTables((previous) => ({ ...previous, [paneId]: null }))
      setPaneLoading((previous) => ({ ...previous, [paneId]: true }))
      try {
        const payload = await window.electronAPI.cslab.getAssetTable({ labId, uri })
        if (!payload) throw new Error('该资产没有可读取的数据表')
        setPaneTables((previous) => ({ ...previous, [paneId]: payload }))
      } catch (err) {
        patchPane(paneId, emptyPane(paneId))
        showToast('error', err instanceof Error ? err.message : '数据表读取失败')
      } finally {
        setPaneLoading((previous) => ({ ...previous, [paneId]: false }))
      }
    },
    [labId, patchPane, setPaneCanvases, setPaneLiterature, setPaneLoading, setPaneManuscripts, setPaneTables, showToast],
  )

  const openFigureInPane = React.useCallback(
    (paneId: CsLabPaneId, asset: CsLabAssetSummary): void => {
      patchPane(paneId, {
        viewType: 'figure',
        assetUri: asset.uri,
        figureUri: asset.uri,
        manuscriptUri: undefined,
        literatureUri: undefined,
        molUri: undefined,
      })
      setPaneTables((previous) => ({ ...previous, [paneId]: null }))
      setPaneManuscripts((previous) => ({ ...previous, [paneId]: null }))
      setPaneLiterature((previous) => ({ ...previous, [paneId]: null }))
      setPaneCanvases((previous) => ({ ...previous, [paneId]: null }))
      setPaneMol((previous) => ({ ...previous, [paneId]: null }))
      setPaneLoading((previous) => ({ ...previous, [paneId]: false }))
    },
    [
      patchPane,
      setPaneCanvases,
      setPaneLiterature,
      setPaneLoading,
      setPaneManuscripts,
      setPaneMol,
      setPaneTables,
    ],
  )

  const openManuscriptInPane = React.useCallback(
    async (paneId: CsLabPaneId, summary: CsLabManuscriptSummary): Promise<void> => {
      // 同一文稿只允许在一个窗格中打开，避免双编辑器互相覆盖。
      const existingPane = CSLAB_PANE_IDS.find(
        (id) => paneManuscripts[id]?.uri === summary.uri,
      )
      if (existingPane) {
        focusPane(existingPane)
        showToast('info', '该文稿已在其他窗格打开')
        return
      }

      patchPane(paneId, {
        viewType: 'manuscript',
        manuscriptUri: summary.uri,
        assetUri: undefined,
        literatureUri: undefined,
      })
      setPaneTables((previous) => ({ ...previous, [paneId]: null }))
      setPaneLiterature((previous) => ({ ...previous, [paneId]: null }))
      setPaneCanvases((previous) => ({ ...previous, [paneId]: null }))
      setPaneLoading((previous) => ({ ...previous, [paneId]: true }))
      try {
        const manuscript = await window.electronAPI.cslab.getManuscript({
          labId,
          uri: summary.uri,
        })
        if (!manuscript) throw new Error('文稿不存在')
        setPaneManuscripts((previous) => ({ ...previous, [paneId]: manuscript }))
        setPaneTitles((previous) => ({ ...previous, [paneId]: manuscript.title }))
        setDirtyPanes((previous) => ({ ...previous, [paneId]: false }))
      } catch (err) {
        patchPane(paneId, emptyPane(paneId))
        showToast('error', err instanceof Error ? err.message : '文稿读取失败')
      } finally {
        setPaneLoading((previous) => ({ ...previous, [paneId]: false }))
      }
    },
    [
      focusPane,
      labId,
      paneManuscripts,
      patchPane,
      setPaneCanvases,
      setPaneLiterature,
      setPaneLoading,
      setPaneManuscripts,
      setPaneTables,
      showToast,
    ],
  )

  const openLiteratureInPane = React.useCallback(
    async (
      paneId: CsLabPaneId,
      literature: CsLabLiteratureItem,
      initialPage?: number,
    ): Promise<void> => {
      const existingPane = CSLAB_PANE_IDS.find(
        (id) => paneLiterature[id]?.uri === literature.uri,
      )
      if (existingPane) {
        focusPane(existingPane)
        if (initialPage) patchPane(existingPane, { pdfInitialPage: initialPage })
        showToast('info', '该文献已在其他窗格打开')
        return
      }

      patchPane(paneId, {
        viewType: 'pdf',
        literatureUri: literature.uri,
        assetUri: undefined,
        manuscriptUri: undefined,
        pdfInitialPage: initialPage,
      })
      setPaneTables((previous) => ({ ...previous, [paneId]: null }))
      setPaneManuscripts((previous) => ({ ...previous, [paneId]: null }))
      setPaneCanvases((previous) => ({ ...previous, [paneId]: null }))
      setPaneLoading((previous) => ({ ...previous, [paneId]: true }))
      try {
        const item = await window.electronAPI.cslab.getLiteratureItem({
          labId,
          uri: literature.uri,
        })
        if (!item) throw new Error('文献不存在或已移动')
        setPaneLiterature((previous) => ({ ...previous, [paneId]: item }))
      } catch (err) {
        patchPane(paneId, emptyPane(paneId))
        setPaneLiterature((previous) => ({ ...previous, [paneId]: null }))
        showToast('error', err instanceof Error ? err.message : '文献读取失败')
      } finally {
        setPaneLoading((previous) => ({ ...previous, [paneId]: false }))
      }
    },
    [
      focusPane,
      labId,
      paneLiterature,
      patchPane,
      setPaneCanvases,
      setPaneLiterature,
      setPaneLoading,
      setPaneManuscripts,
      setPaneTables,
      showToast,
    ],
  )

  const openCanvasInPane = React.useCallback(
    async (paneId: CsLabPaneId, relPath: string): Promise<void> => {
      const existingPane = CSLAB_PANE_IDS.find(
        (id) => panes[id].viewType === 'dag' && panes[id].canvasRelPath === relPath,
      )
      if (existingPane) {
        focusPane(existingPane)
        showToast('info', '该画布已在其他窗格打开')
        return
      }

      patchPane(paneId, {
        viewType: 'dag',
        canvasRelPath: relPath,
        canvasMtimeMs: undefined,
        assetUri: undefined,
        manuscriptUri: undefined,
        literatureUri: undefined,
      })
      setPaneTables((previous) => ({ ...previous, [paneId]: null }))
      setPaneManuscripts((previous) => ({ ...previous, [paneId]: null }))
      setPaneLiterature((previous) => ({ ...previous, [paneId]: null }))
      setPaneCanvases((previous) => ({ ...previous, [paneId]: null }))
      setPaneLoading((previous) => ({ ...previous, [paneId]: true }))
      try {
        const result = await window.electronAPI.cslab.readCanvas({ labId, relPath })
        setPaneCanvases((previous) => ({ ...previous, [paneId]: result.document }))
        patchPane(paneId, { canvasMtimeMs: result.mtimeMs })
      } catch (err) {
        patchPane(paneId, emptyPane(paneId))
        showToast('error', err instanceof Error ? err.message : '画布读取失败')
      } finally {
        setPaneLoading((previous) => ({ ...previous, [paneId]: false }))
      }
    },
    [
      focusPane,
      labId,
      panes,
      patchPane,
      setPaneCanvases,
      setPaneLiterature,
      setPaneLoading,
      setPaneManuscripts,
      setPaneTables,
      showToast,
    ],
  )

  const openMolInPane = React.useCallback(
    async (paneId: CsLabPaneId, asset: CsLabAssetSummary): Promise<void> => {
      const existingPane = CSLAB_PANE_IDS.find(
        (id) => panes[id].viewType === 'mol' && panes[id].molUri === asset.uri,
      )
      if (existingPane) {
        focusPane(existingPane)
        showToast('info', '该结构已在其他窗格打开')
        return
      }

      patchPane(paneId, {
        viewType: 'mol',
        molUri: asset.uri,
        assetUri: asset.uri,
        manuscriptUri: undefined,
        literatureUri: undefined,
      })
      setPaneTables((previous) => ({ ...previous, [paneId]: null }))
      setPaneManuscripts((previous) => ({ ...previous, [paneId]: null }))
      setPaneLiterature((previous) => ({ ...previous, [paneId]: null }))
      setPaneCanvases((previous) => ({ ...previous, [paneId]: null }))
      setPaneMol((previous) => ({ ...previous, [paneId]: null }))
      setPaneLoading((previous) => ({ ...previous, [paneId]: true }))
      try {
        const payload = await window.electronAPI.cslab.getMolAsset({
          labId,
          uri: asset.uri,
        })
        if (!payload) throw new Error('结构文件不可读')
        setPaneMol((previous) => ({ ...previous, [paneId]: payload }))
      } catch (err) {
        patchPane(paneId, emptyPane(paneId))
        showToast('error', err instanceof Error ? err.message : '结构读取失败')
      } finally {
        setPaneLoading((previous) => ({ ...previous, [paneId]: false }))
      }
    },
    [
      focusPane,
      labId,
      panes,
      patchPane,
      setPaneCanvases,
      setPaneLiterature,
      setPaneLoading,
      setPaneManuscripts,
      setPaneMol,
      setPaneTables,
      showToast,
    ],
  )

  const openAssetInPane = React.useCallback(
    async (paneId: CsLabPaneId, asset: CsLabAssetSummary): Promise<void> => {
      const capability = resolveAssetCapability(asset)
      if (capability.kind === 'figure') {
        openFigureInPane(paneId, asset)
        return
      }
      if (asset.layerType === 'table') {
        await openTableInPane(paneId, asset.uri)
        return
      }
      if (asset.layerType === 'raw') {
        // 原始仪器文件优先穿透到 derived_from 血缘表；没有可解析数据才回落元数据抽屉。
        try {
          const derivedTableUri = await window.electronAPI.cslab.resolveDerivedTable({
            labId,
            uri: asset.uri,
          })
          if (derivedTableUri) {
            await openTableInPane(paneId, derivedTableUri)
            return
          }
        } catch (error) {
          showToast('error', error instanceof Error ? error.message : '派生数据表解析失败')
        }
        setDrawer({ open: true, mode: 'asset', title: asset.title, assetUri: asset.uri })
        return
      }
      if (asset.layerType === 'doc') {
        const summary = manuscripts.find((item) => item.uri === asset.uri)
        if (summary) {
          await openManuscriptInPane(paneId, summary)
          return
        }
      }
      if (asset.layerType === 'lit') {
        try {
          const item = await window.electronAPI.cslab.getLiteratureItem({
            labId,
            uri: asset.uri,
          })
          if (item?.hasFile) {
            await openLiteratureInPane(paneId, item)
            return
          }
          showToast('error', item ? '该文献没有可用的 PDF 文件' : '文献不存在')
        } catch (err) {
          showToast('error', err instanceof Error ? err.message : '文献读取失败')
        }
      }
      if (asset.layerType === 'note') {
        if (asset.format === 'canvas' && asset.relPath) {
          await openCanvasInPane(paneId, asset.relPath)
          return
        }
        setDrawer({ open: true, mode: 'notes', title: '笔记与推演' })
        return
      }
      if (asset.layerType === 'proto' || asset.layerType === 'run') {
        setRunSeed(null)
        setDrawer({ open: true, mode: 'runs', title: '实验规程与批次' })
        return
      }
      if (asset.layerType === 'mol') {
        await openMolInPane(paneId, asset)
        return
      }
      setDrawer({ open: true, mode: 'asset', title: asset.title, assetUri: asset.uri })
    },
    [
      labId,
      manuscripts,
      openCanvasInPane,
      openFigureInPane,
      openLiteratureInPane,
      openManuscriptInPane,
      openMolInPane,
      openTableInPane,
      setDrawer,
      setRunSeed,
      showToast,
    ],
  )

  const openDragPayloadInPane = React.useCallback(
    async (paneId: CsLabPaneId, payload: CsLabAssetDragPayload): Promise<void> => {
      if (payload.kind === 'manuscript') {
        const summary = manuscripts.find((item) => item.uri === payload.uri)
        if (summary) await openManuscriptInPane(paneId, summary)
        return
      }
      const asset = assets.find((item) => item.uri === payload.uri)
      if (asset) {
        await openAssetInPane(paneId, asset)
        return
      }
      setDrawer({ open: true, mode: 'asset', title: payload.title, assetUri: payload.uri })
    },
    [assets, manuscripts, openAssetInPane, openManuscriptInPane, setDrawer],
  )

  const pickTargetPane = React.useCallback((): CsLabPaneId => {
    const visible = visiblePaneIds(layout, activePaneId)
    return visible.find((id) => panes[id].viewType === 'empty') ?? activePaneId
  }, [layout, activePaneId, panes])

  // ===== 生命周期 =====

  React.useEffect(() => {
    // 切换实验室：清空窗格与相关临时状态，避免跨沙箱污染。
    setPanes(emptyPaneRecord())
    setPaneTables(
      CSLAB_PANE_IDS.reduce(
        (acc, id) => {
          acc[id] = null
          return acc
        },
        {} as Record<CsLabPaneId, CsLabTablePayload | null>,
      ),
    )
    setPaneManuscripts(
      CSLAB_PANE_IDS.reduce(
        (acc, id) => {
          acc[id] = null
          return acc
        },
        {} as Record<CsLabPaneId, CsLabManuscript | null>,
      ),
    )
    setPaneLiterature(
      CSLAB_PANE_IDS.reduce(
        (acc, id) => {
          acc[id] = null
          return acc
        },
        {} as Record<CsLabPaneId, CsLabLiteratureItem | null>,
      ),
    )
    setPaneCanvases(
      CSLAB_PANE_IDS.reduce(
        (acc, id) => {
          acc[id] = null
          return acc
        },
        {} as Record<CsLabPaneId, CsLabCanvasDocument | null>,
      ),
    )
    setPaneMol(
      CSLAB_PANE_IDS.reduce(
        (acc, id) => {
          acc[id] = null
          return acc
        },
        {} as Record<CsLabPaneId, CsLabMolAsset | null>,
      ),
    )
    setZoteroStatus(null)
    setPaneLoading(emptyBooleanRecord())
    setSavingPanes(emptyBooleanRecord())
    setDirtyPanes(emptyBooleanRecord())
    setPaneTitles(
      CSLAB_PANE_IDS.reduce(
        (acc, id) => {
          acc[id] = ''
          return acc
        },
        {} as Record<CsLabPaneId, string>,
      ),
    )
    setActivePaneId('pane-1')
    setStaleCapsules(new Set<string>())
    setDrawer({ open: false, mode: 'asset' })
    setToolSeed(null)
    setRunSeed(null)
    setAssetDrag(null)
    setTileTarget(null)
    bootstrappedLabRef.current = null
  }, [
    labId,
    setActivePaneId,
    setAssetDrag,
    setDrawer,
    setPaneLiterature,
    setPaneCanvases,
    setPaneLoading,
    setPaneManuscripts,
    setPaneTables,
    setPanes,
    setRunSeed,
    setStaleCapsules,
    setTileTarget,
    setToolSeed,
    setZoteroStatus,
  ])

  // 离开实验室时停止 WAL 监听，避免后台无主的文件句柄。
  React.useEffect(() => {
    return () => {
      void window.electronAPI.cslab.stopZoteroWatch(labId).catch(() => undefined)
    }
  }, [labId])

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void refreshAssets()
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '工作台载入失败')
          setActiveLabId(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshAssets, setActiveLabId])

  React.useEffect(() => {
    if (loading) return
    if (bootstrappedLabRef.current === labId) return

    const allEmpty = CSLAB_PANE_IDS.every((id) => panes[id].viewType === 'empty')
    if (!allEmpty) {
      bootstrappedLabRef.current = labId
      return
    }

    const latestTable = assets.find((asset) => asset.layerType === 'table')
    const latestManuscript = manuscripts[0]
    const latestLiterature = assets.find((asset) => asset.layerType === 'lit')
    if (!latestTable && !latestManuscript && !latestLiterature) {
      bootstrappedLabRef.current = labId
      return
    }

    bootstrappedLabRef.current = labId
    let cancelled = false
    void (async () => {
      if (latestTable) {
        await openTableInPane('pane-1', latestTable.uri)
        if (!cancelled && latestManuscript && layout !== 'single') {
          await openManuscriptInPane('pane-2', latestManuscript)
        }
      } else if (latestLiterature) {
        const item = await window.electronAPI.cslab.getLiteratureItem({
          labId,
          uri: latestLiterature.uri,
        })
        if (item?.hasFile) {
          await openLiteratureInPane('pane-1', item)
        } else if (latestManuscript) {
          await openManuscriptInPane('pane-1', latestManuscript)
        }
      } else if (latestManuscript) {
        await openManuscriptInPane('pane-1', latestManuscript)
      }
      if (!cancelled) setActivePaneId('pane-1')
    })()

    return () => {
      cancelled = true
    }
  }, [
    loading,
    labId,
    assets,
    manuscripts,
    panes,
    layout,
    openTableInPane,
    openManuscriptInPane,
    openLiteratureInPane,
    setActivePaneId,
  ])

  useCsLabEvents(labId, {
    onAssetChanged: React.useCallback(() => {
      void refreshAssets().catch(() => undefined)
    }, [refreshAssets]),
    onZoteroSynced: React.useCallback(() => {
      void refreshAssets().catch(() => undefined)
    }, [refreshAssets]),
    onStructureFocused: React.useCallback(
      async (event: CsLabStructureFocusedEvent) => {
        if (event.labId !== labId) return
        try {
          const latestAssets = await window.electronAPI.cslab.listAssets(labId)
          setAssets(latestAssets)
          const target = latestAssets.find((item) => item.uri === event.uri)
          if (target) {
            await openMolInPane(activePaneId, target)
            showToast('success', `AI 助理已在 VESTA 视窗中展开《${target.title}》`)
          } else {
            showToast('error', '未能定位目标晶体资产')
          }
        } catch (err) {
          showToast('error', err instanceof Error ? err.message : '打开晶体视窗失败')
        }
      },
      [activePaneId, labId, openMolInPane, setAssets, showToast],
    ),
    onPlotUpdated: React.useCallback(
      (event: CsLabPlotUpdatedEvent) => {
        setPlotList((previous) => {
          const next = previous.filter((item) => item.id !== event.plot.id)
          next.unshift({
            id: event.plot.id,
            title: event.plot.title,
            updatedAt: event.plot.updatedAt,
            presetId: event.plot.presetId,
          })
          return next
        })
        setPanePlots((previous) => ({ ...previous, [activePaneId]: event.plot }))
        setPanes((previous) => ({
          ...previous,
          [activePaneId]: {
            ...previous[activePaneId],
            viewType: 'origin-plot',
            plotId: event.plot.id,
          },
        }))
        // 仅 Agent 写回且存在旧版本时才提供撤销入口。
        if (event.source === 'agent' && event.undoToken) {
          setUndoState({ token: event.undoToken, plotId: event.plot.id })
          if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current)
          undoTimerRef.current = window.setTimeout(() => {
            undoTimerRef.current = null
            setUndoState(null)
          }, 10_000)
        }
      },
      [activePaneId, setPanePlots, setPanes, setPlotList],
    ),
  })

  React.useEffect(() => {
    let cancelled = false
    void window.electronAPI.cslab
      .listPlots(labId)
      .then((items) => {
        if (!cancelled) setPlotList(items)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [labId, setPlotList])

  // 首次进入时读取 Zotero 状态（只做轻量探测，不复制数据库）。
  React.useEffect(() => {
    let cancelled = false
    void window.electronAPI.cslab
      .getZoteroStatus(labId)
      .then((status) => {
        if (!cancelled) setZoteroStatus(status)
      })
      .catch(() => {
        if (!cancelled) setZoteroStatus(null)
      })
    return () => {
      cancelled = true
    }
  }, [labId, setZoteroStatus])

  // ===== 快捷键 =====

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      const next = LAYOUT_SHORTCUTS[event.key]
      if (!next) return
      event.preventDefault()
      setLayout(next)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setLayout])

  React.useEffect(() => {
    const visible = visiblePaneIds(layout, activePaneId)
    if (!visible.includes(activePaneId)) {
      setActivePaneId(visible[0] ?? 'pane-1')
    }
  }, [layout, activePaneId, setActivePaneId])

  // ===== 窗格操作 =====

  const activatePane = React.useCallback(
    (paneId: CsLabPaneId): void => {
      setActivePaneId(paneId)
    },
    [setActivePaneId],
  )

  const closePane = React.useCallback(
    (paneId: CsLabPaneId): void => {
      patchPane(paneId, emptyPane(paneId))
      setPaneTables((previous) => ({ ...previous, [paneId]: null }))
      setPaneManuscripts((previous) => ({ ...previous, [paneId]: null }))
      setPaneLiterature((previous) => ({ ...previous, [paneId]: null }))
      setPaneCanvases((previous) => ({ ...previous, [paneId]: null }))
      setPaneLoading((previous) => ({ ...previous, [paneId]: false }))
      setDirtyPanes((previous) => ({ ...previous, [paneId]: false }))
      setPaneTitles((previous) => ({ ...previous, [paneId]: '' }))
      editorRefs.current[paneId] = null
      if (activePaneId === paneId) {
        const visible = visiblePaneIds(layout, paneId)
        const next = visible.find((id) => id !== paneId) ?? 'pane-1'
        setActivePaneId(next)
      }
    },
    [
      activePaneId,
      layout,
      patchPane,
      setActivePaneId,
      setDirtyPanes,
      setPaneCanvases,
      setPaneLiterature,
      setPaneLoading,
      setPaneManuscripts,
      setPaneTables,
    ],
  )

  const maximizePane = React.useCallback(
    (paneId: CsLabPaneId): void => {
      setActivePaneId(paneId)
      setLayout('single')
    },
    [setActivePaneId, setLayout],
  )

  const handlePaneDirtyChange = React.useCallback(
    (paneId: CsLabPaneId, dirty: boolean): void => {
      setDirtyPanes((previous) =>
        previous[paneId] === dirty ? previous : { ...previous, [paneId]: dirty },
      )
    },
    [],
  )

  const handlePaneTitleChange = React.useCallback(
    (paneId: CsLabPaneId, title: string): void => {
      setPaneTitles((previous) =>
        previous[paneId] === title ? previous : { ...previous, [paneId]: title },
      )
    },
    [],
  )

  const handleDropAssetOnPane = React.useCallback(
    (paneId: CsLabPaneId, payload: CsLabAssetDragPayload): void => {
      setActivePaneId(paneId)
      setAssetDrag(null)
      setTileTarget(null)
      void openDragPayloadInPane(paneId, payload)
    },
    [openDragPayloadInPane, setActivePaneId, setAssetDrag, setTileTarget],
  )

  const handleTileDrop = React.useCallback(
    (paneId: CsLabPaneId, payload: CsLabAssetDragPayload): void => {
      if (layout !== 'grid-4') setLayout('grid-4')
      handleDropAssetOnPane(paneId, payload)
    },
    [handleDropAssetOnPane, layout, setLayout],
  )

  // ===== 摄取 / 导入 =====

  const ingestPaths = React.useCallback(
    async (paths: string[]): Promise<void> => {
      if (paths.length === 0) return
      setDrawer({ open: true, mode: 'ingest', title: '数据摄取工序' })
      showToast('info', `开始摄取 ${paths.length} 个文件…`)
      try {
        const results = await window.electronAPI.cslab.ingestFiles({ labId, paths })
        await refreshAssets()
        const failed = results.filter((item) => item.status === 'error')
        const unsupported = results.filter((item) => item.status === 'unsupported')
        if (failed.length > 0) {
          showToast('error', `${failed.length} 个文件摄取失败：${failed[0]?.message ?? ''}`)
        } else if (unsupported.length > 0) {
          showToast('info', `${unsupported.length} 个文件已只读入笼，但格式暂不支持解析`)
        } else {
          showToast('success', `已完成 ${results.length} 个文件的只读入笼`)
        }
        const firstTable = results.find((item) => item.tableUri)?.tableUri
        if (firstTable) {
          const paneId = pickTargetPane()
          setActivePaneId(paneId)
          await openTableInPane(paneId, firstTable)
        } else {
          const firstLiterature = results.find((item) => item.asset.layerType === 'lit')?.asset
          if (firstLiterature) {
            const item = await window.electronAPI.cslab.getLiteratureItem({
              labId,
              uri: firstLiterature.uri,
            })
            if (item) {
              const paneId = pickTargetPane()
              setActivePaneId(paneId)
              await openLiteratureInPane(paneId, item)
            }
          }
        }
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : '摄取失败')
      }
    },
    [
      labId,
      openTableInPane,
      pickTargetPane,
      refreshAssets,
      setActivePaneId,
      setDrawer,
      showToast,
      openLiteratureInPane,
    ],
  )

  const importDocx = React.useCallback(
    async (docxPath: string): Promise<void> => {
      try {
        const fileName = docxPath.split(/[\\/]/).pop()?.replace(/\.docx$/i, '') ?? ''
        const result = await window.electronAPI.cslab.importDocx({
          labId,
          docxPath,
          title: fileName || undefined,
        })
        await refreshAssets()
        const paneId = pickTargetPane()
        setActivePaneId(paneId)
        await openManuscriptInPane(paneId, {
          uri: result.manuscript.uri,
          title: result.manuscript.title,
          updatedAt: result.manuscript.updatedAt,
          hasDocx: true,
        })
        showToast('success', result.message ?? 'Word 文稿已导入')
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : 'Word 导入失败')
      }
    },
    [
      labId,
      openManuscriptInPane,
      pickTargetPane,
      refreshAssets,
      setActivePaneId,
      showToast,
    ],
  )

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault()
      dragDepth.current = 0
      setDragging(false)

      if (event.dataTransfer.types.includes(CSLAB_CELL_MIME)) return

      const files = Array.from(event.dataTransfer.files)
      if (files.length === 0) return

      const docxFiles = files.filter((file) => file.name.toLowerCase().endsWith('.docx'))
      const instrumentFiles = files.filter((file) => !file.name.toLowerCase().endsWith('.docx'))

      for (const file of docxFiles) {
        try {
          const path = window.electronAPI.getPathForFile(file)
          if (path) void importDocx(path)
        } catch {
          // 沙箱环境无法取得真实路径时忽略。
        }
      }

      const paths = instrumentFiles
        .map((file) => {
          try {
            return window.electronAPI.getPathForFile(file)
          } catch {
            return ''
          }
        })
        .filter((path): path is string => !!path)

      void ingestPaths(paths)
    },
    [importDocx, ingestPaths],
  )

  // ===== 文稿保存 =====

  const savePaneManuscript = React.useCallback(
    async (
      paneId: CsLabPaneId,
      docJson: unknown,
      title: string,
      capsules: CsLabCapsule[],
    ): Promise<void> => {
      const manuscript = paneManuscripts[paneId]
      if (!manuscript) return
      setSavingPanes((previous) => ({ ...previous, [paneId]: true }))
      try {
        const saved = await window.electronAPI.cslab.saveManuscript({
          labId,
          uri: manuscript.uri,
          title,
          docJson,
          capsules,
        })
        setPaneManuscripts((previous) => ({ ...previous, [paneId]: saved }))
        setPaneTitles((previous) => ({ ...previous, [paneId]: saved.title }))
        setDirtyPanes((previous) => ({ ...previous, [paneId]: false }))
        await refreshAssets()
        showToast('success', '文稿已保存')
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : '保存失败')
        throw err
      } finally {
        setSavingPanes((previous) => ({ ...previous, [paneId]: false }))
      }
    },
    [labId, paneManuscripts, refreshAssets, setPaneManuscripts, showToast],
  )


  const savePaneManuscriptAs = React.useCallback(
    async (
      paneId: CsLabPaneId,
      docJson: unknown,
      title: string,
      capsules: CsLabCapsule[],
    ): Promise<void> => {
      const manuscript = paneManuscripts[paneId]
      if (!manuscript) return

      const safeTitle = (title || manuscript.title || '未命名文稿').replace(/[\\/:*?"<>|]/g, '_')
      const dialogResult = await window.electronAPI.cslab.showSaveFileDialog({
        title: '论文文稿另存为',
        defaultPath: `${safeTitle}.docx`,
        filters: [
          { name: 'Word 文档 (*.docx)', extensions: ['docx'] },
          { name: 'Markdown 文档 (*.md)', extensions: ['md'] },
          { name: '所有文件 (*.*)', extensions: ['*'] },
        ],
      })
      if (!dialogResult) return
      const { filePath: targetPath, saveToken } = dialogResult

      setSavingPanes((previous) => ({ ...previous, [paneId]: true }))
      try {
        const result = await window.electronAPI.cslab.saveManuscriptAs({
          labId,
          uri: manuscript.uri,
          targetPath,
          saveToken,
          title,
          docJson,
          capsules,
        })
        setPaneTitles((previous) => ({ ...previous, [paneId]: title }))
        setDirtyPanes((previous) => ({ ...previous, [paneId]: false }))
        await refreshAssets()
        showToast('success', result.message ?? '文稿已成功另存为', {
          label: '在文件夹中显示',
          path: result.targetPath,
        })
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : '另存为失败')
        throw err
      } finally {
        setSavingPanes((previous) => ({ ...previous, [paneId]: false }))
      }
    },
    [labId, paneManuscripts, refreshAssets, showToast],
  )

  const flushPane = React.useCallback(
    async (paneId: CsLabPaneId): Promise<void> => {
      if (!dirtyPanes[paneId]) return
      const editor = editorRefs.current[paneId]
      const manuscript = paneManuscripts[paneId]
      if (!editor || !manuscript) return
      const docJson = editor.getJSON()
      const capsules = collectCapsulesFromDoc(docJson, labId)
      await savePaneManuscript(
        paneId,
        docJson,
        paneTitles[paneId] || manuscript.title,
        capsules,
      )
    },
    [dirtyPanes, labId, paneManuscripts, paneTitles, savePaneManuscript],
  )

  const createManuscript = React.useCallback(async (): Promise<void> => {
    try {
      const manuscript = await window.electronAPI.cslab.createManuscript({
        labId,
        title: `未命名文稿 ${manuscripts.length + 1}`,
      })
      await refreshAssets()
      const paneId = pickTargetPane()
      setActivePaneId(paneId)
      setPaneManuscripts((previous) => ({ ...previous, [paneId]: manuscript }))
      setPaneTitles((previous) => ({ ...previous, [paneId]: manuscript.title }))
      setDirtyPanes((previous) => ({ ...previous, [paneId]: false }))
      setPaneTables((previous) => ({ ...previous, [paneId]: null }))
      setPaneLiterature((previous) => ({ ...previous, [paneId]: null }))
      setPaneCanvases((previous) => ({ ...previous, [paneId]: null }))
      patchPane(paneId, {
        viewType: 'manuscript',
        manuscriptUri: manuscript.uri,
        assetUri: undefined,
        literatureUri: undefined,
      })
      showToast('success', '已创建新文稿')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : '创建文稿失败')
    }
  }, [
    labId,
    manuscripts.length,
    patchPane,
    pickTargetPane,
    refreshAssets,
    setActivePaneId,
    setPaneCanvases,
    setPaneLiterature,
    setPaneManuscripts,
    setPaneTables,
    showToast,
  ])

  // ===== 胶囊 =====

  const currentCapsule: CsLabCapsule | null = React.useMemo(() => {
    if (!drawer.capsuleId) return null
    for (const paneId of CSLAB_PANE_IDS) {
      const capsule = paneManuscripts[paneId]?.capsules.find(
        (item) => item.id === drawer.capsuleId,
      )
      if (capsule) return capsule
    }
    return null
  }, [drawer.capsuleId, paneManuscripts])

  const openCapsuleDrawer = React.useCallback(
    (capsuleId: string): void => {
      setDrawer({ open: true, mode: 'capsule', capsuleId, title: '活体胶囊' })
    },
    [setDrawer],
  )

  React.useEffect(() => {
    if (!drawer.open || drawer.mode !== 'capsule' || !drawer.capsuleId) {
      setLineage(null)
      return
    }
    let cancelled = false
    void window.electronAPI.cslab
      .getCapsuleLineage({ labId, capsuleId: drawer.capsuleId })
      .then((result) => {
        if (!cancelled) setLineage(result)
      })
      .catch(() => {
        if (!cancelled) setLineage(null)
      })
    return () => {
      cancelled = true
    }
  }, [drawer.open, drawer.mode, drawer.capsuleId, labId])

  const handleUpdateCapsule = React.useCallback(
    async (capsuleId: string): Promise<void> => {
      try {
        const capsule = await window.electronAPI.cslab.updateCapsule({ labId, capsuleId })
        const paneId = CSLAB_PANE_IDS.find((id) =>
          paneManuscripts[id]?.capsules.some((item) => item.id === capsuleId),
        )
        const editor = paneId ? editorRefs.current[paneId] : null
        if (editor) applyUpdatedCapsule(editor, capsule)

        setStaleCapsules((previous) => {
          const next = new Set(previous)
          next.delete(capsuleId)
          return next
        })

        if (paneId && editor) {
          const docJson = editor.getJSON()
          const capsules = collectCapsulesFromDoc(docJson, labId)
          await savePaneManuscript(
            paneId,
            docJson,
            paneTitles[paneId] || paneManuscripts[paneId]?.title || '未命名文稿',
            capsules,
          )
        }

        const refreshed = await window.electronAPI.cslab.getCapsuleLineage({ labId, capsuleId })
        setLineage(refreshed)
        showToast(
          'success',
          `胶囊已更新为 ${capsule.value}${capsule.unit ? ` ${capsule.unit}` : ''}`,
        )
        await refreshAssets()
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : '胶囊更新失败')
      }
    },
    [
      labId,
      paneManuscripts,
      paneTitles,
      refreshAssets,
      savePaneManuscript,
      setStaleCapsules,
      showToast,
    ],
  )

  const handleAppendCellToManuscript = React.useCallback(
    async (
      summary: CsLabManuscriptSummary,
      cellRef: CsLabCellRef,
    ): Promise<void> => {
      try {
        const existingPane = CSLAB_PANE_IDS.find(
          (id) => paneManuscripts[id]?.uri === summary.uri,
        )
        const editor = existingPane ? editorRefs.current[existingPane] : null
        const attrs = buildCapsuleAttrs(cellRef)

        if (existingPane && editor) {
          const nodeType = editor.state.schema.nodes.scienceCapsule
          const paragraphType = editor.state.schema.nodes.paragraph
          if (!nodeType || !paragraphType) throw new Error('编辑器缺少胶囊节点')
          const paragraph = paragraphType.create(null, nodeType.create(attrs))
          const transaction = editor.state.tr.insert(
            editor.state.doc.content.size,
            paragraph,
          )
          editor.view.dispatch(transaction)

          const docJson = editor.getJSON()
          const capsules = collectCapsulesFromDoc(docJson, labId)
          await savePaneManuscript(
            existingPane,
            docJson,
            paneTitles[existingPane] || summary.title,
            capsules,
          )
          focusPane(existingPane)
        } else {
          const manuscript = await window.electronAPI.cslab.getManuscript({
            labId,
            uri: summary.uri,
          })
          if (!manuscript) throw new Error('文稿不存在')

          const doc = cloneDocJson(manuscript.docJson)
          doc.content.push({
            type: 'paragraph',
            content: [{ type: 'scienceCapsule', attrs }],
          })
          const capsules: CsLabCapsule[] = [
            ...manuscript.capsules,
            {
              id: attrs.capsuleId,
              labId,
              label: attrs.label,
              value: attrs.value,
              unit: attrs.unit || undefined,
              tableUri: attrs.tableUri,
              column: attrs.column,
              rowIndex: attrs.rowIndex,
              revisionAtBind: attrs.revisionAtBind,
              status: 'fresh',
              updatedAt: Date.now(),
            },
          ]
          await window.electronAPI.cslab.saveManuscript({
            labId,
            uri: manuscript.uri,
            title: manuscript.title,
            docJson: doc,
            capsules,
          })
          await refreshAssets()
          const paneId = pickTargetPane()
          setActivePaneId(paneId)
          await openManuscriptInPane(paneId, summary)
        }

        showToast('success', '胶囊已追加到文稿末尾')
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : '追加胶囊失败')
      }
    },
    [
      focusPane,
      labId,
      openManuscriptInPane,
      paneManuscripts,
      paneTitles,
      pickTargetPane,
      refreshAssets,
      savePaneManuscript,
      setActivePaneId,
      showToast,
    ],
  )

  // ===== Word 导出 / 同步 =====

  const targetManuscript: CsLabManuscript | null = React.useMemo(() => {
    const active = paneManuscripts[activePaneId]
    if (active) return active
    for (const paneId of CSLAB_PANE_IDS) {
      const manuscript = paneManuscripts[paneId]
      if (manuscript) return manuscript
    }
    return null
  }, [activePaneId, paneManuscripts])

  const handleExportDocx = React.useCallback(async (): Promise<void> => {
    if (!targetManuscript) return
    try {
      const paneId = CSLAB_PANE_IDS.find(
        (id) => paneManuscripts[id]?.uri === targetManuscript.uri,
      )
      if (paneId) await flushPane(paneId)

      const result = await window.electronAPI.cslab.exportDocx({
        labId,
        manuscriptUri: targetManuscript.uri,
      })
      if (paneId) {
        const refreshed = await window.electronAPI.cslab.getManuscript({
          labId,
          uri: targetManuscript.uri,
        })
        if (refreshed) {
          setPaneManuscripts((previous) => ({ ...previous, [paneId]: refreshed }))
        }
      }
      await refreshAssets()
      showToast('success', result.message ?? 'Word 文稿已导出', {
        label: '在文件夹中显示',
        path: result.docxPath,
      })
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Word 导出失败')
    }
  }, [
    flushPane,
    labId,
    paneManuscripts,
    refreshAssets,
    setPaneManuscripts,
    showToast,
    targetManuscript,
  ])

  const handleSyncDocx = React.useCallback(async (): Promise<void> => {
    if (!targetManuscript) return
    try {
      const paneId = CSLAB_PANE_IDS.find(
        (id) => paneManuscripts[id]?.uri === targetManuscript.uri,
      )
      if (paneId) await flushPane(paneId)

      const result = await window.electronAPI.cslab.syncDocx({
        labId,
        manuscriptUri: targetManuscript.uri,
      })
      const needsRebind = result.missingDataBindingIds.length > 0
      showToast(
        result.documentXmlUnchanged ? (needsRebind ? 'info' : 'success') : 'error',
        result.documentXmlUnchanged
          ? result.message ?? 'Word 数据胶囊已同步（document.xml 未改动）'
          : '同步写入了 document.xml，已中止无损承诺，请检查模板',
        { label: '在文件夹中显示', path: result.docxPath },
      )
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Word 同步失败')
    }
  }, [flushPane, labId, paneManuscripts, showToast, targetManuscript])

  const handleBackToLabs = (): void => {
    setActiveLabId(null)
    setDrawer({ open: false, mode: 'asset' })
  }

  // ===== 渲染辅助 =====

  const selectedAsset = React.useMemo(
    () => assets.find((asset) => asset.uri === drawer.assetUri) ?? null,
    [assets, drawer.assetUri],
  )

  const assetTitles = React.useMemo(() => {
    const map: Record<string, string> = {}
    for (const asset of assets) map[asset.uri] = asset.title
    for (const manuscript of manuscripts) map[manuscript.uri] = manuscript.title
    return map
  }, [assets, manuscripts])

  const allPanesEmpty = CSLAB_PANE_IDS.every((id) => panes[id].viewType === 'empty')
  const showWelcome = allPanesEmpty && assets.length === 0 && manuscripts.length === 0

  const activeAssetUri = panes[activePaneId].assetUri ?? null
  const activeManuscriptUri = panes[activePaneId].manuscriptUri ?? null

  const drawerTitle =
    drawer.mode === 'ingest'
      ? '数据摄取工序'
      : drawer.mode === 'capsule'
        ? currentCapsule?.label ?? '活体胶囊'
        : drawer.mode === 'selection'
          ? '框选区域'
          : drawer.mode === 'plot'
            ? '图表逆向数字化'
            : drawer.mode === 'formula'
              ? '公式识别与验算'
              : drawer.mode === 'brain'
                ? '文献智脑'
                : drawer.mode === 'zotero'
                  ? 'Zotero 文献同步'
                  : drawer.mode === 'runs'
                    ? '实验规程与批次'
                    : drawer.mode === 'notes'
                      ? '笔记与推演'
                      : drawer.mode === 'tools'
                        ? '科研工具运行时'
                        : selectedAsset?.title ?? drawer.title ?? '资产详情'

  const drawerSubtitle =
    drawer.mode === 'ingest'
      ? 'LIVE INGEST'
      : drawer.mode === 'capsule'
        ? 'CAPSULE LINEAGE'
        : drawer.mode === 'selection'
          ? `PAGE ${(drawer.selection?.pageIndex ?? 0) + 1}`
          : drawer.mode === 'plot'
            ? 'PLOT DIGITIZER'
            : drawer.mode === 'formula'
              ? 'FORMULA VERIFIER'
              : drawer.mode === 'brain'
                ? 'CROSS-LITERATURE GRAPHRAG'
                : drawer.mode === 'zotero'
                  ? 'ZOTERO READ-ONLY SYNC'
                  : drawer.mode === 'runs'
                    ? 'PROTOCOL · RUN TIMELINE'
                    : drawer.mode === 'notes'
                      ? 'OBSIDIAN VAULT · JSON CANVAS'
                      : drawer.mode === 'tools'
                      ? 'PYTHON TOOL REGISTRY'
                      : drawer.mode === 'share'
                        ? 'NETWORK SHARE WATCH'
                        : drawer.mode === 'hpc'
                          ? 'HPC CLUSTER BRIDGE'
                          : selectedAsset
                            ? `${LAYER_LABELS[selectedAsset.layerType] ?? selectedAsset.layerType} · ${selectedAsset.format ?? 'unknown'}`
                            : 'ASSET'

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-cslab-bg font-sans text-cslab-text"
      onDragEnter={(event) => {
        if (!event.dataTransfer.types.includes('Files')) return
        dragDepth.current += 1
        setDragging(true)
      }}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes('Files')) event.preventDefault()
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (dragDepth.current === 0) setDragging(false)
      }}
      onDrop={handleDrop}
    >
      <header
        className="relative z-20 flex h-14 shrink-0 items-center gap-3 border-b border-cslab-border"
        style={{
          paddingLeft: isMac ? 96 : 20,
          paddingRight: isWindows ? resolveWindowControlsRightInset(true) + 8 : 20,
        }}
      >
        <div
          className="titlebar-drag-region absolute inset-y-0 left-0"
          style={{ right: isWindows ? resolveWindowControlsRightInset(true) : 0 }}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={handleBackToLabs}
          className="titlebar-no-drag relative inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
        >
          <ArrowLeft size={13} />
          实验室
        </button>

        <div className="titlebar-no-drag relative min-w-0">
          <div className="flex items-baseline gap-2">
            <h1 className="truncate font-serif text-[15px] font-medium text-cslab-text">
              {snapshot?.lab.name ?? '实验室'}
            </h1>
            <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-cslab-muted">
              {snapshot?.lab.code}
            </span>
          </div>
          <p className="truncate text-[10px] text-cslab-muted">
            {snapshot
              ? `${snapshot.counts.raw ?? 0} 份原始数据 · ${snapshot.counts.table ?? 0} 张数据表`
              : '正在载入…'}
          </p>
        </div>

        <div className="titlebar-no-drag relative ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const plot = panePlots[activePaneId]
              void window.electronAPI.cslab.openAgentWindow({
                labId,
                context: plot
                  ? {
                      labId,
                      source: 'asset',
                      prompt: `我当前正在查看绘图《${plot.title}》（plotId=${plot.id}）。请先读取该绘图，等待我的进一步分析要求。`,
                      plotId: plot.id,
                      plotTitle: plot.title,
                      createdAt: Date.now(),
                    }
                  : undefined,
              })
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
            title="呼出科学助理"
          >
            <Sparkles size={12} />
            科学助理
          </button>
          <button
            type="button"
            onClick={() => setDrawer({ open: true, mode: 'zotero', title: 'Zotero 文献同步' })}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
            title={zoteroStatus?.message ?? 'Zotero 文献同步'}
          >
            <BookOpen size={12} />
            Zotero
            <span
              className={cn(
                'size-1.5 rounded-full',
                zoteroStatus?.availability === 'ready'
                  ? 'bg-cslab-accent'
                  : 'bg-cslab-border',
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => setDrawer({ open: true, mode: 'brain', title: '文献智脑' })}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <Brain size={12} />
            文献智脑
          </button>
          <button
            type="button"
            title="实验规程与批次"
            onClick={() => {
              setRunSeed(null)
              setDrawer({ open: true, mode: 'runs', title: '实验规程与批次' })
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <FlaskConical size={12} />
            <span className="hidden xl:inline">实验</span>
          </button>
          <button
            type="button"
            title="笔记与推演"
            onClick={() => setDrawer({ open: true, mode: 'notes', title: '笔记与推演' })}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <Network size={12} />
            <span className="hidden xl:inline">笔记</span>
          </button>
          <button
            type="button"
            title="科研工具运行时"
            onClick={() => {
              setToolSeed(null)
              setDrawer({ open: true, mode: 'tools', title: '科研工具运行时' })
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <Wrench size={12} />
            <span className="hidden xl:inline">工具</span>
          </button>
          <button
            type="button"
            title="局域网仪器共享盘"
            onClick={() => setDrawer({ open: true, mode: 'share', title: '局域网仪器共享盘' })}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <HardDrive size={12} />
            <span className="hidden xl:inline">共享盘</span>
          </button>
          <button
            type="button"
            title="远程算力集群"
            onClick={() => setDrawer({ open: true, mode: 'hpc', title: '远程算力集群' })}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <Server size={12} />
            <span className="hidden xl:inline">超算</span>
          </button>
          <span className="mx-0.5 h-5 w-px bg-cslab-border" aria-hidden="true" />
          <CsLabSplitControls layout={layout} onChange={setLayout} />
          <span className="mx-0.5 h-5 w-px bg-cslab-border" aria-hidden="true" />

          <input
            ref={docxInputRef}
            type="file"
            accept=".docx"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                try {
                  void importDocx(window.electronAPI.getPathForFile(file))
                } catch {
                  showToast('error', '无法读取所选文件路径')
                }
              }
              event.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => docxInputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <Upload size={12} />
            导入 Word
          </button>
          <button
            type="button"
            disabled={!targetManuscript}
            onClick={() => void handleExportDocx()}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={12} />
            导出 Word
          </button>
          <button
            type="button"
            disabled={!targetManuscript?.docxPath}
            onClick={() => void handleSyncDocx()}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileUp size={12} />
            同步胶囊
          </button>
          <button
            type="button"
            onClick={() => void refreshAssets()}
            title="刷新资产"
            aria-label="刷新资产"
            className="rounded-lg p-1.5 text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <CsLabAssetRail
          assets={assets}
          manuscripts={manuscripts}
          plotList={plotList}
          activeAssetUri={activeAssetUri}
          activeManuscriptUri={activeManuscriptUri}
          loading={loading}
          onSelectAsset={(asset) => void openAssetInPane(activePaneId, asset)}
          onSelectManuscript={(summary) => void openManuscriptInPane(activePaneId, summary)}
          onSelectPlot={(plotId) => void openPlotInPane(activePaneId, plotId)}
          onCreateManuscript={() => void createManuscript()}
          onAppendCellToManuscript={(summary, cellRef) =>
            void handleAppendCellToManuscript(summary, cellRef)
          }
        />

        <main className="relative flex min-w-0 flex-1 flex-col">
          {error && (
            <p className="m-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          {showWelcome ? (
            <div className="flex flex-1 items-center justify-center px-8">
              <div className="w-full max-w-lg text-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cslab-accent">
                  Research Stage
                </p>
                <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-cslab-text">
                  把仪器数据拖进来
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cslab-muted">
                  支持 CSV / TXT / MAT / XRD / SPC / JCAMP-DX。文件将以 SHA-256 只读入笼，
                  解析为二维数据表；把单元格拖入论文，即可生成会呼吸的活体胶囊。
                  也可以把 Obsidian 的 Markdown 与 .canvas 放进 vault/notes，自动登记双链与推演画布。
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => void createManuscript()}
                    className="rounded-lg bg-cslab-accent px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-cslab-accentHover"
                  >
                    新建论文文稿
                  </button>
                  <button
                    type="button"
                    onClick={() => docxInputRef.current?.click()}
                    className="rounded-lg border border-cslab-border px-3.5 py-2 text-xs text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
                  >
                    导入 Word
                  </button>
                </div>

                {snapshot && (
                  <div className="mt-8 grid grid-cols-4 gap-2 text-left">
                    {[
                      { label: '原始数据', value: snapshot.counts.raw ?? 0 },
                      { label: '数据表', value: snapshot.counts.table ?? 0 },
                      { label: '文稿', value: snapshot.counts.doc ?? 0 },
                      { label: '胶囊', value: snapshot.counts.capsule ?? 0 },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-cslab-border bg-cslab-surface/60 px-3 py-2.5"
                      >
                        <p className="text-[10px] uppercase tracking-[0.12em] text-cslab-muted">
                          {item.label}
                        </p>
                        <p className="mt-1 font-serif text-xl tabular-nums text-cslab-text">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-6 text-[10px] leading-relaxed text-cslab-muted">
                  {snapshot?.python.note ?? '正在探测可选 Python 增强能力…'}
                </p>
              </div>
            </div>
          ) : (
            <CsLabStageGrid
              layout={layout}
              activePaneId={activePaneId}
              panes={panes}
              tables={paneTables}
              manuscripts={paneManuscripts}
              literature={paneLiterature}
              canvases={paneCanvases}
              mols={paneMol}
              assets={assets}
              loading={paneLoading}
              saving={savingPanes}
              staleCapsuleIds={staleCapsules}
              labId={labId}
              assetTitles={assetTitles}
              onActivatePane={activatePane}
              onClosePane={closePane}
              onMaximizePane={maximizePane}
              onEditorReady={(paneId, editor) => {
                editorRefs.current[paneId] = editor
              }}
              onSaveManuscript={savePaneManuscript}
              onSaveManuscriptAs={savePaneManuscriptAs}
              onDirtyChange={handlePaneDirtyChange}
              onTitleChange={handlePaneTitleChange}
              onCapsuleClick={openCapsuleDrawer}
              onCellClick={(cell: CsLabCellRef) => {
                setDrawer({
                  open: true,
                  mode: 'asset',
                  title: `${cell.label} · 第 ${cell.rowIndex + 1} 行`,
                  assetUri: cell.tableUri,
                })
              }}
              onPdfSelection={(selection: CsLabPdfSelection) => {
                setDrawer({
                  open: true,
                  mode: 'selection',
                  title: '框选区域',
                  selection,
                })
              }}
              onDropAssetOnPane={handleDropAssetOnPane}
              onCanvasSaved={(paneId, document) => {
                setPaneCanvases((previous) => ({ ...previous, [paneId]: document }))
                void refreshAssets()
              }}
              onToast={showToast}
            />
          )}

          <CsLabTileOverlay
            visible={!!assetDrag}
            targetPaneId={tileTarget}
            onHoverPane={setTileTarget}
            onDropOnPane={handleTileDrop}
          />
        </main>

        <CsLabSlideDrawer
          open={drawer.open}
          title={drawerTitle}
          subtitle={drawerSubtitle}
          wide={
            drawer.mode === 'plot' ||
            drawer.mode === 'formula' ||
            drawer.mode === 'runs' ||
            drawer.mode === 'notes' ||
            drawer.mode === 'tools' ||
            drawer.mode === 'share' ||
            drawer.mode === 'hpc'
          }
          onClose={() => {
            setDrawer((previous) => ({ ...previous, open: false }))
            setToolSeed(null)
            setRunSeed(null)
          }}
        >
          {drawer.mode === 'runs' && (
            <CsLabRunTimeline
              labId={labId}
              assets={assets}
              seedAssetUri={runSeed?.assetUri ?? null}
              onOpenAsset={(uri) => {
                const asset = assets.find((item) => item.uri === uri)
                if (asset) {
                  void openAssetInPane(activePaneId, asset)
                  return
                }
                setDrawer({ open: true, mode: 'asset', title: '资产详情', assetUri: uri })
              }}
              onToast={showToast}
            />
          )}
          {drawer.mode === 'notes' && (
            <CsLabNotesPanel
              labId={labId}
              onOpenCanvas={(relPath) => {
                const paneId = pickTargetPane()
                setActivePaneId(paneId)
                setDrawer((previous) => ({ ...previous, open: false }))
                void openCanvasInPane(paneId, relPath)
              }}
              onToast={showToast}
            />
          )}
          {drawer.mode === 'tools' && (
            <CsLabToolsPanel
              labId={labId}
              initialPath={toolSeed?.path ?? null}
              onToast={showToast}
            />
          )}
          {drawer.mode === 'share' && (
            <CsLabNetworkSharePanel
              labId={labId}
              onToast={showToast}
              onOpenAsset={(uri) => {
                const asset = assets.find((item) => item.uri === uri)
                if (asset) {
                  void openAssetInPane(activePaneId, asset)
                  setDrawer((previous) => ({ ...previous, open: false }))
                  return
                }
                setDrawer({ open: true, mode: 'asset', title: '资产详情', assetUri: uri })
              }}
            />
          )}
          {drawer.mode === 'hpc' && (
            <CsLabHpcPanel
              labId={labId}
              onToast={showToast}
              onOpenAsset={(uri) => {
                const asset = assets.find((item) => item.uri === uri)
                if (asset) {
                  void openAssetInPane(activePaneId, asset)
                  setDrawer((previous) => ({ ...previous, open: false }))
                  return
                }
                setDrawer({ open: true, mode: 'asset', title: '资产详情', assetUri: uri })
              }}
            />
          )}
          {drawer.mode === 'selection' && drawer.selection && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-cslab-border bg-white p-2 shadow-subtle">
                <img
                  src={drawer.selection.cropDataUrl}
                  alt="框选区域"
                  className="max-h-64 w-full object-contain"
                />
              </div>
              <p className="text-[11px] leading-relaxed text-cslab-muted">
                第 {drawer.selection.pageIndex + 1} 页 · 选择后续工序：
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDrawer((previous) => ({ ...previous, open: true, mode: 'plot' }))
                  }
                  className="rounded-lg bg-cslab-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-cslab-accentHover"
                >
                  图表逆向数字化
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDrawer((previous) => ({ ...previous, open: true, mode: 'formula' }))
                  }
                  className="rounded-lg border border-cslab-border px-3 py-2 text-xs text-cslab-text transition-colors hover:bg-cslab-surface"
                >
                  公式识别与验算
                </button>
              </div>
            </div>
          )}

          {drawer.mode === 'plot' && (
            <CsLabPlotDigitizerPanel
              labId={labId}
              selection={drawer.selection}
              onSaved={() => {
                void refreshAssets()
              }}
            />
          )}

          {drawer.mode === 'formula' && (
            <CsLabFormulaPanel labId={labId} selection={drawer.selection} />
          )}

          {drawer.mode === 'brain' && (
            <CsLabLiteratureBrainPanel
              labId={labId}
              onOpenLiterature={(uri, page) => {
                void (async () => {
                  const item = await window.electronAPI.cslab.getLiteratureItem({ labId, uri })
                  if (!item) return
                  await openLiteratureInPane(activePaneId, item, page > 0 ? page : undefined)
                })()
              }}
            />
          )}

          {drawer.mode === 'zotero' && (
            <CsLabZoteroPanel
              labId={labId}
              onChanged={() => {
                void refreshAssets()
              }}
            />
          )}

          {drawer.mode === 'ingest' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-cslab-border bg-cslab-surface p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-cslab-muted">当前文件</p>
                <p className="mt-1 truncate text-xs text-cslab-text">
                  {progress?.fileName ?? '等待文件…'}
                </p>
                <p className="mt-1 text-[11px] text-cslab-muted">
                  {progress
                    ? `${progress.stage} · ${progress.index}/${progress.total}${progress.message ? ` · ${progress.message}` : ''}`
                    : '拖入文件后显示实时工序'}
                </p>
              </div>
              <div className="space-y-2">
                {['copy', 'hash', 'parse', 'write', 'done'].map((stageName) => {
                  const stageOrder = ['copy', 'hash', 'parse', 'write', 'done']
                  const current = progress ? stageOrder.indexOf(progress.stage) : -1
                  const index = stageOrder.indexOf(stageName)
                  const active = current === index
                  const done = current > index
                  return (
                    <div
                      key={stageName}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px]',
                        active
                          ? 'border-cslab-accent/40 bg-cslab-accent/8 text-cslab-accent'
                          : done
                            ? 'border-cslab-border bg-cslab-surface/60 text-cslab-text'
                            : 'border-cslab-border/60 text-cslab-muted',
                      )}
                    >
                      {active ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            done ? 'bg-[#6E8B6A]' : 'bg-cslab-border',
                          )}
                        />
                      )}
                      {{
                        copy: '写入只读暂存区',
                        hash: '渐进 SHA-256',
                        parse: '格式嗅探与解析',
                        write: 'ZSTD Parquet 落盘',
                        done: '实体与血缘入库',
                      }[stageName]}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {drawer.mode !== 'ingest' && drawer.mode !== 'capsule' && selectedAsset && (
            <div className="space-y-4">
              <div className="rounded-xl border border-cslab-border bg-cslab-surface p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-cslab-muted">资产 URI</p>
                <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-cslab-text">
                  {selectedAsset.uri}
                </p>
              </div>

              <dl className="space-y-2 text-[11px]">
                {[
                  ['维度', LAYER_LABELS[selectedAsset.layerType] ?? selectedAsset.layerType],
                  ['格式', selectedAsset.format ?? '—'],
                  ['大小', formatBytes(selectedAsset.bytes)],
                  ['修订', `r${selectedAsset.revision}`],
                  ['只读锁', selectedAsset.locked ? '已启用' : '未启用'],
                  ['更新时间', formatTime(selectedAsset.updatedAt)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-3 border-b border-cslab-border/60 pb-1.5"
                  >
                    <dt className="text-cslab-muted">{label}</dt>
                    <dd className="text-right text-cslab-text">{value}</dd>
                  </div>
                ))}
              </dl>

              {selectedAsset.sha256 && (
                <div className="rounded-xl border border-cslab-border p-3">
                  <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-cslab-muted">
                    <Lock size={10} />
                    SHA-256 完整性凭证
                  </p>
                  <p className="mt-1 break-all font-mono text-[10px] leading-relaxed text-cslab-muted">
                    {selectedAsset.sha256}
                  </p>
                </div>
              )}

              {selectedAsset.unsupported && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-700">
                  {selectedAsset.unsupported}
                </div>
              )}

              {selectedAsset.layerType === 'table' && (
                <button
                  type="button"
                  onClick={() => void openTableInPane(activePaneId, selectedAsset.uri)}
                  className="w-full rounded-lg bg-cslab-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-cslab-accentHover"
                >
                  在激活窗格打开数据表
                </button>
              )}
            </div>
          )}

          {drawer.mode === 'capsule' && (
            <div className="space-y-4">
              {currentCapsule ? (
                <div className="rounded-xl border border-cslab-border bg-cslab-surface p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-cslab-muted">
                    胶囊当前值
                  </p>
                  <p className="mt-1 font-serif text-2xl tabular-nums text-cslab-text">
                    {currentCapsule.value || '—'}
                    {currentCapsule.unit && (
                      <span className="ml-1 text-xs text-cslab-muted">{currentCapsule.unit}</span>
                    )}
                  </p>
                  <p className="mt-1 text-[10px] text-cslab-muted">
                    绑定 revision r{currentCapsule.revisionAtBind} · 状态 {currentCapsule.status}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-cslab-muted">
                  未找到胶囊元数据，可能尚未保存到数据表。
                </p>
              )}

              {lineage && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-cslab-muted">因果血缘</p>
                  <ol className="mt-2 space-y-2">
                    {lineage.chain.map((node, index) => (
                      <li key={`${node.uri}-${index}`} className="relative pl-4">
                        <span className="absolute left-0 top-1.5 size-1.5 rounded-full bg-cslab-accent/70" />
                        {index < lineage.chain.length - 1 && (
                          <span className="absolute left-[3px] top-3 h-[calc(100%+4px)] w-px bg-cslab-border" />
                        )}
                        <p className="text-[11px] font-medium text-cslab-text">{node.title}</p>
                        <p className="text-[10px] text-cslab-muted">
                          {LAYER_LABELS[node.layerType] ?? node.layerType} · {node.relation ?? '—'}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 text-[10px] leading-relaxed text-cslab-muted">
                    当前值 {lineage.currentValue || '—'} · 上次绑定 {lineage.previousValue || '—'}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (drawer.capsuleId) void handleUpdateCapsule(drawer.capsuleId)
                }}
                className="w-full rounded-lg bg-cslab-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-cslab-accentHover"
              >
                一键更新胶囊
              </button>

              {targetManuscript?.docxPath && (
                <button
                  type="button"
                  onClick={() => void handleSyncDocx()}
                  className="w-full rounded-lg border border-cslab-border px-3 py-2 text-xs text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
                >
                  同步到 Word 文稿
                </button>
              )}
            </div>
          )}

          {drawer.mode !== 'ingest' && drawer.mode !== 'capsule' && !selectedAsset && (
            <p className="text-[11px] leading-relaxed text-cslab-muted">
              {drawer.title ?? '选择一个资产查看详情'}
            </p>
          )}
        </CsLabSlideDrawer>
      </div>

      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-cslab-bg/80 backdrop-blur-[2px]">
          <div className="rounded-2xl border border-dashed border-cslab-accent/60 bg-cslab-elevated px-10 py-8 text-center shadow-subtle">
            <p className="font-serif text-lg text-cslab-text">松手以只读入笼</p>
            <p className="mt-1 text-xs text-cslab-muted">
              仪器文件将计算 SHA-256 并解析为数据表；.docx 将导入为文稿
            </p>
          </div>
        </div>
      )}

      {undoState && (
        <div className="absolute right-6 top-16 z-50 flex items-center gap-2 rounded-xl border border-cslab-border bg-cslab-elevated px-3 py-1.5 text-xs shadow-subtle">
          <Sparkles size={12} className="text-cslab-accent" />
          <span className="text-cslab-text">AI 助理已更新图表</span>
          <button
            type="button"
            onClick={() => void handleUndoPlot()}
            className="font-semibold text-cslab-accent hover:underline"
          >
            撤销
          </button>
        </div>
      )}

      {toast && (
        <div
          className={cn(
            'absolute bottom-5 left-1/2 z-50 flex max-w-[560px] -translate-x-1/2 items-center gap-3 rounded-lg border px-4 py-2 text-xs shadow-subtle',
            toast.kind === 'error'
              ? 'border-red-200 bg-red-50 text-red-600'
              : toast.kind === 'success'
                ? 'border-cslab-accent/30 bg-cslab-elevated text-cslab-text'
                : 'border-cslab-border bg-cslab-elevated text-cslab-muted',
          )}
        >
          <span className="min-w-0 flex-1">{toast.text}</span>
          {toast.action && (
            <button
              type="button"
              onClick={() => void window.electronAPI.showItemInFolder(toast.action!.path)}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
            >
              <FolderOpen size={10} />
              {toast.action.label}
            </button>
          )}
        </div>
      )}
      {hpcMfa && (
        <div className="fixed bottom-6 right-6 z-[60] w-[330px] rounded-xl border border-cslab-border bg-cslab-elevated p-3 shadow-subtle">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-cslab-accent" />
            <p className="font-serif text-sm text-cslab-text">超算二次验证</p>
            <button
              type="button"
              onClick={() => setHpcMfa(null)}
              className="ml-auto rounded p-0.5 text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
              title="取消"
            >
              ×
            </button>
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-cslab-muted">
            {hpcMfa.prompt || '请输入动态验证码（TOTP / Duo）'}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <input
              autoFocus
              value={mfaValue}
              onChange={(event) => setMfaValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void window.electronAPI.cslab
                    .answerHpcMfa({ requestId: hpcMfa.requestId, value: mfaValue })
                    .then((result) => {
                      if (result.ok) {
                        setHpcMfa(null)
                        setMfaValue('')
                      } else {
                        showToast('error', '验证码请求已过期')
                      }
                    })
                }
              }}
              placeholder="6 位验证码"
              className="w-full rounded-lg border border-cslab-border bg-cslab-bg px-2.5 py-1.5 font-mono text-xs tracking-widest text-cslab-text placeholder:tracking-normal placeholder:text-cslab-muted/60 focus:border-cslab-accent/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                void window.electronAPI.cslab
                  .answerHpcMfa({ requestId: hpcMfa.requestId, value: mfaValue })
                  .then((result) => {
                    if (result.ok) {
                      setHpcMfa(null)
                      setMfaValue('')
                    } else {
                      showToast('error', '验证码请求已过期')
                    }
                  })
              }}
              className="shrink-0 rounded-lg bg-cslab-accent px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-cslab-accentHover"
            >
              确认
            </button>
          </div>
          <p className="mt-1.5 text-[9px] text-cslab-muted">
            验证码仅用于本次 SSH 握手，不会写入本地配置。
          </p>
        </div>
      )}
    </div>
  )
}
