/**
 * Dev-A producer for Dev-C-approved CR-A-001 A-1 proposal envelope.
 *
 * Contract authority is Dev-C's review-v3-execution/1; these local structural
 * producer types keep Dev-A independently typecheckable from frozen C0 while
 * I migrates only verified slices. Do not treat this as a second shared DTO.
 * No formal Run writer, trusted consumer ACK or general IPC exists here.
 */
import { createHash } from 'node:crypto'
import {
  assertC0RunEvidenceIdentity, C0ContractError,
  type CanonicalPlan, type RunEvidenceIdentity, type SourceIdentity,
} from '@profer/shared'
import {
  type OwnerPersistence, type V3OwnerLease, type V3ReviewOwnerAdapter,
} from './review-pi-owner-adapter'
import type { V3ReviewToolCall } from './review-execution-event-adapter'
import { V3ExecutionCompletenessAdapter } from './review-execution-event-adapter-completeness'
import type { V3ATurnExhaustion } from './review-v3-execution-turn-budget'

export const A_V3_PROPOSAL_SCHEMA = 'review-v3-execution/1' as const
export type ATechnicalStatus =
  'completed-technical' | 'partial' | 'cancelled' | 'timed-out' | 'needs-resume' | 'failed'
export type ACheckStatus = 'accepted' | 'rejected' | 'missing' | 'unknown'
type CheckBinding = CanonicalPlan['bindings'][number]
export type ACheckResult = Pick<CheckBinding, 'checkKey' | 'targetKey' | 'objectKey' | 'subjectId'> & {
  status: ACheckStatus
}
type EnvelopeBase = {
  schemaVersion: typeof A_V3_PROPOSAL_SCHEMA
  run: RunEvidenceIdentity
  sequence: number
  permissionGrantId: string
  hostReceiptId: string
}
type ProposalPayload =
  | (EnvelopeBase & {kind: 'read'; read: {source: SourceIdentity; extent: 'block' | 'full-document'}})
  | (EnvelopeBase & {kind: 'check'; check: ACheckResult})
  | (EnvelopeBase & {kind: 'terminal'; terminal: {status: ATechnicalStatus; reason?: string}})
export type AExecutionProposal = ProposalPayload & { eventId: string }

/** Injected from Main's real physical Host, never Renderer or Pi JSON. */
export interface AVerifiedExecutionHost {
  read(source: SourceIdentity): Promise<{
    receiptId: string
    actualSource: SourceIdentity
    extent: 'block' | 'full-document'
    /** Required when the physical Host claims all blocks were actually read. */
    coveredPhysicalBlocks?: number
    totalPhysicalBlocks?: number
  }>
  check(binding: CheckBinding): Promise<{receiptId: string; actualCheck: ACheckResult}>
  terminal(status: ATechnicalStatus): Promise<{
    receiptId: string; actualStatus: ATechnicalStatus
    reason?: string
  }>
}
interface AttemptChain {
  readonly runDigest: string
  /** First persisted grantId; each event independently pins its own grant. */
  readonly grantId: string
  readonly nextSequence: number
  readonly terminal: boolean
  readonly records: readonly AExecutionProposal[]
}
interface ProducerDisk {
  readonly version: 'v3-dev-a-v3-proposals/1'
  readonly attempts: Record<string, AttemptChain>
}
interface EnvelopeDisk {payload: ProducerDisk; sha256: string}
function stable(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']'
  const o = value as Record<string, unknown>
  return '{' + Object.keys(o).filter(k => o[k] !== undefined).sort()
    .map(k => JSON.stringify(k) + ':' + stable(o[k])).join(',') + '}'
}
const sha = (v: unknown): string =>
  createHash('sha256').update(stable(v)).digest('hex')
const mismatch = (why: string): never => {
  throw new C0ContractError('RECOVERY_REQUIRED', why)
}
const same = (a: unknown, b: unknown): boolean => stable(a) === stable(b)
const keyOf = (run: RunEvidenceIdentity): string =>
  JSON.stringify([run.runId, run.attemptId, run.ownerGeneration])

export function createAV3ProposalId(payload: ProposalPayload): string {
  return sha(payload)
}
function load(raw: string | null): ProducerDisk {
  if (raw === null) return { version: 'v3-dev-a-v3-proposals/1', attempts: {} }
  let wrapped: EnvelopeDisk
  try { wrapped = JSON.parse(raw) as EnvelopeDisk }
  catch { return mismatch('V3 proposal journal unreadable') }
  if (!wrapped?.payload || wrapped.payload.version !== 'v3-dev-a-v3-proposals/1' ||
      !wrapped.payload.attempts || Array.isArray(wrapped.payload.attempts) ||
      sha(JSON.stringify(wrapped.payload)) !== wrapped.sha256) {
    mismatch('V3 proposal journal damaged')
  }
  for (const [k, chain] of Object.entries(wrapped.payload.attempts)) {
    if (!chain || !Array.isArray(chain.records) ||
        !/^[a-f0-9]{64}$/.test(chain.runDigest) ||
        !chain.grantId ||
        !Number.isSafeInteger(chain.nextSequence) ||
        chain.nextSequence !== chain.records.length + 1) {
      mismatch('V3 proposal chain cursor invalid')
    }
    let sealed = false
    const receipts = new Map<string, string>()
    for (let i = 0; i < chain.records.length; ++i) {
      const proposal = chain.records[i]
      // Explicit early exit for indexed access under noUncheckedIndexedAccess.
      // Never deserialize a partial persisted event as a valid proposal.
      if (!proposal) return mismatch('V3 proposal chain missing indexed event')
      if (proposal.schemaVersion !== A_V3_PROPOSAL_SCHEMA ||
          proposal.sequence !== i + 1 || keyOf(proposal.run) !== k ||
          sha(proposal.run) !== chain.runDigest ||
          !proposal.permissionGrantId ||
          (i === 0 && proposal.permissionGrantId !== chain.grantId) ||
          !proposal.hostReceiptId || sealed) {
        mismatch('V3 proposal chain identity mismatch')
      }
      const {eventId: _id, ...payload} = proposal
      if (proposal.eventId !== createAV3ProposalId(payload)) {
        mismatch('V3 proposal digest mismatch')
      }
      const old = receipts.get(proposal.hostReceiptId)
      if (old && old !== proposal.eventId) mismatch('V3 Host receipt collision on disk')
      receipts.set(proposal.hostReceiptId, proposal.eventId)
      if (proposal.kind === 'terminal') sealed = true
    }
    if (sealed !== chain.terminal) mismatch('V3 terminal chain mismatch')
  }
  return wrapped.payload
}
const seal = (disk: ProducerDisk): string =>
  JSON.stringify({payload: disk, sha256: sha(JSON.stringify(disk))})

/** Fully independent of legacy C0/1 proposal sequence and outbox. */
export class V3AProposalProducer {
  private readonly disk: ProducerDisk
  private revision: string | null
  private busy = false

  constructor(private readonly persistence: OwnerPersistence,
    private readonly owners: V3ReviewOwnerAdapter,
    private readonly host: AVerifiedExecutionHost,
    private readonly turnBudget?: V3ATurnExhaustion) {
    if (!host || typeof host.read !== 'function' ||
        typeof host.check !== 'function' || typeof host.terminal !== 'function') {
      throw new C0ContractError('ACTOR_UNTRUSTED', 'Main Host result port is required')
    }
    this.revision = persistence.read()
    this.disk = load(this.revision)
  }
  private fresh(): void {
    if (this.persistence.read() !== this.revision) {
      mismatch('V3 proposal journal changed by another process')
    }
  }
  private store(next: ProducerDisk): void {
    this.fresh()
    const value = seal(next)
    if (this.persistence.compareAndWrite) {
      this.persistence.compareAndWrite(this.revision, value)
    } else {
      this.persistence.write(value)
    }
    this.revision = value
    ;(this.disk as {attempts: ProducerDisk['attempts']}).attempts = next.attempts
  }
  private pinned(lease: V3OwnerLease): {run: RunEvidenceIdentity; plan: CanonicalPlan} {
    if (!lease.runEvidence || !lease.planSnapshot ||
        lease.runEvidence.runId !== lease.runId ||
        lease.runEvidence.attemptId !== lease.attemptId ||
        lease.runEvidence.ownerGeneration !== lease.generation ||
        lease.runEvidence.inputManifestHash !== lease.manifestHash ||
        lease.planSnapshot.fingerprint !== lease.planFingerprint) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Owner lacks Main-frozen Run/Plan snapshot')
    }
    assertC0RunEvidenceIdentity(lease.runEvidence)
    return { run: lease.runEvidence, plan: lease.planSnapshot }
  }
  private assertAttemptOpen(lease:V3OwnerLease):void {
    this.fresh()
    const {run}=this.pinned(lease)
    if(this.disk.attempts[keyOf(run)]?.terminal) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH',
        'Terminal proposal already sealed; further Host side effects forbidden')
    }
  }
  private completionFromDurableHostEvents(lease: V3OwnerLease): boolean {
    const {run,plan} = this.pinned(lease)
    const chain = this.disk.attempts[keyOf(run)]
    if (!chain) return false
    const coverage = new V3ExecutionCompletenessAdapter(plan,run)
    const readVersions = new Set<string>()
    const statusByCheck = new Map<string, ACheckStatus>()
    for (const event of chain.records) {
      // Previous pause/grant epochs may be replay candidates but can no longer
      // be used as proof that the newly reauthorized grant was complete.
      if (event.permissionGrantId !== lease.grantId) continue
      if (event.kind === 'read') {
        readVersions.add(event.read.source.documentVersionId)
      } else if (event.kind === 'check') {
        const checkId = JSON.stringify([
          event.check.checkKey,event.check.targetKey,
          event.check.objectKey,event.check.subjectId,
        ])
        const earlier = statusByCheck.get(checkId)
        // Conflicting Host outcomes within one grant are ambiguous. A cannot
        // prefer an earlier accepted result over a later rejected/unknown one.
        // C must decide formal re-review or a fresh attempt.
        if (earlier && earlier !== event.check.status) return false
        statusByCheck.set(checkId,event.check.status)
        coverage.recordHostOutcome({...event.check,hostReceiptId:event.hostReceiptId})
      }
    }
    const requiredVersions = new Set(plan.bindings.filter(
      b => b.applicability === 'applicable').flatMap(b => b.sourceVersionIds))
    return coverage.snapshot().state === 'technically-complete' &&
      [...requiredVersions].every(versionId => readVersions.has(versionId))
  }
  private append(call: V3ReviewToolCall, kind: ProposalPayload['kind'],
    receiptId: string, detail: {read?: {source:SourceIdentity; extent:'block'|'full-document'};
      check?: ACheckResult; terminal?: {status:ATechnicalStatus;reason?:string}}): AExecutionProposal {
    if (this.busy) return mismatch('Concurrent proposal append in one Owner')
    this.busy = true
    try {
      return this.owners.withAuthorizedEvent(
        call.sessionId, call.grantId, call.senderKey, call.principal,
        call.tool, call.source, lease => {
          this.fresh()
          const {run, plan} = this.pinned(lease)
          if (kind === 'terminal' && detail.terminal?.status === 'needs-resume' &&
              !this.turnBudget?.exhausted(lease)) {
            throw new C0ContractError('CONTRACT_INVALID',
              'needs-resume requires exhausted Main-attested durable turn budget')
          }
          if (kind !== 'terminal' && this.turnBudget?.exhausted(lease)) {
            throw new C0ContractError('RUN_IDENTITY_MISMATCH',
              'Turn budget exhausted; no more Host proposals in this attempt')
          }
          const k = keyOf(run)
          const current = this.disk.attempts[k] ?? {
            runDigest: sha(run), grantId: lease.grantId,
            nextSequence: 1, terminal: false, records: [],
          }
          if (!same(sha(run), current.runDigest) ||
              (current.records.length === 0 && current.grantId !== lease.grantId)) {
            throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Frozen Run/grant collision')
          }
          // New Main-reauthorized grants in the SAME Owner process can append
          // the next sequence after pause/resume. The original entry and all
          // prior grant IDs remain immutable, never relabeled or promoted to
          // an accepted Run receipt. Dev-C decides whether old events survive
          // C2 consumption after the grant rotates.
          if (!receiptId.trim()) {
            throw new C0ContractError('CONTRACT_INVALID', 'Missing actual Host receiptId')
          }
          if (kind === 'check' && detail.check) {
            const matching = plan.bindings.filter(binding =>
              binding.checkKey === detail.check?.checkKey &&
              binding.targetKey === detail.check?.targetKey &&
              binding.objectKey === detail.check?.objectKey &&
              binding.subjectId === detail.check?.subjectId)
            if (matching.length !== 1 ||
                !run.checkKeys.includes(detail.check.checkKey) ||
                matching[0]?.sourceVersionIds.some(id => !run.sourceVersionIds.includes(id)) ||
                (detail.check.status === 'accepted' && matching[0]?.applicability !== 'applicable')) {
              throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Check not in frozen applicable Plan/Run')
            }
          }
          if (kind === 'terminal' &&
              detail.terminal?.status === 'completed-technical' &&
              !this.completionFromDurableHostEvents(lease)) {
            throw new C0ContractError('CONTRACT_INVALID',
              'Cannot complete without durable accepted Checks and physical source reads')
          }
          if (kind === 'read' && detail.read) {
            if (!run.sourceVersionIds.includes(detail.read.source.documentVersionId) ||
                !lease.sourceIdentities.some(source => same(source, detail.read?.source))) {
              throw new C0ContractError('SOURCE_STALE', 'Read source not in Main-frozen allowlist')
            }
          }
          let payload: ProposalPayload
          const base = {
            schemaVersion: A_V3_PROPOSAL_SCHEMA,
            run: structuredClone(run), sequence: current.nextSequence,
            permissionGrantId: lease.grantId, hostReceiptId: receiptId,
          }
          if (kind === 'read' && detail.read) payload = {...base,kind,read: detail.read}
          else if (kind === 'check' && detail.check) payload = {...base,kind,check:detail.check}
          else if (kind === 'terminal' && detail.terminal) {
            payload = {...base,kind,terminal:detail.terminal}
          } else {
            throw new C0ContractError('CONTRACT_INVALID', 'Missing Host-attested event details')
          }
          // A terminal seals the attempt. Even an identical earlier Host
          // receipt cannot justify another read/check after completion.
          if(current.terminal && kind!=='terminal') {
            throw new C0ContractError('RUN_IDENTITY_MISMATCH',
              'Terminal proposal already sealed')
          }
          const previous = current.records.find(e => e.hostReceiptId === receiptId)
          if (previous) {
            const {eventId: _oldId, sequence: _seq, ...oldBody} = previous
            const {sequence: _newSeq, ...newBody} = payload
            if (!same(oldBody, newBody)) {
              throw new C0ContractError('REQUEST_ID_COLLISION', 'Receipt reused with changed verified body')
            }
            return structuredClone(previous)
          }
          if (current.terminal) {
            throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Terminal proposal already sealed')
          }
          const event: AExecutionProposal = {...payload,eventId:createAV3ProposalId(payload)}
          this.store({...this.disk,attempts:{
            ...this.disk.attempts,
            [k]: {
              runDigest: current.runDigest, grantId: current.grantId,
              nextSequence: current.nextSequence + 1,
              terminal: kind === 'terminal',
              records: [...current.records,event],
            },
          }})
          return structuredClone(event)
        },
      )
    } finally {
      this.busy = false
    }
  }
  /** Only physical Host callbacks create receipts; never pass model text here. */
  async read(call: V3ReviewToolCall): Promise<AExecutionProposal> {
    if (!call.source || !['review_read_documents','review_inspect_original',
      'review_inspect_document_image'].includes(call.tool)) {
      throw new C0ContractError('SOURCE_STALE','Exact physical read capability required')
    }
    this.owners.assertAuthorized(call.sessionId, call.grantId,call.senderKey,
      call.principal,call.tool,call.source)
    const initialLease = this.owners.assertAuthorized(
      call.sessionId,call.grantId,call.senderKey,call.principal,
      call.tool,call.source,
    )
    if (this.turnBudget?.exhausted(initialLease)) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH','Pi turn budget exhausted')
    }
    this.assertAttemptOpen(initialLease)
    const result = await this.host.read(structuredClone(call.source))
    this.owners.assertAuthorized(call.sessionId, call.grantId,call.senderKey,
      call.principal,call.tool,call.source)
    if (!result || !same(result.actualSource, call.source) ||
        !['block','full-document'].includes(result.extent) ||
        (result.extent === 'full-document' &&
          (!Number.isSafeInteger(result.coveredPhysicalBlocks) ||
           !Number.isSafeInteger(result.totalPhysicalBlocks) ||
           result.totalPhysicalBlocks! <= 0 ||
           result.coveredPhysicalBlocks !== result.totalPhysicalBlocks))) {
      throw new C0ContractError('SOURCE_STALE', 'Host has not attested exact actual Source/read extent')
    }
    return this.append(call,'read',result.receiptId,{
      read:{source:structuredClone(result.actualSource),extent:result.extent},
    })
  }
  async check(call: V3ReviewToolCall, requested: Pick<CheckBinding,
    'checkKey'|'targetKey'|'objectKey'|'subjectId'>): Promise<AExecutionProposal> {
    if (call.tool !== 'review_submit_result') {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Check requires scoped submit capability')
    }
    const lease = this.owners.assertAuthorized(call.sessionId,call.grantId,
      call.senderKey,call.principal,call.tool)
    if (this.turnBudget?.exhausted(lease)) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH','Pi turn budget exhausted')
    }
    this.assertAttemptOpen(lease)
    const {run,plan} = this.pinned(lease)
    const binding = plan.bindings.find(b =>
      b.checkKey === requested.checkKey && b.targetKey === requested.targetKey &&
      b.objectKey === requested.objectKey && b.subjectId === requested.subjectId)
    if (!binding || !run.checkKeys.includes(binding.checkKey)) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Check not in frozen Plan')
    }
    const receipt = await this.host.check(structuredClone(binding))
    this.owners.assertAuthorized(call.sessionId,call.grantId,
      call.senderKey,call.principal,call.tool)
    if (!receipt || !receipt.actualCheck ||
        !['accepted','rejected','missing','unknown'].includes(receipt.actualCheck.status) ||
        !same(requested,{
          checkKey:receipt.actualCheck.checkKey,targetKey:receipt.actualCheck.targetKey,
          objectKey:receipt.actualCheck.objectKey,subjectId:receipt.actualCheck.subjectId,
        })) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Host Check result/tuple mismatch')
    }
    return this.append(call,'check',receipt.receiptId,{check:structuredClone(receipt.actualCheck)})
  }
  async terminal(call: V3ReviewToolCall, status: ATechnicalStatus): Promise<AExecutionProposal> {
    if (call.tool !== 'review_submit_result' ||
      !['completed-technical','partial','cancelled','timed-out','needs-resume','failed'].includes(status)) {
      throw new C0ContractError('CONTRACT_INVALID', 'Terminal requires scoped Host status')
    }
    const lease = this.owners.assertAuthorized(call.sessionId,call.grantId,
      call.senderKey,call.principal,call.tool)
    this.pinned(lease)
    if (status === 'completed-technical' && !this.completionFromDurableHostEvents(lease)) {
      throw new C0ContractError('CONTRACT_INVALID',
        'Cannot claim incomplete Check/source technical coverage')
    }
    const receipt = await this.host.terminal(status)
    this.owners.assertAuthorized(call.sessionId,call.grantId,
      call.senderKey,call.principal,call.tool)
    if (!receipt || receipt.actualStatus !== status) {
      throw new C0ContractError('CONTRACT_INVALID', 'Host terminal status mismatch')
    }
    return this.append(call,'terminal',receipt.receiptId,{
      terminal:{status:receipt.actualStatus,...(receipt.reason ? {reason:receipt.reason}:{})},
    })
  }
  /**
   * Technical-only journal terminal introspection for Main SDK preflight.
   * A sealed attempt must never spend another Provider turn, regardless of
   * its (possibly old-grant) terminal receipt. Does not confer a C2 ACK.
   */
  terminalCandidate(run: RunEvidenceIdentity): AExecutionProposal | null {
    assertC0RunEvidenceIdentity(run)
    this.fresh()
    const chain = this.disk.attempts[keyOf(run)]
    if (!chain) return null
    if (chain.runDigest !== sha(run)) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH',
        'Terminal read Run identity differs from persisted attempt')
    }
    const last=chain.records[chain.records.length-1]
    if (!chain.terminal) return null
    if (!last || last.kind !== 'terminal') {
      return mismatch('Attempt declared sealed without technical terminal')
    }
    return structuredClone(last)
  }

  /** Pending here means proposal-only replay. Dev-C has NOT issued a durable ACK. */
  replayCandidates(): AExecutionProposal[] {
    this.fresh()
    return Object.values(this.disk.attempts).flatMap(chain =>
      chain.records.map(x => structuredClone(x)))
  }
}
