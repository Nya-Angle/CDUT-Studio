/**
 * T07 评分状态的 Main 侧持久化（Local-L04 桥接层）。
 *
 * 边界（严格遵守计划 §5 T07）：
 * - **不是第二套 CaseStore**：这里只存「评分轮次状态」（assignment / vote /
 *   tieOrder / freeze），案卷、材料、Run、决定仍以 CaseAggregate 为唯一权威。
 * - actor 由 Main 派生并注入，绝不采用 Renderer 声称的评委身份。
 * - 每次写入要求 expectedRevision 匹配，避免并发覆盖（沿用项目 CAS 习惯）。
 *
 * 存储位置遵循项目「配置文件优先、无数据库」原则：
 * `~/.cdutai/review-judging/{batchId}.json`
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getConfigDir } from '../config-paths'
import { assertSafeBatchId } from './batch-store'
import type { T07State } from './review-v3-t07-rating-workflow'

export interface T07PersistedState {
  schemaVersion: 'review-v3-t07-state/1'
  /** 乐观并发修订号；每次成功写入 +1 */
  revision: number
  updatedAt: string
  state: T07State
}

function judgingDir(): string {
  return join(getConfigDir(), 'review-judging')
}

function statePath(batchId: string): string {
  assertSafeBatchId(batchId)
  return join(judgingDir(), `${batchId}.json`)
}

function writeAtomic(filePath: string, data: unknown): void {
  const tmp = `${filePath}.${Math.random().toString(36).slice(2, 8)}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  renameSync(tmp, filePath)
}

/** 读取某批次的评分状态；不存在时返回 undefined（不伪造空轮次）。 */
export function readT07State(batchId: string): T07PersistedState | undefined {
  const filePath = statePath(batchId)
  if (!existsSync(filePath)) return undefined
  try {
    const parsed = JSON.parse(readFileSync(filePath, 'utf-8')) as T07PersistedState
    if (parsed?.schemaVersion !== 'review-v3-t07-state/1' || !parsed.state?.batchId) return undefined
    return parsed
  } catch {
    // 损坏文件不得被当成「空状态」继续写入，否则会静默丢失评分记录
    throw new Error('T07_STATE_CORRUPT')
  }
}

/** 首次写入（expectedRevision 必须为 0）。 */
export function initT07State(
  batchId: string,
  state: T07State,
  expectedRevision: number,
): T07PersistedState {
  if (expectedRevision !== 0) throw new Error('T07_INIT_REVISION_INVALID')
  if (state.batchId !== batchId) throw new Error('T07_BATCH_MISMATCH')
  const existing = readT07State(batchId)
  if (existing) throw new Error('T07_STATE_ALREADY_EXISTS')
  return writeT07State(batchId, state, 0)
}

/** 乐观并发写入：expectedRevision 与磁盘不一致则拒绝。 */
export function writeT07State(
  batchId: string,
  state: T07State,
  expectedRevision: number,
): T07PersistedState {
  if (state.batchId !== batchId) throw new Error('T07_BATCH_MISMATCH')
  const current = readT07State(batchId)
  const currentRevision = current?.revision ?? 0
  if (expectedRevision !== currentRevision) {
    throw new Error(`T07_REVISION_CONFLICT: 期望 ${expectedRevision}，当前 ${currentRevision}`)
  }
  const next: T07PersistedState = {
    schemaVersion: 'review-v3-t07-state/1',
    revision: currentRevision + 1,
    updatedAt: new Date().toISOString(),
    state,
  }
  const directory = judgingDir()
  if (!existsSync(directory)) mkdirSync(directory, { recursive: true })
  writeAtomic(statePath(batchId), next)
  return next
}
