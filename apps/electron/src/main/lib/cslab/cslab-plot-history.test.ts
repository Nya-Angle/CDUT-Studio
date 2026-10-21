/**
 * CSLab 绘图撤销快照测试
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { CsLabLab } from '@profer/shared'
import { createPlotDocument } from '@profer/shared'

let rootDir = ''
let lab: CsLabLab

beforeAll(async () => {
  rootDir = mkdtempSync(join(tmpdir(), 'cslab-plot-history-'))
  process.env.PROFER_CONFIG_DIR = rootDir
  const { createLab } = await import('./cslab-manager')
  lab = createLab({ name: '绘图撤销测试实验室' })
})

afterAll(async () => {
  const { closeAllCsLabDatabases } = await import('./cslab-db')
  closeAllCsLabDatabases()
  try {
    rmSync(rootDir, { recursive: true, force: true })
  } catch {
    // Windows 下 SQLite 句柄可能延迟释放
  }
})

function makePlot(title: string): ReturnType<typeof createPlotDocument> {
  return createPlotDocument({ id: 'plot-undo-1', labId: lab.id, title })
}

describe('绘图撤销快照', () => {
  test('Given 绘图不存在 When 创建快照 Then 返回 null', async () => {
    const { createPlotUndoSnapshot } = await import('./cslab-plot-history')
    const token = await createPlotUndoSnapshot({ labId: lab.id, plotId: 'plot-undo-1' })
    expect(token).toBeNull()
  })

  test('Given 已保存 v1 When 覆盖为 v2 后回滚 Then 内容恢复为 v1', async () => {
    const { savePlot, loadPlot } = await import('./cslab-science')
    const { createPlotUndoSnapshot, restorePlotUndoSnapshot } = await import('./cslab-plot-history')

    await savePlot({ labId: lab.id, plot: makePlot('金红石 v1') })
    const token = await createPlotUndoSnapshot({ labId: lab.id, plotId: 'plot-undo-1' })
    expect(token).toBeTruthy()

    await savePlot({ labId: lab.id, plot: makePlot('金红石 v2') })
    const overwritten = await loadPlot({ labId: lab.id, plotId: 'plot-undo-1' })
    expect(overwritten?.title).toBe('金红石 v2')

    const restored = await restorePlotUndoSnapshot({
      labId: lab.id,
      plotId: 'plot-undo-1',
      undoToken: token!,
    })
    expect(restored?.title).toBe('金红石 v1')

    const reloaded = await loadPlot({ labId: lab.id, plotId: 'plot-undo-1' })
    expect(reloaded?.title).toBe('金红石 v1')
  })

  test('Given 已消费的令牌 When 再次回滚 Then 返回 null', async () => {
    const { savePlot } = await import('./cslab-science')
    const { createPlotUndoSnapshot, restorePlotUndoSnapshot } = await import('./cslab-plot-history')
    await savePlot({ labId: lab.id, plot: makePlot('金红石 v3') })
    const token = await createPlotUndoSnapshot({ labId: lab.id, plotId: 'plot-undo-1' })
    expect(token).toBeTruthy()
    await savePlot({ labId: lab.id, plot: makePlot('金红石 v4') })

    const first = await restorePlotUndoSnapshot({ labId: lab.id, plotId: 'plot-undo-1', undoToken: token! })
    expect(first?.title).toBe('金红石 v3')
    const second = await restorePlotUndoSnapshot({ labId: lab.id, plotId: 'plot-undo-1', undoToken: token! })
    expect(second).toBeNull()
  })

  test('Given 非法令牌 When 回滚 Then 被拒绝且不触碰文件', async () => {
    const { loadPlot } = await import('./cslab-science')
    const { restorePlotUndoSnapshot } = await import('./cslab-plot-history')
    const before = await loadPlot({ labId: lab.id, plotId: 'plot-undo-1' })
    const result = await restorePlotUndoSnapshot({
      labId: lab.id,
      plotId: 'plot-undo-1',
      undoToken: '../../etc/passwd',
    })
    expect(result).toBeNull()
    const after = await loadPlot({ labId: lab.id, plotId: 'plot-undo-1' })
    expect(after?.title).toBe(before?.title)
  })
})
