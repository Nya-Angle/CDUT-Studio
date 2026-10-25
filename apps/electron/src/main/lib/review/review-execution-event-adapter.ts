/**
 * Dev-A durable proposal outbox: converts authenticated Main-owned tool results
 * into frozen C0 ExecutionEvent. It never writes ReviewRun/Check/Decision.
 *
 * C0/1 lacks eventId/checkKey/outcome/terminal variants. The local delivery
 * digest is an outbox key, NOT a new shared execution protocol. See CR-A-001.
 */
import { createHash } from 'node:crypto'
import {
  REVIEW_C0_SCHEMA_VERSION, assertC0ExecutionEvent,
  C0ContractError, type ExecutionEvent, type Principal, type SourceIdentity,
} from '@profer/shared'
import {
  type OwnerPersistence, type V3ReviewTool, type V3ReviewOwnerAdapter,
} from './review-pi-owner-adapter'

export interface V3EventDelivery {
  readonly deliveryId: string
  readonly event: ExecutionEvent
}
type DeliveryRecord = V3EventDelivery & {
  acked: boolean
  /** Private outbox metadata; not a C0 ExecutionEvent or verified Run fact. */
  physicalSourceDigest?: string
}
interface EventDisk {
  version: 'v3-dev-a-event/1'
  attempts: Record<string, { nextSequence: number; terminal: boolean; records: DeliveryRecord[] }>
}
interface SealedEvents { payload: EventDisk; sha256: string }
export interface V3ReviewToolCall {
  sessionId: string
  grantId: string
  senderKey: string
  principal: Principal
  tool: V3ReviewTool
  source?: SourceIdentity
}
function sha(v: string) { return createHash('sha256').update(v).digest('hex') }
function initial(): EventDisk { return { version: 'v3-dev-a-event/1', attempts: {} } }
function load(raw: string | null): EventDisk {
  if (raw === null) return initial()
  let entry: SealedEvents
  try { entry = JSON.parse(raw) as SealedEvents }
  catch { throw new C0ContractError('RECOVERY_REQUIRED', 'Event outbox is unreadable') }
  if (!entry || !entry.payload || entry.payload.version !== 'v3-dev-a-event/1' ||
      !entry.payload.attempts || typeof entry.payload.attempts !== 'object' ||
      sha(JSON.stringify(entry.payload)) !== entry.sha256) {
    throw new C0ContractError('RECOVERY_REQUIRED', 'Event outbox integrity mismatch')
  }
  for (const [id, attempt] of Object.entries(entry.payload.attempts)) {
    if (!id || !Number.isSafeInteger(attempt.nextSequence) ||
        attempt.nextSequence < 1 || !Array.isArray(attempt.records)) {
      throw new C0ContractError('RECOVERY_REQUIRED', 'Event sequence invalid')
    }
    let seq = 0
    let seenTerminal = false
    for (const record of attempt.records) {
      assertC0ExecutionEvent(record.event)
      seq += 1
      if (record.physicalSourceDigest !== undefined &&
          !/^[a-f0-9]{64}$/i.test(record.physicalSourceDigest)) {
        throw new C0ContractError('RECOVERY_REQUIRED', 'Event source digest malformed')
      }
      if (record.event.sequence !== seq ||
          record.event.attemptId + ':' + record.event.generation !== id ||
          record.deliveryId !== sha(JSON.stringify(record.event)) ||
          typeof record.acked !== 'boolean' || seenTerminal) {
        throw new C0ContractError('RECOVERY_REQUIRED', 'Event replay chain invalid')
      }
      if (record.event.eventKind === 'stopped' || record.event.eventKind === 'failed') {
        seenTerminal = true
      }
    }
    if (seq + 1 !== attempt.nextSequence || seenTerminal !== attempt.terminal) {
      throw new C0ContractError('RECOVERY_REQUIRED', 'Terminal or sequence mismatch')
    }
  }
  return entry.payload
}
function seal(data: EventDisk): string {
  return JSON.stringify({ payload: data, sha256: sha(JSON.stringify(data)) })
}

export class V3ExecutionEventAdapter {
  private readonly disk: EventDisk
  private revision: string | null
  private busy = false
  constructor(private readonly persistence: OwnerPersistence,
    private readonly owners: V3ReviewOwnerAdapter) {
    this.revision = persistence.read()
    this.disk = load(this.revision)
  }
  private assertFresh(): void {
    if (this.persistence.read() !== this.revision) {
      throw new C0ContractError('RECOVERY_REQUIRED',
        'Event journal changed in another process; cannot use stale sequence or ACK')
    }
  }
  private store(next: EventDisk): void {
    this.assertFresh()
    const serialized = seal(next)
    if (this.persistence.compareAndWrite) {
      this.persistence.compareAndWrite(this.revision, serialized)
    } else {
      this.persistence.write(serialized)
    }
    this.revision = serialized
    this.disk.attempts = next.attempts
  }
  private key(attemptId: string, generation: number): string {
    return attemptId + ':' + generation
  }
  /**
   * The sequence is monotonic; one explicit terminal event seals the attempt.
   * A duplicate ACK may be retried, but cannot append the same event twice.
   */
  private append(call: V3ReviewToolCall, kind: ExecutionEvent['eventKind'],
    toolReceipt: ExecutionEvent['toolReceipt']): V3EventDelivery {
    if (this.busy) throw new C0ContractError('RECOVERY_REQUIRED', 'Event outbox busy')
    this.busy = true
    try {
      this.assertFresh()
      return this.owners.withAuthorizedEvent(
        call.sessionId, call.grantId, call.senderKey, call.principal,
        call.tool, call.source, lease => {
      const k = this.key(lease.attemptId, lease.generation)
      const previous = this.disk.attempts[k] ?? {
        nextSequence: 1, terminal: false, records: [],
      }
      const sourceDigest = call.source ? sha(JSON.stringify(call.source)) : undefined
      // A tool callback may be delivered again by the SDK. Identical Host
      // receipts must never create two Review proposals, even after a local
      // delivery ACK. Reusing a receipt for another physical block is a
      // collision, not proof that both blocks were actually read.
      if (toolReceipt) {
        const duplicate = previous.records.find(r =>
          r.event.toolReceipt?.receiptId === toolReceipt.receiptId)
        if (duplicate) {
          const old = duplicate.event
          if (old.eventKind !== kind ||
              old.toolReceipt?.permissionGrantId !== toolReceipt.permissionGrantId ||
              old.toolReceipt?.sourceVersionId !== toolReceipt.sourceVersionId ||
              duplicate.physicalSourceDigest !== sourceDigest) {
            throw new C0ContractError('REQUEST_ID_COLLISION',
              'Host receipt reused for a different tool or physical Source')
          }
          this.assertFresh()
          return structuredClone({ deliveryId: duplicate.deliveryId, event: old })
        }
      }
      if (previous.terminal) {
        throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Terminal attempt is sealed')
      }
      const event: ExecutionEvent = {
        schemaVersion: REVIEW_C0_SCHEMA_VERSION,
        attemptId: lease.attemptId, generation: lease.generation,
        sequence: previous.nextSequence, eventKind: kind,
        toolReceipt, manifestHash: lease.manifestHash,
      }
      assertC0ExecutionEvent(event)
      const delivery: V3EventDelivery = {
        deliveryId: sha(JSON.stringify(event)), event,
      }
      const record: DeliveryRecord = {
        ...delivery, acked: false,
        ...(sourceDigest ? { physicalSourceDigest: sourceDigest } : {}),
      }
      const next = {
        ...this.disk,
        attempts: {
          ...this.disk.attempts,
          [k]: {
            nextSequence: previous.nextSequence + 1,
            terminal: kind === 'failed' || kind === 'stopped',
            records: [...previous.records, record],
          },
        },
      }
      this.store(next)
      return structuredClone(delivery)
        },
      )
    } finally {
      this.busy = false
    }
  }
  proposeRead(call: V3ReviewToolCall, receiptId: string): V3EventDelivery {
    if (call.tool !== 'review_read_documents' &&
        call.tool !== 'review_inspect_document_image' &&
        call.tool !== 'review_inspect_original') {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Not an inspection tool')
    }
    if (!call.source || !receiptId) {
      throw new C0ContractError('SOURCE_STALE', 'Physical source receipt required')
    }
    return this.append(call, 'read-receipt-proposal', {
      receiptId, permissionGrantId: call.grantId,
      sourceVersionId: call.source.documentVersionId,
    })
  }
  proposeCheck(call: V3ReviewToolCall, receiptId: string): V3EventDelivery {
    if (call.tool !== 'review_submit_result' || !receiptId) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Authenticated submit receipt required')
    }
    return this.append(call, 'check-proposal', {
      receiptId, permissionGrantId: call.grantId,
    })
  }
  /**
   * No synthetic completed/business-pass. Technical end without all required
   * accepted Checks must remain failed/partial until C approves CR-A-001.
   */
  failAttempt(call: V3ReviewToolCall): V3EventDelivery {
    return this.append(call, 'failed', null)
  }
  stopAttempt(call: V3ReviewToolCall): V3EventDelivery {
    return this.append(call, 'stopped', null)
  }

  pending(): V3EventDelivery[] {
    this.assertFresh()
    return Object.values(this.disk.attempts).flatMap(attempt =>
      attempt.records.filter(x => !x.acked)
        .map(x => structuredClone({ deliveryId: x.deliveryId, event: x.event })))
  }
  /** Dev-C ACK must match the exact attempt/generation/sequence/id tuple. */
  acknowledge(deliveryId: string, event: ExecutionEvent): boolean {
    this.assertFresh()
    assertC0ExecutionEvent(event)
    if (deliveryId !== sha(JSON.stringify(event))) return false
    const k = this.key(event.attemptId, event.generation)
    const attempt = this.disk.attempts[k]
    if (!attempt) return false
    const item = attempt.records.find(r => r.deliveryId === deliveryId &&
      r.event.sequence === event.sequence && JSON.stringify(r.event) === JSON.stringify(event))
    if (!item) return false
    if (item.acked) return true
    if (attempt.records.some(r => r.event.sequence < event.sequence && !r.acked)) return false
    const records = attempt.records.map(r => r === item ? { ...r, acked: true } : r)
    this.store({
      ...this.disk,
      attempts: { ...this.disk.attempts, [k]: { ...attempt, records } },
    })
    return true
  }

  /**
   * Host read/inspect. The callback is a Main-resolved SourceIdentity service,
   * NOT an arbitrary model path or a generic shell command.
   * Authorization is re-read after every awaited Host call, even on success.
   */
  async guardedRead<T>(call: V3ReviewToolCall,
    execute: (source: SourceIdentity) => Promise<{ receiptId: string; actualSource: SourceIdentity; result: T }>,
  ): Promise<{ result: T; delivery: V3EventDelivery }> {
    if (!call.source) throw new C0ContractError('SOURCE_STALE', 'Source required')
    this.owners.assertAuthorized(call.sessionId, call.grantId, call.senderKey,
      call.principal, call.tool, call.source)
    const receipt = await execute(structuredClone(call.source))
    this.owners.assertAuthorized(call.sessionId, call.grantId, call.senderKey,
      call.principal, call.tool, call.source)
    if (!receipt || !receipt.receiptId || !receipt.actualSource ||
        receipt.actualSource.caseId !== call.source.caseId ||
        receipt.actualSource.materialId !== call.source.materialId ||
        receipt.actualSource.documentVersionId !== call.source.documentVersionId ||
        receipt.actualSource.rawSha256 !== call.source.rawSha256 ||
        receipt.actualSource.parseRevision !== call.source.parseRevision ||
        receipt.actualSource.blockId !== call.source.blockId ||
        receipt.actualSource.location.kind !== call.source.location.kind ||
        receipt.actualSource.location.locator !== call.source.location.locator) {
      throw new C0ContractError('SOURCE_STALE', 'Host receipt did not match exact frozen physical source')
    }
    // Append rechecks the grant once more immediately before durable event.
    return { result: receipt.result, delivery: this.proposeRead(call, receipt.receiptId) }
  }
}
