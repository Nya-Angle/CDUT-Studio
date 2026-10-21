/**
 * CSLab 演示实验室生成测试
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

let rootDir = ''
let labId = ''

const DEMO_DIR = fileURLToPath(new URL('../../../../resources/cslab/demo', import.meta.url))

beforeAll(() => {
  rootDir = mkdtempSync(join(tmpdir(), 'cslab-demo-'))
  process.env.PROFER_CONFIG_DIR = rootDir
})

afterAll(async () => {
  const { resolveLabDir } = await import('./cslab-paths')
  const { unlockFile } = await import('./cslab-hash')
  const { closeAllCsLabDatabases } = await import('./cslab-db')
  if (labId) {
    const base = join(resolveLabDir(labId), 'vault')
    for (const directory of ['raw', 'figures', 'tables', 'lit']) {
      try {
        for (const entry of readdirSync(join(base, directory))) {
          await unlockFile(join(base, directory, entry)).catch(() => undefined)
        }
      } catch {
        // 目录可能不存在
      }
    }
  }
  closeAllCsLabDatabases()
  try {
    rmSync(rootDir, { recursive: true, force: true })
  } catch {
    // Windows 下 SQLite 句柄可能延迟释放
  }
})

describe('演示实验室', () => {
  test('Given 内置演示数据 When 一键创建 Then 资产与出版图齐备且幂等', async () => {
    const { createDemoLab } = await import('./cslab-demo')
    const first = await createDemoLab({ demoDir: DEMO_DIR })
    labId = first.lab.id
    expect(first.lab.name).toContain('演示实验室')
    expect(first.lab.tags).toContain('VESTA 晶体学')
    expect(first.assets.length).toBeGreaterThanOrEqual(8)
    expect(first.plotId).toBe('demo-rutile-xrd')

    const second = await createDemoLab({ demoDir: DEMO_DIR })
    expect(second.lab.id).toBe(first.lab.id)
    expect(second.assets.length).toBe(first.assets.length)
    expect(second.plotId).toBe(first.plotId)

    const formats = new Set(second.assets.map((asset) => asset.format))
    expect(formats.has('cif')).toBe(true)
    expect(formats.has('poscar')).toBe(true)
    expect(formats.has('pdb')).toBe(true)
    expect(formats.has('cube')).toBe(true)
  })
})
