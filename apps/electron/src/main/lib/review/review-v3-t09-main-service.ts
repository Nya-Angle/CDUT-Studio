/**
 * T09 离线包 Main 桥接（Local-L04）。
 *
 * 职责边界（计划 §5 T09）：
 * - 签发：Main 用真实 CaseAggregate 生成任务包并落盘；包内的 recipient 是
 *   **声明**，不是登录身份，不能据此获得校方权限。
 * - 导入：先校验（哈希/锁定/版本/收件人），附件**先登记为真实 DocumentVersion**，
 *   再作为 T05 补件答复原子写入；`actionId` 幂等，重复导入返回既有回执。
 * - 不重写 T09 编解码：全部复用 `review-v3-t09-offline-codec` 的既有纯函数。
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { getConfigDir } from '../config-paths'
import { assertSafeReviewStorageId } from './review-storage-id'
import {
  importT09Reply, previewT09Reply, readT09File, unpackT09Asset,
  type T09Preview, type T09Receipt, type T09ReplyPackage, type T09State, type T09TaskPackage,
} from './review-v3-t09-offline-codec'
import { issueT09StudentFromCase } from './review-v3-t09-offline-issuer'
import type { CaseAggregateV2, TemplateVersion } from '@profer/shared'

/**
 * Public fields are a Main-only decision, never a renderer-supplied permission.
 * Reject nonpublished/mismatched templates rather than trusting stale policy.
 */
export function t09PublishedStudentVisibility(
  aggregate: CaseAggregateV2, template: TemplateVersion | undefined,
): Record<string, 'public' | 'internal'> {
  if (!template || template.status !== 'published' ||
      template.templateId !== aggregate.caseV2.templateId ||
      template.version !== aggregate.caseV2.templateVersion) {
    throw new Error('T09_PUBLIC_TEMPLATE_NOT_PUBLISHED')
  }
  const visibility: Record<string, 'public' | 'internal'> = {}
  for (const field of template.fields) {
    visibility[field.key] = field.visibility === 'public' ? 'public' : 'internal'
  }
  return visibility
}

function offlineDir(caseId: string): string {
  assertSafeReviewStorageId(caseId, 'caseId')
  return join(getConfigDir(), 'review-offline', caseId)
}

function writeAtomic(filePath: string, data: unknown): void {
  const tmp = `${filePath}.${Math.random().toString(36).slice(2, 8)}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  renameSync(tmp, filePath)
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

/** 已签发任务包：按 packageId 保存，供回件校验原任务。 */
export function saveT09TaskPackage(caseId: string, pkg: T09TaskPackage): void {
  const dir = join(offlineDir(caseId), 'tasks')
  ensureDir(dir)
  writeAtomic(join(dir, `${pkg.packageId}.json`), pkg)
}

export function readT09TaskPackage(caseId: string, packageId: string): T09TaskPackage | undefined {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(packageId)) return undefined
  const filePath = join(offlineDir(caseId), 'tasks', `${packageId}.json`)
  if (!existsSync(filePath)) return undefined
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T09TaskPackage
}

/** 回执按 actionId 幂等保存。 */
function receiptsPath(caseId: string): string {
  return join(offlineDir(caseId), 'receipts.json')
}

export function readT09Receipt(caseId: string, actionId: string): T09Receipt | undefined {
  const filePath = receiptsPath(caseId)
  if (!existsSync(filePath)) return undefined
  try {
    const all = JSON.parse(readFileSync(filePath, 'utf-8')) as Record<string, T09Receipt>
    return all[actionId]
  } catch { return undefined }
}

export function saveT09Receipt(caseId: string, receipt: T09Receipt): void {
  const filePath = receiptsPath(caseId)
  const all = existsSync(filePath)
    ? (() => { try { return JSON.parse(readFileSync(filePath, 'utf-8')) as Record<string, T09Receipt> } catch { return {} } })()
    : {}
  all[receipt.actionId] = receipt
  writeAtomic(filePath, all)
}

/**
 * 学生回件的 staging 账本（OFF-01/03）。
 *
 * 为什么需要它：附件登记与补件答复是两个独立 Case CAS，外层 receipts.json 又是
 * 第三次写盘。没有 staging 时，第 N 份附件失败、补件成功后回执写盘前崩溃，都会
 * 让“哪份附件属于哪次离线答复、该回件是否已应用”失去唯一锚点。
 *
 * 约束：
 * - 以 actionId 为键，requestHash 绑定载荷，载荷漂移直接拒绝；
 * - 每登记一份附件就落盘，崩溃后重试复用已登记 versionId，不再复制材料；
 * - 业务写入前记 `applying`，成功后才记 `applied`；`applied` 即使 receipts.json
 *   丢失也能恢复出原回执（不重复答复）；
 * - `applying` 且无法核验时返回“待核验”，绝不静默重复写。
 */
export interface T09StagedAsset {
  name: string
  mimeType: string
  sha256: string
  versionId: string
  /**
   * 回件包内的附件序号：重试按序号复用，同名同内容的两份文件不会互相顶替。
   * 旧版本 staging 没有该字段；读取时按可选处理并回退到同名+同哈希匹配。
   */
  index?: number
  /** 该附件登记完成后的案卷 revision（Main 回读的真实值）。 */
  revision?: number
}

export interface T09StagingRecord {
  actionId: string
  caseId: string
  requestHash: string
  supplementId: string
  /** 预览确认的版本：外部并发以它为基线判定。 */
  baseRevision: number
  /**
   * 本 action 自己登记附件后推进到的准确 revision。
   * 崩溃后重试以它判定「案卷是否只被本 action 推进过」，不能无条件取最新版本。
   */
  stagedRevision?: number
  status: 'staged' | 'applying' | 'applied'
  assets: T09StagedAsset[]
  appliedRevision?: number
  updatedAt: string
}

function stagingDir(caseId: string): string {
  return join(offlineDir(caseId), 'staging')
}

export function readT09Staging(caseId: string, actionId: string): T09StagingRecord | undefined {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(actionId)) return undefined
  const filePath = join(stagingDir(caseId), `${actionId}.json`)
  if (!existsSync(filePath)) return undefined
  try { return JSON.parse(readFileSync(filePath, 'utf-8')) as T09StagingRecord } catch { return undefined }
}

function saveT09Staging(caseId: string, record: T09StagingRecord): void {
  ensureDir(stagingDir(caseId))
  writeAtomic(join(stagingDir(caseId), `${record.actionId}.json`), { ...record, updatedAt: new Date().toISOString() })
}

/** 由 staging 的 applied 记录重建回执：这是 receipts.json 丢失后的恢复锚点。 */
function stagingReceipt(caseId: string, actionId: string): T09Receipt | undefined {
  const staged = readT09Staging(caseId, actionId)
  if (!staged || staged.status !== 'applied') return undefined
  return { actionId, hash: staged.requestHash, caseId: staged.caseId, status: 'accepted', newRevision: staged.appliedRevision }
}

/** 由真实案卷构造离线校验状态（不含任何虚构身份）。 */
export function buildT09State(aggregate: import('@profer/shared').CaseAggregateV2): T09State {
  const supplements: T09State['supplements'] = {}
  for (const request of aggregate.supplements ?? []) {
    supplements[request.id] = (request.status ?? 'open') as T09State['supplements'][string]
  }
  return {
    caseId: aggregate.caseV2.id,
    revision: aggregate.caseV2.revision,
    lock: {
      templateId: aggregate.caseV2.templateId,
      templateVersion: aggregate.caseV2.templateVersion,
      // 显式空数组：packages 里的 lock 用 canonical 比较，undefined 与 [] 不等
      policyVersionIds: [],
    },
    supplements,
    assignments: {},
  }
}

export interface T09IssueResult {
  packageId: string
  actionId: string
  /** 可直接交给离线编辑器的 JSON 文本 */
  json: string
}

/** 签发学生应答包（补件场景）。 */
export function issueT09StudentPackage(input: {
  aggregate: import('@profer/shared').CaseAggregateV2
  supplementId: string
  recipientId: string
  fieldVisibility?: Record<string, 'public' | 'internal'>
}): T09IssueResult {
  const pkg = issueT09StudentFromCase(
    input.aggregate,
    input.recipientId,
    input.supplementId,
    input.fieldVisibility ?? {},
    [],
  )
  saveT09TaskPackage(input.aggregate.caseV2.id, pkg)
  return { packageId: pkg.packageId, actionId: pkg.actionId, json: JSON.stringify(pkg, null, 2) }
}

/** 预览回件：只做校验，不写任何业务状态。 */
export function previewT09Package(input: {
  aggregate: import('@profer/shared').CaseAggregateV2
  packageJson: string
}): { preview: T09Preview; task?: T09TaskPackage } {
  const parsed = readT09File(input.packageJson)
  if (parsed.type !== 'reply') throw new Error('T09_NOT_A_REPLY_PACKAGE')
  const task = readT09TaskPackage(input.aggregate.caseV2.id, parsed.requestPackageId)
  if (!task) throw new Error('T09_TASK_PACKAGE_NOT_FOUND')
  const preview = previewT09Reply(parsed, task, buildT09State(input.aggregate))
  // 崩溃续跑：案卷 revision 是本 action 自己登记附件推进的，不是外部并发。
  // 仅当 live revision 正好等于 staging 记录的 stagedRevision 时，才把预览
  // 显示为可导入，并说明导入将按该版本续跑（不会被当成旧预览版本拒绝）。
  if (preview.status === 'conflict') {
    const staged = readT09Staging(input.aggregate.caseV2.id, parsed.actionId)
    const ownPartial = staged && staged.requestHash === parsed.hash
      && staged.assets.length > 0 && staged.stagedRevision === input.aggregate.caseV2.revision
    if (ownPartial && staged) {
      const structural = previewT09Reply(parsed, task,
        { ...buildT09State(input.aggregate), revision: parsed.baseRevision })
      if (structural.status === 'ready') {
        return { preview: { ...structural, details: [
          ...structural.details,
          `本次回件已登记 ${staged.assets.length} 份附件（案卷 revision 已由本 action 推进到 ${staged.stagedRevision}）；导入将按该版本续跑，不会重复登记`,
        ] }, task }
      }
    }
  }
  return { preview, task }
}

/** 一次附件登记的真实结果（Main 回读案卷，不是 Renderer 自报）。 */
export interface T09AssetRegistration {
  versionId: string
  /**
   * 本次登记完成后的案卷 revision。
   * 附件登记本身就是一次案卷事务，会推进 revision；补件答复的 CAS 必须用这个
   * 「本 action 自己推进后」的准确版本，而不是预览时的旧版本。
   */
  revision: number
}

export interface T09ImportDeps {
  readAggregate: (caseId: string) => import('@profer/shared').CaseAggregateV2 | undefined
  /**
   * 把附件字节登记为真实 DocumentVersion，并回报登记后的案卷 revision。
   * meta 只用于归属：actionId 让原件可回溯到这次离线答复，displayName 是
   * 用户原始文件名（不得被临时文件 UUID 前缀替代）。
   */
  registerAsset: (caseId: string, name: string, mimeType: string, bytes: Uint8Array,
    meta?: { actionId: string; index: number; displayName: string; materialSlotId?: string }) => Promise<T09AssetRegistration>
  /**
   * 原子答复补件。expectedRevision 必须是「预览版本 + 本 action 已登记附件推进的
   * 准确版本」；Main 侧据此 CAS，不得在写入前无条件重读最新版本覆盖外部并发。
   */
  respondSupplement: (caseId: string, supplementId: string, note: string,
    documentVersionIds: string[], expectedRevision: number,
    meta?: { actionId: string }) => Promise<{ ok: boolean; message?: string }>
  /**
   * 可选：崩溃恢复时核验该 actionId 是否已经真正写入补件答复（例如按 actionId
   * 查事务回执）。未提供时，处于 applying 的导入返回“待核验”，既不重复写也不假装成功。
   */
  verifyApplied?: (input: { caseId: string; supplementId: string; actionId: string; requestHash: string })
    => { applied: boolean; revision?: number } | undefined
}

interface T09ApplyOutcome {
  receipt: T09Receipt
  /** 业务写入在更早的尝试里已经生效（崩溃恢复核验命中），本次没有重复写。 */
  duplicate: boolean
}

/**
 * 执行「附件先登记 + 补件原子答复」。
 *
 * `baseRevision` 是本次允许写入的基线：
 * - 首次导入 = 预览确认的 revision；
 * - 崩溃续跑 = staging 记录的 `stagedRevision`（本 action 自己上次推进到的准确版本）。
 *
 * 任何一步发现案卷版本偏离基线（外部并发写入），立即失败关闭并保留 staging，
 * 绝不改成「读取最新 revision 再写」。
 */
async function applyT09StudentReply(input: {
  caseId: string
  reply: T09ReplyPackage
  baseRevision: number
  deps: T09ImportDeps
}): Promise<T09ApplyOutcome> {
  const { caseId, reply, deps } = input
  const reject = (message: string): T09Receipt => ({ actionId: reply.actionId, hash: reply.hash,
    caseId: reply.caseId, status: 'rejected', message })
  if (reply.reply.kind !== 'student-reply') {
    return { duplicate: false, receipt: reject('评委评分包尚未接入本地评分写入') }
  }
  const supplementId = reply.reply.supplementId

  const existing = readT09Staging(caseId, reply.actionId)
  if (existing && existing.requestHash !== reply.hash) {
    return { duplicate: false, receipt: reject('T09_ACTION_PAYLOAD_DRIFT: 相同 actionId 的载荷与首次导入不一致') }
  }
  if (existing?.status === 'applied') {
    // 双保险：lookup 已处理，这里防止竞态重复进入。
    return { duplicate: true, receipt: { actionId: reply.actionId, hash: reply.hash, caseId: reply.caseId,
      status: 'accepted', newRevision: existing.appliedRevision } }
  }
  if (existing?.status === 'applying') {
    // 上次中断在“业务写入”阶段：先按耐久回执核验是否已生效，绝不再写一遍。
    // 此时 live revision 可能是基线（未写成）或基线+1（已写成），不能先做相等判断。
    const verified = deps.verifyApplied?.({
      caseId: reply.caseId, supplementId, actionId: reply.actionId, requestHash: reply.hash,
    })
    if (!verified) {
      return { duplicate: false, receipt: reject(
        'T09_RECOVERY_UNCERTAIN: 上次导入在业务写入中断，需先核验补件答复是否已生效') }
    }
    if (verified.applied) {
      saveT09Staging(caseId, { ...existing, status: 'applied', appliedRevision: verified.revision })
      return { duplicate: true, receipt: { actionId: reply.actionId, hash: reply.hash, caseId: reply.caseId,
        status: 'accepted', newRevision: verified.revision } }
    }
  }

  // OFF-02：写入前案卷必须仍停在本 action 已知的基线；外部并发已推进则拒绝。
  const live = deps.readAggregate(reply.caseId)
  if (!live) throw new Error('T09_CASE_NOT_FOUND')
  if (live.caseV2.revision !== input.baseRevision) {
    return { duplicate: false, receipt: reject(
      `T09_REVISION_CHANGED: 预览版本 ${input.baseRevision} 已变为 ${live.caseV2.revision}，请重新预览后再导入`) }
  }

  const staged: T09StagingRecord = existing ?? {
    actionId: reply.actionId, caseId: reply.caseId, requestHash: reply.hash,
    supplementId, baseRevision: input.baseRevision,
    status: 'staged', assets: [], updatedAt: new Date().toISOString(),
  }
  // 续跑前核验：上次已登记的附件必须仍在案卷有效材料里，否则不能声称已有新材料。
  if (staged.assets.length > 0) {
    const activeVersions = new Set((live.caseV2.documents ?? [])
      .filter((document) => document.active !== false)
      .map((document) => document.versionId))
    const missing = staged.assets.find((asset) => !activeVersions.has(asset.versionId))
    if (missing) {
      return { duplicate: false, receipt: reject(
        'T09_STAGED_ASSET_MISSING: 上次已登记的附件已不在案卷有效材料中，请重新预览后再导入') }
    }
  }

  // OFF-05：附件归属以补件请求声明的材料槽为准（Main 从案卷读取，不是渲染层自选）。
  const supplement = (deps.readAggregate(reply.caseId)?.supplements ?? []).find((item) => item.id === supplementId)
  const targetSlotId = supplement?.materialSlotId
  // 1) 附件先成为真实 DocumentVersion；同一 actionId 已登记的附件按序号复用。
  let ownRevision = input.baseRevision
  const versionIds: string[] = []
  for (const [index, asset] of reply.reply.assets.entries()) {
    // 旧版本 staging 没有 index 字段：按“同名 + 同哈希”回退匹配，避免升级后
    // 重试把已登记附件再复制一份。
    const prior = staged.assets.find((item) => item.index === index)
      ?? staged.assets.find((item) => item.index === undefined
        && item.sha256 === asset.sha256 && item.name === asset.name)
    if (prior) {
      if (prior.sha256 !== asset.sha256 || prior.name !== asset.name) {
        return { duplicate: false, receipt: reject('T09_ACTION_PAYLOAD_DRIFT: 相同 actionId 的附件载荷与首次导入不一致') }
      }
      versionIds.push(prior.versionId)
      continue
    }
    // 登记前确认案卷仍停在本 action 已知版本，避免把外部并发写入算成自己的推进。
    const before = deps.readAggregate(reply.caseId)
    if (!before || before.caseV2.revision !== ownRevision) {
      saveT09Staging(caseId, { ...staged, status: 'staged' })
      return { duplicate: false, receipt: reject(
        `T09_REVISION_CHANGED: 附件登记前案卷已被其他操作更新（期望 ${ownRevision}，当前 ${before?.caseV2.revision ?? '未知'}），请重新预览后再导入`) }
    }
    const bytes = unpackT09Asset(asset)
    const registered = await deps.registerAsset(reply.caseId, asset.name, asset.mimeType, bytes,
      { actionId: reply.actionId, index, displayName: asset.name, ...(targetSlotId ? { materialSlotId: targetSlotId } : {}) })
    // 本 action 一次登记只应推进一个 revision；其它推进说明有外部写入穿插，必须失败关闭。
    if (!Number.isSafeInteger(registered.revision) || registered.revision !== ownRevision + 1) {
      saveT09Staging(caseId, { ...staged, status: 'staged' })
      return { duplicate: false, receipt: reject(
        `T09_REVISION_CHANGED: 附件登记期间案卷被其他操作更新（期望 ${ownRevision + 1}，实际 ${registered.revision}），请重新预览后再导入`) }
    }
    ownRevision = registered.revision
    staged.assets.push({ name: asset.name, mimeType: asset.mimeType, sha256: asset.sha256,
      versionId: registered.versionId, index, revision: ownRevision })
    staged.stagedRevision = ownRevision
    saveT09Staging(caseId, staged)
    versionIds.push(registered.versionId)
  }

  // 2) 记下“正在写入”，再执行补件 CAS；成功前不得对外宣称已应用。
  staged.status = 'applying'
  staged.stagedRevision = ownRevision
  saveT09Staging(caseId, staged)
  const written = await deps.respondSupplement(reply.caseId, supplementId, reply.reply.note,
    versionIds, ownRevision, { actionId: reply.actionId })
  if (!written.ok) {
    // 保留 staged（含已登记 versionId），重试不再复制材料。
    saveT09Staging(caseId, { ...staged, status: 'staged' })
    return { duplicate: false, receipt: reject(written.message ?? '补件答复写入失败') }
  }
  const current = deps.readAggregate(reply.caseId)
  const appliedRevision = current?.caseV2.revision
  saveT09Staging(caseId, { ...staged, status: 'applied', appliedRevision })
  return { duplicate: false, receipt: {
    actionId: reply.actionId, hash: reply.hash, caseId: reply.caseId,
    status: 'accepted', newRevision: appliedRevision,
  } }
}

/**
 * 导入回件：幂等 + 附件先登记为原件 + 再原子答复补件 + staging 恢复锚点。
 *
 * 顺序不可颠倒：附件未成为 DocumentVersion 之前，补件答复不得写入，
 * 否则补件会声称「已有新材料」而案卷里查不到。
 *
 * 事务边界（OFF-01/02/03）：
 * 1. 首次导入以预览确认的 revision 为基线；附件登记会真实推进 revision，
 *    因此补件答复使用「本 action 自己登记后的准确 revision」做 CAS，
 *    既不沿用旧预览版本，也不无条件读取最新版本；
 * 2. 每一步都要求案卷仍停在本 action 已知版本；外部并发写入一律拒绝；
 * 3. 附件按 actionId + 序号记入 staging，重试复用已登记 versionId，不重复登记副本；
 * 4. 崩溃后若 revision 已被本 action 推进，按 staging 的 stagedRevision 续跑；
 *    `applying` 且无法核验时返回“待核验”，绝不静默重复写；
 * 5. 业务成功后才把 staging 标为 applied；receipts.json 丢失时据此恢复 duplicate；
 * 6. 失败保留 staged，成功/失败后都清理过期的临时落盘文件。
 */
export async function importT09Package(input: {
  caseId: string
  packageJson: string
  deps: T09ImportDeps
}): Promise<{ status: 'accepted' | 'duplicate'; receipt: T09Receipt } | { status: 'conflict' | 'rejected'; preview: T09Preview }> {
  const aggregate = input.deps.readAggregate(input.caseId)
  if (!aggregate) throw new Error('T09_CASE_NOT_FOUND')
  const parsed = readT09File(input.packageJson)
  if (parsed.type !== 'reply') throw new Error('T09_NOT_A_REPLY_PACKAGE')
  const task = readT09TaskPackage(input.caseId, parsed.requestPackageId)
  if (!task) throw new Error('T09_TASK_PACKAGE_NOT_FOUND')

  // 崩溃续跑：本 action 已登记过附件时，案卷 revision 是它自己推进的，
  // 不能再按「预览版本 == 当前版本」判成并发冲突。只有案卷仍停在本 action
  // 上次登记后的准确版本才续跑；被外部推进则失败关闭。
  const staged = readT09Staging(input.caseId, parsed.actionId)
  const resumeRevision = staged !== undefined && staged.requestHash === parsed.hash
    && (staged.status === 'staged' || staged.status === 'applying')
    && staged.assets.length > 0
    && Number.isSafeInteger(staged.stagedRevision)
    ? staged.stagedRevision : undefined
  if (resumeRevision !== undefined && staged) {
    if (parsed.caseId !== input.caseId || parsed.requestHash !== task.hash
      || parsed.baseRevision !== task.baseRevision) {
      return { status: 'rejected', preview: { status: 'rejected', caseId: parsed.caseId,
        actionId: parsed.actionId, baseRevision: parsed.baseRevision,
        currentRevision: aggregate.caseV2.revision, details: ['回件包与原任务包不匹配'] } }
    }
    const applied = await applyT09StudentReply({ caseId: input.caseId, reply: parsed,
      baseRevision: resumeRevision, deps: input.deps })
    try { pruneT09AssetTempRoot() } catch { /* 清理失败不影响业务结果 */ }
    if (applied.receipt.status === 'accepted') {
      saveT09Receipt(input.caseId, applied.receipt)
      return { status: applied.duplicate ? 'duplicate' : 'accepted', receipt: applied.receipt }
    }
    return { status: 'rejected', preview: { status: 'rejected', caseId: parsed.caseId,
      actionId: parsed.actionId, baseRevision: parsed.baseRevision,
      currentRevision: input.deps.readAggregate(input.caseId)?.caseV2.revision ?? aggregate.caseV2.revision,
      details: [applied.receipt.message ?? '业务写入未确认'] } }
  }

  const state = buildT09State(aggregate)
  const outcome = await importT09Reply(
    parsed,
    task,
    state,
    async (actionId) => readT09Receipt(input.caseId, actionId) ?? stagingReceipt(input.caseId, actionId),
    async (reply: T09ReplyPackage, expectedRevision: number) =>
      (await applyT09StudentReply({ caseId: input.caseId, reply, baseRevision: expectedRevision,
        deps: input.deps })).receipt,
  )
  // 无论成败都回收过期临时文件；成功路径同样清理（OFF-06）。
  try { pruneT09AssetTempRoot() } catch { /* 清理失败不影响业务结果 */ }
  if (outcome.status === 'accepted' || outcome.status === 'duplicate') {
    saveT09Receipt(input.caseId, outcome.receipt)
    return outcome
  }
  return outcome
}

/** 临时落盘目录（附件登记需要真实路径）。 */
export function t09AssetTempRoot(): string {
  const dir = join(tmpdir(), 'cdut-review-t09')
  ensureDir(dir)
  return dir
}

/**
 * 回收过期临时附件（OFF-06）。
 *
 * 原件已由材料服务复制进权威存储，临时文件只是导入中转。只删除超过 maxAgeMs
 * 的文件，避免误删并发导入正在读取的中转文件；长期残留因此有上界。
 * 逐文件的即时删除仍需 IPC 在 finally 中调用（见 handoffs/offline-IPC-REQUEST.md）。
 */
export function pruneT09AssetTempRoot(maxAgeMs = 60_000): number {
  const dir = join(tmpdir(), 'cdut-review-t09')
  if (!existsSync(dir)) return 0
  const now = Date.now()
  let removed = 0
  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry)
    try {
      const info = statSync(filePath)
      if (info.isFile() && now - info.mtimeMs > maxAgeMs) { unlinkSync(filePath); removed += 1 }
    } catch { /* 并发删除或权限问题：跳过 */ }
  }
  return removed
}
