/**
 * CSLab 绘图撤销快照
 *
 * Agent 写回画板前，把旧版本快照到 `vault/plots/.history/<plotId>/`，
 * 主窗口撤销条凭 undoToken 整文档回滚。快照仅做最近若干份的轻量保留，
 * 不引入数据库或版本链。
 */

import { promises as fs } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { join } from 'node:path'
import type { CsLabPlotDocument } from '@profer/shared'
import { normalizePlotDocument } from '@profer/shared'
import { writeTextAtomic } from './cslab-atomic'
import { assertLabId, resolveLabDir } from './cslab-paths'
import { plotPath } from './cslab-science'

/** 每个绘图最多保留的撤销快照数量。 */
const HISTORY_LIMIT = 20
/** undoToken 只允许字母数字与短横线，杜绝路径穿越。 */
const TOKEN_RE = /^undo-[A-Za-z0-9-]{8,80}$/

interface CsLabPlotUndoSnapshotFile {
  token: string
  createdAt: number
  plot: CsLabPlotDocument
}

function historyDir(labId: string, plotId: string): string {
  return join(resolveLabDir(assertLabId(labId)), 'vault', 'plots', '.history', plotId)
}

function snapshotPath(labId: string, plotId: string, token: string): string {
  return join(historyDir(labId, plotId), `${token}.json`)
}

/** 超出保留上限时删除最旧的快照；失败不影响主流程。 */
async function pruneHistory(labId: string, plotId: string): Promise<void> {
  const directory = historyDir(labId, plotId)
  try {
    const entries = (await fs.readdir(directory))
      .filter((entry) => entry.endsWith('.json'))
      .sort()
    const overflow = entries.length - HISTORY_LIMIT
    if (overflow <= 0) return
    for (const entry of entries.slice(0, overflow)) {
      await fs.rm(join(directory, entry), { force: true })
    }
  } catch {
    // 目录不存在或不可读时无需处理
  }
}

/**
 * 为即将被覆盖的绘图创建撤销快照。
 *
 * @returns 撤销令牌；目标绘图尚不存在（首次创建）时返回 null。
 */
export async function createPlotUndoSnapshot(input: {
  labId: string
  plotId: string
}): Promise<string | null> {
  const labId = assertLabId(input.labId)
  const target = plotPath(labId, input.plotId)
  let raw: string
  try {
    raw = await fs.readFile(target, 'utf8')
  } catch {
    return null
  }

  let plot: CsLabPlotDocument
  try {
    plot = normalizePlotDocument(JSON.parse(raw) as CsLabPlotDocument)
  } catch {
    return null
  }
  if (plot.labId !== labId) return null

  const token = `undo-${Date.now()}-${randomBytes(4).toString('hex')}`
  const directory = historyDir(labId, input.plotId)
  await fs.mkdir(directory, { recursive: true })
  const payload: CsLabPlotUndoSnapshotFile = {
    token,
    createdAt: Date.now(),
    plot,
  }
  await writeTextAtomic(snapshotPath(labId, input.plotId, token), JSON.stringify(payload, null, 2))
  await pruneHistory(labId, input.plotId)
  return token
}

/**
 * 按令牌回滚绘图到快照版本。
 *
 * @returns 回滚后的绘图文档；令牌非法或快照不存在时返回 null。
 */
export async function restorePlotUndoSnapshot(input: {
  labId: string
  plotId: string
  undoToken: string
}): Promise<CsLabPlotDocument | null> {
  const labId = assertLabId(input.labId)
  if (!TOKEN_RE.test(input.undoToken)) return null
  const file = snapshotPath(labId, input.plotId, input.undoToken)

  let parsed: CsLabPlotUndoSnapshotFile
  try {
    parsed = JSON.parse(await fs.readFile(file, 'utf8')) as CsLabPlotUndoSnapshotFile
  } catch {
    return null
  }
  if (!parsed?.plot) return null

  const plot = normalizePlotDocument(parsed.plot)
  if (plot.labId !== labId) return null

  await writeTextAtomic(plotPath(labId, input.plotId), JSON.stringify(plot, null, 2))
  await fs.rm(file, { force: true })
  return plot
}
