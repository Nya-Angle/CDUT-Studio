/**
 * CDUT Science (CSLab) - 共享类型契约与 IPC 通道常量
 *
 * 模块代号：CSLab
 * 覆盖：授权遥测（历史契约）+ 实验室沙箱 / 数据铁笼 / 活体胶囊 / 论文文稿。
 */

import type { CsLabPlotDocument } from './cslab-origin-types'

export const CSLAB_IPC_CHANNELS = {
  // ===== 授权与遥测（历史契约，保留） =====
  VERIFY_KEY: 'cslab:verify-key',
  GET_AUTH_STATUS: 'cslab:get-auth-status',
  INIT_PASSWORD: 'cslab:init-password',
  VERIFY_PASSWORD: 'cslab:verify-password',
  LOCK_SESSION: 'cslab:lock-session',
  GET_TELEMETRY: 'cslab:get-telemetry',
  GET_NODES: 'cslab:get-nodes',
  GET_LOGS: 'cslab:get-logs',
  PING: 'cslab:ping',

  // ===== 实验室沙箱 =====
  LIST_LABS: 'cslab:list-labs',
  CREATE_LAB: 'cslab:create-lab',
  CREATE_DEMO_LAB: 'cslab:create-demo-lab',
  /** 重置演示实验室：清理沙箱并重新写入官方样本。 */
  RESET_DEMO_LAB: 'cslab:reset-demo-lab',
  OPEN_LAB: 'cslab:open-lab',
  GET_LAB_SNAPSHOT: 'cslab:get-lab-snapshot',
  RENAME_LAB: 'cslab:rename-lab',
  DELETE_LAB: 'cslab:delete-lab',
  TOGGLE_PIN_LAB: 'cslab:toggle-pin-lab',
  TOGGLE_ARCHIVE_LAB: 'cslab:toggle-archive-lab',

  // ===== 数据铁笼 =====
  INGEST_FILES: 'cslab:ingest-files',
  LIST_ASSETS: 'cslab:list-assets',
  GET_ASSET_TABLE: 'cslab:get-asset-table',
  GET_TABLE_CELL: 'cslab:get-table-cell',
  RESOLVE_DERIVED_TABLE: 'cslab:resolve-derived-table',
  GET_ASSET_FILE_INFO: 'cslab:get-asset-file-info',
  GET_ASSET_DATA_URL: 'cslab:get-asset-data-url',
  EXPORT_TABLE: 'cslab:export-table',

  // ===== 论文与胶囊 =====
  LIST_MANUSCRIPTS: 'cslab:list-manuscripts',
  CREATE_MANUSCRIPT: 'cslab:create-manuscript',
  GET_MANUSCRIPT: 'cslab:get-manuscript',
  SAVE_MANUSCRIPT: 'cslab:save-manuscript',
  SAVE_MANUSCRIPT_AS: 'cslab:save-manuscript-as',
  SHOW_SAVE_FILE_DIALOG: 'cslab:show-save-file-dialog',
  IMPORT_DOCX: 'cslab:import-docx',
  SYNC_DOCX: 'cslab:sync-docx',
  EXPORT_DOCX: 'cslab:export-docx',
  UPDATE_CAPSULE: 'cslab:update-capsule',
  GET_CAPSULE_LINEAGE: 'cslab:get-capsule-lineage',

  // ===== 环境能力 =====
  GET_PYTHON_CAPABILITY: 'cslab:get-python-capability',
  GET_TOOL_RUNTIME: 'cslab:get-tool-runtime',
  INSTALL_TOOL_DEPS: 'cslab:install-tool-deps',

  // ===== Zotero 文献同步 =====
  ZOTERO_GET_STATUS: 'cslab:zotero-status',
  ZOTERO_DISCOVER: 'cslab:zotero-discover',
  ZOTERO_SET_DATA_DIR: 'cslab:zotero-set-data-dir',
  ZOTERO_SYNC: 'cslab:zotero-sync',
  ZOTERO_LIST_LITERATURE: 'cslab:zotero-list-literature',
  ZOTERO_LIST_ANNOTATIONS: 'cslab:zotero-list-annotations',
  ZOTERO_START_WATCH: 'cslab:zotero-start-watch',
  ZOTERO_STOP_WATCH: 'cslab:zotero-stop-watch',
  ZOTERO_GET_BRIDGE_STATUS: 'cslab:zotero-bridge-status',
  ZOTERO_BRIDGE_WRITE: 'cslab:zotero-bridge-write',
  /** 一键生成默认 zotero-bridge.json 模板（已存在则不覆盖 token）。 */
  ZOTERO_BRIDGE_INIT_CONFIG: 'cslab:zotero-bridge-init-config',
  /** 用本地 Obsidian 打开实验室 vault/notes。 */
  OPEN_OBSIDIAN_VAULT: 'cslab:open-obsidian-vault',

  // ===== 文献阅读 =====
  GET_LITERATURE_ITEM: 'cslab:get-literature-item',
  GET_LITERATURE_URL: 'cslab:get-literature-url',
  /** 结构化智能导读（按需解析并缓存全文结构）。 */
  GET_LITERATURE_GUIDE: 'cslab:get-literature-guide',

  // ===== 图表逆向数字化 =====
  DIGITIZE_PLOT: 'cslab:digitize-plot',
  SAVE_DIGITIZED_FIGURE: 'cslab:save-digitized-figure',
  /** 刻度数值模板匹配自动读取（read-tick）。 */
  READ_TICK_VALUE: 'cslab:read-tick-value',

  // ===== 公式识别与验算 =====
  OCR_FORMULA: 'cslab:ocr-formula',
  VERIFY_FORMULA: 'cslab:verify-formula',

  // ===== 选区学术翻译（OCR + 隔离补全，防提示词注入） =====
  TRANSLATE_SELECTION: 'cslab:translate-selection',

  // ===== 预置科研算子 =====
  TOOL_PRESET_LIST: 'cslab:tool-preset-list',
  TOOL_PRESET_INSTALL: 'cslab:tool-preset-install',
  TOOL_PRESET_READ: 'cslab:tool-preset-read',

  // ===== 跨文献 GraphRAG =====
  BUILD_LITERATURE_INDEX: 'cslab:build-literature-index',
  SEARCH_LITERATURE: 'cslab:search-literature',
  GET_LITERATURE_GRAPH: 'cslab:get-literature-graph',

  // ===== 跨源学术文献检索（多源联邦） =====
  ACADEMIC_SEARCH: 'cslab:academic-search',
  ACADEMIC_FETCH_PREVIEW: 'cslab:academic-fetch-preview',
  ACADEMIC_INGEST_PAPER: 'cslab:academic-ingest-paper',

  // ===== 论文入库流水线 · 实证抽取 · 3D 拓扑 =====
  GET_LITERATURE_3D_GRAPH: 'cslab:get-literature-3d-graph',
  GET_EMPIRICAL_METRICS: 'cslab:get-empirical-metrics',
  SYNTHESIZE_PAPER_VAULT: 'cslab:synthesize-paper-vault',

  // ===== 实验规程与批次 =====
  RUN_LIST_PROTOCOLS: 'cslab:run-list-protocols',
  RUN_CREATE_PROTOCOL: 'cslab:run-create-protocol',
  RUN_UPDATE_PROTOCOL: 'cslab:run-update-protocol',
  RUN_LIST: 'cslab:run-list',
  RUN_CREATE: 'cslab:run-create',
  RUN_UPDATE: 'cslab:run-update',
  RUN_LINK_ASSET: 'cslab:run-link-asset',
  RUN_UNLINK_ASSET: 'cslab:run-unlink-asset',

  // ===== 笔记 / Canvas / 索引 =====
  VAULT_LIST_NOTES: 'cslab:vault-list-notes',
  VAULT_READ_NOTE: 'cslab:vault-read-note',
  VAULT_SEARCH: 'cslab:vault-search',
  VAULT_BACKLINKS: 'cslab:vault-backlinks',
  VAULT_INDEX_STATUS: 'cslab:vault-index-status',
  VAULT_REBUILD_INDEX: 'cslab:vault-rebuild-index',
  VAULT_START_WATCH: 'cslab:vault-start-watch',
  VAULT_STOP_WATCH: 'cslab:vault-stop-watch',
  CANVAS_LIST: 'cslab:canvas-list',
  CANVAS_CREATE: 'cslab:canvas-create',
  CANVAS_READ: 'cslab:canvas-read',
  CANVAS_WRITE: 'cslab:canvas-write',

  // ===== 自定义科研工具与 uv =====
  CUSTOM_TOOL_LIST: 'cslab:custom-tool-list',
  CUSTOM_TOOL_REFRESH: 'cslab:custom-tool-refresh',
  CUSTOM_TOOL_RUN: 'cslab:custom-tool-run',
  CUSTOM_TOOL_START_WATCH: 'cslab:custom-tool-start-watch',
  CUSTOM_TOOL_STOP_WATCH: 'cslab:custom-tool-stop-watch',
  GET_TOOL_TRUST: 'cslab:get-tool-trust',
  ENSURE_UV: 'cslab:ensure-uv',

  // ===== 局域网仪器共享盘（Phase 4） =====
  SHARE_LIST_SOURCES: 'cslab:share-list-sources',
  SHARE_ADD_SOURCE: 'cslab:share-add-source',
  SHARE_REMOVE_SOURCE: 'cslab:share-remove-source',
  SHARE_TEST_SOURCE: 'cslab:share-test-source',
  SHARE_SCAN_NOW: 'cslab:share-scan-now',
  SHARE_START_WATCH: 'cslab:share-start-watch',
  SHARE_STOP_WATCH: 'cslab:share-stop-watch',
  SHARE_LIST_CANDIDATES: 'cslab:share-list-candidates',

  // ===== 远程算力网关（Phase 4） =====
  HPC_LIST_PROFILES: 'cslab:hpc-list-profiles',
  HPC_SAVE_PROFILE: 'cslab:hpc-save-profile',
  HPC_DELETE_PROFILE: 'cslab:hpc-delete-profile',
  HPC_TEST_CONNECTION: 'cslab:hpc-test-connection',
  HPC_SUBMIT_JOB: 'cslab:hpc-submit-job',
  HPC_LIST_JOBS: 'cslab:hpc-list-jobs',
  HPC_CANCEL_JOB: 'cslab:hpc-cancel-job',
  HPC_REFRESH_JOB: 'cslab:hpc-refresh-job',
  HPC_HARVEST_JOB: 'cslab:hpc-harvest-job',
  HPC_REHYDRATE: 'cslab:hpc-rehydrate',
  HPC_ANSWER_MFA: 'cslab:hpc-answer-mfa',

  // ===== 晶体结构与谱图（Phase 4） =====
  GET_MOL_ASSET: 'cslab:get-mol-asset',
  GET_TABLE_SERIES: 'cslab:get-table-series',
  /** 读取 geo 栅格并降采样为 2.5D 地貌窗格载荷。 */
  GET_GEO_RASTER: 'cslab:get-geo-raster',

  // ===== 科学引擎：晶体分析 / PXRD / 拟合 / 出版绘图 =====
  ANALYZE_CRYSTAL: 'cslab:analyze-crystal',
  SIMULATE_PXRD: 'cslab:simulate-pxrd',
  FIT_PEAKS: 'cslab:fit-peaks',
  SMOOTH_SERIES: 'cslab:smooth-series',
  GET_VOLUME_GRID: 'cslab:get-volume-grid',
  SAVE_PLOT: 'cslab:save-plot',
  LIST_PLOTS: 'cslab:list-plots',
  LOAD_PLOT: 'cslab:load-plot',
  EXPORT_FIGURE: 'cslab:export-figure',
  SNAPSHOT_STRUCTURE: 'cslab:snapshot-structure',
  REQUEST_STRUCTURE_SNAPSHOT: 'cslab:request-structure-snapshot',

  // ===== 学术审稿（Phase 4） =====
  REVIEW_SUGGEST: 'cslab:review-suggest',

  // ===== 会话级实验室绑定 =====
  BIND_SESSION_LAB: 'cslab:bind-session-lab',
  UNBIND_SESSION_LAB: 'cslab:unbind-session-lab',

  // ===== 科学助理独立窗口 =====
  OPEN_AGENT_WINDOW: 'cslab:open-agent-window',
  SEND_TO_AGENT_WINDOW: 'cslab:send-to-agent-window',
  GET_AGENT_WINDOW_CONTEXT: 'cslab:get-agent-window-context',
  UNDO_PLOT_UPDATE: 'cslab:undo-plot-update',

  // ===== 主进程 -> 渲染进程事件 =====
  ON_INGEST_PROGRESS: 'cslab:on-ingest-progress',
  ON_ASSET_CHANGED: 'cslab:on-asset-changed',
  ON_CAPSULE_STALE: 'cslab:on-capsule-stale',
  ON_ZOTERO_SYNCED: 'cslab:on-zotero-synced',
  ON_ZOTERO_STATUS: 'cslab:on-zotero-status',
  ON_TOOL_DEPS_PROGRESS: 'cslab:on-tool-deps-progress',
  ON_VAULT_CHANGED: 'cslab:on-vault-changed',
  ON_DAG_JOBS_CANCELLED: 'cslab:on-dag-jobs-cancelled',
  ON_TOOLS_CHANGED: 'cslab:on-tools-changed',
  ON_SHARE_STATUS: 'cslab:on-share-status',
  ON_HPC_JOB: 'cslab:on-hpc-job',
  ON_HPC_MFA: 'cslab:on-hpc-mfa',
  ON_PLOT_UPDATED: 'cslab:on-plot-updated',
  ON_AGENT_CONTEXT: 'cslab:on-agent-context',
  ON_STRUCTURE_FOCUSED: 'cslab:on-structure-focused',
  ON_ASSET_FOCUSED: 'cslab:on-asset-focused',
} as const

export type CsLabChannelKey = keyof typeof CSLAB_IPC_CHANNELS

// ===== 历史遥测契约 =====

export type CsLabOperationalStatus = 'operational' | 'standby' | 'syncing' | 'restricted'

/** 本机门禁状态：是否已设置访问密码、当前运行会话是否已解锁 */
export interface CsLabAuthStatus {
  isInitialized: boolean
  isVerified: boolean
}

/** 门禁操作结果（初始化 / 验密 / 锁定） */
export interface CsLabAuthResult {
  success: boolean
  message?: string
}

export interface CsLabTelemetry {
  status: CsLabOperationalStatus
  labName: string
  labCode: string
  quantumCoherence: number
  frequencyGhz: number
  uptimeSeconds: number
  activeNodesCount: number
  sysLoadPercent: number
  lastHeartbeat: number
  controllerMessage: string
}

export interface CsLabNode {
  id: string
  name: string
  role: string
  status: 'online' | 'synced' | 'standby'
  latencyMs: number
  loadPercent: number
  ip: string
}

export interface CsLabLogEntry {
  id: string
  timestamp: number
  level: 'INFO' | 'SYS' | 'WARN' | 'SEC'
  module: string
  message: string
}

// ===== 六维科研资产 =====

/** 全局 URI 的 layer_type 维度。 */
export type CsLabLayerType =
  | 'lit'
  | 'fact'
  | 'note'
  | 'node'
  | 'proto'
  | 'run'
  | 'raw'
  | 'table'
  | 'fig'
  | 'mol'
  | 'doc'
  | 'capsule'
  /** 地理灾害栅格（DEM/GeoTIFF 与推演输出网格）。 */
  | 'geo'

/** 官方演示实验室类型；普通实验室缺省。 */
export type CsLabDemoKind = 'flagship'

export type CsLabLabStatus = '运行中' | '调试中' | '筹建中' | '已归档'

// ===== 文件类型驱动能力模型 =====

/** 舞台窗格视图类型：由资产能力解析器决定，而不是由文件扩展名直接写死。 */
export type CsLabPaneViewType =
  | 'empty'
  | 'table'
  | 'manuscript'
  | 'pdf'
  | 'dag'
  | 'mol'
  | 'figure'
  | 'origin-plot'
  | 'terrain'

export type CsLabCapabilityKind =
  | 'dataset'
  | 'figure'
  | 'molecule'
  | 'literature'
  | 'manuscript'
  | 'canvas'
  | 'terrain'
  | 'generic'

export type CsLabFileAction =
  | 'open-dataset'
  | 'open-figure'
  | 'open-structure'
  | 'open-literature'
  | 'open-manuscript'
  | 'open-canvas'
  | 'link-crystal'
  | 'run-tool'
  | 'export-table'
  | 'link-run'
  | 'digitize-plot'
  | 'verify-formula'
  | 'ai-review'
  | 'capsule-lineage'
  | 'open-origin-plot'
  | 'open-terrain'
  | 'analyze-crystal'
  | 'simulate-pxrd'

export interface CsLabFileCapability {
  kind: CsLabCapabilityKind
  defaultView: CsLabPaneViewType
  actions: CsLabFileAction[]
}

export type CsLabTableExportFormat = 'parquet' | 'csv'

export interface CsLabTableExportResult {
  success: boolean
  path: string
  format: CsLabTableExportFormat
  message?: string
}

export interface CsLabAssetFileInfo {
  path: string
  name: string
}

export interface CsLabAssetDataUrl {
  dataUrl: string
  mime: string
  bytes: number
  /** 仅 PNG/JPEG/GIF 可从文件头无损嗅探；未知格式省略。 */
  width?: number
  height?: number
}

export interface CsLabLab {
  id: string
  code: string
  name: string
  description: string
  tags: string[]
  members: number
  status: CsLabLabStatus
  rootPath: string
  createdAt: number
  updatedAt: number
  /** 是否置顶（列表排序优先于 updatedAt）。 */
  pinned?: boolean
  /** 置顶时间戳；取消置顶时清除。 */
  pinnedAt?: number
  /** 是否已归档；归档实验室默认不进入「进行中」过滤。 */
  archived?: boolean
  /** 归档时间戳；解除归档时清除。 */
  archivedAt?: number
  /** 归档前的业务状态；解除归档时恢复，避免把「调试中/筹建中」误还原为「运行中」。 */
  statusBeforeArchive?: CsLabLabStatus
  /** 官方演示实验室类型；普通实验室缺省。 */
  demoKind?: CsLabDemoKind
}

export interface CsLabCreateLabInput {
  name: string
  description?: string
  tags?: string[]
  /** 自定义实验室根目录；缺省落在 ~/.cdutai/cslab-workspaces/{labId}。 */
  rootPath?: string
  /** 内部创建演示实验室时使用；普通新建不传。 */
  demoKind?: CsLabDemoKind
}

/** 演示实验室关键科学指标（由演示图版构建时一次性计算）。 */
export interface CsLabDemoStats {
  /** 硅理论 PXRD 前 6 峰与 NIST SRM 640 标样的最大 2θ 偏差（度）。 */
  nistMaxDeviationDeg: number
  /** 拉曼分峰拟合的决定系数。 */
  ramanRSquared: number
  /** 拉曼分峰解析面积与离散梯形积分的相对误差。 */
  ramanAreaRelativeError: number
  /** 泥石流演示峰值流量（m³/s）。 */
  peakDischargeM3s?: number
  /** 泥石流演示最大冲出距离（m）。 */
  runoutDistanceM?: number
  /** 泥石流演示最大流动水深（m）。 */
  maxFlowDepthM?: number
}

/** 演示实验室创建结果（含预生成出版图）。 */
export interface CsLabDemoLabResult {
  lab: CsLabLab
  assets: CsLabAssetSummary[]
  plotId?: string
  /** 全部预生成出版图 ID（顺序固定）。 */
  plotIds?: string[]
  stats?: CsLabDemoStats
  /** 演示实验室类型；当前唯一值为 flagship。 */
  kind?: CsLabDemoKind
  /** 泥石流演示推演指标。 */
  geohazardStats?: CsLabDemoStats
}

export interface CsLabAssetSummary {
  uri: string
  labId: string
  layerType: CsLabLayerType
  entityUuid: string
  title: string
  format?: string
  relPath?: string
  sha256?: string
  bytes?: number
  /** 实体级结构化元数据（JSON 字符串），供演示标定与默认视口使用。 */
  metaJson?: string
  revision: number
  /** 原始文件是否已上只读锁（Windows 下为 attrib +r 结果）。 */
  locked: boolean
  createdAt: number
  updatedAt: number
  /** 非空表示该资产暂不支持解析，内容为面向用户的降级说明。 */
  unsupported?: string
}

export interface CsLabLabSnapshot {
  lab: CsLabLab
  counts: Record<CsLabLayerType, number>
  recentAssets: CsLabAssetSummary[]
  python: CsLabPythonCapability
}

// ===== 数据铁笼表格 =====

export interface CsLabColumn {
  key: string
  label: string
  unit?: string
}

export type CsLabCellValue = string | number | null

export interface CsLabTablePayload {
  uri: string
  columns: CsLabColumn[]
  rows: CsLabCellValue[][]
  totalRows: number
  totalCols: number
  previewLimit: number
  generatedAt: number
  sha256: string
  locked: boolean
  format?: string
  /** 数据表当前 revision（胶囊绑定时写入 revisionAtBind）。 */
  revision: number
}

export interface CsLabCellRef {
  labId: string
  tableUri: string
  column: string
  rowIndex: number
  value: CsLabCellValue
  unit?: string
  label: string
  /** 拖拽发生时的数据表 revision，用于胶囊绑定。 */
  tableRevision: number
}

export interface CsLabIngestRequest {
  labId: string
  paths: string[]
}

export interface CsLabIngestResult {
  asset: CsLabAssetSummary
  tableUri?: string
  status: 'ok' | 'unsupported' | 'error'
  message?: string
}

export interface CsLabIngestProgress {
  labId: string
  fileName: string
  stage: 'copy' | 'hash' | 'parse' | 'write' | 'done' | 'error'
  index: number
  total: number
  message?: string
}

// ===== 活体胶囊 =====

export type CsLabCapsuleStatus = 'fresh' | 'stale' | 'orphan'

export interface CsLabCapsule {
  id: string
  labId: string
  label: string
  value: string
  unit?: string
  tableUri: string
  column: string
  rowIndex: number
  revisionAtBind: number
  status: CsLabCapsuleStatus
  updatedAt: number
}

export interface CsLabCapsuleLineageNode {
  uri: string
  title: string
  layerType: CsLabLayerType
  relation?: string
  updatedAt: number
}

export interface CsLabCapsuleLineage {
  capsuleId: string
  chain: CsLabCapsuleLineageNode[]
  currentValue: string
  previousValue: string
}

// ===== 论文文稿 =====

export interface CsLabManuscriptSummary {
  uri: string
  title: string
  updatedAt: number
  hasDocx: boolean
}

/**
 * Canvas 编辑器主状态（Sidecar v2）。
 * header/main/footer 使用 unknown[]，避免把 @hufe921/canvas-editor 的类型泄漏进 shared。
 */
export interface CsLabCanvasData {
  header?: unknown[]
  main: unknown[]
  footer?: unknown[]
}

/** Canvas 原生批注；id 即 canvas groupId，锚点保存在元素 groupIds 上。 */
export interface CsLabManuscriptComment {
  id: string
  content: string
  createdAt: string
  user?: string
}

export interface CsLabManuscript {
  uri: string
  title: string
  docJson: unknown
  /** Sidecar v2：Canvas IElement[] 主状态；旧稿缺失时由渲染层即时升级。 */
  canvasData?: CsLabCanvasData
  comments?: CsLabManuscriptComment[]
  capsules: CsLabCapsule[]
  updatedAt: number
  docxPath?: string
}

export interface CsLabSaveFileDialogOptions {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
}

export interface CsLabSaveFileDialogResult {
  filePath: string
  /** 一次性保存凭据，必须在 SAVE_MANUSCRIPT_AS 中回传 */
  saveToken: string
}

export interface CsLabSaveManuscriptAsInput {
  labId: string
  uri: string
  targetPath: string
  format?: 'docx' | 'md'
  title: string
  docJson: unknown
  canvasData?: CsLabCanvasData
  comments?: CsLabManuscriptComment[]
  capsules: CsLabCapsule[]
}

/** IPC 层入参：在服务层入参之上附加保存凭据。 */
export interface CsLabSaveManuscriptAsIpcInput extends CsLabSaveManuscriptAsInput {
  saveToken: string
}

export interface CsLabSaveManuscriptAsResult {
  success: boolean
  targetPath: string
  format: 'docx' | 'md'
  message?: string
}

export interface CsLabSaveManuscriptInput {
  labId: string
  uri: string
  title: string
  docJson: unknown
  canvasData?: CsLabCanvasData
  comments?: CsLabManuscriptComment[]
  capsules: CsLabCapsule[]
}

export interface CsLabDocxSyncInput {
  labId: string
  manuscriptUri: string
  /** 未提供时读取文稿已关联的 docx；都没有则要求导出。 */
  docxPath?: string
}

export type CsLabDocxOperationMode = 'export' | 'sync'

export interface CsLabDocxSyncResult {
  success: boolean
  mode: CsLabDocxOperationMode
  /** 本次实际写入的文件（导出文件或长期同步副本）。 */
  docxPath: string
  /** 长期同步目标（导入原件或首次导出后的链接副本）。 */
  linkedDocxPath?: string
  /** 仅 sync 有意义；export 固定 false（导出必然重写 document.xml）。 */
  documentXmlUnchanged: boolean
  /** 值发生实际变化的胶囊。 */
  updatedCapsuleIds: string[]
  /** 新增到 customXml 的胶囊。 */
  addedCapsuleIds: string[]
  /** 从 customXml 移除的胶囊。 */
  removedCapsuleIds: string[]
  /** 在 customXml 中存在、但 document.xml 无对应 w:dataBinding 的胶囊。 */
  missingDataBindingIds: string[]
  message?: string
}

export interface CsLabDocxImportResult {
  manuscript: CsLabManuscript
  importedCapsules: CsLabCapsule[]
  message?: string
}

// ===== 事件 =====

export interface CsLabAssetChangedEvent {
  labId: string
  uri: string
  kind: 'created' | 'updated'
  revision: number
}

export interface CsLabCapsuleStaleEvent {
  labId: string
  capsuleIds: string[]
}

// ===== 可选 Python 增强能力 =====

export interface CsLabPythonCapability {
  available: boolean
  pythonPath?: string
  uvPath?: string
  note: string
}

// ===== 可选 Python 工具运行时（Phase 2） =====

export type CsLabToolProfile = 'plot' | 'formula' | 'formula-ocr' | 'instrument' | 'docling'

export interface CsLabToolProfileStatus {
  installed: boolean
  missing: string[]
  /** 实际提供该 profile 能力的解释器。 */
  pythonPath?: string
  source?: 'venv' | 'system'
}

export interface CsLabToolRuntimeStatus {
  pythonPath?: string
  venvPath?: string
  uvPath?: string
  /** PATH 中是否检测到 uv（自动下载的 uv 缓存不在此字段反映）。 */
  uvReady?: boolean
  profiles: Record<CsLabToolProfile, CsLabToolProfileStatus>
  note: string
}

export interface CsLabInstallToolDepsInput {
  labId: string
  profile: CsLabToolProfile
}

export interface CsLabToolDepsProgress {
  labId: string
  profile: CsLabToolProfile
  stage: 'resolve' | 'venv' | 'install' | 'verify' | 'done' | 'error'
  message: string
}

// ===== Zotero 文献同步 =====

export type CsLabZoteroAvailability =
  | 'ready'
  | 'not-found'
  | 'no-permission'
  | 'schema-unsupported'

export interface CsLabZoteroBridgeStatus {
  enabled: boolean
  reachable: boolean
  endpoint?: string
  message: string
  /** 实际命中的探测路径（`/connector/ping` 或 `/ping`），用于一键连通诊断展示。 */
  probePath?: string
}

/** 写回操作类型：全部经 Zotero 本地 REST 插件 HTTP 通道，绝无直写 sqlite 路径。 */
export type CsLabZoteroBridgeWriteOp = 'createAnnotation' | 'updateItemTags' | 'addItemCollection'

export interface CsLabZoteroBridgeWriteInput {
  op: CsLabZoteroBridgeWriteOp
  payload: Record<string, unknown>
}

export interface CsLabZoteroBridgeWriteResult {
  ok: boolean
  status?: number
  message: string
}


export interface CsLabZoteroStatus {
  availability: CsLabZoteroAvailability
  dataDir?: string
  libraryId?: string
  itemCount: number
  annotationCount: number
  lastSyncedAt?: number
  lastVersion?: number
  watching: boolean
  bridge: CsLabZoteroBridgeStatus
  message: string
}

export interface CsLabZoteroDiscovery {
  status: CsLabZoteroStatus
  preferences: {
    profilePath?: string
    dataDir?: string
    linkedBasePath?: string
  }
}

export interface CsLabZoteroSyncOptions {
  /** 用户手动指定数据目录；缺省使用自动发现或 lab_state 记忆值。 */
  dataDir?: string
  /** 强制全量重建游标。 */
  forceFull?: boolean
}

export interface CsLabZoteroSyncResult {
  ok: boolean
  added: number
  updated: number
  removed: number
  annotationCount: number
  collectionCount: number
  lastVersion: number
  message: string
}

export type CsLabLiteratureSource = 'vault' | 'zotero'

export interface CsLabLiteratureItem {
  uri: string
  labId: string
  title: string
  authors: string[]
  year?: string
  doi?: string
  publication?: string
  abstract?: string
  collections: string[]
  format: 'pdf'
  source: CsLabLiteratureSource
  zoteroItemKey?: string
  pageCount?: number
  annotationCount: number
  hasFile: boolean
  updatedAt: number
  /** 已解析的章节数（结构 sidecar 存在时有值）。 */
  sectionCount?: number
  /** 解析出的关键词。 */
  keywords?: string[]
  /** 1-2 句核心贡献速读（学术检索入库时外显写入）。 */
  tldr?: string
  /** 是否已有结构化解析 sidecar。 */
  hasStructure?: boolean
  /** 解析失败时的可读提示。 */
  parseWarning?: string
  /** 层级学科分类（如 ['Earth Sciences', 'Geophysics', 'Seismic Imaging']）。 */
  taxonomy?: string[]
  /** 正式引用列表。 */
  references?: PaperReference[]
  /** 实验协议（实证解析产物）。 */
  protocols?: ExperimentalProtocol[]
  /** 数值评估指标（实证解析产物）。 */
  metrics?: EmpiricalMetric[]
  /** 抽取的图表资产。 */
  figureAssets?: PaperFigureAsset[]
  /** 语义概念/方法图谱。 */
  conceptGraph?: PaperConceptGraph
  /** 语义增强来源：LLM 结构化输出或确定性 AST 回退。 */
  enrichmentSource?: 'llm' | 'deterministic'
}

// ===== 论文入库流水线：实证抽取与语义增强产物 =====

export interface EmpiricalMetric {
  name: string
  value: number | string
  unit?: string
  baseline?: string | number
  condition?: string
  page: number
}

export interface ExperimentalProtocol {
  id: string
  name: string
  category: 'synthesis' | 'characterization' | 'computation' | 'measurement' | 'general'
  steps: string[]
  parameters: Record<string, string | number>
  instruments?: string[]
}

export interface PaperFigureAsset {
  id: string
  caption: string
  pageNumber: number
  /** 已导出位图相对 vault/notes 的路径；vector-unsampled 时缺省。 */
  relPath?: string
  bbox?: [number, number, number, number]
  /** image-xobject：PDF 内嵌位图直提；vector-unsampled：纯矢量图表未采样（不生成占位图）。 */
  renderSource: 'image-xobject' | 'vector-unsampled'
}

export interface PaperReference {
  title: string
  authors?: string[]
  year?: string
  doi?: string
  venue?: string
}

export interface PaperConcept {
  id: string
  name: string
  definition?: string
  relatedConceptIds?: string[]
}

export interface PaperMethod {
  id: string
  name: string
  role: 'proposed' | 'baseline' | 'general'
  description?: string
  dependsOn?: string[]
}

export interface PaperConceptGraph {
  concepts: PaperConcept[]
  methods: PaperMethod[]
}

// ===== 分层 3D 空间拓扑 =====

export interface Hierarchical3DGraphNode {
  id: string
  label: string
  layer: 'macro' | 'meso' | 'micro'
  type: 'paper' | 'author' | 'venue' | 'concept' | 'method' | 'protocol' | 'metric' | 'table' | 'figure'
  /** 2 for macro, 1 for meso, 0 for micro */
  zLevel: number
  x?: number
  y?: number
  z?: number
  details?: Record<string, unknown>
}

export interface Hierarchical3DGraphEdge {
  source: string
  target: string
  relation: string
  weight?: number
}

export interface Hierarchical3DGraphData {
  nodes: Hierarchical3DGraphNode[]
  edges: Hierarchical3DGraphEdge[]
  paperUri: string
  builtAt: number
}

export interface CsLabZoteroAnnotation {
  key: string
  itemUri: string
  type: string
  pageIndex: number
  rects: Array<[number, number, number, number]>
  inkPaths?: string[]
  color?: string
  text?: string
  comment?: string
  author?: string
  sortIndex?: string
  modifiedAt?: number
  /** 已解析的原始位置信息（含页面旋转），渲染层据此做四向仿射。 */
  position?: {
    pageIndex: number
    rects: Array<[number, number, number, number]>
    rotation: 0 | 90 | 180 | 270
    inkPaths?: string[]
  }
}

// ===== 图表逆向数字化 =====

export interface CsLabAxisTick {
  px: number
  py: number
  value: number
  /** true 表示用户尚未录入刻度值；参与数字化前必须清除。 */
  pending?: boolean
  /** true 表示刻度值由 read-tick 模板匹配自动识别回填，导出时附带以便事后复核。 */
  autoRead?: boolean
}

export interface CsLabAxisCalibration {
  ticks: CsLabAxisTick[]
  scale: 'auto' | 'linear' | 'log'
}

export interface CsLabPlotCalibration {
  x: CsLabAxisCalibration
  y: CsLabAxisCalibration
}

export type CsLabPlotMode = 'line' | 'scatter'

export interface CsLabPlotDigitizeInput {
  labId: string
  imageDataUrl: string
  mode: CsLabPlotMode
  calibration: CsLabPlotCalibration
  /** 目标曲线颜色（#rrggbb）；缺省由后端按色相峰值自动选择。 */
  color?: string
  /** 多曲线分色提取：多个 #rrggbb，逐色构建掩码；优先于 color。 */
  colors?: string[]
  /** 自动聚类的目标簇数（2-4）；0/缺省 = 按色相主峰自动估计。 */
  seriesCount?: number
  tolerance?: number
}

export interface CsLabDigitizedSeries {
  label: string
  /** 物理数值坐标 [x, y]。 */
  points: Array<[number, number]>
  /** 图像像素坐标 [px, py]，用于前端磁性吸附。 */
  pixels: Array<[number, number]>
}

export interface CsLabAxisFit {
  scale: 'linear' | 'log'
  r2: number
}

export interface CsLabPlotDigitizeResult {
  ok: boolean
  message?: string
  width: number
  height: number
  rotationDeg?: number
  axisFit?: { x: CsLabAxisFit; y: CsLabAxisFit }
  series: CsLabDigitizedSeries[]
}

/** 刻度数值自动读取输入（rect 为原图像素坐标下的刻度点外侧标注区域）。 */
export interface CsLabTickReadInput {
  labId: string
  imageDataUrl: string
  rect: { x: number; y: number; w: number; h: number }
}

/**
 * 刻度数值自动读取结果。
 * value=null 表示模板匹配置信度低于阈值（R4 低置信度防御），由用户手填，绝不猜。
 */
export interface CsLabTickReadResult {
  ok: boolean
  value: number | null
  confidence: number
  missingDependency?: boolean
  message?: string
}

export interface CsLabDigitizedFigureInput {
  labId: string
  title: string
  sourceUri: string
  imageDataUrl: string
  calibration: CsLabPlotCalibration
  series: Array<{ label: string; points: Array<[number, number]> }>
}

export interface CsLabDigitizedFigureResult {
  figUri: string
  tableUri: string
  rowCount: number
  message: string
}

// ===== 公式识别与 SymPy 验算 =====

export interface CsLabFormulaVerifyInput {
  labId: string
  latexLhs: string
  latexRhs: string
  /** 变量名 -> sympy.physics.units 物理量名（如 { F: 'force', m: 'mass' }）。 */
  symbolDimensions?: Record<string, string>
}

export interface CsLabFormulaDimensionResult {
  lhs?: unknown
  rhs?: unknown
  homogeneous?: boolean
  note: string
}

export interface CsLabFormulaVerifyResult {
  ok: boolean
  engine: string
  message?: string
  equivalent?: boolean
  residual?: string
  dimensions?: CsLabFormulaDimensionResult
  singularities?: string[]
  limitNotes?: string[]
  preprocess?: { appliedFixes: string[] }
  elapsedMs?: number
}

export interface CsLabFormulaOcrResult {
  ok: boolean
  latex?: string
  engine: string
  message?: string
}

/** 选区纯文本 OCR（翻译前置），missingDependency 区分「依赖未装」与「识别失败」。 */
export interface CsLabSelectionOcrResult {
  ok: boolean
  text?: string
  missingDependency?: boolean
  message?: string
}

/** 翻译识别通道：矢量直读 / 视觉识别 / Pix2Text OCR。 */
export type CsLabTranslateSource = 'vector' | 'vision' | 'ocr'

export interface CsLabTranslateSelectionInput {
  labId: string
  /** 当前配置的 LLM 渠道 / 模型（渲染层传入，主进程不猜测）。 */
  channelId: string
  modelId: string
  /** @deprecated 仍兼容；矢量文字优先走 vectorText */
  imageDataUrl?: string
  /** PDF 矢量文字直读结果，命中时零 OCR 成本直接进 LLM */
  vectorText?: string
  /** 识别通道，用于面板徽标与审计 */
  source?: CsLabTranslateSource
}

export interface CsLabTranslateSelectionResult {
  ok: boolean
  /** 简体中文译文。 */
  text?: string
  /** OCR/矢量原文（供用户核对）。 */
  ocrText?: string
  /** 实际命中的识别通道（入口声明与实际分流可能不同，以此为准）。 */
  source?: CsLabTranslateSource
  /** true 表示 Pix2Text 未安装，面板可展示可选安装引导。 */
  missingDependency?: boolean
  message?: string
}

// ===== 跨文献 GraphRAG =====

export interface CsLabLiteratureSearchInput {
  labId: string
  query: string
  topK?: number
  literatureUri?: string
}

export interface CsLabLiteratureSearchHit {
  chunkId: string
  literatureUri: string
  title: string
  page: number
  excerpt: string
  score: number
  communityId: string
  communityTitle: string
  /** 命中切块在 PDF 页内的归一化坐标 [x0, y0, x1, y1]；旧索引缺省时仅跳页不高亮。 */
  bbox?: [number, number, number, number]
}

export interface CsLabLiteratureIndexStatus {
  builtAt?: number
  chunkCount: number
  communityCount: number
  literatureCount: number
  fingerprint: string
}

export interface CsLabLiteratureSearchResult {
  ok: boolean
  builtAt?: number
  hits: CsLabLiteratureSearchHit[]
  message?: string
}

// ===== 文献智能导读 =====

export interface CsLabLiteratureSectionRef {
  title: string
  level: number
  page: number
  /** 章节正文摘录（用于局限/结论卡片）。 */
  excerpt?: string
}

export interface CsLabLiteratureEquationRef {
  latex: string
  tag?: string
  page: number
}

export interface CsLabLiteratureTableRef {
  page: number
  caption?: string
  markdownPreview: string
}

export interface CsLabLiteratureGuide {
  ok: boolean
  uri: string
  title: string
  authors: string[]
  year?: string
  doi?: string
  publication?: string
  pageCount: number
  abstract?: string
  keywords: string[]
  outline: CsLabLiteratureSectionRef[]
  equations: CsLabLiteratureEquationRef[]
  tables: CsLabLiteratureTableRef[]
  limitations: CsLabLiteratureSectionRef[]
  conclusion?: CsLabLiteratureSectionRef
  readingPath: string[]
  parsedAt?: number
  message?: string
}

export interface CsLabLiteratureGuideInput {
  labId: string
  literatureUri: string
}

/** 全景知识图谱节点（文献级聚合）。 */
export interface CsLabLiteratureGraphNode {
  uri: string
  title: string
  communityId: string
  communityTitle: string
  chunkCount: number
}

/** 全景知识图谱边（文献对共现强度，已按文献对聚合）。 */
export interface CsLabLiteratureGraphEdge {
  source: string
  target: string
  weight: number
}

/** 未搜索时的文献智脑全景图谱载荷。 */
export interface CsLabLiteratureGraphResult {
  ok: boolean
  nodes: CsLabLiteratureGraphNode[]
  edges: CsLabLiteratureGraphEdge[]
  communityCount: number
  builtAt?: number
  message?: string
}

// ===== 主进程事件载荷 =====

export interface CsLabZoteroSyncedEvent {
  labId: string
  result: CsLabZoteroSyncResult
}

export interface CsLabZoteroStatusEvent {
  labId: string
  status: CsLabZoteroStatus
}

// ===== Phase 3：实验规程与批次 =====

export interface CsLabProtocolStep {
  id: string
  title: string
  detail?: string
  durationMin?: number
}

export interface CsLabProtocolParamDef {
  key: string
  label: string
  unit?: string
  defaultValue?: string
}

export interface CsLabProtocol {
  uri: string
  labId: string
  title: string
  method: string
  version: number
  steps: CsLabProtocolStep[]
  parameters: CsLabProtocolParamDef[]
  createdAt: number
  updatedAt: number
}

export type CsLabRunStatus = 'planned' | 'running' | 'succeeded' | 'failed' | 'aborted'

export interface CsLabRunParam {
  key: string
  label: string
  value: string
  unit?: string
}

export type CsLabRunLinkRelation = 'consumes' | 'produces'

export interface CsLabRunLink {
  uri: string
  title: string
  relation: CsLabRunLinkRelation
}

export interface CsLabRun {
  uri: string
  labId: string
  protocolUri?: string
  protocolTitle?: string
  protocolVersion?: number
  title: string
  batchNo: string
  status: CsLabRunStatus
  startedAt?: number
  endedAt?: number
  operator?: string
  parameters: CsLabRunParam[]
  observations: string
  outcome?: string
  linkedAssets: CsLabRunLink[]
  createdAt: number
  updatedAt: number
}

export interface CsLabCreateProtocolInput {
  labId: string
  title: string
  method?: string
  steps?: CsLabProtocolStep[]
  parameters?: CsLabProtocolParamDef[]
}

export interface CsLabUpdateProtocolInput extends CsLabCreateProtocolInput {
  uri: string
}

export interface CsLabCreateRunInput {
  labId: string
  protocolUri?: string
  title: string
  operator?: string
  parameters?: CsLabRunParam[]
}

export interface CsLabUpdateRunInput {
  labId: string
  uri: string
  status?: CsLabRunStatus
  title?: string
  operator?: string
  parameters?: CsLabRunParam[]
  observations?: string
  outcome?: string
}

export interface CsLabRunLinkInput {
  labId: string
  runUri: string
  assetUri: string
  relation: CsLabRunLinkRelation
}

// ===== Phase 3：JSON Canvas 与 DAG =====

export type CsLabCanvasNodeType = 'text' | 'file' | 'link' | 'group'
export type CsLabCanvasSide = 'top' | 'right' | 'bottom' | 'left'
export type CsLabDagValidationState = 'pending' | 'verified' | 'dead_end' | 'pruned'
export type CsLabDagOperator = 'AND' | 'OR'
export type CsLabDagNodeKind = 'premise' | 'hypothesis' | 'inference' | 'experiment' | 'note'

export interface CsLabCanvasMeta {
  cdut_uri?: string
  node_kind?: CsLabDagNodeKind
  verification_status?: CsLabDagValidationState
  /** 人工事实快照；`verification_status` 可能被派生为 pruned，此字段永不写入 pruned。 */
  manual_status?: CsLabDagValidationState
  confidence_score?: number
  logical_operator?: CsLabDagOperator
  gpu_task_id?: string | null
  job_cancel_requested?: boolean
  [key: string]: unknown
}

export interface CsLabCanvasEdgeMeta {
  dependency_type?: 'strict_conjunctive' | 'disjunctive'
  [key: string]: unknown
}

export interface CsLabCanvasNode {
  id: string
  type: CsLabCanvasNodeType
  x: number
  y: number
  width: number
  height: number
  text?: string
  file?: string
  subpath?: string
  url?: string
  color?: string
  cdut_science?: CsLabCanvasMeta
  [key: string]: unknown
}

export interface CsLabCanvasEdge {
  id: string
  fromNode: string
  toNode: string
  fromSide?: CsLabCanvasSide
  toSide?: CsLabCanvasSide
  color?: string
  label?: string
  cdut_science?: CsLabCanvasEdgeMeta
  [key: string]: unknown
}

export interface CsLabCanvasDocument {
  nodes: CsLabCanvasNode[]
  edges: CsLabCanvasEdge[]
  [key: string]: unknown
}

export interface CsLabCanvasSummary {
  relPath: string
  title: string
  nodeCount: number
  edgeCount: number
  updatedAt: number
}

export interface CsLabCanvasReadResult {
  relPath: string
  document: CsLabCanvasDocument
  mtimeMs: number
}

export interface CsLabCanvasCreateResult {
  relPath: string
  document: CsLabCanvasDocument
  mtimeMs: number
}

export interface CsLabCanvasWriteInput {
  labId: string
  relPath: string
  document: CsLabCanvasDocument
  expectedMtimeMs?: number
}

export interface CsLabCanvasWriteResult {
  relPath: string
  document: CsLabCanvasDocument
  mtimeMs: number
  /** atomic=正常重命名；in-place=Windows 占用时降级原地写；conflict-only=仅写出冲突副本。 */
  durability: 'atomic' | 'in-place' | 'conflict-only'
  conflictRelPath?: string
  cancelledJobIds: string[]
}

export interface CsLabDagNodeInput {
  id: string
  state: CsLabDagValidationState
  operator: CsLabDagOperator
  gpuTaskId?: string | null
}

export interface CsLabDagEdgeInput {
  id: string
  fromNode: string
  toNode: string
}

export interface CsLabDagEvaluation {
  order: string[]
  cycles: string[][]
  states: Record<string, CsLabDagValidationState>
  prunedIds: string[]
  cancelledJobIds: string[]
}

// ===== Phase 3：Vault 笔记索引 =====

export type CsLabVaultNoteKind = 'md' | 'canvas'

export interface CsLabVaultNoteSummary {
  relPath: string
  kind: CsLabVaultNoteKind
  title: string
  tags: string[]
  linkCount: number
  backlinkCount: number
  excerpt: string
  updatedAt: number
}

export interface CsLabVaultIndexStatus {
  noteCount: number
  canvasCount: number
  linkCount: number
  builtAt?: number
  fingerprint?: string
  cachedRows: number
}

export interface CsLabVaultIndexResult {
  status: CsLabVaultIndexStatus
  parsed: number
  reused: number
  removed: number
  elapsedMs: number
}

export interface CsLabVaultReadResult {
  summary: CsLabVaultNoteSummary
  content: string
  outlinks: string[]
}

export interface CsLabVaultSearchInput {
  labId: string
  query: string
  limit?: number
}

export interface CsLabVaultChangedEvent {
  labId: string
  relPaths: string[]
  kind: 'created' | 'updated' | 'removed'
}

export interface CsLabDagJobsCancelledEvent {
  labId: string
  canvasRelPath: string
  jobIds: string[]
}

// ===== Phase 3：自定义 Python 工具 =====

export type CsLabCustomToolJsonType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'object'
  | 'any'

export interface CsLabCustomToolParam {
  name: string
  jsonType: CsLabCustomToolJsonType
  required: boolean
  description?: string
  defaultValue?: string
  annotation?: string
}

export interface CsLabCustomTool {
  name: string
  moduleRelPath: string
  description: string
  params: CsLabCustomToolParam[]
  returns?: string
  unsupportedReason?: string
  source: 'ast' | 'heuristic'
}

export interface CsLabCustomToolScan {
  labId: string
  tools: CsLabCustomTool[]
  scannedAt: number
  engine: 'ast' | 'heuristic' | 'none'
  message: string
}

export interface CsLabCustomToolRunInput {
  labId: string
  name: string
  args: Record<string, unknown>
}

export interface CsLabCustomToolRunResult {
  ok: boolean
  result?: unknown
  error?: string
  elapsedMs: number
}

// ===== 预置科研算子（泥石流等方向） =====

export interface CsLabToolPreset {
  /** 文件名（如 debris_flow_peak_discharge.py），安装时的唯一合法标识。 */
  filename: string
  title: string
  description: string
  /** 依赖提示（如「仅标准库」/「numpy」）。 */
  dependency: string
  installed: boolean
}

export interface CsLabToolPresetInstallInput {
  labId: string
  filenames?: string[]
}

export interface CsLabToolPresetInstallResult {
  ok: boolean
  installed: string[]
  skipped: string[]
  message: string
}

export interface CsLabToolPresetReadInput {
  filename: string
}

export interface CsLabToolPresetReadResult {
  ok: boolean
  filename?: string
  source?: string
  message?: string
}


export interface CsLabUvEnsureResult {
  ok: boolean
  uvPath?: string
  source?: 'path' | 'downloaded'
  message: string
}

// ===== Phase 3：会话级实验室绑定 =====

export interface CsLabSessionLabBinding {
  sessionId: string
  labId: string | null
  message: string
}

// ===== Phase 5：科学助理独立窗口 =====

/** 绘图 ROI 选区（数据坐标）。 */
export interface CsLabAgentPlotRoi {
  xMin: number
  xMax: number
  yMin?: number
  yMax?: number
}

/** 主窗口 -> 助理窗口的上下文载荷。 */
export interface CsLabAgentContext {
  labId: string
  source: 'plot-roi' | 'asset' | 'manual'
  /** 预填到输入框的提示词（不自动发送）。 */
  prompt: string
  assetUri?: string
  plotId?: string
  plotTitle?: string
  roi?: CsLabAgentPlotRoi
  createdAt: number
}

/** 打开助理窗口的入参。 */
export interface CsLabAgentWindowInput {
  labId: string
  focusSessionId?: string
  context?: CsLabAgentContext
}

/** 打开助理窗口的结果。 */
export interface CsLabAgentWindowRef {
  windowId: string
  labId: string
}

/** 绘图撤销结果。 */
export interface CsLabPlotUndoResult {
  labId: string
  plotId: string
  plot: CsLabPlotDocument
}

// ===== Phase 4：局域网仪器共享盘 =====

export type CsLabShareKind = 'unc' | 'local' | 'webdav'
export type CsLabShareSourceStatus = 'online' | 'offline' | 'error'
/** 捕获一致性的真实证据等级；UI 必须如实展示，不得把降级说成独占租约。 */
export type CsLabShareLeaseType =
  | 'protected-lease'
  | 'inline-command-lease'
  | 'node-stream-stability'
  | 'pending'
export type CsLabShareCandidateState =
  | 'observed'
  | 'debouncing'
  | 'capturing'
  | 'published'
  | 'retry'
  | 'quarantined'
export type CsLabShareEvidence = 'protected-lease' | 'quiet-interval' | 'eof'

export interface CsLabShareSourceInput {
  labId: string
  label: string
  /** UNC（`\\server\share`）、`smb://`、`webdav(s)://` 或本地目录。 */
  rootPath: string
  /** 只扫描这些子目录（相对 rootPath）；缺省为全部。 */
  include?: string[]
  quietSeconds?: number
  pollSeconds?: number
  username?: string
  password?: string
}

export interface CsLabShareSourceSummary {
  id: string
  labId: string
  label: string
  kind: CsLabShareKind
  rootPath: string
  include: string[]
  quietSeconds: number
  pollSeconds: number
  status: CsLabShareSourceStatus
  watching: boolean
  watermarkMs?: number
  lastScanAt?: number
  candidateCount: number
  message?: string
}

export interface CsLabShareCandidate {
  id: string
  sourceId: string
  relPath: string
  size: number
  mtimeMs: number
  fingerprint: string
  state: CsLabShareCandidateState
  leaseType: CsLabShareLeaseType
  evidence?: CsLabShareEvidence
  attempts: number
  nextAttemptAt?: number
  sha256?: string
  assetUri?: string
  message?: string
  updatedAt: number
}

export interface CsLabShareScanResult {
  ok: boolean
  scanned: number
  discovered: number
  captured: number
  skipped: number
  failed: number
  message: string
}

export interface CsLabShareStatusEvent {
  labId: string
  sourceId: string
  status: CsLabShareSourceStatus
  message?: string
}

// ===== Phase 4：远程学术算力网关 =====

export type CsLabHpcScheduler = 'slurm' | 'pbs' | 'lsf'
export type CsLabHpcJobState =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'TIMEOUT'
  | 'CANCELLED'
  | 'UNKNOWN'

export interface CsLabHpcBastionInput {
  host: string
  port?: number
  username: string
  privateKeyPath?: string
  passphrase?: string
}

export interface CsLabHpcProfileInput {
  labId: string
  id?: string
  name: string
  host: string
  port?: number
  username: string
  scheduler: CsLabHpcScheduler
  remoteWorkDir: string
  privateKeyPath?: string
  passphrase?: string
  bastion?: CsLabHpcBastionInput
}

export interface CsLabHpcProfileSummary {
  id: string
  labId: string
  name: string
  host: string
  port: number
  username: string
  scheduler: CsLabHpcScheduler
  remoteWorkDir: string
  hasPrivateKey: boolean
  hasPassphrase: boolean
  hasBastion: boolean
  updatedAt: number
}

/** 统一计算契约：渲染层只描述科学需求，不写调度器语法。 */
export interface CsLabComputeContract {
  labId: string
  profileId: string
  /** 与 DAG 节点 `gpu_task_id` 对应的本地作业键；缺省自动生成。 */
  jobKey?: string
  jobName: string
  nodes: number
  coresPerNode: number
  walltimeHours: number
  memoryGb?: number
  gpus?: number
  gpuType?: string
  queue?: string
  command: string
  /** 随作业上传到远端工作目录的文本输入文件（INCAR / POSCAR 等）。 */
  inputs?: Array<{ name: string; text: string }>
}

export interface CsLabHpcArtifact {
  path: string
  bytes: number
  disposition: 'downloaded' | 'remote-uri'
  assetUri?: string
  remoteUri: string
}

export interface CsLabHpcJob {
  key: string
  labId: string
  profileId: string
  jobId?: string
  schedulerJobName: string
  uuid: string
  state: CsLabHpcJobState
  remoteWorkDir: string
  submittedAt: number
  lastCheckedAt?: number
  endedAt?: number
  message?: string
  artifacts: CsLabHpcArtifact[]
}

export interface CsLabHpcMfaRequest {
  requestId: string
  labId: string
  prompt: string
  deadline: number
}

export interface CsLabHpcTestResult {
  ok: boolean
  message: string
  latencyMs?: number
}

export interface CsLabHpcJobEvent {
  labId: string
  job: CsLabHpcJob
}

// ===== Phase 4：晶体结构与谱图 =====

export type CsLabMolFormat =
  | 'cif'
  | 'pdb'
  | 'poscar'
  | 'xyz'
  | 'cube'
  | 'chgcar'
  | 'locpot'

export interface CsLabMolAsset {
  uri: string
  labId: string
  title: string
  format: CsLabMolFormat
  text: string
  bytes: number
  /** 演示资产的默认视口设置（超胞 / Miller 面 / 自旋）。 */
  defaultSettings?: {
    supercell?: { na: number; nb: number; nc: number }
    miller?: [number, number, number]
    autoSpin?: boolean
    highlightPolyhedra?: boolean
  }
}

export interface CsLabCrystalCell {
  a: number
  b: number
  c: number
  alpha: number
  beta: number
  gamma: number
  volume: number
  spaceGroup?: string
}

export interface CsLabMillerPlane {
  h: number
  k: number
  l: number
  d: number
  normal: [number, number, number]
  twoTheta?: number
}

export interface CsLabAtomSiteSelection {
  element: string
  siteId?: string
  symmetryLabel?: string
  coordinationNumber?: number
  fractional?: [number, number, number]
}

export interface CsLabXrdReflection {
  h: number
  k: number
  l: number
  d: number
  twoTheta: number
  delta: number
}

export interface CsLabTableSeries {
  columns: CsLabColumn[]
  x: number[]
  series: Record<string, number[]>
  totalRows: number
  downsampled: boolean
}

/** 3D 晶体视窗快照参数（Agent 工具 / 渲染层共用）。 */
export interface CsLabStructureSnapshotOptions {
  labId: string
  /** 超采样倍率，1|2|3，默认 2。 */
  scale?: number
  /** 可选文件名前缀，缺省 structure。 */
  filenamePrefix?: string
}

/** 渲染进程提交快照（应答主进程请求或用户手动导出）。 */
export interface CsLabStructureSnapshotSubmitInput {
  labId: string
  /** 由主进程 REQUEST_STRUCTURE_SNAPSHOT 下发；手动导出时省略。 */
  requestId?: string
  dataUrl?: string
  scale?: number
  filenamePrefix?: string
  /** 渲染进程无法截图时回传失败原因；存在时主进程直接拒绝等待中的请求。 */
  error?: string
}

/** 主进程 -> 渲染进程：请求当前 3D 视窗快照。 */
export interface CsLabStructureSnapshotRequest {
  requestId: string
  labId: string
  scale: number
}

export interface CsLabStructureSnapshotResult {
  /** 绝对路径。 */
  path: string
  /** 实验室内 POSIX 相对路径（vault/figures/xxx.png）。 */
  relPath: string
  width: number
  height: number
  bytes: number
}

// ===== Phase 4：学术审稿 =====

export type CsLabSuggestionPersona =
  | 'human'
  | 'Methodology_Reviewer'
  | 'Data_Analyst'
  | 'Literature_Expert'
  | 'Grammar_Check'

export type CsLabSuggestionKind = 'insertion' | 'deletion' | 'comment'
export type CsLabReviewSuggestionKind = 'replace' | 'delete' | 'comment'

export interface CsLabReviewSuggestion {
  id: string
  kind: CsLabReviewSuggestionKind
  persona: CsLabSuggestionPersona
  quote: string
  replacement?: string
  comment?: string
}

export interface CsLabReviewRequest {
  labId: string
  manuscriptUri: string
  persona: CsLabSuggestionPersona
  text: string
}

export interface CsLabReviewResult {
  ok: boolean
  persona: CsLabSuggestionPersona
  suggestions: CsLabReviewSuggestion[]
  message: string
  elapsedMs?: number
}

/** 主进程 -> 渲染进程：聚焦展示 3D 晶体视窗事件。 */
export interface CsLabStructureFocusedEvent {
  labId: string
  uri: string
  title?: string
  supercell?: { na: number; nb: number; nc: number }
  highlightPolyhedra?: boolean
}

/** Agent 请求把任意资产在原生窗格中打开。 */
export interface CsLabAssetFocusedEvent {
  labId: string
  uri: string
  view?: 'auto' | 'terrain'
}

/** 注入 Agent 系统提示词的实验室资产与环境上下文。 */
export interface CsLabPromptAssetSummary {
  uri: string
  title: string
  layerType: string
  format?: string
}

export interface CsLabPromptLiteratureSummary {
  uri: string
  title: string
  year?: string
  doi?: string
  pageCount?: number
  sectionCount?: number
}

export interface CsLabPromptGeoAssetSummary {
  uri: string
  title: string
  format?: string
  width?: number
  height?: number
  cellsize?: number
}

/**
 * 用户视口状态快照（Bug：消除「这是什么」视野盲区）。
 *
 * 前端随每条用户消息采集，主进程注入动态上下文，
 * 让模型明确知道用户此刻正看着哪篇文献、哪个图表或哪条推演链。
 */
export interface CsLabViewportSnapshot {
  /** 当前聚焦的科研视图类型。 */
  activeTab?: 'pdf' | 'plot' | 'manuscript' | 'notes' | 'brain' | 'dag' | 'dataset' | 'agent'
  /** 当前选中的资产/文献实体 URI。 */
  selectedEntityUri?: string
  /** 当前选中实体的可读标题。 */
  selectedEntityLabel?: string
  /** PDF 阅读器当前页码（1 起）。 */
  pdfCurrentPage?: number
  /** PDF 当前划词选区文本（截断后）。 */
  pdfSelectionText?: string
  /** 当前活动图表（数字化/绘图）ID。 */
  plotActiveId?: string
  /** 推演画布当前选中节点 ID。 */
  dagSelectedNodeId?: string
  /** 快照采集时间（ISO 8601）。 */
  capturedAt: string
}

export interface CsLabPromptLabInfo {
  labId: string
  labName: string
  vaultDir?: string
  structures: readonly CsLabPromptAssetSummary[]
  plots: readonly { id: string; title: string }[]
  /** 已登记文献（提示词注入用，不含全文）。 */
  literature?: readonly CsLabPromptLiteratureSummary[]
  /** 地理栅格资产（DEM/GeoTIFF/推演输出）。 */
  geoAssets?: readonly CsLabPromptGeoAssetSummary[]
  /** 列式数据表资产（仅元数据）。 */
  tables?: readonly { uri: string; title: string; rowCount?: number }[]
  /** 科研图版资产（仅元数据）。 */
  figures?: readonly CsLabPromptAssetSummary[]
  /** 手稿文稿（仅元数据）。 */
  manuscripts?: readonly { uri: string; title: string; updatedAt: number }[]
  /** 推演画布（仅元数据）。 */
  canvases?: readonly { relPath: string; title: string }[]
}

// ===== 跨源学术文献检索（多源联邦） =====

/** 学术检索联合路由的上游数据源。 */
export type CsLabAcademicSource = 'openalex' | 'semantic-scholar' | 'arxiv' | 'crossref'

/** 开放获取状态（语义对齐 Unpaywall / OpenAlex）。 */
export type CsLabOaStatus =
  | 'gold'
  | 'green'
  | 'bronze'
  | 'diamond'
  | 'hybrid'
  | 'closed'
  | 'preprint'

export interface CsLabAcademicAuthor {
  name: string
  institution?: string
}

/** 预印本-正刊谱系（Omelette 范式版本对齐）。 */
export interface CsLabAcademicLineage {
  isPreprint: boolean
  /** 已刊版本 DOI（预印本并入正刊主卡片后指向正刊）。 */
  publishedVersionDoi?: string
  /** 版本来源标记，如 ['arXiv:2404.13950', 'SIGIR 2024']。 */
  versionSources: string[]
}

/** 外显元数据卡片契约（检索结果主卡片）。 */
export interface CsLabAcademicPaperMetadata {
  id: string
  title: string
  authors: CsLabAcademicAuthor[]
  year?: number
  publication?: string
  doi?: string
  arxivId?: string
  citationsCount: number
  isOpenAccess: boolean
  oaStatus?: CsLabOaStatus
  /** 合法 OA PDF 首选直链（预览与入库下载用）。 */
  openAccessPdfUrl?: string
  /** 候选合法 OA PDF 直链列表（首选失效时自动按顺序回退）。 */
  openAccessPdfUrls?: string[]
  /** DOI / 出版方落地页。 */
  landingPageUrl?: string
  abstract: string
  /** 1-2 句核心贡献速读（S2 TL;DR 优先，Docling/LLM 渐进增强补全）。 */
  tldr?: string
  /** 方法学关键词胶囊。 */
  methodKeywords: string[]
  /** 学科领域标签。 */
  fieldsOfStudy?: string[]
  /** 命中并参与融合的上游源。 */
  sources: CsLabAcademicSource[]
  /** 各源原始排名（RRF 可解释性）。 */
  sourceRanks: Partial<Record<CsLabAcademicSource, number>>
  lineage: CsLabAcademicLineage
  /** RRF 融合 + 本地轻量重排后的最终得分。 */
  score: number
}

export interface CsLabAcademicSearchFilters {
  yearFrom?: number
  yearTo?: number
  openAccessOnly?: boolean
  sources?: CsLabAcademicSource[]
  fieldsOfStudy?: string[]
  /** 限定出版物 / 会议名。 */
  publication?: string
}

export interface CsLabAcademicSearchInput {
  query: string
  topK?: number
  filters?: CsLabAcademicSearchFilters
  /** 当前配置的 LLM 渠道 / 模型（渲染层传入，供 TL;DR 渐进增强；缺省跳过 LLM 补全）。 */
  channelId?: string
  modelId?: string
}

export interface CsLabAcademicSourceStat {
  source: CsLabAcademicSource
  hits: number
  elapsedMs: number
  /** 该源降级/失败时的可读原因；成功省略。 */
  error?: string
}

export interface CsLabAcademicSearchResult {
  ok: boolean
  papers: CsLabAcademicPaperMetadata[]
  /** 各源命中数与耗时（可解释性面板）。 */
  sourceStats: CsLabAcademicSourceStat[]
  message?: string
}

/** 右侧即时预览载荷。 */
export interface CsLabAcademicPreviewInput {
  doi?: string
  openAccessPdfUrl?: string
  openAccessPdfUrls?: string[]
  landingPageUrl?: string
  arxivId?: string
  title?: string
}

export interface CsLabAcademicPreviewResult {
  ok: boolean
  /** PDF 二进制的 dataURL（仅 OA 直链可达时返回）。 */
  pdfDataUrl?: string
  message?: string
}

/** 一键入库：把 OA PDF 下载为实验室文献资产并登记。 */
export interface CsLabAcademicIngestInput {
  labId: string
  paper: CsLabAcademicPaperMetadata
}

export interface CsLabAcademicIngestResult {
  ok: boolean
  uri?: string
  /** 入库后的实验室 revision（ON_ASSET_CHANGED 事件载荷）。 */
  revision?: number
  message: string
}
