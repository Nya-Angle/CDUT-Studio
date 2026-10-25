/**
 * Dev-A A3/A4 trusted technical turn budget, not a Run, Check or Model token.
 * Only a Main SDK caller may declare an actual completed Pi turn. Count is
 * durable per immutable Run+Attempt+generation and survives pause/grant rotate.
 * It can justify needs-resume, NEVER business completion or a C2 ACK.
 */
import { createHash } from 'node:crypto'
import {
  assertC0RunEvidenceIdentity, C0ContractError, type RunEvidenceIdentity,
} from '@profer/shared'
import {
  type OwnerPersistence, type V3OwnerLease, type V3ReviewOwnerAdapter,
} from './review-pi-owner-adapter'
import type { V3ReviewToolCall } from './review-execution-event-adapter'

interface TurnChain {
  readonly runHash: string
  readonly maxTurns: number
  readonly usedTurns: number
  /** Unique Main-observed SDK turn receipts; retry must not inflate count. */
  readonly receiptIds: readonly string[]
}
interface TurnJournal {
  readonly version: 'v3-dev-a-turns/1'
  readonly runs: Record<string, TurnChain>
}
const digest = (v: string): string =>
  createHash('sha256').update(v).digest('hex')
function bad(message: string): never {
  throw new C0ContractError('RECOVERY_REQUIRED', message)
}
const key = (r: RunEvidenceIdentity) =>
  JSON.stringify([r.runId, r.attemptId, r.ownerGeneration])
function decode(raw: string | null): TurnJournal {
  if (raw === null) return {version:'v3-dev-a-turns/1',runs:{}}
  let object: {payload: TurnJournal; sha256: string}
  try { object=JSON.parse(raw) as typeof object }
  catch { return bad('Turn budget journal not parseable') }
  if (!object?.payload || object.payload.version !== 'v3-dev-a-turns/1' ||
      !object.payload.runs || typeof object.payload.runs !== 'object' ||
      Array.isArray(object.payload.runs) ||
      object.sha256 !== digest(JSON.stringify(object.payload))) {
    bad('Turn budget journal hash/schema mismatch')
  }
  for (const [k,turns] of Object.entries(object.payload.runs)) {
    if (!k || !turns || !/^[a-f0-9]{64}$/.test(turns.runHash) ||
        !Number.isSafeInteger(turns.maxTurns) || turns.maxTurns < 1 ||
        !Number.isSafeInteger(turns.usedTurns) || turns.usedTurns < 0 ||
        turns.usedTurns > turns.maxTurns || !Array.isArray(turns.receiptIds) ||
        turns.receiptIds.length !== turns.usedTurns ||
        turns.receiptIds.some(id => typeof id !== 'string' || !id.trim()) ||
        new Set(turns.receiptIds).size !== turns.receiptIds.length) {
      bad('Turn budget journal counters corrupt')
    }
  }
  return object.payload
}
function pinned(lease: V3OwnerLease): RunEvidenceIdentity {
  if (!lease.runEvidence || !lease.planSnapshot ||
      lease.runEvidence.runId !== lease.runId ||
      lease.runEvidence.caseId !== lease.caseId ||
      lease.runEvidence.attemptId !== lease.attemptId ||
      lease.runEvidence.ownerGeneration !== lease.generation ||
      lease.runEvidence.inputManifestHash !== lease.manifestHash ||
      lease.runEvidence.planFingerprint !== lease.planFingerprint) {
    throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Turn budget lacks Main-frozen Run')
  }
  assertC0RunEvidenceIdentity(lease.runEvidence)
  return lease.runEvidence
}
export interface V3ATurnSnapshot {
  readonly usedTurns: number
  readonly maxTurns: number
  readonly exhausted: boolean
}
/** Inject this port into A2 to gate technical 'needs-resume' terminal only. */
export interface V3ATurnExhaustion {
  exhausted(lease: V3OwnerLease): boolean
}
export class V3ATurnBudget implements V3ATurnExhaustion {
  private readonly journal: TurnJournal
  private revision: string | null
  private busy = false

  constructor(
    private readonly persistence: OwnerPersistence,
    private readonly owners: V3ReviewOwnerAdapter,
    readonly maxTurns = 24,
  ) {
    if (!Number.isSafeInteger(maxTurns) || maxTurns < 1) {
      throw new C0ContractError('CONTRACT_INVALID', 'Main turn budget must be positive')
    }
    this.revision = persistence.read()
    this.journal = decode(this.revision)
  }
  private fresh(): void {
    if (this.persistence.read() !== this.revision) {
      bad('Turn budget changed outside this Main process')
    }
  }
  private write(next: TurnJournal): void {
    this.fresh()
    const data = JSON.stringify({
      payload:next, sha256:digest(JSON.stringify(next)),
    })
    if (this.persistence.compareAndWrite) {
      this.persistence.compareAndWrite(this.revision,data)
    } else {
      this.persistence.write(data)
    }
    this.revision=data
    ;(this.journal as {runs:TurnJournal['runs']}).runs=next.runs
  }
  private entry(lease: V3OwnerLease): TurnChain | undefined {
    const run=pinned(lease)
    const existing=this.journal.runs[key(run)]
    if (!existing) return undefined
    if (existing.runHash !== digest(JSON.stringify(run)) ||
        existing.maxTurns !== this.maxTurns) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH',
        'Turn budget frozen Run or maxTurns changed')
    }
    return existing
  }
  exhausted(lease: V3OwnerLease): boolean {
    this.fresh()
    const entry=this.entry(lease)
    return !!entry && entry.usedTurns >= entry.maxTurns
  }
  snapshot(lease: V3OwnerLease): V3ATurnSnapshot {
    this.fresh()
    const entry=this.entry(lease)
    return {
      usedTurns:entry?.usedTurns ?? 0,
      maxTurns:entry?.maxTurns ?? this.maxTurns,
      exhausted:entry ? entry.usedTurns >= entry.maxTurns : false,
    }
  }
  /**
   * Main records a uniquely attested SDK turn receipt. Same Run across pause or a
   * rotated grant shares the counter; calls made with an old grant are denied.
   */
  recordCompletedTurn(call: V3ReviewToolCall, mainTurnReceiptId: string): V3ATurnSnapshot {
    if (!mainTurnReceiptId?.trim()) {
      throw new C0ContractError('CONTRACT_INVALID', 'Verified SDK turn receipt required')
    }
    if (call.tool !== 'review_submit_result') {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN','Turn requires Main submit capability')
    }
    if (this.busy) bad('Concurrent turn budget mutation')
    this.busy=true
    try {
      return this.owners.withAuthorizedEvent(
        call.sessionId,call.grantId,call.senderKey,call.principal,
        call.tool,undefined,lease=>{
          this.fresh()
          const run=pinned(lease)
          const previous=this.entry(lease) ?? {
            runHash:digest(JSON.stringify(run)),maxTurns:this.maxTurns,usedTurns:0,
            receiptIds:[],
          }
          if (previous.receiptIds.includes(mainTurnReceiptId)) {
            return {
              usedTurns:previous.usedTurns,maxTurns:previous.maxTurns,
              exhausted:previous.usedTurns===previous.maxTurns,
            }
          }
          if (previous.usedTurns >= previous.maxTurns) {
            throw new C0ContractError('RUN_IDENTITY_MISMATCH',
              'Pi turn budget exhausted; only needs-resume technical status allowed')
          }
          const updated={...previous,usedTurns:previous.usedTurns+1,
            receiptIds:[...previous.receiptIds,mainTurnReceiptId]}
          this.write({...this.journal,runs:{
            ...this.journal.runs,[key(run)]:updated,
          }})
          return {
            usedTurns:updated.usedTurns,maxTurns:updated.maxTurns,
            exhausted:updated.usedTurns===updated.maxTurns,
          }
        },
      )
    } finally {this.busy=false}
  }
}
