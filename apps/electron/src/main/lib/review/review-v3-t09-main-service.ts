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
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
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
  return { preview: previewT09Reply(parsed, task, buildT09State(input.aggregate)), task }
}

export interface T09ImportDeps {
  readAggregate: (caseId: string) => import('@profer/shared').CaseAggregateV2 | undefined
  /** 把附件字节登记为真实 DocumentVersion，返回 versionId */
  registerAsset: (caseId: string, name: string, mimeType: string, bytes: Uint8Array) => Promise<string>
  /** 原子答复补件 */
  respondSupplement: (caseId: string, supplementId: string, note: string,
    documentVersionIds: string[], expectedRevision: number) => Promise<{ ok: boolean; message?: string }>
}

/**
 * 导入回件：幂等 + 附件先登记为原件 + 再原子答复补件。
 *
 * 顺序不可颠倒：附件未成为 DocumentVersion 之前，补件答复不得写入，
 * 否则补件会声称「已有新材料」而案卷里查不到。
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

  const state = buildT09State(aggregate)
  const outcome = await importT09Reply(
    parsed,
    task,
    state,
    async (actionId) => readT09Receipt(input.caseId, actionId),
    async (reply: T09ReplyPackage, expectedRevision: number) => {
      if (reply.reply.kind !== 'student-reply') {
        return { actionId: reply.actionId, hash: reply.hash, caseId: reply.caseId,
          status: 'rejected', message: '评委评分包尚未接入本地评分写入' } as T09Receipt
      }
      // 1) 附件先成为真实 DocumentVersion
      const versionIds: string[] = []
      for (const asset of reply.reply.assets) {
        const bytes = unpackT09Asset(asset)
        versionIds.push(await input.deps.registerAsset(reply.caseId, asset.name, asset.mimeType, bytes))
      }
      // 2) 再原子答复补件
      const written = await input.deps.respondSupplement(
        reply.caseId, reply.reply.supplementId, reply.reply.note, versionIds, expectedRevision,
      )
      if (!written.ok) {
        return { actionId: reply.actionId, hash: reply.hash, caseId: reply.caseId,
          status: 'rejected', message: written.message ?? '补件答复写入失败' } as T09Receipt
      }
      const current = input.deps.readAggregate(reply.caseId)
      return {
        actionId: reply.actionId, hash: reply.hash, caseId: reply.caseId,
        status: 'accepted', newRevision: current?.caseV2.revision,
      } as T09Receipt
    },
  )
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
