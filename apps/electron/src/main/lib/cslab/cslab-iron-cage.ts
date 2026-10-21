/**
 * CSLab 数据铁笼与多格式逆向摄取流水线
 *
 * 流程：复制并渐进哈希 -> 上只读锁 -> 魔数嗅探 -> 归一化二维矩阵
 *      -> ZSTD Parquet + 首屏预览 -> 实体/血缘落库 -> 广播事件。
 *
 * 红线：解析失败只登记 raw 资产并明确标注 unsupported，绝不生成伪造数据。
 */

import { promises as fs } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import JSZip from 'jszip'
import type {
  CsLabAssetSummary,
  CsLabCellValue,
  CsLabColumn,
  CsLabIngestProgress,
  CsLabIngestResult,
  CsLabLayerType,
  CsLabTableExportFormat,
  CsLabTableExportResult,
  CsLabTablePayload,
} from '@profer/shared'
import {
  copyFileWithHash,
  hashFileStream,
  isFileReadOnly,
  lockFileReadOnly,
  unlockFile,
} from './cslab-hash'
import {
  getCsLabDatabase,
  getEntityByUri,
  getTable,
  insertEdge,
  findEntityBySha,
  findEntityByShaAndLayer,
  findEntityByTitle,
  listEdgesFrom,
  listEntities,
  nextLabRevision,
  upsertEntity,
  upsertLiteratureSource,
  upsertTable,
  withTransaction,
  type CsLabDatabase,
  type CsLabEntityRecord,
} from './cslab-db'
import {
  resolveLabDir,
  resolveLabRelativePath,
  sanitizeFileName,
  assertLabId,
} from './cslab-paths'
import { buildCsLabUri, parseCsLabUri } from './cslab-uri'
import { readDatasetCell, readDatasetPreview, writeDatasetCsvStream, writeDatasetParquet, writeDatasetPreview } from './cslab-columnar'
import { parseDelimitedText } from './cslab-formats/header-data-separator'
import { parseMatLevel5, isMatV73, isMatLevel5 } from './cslab-formats/mat-level5'
import { parseSpc } from './cslab-formats/spc'
import { parseJcampDx } from './cslab-formats/jcamp'
import { parseBrukerBrmlXml, parseBrukerRaw, parseRigakuRas, parseXrdXml } from './cslab-formats/xrd'
import { sniffFormat } from './cslab-formats/sniff'
import { CsLabUnsupportedFormatError, type ParsedDataset } from './cslab-formats/types'
import { tryParseWithPython } from './cslab-python'
import { getMolFormat, getVolumeFormat, ingestMolAsset } from './cslab-mol'

const MAX_FILE_BYTES = 512 * 1024 * 1024

export interface CsLabEventSink {
  ingestProgress?: (progress: CsLabIngestProgress) => void
  assetChanged?: (labId: string, uri: string, revision: number) => void
}

function labDb(labId: string): CsLabDatabase {
  return getCsLabDatabase(join(resolveLabDir(labId), 'db', 'central_meta.sqlite'))
}

function toAssetSummary(entity: CsLabEntityRecord): CsLabAssetSummary {
  return {
    uri: entity.uri,
    labId: entity.labId,
    layerType: entity.layerType,
    entityUuid: entity.entityUuid,
    title: entity.title,
    format: entity.format,
    relPath: entity.relPath,
    sha256: entity.sha256,
    bytes: entity.bytes,
    revision: entity.revision,
    locked: entity.locked,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    unsupported: entity.unsupported,
  }
}

function decodeText(buffer: Buffer): string {
  const utf8 = buffer.toString('utf-8')
  const replacementCount = (utf8.match(/\uFFFD/g) ?? []).length
  return replacementCount > 2 ? buffer.toString('latin1') : utf8
}

async function parseBrml(buffer: Buffer): Promise<ParsedDataset> {
  const zip = await JSZip.loadAsync(buffer)
  const xmlEntries = Object.values(zip.files)
    .filter((entry) => !entry.dir && /\.xml$/i.test(entry.name))
    .sort((a, b) => {
      const score = (name: string): number =>
        (/rawdata/i.test(name) ? 3 : 0) + (/experiment/i.test(name) ? 2 : 0)
      return score(b.name) - score(a.name)
    })

  let lastError: unknown
  for (const entry of xmlEntries) {
    try {
      const xml = await entry.async('string')
      return parseBrukerBrmlXml(xml)
    } catch (error) {
      lastError = error
    }
  }
  throw new CsLabUnsupportedFormatError(
    `brml 内未找到可解析的扫描 XML${lastError instanceof Error ? `：${lastError.message}` : ''}`,
  )
}

async function parseFile(
  filePath: string,
  head: Buffer,
  format: ReturnType<typeof sniffFormat>['format'],
  extension: string,
): Promise<{ dataset: ParsedDataset; note?: string }> {
  switch (format) {
    case 'mat-level5': {
      return { dataset: parseMatLevel5(await fs.readFile(filePath)) }
    }
    case 'mat-v73': {
      const enhanced = await tryParseWithPython(filePath, 'mat-v73')
      if (enhanced) return { dataset: enhanced, note: '已通过可选 Python 通道解析 MAT v7.3' }
      throw new CsLabUnsupportedFormatError(
        'MATLAB v7.3（HDF5）需要可选 Python(h5py) 增强通道；当前仅登记原始文件元数据',
      )
    }
    case 'thermo-spc':
      return { dataset: parseSpc(await fs.readFile(filePath)) }
    case 'bruker-raw':
      return { dataset: parseBrukerRaw(await fs.readFile(filePath)) }
    case 'rigaku-ras':
      return { dataset: parseRigakuRas(decodeText(await fs.readFile(filePath))) }
    case 'xrdml':
      return {
        dataset: parseXrdXml(decodeText(await fs.readFile(filePath)), 'xrdml'),
      }
    case 'bruker-brml':
      return { dataset: await parseBrml(await fs.readFile(filePath)) }
    case 'jcamp-dx':
      return { dataset: parseJcampDx(decodeText(await fs.readFile(filePath))) }
    case 'biologic-mpr': {
      const enhanced = await tryParseWithPython(filePath, 'biologic-mpr')
      if (enhanced) return { dataset: enhanced, note: '已通过可选 Python 通道解析 BioLogic .mpr' }
      throw new CsLabUnsupportedFormatError(
        'BioLogic .mpr 需要可选 Python(yadg/eclabfiles) 增强通道；当前仅登记原始文件元数据',
      )
    }
    case 'biologic-mpt':
    case 'text-table':
      return {
        dataset: parseDelimitedText(
          decodeText(await fs.readFile(filePath)),
          extension.replace('.', '') || 'text',
        ).dataset,
      }
    default: {
      if (isMatV73(head)) {
        const enhanced = await tryParseWithPython(filePath, 'mat-v73')
        if (enhanced) return { dataset: enhanced }
      }
      if (isMatLevel5(head)) return { dataset: parseMatLevel5(await fs.readFile(filePath)) }
      throw new CsLabUnsupportedFormatError(
        `暂不支持的文件格式${extension ? `（${extension}）` : ''}；已登记原始文件，未生成数据表`,
      )
    }
  }
}

function findTableUriFromRaw(db: CsLabDatabase, rawUri: string, rawTitle: string): string | undefined {
  const tableEdge = listEdgesFrom(db, rawUri).find((edge) => edge.toUri.includes('/table/'))
  if (tableEdge) return tableEdge.toUri
  // 兼容早期版本未记录血缘的沙箱：按同名数据表兜底；URI 一律走标准解析，不使用魔法下标。
  const parsed = parseCsLabUri(rawUri)
  if (!parsed) return undefined
  return findEntityByTitle(db, parsed.labId, `${rawTitle} · 数据表`, 'table')?.uri
}

export interface IngestOptions {
  onProgress?: (progress: CsLabIngestProgress) => void
}

/**
 * 摄取一个或多个仪器文件；逐个返回结果，单个失败不影响其余文件。
 */
export async function ingestFiles(
  labIdInput: string,
  paths: string[],
  options: IngestOptions = {},
): Promise<CsLabIngestResult[]> {
  const labId = assertLabId(labIdInput)
  const db = labDb(labId)
  const results: CsLabIngestResult[] = []
  const total = paths.length

  for (let index = 0; index < total; index += 1) {
    const sourcePath = paths[index]
    if (!sourcePath) continue
    const fileName = basename(sourcePath)
    const emit = (stage: CsLabIngestProgress['stage'], message?: string): void => {
      options.onProgress?.({
        labId,
        fileName,
        stage,
        index: index + 1,
        total,
        message,
      })
    }

    try {
      const stat = await fs.stat(sourcePath)
      if (!stat.isFile()) throw new Error('目标不是文件')
      if (stat.size > MAX_FILE_BYTES) throw new Error('文件超过 512MB 上限')

      // 秒级时间戳 + 随机后缀：同一文件连续导入也不会覆盖已只读锁定的暂存副本。
      const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
      const nonce = randomUUID().slice(0, 6)
      const safeName = sanitizeFileName(fileName)
      const extension = extname(fileName).toLowerCase()

      // PDF 直接作为文献入笼（vault/lit），不进入仪器数据解析流水线。
      if (extension === '.pdf') {
        emit('copy')
        const litRelPath = `vault/lit/${timestamp}-${nonce}-${safeName}`
        const litAbsPath = resolveLabRelativePath(labId, litRelPath)
        const litDigest = await copyFileWithHash(sourcePath, litAbsPath)

        emit('hash')
        const existingLit = findEntityByShaAndLayer(db, labId, litDigest.sha256, 'lit')
        if (existingLit) {
          await unlockFile(litAbsPath).catch(() => undefined)
          await fs.rm(litAbsPath, { force: true })
          emit('done', '检测到相同 SHA-256，复用既有文献资产')
          results.push({
            asset: toAssetSummary(existingLit),
            status: 'ok',
            message: '相同 PDF 已存在，已复用既有文献资产',
          })
          continue
        }

        const litLocked = await lockFileReadOnly(litAbsPath)
        const createdAt = Date.now()
        const litUuid = `lit-${randomUUID().slice(0, 8)}`
        const litUri = buildCsLabUri(labId, 'lit', litUuid)

        withTransaction(db, () => {
          const nextRevision = nextLabRevision(db)
          const entity: CsLabEntityRecord = {
            uri: litUri,
            labId,
            layerType: 'lit',
            entityUuid: litUuid,
            title: fileName,
            format: 'pdf',
            relPath: litRelPath,
            sha256: litDigest.sha256,
            bytes: litDigest.bytes,
            revision: nextRevision,
            locked: litLocked,
            createdAt,
            updatedAt: createdAt,
          }
          upsertEntity(db, entity)
          upsertLiteratureSource(db, {
            uri: litUri,
            labId,
            source: 'vault',
            relPath: litRelPath,
            metadataJson: JSON.stringify({ authors: [], collections: [] }),
            sha256: litDigest.sha256,
            updatedAt: createdAt,
          })
          return nextRevision
        })

        emit('done', 'PDF 已只读入笼为文献')
        const litEntity = getEntityByUri(db, litUri)
        if (!litEntity) throw new Error('文献实体写入失败')
        results.push({
          asset: toAssetSummary(litEntity),
          status: 'ok',
          message: 'PDF 已作为文献只读入笼',
        })
        continue
      }

      // 分子/晶体结构或体数据：只读入笼为 mol 资产，不进入仪器数据解析流水线。
      if (getMolFormat(fileName) || getVolumeFormat(fileName)) {
        emit('copy')
        const molResult = await ingestMolAsset(labId, sourcePath)
        emit('done', molResult.message)
        results.push(molResult)
        continue
      }

      emit('copy')
      const rawRelPath = `vault/raw/${timestamp}-${nonce}-${safeName}`
      const rawAbsPath = resolveLabRelativePath(labId, rawRelPath)
      const digest = await copyFileWithHash(sourcePath, rawAbsPath)

      emit('hash')
      const existing = findEntityBySha(db, labId, digest.sha256)
      if (existing) {
        await unlockFile(rawAbsPath).catch(() => undefined)
        await fs.rm(rawAbsPath, { force: true })
        const tableUri = findTableUriFromRaw(db, existing.uri, existing.title)
        emit('done', '检测到相同 SHA-256，复用既有资产')
        results.push({
          asset: toAssetSummary(existing),
          tableUri,
          status: existing.unsupported ? 'unsupported' : 'ok',
          message: existing.unsupported ?? '相同文件已存在，已复用既有数据资产',
        })
        continue
      }

      const locked = await lockFileReadOnly(rawAbsPath)
      const createdAt = Date.now()
      const rawUuid = `raw-${randomUUID().slice(0, 8)}`
      const rawUri = buildCsLabUri(labId, 'raw', rawUuid)

      emit('parse')
      const handle = await fs.open(rawAbsPath, 'r')
      let head: Buffer
      try {
        const buffer = Buffer.alloc(128)
        const { bytesRead } = await handle.read(buffer, 0, 128, 0)
        head = buffer.subarray(0, bytesRead)
      } finally {
        await handle.close()
      }

      const sniffed = sniffFormat(fileName, head)

      let dataset: ParsedDataset | null = null
      let unsupported: string | undefined
      try {
        const parsed = await parseFile(rawAbsPath, head, sniffed.format, extension)
        dataset = parsed.dataset
      } catch (error) {
        if (error instanceof CsLabUnsupportedFormatError) {
          unsupported = error.message
        } else {
          throw error
        }
      }

      let tableUri: string | undefined
      let tableRelPath: string | undefined
      let previewRelPath: string | undefined
      let rowCount = 0
      let columnsJson = '[]'

      if (dataset) {
        emit('write')
        // 同名数据表沿用既有 URI：重复导出 / 修正数据时推进 revision，
        // 从而触发已绑定胶囊的 stale 呼吸灯（而不是制造一张孤立新表）。
        const existingTable = findEntityByTitle(db, labId, `${fileName} · 数据表`, 'table')
        const tableUuid = existingTable?.entityUuid ?? `table-${randomUUID().slice(0, 8)}`
        tableUri = existingTable?.uri ?? buildCsLabUri(labId, 'table', tableUuid)
        tableRelPath = `vault/tables/${tableUuid}.parquet`
        previewRelPath = `vault/tables/${tableUuid}.preview.json`
        rowCount = dataset.rowCount
        columnsJson = JSON.stringify(dataset.columns)

        await writeDatasetParquet(dataset, resolveLabRelativePath(labId, tableRelPath))
        await writeDatasetPreview(dataset, resolveLabRelativePath(labId, previewRelPath))
      }

      withTransaction(db, () => {
        const nextRevision = nextLabRevision(db)
        const rawEntity: CsLabEntityRecord = {
          uri: rawUri,
          labId,
          layerType: 'raw',
          entityUuid: rawUuid,
          title: fileName,
          format: sniffed.format,
          relPath: rawRelPath,
          sha256: digest.sha256,
          bytes: digest.bytes,
          revision: nextRevision,
          locked,
          unsupported,
          createdAt,
          updatedAt: createdAt,
        }
        upsertEntity(db, rawEntity)

        if (dataset && tableUri && tableRelPath && previewRelPath) {
          const tableEntity: CsLabEntityRecord = {
            uri: tableUri,
            labId,
            layerType: 'table',
            entityUuid: tableUri.split('/').pop() ?? tableUri,
            title: `${fileName} · 数据表`,
            format: dataset.format,
            relPath: tableRelPath,
            sha256: digest.sha256,
            bytes: digest.bytes,
            revision: nextRevision,
            locked: true,
            createdAt,
            updatedAt: createdAt,
          }
          upsertEntity(db, tableEntity)
          upsertTable(db, {
            uri: tableUri,
            parquetRelPath: tableRelPath,
            previewRelPath,
            columnsJson,
            rowCount,
            revision: nextRevision,
          })
          insertEdge(db, labId, rawUri, tableUri, 'derived_from', {
            format: dataset.format,
            rowCount,
            columns: dataset.columns.length,
          })
        }

        return nextRevision
      })

      options.onProgress?.({
        labId,
        fileName,
        stage: 'done',
        index: index + 1,
        total,
        message: unsupported,
      })

      const entity = getEntityByUri(db, rawUri)
      if (!entity) throw new Error('摄取后实体写入失败')

      results.push({
        asset: toAssetSummary(entity),
        tableUri,
        status: unsupported ? 'unsupported' : 'ok',
        message: unsupported,
      })
    } catch (error) {
      emit('error', error instanceof Error ? error.message : String(error))
      results.push({
        asset: {
          uri: '',
          labId,
          layerType: 'raw',
          entityUuid: '',
          title: fileName,
          revision: 0,
          locked: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return results
}

/** 列出实验室全部资产（按更新时间倒序）。 */
export function listAssets(
  labIdInput: string,
  options: { noteLimit?: number } = {},
): CsLabAssetSummary[] {
  const labId = assertLabId(labIdInput)
  const entities = listEntities(labDb(labId), labId)
  if (options.noteLimit === undefined) return entities.map(toAssetSummary)

  let noteCount = 0
  const limited: CsLabEntityRecord[] = []
  for (const entity of entities) {
    if (entity.layerType === 'note') {
      noteCount += 1
      if (noteCount > Math.max(0, options.noteLimit)) continue
    }
    limited.push(entity)
  }
  return limited.map(toAssetSummary)
}

/** 读取只读数据表（预览 + 元数据）。 */
export async function getAssetTable(
  labIdInput: string,
  tableUri: string,
): Promise<CsLabTablePayload | null> {
  const labId = assertLabId(labIdInput)
  const db = labDb(labId)
  const entity = getEntityByUri(db, tableUri)
  if (!entity || entity.labId !== labId || entity.layerType !== 'table') return null

  const table = getTable(db, tableUri)
  if (!table) return null

  const preview = await readDatasetPreview(resolveLabRelativePath(labId, table.previewRelPath))
  if (!preview) return null

  return {
    uri: tableUri,
    columns: preview.columns,
    rows: preview.rows,
    totalRows: preview.totalRows,
    totalCols: preview.totalCols,
    previewLimit: preview.previewLimit,
    generatedAt: preview.generatedAt,
    sha256: entity.sha256 ?? '',
    locked: entity.locked,
    format: entity.format,
    revision: table.revision,
  }
}

/** 读取单个单元格（胶囊更新链路）。 */
export async function getTableCell(
  labIdInput: string,
  tableUri: string,
  column: string,
  rowIndex: number,
): Promise<CsLabCellValue> {
  const labId = assertLabId(labIdInput)
  const db = labDb(labId)
  const table = getTable(db, tableUri)
  if (!table) return null
  const preview = await readDatasetPreview(resolveLabRelativePath(labId, table.previewRelPath))
  if (!preview) return null
  const columnIndex = preview.columns.findIndex((item) => item.key === column)
  if (columnIndex < 0) return null
  if (rowIndex < preview.rows.length) {
    return preview.rows[rowIndex]?.[columnIndex] ?? null
  }
  // 预览只保留首屏 500 行，超出部分回落到 Parquet 行区间直读。
  return readDatasetCell(
    resolveLabRelativePath(labId, table.parquetRelPath),
    column,
    rowIndex,
  )
}

/** 供胶囊血缘与测试使用的实体查询。 */
export function getAssetEntity(labIdInput: string, uri: string): CsLabEntityRecord | null {
  return getEntityByUri(labDb(assertLabId(labIdInput)), uri)
}

/**
 * 原始文件 -> 派生数据表 URI。
 *
 * 只沿已落库的 derived_from 血缘边与同名数据表兜底，不在渲染层猜 URI。
 * table 资产直接返回自身；无法解析的 raw 返回 null。
 */
export function resolveDerivedTableUri(labIdInput: string, uri: string): string | null {
  const labId = assertLabId(labIdInput)
  const db = labDb(labId)
  const entity = getEntityByUri(db, uri)
  if (!entity || entity.labId !== labId) return null
  if (entity.layerType === 'table') return entity.uri
  if (entity.layerType !== 'raw') return null
  return findTableUriFromRaw(db, entity.uri, entity.title) ?? null
}

function parseTableColumns(columnsJson: string): CsLabColumn[] {
  try {
    const parsed = JSON.parse(columnsJson) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CsLabColumn =>
        !!item && typeof item === 'object' && typeof (item as CsLabColumn).key === 'string',
    )
  } catch {
    return []
  }
}

/** 导出只读数据表：parquet 直接复制原件，csv 走 RowGroup 流式写出。 */
export async function exportAssetTableToFile(
  labIdInput: string,
  tableUri: string,
  format: CsLabTableExportFormat,
  targetPath: string,
): Promise<CsLabTableExportResult> {
  const labId = assertLabId(labIdInput)
  const db = labDb(labId)
  const entity = getEntityByUri(db, tableUri)
  if (!entity || entity.labId !== labId || entity.layerType !== 'table') {
    throw new Error('只允许导出本实验室的数据表资产')
  }
  const table = getTable(db, tableUri)
  if (!table) throw new Error('数据表记录不存在')

  const sourcePath = resolveLabRelativePath(labId, table.parquetRelPath)
  if (format === 'parquet') {
    await fs.copyFile(sourcePath, targetPath)
  } else if (format === 'csv') {
    const columns = parseTableColumns(table.columnsJson)
    if (columns.length === 0) throw new Error('数据表缺少列定义，无法导出 CSV')
    await writeDatasetCsvStream(sourcePath, columns, targetPath)
  } else {
    throw new Error('不支持的数据表导出格式')
  }

  return {
    success: true,
    path: targetPath,
    format,
    message: `已导出 ${entity.title}`,
  }
}

/** 校验文件是否仍保持只读（测试 / 巡检使用）。 */
export async function verifyAssetReadOnly(labIdInput: string, uri: string): Promise<boolean> {
  const labId = assertLabId(labIdInput)
  const entity = getEntityByUri(labDb(labId), uri)
  if (!entity?.relPath) return false
  return isFileReadOnly(resolveLabRelativePath(labId, entity.relPath))
}

/** 重新计算原始文件 SHA-256（完整性巡检）。 */
export async function verifyAssetDigest(labIdInput: string, uri: string): Promise<boolean> {
  const labId = assertLabId(labIdInput)
  const entity = getEntityByUri(labDb(labId), uri)
  if (!entity?.relPath || !entity.sha256) return false
  const digest = await hashFileStream(resolveLabRelativePath(labId, entity.relPath))
  return digest.sha256 === entity.sha256
}

/** 资产绝对路径（供主进程内部与测试使用）。 */
export function resolveAssetPath(labId: string, uri: string): string | null {
  const entity = getEntityByUri(labDb(assertLabId(labId)), uri)
  if (!entity?.relPath) return null
  return resolveLabRelativePath(labId, entity.relPath)
}

export function getLayerTypeOf(uri: string): CsLabLayerType | null {
  const match = uri.match(/^cdut:\/\/[^/]+\/([^/]+)\//)
  return (match?.[1] as CsLabLayerType | undefined) ?? null
}
