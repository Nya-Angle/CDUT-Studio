/**
 * V2 运行存储（M3，设计 03 §7 运行记录不可变输入 + 检查点持久化）
 *
 * 存储：review-cases/{caseId}/runs-v2/{runId}.json（整文件原子写，与 V1 同风格）
 * 运行状态机推进时整份重写：检查点/事件追加 → persisted after each node。
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewRunV2 } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { assertSafeReviewStorageId } from './review-storage-id'

function runsDir(caseId: string): string {
  assertSafeReviewStorageId(caseId, 'caseId')
  return join(getConfigDir(), 'review-cases', caseId, 'runs-v2')
}

function runPath(caseId: string, runId: string): string {
  assertSafeReviewStorageId(runId, 'runId')
  return join(runsDir(caseId), `${runId}.json`)
}

export function saveRunV2(run: ReviewRunV2): void {
  const filePath = runPath(run.caseId, run.id)
  mkdirSync(runsDir(run.caseId), { recursive: true })
  const tmp = `${filePath}.tmp`
  writeFileSync(tmp, JSON.stringify(run, null, 2), 'utf-8')
  renameSync(tmp, filePath)
}

/** 启动时发现的旧轮次先拒止授权；这个内存记录不代表终态已落盘。 */
const interruptedRunIds = new Set<string>()
const interruptedRunKey = (caseId: string, runId: string): string => `${caseId}\0${runId}`

/** 即使恢复写盘失败，旧进程留下的 running 也不能重新获得工具或 admission。 */
export function isInterruptedRunV2(caseId: string, runId: string): boolean {
  return interruptedRunIds.has(interruptedRunKey(caseId, runId))
}

/** 启动恢复：把上次进程崩溃/重启遗留的 queued/running 运行标 interrupted（08 设计 §5：不能留永久 running 文件） */
export function markStaleRunsInterrupted(caseId?: string): number {
  if (caseId !== undefined) assertSafeReviewStorageId(caseId, 'caseId')
  const baseDir = join(getConfigDir(), 'review-cases')
  if (!existsSync(baseDir)) return 0
  let count = 0
  for (const entry of readdirSync(baseDir)) {
    try { assertSafeReviewStorageId(entry, 'caseId') } catch { continue }
    if (caseId && entry !== caseId) continue
    const runsDir = join(baseDir, entry, 'runs-v2')
    if (!existsSync(runsDir)) continue
    for (const file of readdirSync(runsDir)) {
      if (!file.endsWith('.json')) continue
      try { assertSafeReviewStorageId(file.slice(0, -'.json'.length), 'runId') } catch { continue }
      const filePath = join(runsDir, file)
      try {
        const run = JSON.parse(readFileSync(filePath, 'utf-8')) as ReviewRunV2
        if (run.status === 'running' || run.status === 'queued') {
          // 先收回旧轮次授权，再尝试持久化。EACCES/ENOSPC 时保留拒止。
          interruptedRunIds.add(interruptedRunKey(entry, file.slice(0, -'.json'.length)))
          if (run.caseId !== entry || run.id !== file.slice(0, -'.json'.length)) {
            throw new Error('恢复运行记录的案卷或轮次身份与文件路径不一致')
          }
          run.status = 'failed'
          run.error = '应用重启导致运行中断（材料与检查点已保留，可续跑）'
          run.completedAt = new Date().toISOString()
          run.diagnostics = [...(run.diagnostics ?? []), 'interrupted: 进程重启']
          // 复用原子写；不能在容量故障时截断最后一份有效运行记录。
          saveRunV2(run)
          count += 1
        }
      } catch (error) {
        console.warn(`[审核V2] 中断运行恢复未持久化，旧授权保持拒止: ${entry}/${file}`, error)
      }
    }
  }
  return count
}

export function getRunV2(caseId: string, runId: string): ReviewRunV2 | undefined {
  const filePath = runPath(caseId, runId)
  if (!existsSync(filePath)) return undefined
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as ReviewRunV2
  } catch (error) {
    console.warn(`[审核V2] 运行文件解析失败: ${caseId}/${runId}`, error)
    return undefined
  }
}

export function listRunsV2(caseId: string): ReviewRunV2[] {
  const dir = runsDir(caseId)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((name) => {
      if (!name.endsWith('.json')) return false
      try { assertSafeReviewStorageId(name.slice(0, -'.json'.length), 'runId'); return true } catch { return false }
    })
    .map((name) => getRunV2(caseId, name.replace('.json', '')))
    .filter((run): run is ReviewRunV2 => !!run)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

/** 节点产物目录：runs-v2/{runId}/artifacts/{nodeId}.json（不可变；恢复核验依据，R03） */
function artifactsDir(caseId: string, runId: string): string {
  assertSafeReviewStorageId(caseId, 'caseId')
  assertSafeReviewStorageId(runId, 'runId')
  return join(getConfigDir(), 'review-cases', caseId, 'runs-v2', runId, 'artifacts')
}

export function saveArtifact(caseId: string, runId: string, nodeId: string, artifact: unknown): void {
  assertSafeReviewStorageId(nodeId, 'nodeId')
  const dir = artifactsDir(caseId, runId)
  const filePath = join(dir, `${nodeId}.json`)
  mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.${Math.random().toString(36).slice(2, 6)}.tmp`
  writeFileSync(tmp, JSON.stringify(artifact, null, 2), 'utf-8')
  renameSync(tmp, filePath)
}

export function readArtifact<T = unknown>(caseId: string, runId: string, nodeId: string): T | undefined {
  assertSafeReviewStorageId(nodeId, 'nodeId')
  const filePath = join(artifactsDir(caseId, runId), `${nodeId}.json`)
  if (!existsSync(filePath)) return undefined
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as T
  } catch {
    return undefined // 结构损坏视为无产物（恢复时重做）
  }
}
