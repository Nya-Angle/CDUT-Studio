/**
 * 外部系统端口（M5，设计 03 §8 端口合同 + C 类本地模拟验收）
 *
 * 同一合同两种实现（S 类真实联调待外部条件，不在本轮）：
 * - MockSchoolAdapter：进程内模拟校方（幂等动作 ID、外部版本推进、可制造冲突）
 * - LocalPackageAdapter：离线包往返（U 盘场景），复用 exportHandoffPackage/importHandoffPackage
 * 合同：动作幂等（actionId 重复回放返回同一回执）、期望外部版本不符 → conflict（C02）
 */

import type { SyncReceipt } from '@profer/shared'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getConfigDir } from '../config-paths'
import { exportHandoffPackage, importHandoffPackage } from './report-service-v2'

/** 推送载荷：一次业务动作（决定/补件/名次）的离线可序列化快照 */
export interface PushPayload {
  caseId: string
  actionId: string
  actionKind: 'decision' | 'supplement' | 'roster' | 'rating-matrix'
  /** 推送方持有的外部版本；mock 校方版本更高 → conflict */
  baseExternalRevision: number
  body: Record<string, unknown>
}

/** 校方端口合同（Mock/Local/未来真实 SDK 共用） */
export interface SchoolPort {
  readonly kind: 'mock' | 'offline-package' | 'school'
  push(payload: PushPayload): Promise<SyncReceipt>
}

/** 可替换的外部读取能力，不要求真实学校提供尚未授权的 API。 */
export interface ExternalCaseSnapshot {
  caseId: string
  externalId: string
  revision: number
  fields: Record<string, unknown>
  source: 'mock' | 'school'
}
export interface ExternalTaskSnapshot {
  id: string
  caseId: string
  role: 'student' | 'judge' | 'reviewer'
  actorId: string
  status: 'open' | 'completed'
  title: string
}
export interface ExternalVerification {
  reference: string
  result: 'verified' | 'rejected' | 'unknown'
  source: 'mock' | 'school'
  detail?: string
}
export interface SchoolReadPort extends SchoolPort {
  capabilities(): { tasks: boolean; identity: boolean; verification: boolean; push: boolean; source: 'mock' | 'school' }
  fetchCase(caseId: string): Promise<ExternalCaseSnapshot | undefined>
  listTasks(caseId: string): Promise<ExternalTaskSnapshot[]>
  verify(reference: string): Promise<ExternalVerification>
  getReceipt(actionId: string): Promise<SyncReceipt | undefined>
}

/** Mock 校方：内存状态（caseId → externalRevision），动作幂等 */
export class MockSchoolAdapter implements SchoolReadPort {
  readonly kind = 'mock' as const
  private revisions = new Map<string, number>()
  private receipts = new Map<string, SyncReceipt>()
  private payloadHashes = new Map<string, string>()
  private cases = new Map<string, ExternalCaseSnapshot>()
  private tasks = new Map<string, ExternalTaskSnapshot[]>()
  private verifications = new Map<string, ExternalVerification>()
  private online = true

  setOnline(value: boolean): void { this.online = value }
  seedCase(caseId: string, externalId: string, fields: Record<string, unknown>, revision = 0): void {
    this.cases.set(caseId, { caseId, externalId, fields, revision, source: 'mock' })
    this.revisions.set(caseId, revision)
  }
  seedTask(task: ExternalTaskSnapshot): void {
    this.tasks.set(task.caseId, [...(this.tasks.get(task.caseId) ?? []), task])
  }
  seedVerification(reference: string, result: ExternalVerification['result'], detail?: string): void {
    this.verifications.set(reference, { reference, result, detail, source: 'mock' })
  }
  capabilities() { return { tasks: true, identity: false, verification: true, push: true, source: 'mock' as const } }
  private ensureOnline(): void { if (!this.online) throw new Error('MOCK_PORT_OFFLINE: 模拟外部服务当前断开') }
  async fetchCase(caseId: string) { this.ensureOnline(); return this.cases.get(caseId) }
  async listTasks(caseId: string) { this.ensureOnline(); return [...(this.tasks.get(caseId) ?? [])] }
  async verify(reference: string): Promise<ExternalVerification> {
    this.ensureOnline(); return this.verifications.get(reference) ?? { reference, result: 'unknown', source: 'mock' }
  }
  async getReceipt(actionId: string) { this.ensureOnline(); return this.receipts.get(actionId) }
  /** 测试注入口：把某案卷的外部版本拨到指定值（制造冲突） */
  seedRevision(caseId: string, revision: number): void {
    this.revisions.set(caseId, revision)
    const found = this.cases.get(caseId)
    if (found) this.cases.set(caseId, { ...found, revision })
  }

  async push(payload: PushPayload): Promise<SyncReceipt> {
    this.ensureOnline()
    // 幂等应包含载荷身份：同一 actionId 不允许改内容。
    const currentHash = pushHash(payload)
    const existing = this.receipts.get(payload.actionId)
    if (existing) {
      if (this.payloadHashes.get(payload.actionId) === currentHash) return existing
      return { ...existing, status: 'rejected', externalReceipt: { receivedAt: new Date().toISOString(), message: '同 actionId 载荷漂移' } }
    }
    const current = this.revisions.get(payload.caseId) ?? 0
    if (payload.baseExternalRevision !== current) {
      const receipt: SyncReceipt = {
        id: `rcp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        actionId: payload.actionId,
        externalSystem: 'mock-school',
        caseId: payload.caseId,
        expectedExternalRevision: payload.baseExternalRevision,
        payloadHash: currentHash,
        status: 'conflict',
        externalReceipt: { receivedAt: new Date().toISOString(), message: `外部版本已推进：当前 ${current}，推送方持有 ${payload.baseExternalRevision}` },
      }
      return receipt
    }
    this.revisions.set(payload.caseId, current + 1)
    const caseView = this.cases.get(payload.caseId)
    if (caseView) this.cases.set(payload.caseId, { ...caseView, revision: current + 1 })
    const receipt: SyncReceipt = {
      id: `rcp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actionId: payload.actionId,
      externalSystem: 'mock-school',
      caseId: payload.caseId,
      expectedExternalRevision: current,
      payloadHash: currentHash,
      status: 'accepted',
      externalReceipt: { receivedAt: new Date().toISOString(), externalId: `ext-${payload.caseId}-${current + 1}` },
    }
    this.receipts.set(payload.actionId, receipt)
    this.payloadHashes.set(payload.actionId, currentHash)
    return receipt
  }
}

/**
 * The local adapter is a real two-stage outbox, not a self-verifying mock.
 * push() only ISSUES a portable file; acceptance requires an independently
 * returned acknowledgement imported with confirm(). Both survive restart.
 */
export interface OfflinePortAcknowledgement {
  /** Generic handoff importer also checks this revision when supplied. */
  externalRevision?: number
  actionId: string
  caseId: string
  requestHash: string
  baseExternalRevision: number
  accepted: boolean
  note?: string
}
type IssuedPush = {
  package: ReturnType<typeof exportHandoffPackage<PushPayload & { externalRevision: number }>>
  receipt: SyncReceipt
  payloadHash: string
}
function pushHash(payload: PushPayload): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}
function issuedFile(actionId: string): string {
  const root = join(getConfigDir(), 'sync-outbox', 'offline-port')
  mkdirSync(root, { recursive: true })
  // An action ID is not a filesystem path.
  return join(root, createHash('sha256').update(actionId).digest('hex') + '.json')
}
function readIssued(actionId: string): IssuedPush | undefined {
  const file = issuedFile(actionId)
  if (!existsSync(file)) return undefined
  return JSON.parse(readFileSync(file, 'utf-8')) as IssuedPush
}
function saveIssued(actionId: string, value: IssuedPush): void {
  const path = issuedFile(actionId)
  const temp = path + '.tmp'
  writeFileSync(temp, JSON.stringify(value, null, 2))
  renameSync(temp, path)
}
export class LocalPackageAdapter implements SchoolPort {
  readonly kind = 'offline-package' as const
  constructor(private readonly externalRevision: (caseId: string) => number) {}

  async push(payload: PushPayload): Promise<SyncReceipt> {
    const payloadHash = pushHash(payload)
    const previous = readIssued(payload.actionId)
    if (previous) {
      if (previous.payloadHash !== payloadHash) return {
        ...previous.receipt, status: 'rejected',
        externalReceipt: { receivedAt: new Date().toISOString(), message: '相同 actionId 的载荷不同，拒绝覆盖' },
      }
      return previous.receipt
    }
    const current = this.externalRevision(payload.caseId)
    if (current !== payload.baseExternalRevision) return {
      id: 'conflict-' + payload.actionId, actionId: payload.actionId, caseId: payload.caseId,
      externalSystem: 'offline-package', expectedExternalRevision: payload.baseExternalRevision,
      payloadHash, status: 'conflict',
      externalReceipt: { receivedAt: new Date().toISOString(), message: '外部版本不一致，请重新导出' },
    }
    const pkg = exportHandoffPackage({ ...payload, externalRevision: current })
    const receipt: SyncReceipt = {
      id: 'pending-' + pkg.packageId, actionId: payload.actionId, caseId: payload.caseId,
      externalSystem: 'offline-package', expectedExternalRevision: current,
      payloadHash, status: 'awaiting-receipt',
    }
    saveIssued(payload.actionId, { package: pkg, receipt, payloadHash })
    return receipt
  }

  /** Export this JSON to another machine / independent client. */
  getIssuedPackage(actionId: string): IssuedPush['package'] | undefined {
    return readIssued(actionId)?.package
  }

  /** Local demonstration responder. Real SchoolPort must replace this with authenticated transport. */
  static buildAcknowledgement(
    request: IssuedPush['package'],
    accepted: boolean,
    note?: string,
  ): ReturnType<typeof exportHandoffPackage<OfflinePortAcknowledgement>> {
    const parsed = importHandoffPackage(request)
    if (!parsed.ok) throw new Error(parsed.message)
    return exportHandoffPackage({
      actionId: parsed.payload.actionId, caseId: parsed.payload.caseId,
      requestHash: request.contentHash, baseExternalRevision: parsed.payload.baseExternalRevision,
      externalRevision: parsed.payload.externalRevision,
      accepted, note,
    })
  }

  /** Do not turn an issued package into accepted until a separate receipt exists. */
  confirm(
    actionId: string,
    response: ReturnType<typeof exportHandoffPackage<OfflinePortAcknowledgement>>,
  ): SyncReceipt {
    const issued = readIssued(actionId)
    if (!issued) throw new Error('没有发出的离线动作：' + actionId)
    if (issued.receipt.status === 'accepted' || issued.receipt.status === 'rejected') return issued.receipt
    const result = importHandoffPackage(response)
    if (!result.ok) throw new Error(result.message)
    const body = result.payload
    if (body.actionId !== actionId || body.caseId !== issued.receipt.caseId ||
        body.requestHash !== issued.package.contentHash ||
        body.baseExternalRevision !== issued.receipt.expectedExternalRevision) throw new Error('回执关联动作/包/版本不匹配')
    const current = this.externalRevision(body.caseId)
    if (current !== body.baseExternalRevision) {
      const conflict: SyncReceipt = {
        ...issued.receipt, status: 'conflict',
        externalReceipt: { receivedAt: new Date().toISOString(), message: '导出后本地外部版本已变化，请对照差异' },
      }
      saveIssued(actionId, { ...issued, receipt: conflict })
      return conflict
    }
    const receipt: SyncReceipt = {
      ...issued.receipt, status: body.accepted ? 'accepted' : 'rejected',
      externalReceipt: {
        receivedAt: new Date().toISOString(),
        externalId: response.packageId,
        message: body.note ?? (body.accepted ? '独立副本已确认接收' : '独立副本拒绝'),
      },
    }
    saveIssued(actionId, { ...issued, receipt })
    return receipt
  }
}
