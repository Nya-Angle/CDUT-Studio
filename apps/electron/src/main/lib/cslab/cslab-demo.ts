/**
 * CSLab 演示实验室生成器
 *
 * 一键创建「演示实验室 · Origin × VESTA」，并只读入笼内置演示数据：
 * - 金红石 TiO2 / SrTiO3 钙钛矿 CIF（VESTA 空间群与 PXRD）；
 * - 硅金刚石 POSCAR 与 NIST SRM 640 标样对标表；
 * - 金 FCC 纳米颗粒 PDB；
 * - 合成差分电荷密度 Cube、CHGCAR 与 LOCPOT 体数据（等值面）；
 * - 金红石 Cu/Co Kα XRD 与 Raman 数据表（Origin 绘图与拟合）；
 * - 数字化演示 PNG（图表逆向数字化标定）。
 *
 * 同时预生成 4 套 Nature 单栏出版图：双靶 XRD、NIST 对标、拉曼分峰、双 Y 轴图版。
 */

import { promises as fs } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { basename, join } from 'node:path'
import { app } from 'electron'
import type {
  CsLabAssetSummary,
  CsLabDemoLabResult,
  CsLabLab,
  CsLabTableSeries,
} from '@profer/shared'
import { createLab, listLabs } from './cslab-manager'
import { ingestFiles, listAssets } from './cslab-iron-cage'
import { getTableSeries } from './cslab-mol'
import { buildDemoPlates } from './cslab-demo-plates'
import { getCsLabDatabase, nextLabRevision, upsertEntity, withTransaction } from './cslab-db'
import { copyFileWithHash, lockFileReadOnly } from './cslab-hash'
import { resolveLabDir, resolveLabRelativePath, sanitizeFileName } from './cslab-paths'
import { buildCsLabUri } from './cslab-uri'

const DEMO_LAB_NAME = '演示实验室 · Origin × VESTA'

const DEMO_DATA_FILES = [
  'rutile-tio2.cif',
  'srtio3-perovskite.cif',
  'silicon-diamond.poscar',
  'gold-fcc-nanoparticle.pdb',
  'rutile-diff-charge.cube',
  'rutile-chgcar-sample.chgcar',
  'rutile-locpot-sample.locpot',
  'rutile-xrd-cu-ka.csv',
  'rutile-xrd-co-ka.csv',
  'rutile-raman-532nm.csv',
  'silicon-srm640-benchmark.csv',
  '1792573114138-6ac8d0-石榴石_Y_Al_O____YAG____Ia-3d_完整立方晶胞.cif',
  'biogeo_basin_dem.asc',
] as const

/** PNG 不能走仪器格式嗅探流水线，按 fig 图层单独登记。 */
const DEMO_FIGURE_FILES = ['demo-digitizer-spectrum.png'] as const

const DEMO_FILES = [...DEMO_DATA_FILES, ...DEMO_FIGURE_FILES] as const

const DEMO_DATA_SET = new Set<string>(DEMO_DATA_FILES)

function resolveDemoDir(override?: string): string {
  if (override) return override
  const fromEnv = process.env.CSLAB_DEMO_DIR
  if (fromEnv) return fromEnv
  if (app?.isPackaged) return join(process.resourcesPath, 'cslab', 'demo')
  const appPath = typeof app?.getAppPath === 'function' ? app.getAppPath() : process.cwd()
  return join(appPath, 'resources', 'cslab', 'demo')
}

async function assertDemoFiles(demoDir: string): Promise<string[]> {
  const missing: string[] = []
  const paths: string[] = []
  for (const fileName of DEMO_FILES) {
    const fullPath = join(demoDir, fileName)
    try {
      await fs.access(fullPath)
      paths.push(fullPath)
    } catch {
      missing.push(fileName)
    }
  }
  if (missing.length > 0) {
    throw new Error(`演示数据缺失：${missing.join('、')}（期望目录 ${demoDir}）`)
  }
  return paths
}

/**
 * 将演示 PNG 登记为 `fig` 资产（按标题幂等）。
 *
 * 图像不走仪器格式解析：`sniffFormat` 对 `.png` 会返回 unknown，
 * 直接交给 ingestFiles 会被标记 unsupported 并中断演示实验室创建。
 */
async function ensureDemoFigure(
  labId: string,
  sourcePath: string,
): Promise<CsLabAssetSummary | null> {
  const fileName = basename(sourcePath)
  const existing = listAssets(labId).find(
    (asset) => asset.layerType === 'fig' && asset.title === fileName,
  )
  if (existing) return existing

  await fs.mkdir(join(resolveLabDir(labId), 'vault', 'figures'), { recursive: true })
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const relPath = `vault/figures/${timestamp}-${randomUUID().slice(0, 6)}-${sanitizeFileName(fileName)}`
  const absPath = resolveLabRelativePath(labId, relPath)
  const digest = await copyFileWithHash(sourcePath, absPath)
  const locked = await lockFileReadOnly(absPath)

  const db = getCsLabDatabase(join(resolveLabDir(labId), 'db', 'central_meta.sqlite'))
  const entityUuid = `fig-${randomUUID().slice(0, 8)}`
  const uri = buildCsLabUri(labId, 'fig', entityUuid)
  const createdAt = Date.now()
  withTransaction(db, () => {
    const revision = nextLabRevision(db)
    upsertEntity(db, {
      uri,
      labId,
      layerType: 'fig',
      entityUuid,
      title: fileName,
      format: 'png',
      relPath,
      sha256: digest.sha256,
      bytes: digest.bytes,
      revision,
      locked,
      createdAt,
      updatedAt: createdAt,
    })
    return revision
  })

  return listAssets(labId).find((asset) => asset.uri === uri) ?? null
}

/** 创建或复用演示实验室，并预生成 4 套出版图。 */
export async function createDemoLab(options: { demoDir?: string } = {}): Promise<CsLabDemoLabResult> {
  const demoDir = resolveDemoDir(options.demoDir)
  const paths = await assertDemoFiles(demoDir)
  const dataPaths = paths.filter((path) => DEMO_DATA_SET.has(basename(path)))
  const figurePaths = paths.filter((path) => !DEMO_DATA_SET.has(basename(path)))

  const existing = listLabs().find((lab) => lab.name === DEMO_LAB_NAME)
  const lab: CsLabLab = existing
    ? existing
    : createLab({
        name: DEMO_LAB_NAME,
        description:
          '内置演示沙箱：金红石/SrTiO3 晶体学、硅 POSCAR 与 NIST 对标、Au 纳米颗粒、Cube/CHGCAR/LOCPOT 体数据，以及 Cu/Co Kα XRD、Raman 与数字化演示图。',
        tags: ['演示', 'Origin 绘图', 'VESTA 晶体学', 'PXRD', '等值面', '拉曼分峰'],
      })

  const ingestResults = await ingestFiles(lab.id, dataPaths)
  const failed = ingestResults.filter((result) => result.status !== 'ok')
  if (failed.length > 0) {
    throw new Error(`演示数据摄取失败：${failed.map((result) => result.message).join('；')}`)
  }

  for (const figurePath of figurePaths) {
    await ensureDemoFigure(lab.id, figurePath)
  }

  const tableSeriesFor = async (fileName: string): Promise<CsLabTableSeries | undefined> => {
    const result = ingestResults.find(
      (item) => item.asset.title === fileName && item.tableUri,
    )
    if (!result?.tableUri) return undefined
    return (await getTableSeries(lab.id, result.tableUri, 2000)) ?? undefined
  }

  const [cuXrd, coXrd, raman] = [
    await tableSeriesFor('rutile-xrd-cu-ka.csv'),
    await tableSeriesFor('rutile-xrd-co-ka.csv'),
    await tableSeriesFor('rutile-raman-532nm.csv'),
  ]

  const { plotIds, stats } = await buildDemoPlates({
    labId: lab.id,
    demoDir,
    cuXrd,
    coXrd,
    raman,
  })

  const assets = await listAssets(lab.id)
  return { lab, assets, plotId: plotIds[0], plotIds, stats }
}

/** 供 UI 判断是否已存在演示实验室。 */
export function findDemoLab(): CsLabLab | undefined {
  return listLabs().find((lab) => lab.name === DEMO_LAB_NAME)
}

/** 供测试与 UI 展示演示数据清单。 */
export const CSLAB_DEMO_FILES: readonly string[] = DEMO_FILES
