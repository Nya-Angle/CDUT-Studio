/**
 * CSLab IPC 路由与分发层
 *
 * 严格收敛于 cslab 隔离目录，由 main/ipc.ts 单点挂载。
 * 所有渲染进程输入必须先做类型与路径校验。
 */

import { BrowserWindow, dialog, ipcMain as electronIpcMain, type IpcMainInvokeEvent } from 'electron'
import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { basename, extname, resolve } from 'node:path'
import type {
  CsLabCreateLabInput,
  CsLabCapsule,
  CsLabDocxSyncInput,
  CsLabIngestRequest,
  CsLabLab,
  CsLabLabSnapshot,
  CsLabManuscript,
  CsLabManuscriptSummary,
  CsLabSaveManuscriptInput,
  CsLabSaveManuscriptAsIpcInput,
  CsLabSaveManuscriptAsResult,
  CsLabSaveFileDialogOptions,
  CsLabSaveFileDialogResult,
  CsLabTablePayload,
  CsLabCellValue,
  CsLabAssetSummary,
  CsLabAssetDataUrl,
  CsLabAssetFileInfo,
  CsLabCapsuleLineage,
  CsLabPythonCapability,
  CsLabDocxImportResult,
  CsLabDocxSyncResult,
  CsLabIngestResult,
  CsLabFormulaVerifyInput,
  CsLabLiteratureSearchInput,
  CsLabPlotDigitizeInput,
  CsLabDigitizedFigureInput,
  CsLabTableExportFormat,
  CsLabTableExportResult,
  CsLabToolProfile,
  CsLabZoteroDiscovery,
  CsLabZoteroStatus,
  CsLabZoteroSyncResult,
  CsLabCanvasWriteInput,
  CsLabCreateProtocolInput,
  CsLabCreateRunInput,
  CsLabRunLinkInput,
  CsLabUpdateProtocolInput,
  CsLabUpdateRunInput,
  CsLabCustomToolRunInput,
  CsLabSessionLabBinding,
  CsLabAgentContext,
  CsLabPlotUndoResult,
  CsLabFitRequest,
  CsLabSmoothRequest,
  CsLabPlotDocument,
  CsLabPlotExportOptions,
  CsLabPxrdOptions,
  CsLabPlotExportResult,
  CsLabDemoLabResult,
} from '@profer/shared'
import { createDemoLab } from './cslab-demo'
import {
  analyzeCrystalAsset,
  exportFigure,
  fitPeaks as fitPeaksService,
  getVolumeGrid,
  listPlots,
  loadPlot,
  savePlot,
  simulatePxrdAsset,
  smoothSeries as smoothSeriesService,
} from './cslab-science'
import { CSLAB_IPC_CHANNELS } from './cslab-types'
import { csLabService } from './cslab-service'
import {
  assertCsLabUnlocked,
  getCsLabAuthStatus,
  initCsLabPassword,
  lockCsLabSession,
  verifyCsLabPassword,
} from './cslab-security'
import {
  createLab,
  getLab,
  getLabSnapshot,
  listLabs,
  openLab,
} from './cslab-manager'
import {
  exportAssetTableToFile,
  getAssetEntity,
  getAssetTable,
  getTableCell,
  ingestFiles,
  listAssets,
  resolveAssetPath,
  resolveDerivedTableUri,
} from './cslab-iron-cage'
import { checkStaleness, getCapsuleLineage, updateCapsule } from './cslab-capsule'
import {
  attachDocx,
  blocksToDocJson,
  createManuscript,
  getLinkedDocxPath,
  getManuscript,
  listManuscripts,
  readDocxBuffer,
  saveManuscript,
  saveManuscriptAs,
  writeExportDocx,
  writeLinkedDocx,
} from './cslab-manuscript'
import { runOoxmlTask } from './cslab-ooxml'
import { getPythonCapability } from './cslab-python'
import { broadcastCsLabEvent } from './cslab-events'
import { restorePlotUndoSnapshot } from './cslab-plot-history'
import {
  getCsLabAgentWindowContext,
  openCsLabAgentWindow,
  sendCsLabAgentContext,
} from './cslab-window-manager'
import {
  discoverZotero,
  getZoteroStatus,
  listLiteratureZoteroAnnotations,
  listZoteroLiterature,
  setZoteroDataDir,
  startZoteroWatcher,
  stopZoteroWatcher,
  syncZoteroLibrary,
} from './cslab-zotero'
import { getZoteroBridgeStatus } from './cslab-zotero-bridge'
import { getLiteratureFilePath, getLiteratureItem } from './cslab-literature'
import {
  ensureToolEnvironment,
  getToolRuntimeStatus,
} from './cslab-python-runtime'
import { digitizePlot } from './cslab-plot-digitizer'
import { persistDigitizedFigure } from './cslab-dataset-store'
import { ocrFormula, verifyFormula } from './cslab-formula-verifier'
import {
  buildLiteratureIndex,
  searchLabLiterature,
} from './cslab-graphrag-router'
import { registerProferFilePath } from '../local-file-protocol'
import { updateAgentSessionMeta } from '../agent-session-manager'
import {
  createProtocol,
  createRun,
  linkRunAsset,
  listProtocols,
  listRuns,
  unlinkRunAsset,
  updateProtocol,
  updateRun,
} from './cslab-runs'
import {
  createCanvas,
  listCanvases,
  readCanvas,
  startVaultWatcher,
  stopVaultWatcher,
  writeCanvas,
} from './cslab-canvas-sync'
import {
  getNoteBacklinks,
  getVaultIndexStatus,
  listVaultNotes,
  readVaultNote,
  rebuildVaultIndex,
  searchVaultNotes,
} from './cslab-vault-index'
import {
  getLabToolScan,
  runLabTool,
  scanLabTools,
  startLabToolWatcher,
  stopLabToolWatcher,
} from './cslab-tool-registry'
import { isCsLabToolTrusted, onCsLabOpened } from './cslab-tool-trust'
import { getAgentSessionMeta } from '../agent-session-manager'
import { ensureUvForLab } from './cslab-uv'
import { confirmUvUntrustedInstall } from './cslab-uv-consent'
import {
  addShareSource,
  listShareCandidates,
  listShareSources,
  removeShareSource,
  scanShareNow,
  startShareWatcher,
  stopShareWatcher,
  testShareSource,
  type CsLabShareWatcherSink,
} from './cslab-share-watcher'
import {
  answerHpcMfa,
  cancelHpcJob,
  cancelHpcJobsByKeys,
  deleteHpcProfile,
  harvestHpcJob,
  listHpcJobs,
  listHpcProfiles,
  refreshHpcJob,
  rehydrateHpcJobs,
  saveHpcProfile,
  submitHpcJob,
  testHpcConnection,
  type CsLabHpcSink,
} from './cslab-hpc'
import { getMolAsset, getTableSeries } from './cslab-mol'
import { reviewManuscript } from './cslab-ai-review'

/** 门禁自身通道：未解锁也必须可用，否则用户无法完成首次设密与验密。 */
const AUTH_EXEMPT_CHANNELS = new Set<string>([
  CSLAB_IPC_CHANNELS.GET_AUTH_STATUS,
  CSLAB_IPC_CHANNELS.INIT_PASSWORD,
  CSLAB_IPC_CHANNELS.VERIFY_PASSWORD,
  CSLAB_IPC_CHANNELS.VERIFY_KEY,
  CSLAB_IPC_CHANNELS.LOCK_SESSION,
])

/** 另存为对话框签发的一次性令牌有效期。 */
const SAVE_TOKEN_TTL_MS = 60_000
const pendingSaveTokens = new Map<string, { path: string; expiresAt: number }>()

/** Windows 路径大小写不敏感，比较前统一归一化。 */
function normalizeSavePath(value: string): string {
  const resolved = resolve(value)
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved
}

/**
 * 所有 CSLab 通道统一在注册处包裹主进程硬门禁。
 * 只改注册入口而不逐个改 handler，避免漏改，也保证后续新增通道默认受保护。
 */
const ipcMain = {
  handle(
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: any[]) => any,
  ): void {
    electronIpcMain.handle(channel, async (event, ...args: any[]) => {
      if (!AUTH_EXEMPT_CHANNELS.has(channel)) assertCsLabUnlocked()
      return listener(event, ...args)
    })
  },
}

function asString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label}无效`)
  return value
}

function asStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`${label}无效`)
  const list = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  if (list.length === 0) throw new Error(`${label}无效`)
  return list
}

function asNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${label}无效`)
  return value
}

function asObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label}无效`)
  }
  return value as Record<string, unknown>
}

/** 图片资产允许的扩展名 -> MIME；未知扩展名直接拒绝。 */
const CSLAB_IMAGE_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.avif': 'image/avif',
}

/** DataURL 大小上限：32MB，与计划保持一致。 */
const CSLAB_IMAGE_MAX_BYTES = 32 * 1024 * 1024

function sniffPngSize(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 24) return null
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

function sniffGifSize(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 10) return null
  const header = buffer.toString('ascii', 0, 6)
  if (header !== 'GIF87a' && header !== 'GIF89a') return null
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) }
}

function sniffJpegSize(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null
  let offset = 2
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = buffer[offset + 1]!
    // SOF0..SOF15（排除 DHT/JPG/DAC）携带画幅尺寸。
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      }
    }
    const length = buffer.readUInt16BE(offset + 2)
    if (length < 2) return null
    offset += 2 + length
  }
  return null
}

function sniffImageSize(buffer: Buffer): { width: number; height: number } | null {
  return sniffPngSize(buffer) ?? sniffGifSize(buffer) ?? sniffJpegSize(buffer)
}

function toSafeFileName(value: string, fallback: string): string {
  const cleaned = value.replace(/[\\/:*?"<>|]/g, '_').trim()
  return cleaned || fallback
}

/** CSLab 共享盘事件出口：统一广播状态、资产与胶囊陈旧。 */
function createShareSink(): CsLabShareWatcherSink {
  return {
    onStatus: (event) => {
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_SHARE_STATUS, event)
    },
    onCaptured: (labId, result) => {
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ASSET_CHANGED, {
        labId,
        uri: result.tableUri ?? result.asset.uri,
        kind: 'created',
        revision: result.asset.revision,
      })
      const staleCapsules = checkStaleness(labId)
      if (staleCapsules.length > 0) {
        broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_CAPSULE_STALE, {
          labId,
          capsuleIds: staleCapsules,
        })
      }
    },
  }
}

/** CSLab 超算事件出口：作业状态与 MFA 挑战。 */
function createHpcSink(): CsLabHpcSink {
  return {
    onJob: (job) => {
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_HPC_JOB, { labId: job.labId, job })
    },
    onMfa: (request) => {
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_HPC_MFA, request)
    },
  }
}

/** 集中注册 CSLab 专属 IPC 处理器 */
export function registerCsLabIpc(): void {
  // ===== 本机门禁与遥测 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_AUTH_STATUS, async () => getCsLabAuthStatus())

  ipcMain.handle(CSLAB_IPC_CHANNELS.INIT_PASSWORD, async (_event, password: unknown) => {
    if (typeof password !== 'string') {
      return { success: false, message: '无效的密码参数类型' }
    }
    return await initCsLabPassword(password)
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.VERIFY_PASSWORD, async (_event, password: unknown) => {
    if (typeof password !== 'string') {
      return { success: false, message: '无效的密码参数类型' }
    }
    return await verifyCsLabPassword(password)
  })

  // 兼容旧通道：语义与 VERIFY_PASSWORD 一致
  ipcMain.handle(CSLAB_IPC_CHANNELS.VERIFY_KEY, async (_event, password: unknown) => {
    if (typeof password !== 'string') {
      return { success: false, message: '无效的密码参数类型' }
    }
    return await verifyCsLabPassword(password)
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.LOCK_SESSION, async () => {
    lockCsLabSession()
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_TELEMETRY, async () => csLabService.getTelemetry())
  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_NODES, async () => csLabService.getNodes())
  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_LOGS, async () => csLabService.getLogs())
  ipcMain.handle(CSLAB_IPC_CHANNELS.PING, async () => csLabService.ping())

  // ===== 实验室沙箱 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.LIST_LABS, async (): Promise<CsLabLab[]> => listLabs())

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.CREATE_DEMO_LAB,
    async (): Promise<CsLabDemoLabResult> => createDemoLab(),
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.CREATE_LAB,
    async (_event, input: unknown): Promise<CsLabLab> => {
      if (!input || typeof input !== 'object') throw new Error('实验室创建参数无效')
      const record = input as Partial<CsLabCreateLabInput>
      return createLab({
        name: asString(record.name, '实验室名称'),
        description: typeof record.description === 'string' ? record.description : undefined,
        tags: Array.isArray(record.tags)
          ? record.tags.filter((tag): tag is string => typeof tag === 'string')
          : undefined,
        rootPath: typeof record.rootPath === 'string' ? record.rootPath : undefined,
      })
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.OPEN_LAB,
    async (_event, labId: unknown): Promise<CsLabLabSnapshot> => {
      const normalizedLabId = asString(labId, '实验室标识')
      openLab(normalizedLabId)
      // 切换实验室时，上一实验室的 Python 工具免审批信任立即失效。
      onCsLabOpened(normalizedLabId)
      // 后台增量建索引：万篇笔记也不阻塞首屏。
      void rebuildVaultIndex(normalizedLabId).catch((error: unknown) => {
        console.warn('[CSLab] 打开实验室时 Vault 索引失败:', error)
      })
      // 共享盘：已登记的源自动恢复监听（存在即恢复）。
      void startShareWatcher(normalizedLabId, undefined, createShareSink()).catch(
        (error: unknown) => {
          console.warn('[CSLab] 打开实验室时共享盘监听启动失败:', error)
        },
      )
      // 超算：后台重水合未完成作业，找回 JobID / 状态。
      void rehydrateHpcJobs(normalizedLabId, createHpcSink()).catch((error: unknown) => {
        console.warn('[CSLab] 打开实验室时超算重水合失败:', error)
      })
      return getLabSnapshot(normalizedLabId)
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_LAB_SNAPSHOT,
    async (_event, labId: unknown): Promise<CsLabLabSnapshot> =>
      getLabSnapshot(asString(labId, '实验室标识')),
  )

  // ===== 数据铁笼 =====
  ipcMain.handle(
    CSLAB_IPC_CHANNELS.INGEST_FILES,
    async (_event, input: unknown): Promise<CsLabIngestResult[]> => {
      if (!input || typeof input !== 'object') throw new Error('摄取参数无效')
      const request = input as Partial<CsLabIngestRequest>
      const labId = asString(request.labId, '实验室标识')
      const paths = asStringArray(request.paths, '文件路径')

      const results = await ingestFiles(labId, paths, {
        onProgress: (progress) => {
          broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_INGEST_PROGRESS, progress)
        },
      })

      for (const result of results) {
        if (result.status === 'error') continue
        broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ASSET_CHANGED, {
          labId,
          uri: result.tableUri ?? result.asset.uri,
          kind: 'created',
          revision: result.asset.revision,
        })
      }

      const staleCapsules = checkStaleness(labId)
      if (staleCapsules.length > 0) {
        broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_CAPSULE_STALE, {
          labId,
          capsuleIds: staleCapsules,
        })
      }

      return results
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.LIST_ASSETS,
    async (_event, labId: unknown): Promise<CsLabAssetSummary[]> =>
      // 笔记资产单独限制条数，避免万篇 Vault 一次性穿过 IPC。
      listAssets(asString(labId, '实验室标识'), { noteLimit: 500 }),
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_ASSET_TABLE,
    async (_event, input: unknown): Promise<CsLabTablePayload | null> => {
      if (!input || typeof input !== 'object') throw new Error('表格读取参数无效')
      const record = input as { labId?: unknown; uri?: unknown }
      return getAssetTable(asString(record.labId, '实验室标识'), asString(record.uri, '资产 URI'))
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_TABLE_CELL,
    async (_event, input: unknown): Promise<CsLabCellValue> => {
      if (!input || typeof input !== 'object') throw new Error('单元格读取参数无效')
      const record = input as {
        labId?: unknown
        tableUri?: unknown
        column?: unknown
        rowIndex?: unknown
      }
      return getTableCell(
        asString(record.labId, '实验室标识'),
        asString(record.tableUri, '数据表 URI'),
        asString(record.column, '列标识'),
        asNumber(record.rowIndex, '行索引'),
      )
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.RESOLVE_DERIVED_TABLE,
    async (_event, input: unknown): Promise<string | null> => {
      const record = asObject(input, '派生表查询参数')
      return resolveDerivedTableUri(
        asString(record.labId, '实验室标识'),
        asString(record.uri, '资产 URI'),
      )
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_ASSET_FILE_INFO,
    async (_event, input: unknown): Promise<CsLabAssetFileInfo> => {
      const record = asObject(input, '资产路径参数')
      const labId = asString(record.labId, '实验室标识')
      const uri = asString(record.uri, '资产 URI')
      const entity = getAssetEntity(labId, uri)
      if (!entity) throw new Error('资产不存在')
      const path = resolveAssetPath(labId, uri)
      if (!path) throw new Error('该资产没有可定位的本地文件')
      return { path, name: entity.title }
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_ASSET_DATA_URL,
    async (_event, input: unknown): Promise<CsLabAssetDataUrl> => {
      const record = asObject(input, '资产图像参数')
      const labId = asString(record.labId, '实验室标识')
      const uri = asString(record.uri, '资产 URI')
      const entity = getAssetEntity(labId, uri)
      if (!entity) throw new Error('资产不存在')
      const extension = extname(entity.relPath ?? entity.title).toLowerCase()
      const mime = CSLAB_IMAGE_MIME[extension]
      if (!mime) throw new Error('该资产不是可预览的图片格式')
      const path = resolveAssetPath(labId, uri)
      if (!path) throw new Error('该资产没有可定位的本地文件')

      const stat = await fs.stat(path)
      if (stat.size > CSLAB_IMAGE_MAX_BYTES) {
        throw new Error('图片超过 32MB 上限，请先离线降采样后再导入')
      }
      const buffer = await fs.readFile(path)
      const size = sniffImageSize(buffer)
      return {
        dataUrl: `data:${mime};base64,${buffer.toString('base64')}`,
        mime,
        bytes: buffer.length,
        width: size?.width,
        height: size?.height,
      }
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.EXPORT_TABLE,
    async (event, input: unknown): Promise<CsLabTableExportResult> => {
      const record = asObject(input, '数据表导出参数')
      const labId = asString(record.labId, '实验室标识')
      const tableUri = asString(record.tableUri, '数据表 URI')
      const format = record.format
      if (format !== 'parquet' && format !== 'csv') throw new Error('导出格式无效')

      const entity = getAssetEntity(labId, tableUri)
      if (!entity || entity.layerType !== 'table') throw new Error('只允许导出本实验室的数据表')

      const extension = format === 'parquet' ? 'parquet' : 'csv'
      const win = BrowserWindow.fromWebContents(event.sender)
      const result = await dialog.showSaveDialog(win || (undefined as never), {
        title: format === 'parquet' ? '导出 Parquet 数据表' : '导出 CSV 数据表',
        defaultPath: `${toSafeFileName(entity.title, '数据表')}.${extension}`,
        filters:
          format === 'parquet'
            ? [{ name: 'Apache Parquet (*.parquet)', extensions: ['parquet'] }]
            : [{ name: 'CSV 表格 (*.csv)', extensions: ['csv'] }],
      })
      if (result.canceled || !result.filePath) {
        return {
          success: false,
          path: '',
          format: format as CsLabTableExportFormat,
          message: '已取消导出',
        }
      }
      return exportAssetTableToFile(labId, tableUri, format, result.filePath)
    },
  )

  // ===== 论文与胶囊 =====
  ipcMain.handle(
    CSLAB_IPC_CHANNELS.LIST_MANUSCRIPTS,
    async (_event, labId: unknown): Promise<CsLabManuscriptSummary[]> =>
      listManuscripts(asString(labId, '实验室标识')),
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.CREATE_MANUSCRIPT,
    async (_event, input: unknown): Promise<CsLabManuscript> => {
      if (!input || typeof input !== 'object') throw new Error('文稿创建参数无效')
      const record = input as { labId?: unknown; title?: unknown }
      return createManuscript(
        asString(record.labId, '实验室标识'),
        typeof record.title === 'string' ? record.title : '未命名文稿',
      )
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_MANUSCRIPT,
    async (_event, input: unknown): Promise<CsLabManuscript | null> => {
      if (!input || typeof input !== 'object') throw new Error('文稿读取参数无效')
      const record = input as { labId?: unknown; uri?: unknown }
      return getManuscript(asString(record.labId, '实验室标识'), asString(record.uri, '文稿 URI'))
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.SAVE_MANUSCRIPT,
    async (_event, input: unknown): Promise<CsLabManuscript> => {
      if (!input || typeof input !== 'object') throw new Error('文稿保存参数无效')
      const record = input as Partial<CsLabSaveManuscriptInput>
      const labId = asString(record.labId, '实验室标识')
      const saved = await saveManuscript({
        labId,
        uri: asString(record.uri, '文稿 URI'),
        title: asString(record.title, '文稿标题'),
        docJson: record.docJson,
        capsules: Array.isArray(record.capsules) ? (record.capsules as CsLabCapsule[]) : [],
      })

      const staleCapsules = checkStaleness(labId)
      if (staleCapsules.length > 0) {
        broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_CAPSULE_STALE, {
          labId,
          capsuleIds: staleCapsules,
        })
      }
      return saved
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.EXPORT_DOCX,
    async (_event, input: unknown): Promise<CsLabDocxSyncResult> => {
      if (!input || typeof input !== 'object') throw new Error('导出参数无效')
      const record = input as { labId?: unknown; manuscriptUri?: unknown }
      const labId = asString(record.labId, '实验室标识')
      const manuscriptUri = asString(record.manuscriptUri, '文稿 URI')
      const manuscript = await getManuscript(labId, manuscriptUri)
      if (!manuscript) throw new Error('文稿不存在')

      const capsules = manuscript.capsules.map((capsule) => ({
        id: capsule.id,
        label: capsule.label,
        unit: capsule.unit,
        value: capsule.value,
      }))

      const exported = await runOoxmlTask({
        type: 'export',
        input: {
          title: manuscript.title,
          docJson: manuscript.docJson,
          capsules,
        },
      })
      if (exported.type !== 'export') throw new Error('OOXML 导出结果类型异常')

      const written = await writeExportDocx(labId, manuscriptUri, exported.result.buffer)
      return {
        success: true,
        mode: 'export',
        docxPath: written.path,
        linkedDocxPath: written.linkedPath,
        documentXmlUnchanged: false,
        updatedCapsuleIds: [],
        addedCapsuleIds: [],
        removedCapsuleIds: [],
        missingDataBindingIds: [],
        message: written.createdLink
          ? '已导出 Word 并建立同步副本'
          : '已导出为新文件，原 Word 未改动',
      }
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.SYNC_DOCX,
    async (_event, input: unknown): Promise<CsLabDocxSyncResult> => {
      if (!input || typeof input !== 'object') throw new Error('同步参数无效')
      const record = input as Partial<CsLabDocxSyncInput>
      const labId = asString(record.labId, '实验室标识')
      const manuscriptUri = asString(record.manuscriptUri, '文稿 URI')

      const manuscript = await getManuscript(labId, manuscriptUri)
      if (!manuscript) throw new Error('文稿不存在')

      const linkedPath = getLinkedDocxPath(labId, manuscriptUri)
      if (!linkedPath) throw new Error('尚未导出 Word 文稿，请先执行“导出 Word”')

      // 只允许同步长期链接副本，避免“读 A 写 B”的误写。
      if (typeof record.docxPath === 'string' && record.docxPath.trim()) {
        if (resolve(record.docxPath) !== resolve(linkedPath)) {
          throw new Error('同步目标必须是与文稿关联的 Word 副本；外部路径不会被写入')
        }
      }

      const local = await readDocxBuffer(labId, manuscriptUri)
      if (!local) throw new Error('无法读取关联的 Word 文稿')

      const synced = await runOoxmlTask({
        type: 'sync',
        buffer: new Uint8Array(local.buffer),
        capsules: manuscript.capsules.map((capsule) => ({
          id: capsule.id,
          label: capsule.label,
          unit: capsule.unit,
          value: capsule.value,
        })),
      })
      if (synced.type !== 'sync') throw new Error('OOXML 同步结果类型异常')

      const docxPath = await writeLinkedDocx(labId, manuscriptUri, synced.result.buffer)
      const parts: string[] = []
      if (synced.result.updatedCapsuleIds.length > 0) {
        parts.push(`已更新 ${synced.result.updatedCapsuleIds.length} 个胶囊`)
      }
      if (synced.result.addedCapsuleIds.length > 0) {
        parts.push(`${synced.result.addedCapsuleIds.length} 个新增胶囊需重新导出以生成正文占位`)
      }
      if (synced.result.removedCapsuleIds.length > 0) {
        parts.push(`已移除 ${synced.result.removedCapsuleIds.length} 个胶囊`)
      }
      if (synced.result.missingDataBindingIds.length > 0) {
        parts.push(`${synced.result.missingDataBindingIds.length} 个胶囊缺少正文绑定`)
      }

      return {
        success: true,
        mode: 'sync',
        docxPath,
        linkedDocxPath: linkedPath,
        documentXmlUnchanged: synced.result.documentXmlUnchanged,
        updatedCapsuleIds: synced.result.updatedCapsuleIds,
        addedCapsuleIds: synced.result.addedCapsuleIds,
        removedCapsuleIds: synced.result.removedCapsuleIds,
        missingDataBindingIds: synced.result.missingDataBindingIds,
        message: parts.length > 0 ? parts.join('；') : 'Word 数据胶囊已是最新状态',
      }
    },
  )


  ipcMain.handle(
    CSLAB_IPC_CHANNELS.SHOW_SAVE_FILE_DIALOG,
    async (event, options?: CsLabSaveFileDialogOptions): Promise<CsLabSaveFileDialogResult | null> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      const res = await dialog.showSaveDialog(win || (undefined as never), {
        title: options?.title || '另存为',
        defaultPath: options?.defaultPath,
        filters: options?.filters || [
          { name: 'Word 文档 (*.docx)', extensions: ['docx'] },
          { name: 'Markdown 文档 (*.md)', extensions: ['md'] },
          { name: '所有文件 (*.*)', extensions: ['*'] },
        ],
      })
      if (res.canceled || !res.filePath) return null

      // 清理过期令牌，避免 Map 无界增长。
      const now = Date.now()
      for (const [token, entry] of pendingSaveTokens) {
        if (entry.expiresAt <= now) pendingSaveTokens.delete(token)
      }

      const saveToken = randomUUID()
      pendingSaveTokens.set(saveToken, { path: res.filePath, expiresAt: now + SAVE_TOKEN_TTL_MS })
      return { filePath: res.filePath, saveToken }
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.SAVE_MANUSCRIPT_AS,
    async (_event, input: unknown): Promise<CsLabSaveManuscriptAsResult> => {
      if (!input || typeof input !== 'object') throw new Error('另存为参数无效')
      const record = input as Partial<CsLabSaveManuscriptAsIpcInput>
      const labId = asString(record.labId, '实验室标识')
      const targetPath = asString(record.targetPath, '目标路径')
      const saveToken = asString(record.saveToken, '保存凭据')

      // 令牌单次有效：无论校验是否通过都先摘除，杜绝重放。
      const entry = pendingSaveTokens.get(saveToken)
      pendingSaveTokens.delete(saveToken)
      if (
        !entry ||
        entry.expiresAt < Date.now() ||
        normalizeSavePath(entry.path) !== normalizeSavePath(targetPath)
      ) {
        throw new Error('未授权的保存目标路径，必须经由系统文件对话框选定')
      }

      return saveManuscriptAs({
        labId,
        uri: asString(record.uri, '文稿 URI'),
        targetPath,
        format: record.format,
        title: asString(record.title, '文稿标题'),
        docJson: record.docJson,
        capsules: Array.isArray(record.capsules) ? (record.capsules as CsLabCapsule[]) : [],
      })
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.IMPORT_DOCX,
    async (_event, input: unknown): Promise<CsLabDocxImportResult> => {
      if (!input || typeof input !== 'object') throw new Error('导入参数无效')
      const record = input as { labId?: unknown; docxPath?: unknown; title?: unknown }
      const labId = asString(record.labId, '实验室标识')
      const docxPath = asString(record.docxPath, 'Word 文件路径')
      if (!docxPath.toLowerCase().endsWith('.docx')) throw new Error('仅支持 .docx 文件')

      const stat = await fs.stat(docxPath)
      if (!stat.isFile()) throw new Error('目标不是文件')
      if (stat.size > 64 * 1024 * 1024) throw new Error('Word 文件不能超过 64MB')

      const buffer = await fs.readFile(docxPath)
      const imported = await runOoxmlTask({ type: 'import', buffer: new Uint8Array(buffer) })
      if (imported.type !== 'import') throw new Error('OOXML 导入结果类型异常')

      const fallbackTitle = basename(docxPath, extname(docxPath)).slice(0, 120)
      const title =
        typeof record.title === 'string' && record.title.trim()
          ? record.title.trim()
          : fallbackTitle || imported.result.title

      const manuscript = await createManuscript(labId, title)

      const now = Date.now()
      const capsules: CsLabCapsule[] = imported.result.capsules.map((capsule) => ({
        id: capsule.id,
        labId,
        label: capsule.label ?? capsule.id,
        value: capsule.value,
        unit: capsule.unit,
        tableUri: '',
        column: '',
        rowIndex: 0,
        revisionAtBind: 0,
        status: 'orphan',
        updatedAt: now,
      }))

      const saved = await saveManuscript({
        labId,
        uri: manuscript.uri,
        title,
        docJson: blocksToDocJson(imported.result.blocks, imported.result.capsules),
        capsules,
      })
      const localDocxPath = await attachDocx(labId, manuscript.uri, new Uint8Array(buffer))

      return {
        manuscript: { ...saved, docxPath: localDocxPath },
        importedCapsules: capsules,
        message: capsules.length > 0
          ? `已导入 ${imported.result.paragraphs.length} 段正文，并保留 ${capsules.length} 个胶囊位置；胶囊需重新绑定数据表`
          : `已导入 ${imported.result.paragraphs.length} 段正文`,
      }
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.UPDATE_CAPSULE,
    async (_event, input: unknown): Promise<CsLabCapsule> => {
      if (!input || typeof input !== 'object') throw new Error('胶囊更新参数无效')
      const record = input as { labId?: unknown; capsuleId?: unknown }
      const labId = asString(record.labId, '实验室标识')
      const result = await updateCapsule(labId, asString(record.capsuleId, '胶囊标识'))
      return result.capsule
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_CAPSULE_LINEAGE,
    async (_event, input: unknown): Promise<CsLabCapsuleLineage | null> => {
      if (!input || typeof input !== 'object') throw new Error('血缘查询参数无效')
      const record = input as { labId?: unknown; capsuleId?: unknown }
      return getCapsuleLineage(
        asString(record.labId, '实验室标识'),
        asString(record.capsuleId, '胶囊标识'),
      )
    },
  )

  // ===== 环境能力 =====
  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_PYTHON_CAPABILITY,
    async (): Promise<CsLabPythonCapability> => getPythonCapability(),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_TOOL_RUNTIME, async (_event, labId: unknown) =>
    getToolRuntimeStatus(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.INSTALL_TOOL_DEPS, async (_event, input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('依赖安装参数无效')
    const record = input as { labId?: unknown; profile?: unknown }
    const labId = asString(record.labId, '实验室标识')
    const profile = asProfile(record.profile)
    return ensureToolEnvironment(labId, profile, {
      onProgress: (progress) =>
        broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_TOOL_DEPS_PROGRESS, progress),
    })
  })

  // ===== Zotero 文献同步 =====
  ipcMain.handle(
    CSLAB_IPC_CHANNELS.ZOTERO_GET_STATUS,
    async (_event, labId: unknown): Promise<CsLabZoteroStatus> =>
      getZoteroStatus(asString(labId, '实验室标识')),
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.ZOTERO_DISCOVER,
    async (_event, input: unknown): Promise<CsLabZoteroDiscovery> => {
      if (!input || typeof input !== 'object') throw new Error('发现参数无效')
      const record = input as { labId?: unknown; dataDir?: unknown }
      return discoverZotero(
        asString(record.labId, '实验室标识'),
        typeof record.dataDir === 'string' && record.dataDir.trim()
          ? record.dataDir
          : undefined,
      )
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.ZOTERO_SET_DATA_DIR,
    async (_event, input: unknown): Promise<CsLabZoteroDiscovery> => {
      if (!input || typeof input !== 'object') throw new Error('数据目录参数无效')
      const record = input as { labId?: unknown; dataDir?: unknown }
      const labId = asString(record.labId, '实验室标识')
      const discovery = await setZoteroDataDir(labId, asString(record.dataDir, 'Zotero 数据目录'))
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ZOTERO_STATUS, {
        labId,
        status: discovery.status,
      })
      return discovery
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.ZOTERO_SYNC,
    async (_event, input: unknown): Promise<CsLabZoteroSyncResult> => {
      if (!input || typeof input !== 'object') throw new Error('同步参数无效')
      const record = input as {
        labId?: unknown
        dataDir?: unknown
        forceFull?: unknown
      }
      const labId = asString(record.labId, '实验室标识')
      const result = await syncZoteroLibrary(labId, {
        dataDir:
          typeof record.dataDir === 'string' && record.dataDir.trim()
            ? record.dataDir
            : undefined,
        forceFull: record.forceFull === true,
      })
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ZOTERO_SYNCED, { labId, result })
      const status = await getZoteroStatus(labId)
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ZOTERO_STATUS, { labId, status })
      return result
    },
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.ZOTERO_LIST_LITERATURE, async (_event, labId: unknown) =>
    listZoteroLiterature(asString(labId, '实验室标识')),
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.ZOTERO_LIST_ANNOTATIONS,
    async (_event, input: unknown) => {
      if (!input || typeof input !== 'object') throw new Error('批注查询参数无效')
      const record = input as { labId?: unknown; literatureUri?: unknown }
      return listLiteratureZoteroAnnotations(
        asString(record.labId, '实验室标识'),
        asString(record.literatureUri, '文献 URI'),
      )
    },
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.ZOTERO_START_WATCH, async (_event, labId: unknown) => {
    const normalizedLabId = asString(labId, '实验室标识')
    return startZoteroWatcher(normalizedLabId, (result) => {
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ZOTERO_SYNCED, {
        labId: normalizedLabId,
        result,
      })
      void getZoteroStatus(normalizedLabId).then((status) => {
        broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ZOTERO_STATUS, {
          labId: normalizedLabId,
          status,
        })
      })
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.ZOTERO_STOP_WATCH, async (_event, labId: unknown) =>
    stopZoteroWatcher(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.ZOTERO_GET_BRIDGE_STATUS, async () =>
    getZoteroBridgeStatus(),
  )

  // ===== 文献阅读 =====
  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_LITERATURE_ITEM,
    async (_event, input: unknown) => {
      if (!input || typeof input !== 'object') throw new Error('文献查询参数无效')
      const record = input as { labId?: unknown; uri?: unknown }
      return getLiteratureItem(
        asString(record.labId, '实验室标识'),
        asString(record.uri, '文献 URI'),
      )
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.GET_LITERATURE_URL,
    async (_event, input: unknown): Promise<{
      url: string
      name: string
      pageCount?: number
    }> => {
      if (!input || typeof input !== 'object') throw new Error('文献地址参数无效')
      const record = input as { labId?: unknown; uri?: unknown }
      const labId = asString(record.labId, '实验室标识')
      const uri = asString(record.uri, '文献 URI')
      const resolved = getLiteratureFilePath(labId, uri)
      if (!resolved.path) throw new Error(resolved.reason ?? '文献文件不可用')
      const item = getLiteratureItem(labId, uri)
      const name = resolved.path.split(/[\\/]/).pop() ?? 'document.pdf'
      return {
        url: registerProferFilePath(resolved.path),
        name,
        pageCount: item?.pageCount,
      }
    },
  )

  // ===== 图表逆向数字化 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.DIGITIZE_PLOT, async (_event, input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('数字化参数无效')
    const record = input as Partial<CsLabPlotDigitizeInput>
    const labId = asString(record.labId, '实验室标识')
    if (typeof record.imageDataUrl !== 'string' || !record.imageDataUrl.trim()) {
      throw new Error('缺少框选图像')
    }
    if (record.mode !== 'line' && record.mode !== 'scatter') {
      throw new Error('数字化模式无效')
    }
    return digitizePlot({
      labId,
      imageDataUrl: record.imageDataUrl,
      mode: record.mode,
      calibration: record.calibration as CsLabPlotDigitizeInput['calibration'],
      color: typeof record.color === 'string' ? record.color : undefined,
      tolerance: typeof record.tolerance === 'number' ? record.tolerance : undefined,
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SAVE_DIGITIZED_FIGURE, async (_event, input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('图表保存参数无效')
    const record = input as Partial<CsLabDigitizedFigureInput>
    return persistDigitizedFigure({
      labId: asString(record.labId, '实验室标识'),
      title: asString(record.title, '图表标题'),
      sourceUri: typeof record.sourceUri === 'string' ? record.sourceUri : '',
      imageDataUrl: asString(record.imageDataUrl, '框选图像'),
      calibration: record.calibration as CsLabDigitizedFigureInput['calibration'],
      series: Array.isArray(record.series) ? record.series : [],
    })
  })

  // ===== 公式识别与验算 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.OCR_FORMULA, async (_event, input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('公式识别参数无效')
    const record = input as { labId?: unknown; imageDataUrl?: unknown }
    return ocrFormula(
      asString(record.labId, '实验室标识'),
      asString(record.imageDataUrl, '公式图像'),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.VERIFY_FORMULA, async (_event, input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('公式验算参数无效')
    const record = input as Partial<CsLabFormulaVerifyInput>
    return verifyFormula({
      labId: asString(record.labId, '实验室标识'),
      latexLhs: asString(record.latexLhs, '等式左侧'),
      latexRhs: asString(record.latexRhs, '等式右侧'),
      symbolDimensions:
        record.symbolDimensions && typeof record.symbolDimensions === 'object'
          ? (record.symbolDimensions as Record<string, string>)
          : undefined,
    })
  })

  // ===== 跨文献 GraphRAG =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.BUILD_LITERATURE_INDEX, async (_event, input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('索引构建参数无效')
    const record = input as { labId?: unknown; force?: unknown }
    return buildLiteratureIndex(
      asString(record.labId, '实验室标识'),
      record.force === true,
    )
  })

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.SEARCH_LITERATURE,
    async (_event, input: unknown) => {
      if (!input || typeof input !== 'object') throw new Error('文献检索参数无效')
      const record = input as Partial<CsLabLiteratureSearchInput>
      return searchLabLiterature({
        labId: asString(record.labId, '实验室标识'),
        query: asString(record.query, '检索关键词'),
        topK: typeof record.topK === 'number' ? record.topK : undefined,
        literatureUri:
          typeof record.literatureUri === 'string' && record.literatureUri.trim()
            ? record.literatureUri
            : undefined,
      })
    },
  )

  // ===== 实验规程与批次 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.RUN_LIST_PROTOCOLS, async (_event, labId: unknown) =>
    listProtocols(asString(labId, '实验室标识')),
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.RUN_CREATE_PROTOCOL,
    async (_event, input: unknown) => {
      const record = asObject(input, '规程参数')
      const payload: CsLabCreateProtocolInput = {
        ...(record as unknown as CsLabCreateProtocolInput),
        labId: asString(record.labId, '实验室标识'),
        title: asString(record.title, '规程标题'),
      }
      return createProtocol(payload)
    },
  )

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.RUN_UPDATE_PROTOCOL,
    async (_event, input: unknown) => {
      const record = asObject(input, '规程参数')
      const payload: CsLabUpdateProtocolInput = {
        ...(record as unknown as CsLabUpdateProtocolInput),
        labId: asString(record.labId, '实验室标识'),
        uri: asString(record.uri, '规程 URI'),
        title: asString(record.title, '规程标题'),
      }
      return updateProtocol(payload)
    },
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.RUN_LIST, async (_event, input: unknown) => {
    const record = asObject(input, '批次查询参数')
    return listRuns(
      asString(record.labId, '实验室标识'),
      typeof record.protocolUri === 'string' && record.protocolUri.trim()
        ? record.protocolUri
        : undefined,
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.RUN_CREATE, async (_event, input: unknown) => {
    const record = asObject(input, '批次参数')
    const labId = asString(record.labId, '实验室标识')
    const run = await createRun({
      ...(record as unknown as CsLabCreateRunInput),
      labId,
      title: typeof record.title === 'string' ? record.title : '',
    })
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ASSET_CHANGED, {
      labId,
      uri: run.uri,
      kind: 'created',
      revision: 0,
    })
    return run
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.RUN_UPDATE, async (_event, input: unknown) => {
    const record = asObject(input, '批次参数')
    const labId = asString(record.labId, '实验室标识')
    const run = await updateRun({
      ...(record as unknown as CsLabUpdateRunInput),
      labId,
      uri: asString(record.uri, '批次 URI'),
    })
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ASSET_CHANGED, {
      labId,
      uri: run.uri,
      kind: 'updated',
      revision: 0,
    })
    return run
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.RUN_LINK_ASSET, async (_event, input: unknown) => {
    const record = asObject(input, '批次关联参数')
    if (record.relation !== 'consumes' && record.relation !== 'produces') {
      throw new Error('关联关系无效')
    }
    const labId = asString(record.labId, '实验室标识')
    const run = await linkRunAsset({
      labId,
      runUri: asString(record.runUri, '批次 URI'),
      assetUri: asString(record.assetUri, '资产 URI'),
      relation: record.relation,
    } satisfies CsLabRunLinkInput)
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ASSET_CHANGED, {
      labId,
      uri: run.uri,
      kind: 'updated',
      revision: 0,
    })
    return run
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.RUN_UNLINK_ASSET, async (_event, input: unknown) => {
    const record = asObject(input, '批次关联参数')
    if (record.relation !== 'consumes' && record.relation !== 'produces') {
      throw new Error('关联关系无效')
    }
    const labId = asString(record.labId, '实验室标识')
    const run = await unlinkRunAsset({
      labId,
      runUri: asString(record.runUri, '批次 URI'),
      assetUri: asString(record.assetUri, '资产 URI'),
      relation: record.relation,
    } satisfies CsLabRunLinkInput)
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_ASSET_CHANGED, {
      labId,
      uri: run.uri,
      kind: 'updated',
      revision: 0,
    })
    return run
  })

  // ===== Vault 笔记与 JSON Canvas =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.VAULT_LIST_NOTES, async (_event, labId: unknown) =>
    listVaultNotes(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.VAULT_READ_NOTE, async (_event, input: unknown) => {
    const record = asObject(input, '笔记读取参数')
    return readVaultNote(
      asString(record.labId, '实验室标识'),
      asString(record.relPath, '笔记路径'),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.VAULT_SEARCH, async (_event, input: unknown) => {
    const record = asObject(input, '笔记检索参数')
    return searchVaultNotes(
      asString(record.labId, '实验室标识'),
      asString(record.query, '检索关键词'),
      typeof record.limit === 'number' ? record.limit : undefined,
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.VAULT_BACKLINKS, async (_event, input: unknown) => {
    const record = asObject(input, '反向链接参数')
    return getNoteBacklinks(
      asString(record.labId, '实验室标识'),
      asString(record.relPath, '笔记路径'),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.VAULT_INDEX_STATUS, async (_event, labId: unknown) =>
    getVaultIndexStatus(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.VAULT_REBUILD_INDEX, async (_event, input: unknown) => {
    const record = asObject(input, '索引重建参数')
    const labId = asString(record.labId, '实验室标识')
    const result = await rebuildVaultIndex(labId, { force: record.force === true })
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_VAULT_CHANGED, {
      labId,
      relPaths: [],
      kind: 'updated',
    })
    return result
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.VAULT_START_WATCH, async (_event, labId: unknown) => {
    const normalizedLabId = asString(labId, '实验室标识')
    return startVaultWatcher(normalizedLabId, (event) => {
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_VAULT_CHANGED, event)
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.VAULT_STOP_WATCH, async (_event, labId: unknown) =>
    stopVaultWatcher(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.CANVAS_LIST, async (_event, labId: unknown) =>
    listCanvases(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.CANVAS_CREATE, async (_event, input: unknown) => {
    const record = asObject(input, '画布创建参数')
    const labId = asString(record.labId, '实验室标识')
    const created = await createCanvas(
      labId,
      typeof record.title === 'string' ? record.title : '未命名画布',
    )
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_VAULT_CHANGED, {
      labId,
      relPaths: [created.relPath],
      kind: 'created',
    })
    return created
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.CANVAS_READ, async (_event, input: unknown) => {
    const record = asObject(input, '画布读取参数')
    return readCanvas(
      asString(record.labId, '实验室标识'),
      asString(record.relPath, '画布路径'),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.CANVAS_WRITE, async (_event, input: unknown) => {
    const record = asObject(input, '画布写入参数')
    const labId = asString(record.labId, '实验室标识')
    const relPath = asString(record.relPath, '画布路径')
    const document = asObject(record.document, '画布文档') as unknown as CsLabCanvasWriteInput['document']
    if (!Array.isArray(document.nodes) || !Array.isArray(document.edges)) {
      throw new Error('画布文档必须包含 nodes 与 edges 数组')
    }
    const result = await writeCanvas({
      labId,
      relPath,
      document,
      expectedMtimeMs:
        typeof record.expectedMtimeMs === 'number' ? record.expectedMtimeMs : undefined,
    })
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_VAULT_CHANGED, {
      labId,
      relPaths: result.conflictRelPath ? [result.relPath, result.conflictRelPath] : [result.relPath],
      kind: 'updated',
    })
    if (result.cancelledJobIds.length > 0) {
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_DAG_JOBS_CANCELLED, {
        labId,
        canvasRelPath: result.relPath,
        jobIds: result.cancelledJobIds,
      })
      // 死路剪枝联动：尽力取消对应远程作业，失败不影响画布保存。
      void cancelHpcJobsByKeys(labId, result.cancelledJobIds, createHpcSink())
    }
    return result
  })

  // ===== 自定义科研工具与 uv =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.CUSTOM_TOOL_LIST, async (_event, labId: unknown) =>
    getLabToolScan(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.CUSTOM_TOOL_REFRESH, async (_event, labId: unknown) => {
    const normalizedLabId = asString(labId, '实验室标识')
    const scan = await scanLabTools(normalizedLabId)
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_TOOLS_CHANGED, {
      labId: normalizedLabId,
      scan,
    })
    return scan
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.CUSTOM_TOOL_RUN, async (_event, input: unknown) => {
    const record = asObject(input, '工具执行参数')
    const args = record.args === undefined ? {} : asObject(record.args, '工具参数')
    const payload: CsLabCustomToolRunInput = {
      labId: asString(record.labId, '实验室标识'),
      name: asString(record.name, '工具名称'),
      args,
    }
    return runLabTool(payload, { source: 'ipc' })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_TOOL_TRUST, async (_event, sessionId: unknown) => {
    const normalizedSessionId = asString(sessionId, '会话标识')
    const meta = getAgentSessionMeta(normalizedSessionId)
    if (!meta?.cslabLabId) return false
    return isCsLabToolTrusted(normalizedSessionId, meta.cslabLabId)
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.CUSTOM_TOOL_START_WATCH, async (_event, labId: unknown) => {
    const normalizedLabId = asString(labId, '实验室标识')
    return startLabToolWatcher(normalizedLabId, (scan) => {
      broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_TOOLS_CHANGED, {
        labId: normalizedLabId,
        scan,
      })
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.CUSTOM_TOOL_STOP_WATCH, async (_event, labId: unknown) =>
    stopLabToolWatcher(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.ENSURE_UV, async (_event, labId: unknown) =>
    ensureUvForLab(asString(labId, '实验室标识'), {
      confirmUntrustedInstall: confirmUvUntrustedInstall,
    }),
  )

  // ===== 局域网仪器共享盘 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.SHARE_LIST_SOURCES, async (_event, labId: unknown) =>
    listShareSources(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.SHARE_ADD_SOURCE, async (_event, input: unknown) => {
    const record = asObject(input, '共享盘参数')
    return addShareSource({
      labId: asString(record.labId, '实验室标识'),
      label: typeof record.label === 'string' ? record.label : '仪器共享盘',
      rootPath: asString(record.rootPath, '共享路径'),
      include: Array.isArray(record.include)
        ? record.include.filter((item): item is string => typeof item === 'string')
        : undefined,
      quietSeconds:
        typeof record.quietSeconds === 'number' ? record.quietSeconds : undefined,
      pollSeconds:
        typeof record.pollSeconds === 'number' ? record.pollSeconds : undefined,
      username: typeof record.username === 'string' ? record.username : undefined,
      password: typeof record.password === 'string' ? record.password : undefined,
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SHARE_REMOVE_SOURCE, async (_event, input: unknown) => {
    const record = asObject(input, '共享盘参数')
    await removeShareSource(
      asString(record.labId, '实验室标识'),
      asString(record.sourceId, '共享源标识'),
    )
    return { ok: true }
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SHARE_TEST_SOURCE, async (_event, input: unknown) => {
    const record = asObject(input, '共享盘参数')
    return testShareSource(
      asString(record.labId, '实验室标识'),
      asString(record.sourceId, '共享源标识'),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SHARE_SCAN_NOW, async (_event, input: unknown) => {
    const record = asObject(input, '共享盘参数')
    return scanShareNow(
      asString(record.labId, '实验室标识'),
      typeof record.sourceId === 'string' ? record.sourceId : undefined,
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SHARE_START_WATCH, async (_event, labId: unknown) =>
    startShareWatcher(asString(labId, '实验室标识'), undefined, createShareSink()),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.SHARE_STOP_WATCH, async (_event, input: unknown) => {
    const record = asObject(input, '共享盘参数')
    return stopShareWatcher(
      asString(record.labId, '实验室标识'),
      typeof record.sourceId === 'string' ? record.sourceId : undefined,
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SHARE_LIST_CANDIDATES, async (_event, input: unknown) => {
    const record = asObject(input, '共享盘参数')
    return listShareCandidates(
      asString(record.labId, '实验室标识'),
      typeof record.sourceId === 'string' ? record.sourceId : undefined,
    )
  })

  // ===== 远程学术算力网关 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_LIST_PROFILES, async (_event, labId: unknown) =>
    listHpcProfiles(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_SAVE_PROFILE, async (_event, input: unknown) => {
    const record = asObject(input, '集群档案参数')
    const scheduler = record.scheduler
    if (scheduler !== 'slurm' && scheduler !== 'pbs' && scheduler !== 'lsf') {
      throw new Error('调度器类型无效')
    }
    const bastionInput = record.bastion
    const bastion =
      bastionInput && typeof bastionInput === 'object'
        ? (() => {
            const raw = bastionInput as Record<string, unknown>
            return {
              host: asString(raw.host, '堡垒机地址'),
              port: typeof raw.port === 'number' ? raw.port : undefined,
              username: asString(raw.username, '堡垒机用户名'),
              privateKeyPath:
                typeof raw.privateKeyPath === 'string' ? raw.privateKeyPath : undefined,
              passphrase: typeof raw.passphrase === 'string' ? raw.passphrase : undefined,
            }
          })()
        : undefined

    return saveHpcProfile({
      labId: asString(record.labId, '实验室标识'),
      id: typeof record.id === 'string' ? record.id : undefined,
      name: asString(record.name, '档案名称'),
      host: asString(record.host, '集群主机'),
      port: typeof record.port === 'number' ? record.port : undefined,
      username: asString(record.username, '登录用户名'),
      scheduler,
      remoteWorkDir: asString(record.remoteWorkDir, '远端工作目录'),
      privateKeyPath:
        typeof record.privateKeyPath === 'string' ? record.privateKeyPath : undefined,
      passphrase: typeof record.passphrase === 'string' ? record.passphrase : undefined,
      bastion,
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_DELETE_PROFILE, async (_event, input: unknown) => {
    const record = asObject(input, '集群档案参数')
    deleteHpcProfile(
      asString(record.labId, '实验室标识'),
      asString(record.profileId, '档案标识'),
    )
    return { ok: true }
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_TEST_CONNECTION, async (_event, input: unknown) => {
    const record = asObject(input, '集群连接参数')
    return testHpcConnection(
      asString(record.labId, '实验室标识'),
      asString(record.profileId, '档案标识'),
      createHpcSink(),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_SUBMIT_JOB, async (_event, input: unknown) => {
    const record = asObject(input, '作业提交参数')
    const inputs = Array.isArray(record.inputs)
      ? record.inputs
          .filter(
            (item): item is { name: string; text: string } =>
              !!item &&
              typeof item === 'object' &&
              typeof (item as { name?: unknown }).name === 'string' &&
              typeof (item as { text?: unknown }).text === 'string',
          )
          .slice(0, 32)
      : undefined

    return submitHpcJob(
      {
        labId: asString(record.labId, '实验室标识'),
        profileId: asString(record.profileId, '档案标识'),
        jobKey: typeof record.jobKey === 'string' ? record.jobKey : undefined,
        jobName: asString(record.jobName, '作业名称'),
        nodes: asNumber(record.nodes, '节点数'),
        coresPerNode: asNumber(record.coresPerNode, '每节点核数'),
        walltimeHours: asNumber(record.walltimeHours, '运行时长'),
        memoryGb: typeof record.memoryGb === 'number' ? record.memoryGb : undefined,
        gpus: typeof record.gpus === 'number' ? record.gpus : undefined,
        gpuType: typeof record.gpuType === 'string' ? record.gpuType : undefined,
        queue: typeof record.queue === 'string' ? record.queue : undefined,
        command: asString(record.command, '作业命令'),
        inputs,
      },
      createHpcSink(),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_LIST_JOBS, async (_event, labId: unknown) =>
    listHpcJobs(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_CANCEL_JOB, async (_event, input: unknown) => {
    const record = asObject(input, '作业参数')
    return cancelHpcJob(
      asString(record.labId, '实验室标识'),
      asString(record.key, '作业键'),
      createHpcSink(),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_REFRESH_JOB, async (_event, input: unknown) => {
    const record = asObject(input, '作业参数')
    return refreshHpcJob(
      asString(record.labId, '实验室标识'),
      asString(record.key, '作业键'),
      createHpcSink(),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_HARVEST_JOB, async (_event, input: unknown) => {
    const record = asObject(input, '作业参数')
    return harvestHpcJob(
      asString(record.labId, '实验室标识'),
      asString(record.key, '作业键'),
      createHpcSink(),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_REHYDRATE, async (_event, labId: unknown) =>
    rehydrateHpcJobs(asString(labId, '实验室标识'), createHpcSink()),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.HPC_ANSWER_MFA, async (_event, input: unknown) => {
    const record = asObject(input, 'MFA 参数')
    const requestId = asString(record.requestId, 'MFA 请求标识')
    const value = asString(record.value, '验证码')
    return { ok: answerHpcMfa(requestId, value) }
  })

  // ===== 晶体结构与谱图 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_MOL_ASSET, async (_event, input: unknown) => {
    const record = asObject(input, '结构资产参数')
    return getMolAsset(
      asString(record.labId, '实验室标识'),
      asString(record.uri, '结构资产 URI'),
    )
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_TABLE_SERIES, async (_event, input: unknown) => {
    const record = asObject(input, '数据表参数')
    return getTableSeries(
      asString(record.labId, '实验室标识'),
      asString(record.tableUri, '数据表 URI'),
      typeof record.maxPoints === 'number' ? record.maxPoints : undefined,
    )
  })

  // ===== 科学引擎：晶体分析 / PXRD / 拟合 / 出版绘图 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.ANALYZE_CRYSTAL, async (_event, input: unknown) => {
    const record = asObject(input, '晶体分析参数')
    return analyzeCrystalAsset({
      labId: asString(record.labId, '实验室标识'),
      uri: asString(record.uri, '结构资产 URI'),
      tolerance: typeof record.tolerance === 'number' ? record.tolerance : undefined,
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SIMULATE_PXRD, async (_event, input: unknown) => {
    const record = asObject(input, 'PXRD 参数')
    return simulatePxrdAsset({
      labId: asString(record.labId, '实验室标识'),
      uri: asString(record.uri, '结构资产 URI'),
      options: (record.options ?? {}) as CsLabPxrdOptions,
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.FIT_PEAKS, async (_event, input: unknown) =>
    fitPeaksService(input as CsLabFitRequest),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.SMOOTH_SERIES, async (_event, input: unknown) =>
    smoothSeriesService(input as CsLabSmoothRequest),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_VOLUME_GRID, async (_event, input: unknown) => {
    const record = asObject(input, '体数据参数')
    return getVolumeGrid({
      labId: asString(record.labId, '实验室标识'),
      uri: asString(record.uri, '体数据资产 URI'),
      maxDimension: typeof record.maxDimension === 'number' ? record.maxDimension : undefined,
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SAVE_PLOT, async (_event, input: unknown) => {
    const record = asObject(input, '绘图保存参数')
    return savePlot({
      labId: asString(record.labId, '实验室标识'),
      plot: record.plot as CsLabPlotDocument,
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.LIST_PLOTS, async (_event, labId: unknown) =>
    listPlots(asString(labId, '实验室标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.LOAD_PLOT, async (_event, input: unknown) => {
    const record = asObject(input, '绘图读取参数')
    return loadPlot({
      labId: asString(record.labId, '实验室标识'),
      plotId: asString(record.plotId, '绘图标识'),
    })
  })

  ipcMain.handle(
    CSLAB_IPC_CHANNELS.EXPORT_FIGURE,
    async (event, input: unknown): Promise<CsLabPlotExportResult> => {
      const record = asObject(input, '绘图导出参数')
      const labId = asString(record.labId, '实验室标识')
      const plot = record.plot as CsLabPlotDocument
      const options = record.options as CsLabPlotExportOptions
      if (!plot || !options) throw new Error('绘图导出参数不完整')
      if (!['svg', 'pdf', 'png', 'tiff'].includes(options.format)) throw new Error('导出格式无效')

      const extension = options.format
      const win = BrowserWindow.fromWebContents(event.sender)
      const result = await dialog.showSaveDialog(win || (undefined as never), {
        title: '导出出版级图',
        defaultPath: options.fileName ?? `${plot.id}.${extension}`,
        filters: [
          { name: `${options.format.toUpperCase()} 图像`, extensions: [extension] },
        ],
      })
      if (result.canceled || !result.filePath) {
        throw new Error('已取消导出')
      }
      return exportFigure({ labId, plot, options, targetPath: result.filePath })
    },
  )

  // ===== 学术审稿 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.REVIEW_SUGGEST, async (_event, input: unknown) => {
    const record = asObject(input, '审稿参数')
    const persona = record.persona
    if (
      persona !== 'Methodology_Reviewer' &&
      persona !== 'Data_Analyst' &&
      persona !== 'Literature_Expert' &&
      persona !== 'Grammar_Check' &&
      persona !== 'human'
    ) {
      throw new Error('审稿人设无效')
    }
    return reviewManuscript({
      labId: asString(record.labId, '实验室标识'),
      manuscriptUri: asString(record.manuscriptUri, '文稿 URI'),
      persona,
      text: typeof record.text === 'string' ? record.text : '',
    })
  })

  // ===== 会话级实验室绑定 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.BIND_SESSION_LAB, async (_event, input: unknown) => {
    const record = asObject(input, '会话绑定参数')
    const sessionId = asString(record.sessionId, '会话标识')
    const labId = asString(record.labId, '实验室标识')
    if (!getLab(labId)) throw new Error('实验室不存在')
    updateAgentSessionMeta(sessionId, { cslabLabId: labId })
    return {
      sessionId,
      labId,
      message: '已绑定实验室；重新发送消息后注入科研工具',
    } satisfies CsLabSessionLabBinding
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.UNBIND_SESSION_LAB, async (_event, input: unknown) => {
    const record = asObject(input, '会话绑定参数')
    const sessionId = asString(record.sessionId, '会话标识')
    updateAgentSessionMeta(sessionId, { cslabLabId: undefined })
    return {
      sessionId,
      labId: null,
      message: '已解除实验室绑定',
    } satisfies CsLabSessionLabBinding
  })

  // ===== 科学助理独立窗口 =====
  ipcMain.handle(CSLAB_IPC_CHANNELS.OPEN_AGENT_WINDOW, async (_event, input: unknown) => {
    const record = asObject(input, '助理窗口参数')
    const context = record.context ? asAgentContext(record.context) : undefined
    return openCsLabAgentWindow({
      labId: asString(record.labId, '实验室标识'),
      focusSessionId: typeof record.focusSessionId === 'string' && record.focusSessionId.trim()
        ? record.focusSessionId
        : undefined,
      context,
    })
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.SEND_TO_AGENT_WINDOW, async (_event, input: unknown) => {
    const context = asAgentContext(input)
    if (!getLab(context.labId)) throw new Error('实验室不存在')
    return sendCsLabAgentContext(context)
  })

  ipcMain.handle(CSLAB_IPC_CHANNELS.GET_AGENT_WINDOW_CONTEXT, async (_event, windowId: unknown) =>
    getCsLabAgentWindowContext(asString(windowId, '窗口标识')),
  )

  ipcMain.handle(CSLAB_IPC_CHANNELS.UNDO_PLOT_UPDATE, async (_event, input: unknown) => {
    const record = asObject(input, '绘图撤销参数')
    const labId = asString(record.labId, '实验室标识')
    const plotId = asString(record.plotId, '绘图标识')
    const plot = await restorePlotUndoSnapshot({
      labId,
      plotId,
      undoToken: asString(record.undoToken, '撤销令牌'),
    })
    if (!plot) throw new Error('撤销快照不存在或已过期')
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_PLOT_UPDATED, { labId, plot, source: 'user' })
    return { labId, plotId, plot } satisfies CsLabPlotUndoResult
  })
}

/** 校验并规范化助理上下文，避免渲染层透传任意对象。 */
function asAgentContext(value: unknown): CsLabAgentContext {
  const record = asObject(value, '助理上下文参数')
  const source = record.source
  if (source !== 'plot-roi' && source !== 'asset' && source !== 'manual') {
    throw new Error('助理上下文来源无效')
  }
  const roi = record.roi && typeof record.roi === 'object'
    ? (record.roi as Record<string, unknown>)
    : null
  return {
    labId: asString(record.labId, '实验室标识'),
    source,
    prompt: asString(record.prompt, '提示词'),
    assetUri: typeof record.assetUri === 'string' ? record.assetUri : undefined,
    plotId: typeof record.plotId === 'string' ? record.plotId : undefined,
    plotTitle: typeof record.plotTitle === 'string' ? record.plotTitle : undefined,
    roi: roi
      ? {
          xMin: asNumber(roi.xMin, 'ROI 起点'),
          xMax: asNumber(roi.xMax, 'ROI 终点'),
          yMin: typeof roi.yMin === 'number' ? roi.yMin : undefined,
          yMax: typeof roi.yMax === 'number' ? roi.yMax : undefined,
        }
      : undefined,
    createdAt: typeof record.createdAt === 'number' ? record.createdAt : Date.now(),
  }
}

function asProfile(value: unknown): CsLabToolProfile {
  if (value === 'plot' || value === 'formula' || value === 'formula-ocr' || value === 'instrument') {
    return value
  }
  throw new Error('依赖 profile 无效')
}
