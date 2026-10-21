/**
 * 角色投影与独立副本往返（N6，docs/design/review-agent/07 §7.3/§8 + 06 §8；U12/R12）
 *
 * - 角色投影：student 只见 public 字段+公开反馈+本人补件清单；judge 只见本人任务；
 *   organizer 全量。**未知字段默认 internal**（不靠 UI 隐藏，服务层过滤）
 * - 往返包：student-reply / judge-rating-reply 两类；导出（投影+哈希）→ 独立副本填写 → 导回
 *   （哈希校验 → 去重：同 actionId 返回原回执；载荷漂移拒绝）
 * - 内部意见/其他评委评分/匿名映射不出包
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import type { CaseAggregateV2, FieldValue, ReviewCommandResult, ReviewCaseV2 } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { exportHandoffPackage, importHandoffPackage } from './report-service-v2'

export type AudienceRole = 'student' | 'reviewer' | 'teacher' | 'judge' | 'organizer'

/** 字段可见性解析：未知字段默认 internal（R12：服务层过滤，不靠 UI 隐藏） */
function isPublicField(visibility: unknown): boolean {
  return visibility === 'public'
}

function projectFieldValue(value: FieldValue): unknown {
  // 'unknown' 为 N1a FieldValueV2 扩展；V1 联合类型无此分支，运行时防御
  if ((value as { kind: string }).kind === 'unknown') return null
  return (value as { value: unknown }).value
}

export interface CaseProjection {
  caseId: string
  title: string
  stage: string
  fields: Record<string, unknown>
  subjects: Array<{ id: string; title: string; fields: Record<string, unknown> }>
  decisions: Array<{ id: string; result: string; reason: string; finality?: string; at: string }>
  supplements: Array<{ id: string; reason: string; requiredElements: string[]; status: string }>
  /** judge 专用：本人评分（其他评委不可见） */
  ownRating?: unknown
  /** reviewer/teacher 专用：内部意见 */
  internalNotes?: string[]
}

/** 按角色投影案卷聚合（07 §8：未知字段默认内部可见） */
export function projectForRole(
  aggregate: CaseAggregateV2,
  role: AudienceRole,
  fieldVisibility: Record<string, 'public' | 'internal'>,
  viewerId?: string,
): CaseProjection {
  const base: CaseProjection = {
    caseId: aggregate.caseV2.id,
    title: aggregate.caseV2.title,
    stage: aggregate.caseV2.stage,
    fields: {},
    subjects: aggregate.caseV2.subjects.map((subject) => ({ id: subject.id, title: subject.title, fields: {} })),
    decisions: aggregate.decisions.map((decision) => ({ id: decision.id, result: decision.result, reason: decision.reason, finality: decision.finality, at: decision.at })),
    supplements: aggregate.supplements.map((request) => ({ id: request.id, reason: request.reason, requiredElements: request.requiredElements, status: request.status })),
  }
  // 字段投影：public 才出（student/judge）；审核侧全量
  const showAllFields = role === 'reviewer' || role === 'teacher' || role === 'organizer'
  if (showAllFields) {
    base.fields = Object.fromEntries(Object.entries(aggregate.caseV2.caseFields).map(([key, value]) => [key, projectFieldValue(value)]))
    base.subjects = aggregate.caseV2.subjects.map((subject) => ({ id: subject.id, title: subject.title, fields: Object.fromEntries(Object.entries(subject.fields).map(([key, value]) => [key, projectFieldValue(value)])) }))
  } else {
    base.fields = Object.fromEntries(
      Object.entries(aggregate.caseV2.caseFields)
        .filter(([key]) => isPublicField(fieldVisibility[key]))
        .map(([key, value]) => [key, projectFieldValue(value)]),
    )
    base.subjects = aggregate.caseV2.subjects.map((subject) => ({
      id: subject.id,
      title: subject.title,
      fields: Object.fromEntries(Object.entries(subject.fields).filter(([key]) => isPublicField(fieldVisibility[key])).map(([key, value]) => [key, projectFieldValue(value)])),
    }))
  }
  // judge 只见本人评分（复查 §5.6：从 ratings 取，不再取 dispositions）
  if (role === 'judge' && viewerId) {
    const own = aggregate.ratings?.find((rating) => rating.actor === viewerId)
    base.ownRating = own ?? null
  }
  // 学生/评委视角：决定 reason 可能含内部调查细节（复查 §5.6）——公开投影只保留结果与终审性
  if (role === 'student' || role === 'judge') {
    base.decisions = base.decisions.map((decision) => ({ ...decision, reason: '' }))
  }
  // 内部意见仅审核/组织者
  if (role === 'reviewer' || role === 'teacher' || role === 'organizer') {
    base.internalNotes = aggregate.dispositions.map((entry) => entry.reason)
  }
  return base
}

// ===== 独立副本往返包（07 §7.3） =====

export type RoundTripKind = 'student-reply' | 'judge-rating-reply'

export interface RoundTripPayload {
  kind: RoundTripKind
  caseId: string
  /** 独立副本标识（本地来源，不冒充校方） */
  actor: { actorId: string; actorSource: import('@profer/shared').ActorSource }
  projection: CaseProjection
  /** 副本填写内容：补件材料说明 / 评分 */
  reply: Record<string, unknown>
  externalRevision?: number
}

export interface RoundTripReceipt {
  actionId: string
  caseId: string
  status: 'accepted' | 'duplicate' | 'rejected'
  message?: string
}

/** 导出往返包（投影过滤 + 哈希随包） */
export function exportRoundTripPackage(aggregate: CaseAggregateV2, kind: RoundTripKind, actor: { actorId: string; actorSource: import('@profer/shared').ActorSource }, fieldVisibility: Record<string, 'public' | 'internal'>, reply: Record<string, unknown>) {
  const projection = projectForRole(aggregate, kind === 'judge-rating-reply' ? 'judge' : 'student', fieldVisibility, actor.actorId)
  return exportHandoffPackage<Omit<RoundTripPayload, never>>({ kind, caseId: aggregate.caseV2.id, actor, projection, reply })
}

/** 持久 outbox 条目（G07：发送前先落盘 pending；应用后写终态回执） */
export interface RoundTripOutboxEntry {
  packageId: string
  kind: RoundTripKind
  caseId: string
  actor: string
  replyHash: string
  status: 'pending' | 'accepted' | 'duplicate' | 'rejected'
  message?: string
  appliedAt?: string
  attempts: number
}

function outboxDir(): string {
  const dir = join(getConfigDir(), 'sync-outbox', 'roundtrip')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

function outboxPath(packageId: string): string {
  return join(outboxDir(), `${packageId}.json`)
}

function readOutboxEntry(packageId: string): RoundTripOutboxEntry | undefined {
  const filePath = outboxPath(packageId)
  if (!existsSync(filePath)) return undefined
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as RoundTripOutboxEntry
  } catch {
    return undefined
  }
}

function writeOutboxEntry(entry: RoundTripOutboxEntry): void {
  const tmp = `${outboxPath(entry.packageId)}.${Math.random().toString(36).slice(2, 6)}.tmp`
  writeFileSync(tmp, JSON.stringify(entry, null, 2), 'utf-8')
  renameSync(tmp, outboxPath(entry.packageId))
}

function replyHashOf(payload: RoundTripPayload): string {
  return createHash('sha256').update(JSON.stringify(payload.reply), 'utf-8').digest('hex')
}

/** 接受导入：校验 → 去重 → 事务应用到聚合（ratings/supplement responses 真实落盘） */
export function applyRoundTripPackage(pkg: ReturnType<typeof exportHandoffPackage>): Promise<RoundTripReceipt> {
  const checked = importHandoffPackage<RoundTripPayload>(pkg as never)
  if (!checked.ok && checked.code === 'HASH_MISMATCH') {
    return Promise.resolve({ actionId: pkg.packageId, caseId: '', status: 'rejected', message: checked.message })
  }
  const payload = checked.ok ? checked.payload : (pkg.payload as RoundTripPayload)
  return applyPayloadTransaction(payload)
}

async function applyPayloadTransaction(payload: RoundTripPayload): Promise<RoundTripReceipt> {
  const { readAggregate } = await import('./case-store-v2')
  const aggregate = readAggregate(payload.caseId)
  if (!aggregate) return { actionId: '', caseId: payload.caseId, status: 'rejected', message: `案卷聚合不存在: ${payload.caseId}` }

  // judge-rating-reply → 走 castRating（唯一票约束）
  if (payload.kind === 'judge-rating-reply') {
    const { castRating } = await import('./rating-service')
    const scores = (payload.reply.scores ?? {}) as Record<string, number | 'N/A'>
    const stageId = String(payload.reply.stageId ?? 'rating')
    const outcome = (await castRating(payload.caseId, {
      requestId: `rt-${pkgPackageIdOf(payload)}`,
      actor: { actorId: payload.actor.actorId, actorSource: payload.actor.actorSource, role: 'judge' },
      expectedRevision: aggregate.caseV2.revision,
      payload: { stageId, scores, round: (payload.reply.round as number | undefined) ?? 1 },
    })) as { ok: boolean; message?: string }
    return outcome.ok
      ? { actionId: pkgPackageIdOf(payload), caseId: payload.caseId, status: 'accepted', message: '评分已应用（唯一票）' }
      : { actionId: pkgPackageIdOf(payload), caseId: payload.caseId, status: 'rejected', message: outcome.message ?? '评分应用失败' }
  }

  // student-reply → 追加到对应补件请求（无目标则拒绝，不冒充已应用）
  const supplementId = String(payload.reply.supplementId ?? '')
  const target = aggregate.supplements.find((request) => request.id === supplementId)
  if (!target) return { actionId: pkgPackageIdOf(payload), caseId: payload.caseId, status: 'rejected', message: '回复缺少可应用的补件请求（supplementId 不存在）' }
  const { submitCommand } = await import('./case-store-v2')
  const outcome = (await submitCommand<{ supplementId: string; note: string }, void>(payload.caseId, {
    requestId: `rt-${pkgPackageIdOf(payload)}`,
    actor: { actorId: payload.actor.actorId, actorSource: payload.actor.actorSource, role: 'student' },
    expectedRevision: aggregate.caseV2.revision,
    type: 'RespondSupplement',
    payload: { supplementId, note: String(payload.reply.note ?? '独立副本回复') },
  }, () => ({
    summary: `应用独立副本补件回复 ${supplementId}`,
    mutate: (draft) => {
      draft.supplements = draft.supplements.map((request) => (request.id === supplementId
        ? { ...request, status: 'responded', responses: [...request.responses, { id: `resp-${Date.now()}`, documentVersionIds: (payload.reply.documentVersionIds as string[] | undefined) ?? [], note: String(payload.reply.note ?? '独立副本回复'), at: new Date().toISOString(), actor: payload.actor.actorId }] }
        : request))
    },
  }))) as { ok: boolean; message?: string }
  return outcome.ok
    ? { actionId: pkgPackageIdOf(payload), caseId: payload.caseId, status: 'accepted', message: '补件回复已应用（事务落盘）' }
    : { actionId: pkgPackageIdOf(payload), caseId: payload.caseId, status: 'rejected', message: outcome.message ?? '应用失败' }
}

function pkgPackageIdOf(payload: RoundTripPayload): string {
  return `rt-${payload.kind}-${payload.caseId}-${payload.actor.actorId}`
}

/**
 * G07 发送流程：先把 outbox 条目落盘（pending），再事务应用，最后写终态。
 * 重复发送：同 packageId + 同载荷 → 已 accepted 直接 duplicate（跨进程持久幂等）；
 * 载荷漂移 → 拒绝。
 */
export async function importRoundTripPackage(pkg: ReturnType<typeof exportHandoffPackage>): Promise<RoundTripReceipt> {
  const checked = importHandoffPackage<RoundTripPayload>(pkg as never)
  const payload = checked.ok ? checked.payload : (pkg.payload as RoundTripPayload)
  const packageId = pkg.packageId
  const hash = replyHashOf(payload)
  const existing = readOutboxEntry(packageId)
  if (existing && existing.status === 'accepted') {
    if (existing.replyHash !== hash) return { actionId: packageId, caseId: existing.caseId, status: 'rejected', message: '同 packageId 载荷漂移，拒绝覆盖' }
    return { actionId: packageId, caseId: existing.caseId, status: 'duplicate', message: '重复包：已应用过（持久回执，不重复计票）' }
  }
  // 发送前持久化 pending（G08）
  const entry: RoundTripOutboxEntry = existing && existing.replyHash === hash
    ? { ...existing, attempts: existing.attempts + 1 }
    : { packageId, kind: payload.kind, caseId: payload.caseId, actor: payload.actor.actorId, replyHash: hash, status: 'pending', attempts: 1 }
  if (existing && existing.replyHash !== hash) {
    entry.status = 'rejected'
    entry.message = '同 packageId 载荷漂移，拒绝覆盖'
    writeOutboxEntry(entry)
    return { actionId: packageId, caseId: payload.caseId, status: 'rejected', message: entry.message }
  }
  writeOutboxEntry(entry)
  const receipt = await applyRoundTripPackage(pkg)
  // 终态回执写回 outbox（accepted → 幂等；rejected 可重试）
  entry.status = receipt.status
  entry.message = receipt.message
  if (receipt.status === 'accepted') entry.appliedAt = new Date().toISOString()
  writeOutboxEntry(entry)
  return receipt
}

// ===== G09：公开报告投影（角色输出；内部意见不公开，judge 侧匿名） =====

/** 匿名映射：judge 视角学生实名 → 学员#短哈希（稳定，不随导出次数变化） */
export function anonymizeName(realName: string): string {
  return `学员#${createHash('sha256').update(realName).digest('hex').slice(0, 6)}`
}

export interface PublicReportInput {
  title: string
  fields: Record<string, unknown>
  decisions: Array<{ result: string; reason: string; finality?: string }>
  supplements: Array<{ reason: string; status: string }>
  internalNotes?: string[]
}

/** 公开报告（纯文本 MD）：student/judge 视角不含 internalNotes；judge 看到匿名标题 */
export function buildPublicReport(input: PublicReportInput, audience: 'student' | 'judge'): string {
  const lines: string[] = []
  const title = audience === 'judge' ? anonymizeName(input.title) : input.title
  lines.push(`# 审核结果（${audience === 'judge' ? '评委' : '学生'}公开版）`)
  lines.push('')
  lines.push(`**案卷**：${title}`)
  lines.push('')
  lines.push('## 决定')
  for (const decision of input.decisions) {
    lines.push(`- ${decision.result}${decision.finality === 'final' ? '（终审）' : ''}：${decision.reason}`)
  }
  lines.push('')
  lines.push('## 补件事项')
  for (const supplement of input.supplements) {
    lines.push(`- ${supplement.reason}（${supplement.status}）`)
  }
  if (audience === 'student' || audience === 'judge') {
    // 内部意见一律不进公开报告（G09）
    lines.push('')
    lines.push('---')
    lines.push('内部审核意见不在公开版本中提供。')
  }
  void input.fields
  return lines.join('\n')
}
