/**
 * 旗舰演示实验室：演示实验室——生物、化学主题
 *
 * 唯一的官方演示沙箱。旧 Origin × VESTA / SKLGP 泥石流演示实验室由
 * cslab-demo.ts 的 ensureDemoLabs() 自动清理。
 */

import { app } from 'electron'
import { promises as fs } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import type {
  CsLabDemoLabResult,
  CsLabLab,
  CsLabPlotCalibration,
} from '@profer/shared'
import { createLab, listLabs } from './cslab-manager'
import {
  getCsLabDatabase,
  getEntityByUri,
  getLabState,
  nextLabRevision,
  setLabState,
  upsertEntity,
  withTransaction,
} from './cslab-db'
import { ingestFiles, listAssets } from './cslab-iron-cage'
import { resolveLabDir, resolveLabRelativePath } from './cslab-paths'
import { registerEntityFile } from './cslab-geohazard-tools'
import { createManuscript, saveManuscript } from './cslab-manuscript'
import { createCanvas, listCanvases, writeCanvas } from './cslab-canvas-sync'
import { indexSingleNote } from './cslab-vault-index'
import { getLiteratureStructure } from './cslab-literature-structure'
import { buildLabLiteratureIndex } from './cslab-literature-index'
import { savePlot } from './cslab-science'
import { broadcastCsLabEvent } from './cslab-events'
import { CSLAB_IPC_CHANNELS } from './cslab-types'
import {
  FLAGSHIP_CD_FILE,
  FLAGSHIP_CANVAS_TITLE,
  FLAGSHIP_PAPER_TITLE,
  FLAGSHIP_PLOT_IDS,
  FLAGSHIP_XRD_FILE,
  HILLSHADE_FILE,
  SEM_FILE,
  STANDARD_CALIBRATION_FILE,
  buildFlagshipCanvasDocument,
  buildFlagshipCdData,
  buildFlagshipHillshadeSvg,
  buildFlagshipNotes,
  buildFlagshipPaperPdf,
  buildFlagshipPlots,
  buildFlagshipSemPseudoColorPng,
  buildFlagshipXrdData,
  buildStandardCalibrationCurvePng,
} from './cslab-demo-flagship-content'
import { parseGeoRasterBuffer } from './cslab-geohazard'

export const FLAGSHIP_DEMO_LAB_NAME = '演示实验室——生物、化学主题'
export const FLAGSHIP_DEMO_DIR_NAME = 'demo-flagship'
export const FLAGSHIP_DEMO_CONTENT_VERSION = 1

const RESOURCE_FILES = [
  'ribosome_large_subunit.pdb',
  'b_dna_double_helix.pdb',
  'perovskite_cubic.cif',
  'rutile_tio2.cif',
  'silicon_diamond.poscar',
  'biogeo_basin_dem.asc',
  FLAGSHIP_CD_FILE,
  FLAGSHIP_XRD_FILE,
] as const

function resolveFlagshipDir(override?: string): string {
  if (override) return override
  if (process.env.CSLAB_FLAGSHIP_DEMO_DIR) return process.env.CSLAB_FLAGSHIP_DEMO_DIR
  if (app?.isPackaged) return join(process.resourcesPath, 'cslab', FLAGSHIP_DEMO_DIR_NAME)
  const appPath = typeof app?.getAppPath === 'function' ? app.getAppPath() : process.cwd()
  return join(appPath, 'resources', 'cslab', FLAGSHIP_DEMO_DIR_NAME)
}

export function resolveFlagshipDemoDir(override?: string): string {
  return resolveFlagshipDir(override)
}

function parseJsonRecord(value: string | undefined): Record<string, unknown> {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value) as unknown
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {}
  } catch {
    return {}
  }
}

function setMolMetadata(labId: string, title: string, metaJson: string): void {
  const asset = listAssets(labId).find(
    (item) => item.layerType === 'mol' && item.title === title,
  )
  if (!asset) return
  const db = getCsLabDatabase(join(resolveLabDir(labId), 'db', 'central_meta.sqlite'))
  const entity = getEntityByUri(db, asset.uri)
  if (!entity) return
  withTransaction(db, () => {
    const revision = nextLabRevision(db)
    upsertEntity(db, { ...entity, metaJson, revision, updatedAt: Date.now() })
    return revision
  })
}

function buildTipTapDocument(paragraphs: string[]): unknown {
  return {
    type: 'doc',
    content: paragraphs.map((text) => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    })),
  }
}

async function seedFlagshipFigures(lab: CsLabLab): Promise<void> {
  const hasFigure = (title: string): boolean =>
    listAssets(lab.id).some((asset) => asset.layerType === 'fig' && asset.title === title)
  if (!hasFigure(STANDARD_CALIBRATION_FILE)) {
    const calibration = buildStandardCalibrationCurvePng()
    await registerEntityFile({
      labId: lab.id,
      layerType: 'fig',
      title: STANDARD_CALIBRATION_FILE,
      format: 'png',
      relDir: 'figures',
      content: calibration.buffer,
      metaJson: JSON.stringify({
        kind: 'plot-digitizer-standard',
        calibration: calibration.calibration,
      }),
    })
  }

  const demAsset = listAssets(lab.id).find(
    (asset) => asset.layerType === 'geo' && asset.title === 'biogeo_basin_dem.asc',
  )
  if (demAsset?.relPath && !hasFigure(HILLSHADE_FILE)) {
    const demBuffer = await fs.readFile(resolveLabRelativePath(lab.id, demAsset.relPath))
    const raster = await parseGeoRasterBuffer(demBuffer, demAsset.relPath)
    await registerEntityFile({
      labId: lab.id,
      layerType: 'fig',
      title: HILLSHADE_FILE,
      format: 'svg',
      relDir: 'figures',
      content: buildFlagshipHillshadeSvg(raster),
      metaJson: JSON.stringify({ kind: 'flagship-hillshade', demUri: demAsset.uri }),
    })
  }

  if (!hasFigure(SEM_FILE)) {
    await registerEntityFile({
      labId: lab.id,
      layerType: 'fig',
      title: SEM_FILE,
      format: 'png',
      relDir: 'figures',
      content: buildFlagshipSemPseudoColorPng(),
      metaJson: JSON.stringify({ kind: 'flagship-sem', disclaimer: 'DEMO synthetic SEM-like texture' }),
    })
  }
}

async function ingestFlagshipPaper(lab: CsLabLab): Promise<void> {
  const tempDir = await fs.mkdtemp(join(tmpdir(), 'cslab-flagship-paper-'))
  try {
    const fileName = 'flagship-deep-biosphere-demo.pdf'
    const path = join(tempDir, fileName)
    await fs.writeFile(path, buildFlagshipPaperPdf())
    await ingestFiles(lab.id, [path])
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined)
  }
  for (const asset of listAssets(lab.id)) {
    if (asset.layerType !== 'lit') continue
    try {
      await getLiteratureStructure(lab.id, asset.uri, { ensure: true })
    } catch (error) {
      console.warn(`[CSLab] 旗舰演示文献结构解析失败: ${asset.uri}`, error)
    }
  }
  try {
    await buildLabLiteratureIndex(lab.id, { force: true })
  } catch (error) {
    console.warn('[CSLab] 旗舰演示文献索引构建失败:', error)
  }
}

async function seedFlagshipNotes(lab: CsLabLab): Promise<void> {
  const notes = buildFlagshipNotes()
  await fs.mkdir(resolveLabRelativePath(lab.id, 'vault/notes'), { recursive: true })
  for (const note of notes) {
    const absolute = resolveLabRelativePath(lab.id, note.relPath)
    try {
      await fs.access(absolute)
      continue
    } catch {
      // 只有缺失时才写入，不覆盖用户编辑。
    }
    await fs.writeFile(absolute, note.content, 'utf-8')
    try {
      await indexSingleNote(lab.id, note.relPath)
    } catch (error) {
      console.warn(`[CSLab] 旗舰演示笔记索引失败: ${note.relPath}`, error)
    }
  }
}

async function seedFlagshipCanvas(lab: CsLabLab): Promise<void> {
  const existing = (await listCanvases(lab.id)).find(
    (canvas) => canvas.title === FLAGSHIP_CANVAS_TITLE,
  )
  if (existing) return
  const tableUri = listAssets(lab.id).find((asset) => asset.layerType === 'table')?.uri
  const demUri = listAssets(lab.id).find((asset) => asset.layerType === 'geo')?.uri
  const created = await createCanvas(lab.id, FLAGSHIP_CANVAS_TITLE)
  await writeCanvas({
    labId: lab.id,
    relPath: created.relPath,
    document: buildFlagshipCanvasDocument({
      tableUri,
      demUri,
      plotIds: FLAGSHIP_PLOT_IDS,
      paperTitle: FLAGSHIP_PAPER_TITLE,
    }),
    expectedMtimeMs: created.mtimeMs,
  })
}

async function seedFlagshipManuscript(lab: CsLabLab): Promise<void> {
  const existing = listAssets(lab.id).find(
    (asset) => asset.layerType === 'doc' && asset.title === '旗舰演示手稿 · 深地生物圈',
  )
  if (existing) return
  const manuscript = await createManuscript(lab.id, '旗舰演示手稿 · 深地生物圈')
  await saveManuscript({
    labId: lab.id,
    uri: manuscript.uri,
    title: manuscript.title,
    docJson: buildTipTapDocument([
      '本手稿由 CSLab 旗舰演示实验室自动生成，用于演示段落写作与活体数据胶囊工作流。',
      '核心结论：公开结构坐标可复现；CD 与 XRD 谱线为合成演示，不得作为实测数据引用。',
      '地表 2.5D DEM 不能推断地下三维断层；缺失钻孔与物探剖面时不得虚构地层深度。',
    ]),
    capsules: [],
  })
}

async function saveFlagshipPlots(lab: CsLabLab, demoDir: string): Promise<string[]> {
  const cd = buildFlagshipCdData()
  const xrd = buildFlagshipXrdData()
  const rutileText = await fs.readFile(join(demoDir, 'rutile_tio2.cif'), 'utf-8')
  const { plots, warnings } = await buildFlagshipPlots({
    labId: lab.id,
    cd,
    xrd,
    rutileCifText: rutileText,
  })
  if (warnings.length > 0) {
    console.warn('[CSLab] 旗舰演示图版警告:', warnings.join(' | '))
  }
  for (const plot of plots) {
    const summary = await savePlot({ labId: lab.id, plot })
    broadcastCsLabEvent(CSLAB_IPC_CHANNELS.ON_PLOT_UPDATED, {
      labId: lab.id,
      plot: { ...plot, updatedAt: summary.updatedAt },
      source: 'agent',
    })
  }
  return plots.map((plot) => plot.id)
}

export async function createFlagshipDemoLab(options: {
  demoDir?: string
} = {}): Promise<CsLabDemoLabResult> {
  const demoDir = resolveFlagshipDir(options.demoDir)
  for (const fileName of RESOURCE_FILES) {
    await fs.access(join(demoDir, fileName)).catch(() => {
      throw new Error(`旗舰演示资源缺失：${fileName}（期望目录 ${demoDir}）`)
    })
  }

  const existing = listLabs().find((lab) => lab.demoKind === 'flagship')
  const lab: CsLabLab = existing ?? createLab({
    name: FLAGSHIP_DEMO_LAB_NAME,
    description:
      '旗舰演示沙箱（DEMO）：公开 PDB 核糖体大亚基与 B-DNA、SrTiO₃/金红石晶体、2.5D 文家沟 DEM、Origin 级 CD/XRD 图版、标准曲线一键逆向化、双栏演示论文、地貌晕渲与 SEM 伪彩图版、12 篇双链笔记与深地生物圈推演画布。',
    tags: ['演示', '生物化学', 'DEMO', 'Mol*', 'Origin 绘图', '2.5D DEM', '文献智脑', 'JSON Canvas'],
    demoKind: 'flagship',
  })

  const dataPaths = RESOURCE_FILES.map((fileName) => join(demoDir, fileName))
  const ingestResults = await ingestFiles(lab.id, dataPaths)
  const failed = ingestResults.filter((result) => result.status !== 'ok')
  if (failed.length > 0) {
    throw new Error(`旗舰演示数据摄取失败：${failed.map((item) => item.message).join('；')}`)
  }

  setMolMetadata(
    lab.id,
    'b_dna_double_helix.pdb',
    JSON.stringify({ defaultSettings: { autoSpin: true } }),
  )
  setMolMetadata(
    lab.id,
    'rutile_tio2.cif',
    JSON.stringify({
      defaultSettings: {
        supercell: { na: 2, nb: 2, nc: 3 },
        miller: [1, 1, 0],
        highlightPolyhedra: true,
      },
    }),
  )
  setMolMetadata(
    lab.id,
    'silicon_diamond.poscar',
    JSON.stringify({ defaultSettings: { supercell: { na: 2, nb: 2, nc: 2 } } }),
  )

  await ensureFlagshipDemoContent(lab, { demoDir })
  const assets = await listAssets(lab.id)
  return {
    lab,
    assets,
    plotId: FLAGSHIP_PLOT_IDS[0],
    plotIds: [...FLAGSHIP_PLOT_IDS],
    kind: 'flagship',
  }
}

export async function ensureFlagshipDemoContent(
  lab: CsLabLab,
  options: { demoDir?: string } = {},
): Promise<void> {
  const demoDir = resolveFlagshipDir(options.demoDir)
  const db = getCsLabDatabase(join(resolveLabDir(lab.id), 'db', 'central_meta.sqlite'))
  if (getLabState(db, 'flagship_demo_content_version') === String(FLAGSHIP_DEMO_CONTENT_VERSION)) {
    return
  }

  let criticalOk = true
  const run = async (label: string, task: () => Promise<void>, critical = false): Promise<void> => {
    try {
      await task()
    } catch (error) {
      console.warn(`[CSLab] 旗舰演示内容补齐失败（${label}）:`, error)
      if (critical) criticalOk = false
    }
  }

  await run('图版', () => seedFlagshipFigures(lab), true)
  await run('Origin 图版', async () => {
    await saveFlagshipPlots(lab, demoDir)
  }, true)
  await run('文献', () => ingestFlagshipPaper(lab))
  await run('笔记', () => seedFlagshipNotes(lab), true)
  await run('画布', () => seedFlagshipCanvas(lab))
  await run('手稿', () => seedFlagshipManuscript(lab))

  if (criticalOk) {
    setLabState(db, 'flagship_demo_content_version', String(FLAGSHIP_DEMO_CONTENT_VERSION))
  }
}

export const FLAGSHIP_DEMO_FILES: readonly string[] = RESOURCE_FILES

/** 供测试导出标准曲线元数据解析。 */
export function readStandardCalibrationMeta(metaJson: string | undefined): CsLabPlotCalibration | null {
  const meta = parseJsonRecord(metaJson)
  if (meta.kind !== 'plot-digitizer-standard') return null
  const calibration = meta.calibration as CsLabPlotCalibration | undefined
  if (!calibration?.x?.ticks || !calibration?.y?.ticks) return null
  return calibration
}

/** 测试辅助：生成一个唯一临时文件名。 */
export function flagshipTempName(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`
}
