import { getLab } from './cslab-manager'
import { getCsLabDatabase, listEntities } from './cslab-db'
import type { CsLabPromptLabInfo } from '@profer/shared'
/**
 * CSLab 科学计算服务（主进程）
 *
 * 统一承接晶体分析、PXRD 模拟、峰拟合、体数据读取、绘图文档存取与出版图导出。
 * 所有结构/谱图计算复用 @profer/shared 的纯函数，主进程只负责文件 IO 与路径安全。
 */

import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import type {
  CsLabCrystalAnalysis,
  CsLabFitRequest,
  CsLabFitResult,
  CsLabPlotDocument,
  CsLabPlotExportOptions,
  CsLabPlotExportResult,
  CsLabPlotSummary,
  CsLabPxrdOptions,
  CsLabPxrdPattern,
  CsLabSmoothRequest,
  CsLabStructureFormat,
  CsLabVolumeGrid,
} from '@profer/shared'
import {
  analyzeCrystalText,
  buildStructureFromText,
  downsampleGrid,
  fitPeaks as fitPeaksCore,
  normalizePlotDocument,
  parseChgcar,
  parseCube,
  parseLocpot,
  simulatePxrd,
  smoothSeries as smoothSeriesCore,
} from '@profer/shared'
import { writeTextAtomic } from './cslab-atomic'
import { exportPlotToFile } from './cslab-figure-export'
import { getMolAsset, getVolumeAsset } from './cslab-mol'
import { assertLabId, resolveLabDir, sanitizeFileName } from './cslab-paths'

const PLOT_ID_RE = /^[A-Za-z0-9_-]{1,64}$/

function structureFormatOf(format: string): CsLabStructureFormat | null {
  if (format === 'cif' || format === 'poscar' || format === 'xyz') return format
  return null
}

async function readStructureAsset(
  labId: string,
  uri: string,
): Promise<{ text: string; format: CsLabStructureFormat }> {
  const asset = await getMolAsset(assertLabId(labId), uri)
  if (!asset) throw new Error('结构资产不存在或不属于当前实验室')
  const format = structureFormatOf(asset.format)
  if (!format) throw new Error(`资产格式 ${asset.format} 不是可分析的结构格式`)
  return { text: asset.text, format }
}

/** 分析晶体结构：空间群、体积、密度、Wyckoff 与等价原子。 */
export async function analyzeCrystalAsset(input: {
  labId: string
  uri: string
  tolerance?: number
}): Promise<CsLabCrystalAnalysis> {
  const { text, format } = await readStructureAsset(input.labId, input.uri)
  return analyzeCrystalText(text, format, input.tolerance)
}

/** 理论 PXRD 模拟。 */
export async function simulatePxrdAsset(input: {
  labId: string
  uri: string
  options?: CsLabPxrdOptions
}): Promise<CsLabPxrdPattern> {
  const { text, format } = await readStructureAsset(input.labId, input.uri)
  return simulatePxrd(buildStructureFromText(text, format), input.options)
}

/** 多峰解叠拟合（主进程侧，供 Agent 工具调用）。 */
export async function fitPeaks(input: CsLabFitRequest): Promise<CsLabFitResult> {
  return fitPeaksCore(input)
}

/** 曲线平滑。 */
export async function smoothSeries(
  input: CsLabSmoothRequest,
): Promise<{ x: number[]; y: number[] }> {
  const y = smoothSeriesCore(input)
  return { x: input.x.slice(0, y.length), y }
}

/** 读取体数据网格（Cube / CHGCAR / LOCPOT）。 */
export async function getVolumeGrid(input: {
  labId: string
  uri: string
  maxDimension?: number
}): Promise<CsLabVolumeGrid> {
  const asset = await getVolumeAsset(assertLabId(input.labId), input.uri)
  if (!asset) throw new Error('体数据资产不存在或不属于当前实验室')
  let grid: CsLabVolumeGrid
  if (asset.format === 'cube') grid = parseCube(asset.text)
  else if (asset.format === 'chgcar') grid = parseChgcar(asset.text)
  else grid = parseLocpot(asset.text)
  if (input.maxDimension !== undefined) {
    return downsampleGrid(grid, Math.max(16, Math.min(256, Math.round(input.maxDimension)))).grid
  }
  return grid
}

function plotsDir(labId: string): string {
  return join(resolveLabDir(assertLabId(labId)), 'vault', 'plots')
}

export function plotPath(labId: string, plotId: string): string {
  if (!PLOT_ID_RE.test(plotId)) throw new Error('绘图标识非法')
  return join(plotsDir(labId), `${plotId}.json`)
}

/** 保存绘图文档到实验室沙箱（vault/plots）。 */
export async function savePlot(input: {
  labId: string
  plot: CsLabPlotDocument
}): Promise<CsLabPlotSummary> {
  const labId = assertLabId(input.labId)
  const plot = normalizePlotDocument(input.plot)
  if (!PLOT_ID_RE.test(plot.id)) throw new Error('绘图标识非法')
  if (plot.labId !== labId) throw new Error('绘图文档与实验室不匹配')
  await fs.mkdir(plotsDir(labId), { recursive: true })
  const payload = { ...plot, updatedAt: Date.now() }
  await writeTextAtomic(plotPath(labId, plot.id), JSON.stringify(payload, null, 2))
  return {
    id: payload.id,
    title: payload.title,
    updatedAt: payload.updatedAt,
    presetId: payload.presetId,
  }
}

/** 列出实验室内的绘图文档摘要。 */
export async function listPlots(labIdInput: string): Promise<CsLabPlotSummary[]> {
  const labId = assertLabId(labIdInput)
  const directory = plotsDir(labId)
  let entries: string[]
  try {
    entries = await fs.readdir(directory)
  } catch {
    return []
  }
  const summaries: CsLabPlotSummary[] = []
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue
    try {
      const raw = await fs.readFile(join(directory, entry), 'utf8')
      const parsed = JSON.parse(raw) as Partial<CsLabPlotDocument>
      if (!parsed.id || !parsed.title) continue
      summaries.push({
        id: String(parsed.id),
        title: String(parsed.title),
        updatedAt: Number(parsed.updatedAt ?? 0),
        presetId: parsed.presetId ?? 'default',
      })
    } catch {
      // 跳过损坏文件，不阻塞列表
    }
  }
  return summaries.sort((left, right) => right.updatedAt - left.updatedAt)
}

/** 读取绘图文档。 */
export async function loadPlot(input: {
  labId: string
  plotId: string
}): Promise<CsLabPlotDocument | null> {
  const labId = assertLabId(input.labId)
  try {
    const raw = await fs.readFile(plotPath(labId, input.plotId), 'utf8')
    const parsed = JSON.parse(raw) as CsLabPlotDocument
    if (!parsed || parsed.labId !== labId) return null
    return normalizePlotDocument(parsed)
  } catch {
    return null
  }
}

/** 导出出版图；未指定 targetPath 时自动写入 vault/figures。 */
export async function exportFigure(input: {
  labId: string
  plot: CsLabPlotDocument
  options: CsLabPlotExportOptions
  targetPath?: string
}): Promise<CsLabPlotExportResult> {
  const labId = assertLabId(input.labId)
  const plot = normalizePlotDocument(input.plot)
  const extension = input.options.format
  const defaultName = `${plot.id}.${extension}`
  const targetPath =
    input.targetPath ??
    join(
      resolveLabDir(labId),
      'vault',
      'figures',
      sanitizeFileName(input.options.fileName ?? defaultName),
    )
  await fs.mkdir(join(resolveLabDir(labId), 'vault', 'figures'), { recursive: true })
  return exportPlotToFile(plot, input.options, targetPath)
}


/** 读取供 AI 系统提示词装配的实验室环境与现存结构/绘图资产概览。 */
export async function getCsLabPromptLabInfo(
  labIdInput: string,
): Promise<CsLabPromptLabInfo | undefined> {
  try {
    const labId = assertLabId(labIdInput)
    const lab = getLab(labId)
    if (!lab) return undefined
    const db = getCsLabDatabase(join(resolveLabDir(labId), 'db', 'central_meta.sqlite'))
    const entities = listEntities(db, labId)
    const structures = entities
      .filter((e) => e.layerType === 'mol')
      .map((e) => ({
        uri: e.uri,
        title: e.title,
        layerType: e.layerType,
        format: e.format,
      }))
    const plots = await listPlots(labId)
    return {
      labId,
      labName: lab.name,
      vaultDir: join(resolveLabDir(labId), 'vault'),
      structures,
      plots: plots.map((p) => ({ id: p.id, title: p.title })),
    }
  } catch (err) {
    console.warn('[CSLab] 获取提示词实验室概况失败:', err)
    return undefined
  }
}
