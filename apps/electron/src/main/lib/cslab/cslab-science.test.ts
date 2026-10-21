/**
 * CSLab 科学服务集成测试
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CsLabLab, CsLabPlotDocument } from '@profer/shared'
import { createPlotDocument } from '@profer/shared'

let rootDir = ''
let lab: CsLabLab
let cifUri = ''

const CIF_PATH = new URL('../../../../../../demo-data/cdut-science-rutile/rutile-tio2.cif', import.meta.url)

beforeAll(async () => {
  rootDir = mkdtempSync(join(tmpdir(), 'cslab-science-'))
  process.env.PROFER_CONFIG_DIR = rootDir
  const { createLab } = await import('./cslab-manager')
  const { ingestFiles } = await import('./cslab-iron-cage')
  lab = createLab({ name: '科学引擎测试实验室', description: '自动化测试' })
  const results = await ingestFiles(lab.id, [fileURLToPath(CIF_PATH)])
  expect(results[0]?.status).toBe('ok')
  cifUri = results[0]!.asset.uri
})

afterAll(async () => {
  const { resolveLabDir } = await import('./cslab-paths')
  const { unlockFile } = await import('./cslab-hash')
  const { closeAllCsLabDatabases } = await import('./cslab-db')
  try {
    const figures = join(resolveLabDir(lab.id), 'vault', 'figures')
    for (const entry of readdirSync(figures)) await unlockFile(join(figures, entry))
  } catch {
    // 目录可能不存在
  }
  closeAllCsLabDatabases()
  try {
    rmSync(rootDir, { recursive: true, force: true })
  } catch {
    // Windows 下 SQLite 句柄可能延迟释放
  }
})

describe('CSLab 科学服务', () => {
  test('Given 金红石 CIF When 分析 Then 晶胞与 6 个原子正确', async () => {
    const { analyzeCrystalAsset } = await import('./cslab-science')
    const analysis = await analyzeCrystalAsset({ labId: lab.id, uri: cifUri })
    expect(analysis.atomCount).toBe(6)
    expect(analysis.expandedAtomCount).toBe(6)
    expect(analysis.formula).toBe('Ti2 O4')
    expect(analysis.structure.spaceGroup.symbol).toContain('P')
    expect(analysis.cellVolume).toBeCloseTo(62.43, 1)
    expect(analysis.wyckoff).toHaveLength(6)
  })

  test('Given 金红石结构 When 模拟 PXRD Then 生成峰表与连续谱线', async () => {
    const { simulatePxrdAsset } = await import('./cslab-science')
    const pattern = await simulatePxrdAsset({ labId: lab.id, uri: cifUri })
    expect(pattern.peaks.length).toBeGreaterThan(0)
    expect(pattern.curve.x.length).toBeGreaterThan(100)
    expect(pattern.wavelengthAngstrom).toBeCloseTo(1.5406, 6)
    expect(pattern.peaks[0]!.twoTheta).toBeGreaterThan(0)
  })

  test('Given 绘图文档 When 保存/列出/读取 Then 往返一致', async () => {
    const { savePlot, listPlots, loadPlot } = await import('./cslab-science')
    const base = createPlotDocument({
      id: 'plot-test-1',
      labId: lab.id,
      title: '金红石 XRD',
      presetId: 'nature',
    })
    const document: CsLabPlotDocument = {
      ...base,
      layers: [
        {
          ...base.layers[0]!,
          series: [
            {
              id: 'series-1',
              name: 'TiO_2',
              x: [10, 20, 30],
              y: [1, 3, 2],
              color: '#1f77b4',
              lineWidth: 0.6,
              lineStyle: 'solid',
              marker: 'none',
              yAxis: 0,
              visible: true,
              alpha: 1,
            },
          ],
        },
      ],
    }
    const summary = await savePlot({ labId: lab.id, plot: document })
    expect(summary.id).toBe('plot-test-1')
    const list = await listPlots(lab.id)
    expect(list.some((item) => item.id === 'plot-test-1')).toBe(true)
    const loaded = await loadPlot({ labId: lab.id, plotId: 'plot-test-1' })
    expect(loaded?.title).toBe('金红石 XRD')
    expect(loaded?.layers[0]?.series[0]?.name).toBe('TiO_2')
  })

  test('Given 绘图文档 When 导出 SVG Then 输出可编辑文字且不含位图', async () => {
    const { loadPlot, exportFigure } = await import('./cslab-science')
    const plot = await loadPlot({ labId: lab.id, plotId: 'plot-test-1' })
    expect(plot).not.toBeNull()
    const result = await exportFigure({
      labId: lab.id,
      plot: plot!,
      options: { format: 'svg', dpi: 300, transparentBackground: false },
    })
    expect(result.path.endsWith('.svg')).toBe(true)
    const svg = readFileSync(result.path, 'utf8')
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg).toContain('<text')
    expect(svg).not.toContain('<image')
  })
})
