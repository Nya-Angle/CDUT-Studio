/**
 * CSLab 分子/晶体资产（CIF / PDB）
 *
 * 红线：
 * - 结构与仪器原件同等对待：复制进 vault/figures 后只读锁定，登记为 `mol` 实体；
 * - 读取时只接受已登记 URI，路径必须落在实验室沙箱内；
 * - 文本上限 32MB，超出明确报错，绝不静默截断。
 */

import { promises as fs } from 'node:fs'
import { extname } from 'node:path'
import { basename } from 'node:path'
import { randomUUID } from 'node:crypto'
import type {
  CsLabAssetSummary,
  CsLabColumn,
  CsLabIngestResult,
  CsLabMolAsset,
  CsLabMolFormat,
  CsLabTableSeries,
  CsLabVolumeAsset,
  CsLabVolumeFormat,
} from '@profer/shared'
import {
  findEntityByShaAndLayer,
  getCsLabDatabase,
  getEntityByUri,
  getTable,
  nextLabRevision,
  upsertEntity,
  withTransaction,
  type CsLabEntityRecord,
} from './cslab-db'
import { assertLabId, resolveLabDir, resolveLabRelativePath, sanitizeFileName } from './cslab-paths'
import { buildCsLabUri } from './cslab-uri'
import { copyFileWithHash, lockFileReadOnly, unlockFile } from './cslab-hash'
import { readDatasetSeries } from './cslab-columnar'
import { join } from 'node:path'

const MOL_EXTENSIONS: Record<string, CsLabMolFormat> = {
  '.cif': 'cif',
  '.pdb': 'pdb',
  '.ent': 'pdb',
  '.vasp': 'poscar',
  '.poscar': 'poscar',
  '.contcar': 'poscar',
  '.xyz': 'xyz',
}

const VOLUME_EXTENSIONS: Record<string, CsLabVolumeFormat> = {
  '.cube': 'cube',
  '.cub': 'cube',
  '.chgcar': 'chgcar',
  '.locpot': 'locpot',
}

const MAX_MOL_TEXT_BYTES = 32 * 1024 * 1024
const MAX_VOLUME_TEXT_BYTES = 256 * 1024 * 1024

export function getMolFormat(fileName: string): CsLabMolFormat | null {
  return MOL_EXTENSIONS[extname(fileName).toLowerCase()] ?? null
}

/** 体数据格式（Cube / CHGCAR / LOCPOT）。 */
export function getVolumeFormat(fileName: string): CsLabVolumeFormat | null {
  return VOLUME_EXTENSIONS[extname(fileName).toLowerCase()] ?? null
}

function labDb(labId: string) {
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

/** 把一个 CIF/PDB 文件只读入笼为 `mol` 资产（不做任何几何解析）。 */
export async function ingestMolAsset(
  labIdInput: string,
  sourcePath: string,
): Promise<CsLabIngestResult> {
  const labId = assertLabId(labIdInput)
  const fileName = basename(sourcePath)
  const format = getMolFormat(fileName) ?? getVolumeFormat(fileName)
  if (!format) throw new Error(`不是受支持的结构/体数据文件：${fileName}`)

  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const nonce = randomUUID().slice(0, 6)
  const safeName = sanitizeFileName(fileName)
  const relPath = `vault/figures/${timestamp}-${nonce}-${safeName}`
  const absPath = resolveLabRelativePath(labId, relPath)

  const digest = await copyFileWithHash(sourcePath, absPath)
  const db = labDb(labId)

  const existing = findEntityByShaAndLayer(db, labId, digest.sha256, 'mol')
  if (existing) {
    await unlockFile(absPath).catch(() => undefined)
    await fs.rm(absPath, { force: true }).catch(() => undefined)
    return {
      asset: toAssetSummary(existing),
      status: 'ok',
      message: '相同结构文件已存在，已复用既有资产',
    }
  }

  const locked = await lockFileReadOnly(absPath)
  const createdAt = Date.now()
  const entityUuid = `mol-${randomUUID().slice(0, 8)}`
  const uri = buildCsLabUri(labId, 'mol', entityUuid)
  const entity: CsLabEntityRecord = {
    uri,
    labId,
    layerType: 'mol',
    entityUuid,
    title: fileName,
    format,
    relPath,
    sha256: digest.sha256,
    bytes: digest.bytes,
    revision: 1,
    locked,
    createdAt,
    updatedAt: createdAt,
  }

  withTransaction(db, () => {
    const revision = nextLabRevision(db)
    upsertEntity(db, { ...entity, revision })
    return revision
  })

  const saved = getEntityByUri(db, uri)
  if (!saved) throw new Error('结构实体写入失败')
  return {
    asset: toAssetSummary(saved),
    status: 'ok',
    message: '结构文件已只读入笼',
  }
}

/** 读取已登记的 mol 资产文本（供 Mol* 解析）。 */
export async function getMolAsset(
  labIdInput: string,
  uri: string,
): Promise<CsLabMolAsset | null> {
  const labId = assertLabId(labIdInput)
  const entity = getEntityByUri(labDb(labId), uri)
  if (!entity || entity.layerType !== 'mol' || entity.labId !== labId) return null
  if (!entity.relPath) return null
  const format = getMolFormat(entity.relPath)
  if (!format) return null

  const absPath = resolveLabRelativePath(labId, entity.relPath)
  const stat = await fs.stat(absPath)
  if (stat.size > MAX_MOL_TEXT_BYTES) {
    throw new Error('结构文件超过 32MB 文本上限，暂不支持在 3D 视图中打开')
  }
  const buffer = await fs.readFile(absPath)
  return {
    uri: entity.uri,
    labId,
    title: entity.title,
    format,
    text: buffer.toString('utf-8'),
    bytes: buffer.length,
  }
}

/** 读取已登记的体数据资产文本（Cube / CHGCAR / LOCPOT）。 */
export async function getVolumeAsset(
  labIdInput: string,
  uri: string,
): Promise<CsLabVolumeAsset | null> {
  const labId = assertLabId(labIdInput)
  const entity = getEntityByUri(labDb(labId), uri)
  if (!entity || entity.layerType !== 'mol' || entity.labId !== labId) return null
  if (!entity.relPath) return null
  const format = getVolumeFormat(entity.relPath)
  if (!format) return null

  const absPath = resolveLabRelativePath(labId, entity.relPath)
  const stat = await fs.stat(absPath)
  if (stat.size > MAX_VOLUME_TEXT_BYTES) {
    throw new Error('体数据文件超过 256MB 文本上限，暂不支持在等值面视图中打开')
  }
  const buffer = await fs.readFile(absPath)
  return {
    uri: entity.uri,
    labId,
    title: entity.title,
    format,
    text: buffer.toString('utf-8'),
    bytes: buffer.length,
  }
}

/** 读取数据表完整序列（XRD / 拉曼谱联动用），失败回退预览。 */
export async function getTableSeries(
  labIdInput: string,
  tableUri: string,
  maxPoints = 3000,
): Promise<CsLabTableSeries | null> {
  const labId = assertLabId(labIdInput)
  const record = getTable(labDb(labId), tableUri)
  if (!record) return null
  let columns: CsLabColumn[]
  try {
    const parsed = JSON.parse(record.columnsJson) as unknown
    if (!Array.isArray(parsed)) return null
    columns = parsed.filter(
      (item): item is CsLabColumn =>
        !!item && typeof item === 'object' && typeof (item as CsLabColumn).key === 'string',
    )
  } catch {
    return null
  }
  if (columns.length === 0) return null
  const absPath = resolveLabRelativePath(labId, record.parquetRelPath)
  return readDatasetSeries(absPath, columns, maxPoints)
}
