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

/** 冷启动中断的稳定诊断标记（RUN-43：用于识别「可原 ID 续交」的运行）。 */
export const INTERRUPTED_RUN_MARKER = 'interrupted: 进程重启'

/** 即使恢复写盘失败，旧进程留下的 running 也不能重新获得工具或 admission。 */
export function isInterruptedRunV2(caseId: string, runId: string): boolean {
  return interruptedRunIds.has(interruptedRunKey(caseId, runId))
}

/**
 * RUN-43：进程崩溃后由 markStaleRunsInterrupted 标为 failed 的运行仍保有
 * 原检查点。判定「可原 RunId 续交」必须同时满足：确实因冷启动中断、
 * 已有落盘检查点或已接受检查、且不是正常失败。
 */
export function isResumableInterruptedRunV2(
  run: Pick<ReviewRunV2, 'status' | 'diagnostics' | 'checks' | 'checkpoints'>,
): boolean {
  if (run.status !== 'failed') return false
  if (!(run.diagnostics ?? []).includes(INTERRUPTED_RUN_MARKER)) return false
  const accepted = (run.checks ?? []).filter((check) => check.status !== 'execution-failed')
  return accepted.length > 0 || (run.checkpoints ?? []).length > 0
}

/**
 * RUN-43：Main 主动续交时把冷启动中断的运行恢复为 `partially-completed`，
 * 沿用同一 RunId 与既有检查点，并留下审计诊断。不是冒充 completed：
 * 未完成的检查仍需本轮补齐；同时解除该 Run 的启动拒止。
 *
 * `confirmedByUser` 只由用户显式确认的续交传入。即便确认，续交也是**新回合**：
 * 中断前 Provider 请求的结果没有耐久 journal 可证明，不能宣称已恢复或已重放。
 */
export function reopenInterruptedRunForResume(
  caseId: string,
  runId: string,
  options: { confirmedByUser?: boolean } = {},
): ReviewRunV2 | undefined {
  const run = getRunV2(caseId, runId)
  if (!run || !isResumableInterruptedRunV2(run)) return undefined
  run.status = 'partially-completed'
  delete run.completedAt
  delete run.error
  run.diagnostics = [...(run.diagnostics ?? []),
    options.confirmedByUser
      ? 'resume-interrupted: 用户确认按原 RunId 继续检查点；本次是新回合，中断前未确认的模型请求不会被重放或视为已恢复'
      : 'resume-interrupted: 冷启动后按原 RunId 续交，保留既有检查点与已接受结果'].slice(-50)
  saveRunV2(run)
  interruptedRunIds.delete(interruptedRunKey(caseId, runId))
  return run
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
          run.diagnostics = [...(run.diagnostics ?? []), INTERRUPTED_RUN_MARKER]
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
