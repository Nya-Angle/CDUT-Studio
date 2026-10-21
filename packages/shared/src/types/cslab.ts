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
  OPEN_LAB: 'cslab:open-lab',
  GET_LAB_SNAPSHOT: 'cslab:get-lab-snapshot',

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

  // ===== 文献阅读 =====
  GET_LITERATURE_ITEM: 'cslab:get-literature-item',
  GET_LITERATURE_URL: 'cslab:get-literature-url',

  // ===== 图表逆向数字化 =====
  DIGITIZE_PLOT: 'cslab:digitize-plot',
  SAVE_DIGITIZED_FIGURE: 'cslab:save-digitized-figure',

  // ===== 公式识别与验算 =====
  OCR_FORMULA: 'cslab:ocr-formula',
  VERIFY_FORMULA: 'cslab:verify-formula',

  // ===== 跨文献 GraphRAG =====
  BUILD_LITERATURE_INDEX: 'cslab:build-literature-index',
  SEARCH_LITERATURE: 'cslab:search-literature',

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

export type CsLabLabStatus = '运行中' | '调试中' | '筹建中'

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

export type CsLabCapabilityKind =
  | 'dataset'
  | 'figure'
  | 'molecule'
  | 'literature'
  | 'manuscript'
  | 'canvas'
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
}

export interface CsLabCreateLabInput {
  name: string
  description?: string
  tags?: string[]
  /** 自定义实验室根目录；缺省落在 ~/.cdutai/cslab-workspaces/{labId}。 */
  rootPath?: string
}

/** 演示实验室创建结果（含预生成出版图）。 */
export interface CsLabDemoLabResult {
  lab: CsLabLab
  assets: CsLabAssetSummary[]
  plotId?: string
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

export interface CsLabManuscript {
  uri: string
  title: string
  docJson: unknown
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

export type CsLabToolProfile = 'plot' | 'formula' | 'formula-ocr' | 'instrument'

export interface CsLabToolProfileStatus {
  installed: boolean
  missing: string[]
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

/** 注入 Agent 系统提示词的实验室资产与环境上下文。 */
export interface CsLabPromptAssetSummary {
  uri: string
  title: string
  layerType: string
  format?: string
}

export interface CsLabPromptLabInfo {
  labId: string
  labName: string
  vaultDir?: string
  structures: readonly CsLabPromptAssetSummary[]
  plots: readonly { id: string; title: string }[]
}
