/**
 * CSLab 演示实验室生成器
 *
 * 一键创建「演示实验室 · Origin × VESTA」，并只读入笼内置演示数据：
 * - 金红石 TiO2 / SrTiO3 钙钛矿 CIF（VESTA 空间群与 PXRD）；
 * - 硅金刚石 POSCAR；
 * - 金 FCC 纳米颗粒 PDB；
 * - 合成差分电荷密度 Cube（等值面）；
 * - 金红石 Cu/Co Kα XRD 与 Raman 数据表（Origin 绘图与拟合）。
 *
 * 同时预生成一张 Nature 单栏出版图，打开实验室即可在「出版图」中查看。
 */

import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { app } from 'electron'
import type {
  CsLabAssetSummary,
  CsLabDemoLabResult,
  CsLabLab,
} from '@profer/shared'
import { createPlotDocument } from '@profer/shared'
import { createLab, listLabs } from './cslab-manager'
import { ingestFiles, listAssets } from './cslab-iron-cage'
import { getTableSeries } from './cslab-mol'
import { savePlot } from './cslab-science'

const DEMO_LAB_NAME = '演示实验室 · Origin × VESTA'

const DEMO_FILES = [
  'rutile-tio2.cif',
  'srtio3-perovskite.cif',
  'silicon-diamond.poscar',
  'gold-fcc-nanoparticle.pdb',
  'rutile-diff-charge.cube',
  'rutile-xrd-cu-ka.csv',
  'rutile-xrd-co-ka.csv',
  'rutile-raman-532nm.csv',
] as const

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

/** 创建或复用演示实验室，并预生成一张出版图。 */
export async function createDemoLab(options: { demoDir?: string } = {}): Promise<CsLabDemoLabResult> {
  const demoDir = resolveDemoDir(options.demoDir)
  const paths = await assertDemoFiles(demoDir)

  const existing = listLabs().find((lab) => lab.name === DEMO_LAB_NAME)
  const lab: CsLabLab = existing
    ? existing
    : createLab({
        name: DEMO_LAB_NAME,
        description:
          '内置演示沙箱：金红石/SrTiO3 晶体学、硅 POSCAR、Au 纳米颗粒、差分电荷密度等值面，以及 Cu/Co Kα XRD 与 Raman 数据。',
        tags: ['演示', 'Origin 绘图', 'VESTA 晶体学', 'PXRD', '等值面'],
      })

  const ingestResults = await ingestFiles(lab.id, paths)
  const failed = ingestResults.filter((result) => result.status !== 'ok')
  if (failed.length > 0) {
    throw new Error(`演示数据摄取失败：${failed.map((result) => result.message).join('；')}`)
  }

  const assets = await listAssets(lab.id)
  const xrdResult = ingestResults.find(
    (result) => result.asset.title.includes('rutile-xrd-cu-ka') && result.tableUri,
  )

  let plotId: string | undefined
  if (xrdResult?.tableUri) {
    const series = await getTableSeries(lab.id, xrdResult.tableUri, 2000)
    if (series && series.x.length > 1) {
      const yKey = series.columns.find((column) => column.key !== 'x')?.key
      const y = yKey ? series.series[yKey] ?? [] : []
      if (y.length === series.x.length && y.length > 1) {
        const document = createPlotDocument({
          id: 'demo-rutile-xrd',
          labId: lab.id,
          title: '金红石 TiO₂ · Cu Kα 衍射',
          presetId: 'nature',
        })
        const layer = document.layers[0]!
        const plot = {
          ...document,
          layers: [
            {
              ...layer,
              series: [
                {
                  id: 'series-1',
                  name: '金红石 TiO₂',
                  x: series.x,
                  y,
                  color: '#1f6f8b',
                  lineWidth: 0.6,
                  lineStyle: 'solid' as const,
                  marker: 'none' as const,
                  yAxis: 0 as const,
                  visible: true,
                  alpha: 1,
                },
              ],
              xAxis: { ...layer.xAxis, title: '2θ', unit: 'deg' },
              yAxes: [
                { ...layer.yAxes[0]!, title: '强度', unit: 'a.u.' },
                layer.yAxes[1]!,
              ] as typeof layer.yAxes,
            },
            ...document.layers.slice(1),
          ],
          updatedAt: Date.now(),
        }
        const summary = await savePlot({ labId: lab.id, plot })
        plotId = summary.id
      }
    }
  }

  return { lab, assets, plotId }
}

/** 供 UI 判断是否已存在演示实验室。 */
export function findDemoLab(): CsLabLab | undefined {
  return listLabs().find((lab) => lab.name === DEMO_LAB_NAME)
}

/** 供测试与 UI 展示演示数据清单。 */
export const CSLAB_DEMO_FILES: readonly string[] = DEMO_FILES
