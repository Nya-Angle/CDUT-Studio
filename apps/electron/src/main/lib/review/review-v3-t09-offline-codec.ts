/**
 * T09: portable two-stage student supplement / independent judge reply.
 * A task is issued on the organizer's copy; its recipient creates a reply in
 * another copy; the organizer previews and explicitly applies via trusted Main.
 * SHA-256 detects corrupt/edited files; it is NOT authentication.
 */
import { createHash, randomUUID } from 'node:crypto'
import type { JudgeRating } from '@profer/shared'

export const T09_FORMAT = 'cdut-review-offline/1' as const
export type T09Role = 'student' | 'judge'
export type T09Lock = { templateId: string; templateVersion: number; policyVersionIds?: string[] }
export type T09Asset = { name: string; mimeType: string; dataBase64: string; sha256: string }
export type T09Task =
  | { kind: 'student-reply'; supplementId: string; reason: string; requiredElements: string[]; deadline?: string }
  | { kind: 'judge-rating-reply'; assignmentId: string; rubricVersion: number; dimensions: Array<{ id: string; title: string; min: number; max: number; allowNA: boolean }>; /** 新版 T07 评分回件必须锁定所属批次/轮次及签发时的案卷版本。 */ batchId?: string; round?: number; caseRevision?: number }
export type T09Reply =
  | { kind: 'student-reply'; supplementId: string; note: string; assets: T09Asset[] }
  | { kind: 'judge-rating-reply'; assignmentId: string; rubricVersion: number; scores: JudgeRating['scores']; publicFeedback: string; internalNotes?: string }
type T09Base = { format: typeof T09_FORMAT; packageId: string; actionId: string; caseId: string; baseRevision: number; lock: T09Lock; createdAt: string; hash: string }
export type T09TaskPackage = T09Base & { type: 'task'; recipient: { role: T09Role; actorId: string; actorSource: 'local' | 'mock' }; task: T09Task; publicContext: { title: string; fields: Record<string, unknown> }; assets: T09Asset[] }
export type T09ReplyPackage = T09Base & { type: 'reply'; requestPackageId: string; requestHash: string; respondent: T09TaskPackage['recipient']; reply: T09Reply }
export type T09Package = T09TaskPackage | T09ReplyPackage
export type T09State = {
  caseId: string; revision: number; lock: T09Lock
  supplements: Record<string, 'open' | 'responded' | 'insufficient' | 'satisfied' | 'cancelled'>
  assignments: Record<string, { reviewerId: string; rubricVersion: number; status: 'assigned' | 'submitted' | 'missing'; recused: boolean }>
  /** Main may supply a version-to-version summary for user-visible conflict preview. */
  changesSinceIssue?: Array<{ field: string; previous: string; current: string }>
}
export type T09Preview = { status: 'ready' | 'conflict' | 'rejected'; caseId: string; actionId: string; details: string[]; baseRevision: number; currentRevision: number }
export type T09Receipt = { actionId: string; hash: string; caseId: string; status: 'accepted' | 'rejected'; newRevision?: number; message?: string }

/** Object order is stable; array order stays meaningful. */
function canonical(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null'
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']'
  const o = v as Record<string, unknown>
  return '{' + Object.keys(o).filter(k => o[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + canonical(o[k])).join(',') + '}'
}
function digest(v: unknown): string { return createHash('sha256').update(canonical(v)).digest('hex') }
function seal<T extends Omit<T09Package, 'hash'>>(v: T): T & { hash: string } { return { ...v, hash: digest(v) } }
export function checkT09Package(pkg: T09Package): boolean {
  if (!pkg || pkg.format !== T09_FORMAT || !['task', 'reply'].includes(pkg.type) || typeof pkg.hash !== 'string') return false
  const { hash, ...payload } = pkg
  return digest(payload) === hash
}
export function packT09Asset(input: { name: string; mimeType: string; bytes: Uint8Array }): T09Asset {
  const bytes = Buffer.from(input.bytes)
  return { name: input.name, mimeType: input.mimeType, dataBase64: bytes.toString('base64'), sha256: createHash('sha256').update(bytes).digest('hex') }
}
export function unpackT09Asset(asset: T09Asset): Uint8Array {
  const bytes = Buffer.from(asset.dataBase64, 'base64')
  if (bytes.toString('base64') !== asset.dataBase64 || createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error('附件字节/哈希不匹配')
  return bytes
}
function checkAssets(assets: T09Asset[]): void {
  if (!Array.isArray(assets)) throw new Error('附件清单不正确')
  for (const asset of assets) unpackT09Asset(asset)
}
function roleFor(task: T09Task): T09Role { return task.kind === 'student-reply' ? 'student' : 'judge' }
function sameLock(a: T09Lock, b: T09Lock): boolean { return canonical(a) === canonical(b) }
function validLock(v: T09Lock): boolean { return !!v?.templateId && Number.isInteger(v.templateVersion) && v.templateVersion > 0 }

/** publicContext MUST be an audience-filtered projection, never a raw CaseAggregate. */
export function issueT09Task(input: {
  caseId: string; revision: number; lock: T09Lock; task: T09Task
  recipient: T09TaskPackage['recipient']; publicContext: T09TaskPackage['publicContext']; assets?: T09Asset[]
}): T09TaskPackage {
  if (!input.caseId || !Number.isInteger(input.revision) || input.revision < 0 || !validLock(input.lock)) throw new Error('案卷/模板版本不正确')
  if (roleFor(input.task) !== input.recipient.role || !input.recipient.actorId) throw new Error('收件人角色不符合任务')
  if (input.task.kind === 'student-reply' && !input.task.supplementId) throw new Error('没有指定补件任务')
  if (input.task.kind === 'judge-rating-reply' && (!input.task.assignmentId || !Number.isInteger(input.task.rubricVersion))) throw new Error('没有指定评分分配')
  if (input.task.kind === 'judge-rating-reply' && input.task.batchId !== undefined &&
    (!input.task.batchId || !Number.isInteger(input.task.round) || input.task.round! < 1 || !Number.isInteger(input.task.caseRevision) || input.task.caseRevision! < 0)) {
    throw new Error('评分批次/轮次/案卷版本绑定不完整')
  }
  checkAssets(input.assets ?? [])
  const body = { type: 'task' as const, format: T09_FORMAT, packageId: randomUUID(), actionId: randomUUID(),
    caseId: input.caseId, baseRevision: input.revision, lock: input.lock, createdAt: new Date().toISOString(),
    task: input.task, recipient: input.recipient, publicContext: input.publicContext, assets: input.assets ?? [] }
  return seal(body)
}
function checkReply(task: T09Task, reply: T09Reply): void {
  if (reply.kind !== task.kind) throw new Error('任务与回复类型不符')
  if (task.kind === 'student-reply' && reply.kind === 'student-reply') {
    if (reply.supplementId !== task.supplementId) throw new Error('补件请求 ID 不符')
    if (!reply.note.trim() && !reply.assets.length) throw new Error('请填写补件说明或添加材料')
    checkAssets(reply.assets)
  }
  if (task.kind === 'judge-rating-reply' && reply.kind === 'judge-rating-reply') {
    if (reply.assignmentId !== task.assignmentId || reply.rubricVersion !== task.rubricVersion) throw new Error('评分分配/量表版本不符')
    if (!Array.isArray(reply.scores) || reply.scores.length !== task.dimensions.length) throw new Error('评分维度不完整')
    const ids = new Set<string>()
    for (const score of reply.scores) {
      const dimension = task.dimensions.find(d => d.id === score.dimensionId)
      if (!dimension || ids.has(score.dimensionId)) throw new Error('包含未知或重复评分维度')
      ids.add(score.dimensionId)
      if (score.na) {
        if (!dimension.allowNA || score.score !== null) throw new Error('该维度不能标记 N/A')
      } else if (typeof score.score !== 'number' || !Number.isFinite(score.score) || score.score < dimension.min || score.score > dimension.max) throw new Error('评分为空或超出量表范围')
    }
  }
}
export function answerT09Task(task: T09TaskPackage, reply: T09Reply): T09ReplyPackage {
  if (!checkT09Package(task)) throw new Error('任务包损坏或被修改')
  checkAssets(task.assets)
  checkReply(task.task, reply)
  const body = { type: 'reply' as const, format: T09_FORMAT, packageId: randomUUID(), actionId: randomUUID(),
    caseId: task.caseId, baseRevision: task.baseRevision, lock: task.lock, createdAt: new Date().toISOString(),
    requestPackageId: task.packageId, requestHash: task.hash, respondent: task.recipient, reply }
  return seal(body)
}
export function writeT09File(pkg: T09Package): string {
  if (!checkT09Package(pkg)) throw new Error('包内容不正确')
  return JSON.stringify(pkg, null, 2)
}
export function readT09File(json: string): T09Package {
  const obj: unknown = JSON.parse(json)
  if (!obj || typeof obj !== 'object' || !checkT09Package(obj as T09Package)) throw new Error('不是有效的 T09 离线包或内容被修改')
  const pkg = obj as T09Package
  if (!pkg.caseId || !Number.isInteger(pkg.baseRevision) || !validLock(pkg.lock)) throw new Error('目标版本信息不完整')
  if (pkg.type === 'task') {
    if (roleFor(pkg.task) !== pkg.recipient.role) throw new Error('任务角色不符')
    if (pkg.task.kind === 'judge-rating-reply' && pkg.task.batchId !== undefined &&
      (!pkg.task.batchId || !Number.isInteger(pkg.task.round) || !Number.isInteger(pkg.task.caseRevision))) throw new Error('评分任务绑定不完整')
    checkAssets(pkg.assets)
  } else {
    if (!pkg.requestPackageId || !pkg.requestHash || !pkg.respondent?.actorId) throw new Error('回复缺少关联任务')
    if (pkg.reply.kind === 'student-reply') checkAssets(pkg.reply.assets)
  }
  return pkg
}
export function previewT09Reply(reply: T09ReplyPackage, task: T09TaskPackage, state: T09State): T09Preview {
  const details: string[] = []
  const base = { caseId: reply.caseId, actionId: reply.actionId, baseRevision: reply.baseRevision, currentRevision: state.revision }
  if (!checkT09Package(reply) || !checkT09Package(task)) details.push('包哈希无效')
  if (reply.requestPackageId !== task.packageId || reply.requestHash !== task.hash) details.push('找不到匹配的原任务包')
  if (reply.caseId !== task.caseId || reply.caseId !== state.caseId) details.push('目标案卷不一致')
  if (reply.respondent.actorId !== task.recipient.actorId || reply.respondent.role !== task.recipient.role || reply.respondent.actorSource !== task.recipient.actorSource) details.push('任务收件人与回复人不匹配')
  if (!sameLock(reply.lock, task.lock) || !sameLock(reply.lock, state.lock) || reply.baseRevision !== task.baseRevision) details.push('模板/政策/基础案卷版本不匹配')
  try { checkReply(task.task, reply.reply) } catch (error) { details.push(error instanceof Error ? error.message : String(error)) }
  if (details.length) return { ...base, status: 'rejected', details }
  if (state.revision !== reply.baseRevision) return { ...base, status: 'conflict', details: [
    '案卷版本已变化，不能覆盖新内容。请复核并重新发出任务包。',
    ...(state.changesSinceIssue ?? []).map(change => change.field + '：' + change.previous + ' → ' + change.current),
  ] }
  if (reply.reply.kind === 'student-reply') {
    if (!['open', 'insufficient'].includes(state.supplements[reply.reply.supplementId] ?? '')) return { ...base, status: 'conflict', details: ['补件请求已关闭或不存在'] }
    return { ...base, status: 'ready', details: ['补件：' + reply.reply.supplementId, reply.reply.note, '附加材料 ' + reply.reply.assets.length + ' 份'] }
  }
  const assignment = state.assignments[reply.reply.assignmentId]
  if (!assignment || assignment.recused || assignment.status !== 'assigned' || assignment.reviewerId !== reply.respondent.actorId || assignment.rubricVersion !== reply.reply.rubricVersion) {
    return { ...base, status: 'conflict', details: ['任务已回避、提交、取消，或评分版本/评委不匹配'] }
  }
  return { ...base, status: 'ready', details: ['分配：' + reply.reply.assignmentId, ...reply.reply.scores.map(s => s.dimensionId + '：' + (s.na ? 'N/A' : s.score))] }
}
/** Trusted Main supplies persisted actionId receipts + atomic command handler. */
export async function importT09Reply(
  reply: T09ReplyPackage, task: T09TaskPackage, state: T09State,
  lookup: (actionId: string) => Promise<T09Receipt | undefined>,
  apply: (reply: T09ReplyPackage, expectedRevision: number) => Promise<T09Receipt>,
): Promise<{ status: 'accepted' | 'duplicate'; receipt: T09Receipt } | { status: 'conflict' | 'rejected'; preview: T09Preview }> {
  const stored = await lookup(reply.actionId)
  if (stored) {
    if (stored.hash !== reply.hash || stored.caseId !== reply.caseId) return { status: 'rejected', preview: { status: 'rejected', caseId: reply.caseId, actionId: reply.actionId, baseRevision: reply.baseRevision, currentRevision: state.revision, details: ['相同 actionId 已使用不同载荷'] } }
    if (stored.status === 'accepted') return { status: 'duplicate', receipt: stored }
  }
  const preview = previewT09Reply(reply, task, state)
  if (preview.status !== 'ready') return { status: preview.status, preview }
  const outcome = await apply(reply, state.revision)
  if (outcome.actionId !== reply.actionId || outcome.hash !== reply.hash || outcome.caseId !== reply.caseId || outcome.status !== 'accepted') {
    return { status: 'rejected', preview: { ...preview, status: 'rejected', details: [outcome.message ?? '业务写入未确认'] } }
  }
  return { status: 'accepted', receipt: outcome }
}
