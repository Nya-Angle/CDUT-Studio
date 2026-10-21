/**
 * 批次存储与持久 outbox（N5/N6，docs/design/review-agent/07 §3.3/§7.3；R08/R11）
 *
 * - 批次：review-batches/{batchId}/batch.json（模板/政策锁 + 案卷队列 + 状态机）
 * - 定稿：先冻结快照 hash，再原子提交 manifest；重开 = 新评审轮次（不改写定稿）
 * - outbox：sync-outbox/{actionId}.json 持久化（进程内 Map 不能保证重启幂等，R11）
 *   push → pending → 端口回执（accepted/conflict/rejected）；同 actionId 重放返回原回执
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { triageBatchCase } from '@profer/shared'
import type { BatchStateV2, ReviewBatch, SyncReceipt, BatchAutomationMode } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import type { PushPayload, SchoolPort } from './external-ports'
import { assertSafeReviewStorageId } from './review-storage-id'

// ===== 批次 =====

/**
 * IDs arrive from renderer IPC and persisted filenames. They are *not* paths.
 * Keep one fail-closed boundary for reads, writes, reopens and final snapshots.
 */
export function assertSafeBatchId(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(value)
    || value === '.' || value === '..' || value.includes('..')) {
    throw new Error('非法批次 ID：只能使用字母、数字、下划线、连字符与单个点，不能包含路径分隔符或 ..')
  }
}

function batchDir(batchId: string): string {
  assertSafeBatchId(batchId)
  return join(getConfigDir(), 'review-batches', batchId)
}

function batchPath(batchId: string): string {
  return join(batchDir(batchId), 'batch.json')
}

function writeAtomic(filePath: string, data: unknown): void {
  const tmp = `${filePath}.${Math.random().toString(36).slice(2, 6)}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  renameSync(tmp, filePath)
}

export function saveBatchStateV2(state: BatchStateV2): void {
  for (const caseId of state.batch.caseIds) assertSafeReviewStorageId(caseId, 'caseId')
  for (const entry of state.cases) assertSafeReviewStorageId(entry.caseId, 'caseId')
  const filePath = batchPath(state.batch.id)
  const directory = batchDir(state.batch.id)
  if (!existsSync(directory)) mkdirSync(directory, { recursive: true })
  writeAtomic(filePath, state)
}

export function readBatchStateV2(batchId: string): BatchStateV2 | undefined {
  const filePath = batchPath(batchId)
  if (!existsSync(filePath)) return undefined
  try {
    const state = JSON.parse(readFileSync(filePath, 'utf-8')) as BatchStateV2
    if (state?.batch?.id !== batchId || !Array.isArray(state.batch.caseIds) || !Array.isArray(state.cases)) return undefined
    for (const id of state.batch.caseIds) assertSafeReviewStorageId(id, 'caseId')
    for (const entry of state.cases) assertSafeReviewStorageId(entry?.caseId, 'caseId')
    return state
  } catch {
    return undefined
  }
}

/** 列出已保存批次，供批量审核工作台恢复批次目录。 */
export function listBatchStatesV2(): BatchStateV2[] {
  const root = join(getConfigDir(), 'review-batches')
  if (!existsSync(root)) return []
  return readdirSync(root)
    .filter((batchId) => {
      try { assertSafeBatchId(batchId); return true } catch { return false }
    })
    .map((batchId) => readBatchStateV2(batchId))
    .filter((state): state is BatchStateV2 => !!state)
    .sort((a, b) => b.batch.createdAt.localeCompare(a.batch.createdAt))
}

/** 创建批次（锁定模板/政策版本，A12） */
export function createBatchV2(batch: ReviewBatch): BatchStateV2 {
  assertSafeBatchId(batch?.id)
  if (!Array.isArray(batch?.caseIds) || !batch.caseIds.length) throw new Error('批次必须选择有效案卷')
  for (const caseId of batch.caseIds) assertSafeReviewStorageId(caseId, 'caseId')
  if (new Set(batch.caseIds).size !== batch.caseIds.length) throw new Error('批次案卷 ID 不得重复')
  if (existsSync(batchPath(batch.id))) throw new Error(`批次已存在: ${batch.id}`)
  const state: BatchStateV2 = { batch, status: 'draft', cases: batch.caseIds.map((caseId) => ({ caseId, status: 'queued' })), round: 1 }
  saveBatchStateV2(state)
  return state
}

/** Configure a per-batch automation mode. The renderer never supplies an actor identity. */
export function configureBatchAutomation(batchId: string, mode: BatchAutomationMode, confirmed: boolean): BatchStateV2 {
  const state = readBatchStateV2(batchId)
  if (!state) throw new Error('批次不存在')
  if (!['assist', 'auto-return', 'auto-approve'].includes(mode)) throw new Error('自动化策略无效')
  if (state.status === 'running' || state.status === 'finalized' || activeBatchRuns.has(batchId)) {
    throw new Error('批次执行中或已定稿，不能改变自动化授权')
  }
  if (mode !== 'assist' && confirmed !== true) throw new Error('请人工确认自动化策略与风险')
  if (mode === 'auto-approve') {
    const { getSettings } = require('../settings-service') as typeof import('../settings-service')
    if (getSettings().reviewAgentAutoApproval !== true) throw new Error('全局 AI 代批授权未开启，不得自动通过')
    const { getTemplate } = require('./template-store') as typeof import('./template-store')
    const template = getTemplate(state.batch.templateId, state.batch.templateVersion)
    if (template?.status !== 'published' || template.autoPassPolicy?.enabled !== true) {
      throw new Error('模板未明确允许自动通过')
    }
  }
  state.automation = {
    mode, grantedBy: 'local-reviewer', grantedAt: new Date().toISOString(),
    revision: (state.automation?.revision ?? 0) + 1,
    templateId: state.batch.templateId, templateVersion: state.batch.templateVersion,
  }
  saveBatchStateV2(state)
  return state
}

/** Close the supplement loop without rewriting history or retrying decided cases. */
export function requeueCaseAfterSupplement(caseId: string): string[] {
  const queued: string[] = []
  const { readAggregate } = require('./case-store-v2') as typeof import('./case-store-v2')
  const aggregate = readAggregate(caseId)
  if (!aggregate || aggregate.caseV2.stage !== 'reviewing'
    || aggregate.supplements.some((request) => ['open', 'responded', 'insufficient'].includes(request.status))) return queued
  for (const state of listBatchStatesV2()) {
    if (state.status === 'finalized' || state.status === 'running' || activeBatchRuns.has(state.batch.id)
      || state.batch.templateId !== aggregate.caseV2.templateId
      || state.batch.templateVersion !== aggregate.caseV2.templateVersion) continue
    const entry = state.cases.find((candidate) => candidate.caseId === caseId)
    if (!entry || entry.status === 'queued' || entry.status === 'running') continue
    state.cases = state.cases.map((candidate) => candidate.caseId === caseId
      ? { ...candidate, status: 'queued', error: undefined } : candidate)
    saveBatchStateV2(state)
    queued.push(state.batch.id)
  }
  return queued
}

/** 入队/暂停/重试（单案失败不阻塞全批，06 §7.1） */
export function updateCaseStatus(batchId: string, caseId: string, status: BatchStateV2['cases'][number]['status'], error?: string): BatchStateV2 {
  assertSafeReviewStorageId(caseId, 'caseId')
  const state = readBatchStateV2(batchId)
  if (!state) throw new Error(`批次不存在: ${batchId}`)
  if (state.status === 'finalized') throw new Error('批次已定稿，变更需重开新轮次')
  state.cases = state.cases.map((entry) => (entry.caseId === caseId ? { ...entry, status, error } : entry))
  saveBatchStateV2(state)
  return state
}

/**
 * All finalization callers must use this same business-state gate. 'done'
 * means review run completed, not a formal approval. Check live aggregates,
 * including unresolved supplement/appeal and superseded final decisions.
 */
export function assertBatchBusinessReadyForFinalization(state: BatchStateV2): void {
  const { readAggregate } = require('./case-store-v2') as typeof import('./case-store-v2')
  const { resolveFinalDecisionProjection } = require('./stage-workflow') as typeof import('./stage-workflow')
  if (!state.cases.length || state.cases.some((entry) => entry.status !== 'done')) throw new Error('案卷未完成，不能定稿')
  for (const entry of state.cases) {
    const aggregate = readAggregate(entry.caseId)
    if (!aggregate) throw new Error(`案卷未完成正式审批（没有正式业务终态），不能定稿: ${entry.caseId}`)
    if (aggregate.supplements.some((item) => ['open', 'responded', 'insufficient'].includes(item.status))) {
      throw new Error(`案卷仍待补件，不能定稿: ${entry.caseId}`)
    }
    if (!['decided', 'archived'].includes(aggregate.caseV2.stage)) {
      throw new Error(`案卷未完成正式审批（没有正式业务终态），不能定稿: ${entry.caseId}`)
    }
    if (aggregate.caseV2.templateId !== state.batch.templateId || aggregate.caseV2.templateVersion !== state.batch.templateVersion) {
      throw new Error(`案卷模板版本与批次锁不匹配: ${entry.caseId}`)
    }
    if (aggregate.appeals.some((item) => ['submitted', 'in-review'].includes(item.status))) {
      throw new Error(`案卷仍有待处理申诉，不能定稿: ${entry.caseId}`)
    }
    if (aggregate.tasks.some((item) => item.status === 'open')) {
      throw new Error(`案卷仍有未完成审核任务，不能定稿: ${entry.caseId}`)
    }
    const projected = resolveFinalDecisionProjection(aggregate.decisions)
    if (!projected.isFinal || !projected.decision) {
      throw new Error(`案卷缺少有效且可追溯的最终业务决定: ${entry.caseId}`)
    }
  }
}

/** 定稿：冻结快照 → 原子提交 manifest（R08：定稿后变更只能重开） */
export function finalizeBatch(batchId: string, snapshot: Record<string, unknown>): BatchStateV2 {
  const state = readBatchStateV2(batchId)
  if (!state) throw new Error(`批次不存在: ${batchId}`)
  const snapshotHash = createHash('sha256').update(JSON.stringify(snapshot), 'utf-8').digest('hex')
  if (state.status === 'finalized') {
    if (state.finalizedSnapshotHash === snapshotHash) return state
    throw new Error('批次已定稿，修改快照需重开新轮次')
  }
  if (state.status === 'running' || activeBatchRuns.has(batchId)
    || state.cases.some((entry) => entry.status === 'running')) throw new Error('存在运行中案卷，不能定稿')
  assertBatchBusinessReadyForFinalization(state)
  // 先保存完整快照，再提交批次状态；只有 hash 无法在重启后还原名单/评分。
  writeAtomic(join(batchDir(batchId), `finalized-r${state.round}.json`), { snapshot, snapshotHash, round: state.round })
  state.status = 'finalized'
  state.finalizedSnapshotHash = snapshotHash
  state.finalizedAt = new Date().toISOString()
  saveBatchStateV2(state)
  return state
}

/** 读取已定稿内容并校验；历史版本缺快照时不能拼当前数据冒充。 */
export function readFinalizedSnapshot(batchId: string): Record<string, unknown> | undefined {
  const state = readBatchStateV2(batchId)
  if (!state || state.status !== 'finalized') return undefined
  const path = join(batchDir(batchId), `finalized-r${state.round}.json`)
  if (!existsSync(path)) return undefined
  try {
    const saved = JSON.parse(readFileSync(path, 'utf-8')) as { snapshot: Record<string, unknown>; snapshotHash: string }
    const hash = createHash('sha256').update(JSON.stringify(saved.snapshot), 'utf-8').digest('hex')
    return hash === saved.snapshotHash && hash === state.finalizedSnapshotHash ? saved.snapshot : undefined
  } catch {
    return undefined
  }
}

/** 重开：基于定稿批次创建新轮次（不改写原定稿，07 §7.2） */
export function reopenBatch(batchId: string, newBatchId: string, reason: string): BatchStateV2 {
  assertSafeBatchId(newBatchId)
  const previous = readBatchStateV2(batchId)
  if (!previous) throw new Error(`批次不存在: ${batchId}`)
  if (previous.status !== 'finalized') throw new Error('只有已定稿批次可重开')
  if (existsSync(batchPath(newBatchId))) throw new Error('重开批次 ID 已存在，不得覆盖历史批次')
  const state: BatchStateV2 = {
    batch: { ...previous.batch, id: newBatchId, name: `${previous.batch.name}（重开 R${previous.round + 1}）`, createdAt: new Date().toISOString() },
    status: 'draft',
    cases: previous.batch.caseIds.map((caseId) => ({ caseId, status: 'queued' })),
    round: previous.round + 1,
    reopenedFromBatchId: batchId,
  }
  saveBatchStateV2(state)
  console.log(`[批次] 重开: ${batchId} → ${newBatchId}（${reason}）`)
  return state
}

// ===== 持久 outbox（R11：重启幂等） =====

/** External business action identifiers must never become arbitrary paths. */
export function assertSafeOutboxActionId(actionId: unknown): asserts actionId is string {
  if (typeof actionId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(actionId)
    || actionId === '.' || actionId === '..' || actionId.includes('..')) {
    throw new Error('非法 outbox actionId：不可包含路径或遍历字符')
  }
}

function outboxPath(actionId: string): string {
  assertSafeOutboxActionId(actionId)
  return join(getConfigDir(), 'sync-outbox', `${actionId}.json`)
}

export interface OutboxEntry {
  actionId: string
  payloadHash: string
  /** Serialized original snapshot. Required for automated recovery. */
  payload?: PushPayload
  status: 'pending' | 'accepted' | 'conflict' | 'rejected'
  receipt?: SyncReceipt
  attempts: number
  createdAt: string
}

const activeOutboxActions = new Set<string>()

function assertOutboxPayload(payload: PushPayload): void {
  assertSafeOutboxActionId(payload?.actionId)
  if (typeof payload.caseId !== 'string' || !payload.caseId.trim()
    || !['decision','supplement','roster','rating-matrix'].includes(payload.actionKind)
    || !Number.isSafeInteger(payload.baseExternalRevision) || payload.baseExternalRevision < 0
    || !payload.body || typeof payload.body !== 'object' || Array.isArray(payload.body)) {
    throw new Error('无效 outbox 推送载荷')
  }
}

function storedOutboxPayload(entry: OutboxEntry): PushPayload | undefined {
  const payload = entry.payload
  if (!payload) return undefined
  try {
    assertOutboxPayload(payload)
    if (entry.actionId !== payload.actionId || entry.payloadHash !== payloadHashOf(payload)) return undefined
    return payload
  } catch {
    return undefined
  }
}

function payloadHashOf(payload: PushPayload): string {
  return createHash('sha256').update(JSON.stringify(payload), 'utf-8').digest('hex')
}

function readOutbox(actionId: string): OutboxEntry | undefined {
  const filePath = outboxPath(actionId)
  if (!existsSync(filePath)) return undefined
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as OutboxEntry
  } catch {
    return undefined
  }
}

function writeOutbox(entry: OutboxEntry): void {
  const dir = join(getConfigDir(), 'sync-outbox')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeAtomic(outboxPath(entry.actionId), entry)
}

/**
 * 经 outbox 推送动作（07 §7.3）：
 * - 同 actionId + 同载荷 → 返回持久化原回执（重启后仍幂等）
 * - 同 actionId + 不同载荷 → 拒绝（载荷漂移）
 * - 端口失败 → pending + attempts 递增，可重试
 */
export async function pushViaOutbox(port: SchoolPort, payload: PushPayload): Promise<OutboxEntry> {
  assertOutboxPayload(payload)
  const actionId = payload.actionId
  if (activeOutboxActions.has(actionId)) throw new Error(`outbox actionId ${actionId} 正在执行，禁止并发重放`)
  activeOutboxActions.add(actionId)
  try {
    const existing = readOutbox(actionId)
    const hash = payloadHashOf(payload)
    if (existing) {
      if (existing.payloadHash !== hash) throw new Error(`actionId ${actionId} 已被不同载荷使用`)
      if (existing.status !== 'pending') return existing // 终态回执永久幂等
      if (existing.payload && !storedOutboxPayload(existing)) {
        throw new Error(`outbox actionId ${actionId} 持久化载荷校验失败，不允许重放`)
      }
    }
    const entry: OutboxEntry = existing ?? {
      actionId, payloadHash: hash, status: 'pending', attempts: 0, createdAt: new Date().toISOString(),
    }
    // Legacy pending records without a payload may be safely retried *only*
    // when the original caller explicitly supplies the hash-matching payload.
    entry.payload = structuredClone(payload)
    entry.attempts += 1
    entry.status = 'pending'
    entry.receipt = undefined
    // WAL: original payload + its hash are durably saved before any port call.
    writeOutbox(entry)
    try {
      const receipt = await port.push(entry.payload)
      if (receipt.actionId !== actionId || receipt.caseId !== payload.caseId
        || !['accepted', 'conflict', 'rejected', 'awaiting-receipt'].includes(receipt.status)) {
        throw new Error('校方端口回执与原动作不匹配或状态无效')
      }
      // awaiting-receipt is not a final business outcome: retain the original
      // payload and retry the SAME actionId until the external port resolves.
      entry.status = receipt.status === 'awaiting-receipt' ? 'pending' : receipt.status
      entry.receipt = receipt
    } catch (error) {
      // The remote system might have accepted the action before the reply was
      // lost. On recovery retry *the same actionId*, relying on port idempotency.
      entry.status = 'pending'
      entry.receipt = undefined
      console.warn(`[outbox] 推送未确认（保留原始载荷）: ${actionId}`, error)
    }
    writeOutbox(entry)
    return entry
  } finally {
    activeOutboxActions.delete(actionId)
  }
}

export interface OutboxRecoveryReport {
  recovered: OutboxEntry[]
  /** Legacy entries and corrupted snapshots MUST be handled manually. */
  needsManualReplay: Array<{ actionId: string; reason: string }>
  skippedActive: string[]
}

/** Replay only original hash-verified snapshots. Never synthesize a replacement payload. */
export async function recoverPendingPushesDetailed(port: SchoolPort): Promise<OutboxRecoveryReport> {
  const dir = join(getConfigDir(), 'sync-outbox')
  const report: OutboxRecoveryReport = { recovered: [], needsManualReplay: [], skippedActive: [] }
  if (!existsSync(dir)) return report
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) continue
    const actionId = file.slice(0, -'.json'.length)
    try {
      assertSafeOutboxActionId(actionId)
      const entry = readOutbox(actionId)
      if (!entry) {
        report.needsManualReplay.push({ actionId, reason: 'Outbox 记录损坏或无法读取' })
        continue
      }
      if (entry.actionId !== actionId) {
        report.needsManualReplay.push({ actionId, reason: 'Outbox 文件名和内部动作 ID 不匹配' })
        continue
      }
      if (entry.status !== 'pending') continue
      if (activeOutboxActions.has(actionId)) {
        report.skippedActive.push(actionId)
        continue
      }
      const payload = storedOutboxPayload(entry)
      if (!payload) {
        report.needsManualReplay.push({
          actionId, reason: entry.payload
            ? '原始载荷、哈希或动作 ID 校验失败，禁止恢复'
            : '旧版 pending 记录未保存原始载荷；必须核对外部业务系统后由原调用方提供载荷',
        })
        continue
      }
      report.recovered.push(await pushViaOutbox(port, payload))
    } catch (error) {
      report.needsManualReplay.push({
        actionId,
        reason: error instanceof Error ? error.message : String(error),
      })
    }
  }
  return report
}

/** Compatibility API for callers that only need the successfully inspected entries. */
export async function recoverPendingPushes(port: SchoolPort): Promise<OutboxEntry[]> {
  return (await recoverPendingPushesDetailed(port)).recovered
}

// ===== G06/G11：真实队列执行（逐案跑审核，坏案不阻塞全批） =====

/** Active invocations only live in this Electron main process; persisted running is an interrupted batch after restart. */
const activeBatchRuns = new Set<string>()

/**
 * Explicit crash recovery. Never silently rerun an orphaned running case:
 * review writes might already have occurred, so mark it failed for inspection.
 */
export function recoverInterruptedBatch(batchId: string): BatchStateV2 {
  const state = readBatchStateV2(batchId)
  if (!state) throw new Error(`批次不存在: ${batchId}`)
  if (state.status === 'finalized') throw new Error('已定稿批次不能恢复运行')
  if (activeBatchRuns.has(batchId)) throw new Error('批次仍在当前进程执行，不能按中断恢复')
  if (state.status !== 'running' && !state.cases.some((entry) => entry.status === 'running')) {
    throw new Error('没有需要恢复的中断任务')
  }
  state.cases = state.cases.map((entry) => entry.status === 'running'
    ? { ...entry, status: 'failed', error: '上次审核被中断，请检查案卷运行记录后手动重试' }
    : entry)
  state.status = 'queued'
  saveBatchStateV2(state)
  return state
}

/**
 * Only failed or explicitly paused cases can be requeued. Successful cases
 * remain untouched; caller must explicitly choose each retry target.
 */
export function retryBatchCases(batchId: string, caseIds: string[]): BatchStateV2 {
  if (Array.isArray(caseIds)) for (const caseId of caseIds) assertSafeReviewStorageId(caseId, 'caseId')
  const state = readBatchStateV2(batchId)
  if (!state) throw new Error(`批次不存在: ${batchId}`)
  if (state.status === 'finalized') throw new Error('已定稿批次不能重试')
  if (state.status === 'running' || activeBatchRuns.has(batchId)) throw new Error('批次执行中不能修改重试队列')
  if (!Array.isArray(caseIds) || caseIds.length === 0 || caseIds.some((id) => !id)) throw new Error('请选择需要重试的案卷')
  const requested = new Set(caseIds)
  if (requested.size !== caseIds.length) throw new Error('重试案卷不能重复')
  for (const caseId of requested) {
    const entry = state.cases.find((item) => item.caseId === caseId)
    if (!entry) throw new Error(`案卷不属于此批次: ${caseId}`)
    if (entry.status === 'failed' || entry.status === 'paused') continue
    if (entry.status === 'done') {
      const { listRunsV2 } = require('./run-store-v2') as typeof import('./run-store-v2')
      const { readAggregate } = require('./case-store-v2') as typeof import('./case-store-v2')
      const aggregate = readAggregate(caseId)
      const run = [...listRunsV2(caseId)].sort((a, b) => (b.completedAt ?? b.startedAt).localeCompare(a.completedAt ?? a.startedAt))[0]
      const route = triageBatchCase({
        caseId, entryStatus: 'done', caseStage: aggregate?.caseV2.stage, run, batch: state.batch,
      }).route
      if (route === 'technical-exception') continue
    }
    throw new Error(`案卷当前状态不可重试: ${caseId} (${entry.status})`)
  }
  state.cases = state.cases.map((entry) => requested.has(entry.caseId) ? { ...entry, status: 'queued', error: undefined } : entry)
  saveBatchStateV2(state)
  return state
}


export interface BatchQueueOptions {
  /** 运行参数注入（测试可传假执行器）；产品层复用 Pi 审核 Agent */
  runCase?: (caseId: string) => Promise<{ status: string }>
}

/**
 * 批次队列执行：按案卷状态逐个 queued→running→done/failed。
 * - 单案失败记录 error 并继续（06 §7.1 坏案不拖全批）
 * - 定稿批次拒绝执行（重开新轮次后才能跑）
 * - 中断可重入：已 done 的跳过，failed/queued 重试
 */
export async function runBatchQueue(batchId: string, options: BatchQueueOptions = {}): Promise<BatchStateV2> {
  const state = readBatchStateV2(batchId)
  if (!state) throw new Error(`批次不存在: ${batchId}`)
  if (state.status === 'finalized') throw new Error('批次已定稿，需重开新轮次才能执行')
  if (state.status === 'running' || activeBatchRuns.has(batchId)) throw new Error('批次正在执行，不能重复启动')
  if (!options.runCase) throw new Error('runBatchQueue 需要注入 runCase（产品层由 buildReviewExecutors 提供，避免隐式默认执行器）')
  const queued = state.cases.filter((entry) => entry.status === 'queued')
  if (queued.length === 0) throw new Error('没有待执行的案卷；失败项请先选择重试')
  const runCase = options.runCase
  activeBatchRuns.add(batchId)
  try {
    state.status = 'running'
    saveBatchStateV2(state)
    for (const entry of queued) {
      updateCaseStatus(batchId, entry.caseId, 'running')
      try {
        const outcome = await runCase(entry.caseId)
        if (outcome.status === 'completed') updateCaseStatus(batchId, entry.caseId, 'done')
        else updateCaseStatus(batchId, entry.caseId, 'failed', `运行结束状态: ${outcome.status}`)
      } catch (error) {
        updateCaseStatus(batchId, entry.caseId, 'failed', error instanceof Error ? error.message : String(error))
      }
    }
    const final = readBatchStateV2(batchId)!
    final.status = 'queued' // 等待后续业务决定；执行完不是正式通过
    saveBatchStateV2(final)
    return final
  } finally {
    activeBatchRuns.delete(batchId)
  }
}
