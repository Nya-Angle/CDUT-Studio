/**
 * V2 案卷聚合存储与应用事务（N1c，docs/design/review-agent/07 §3.3）
 *
 * 事务规范：
 * - 存储：review-cases/{caseId}/state.v2.json（单案业务事务文件），唯一临时名 + 原子替换
 * - 逐案串行写队列（复用 V1 case-store 思想）
 * - 幂等：requestId+payloadHash 相同 → 返回原回执（不重复执行）；同 ID 不同载荷 → REQUEST_ID_COLLISION
 * - 并发：expectedRevision 不符 → VERSION_CONFLICT 携当前版
 * - revision 由事务统一 +1 一次（纯函数内部不再递增，07 §3.3 消除双重递增）
 * - 回执与业务变化同一事务落盘（不能先写业务再单独写回执）
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import type { Actor, Appeal, BusinessDecision, CaseAggregateV2, CommandErrorCode, CommandReceipt, ReviewCommandResult, EvidenceLink, Observation, ReviewCaseV2, SupplementRequest, WorkflowTask } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { assertSafeReviewStorageId } from './review-storage-id'
import { withC2CaseDiskTransaction, withC2CaseDiskWriteSync, writeC2CaseStateDurably } from './review-v3-case-disk-tx'

// ===== 聚合形态（07 §3.3） =====

export function emptyAggregate(caseV2: ReviewCaseV2): CaseAggregateV2 {
  return { caseV2, observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [] }
}

// ===== 存储与队列 =====

const writeQueues = new Map<string, Promise<unknown>>()

function aggregatePath(caseId: string): string {
  assertSafeReviewStorageId(caseId, 'caseId')
  return join(getConfigDir(), 'review-cases', caseId, 'state.v2.json')
}

function previousAggregatePath(caseId: string): string {
  return aggregatePath(caseId) + '.previous.json'
}

function isUsableAggregate(candidate: unknown, caseId: string): candidate is CaseAggregateV2 {
  const aggregate = candidate as CaseAggregateV2 | undefined
  return !!aggregate?.caseV2 && aggregate.caseV2.id === caseId
    && Number.isSafeInteger(aggregate.caseV2.revision) && aggregate.caseV2.revision >= 0
    && Array.isArray(aggregate.receiptLog)
}

/**
 * ASSET-17：主账 JSON 损坏时只读回退到上一份有效副本。
 * 不自动改写主文件、不伪造 revision；下一次业务写入仍走正常 CAS。
 */
export function readAggregate(caseId: string): CaseAggregateV2 | undefined {
  const filePath = aggregatePath(caseId)
  if (!existsSync(filePath)) return undefined
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as CaseAggregateV2
  } catch (error) {
    console.warn(`[审核V2聚合] 解析失败: ${caseId}`, error)
    const previousPath = previousAggregatePath(caseId)
    if (!existsSync(previousPath)) return undefined
    try {
      const candidate = JSON.parse(readFileSync(previousPath, 'utf-8')) as unknown
      if (!isUsableAggregate(candidate, caseId)) {
        console.warn(`[审核V2聚合] 上一有效副本身份不合法，拒绝恢复读取: ${caseId}`)
        return undefined
      }
      console.warn(`[审核V2聚合] 已从上一有效主账副本恢复读取: ${caseId}（revision=${candidate.caseV2.revision}）`)
      return candidate
    } catch (backupError) {
      console.warn(`[审核V2聚合] 上一有效主账副本也不可读: ${caseId}`, backupError)
      return undefined
    }
  }
}

export interface CaseStorageIssue {
  caseId: string
  code: 'invalid-main-json' | 'invalid-main-shape' | 'missing-main' | 'main-behind-backup'
  message: string
  canReadFromBackup: boolean
}

/**
 * ASSET-12：坏案卷不再只从列表“静默消失”。只读诊断索引列出可定位的问题，
 * 不自动修复、不改写任何主账。
 */
export function listCaseStorageIssues(): CaseStorageIssue[] {
  const dir = join(getConfigDir(), 'review-cases')
  if (!existsSync(dir)) return []
  const issues: CaseStorageIssue[] = []
  for (const caseId of readdirSync(dir)) {
    try { assertSafeReviewStorageId(caseId, 'caseId') } catch { continue }
    const filePath = aggregatePath(caseId)
    const previousPath = previousAggregatePath(caseId)
    if (!existsSync(filePath)) {
      // 旧 V1 案卷只有 case.json 属正常历史，不算损坏。
      if (existsSync(join(dir, caseId, 'case.json'))) continue
      issues.push({ caseId, code: 'missing-main', message: '缺少 state.v2.json 主账', canReadFromBackup: existsSync(previousPath) })
      continue
    }
    let parsed: unknown
    try { parsed = JSON.parse(readFileSync(filePath, 'utf-8')) }
    catch {
      issues.push({ caseId, code: 'invalid-main-json', message: '主账 JSON 无法解析', canReadFromBackup: existsSync(previousPath) })
      continue
    }
    if (!isUsableAggregate(parsed, caseId)) {
      issues.push({ caseId, code: 'invalid-main-shape', message: '主账身份/修订号/回执账不合法', canReadFromBackup: existsSync(previousPath) })
      continue
    }
    if (existsSync(previousPath)) {
      try {
        const previous = JSON.parse(readFileSync(previousPath, 'utf-8')) as unknown
        if (isUsableAggregate(previous, caseId) && previous.caseV2.revision > parsed.caseV2.revision) {
          issues.push({ caseId, code: 'main-behind-backup', message: `主账 revision ${parsed.caseV2.revision} 落后于上一副本 ${previous.caseV2.revision}，请核验`, canReadFromBackup: true })
        }
      } catch { /* 备份损坏本身不阻断列表；以主账为准 */ }
    }
  }
  return issues
}

/** 聚合摘要列表（G13：重启后可恢复入口的数据面） */
export interface AggregateSummary {
  caseId: string
  title: string
  stage: string
  revision: number
  templateId: string
  templateVersion: number
  updatedAt: string
}

export function listAggregatesV2(): AggregateSummary[] {
  const dir = join(getConfigDir(), 'review-cases')
  if (!existsSync(dir)) return []
  const out: AggregateSummary[] = []
  for (const entry of readdirSync(dir)) {
    try { assertSafeReviewStorageId(entry, 'caseId') } catch { continue }
    const aggregate = readAggregate(entry)
    if (!aggregate) continue
    // A parseable but malformed native state must not poison the entire Case
    // selector or expose an unverified cross-directory identity. Do not try
    // to resurrect a V1 shadow if this guard rejects a record.
    const state = aggregate.caseV2
    if (!state || state.id !== entry ||
        typeof state.title !== 'string' || typeof state.stage !== 'string' ||
        typeof state.templateId !== 'string' || !Number.isSafeInteger(state.templateVersion) ||
        !Number.isSafeInteger(state.revision) || state.revision < 0 ||
        typeof state.updatedAt !== 'string' || !Array.isArray(aggregate.receiptLog)) {
      console.warn(`[审核V2聚合] 跳过损坏或身份不一致的原生案卷: ${entry}`)
      continue
    }
    out.push({
      caseId: state.id,
      title: aggregate.caseV2.title,
      stage: aggregate.caseV2.stage,
      revision: aggregate.caseV2.revision,
      templateId: aggregate.caseV2.templateId,
      templateVersion: aggregate.caseV2.templateVersion,
      updatedAt: aggregate.caseV2.updatedAt,
    })
  }
  return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

/** 原子落盘：唯一临时名 + rename（避免并发覆盖固定 .tmp） */
export function writeAggregate(aggregate: CaseAggregateV2): void {
  assertSafeReviewStorageId(aggregate?.caseV2?.id, 'caseId')
  // Direct fixture/migration writers must obtain the SAME OS lock; inside
  // submitCommand/createAggregate, AsyncLocalStorage carries the held token.
  withC2CaseDiskWriteSync(aggregate.caseV2.id, () => {
    writeC2CaseStateDurably(aggregate.caseV2.id, JSON.stringify(aggregate, null, 2))
  })
}

/** 逐案串行队列：同案命令严格串行（跨案并发） */
function enqueueCase<T>(caseId: string, task: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(caseId) ?? Promise.resolve()
  const next = previous.then(() => withC2CaseDiskTransaction(caseId, task),
    () => withC2CaseDiskTransaction(caseId, task))
  writeQueues.set(caseId, next.catch(() => undefined))
  return next
}

// ===== 命令事务 =====

export function payloadHash(type: string, payload: unknown): string {
  return createHash('sha256').update(`${type}|${JSON.stringify(payload)}`, 'utf-8').digest('hex')
}

/** 命令处理器：只做校验与纯变更（不动 revision、不落盘）；抛 CommandError 中止 */
export type CommandHandler<TPayload, TEntity = TPayload> = (aggregate: CaseAggregateV2, payload: TPayload) => { summary: string; mutate: (aggregate: CaseAggregateV2) => TEntity | void } | never

/** 命令来源元数据（08 设计：Agent 代操作时的指派与会话追溯） */
export interface CommandSourceMeta {
  /** 可信指派 ID（ReviewAgentAssignment.id；人工操作缺省） */
  assignmentId?: string
  /** 发起会话完整 ID（显示用短码由 UI 派生） */
  sessionId?: string
}

/** 应用命令事务（07 §3.3 全步骤；幂等/冲突/校验失败不写部分业务数据） */
export async function submitCommand<TPayload, TEntity = TPayload>(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; type: string; payload: TPayload },
  handler: CommandHandler<TPayload, TEntity>,
  source?: CommandSourceMeta,
): Promise<ReviewCommandResult<TEntity>> {
  assertSafeReviewStorageId(caseId, 'caseId')
  return enqueueCase(caseId, async (): Promise<ReviewCommandResult<TEntity>> => {
    const aggregate = readAggregate(caseId)
    if (!aggregate) return { ok: false, code: 'NOT_FOUND', message: `案卷聚合不存在: ${caseId}` }
    // Corrupt-but-parseable JSON must never become a writable pseudo-Case.
    if (!aggregate.caseV2 || aggregate.caseV2.id !== caseId ||
        !Number.isSafeInteger(aggregate.caseV2.revision) || aggregate.caseV2.revision < 0 ||
        !Array.isArray(aggregate.receiptLog)) {
      return { ok: false, code: 'INVALID_TRANSITION',
        message: '案卷聚合缺少有效身份/修订号/回执账，已拒绝业务写入' }
    }

    // 幂等：同 requestId + 同载荷 → 原回执
    const hash = payloadHash(command.type, command.payload)
    const previous = aggregate.receiptLog.find((receipt) => receipt.requestId === command.requestId)
    if (previous) {
      if (previous.payloadHash === hash && previous.type === command.type) {
        return { ok: true, receipt: previous, aggregate }
      }
      return { ok: false, code: 'REQUEST_ID_COLLISION', message: `requestId ${command.requestId} 已被不同载荷使用`, currentRevision: aggregate.caseV2.revision }
    }

    // 并发：expectedRevision
    if (command.expectedRevision !== aggregate.caseV2.revision) {
      return { ok: false, code: 'VERSION_CONFLICT', message: `案卷已被其他操作更新（当前 revision=${aggregate.caseV2.revision}）`, currentRevision: aggregate.caseV2.revision }
    }
    // Archived means no subsequent material/Run/decision mutator may silently
    // resurrect current business validity. The only transition out is a
    // C-owned RestoreReviewCaseV3 with CAS, Actor and durable Receipt.
    if (aggregate.caseV2.stage === 'archived' && command.type !== 'RestoreReviewCaseV3') {
      return { ok: false, code: 'INVALID_TRANSITION', message: '案卷已归档，请先通过原生恢复命令重新启用', currentRevision: aggregate.caseV2.revision }
    }

    // 校验 + 纯变更（handler 内抛错即整体拒绝，不写部分数据）
    let applied: { summary: string; mutate: (aggregate: CaseAggregateV2) => TEntity | void }
    try {
      applied = handler(aggregate, command.payload)
    } catch (error) {
      return { ok: false, code: error instanceof CommandValidationError ? error.code : 'VALIDATION_FAILED', message: error instanceof Error ? error.message : String(error) }
    }
    const draft: CaseAggregateV2 = structuredClone(aggregate)
    const entity = applied.mutate(draft)
    // revision 由事务统一 +1 一次
    draft.caseV2 = { ...draft.caseV2, revision: aggregate.caseV2.revision + 1, updatedAt: new Date().toISOString() }
    // 操作者与指派来源同事务落盘（08 设计：时间线可辨人工/AI；旧记录无此字段按未记录呈现）
    const receipt: CommandReceipt = { requestId: command.requestId, type: command.type, payloadHash: hash, revision: draft.caseV2.revision, at: new Date().toISOString(), summary: applied.summary, actor: command.actor, ...(source ?? {}) }
    draft.receiptLog = [...draft.receiptLog, receipt]

    // 回执与业务变化同一事务落盘
    writeAggregate(draft)
    return { ok: true, receipt, aggregate: draft, entity: entity as TEntity | undefined }
  })
}

/** 业务校验错误（携带错误码穿透事务层） */
export class CommandValidationError extends Error {
  constructor(readonly code: CommandErrorCode, message: string) {
    super(message)
  }
}

/** 创建新案卷聚合（CreateCaseFromTemplate 专用：不走 expectedRevision，revision=0 起） */
export async function createAggregate(caseId: string, caseV2: ReviewCaseV2, initialReceipt?: CommandReceipt, authorizeAtCommit?: () => void): Promise<void> {
  assertSafeReviewStorageId(caseId, 'caseId')
  assertSafeReviewStorageId(caseV2?.id, 'caseId')
  if (caseId !== caseV2.id) throw new CommandValidationError('VALIDATION_FAILED', '案卷 ID 与聚合内容不一致')
  await enqueueCase(caseId, async () => {
    if (existsSync(aggregatePath(caseId))) throw new CommandValidationError('INVALID_TRANSITION', `案卷聚合已存在: ${caseId}`)
    // Main capability must still be alive at the serialized durable write.
    authorizeAtCommit?.()
    const fresh = emptyAggregate(caseV2)
    // 创建回执与创建动作同事务落盘（08 设计：创建动作可追溯）
    if (initialReceipt) fresh.receiptLog = [initialReceipt]
    writeAggregate(fresh)
  })
}
