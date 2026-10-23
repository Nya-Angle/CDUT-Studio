/**
 * Dev-C C2-R02 — Main-only trusted consumer for V3 technical proposals.
 *
 * All authority dependencies are *injected by trusted Electron Main*:
 * the published-Plan verifier, live A Owner/grant witness, and verified Host
 * receipt registry. No IPC handler, Renderer-supplied Actor, A outbox "ACK",
 * school policy publisher, or synthetic fallback is installed here.
 *
 * Cross-PID Host registries MUST separately implement durable authorization;
 * an empty/missing registry fails closed (it never reconstructs Host proofs
 * from untrusted journal proposal bodies after a restart).
 */
import { createHash } from 'node:crypto'
import { lstatSync, readFileSync, realpathSync } from 'node:fs'
import { isAbsolute, relative, resolve, sep } from 'node:path'
import {
  type Actor, type CaseAggregateV2, type ReviewCommandResult,
  type ReviewRunRecordV3, type RunEvidenceIdentity, type V3ExecutionProposal,
} from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { assertSafeReviewStorageId } from './review-storage-id'
import { CommandValidationError } from './case-store-v2'
import { admitV3TechnicalRun, recordV3TechnicalProposal } from './review-v3-technical-ledger'
import type { V3VerifiedHostReceipt } from './review-v3-execution-contract'
import { sealV3ReviewRun, type C2SealRunPayload } from './review-v3-run-writer'

/** From the A Owner/grant registry, not from the proposal payload. */
export interface C2MainOwnerWitness {
  run: RunEvidenceIdentity
  permissionGrantId: string
  active: boolean
  ownerGeneration: number
  inputManifestHash: string
}

/** Must be looked up in the Main-registered PHYSICAL Host receipt registry. */
export interface C2MainHostWitness {
  run: RunEvidenceIdentity
  permissionGrantId: string
  hostReceiptId: string
  verified: V3VerifiedHostReceipt
}

export interface C2MainTrustedInputs {
  /** Require published/approved exact Plan provenance; candidate-held is rejected. */
  assertPublishedPlan(aggregate: CaseAggregateV2, run: RunEvidenceIdentity): void
  /** Look up the live Owner/generation/current grant; never trust Renderer fields. */
  getCurrentOwner(run: RunEvidenceIdentity): C2MainOwnerWitness | undefined
  /** Look up a physical Host receipt by ID from the registered Main authority. */
  getPhysicalHostReceipt(receiptId: string): C2MainHostWitness | undefined
}

const stable = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']'
  const obj = value as Record<string, unknown>
  return '{' + Object.keys(obj).filter(key => obj[key] !== undefined).sort()
    .map(key => JSON.stringify(key) + ':' + stable(obj[key])).join(',') + '}'
}
const same = (a: unknown, b: unknown): boolean => stable(a) === stable(b)
const reject = (message: string): never =>
  { throw new CommandValidationError('DEPENDENCY_UNRESOLVED', message) }

/** Rehash actual saved original bytes, not the SHA claimed by an event or DTO.
 * Deny absolute/traversal/symlink/escaped roots and missing files. Each call
 * occurs while C's serialized aggregate transaction is being validated.
 */
export function assertC2PhysicalOriginalBytes(
  aggregate: CaseAggregateV2,
  versionId: string,
): void {
  assertSafeReviewStorageId(aggregate.caseV2.id, 'caseId')
  const docs = aggregate.caseV2.documents.filter(doc =>
    doc.versionId === versionId && doc.active !== false)
  if (docs.length !== 1) reject('Main 当前原件版本不存在或重复')
  const document = docs[0]!
  if (!document.byteHash || !/^[a-f0-9]{64}$/.test(document.byteHash)) {
    reject('Main 未登记真实原件 byteHash')
  }
  const asset = document.assetPath
  if (typeof asset !== 'string' || !asset ||
      isAbsolute(asset) || asset.includes('\\') ||
      asset.split('/').some(segment => !segment || segment === '.' || segment === '..')) {
    reject('原件相对路径非法')
  }
  const caseRoot = resolve(getConfigDir(), 'review-cases', aggregate.caseV2.id)
  const full = resolve(caseRoot, asset)
  const relativePath = relative(caseRoot, full)
  if (!relativePath || relativePath === '..' ||
      relativePath.startsWith('..' + sep) || isAbsolute(relativePath)) {
    reject('原件路径越过当前案卷')
  }
  try {
    const realRoot = realpathSync(caseRoot)
    const realOriginal = realpathSync(full)
    const realRel = relative(realRoot, realOriginal)
    if (!realRel || realRel === '..' || realRel.startsWith('..' + sep) ||
        isAbsolute(realRel) || !lstatSync(full).isFile()) reject('原件路径或类型不可信')
    const digest = createHash('sha256').update(readFileSync(full)).digest('hex')
    if (digest !== document.byteHash) reject('物理原件字节与冻结 Case SHA256 不一致')
  } catch {
    reject('物理原件无法从案卷受控目录读取并重新核验')
  }
}

function verifyBase(
  input: C2MainTrustedInputs,
  aggregate: CaseAggregateV2,
  run: RunEvidenceIdentity,
): C2MainOwnerWitness {
  if (aggregate.caseV2.id !== run.caseId || aggregate.caseV2.stage !== 'reviewing') {
    reject('Main 当前 Case 或业务阶段与 Run 不一致')
  }
  const plan = aggregate.canonicalPlan
  if (!plan || plan.fingerprint !== run.planFingerprint ||
      plan.templateVersion !== run.templateVersion ||
      aggregate.d2RuntimePlan) {
    reject('Run 未绑定 Main 当前唯一正式 Plan')
  }
  input.assertPublishedPlan(aggregate, run)
  const owner = input.getCurrentOwner(run)
  if (!owner || !owner.active ||
      !owner.permissionGrantId || !same(owner.run, run) ||
      owner.ownerGeneration !== run.ownerGeneration ||
      owner.inputManifestHash !== run.inputManifestHash) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
      'Main 当前 Owner/generation/manifest 不再拥有运行许可')
  }
  // Run-scoped mandatory original-byte rehash — no Main caller may authorize
  // a recorded PDF/Office/text read using a stale B staging preview hash.
  if (!run.sourceVersionIds.length ||
      new Set(run.sourceVersionIds).size !== run.sourceVersionIds.length) {
    reject('Run 原件版本集合无效')
  }
  for (const versionId of run.sourceVersionIds) {
    assertC2PhysicalOriginalBytes(aggregate, versionId)
  }
  return owner
}

function verifyHost(
  input: C2MainTrustedInputs,
  run: RunEvidenceIdentity,
  permissionGrantId: string,
  event: V3ExecutionProposal,
): V3VerifiedHostReceipt {
  if (event.permissionGrantId !== permissionGrantId ||
      !same(event.run, run)) reject('Host event 的 Run/grant 身份与 Main 不一致')
  const stored = input.getPhysicalHostReceipt(event.hostReceiptId)
  if (!stored || stored.hostReceiptId !== event.hostReceiptId ||
      stored.permissionGrantId !== permissionGrantId ||
      !same(stored.run, run) ||
      stored.verified.permissionGrantId !== permissionGrantId ||
      stored.verified.kind !== event.kind) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
      'Main 注册 Host 回执缺失、撤权或跨 Run 复用')
  }
  // Content equality is checked again by the C-owned proposal validator.
  return stored.verified
}

type RunCommand = {
  requestId: string
  expectedRevision: number
  actor: Actor
  payload: RunEvidenceIdentity
}
type EventCommand = {
  requestId: string
  expectedRevision: number
  actor: Actor
  payload: V3ExecutionProposal
}
type SealCommand = {
  requestId: string
  expectedRevision: number
  actor: Actor
  payload: C2SealRunPayload
}

/** An inert, Main-only interface until the live A/Host and B publisher
 * adapters have been independently attested. No IPC registration is made.
 */
export function createC2MainTrustedRunPort(input: C2MainTrustedInputs): {
  admit(caseId: string, command: RunCommand): Promise<ReviewCommandResult>
  record(caseId: string, command: EventCommand): Promise<ReviewCommandResult>
  seal(caseId: string, command: SealCommand): Promise<ReviewCommandResult<ReviewRunRecordV3>>
} {
  if (!input || typeof input.assertPublishedPlan !== 'function' ||
      typeof input.getCurrentOwner !== 'function' ||
      typeof input.getPhysicalHostReceipt !== 'function') {
    throw new Error('C2_MAIN_TRUSTED_INPUT_PORTS_REQUIRED')
  }
  return {
    admit(caseId, command) {
      return admitV3TechnicalRun(caseId, command, (aggregate, run) => {
        verifyBase(input, aggregate, run)
      })
    },
    record(caseId, command) {
      return recordV3TechnicalProposal(caseId, command, (aggregate, event) => {
        const owner = verifyBase(input, aggregate, event.run)
        const receipt = verifyHost(input, event.run, owner.permissionGrantId, event)
        return {
          permissionGrantId: owner.permissionGrantId,
          grantActive: true,
          receipts: new Map([[event.hostReceiptId, receipt]]),
        }
      })
    },
    seal(caseId, command) {
      return sealV3ReviewRun(caseId, command, (aggregate, run, events) => {
        const owner = verifyBase(input, aggregate, run)
        const ids = new Set<string>()
        if (events.length === 0 || events[events.length - 1]?.kind !== 'terminal') {
          reject('Main 未接收到完整技术 Host terminal')
        }
        for (const event of events) {
          if (ids.has(event.hostReceiptId)) reject('Run 重复使用 Host receiptId')
          ids.add(event.hostReceiptId)
          verifyHost(input, run, owner.permissionGrantId, event)
        }
      })
    },
  }
}
