/**
 * 旗舰演示实验室与旧沙箱清理测试
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CsLabDemoLabResult } from '@profer/shared'

let rootDir = ''
let demo: CsLabDemoLabResult

const FLAGSHIP_DIR = fileURLToPath(
  new URL('../../../../resources/cslab/demo-flagship', import.meta.url),
)

beforeAll(async () => {
  rootDir = mkdtempSync(join(tmpdir(), 'cslab-flagship-demo-'))
  process.env.PROFER_CONFIG_DIR = rootDir
  process.env.CSLAB_FLAGSHIP_DEMO_DIR = FLAGSHIP_DIR
  const { createDemoLab } = await import('./cslab-demo')
  demo = await createDemoLab({ demoDir: FLAGSHIP_DIR })
})

afterAll(async () => {
  const { resolveLabDir } = await import('./cslab-paths')
  const { unlockFile } = await import('./cslab-hash')
  const { closeAllCsLabDatabases } = await import('./cslab-db')
  try {
    const base = join(resolveLabDir(demo.lab.id), 'vault')
    for (const directory of ['figures', 'tables', 'lit', 'geo']) {
      try {
        for (const entry of readdirSync(join(base, directory))) {
          await unlockFile(join(base, directory, entry)).catch(() => undefined)
        }
      } catch {
        // 目录可能不存在
      }
    }
  } catch {
    // 忽略清理失败
  }
  closeAllCsLabDatabases()
  try {
    rmSync(rootDir, { recursive: true, force: true })
  } catch {
    // Windows 下 SQLite 句柄可能延迟释放
  }
})

describe('旗舰演示实验室', () => {
  test('Given 内置旗舰资源 When 创建 Then 实验室与全部资产层齐备', () => {
    expect(demo.lab.name).toBe('演示实验室——生物、化学主题')
    expect(demo.lab.demoKind).toBe('flagship')
    expect(demo.lab.description).toContain('DEMO')
    const layerTypes = new Set(demo.assets.map((asset) => asset.layerType))
    expect(layerTypes.has('mol')).toBe(true)
    expect(layerTypes.has('geo')).toBe(true)
    expect(layerTypes.has('fig')).toBe(true)
    expect(layerTypes.has('lit')).toBe(true)
    expect(layerTypes.has('note')).toBe(true)
    expect(layerTypes.has('doc')).toBe(true)
    expect(demo.plotIds).toEqual(['flagship-cd-spectra', 'flagship-xrd-dual'])
  })

  test('Given 标准曲线 When 检查元数据 Then 含 plot-digitizer-standard 与标定刻度', () => {
    const asset = demo.assets.find((item) => item.title === 'standard_calibration_curve.png')
    expect(asset).toBeTruthy()
    const meta = JSON.parse(asset!.metaJson ?? '{}') as {
      kind?: string
      calibration?: { x?: { ticks?: unknown[] }; y?: { ticks?: unknown[] } }
    }
    expect(meta.kind).toBe('plot-digitizer-standard')
    expect(meta.calibration?.x?.ticks?.length).toBe(2)
    expect(meta.calibration?.y?.ticks?.length).toBe(2)
  })

  test('Given 主 DNA、金红石与硅 POSCAR 资产 When 读取 Then 默认视口元数据存在', async () => {
    const { getMolAsset } = await import('./cslab-mol')
    const dna = demo.assets.find((item) => item.title === 'b_dna_double_helix.pdb')
    const rutile = demo.assets.find((item) => item.title === 'rutile_tio2.cif')
    const silicon = demo.assets.find((item) => item.title === 'silicon_diamond.poscar')
    expect(dna).toBeTruthy()
    expect(rutile).toBeTruthy()
    expect(silicon).toBeTruthy()
    const dnaAsset = await getMolAsset(demo.lab.id, dna!.uri)
    const rutileAsset = await getMolAsset(demo.lab.id, rutile!.uri)
    const siliconAsset = await getMolAsset(demo.lab.id, silicon!.uri)
    expect(dnaAsset?.defaultSettings?.autoSpin).toBe(true)
    expect(rutileAsset?.defaultSettings?.supercell).toEqual({ na: 2, nb: 2, nc: 3 })
    expect(rutileAsset?.defaultSettings?.miller).toEqual([1, 1, 0])
    expect(siliconAsset?.format).toBe('poscar')
    expect(siliconAsset?.defaultSettings?.supercell).toEqual({ na: 2, nb: 2, nc: 2 })
  })

  test('Given 旧演示实验室名称 When ensureDemoLabs Then 清理旧沙箱且幂等', async () => {
    const { createLab, listLabs } = await import('./cslab-manager')
    const { ensureDemoLabs, listAllDemoLabs } = await import('./cslab-demo')
    const legacy = createLab({
      name: '演示实验室 · Origin × VESTA',
      description: '旧演示沙箱',
    })
    await ensureDemoLabs({ demoDir: FLAGSHIP_DIR })
    const created = await ensureDemoLabs({ demoDir: FLAGSHIP_DIR })
    expect(created.created).toEqual([])
    expect(listLabs().some((lab) => lab.id === legacy.id)).toBe(false)
    expect(listAllDemoLabs().length).toBe(1)
    expect(listAllDemoLabs()[0]!.demoKind).toBe('flagship')
  })
})
