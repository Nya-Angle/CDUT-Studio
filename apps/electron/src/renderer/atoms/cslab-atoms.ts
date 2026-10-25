/**
 * CSLab Atoms - CDUT Science 客户端状态管理
 *
 * 安全红线契约：
 * 门禁验证态只来自主进程内存会话，绝不在客户端持久化任何凭据或验证标记。
 */

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type {
  CsLabTelemetry,
  CsLabNode,
  CsLabLogEntry,
  CsLabLab,
  CsLabLabSnapshot,
  CsLabAssetSummary,
  CsLabTablePayload,
  CsLabManuscriptSummary,
  CsLabManuscript,
  CsLabIngestProgress,
  CsLabLiteratureItem,
  CsLabToolDepsProgress,
  CsLabToolRuntimeStatus,
  CsLabZoteroStatus,
  CsLabProtocol,
  CsLabRun,
  CsLabVaultNoteSummary,
  CsLabVaultIndexStatus,
  CsLabCustomToolScan,
  CsLabCanvasDocument,
  CsLabCanvasSummary,
  CsLabShareSourceSummary,
  CsLabShareCandidate,
  CsLabShareStatusEvent,
  CsLabHpcProfileSummary,
  CsLabHpcJob,
  CsLabHpcMfaRequest,
  CsLabMolAsset,
  CsLabAtomSiteSelection,
  CsLabGeoRasterPayload,
  CsLabPaneViewType,
  CsLabPlotCalibration,
  CsLabPlotDocument,
  CsLabPlotSummary,
} from '@profer/shared'

export type { CsLabPaneViewType }
import type { CsLabAssetDragPayload } from '@/components/cdut-science/cslab-dnd'

export interface CsLabClientAuthState {
  /** 本机是否已设置访问密码 */
  isInitialized: boolean
  /** 当前运行会话是否已解锁 */
  isVerified: boolean
  /** 是否已完成一次与主进程的状态同步，避免首屏误判 */
  hydrated: boolean
}

/**
 * CSLab 本机门禁状态原子（不持久化，验证态仅来自主进程内存会话）
 */
export const cslabAuthAtom = atom<CsLabClientAuthState>({
  isInitialized: false,
  isVerified: false,
  hydrated: false,
})

/**
 * 实时遥测状态原子
 */
export const cslabTelemetryAtom = atom<CsLabTelemetry | null>(null)

/**
 * 计算节点拓扑原子
 */
export const cslabNodesAtom = atom<CsLabNode[]>([])

/**
 * 审计日志原子
 */
export const cslabLogsAtom = atom<CsLabLogEntry[]>([])

// ===== Phase 1：实验室沙箱与科研资产 =====

/** 真实实验室列表（来自主进程 index/manifest，不再使用硬编码假数据）。 */
export const cslabLabsAtom = atom<CsLabLab[]>([])

/** 当前选中的实验室 id（持久化，重启后回到上次实验室）。 */
export const cslabActiveLabIdAtom = atomWithStorage<string | null>('cslab-active-lab-id', null)

/** 当前实验室快照（计数、最近资产、Python 能力）。 */
export const cslabSnapshotAtom = atom<CsLabLabSnapshot | null>(null)

/** 当前实验室全部资产（左侧导航使用）。 */
export const cslabAssetsAtom = atom<CsLabAssetSummary[]>([])

// ===== 四分屏舞台 =====

export type CsLabPaneId = 'pane-1' | 'pane-2' | 'pane-3' | 'pane-4'
export type CsLabSplitLayout = 'single' | 'split-vertical' | 'split-horizontal' | 'grid-4'
export type CsLabDatasetDisplayMode = 'split' | 'strip' | 'table'

export interface CsLabPaneState {
  id: CsLabPaneId
  viewType: CsLabPaneViewType
  assetUri?: string
  manuscriptUri?: string
  literatureUri?: string
  /** 分子/晶体窗格对应的 mol 资产 URI。 */
  molUri?: string
  /** 2.5D 地貌窗格对应的 geo 资产 URI。 */
  geoUri?: string
  /** 图表/图像窗格对应的图片资产 URI。 */
  figureUri?: string
  /** 数据窗格的展示模式（曲线 / 表格 / 分屏）。 */
  datasetDisplayMode?: CsLabDatasetDisplayMode
  /** 数据窗格当前可见的通道 key；缺省表示全部显示。 */
  activeSeriesKeys?: string[]
  /** DAG 窗格对应的 Canvas 相对路径。 */
  canvasRelPath?: string
  /** 打开 Canvas 时的磁盘 mtime（冲突检测基线）。 */
  canvasMtimeMs?: number
  /** PDF 窗格首次定位页码（1 起）。 */
  pdfInitialPage?: number
  /** PDF 窗格聚焦高亮（文献智脑命中联动）：页码 + 页内归一化 bbox。 */
  pdfFocusHighlight?: { page: number; bbox: [number, number, number, number] }
  /** 出版图窗格对应的绘图文档标识。 */
  plotId?: string
}

export const CSLAB_PANE_IDS: CsLabPaneId[] = ['pane-1', 'pane-2', 'pane-3', 'pane-4']

function emptyPanes(): Record<CsLabPaneId, CsLabPaneState> {
  return {
    'pane-1': { id: 'pane-1', viewType: 'empty' },
    'pane-2': { id: 'pane-2', viewType: 'empty' },
    'pane-3': { id: 'pane-3', viewType: 'empty' },
    'pane-4': { id: 'pane-4', viewType: 'empty' },
  }
}

function emptyRecord<T>(factory: () => T): Record<CsLabPaneId, T> {
  return {
    'pane-1': factory(),
    'pane-2': factory(),
    'pane-3': factory(),
    'pane-4': factory(),
  }
}

/** 四个窗格的布局状态（会话级）。 */
export const cslabPanesAtom = atom<Record<CsLabPaneId, CsLabPaneState>>(emptyPanes())

/** 当前激活窗格（决定左侧点击的落点与单屏展示对象）。 */
export const cslabActivePaneIdAtom = atom<CsLabPaneId>('pane-1')

/** 分屏布局偏好（持久化）。 */
export const cslabSplitLayoutAtom = atomWithStorage<CsLabSplitLayout>(
  'cslab-split-layout',
  'split-vertical',
)

/** 每窗格的数据表载荷。 */
export const cslabPaneTablesAtom = atom<Record<CsLabPaneId, CsLabTablePayload | null>>(
  emptyRecord(() => null),
)

/** 每窗格的文稿载荷。 */
export const cslabPaneManuscriptsAtom = atom<Record<CsLabPaneId, CsLabManuscript | null>>(
  emptyRecord(() => null),
)

/** 每窗格的 PDF 文献载荷。 */
export const cslabPaneLiteratureAtom = atom<Record<CsLabPaneId, CsLabLiteratureItem | null>>(
  emptyRecord(() => null),
)

/** 每窗格的 Canvas 文档载荷。 */
export const cslabPaneCanvasesAtom = atom<Record<CsLabPaneId, CsLabCanvasDocument | null>>(
  emptyRecord(() => null),
)

/** 每窗格的分子/晶体载荷。 */
export const cslabPaneMolAtom = atom<Record<CsLabPaneId, CsLabMolAsset | null>>(
  emptyRecord(() => null),
)

/** 每窗格的 2.5D 地貌载荷。 */
export const cslabPaneGeoAtom = atom<Record<CsLabPaneId, CsLabGeoRasterPayload | null>>(
  emptyRecord(() => null),
)

/** 每窗格的出版绘图文档载荷。 */
export const cslabPanePlotsAtom = atom<Record<CsLabPaneId, CsLabPlotDocument | null>>(
  emptyRecord(() => null),
)

/** 当前实验室的出版图列表（左侧资产导航使用）。 */
export const cslabPlotListAtom = atom<CsLabPlotSummary[]>([])

/** 当前激活的绘图文档（抽屉与导出共享）。 */
export const cslabActivePlotAtom = atom<CsLabPlotDocument | null>(null)

/** Zotero 同步状态（文献库可用性、批注计数与监听状态）。 */
export const cslabZoteroStatusAtom = atom<CsLabZoteroStatus | null>(null)

/** 实验室可选 Python 工具运行时状态。 */
export const cslabToolRuntimeAtom = atom<CsLabToolRuntimeStatus | null>(null)

/** Python 依赖安装进度（最近一次）。 */
export const cslabToolDepsProgressAtom = atom<CsLabToolDepsProgress | null>(null)

/** 每窗格的加载态。 */
export const cslabPaneLoadingAtom = atom<Record<CsLabPaneId, boolean>>(
  emptyRecord(() => false),
)

/** 当前正在拖拽的资产载荷（驱动四分屏投射遮罩）。 */
export const cslabAssetDragAtom = atom<CsLabAssetDragPayload | null>(null)

/** 四分屏遮罩中当前悬停的窗格。 */
export const cslabTileTargetAtom = atom<CsLabPaneId | null>(null)

/** 论文列表（左侧导航使用）。 */
export const cslabManuscriptsAtom = atom<CsLabManuscriptSummary[]>([])

// ===== Phase 3：实验规程 / 批次 / Vault / 工具 =====

/** 当前实验室的规程模板。 */
export const cslabProtocolsAtom = atom<CsLabProtocol[]>([])

/** 当前实验室的实验批次（按时间倒序）。 */
export const cslabRunsAtom = atom<CsLabRun[]>([])

/** Vault 笔记摘要（含反向链接计数）。 */
export const cslabNotesAtom = atom<CsLabVaultNoteSummary[]>([])

/** 当前选中要查看/编辑的 Vault 笔记相对路径（如 vault/notes/...）。 */
export const cslabSelectedNoteRelPathAtom = atom<string | null>(null)

/** Vault 索引状态（笔记/Canvas/链接数）。 */
export const cslabVaultIndexAtom = atom<CsLabVaultIndexStatus | null>(null)

/** Canvas 文件列表。 */
export const cslabCanvasesAtom = atom<CsLabCanvasSummary[]>([])

/** 自定义 Python 工具扫描结果。 */
export const cslabCustomToolsAtom = atom<CsLabCustomToolScan | null>(null)

export type CsLabDrawerMode =
  | 'asset'
  | 'capsule'
  | 'ingest'
  | 'lineage'
  | 'selection'
  | 'plot'
  | 'formula'
  | 'translate'
  | 'brain'
  | 'zotero'
  | 'runs'
  | 'notes'
  | 'tools'
  | 'share'
  | 'hpc'
  | 'fit'
  | 'symmetry'
  | 'pxrd'
  | 'isosurface'

export interface CsLabPdfSelection {
  literatureUri: string
  pageIndex: number
  pageWidth: number
  pageHeight: number
  rect: { x: number; y: number; width: number; height: number }
  cropDataUrl: string
  /** PDF 矢量文字直读结果；为空表示纯图片选区，走视觉 LLM / OCR 兜底。 */
  vectorText?: string
  /** 演示图版预置标定（标准曲线一键逆向化）。 */
  demoCalibration?: CsLabPlotCalibration
}

export interface CsLabDrawerState {
  open: boolean
  mode: CsLabDrawerMode
  title?: string
  capsuleId?: string
  /** 资产详情抽屉所指向的资产 URI（不再依赖单一 activeAssetUri）。 */
  assetUri?: string
  /** PDF 框选载荷（selection/plot/formula/translate 模式共用）。 */
  selection?: CsLabPdfSelection
  query?: string
}

/** 右侧智能上下文抽屉。 */
export const cslabDrawerAtom = atom<CsLabDrawerState>({
  open: false,
  mode: 'asset',
})

/** 左侧六维资产导航折叠态（会话级内存原子，不落盘，离开实验室即复位）。 */
export const cslabAssetRailCollapsedAtom = atom<boolean>(false)

/** 右侧抽屉普通模式的自定义宽度（持久化，单位 px）。 */
export const cslabDrawerNormalWidthAtom = atomWithStorage<number>('cslab-drawer-normal-width', 380)

/** 右侧抽屉宽屏模式的自定义宽度（持久化，单位 px）。 */
export const cslabDrawerWideWidthAtom = atomWithStorage<number>('cslab-drawer-wide-width', 520)

/** 处于陈旧状态的胶囊 id 集合（驱动琥珀色呼吸灯）。 */
export const cslabStaleCapsulesAtom = atom<Set<string>>(new Set<string>())

/** 摄取进度（最近一个文件）。 */
export const cslabIngestProgressAtom = atom<CsLabIngestProgress | null>(null)

export interface CsLabToast {
  kind: 'info' | 'success' | 'error'
  text: string
  /** 可选操作（如“在文件夹中显示”）。 */
  action?: { label: string; path: string }
}

/** 轻量操作反馈（不引入全局 toast 依赖）。 */
export const cslabToastAtom = atom<CsLabToast | null>(null)

// ===== Phase 4：共享盘 / 超算 / 结构选择 =====

/** 局域网共享盘源列表。 */
export const cslabShareSourcesAtom = atom<CsLabShareSourceSummary[]>([])

/** 共享盘候选文件（生命周期与租约证据）。 */
export const cslabShareCandidatesAtom = atom<CsLabShareCandidate[]>([])

/** 最近一次共享盘状态事件（离线/恢复提示）。 */
export const cslabShareStatusAtom = atom<CsLabShareStatusEvent | null>(null)

/** 集群档案列表。 */
export const cslabHpcProfilesAtom = atom<CsLabHpcProfileSummary[]>([])

/** 远程作业列表。 */
export const cslabHpcJobsAtom = atom<CsLabHpcJob[]>([])

/** 待回答的 MFA 挑战（非空时弹出验证码卡片）。 */
export const cslabHpcMfaAtom = atom<CsLabHpcMfaRequest | null>(null)

/** 最近一次 3D 原子拾取（供谱带高亮与后续 Agent 上下文）。 */
export const cslabAtomSelectionAtom = atom<CsLabAtomSiteSelection | null>(null)

// ===== 文件能力动作种子 =====

/** 从数据集动作栏进入工具抽屉时携带的数据表绝对路径。 */
export const cslabToolSeedAtom = atom<{ path: string; label: string } | null>(null)

/** 从数据集动作栏进入实验批次抽屉时预选的资产。 */
export const cslabRunSeedAtom = atom<{ assetUri: string; title: string } | null>(null)
