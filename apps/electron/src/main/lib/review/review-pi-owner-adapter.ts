/**
 * V3 Dev-A Main-only execution owner. This is NOT an IPC entry point and not a
 * second Case/Run store. C0 business authority must attest every admission.
 *
 * Model-supplied IDs, session metadata and old process journals never grant
 * authority. A new process epoch quarantines all unfinished old leases.
 * Durable ACK is returned only after the ledger write succeeds.
 */
import { createHash, randomUUID } from 'node:crypto'
import {
  closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync,
  renameSync, unlinkSync, writeSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import {
  REVIEW_C0_SCHEMA_VERSION,
  assertC0CanonicalPlan,
  assertC0RunEvidenceIdentity,
  assertC0SourceIdentity,
  C0ContractError,
  type CanonicalPlan,
  type Principal,
  type RunEvidenceIdentity,
  type SourceIdentity,
} from '@profer/shared'

export const V3_REVIEW_TOOLS = [
  'review_read_documents',
  'review_inspect_document_image',
  'review_inspect_original',
  'review_submit_result',
] as const
export type V3ReviewTool = (typeof V3_REVIEW_TOOLS)[number]

export type V3OwnerState = 'active' | 'paused' | 'revoked' | 'deleted' | 'terminal' | 'recovery-required'
export interface V3OwnerLease {
  readonly grantId: string
  readonly sessionId: string
  readonly senderKey: string
  readonly processEpoch: string
  readonly caseId: string
  readonly attemptId: string
  readonly runId: string
  readonly generation: number
  readonly manifestHash: string
  readonly planFingerprint: string
  readonly sourceIdentities: readonly SourceIdentity[]
  /** Added in the versioned A2 producer era; old journals remain quarantined. */
  readonly runEvidence?: RunEvidenceIdentity
  readonly planSnapshot?: CanonicalPlan
  readonly permittedTools: readonly V3ReviewTool[]
  readonly expiresAt: number
  readonly state: V3OwnerState
}
interface OwnerDisk {
  version: 'v3-dev-a-owner/1'
  generationBySession: Record<string, number>
  owners: Record<string, V3OwnerLease>
  tombstones: string[]
}
interface SealedLedger { payload: OwnerDisk; sha256: string }
export interface OwnerPersistence {
  read(): string | null
  write(serialized: string): void
  /** Optional for synthetic stores; production file store enforces cross-PID CAS. */
  compareAndWrite?(expected: string | null, serialized: string): void
  /** Hold the same file lock that serializes grant/revoke during a sync event append. */
  withLeaseFence?<T>(operation: () => T): T
}

/** Main-only injection. Do not use a Renderer actor DTO to implement this hook. */
export interface V3MainAuthority {
  authorizeExecution(input: {
    principal: Principal
    run: RunEvidenceIdentity
    plan: CanonicalPlan
    sessionId: string
    senderKey: string
  }): void
  /** Re-read the current Case/source/Owner authorization at each tool boundary. */
  isCurrent(input: { lease: V3OwnerLease; principal: Principal }): boolean
}
export interface V3OwnerGrantRequest {
  principal: Principal
  run: RunEvidenceIdentity
  plan: CanonicalPlan
  sources: readonly SourceIdentity[]
  sessionId: string
  senderKey: string
  expiresAt: number
  permittedTools: readonly V3ReviewTool[]
}
const EMPTY = (): OwnerDisk => ({
  version: 'v3-dev-a-owner/1', generationBySession: {}, owners: {}, tombstones: [],
})
const digest = (value: string): string => createHash('sha256').update(value).digest('hex')
const own = (o: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(o, key)
function fail(message: string): never {
  throw new C0ContractError('RECOVERY_REQUIRED', message)
}
function assertLeaseValid(lease: V3OwnerLease): void {
  if (!lease || !lease.grantId || !lease.sessionId || !lease.senderKey ||
      !lease.processEpoch || !lease.caseId || !lease.attemptId || !lease.runId ||
      !Number.isSafeInteger(lease.generation) || lease.generation < 1 ||
      !/^[a-f0-9]{64}$/i.test(lease.manifestHash) ||
      !['active','paused','revoked','deleted','terminal','recovery-required'].includes(lease.state) ||
      !lease.planFingerprint || !Number.isFinite(lease.expiresAt) ||
      !Array.isArray(lease.permittedTools) ||
      !lease.permittedTools.every(t => V3_REVIEW_TOOLS.includes(t)) ||
      !Array.isArray(lease.sourceIdentities)) fail('Owner journal contains invalid scope')
  if (Boolean(lease.runEvidence) !== Boolean(lease.planSnapshot)) {
    fail('Owner journal contains partial Run/Plan snapshot')
  }
  if (lease.runEvidence && lease.planSnapshot) {
    assertC0RunEvidenceIdentity(lease.runEvidence)
    assertC0CanonicalPlan(lease.planSnapshot)
    if (lease.runEvidence.runId !== lease.runId ||
        lease.runEvidence.attemptId !== lease.attemptId ||
        lease.runEvidence.ownerGeneration !== lease.generation ||
        lease.runEvidence.inputManifestHash !== lease.manifestHash ||
        lease.runEvidence.planFingerprint !== lease.planFingerprint ||
        lease.runEvidence.caseId !== lease.caseId ||
        lease.planSnapshot.fingerprint !== lease.planFingerprint) {
      fail('Owner journal Run/Plan snapshots mismatch durable lease')
    }
  }
  for (const source of lease.sourceIdentities) {
    assertC0SourceIdentity(source)
    if (source.caseId !== lease.caseId) fail('Owner journal contains cross-case source')
  }
}
function decode(raw: string | null): OwnerDisk {
  if (raw === null) return EMPTY()
  let envelope: SealedLedger
  try { envelope = JSON.parse(raw) as SealedLedger }
  catch { return fail('Owner journal JSON is damaged') }
  if (!envelope || !envelope.payload || typeof envelope.sha256 !== 'string' ||
      digest(JSON.stringify(envelope.payload)) !== envelope.sha256) {
    fail('Owner journal integrity mismatch')
  }
  const p = envelope.payload
  if (p.version !== 'v3-dev-a-owner/1' || !p.owners ||
      typeof p.owners !== 'object' || Array.isArray(p.owners) ||
      !p.generationBySession || typeof p.generationBySession !== 'object' ||
      !Array.isArray(p.tombstones) || !p.tombstones.every(t => typeof t === 'string')) {
    fail('Unsupported Owner journal schema')
  }
  for (const [id, lease] of Object.entries(p.owners)) {
    assertLeaseValid(lease)
    if (id !== lease.sessionId ||
        (typeof p.generationBySession[id] !== 'number' ||
        p.generationBySession[id] < lease.generation)) fail('Owner generation corrupted')
  }
  return p
}
function encode(data: OwnerDisk): string {
  return JSON.stringify({ payload: data, sha256: digest(JSON.stringify(data)) })
}

/**
 * Atomic replace + inter-process optimistic CAS. A crashed process leaving a
 * lock must be reconciled explicitly; never break a possibly live lock by age
 * or by an untrusted PID hint. No lock acquire is an authorization ACK.
 */
export function createFileOwnerPersistence(filePath: string): OwnerPersistence {
  const parent = dirname(filePath)
  const lockPath = filePath + '.write-lock'
  const read = (): string | null =>
    existsSync(filePath) ? readFileSync(filePath, 'utf8') : null
  const atomicReplace = (serialized: string): void => {
    const temp = join(parent, '.' + randomUUID() + '.tmp')
    let handle: number | undefined
    try {
      handle = openSync(temp, 'wx', 0o600)
      const data = Buffer.from(serialized, 'utf8')
      let offset = 0
      while (offset < data.length) {
        const n = writeSync(handle, data, offset, data.length - offset)
        if (n <= 0) fail('Owner journal short write')
        offset += n
      }
      fsyncSync(handle)
      closeSync(handle)
      handle = undefined
      renameSync(temp, filePath)
      const directory = openSync(parent, 'r')
      try { fsyncSync(directory) } finally { closeSync(directory) }
    } finally {
      if (handle !== undefined) closeSync(handle)
      if (existsSync(temp)) unlinkSync(temp)
    }
  }
  const exclusive = <T>(operation: () => T): T => {
    mkdirSync(parent, { recursive: true })
    let lock: number
    try {
      lock = openSync(lockPath, 'wx', 0o600)
    } catch {
      fail('Owner journal inter-process lock unavailable; recovery required')
    }
    try {
      return operation()
    } finally {
      closeSync(lock)
      // A failed unlock must be visible, not reported as a clean commit.
      unlinkSync(lockPath)
    }
  }
  const lockedWrite = (serialized: string, expected?: string | null): void =>
    exclusive(() => {
      if (expected !== undefined && read() !== expected) {
        fail('Stale Owner journal snapshot; refusing cross-PID overwrite')
      }
      atomicReplace(serialized)
    })
  return {
    read,
    write: serialized => lockedWrite(serialized),
    compareAndWrite: (expected, serialized) => lockedWrite(serialized, expected),
    withLeaseFence: exclusive,
  }
}

/**
 * Host MUST instantiate once per Main process. Cross-PID locking and live
 * Electron caller binding are Dev-C integration gates, not inferred here.
 */
export class V3ReviewOwnerAdapter {
  readonly processEpoch = randomUUID()
  private readonly localDenied = new Set<string>()
  private readonly journal: OwnerDisk
  private revision: string | null
  private readonly authority: V3MainAuthority
  private readonly persistence: OwnerPersistence

  constructor(persistence: OwnerPersistence, authority: V3MainAuthority) {
    if (!persistence || !authority ||
        typeof authority.authorizeExecution !== 'function' ||
        typeof authority.isCurrent !== 'function') {
      throw new C0ContractError('ACTOR_UNTRUSTED', 'Main authorization port required')
    }
    this.persistence = persistence
    this.authority = authority
    this.revision = persistence.read()
    this.journal = decode(this.revision)
    // No old lease may become live merely because Main restarted.
    for (const [id, old] of Object.entries(this.journal.owners)) {
      if (old.state === 'active' || old.state === 'paused') this.localDenied.add(id)
    }
  }

  private assertFresh(): void {
    if (this.persistence.read() !== this.revision) {
      fail('Owner journal changed outside this process; re-open and reconcile')
    }
  }

  private persist(next: OwnerDisk): void {
    // Never update a stale state snapshot; process-local write success is not
    // a substitute for a CAS when multiple Main processes are possible.
    this.assertFresh()
    const serialized = encode(next)
    if (this.persistence.compareAndWrite) {
      this.persistence.compareAndWrite(this.revision, serialized)
    } else {
      this.persistence.write(serialized)
    }
    this.revision = serialized
    this.journal.owners = next.owners
    this.journal.generationBySession = next.generationBySession
    this.journal.tombstones = next.tombstones
  }

  /** No ACK until grant is durably journalled. */
  grant(request: V3OwnerGrantRequest): V3OwnerLease {
    this.assertFresh()
    assertC0RunEvidenceIdentity(request.run)
    assertC0CanonicalPlan(request.plan)
    if (request.run.schemaVersion !== REVIEW_C0_SCHEMA_VERSION ||
        !request.sessionId || !request.senderKey ||
        !request.principal?.principalId || !request.principal?.sessionId ||
        !request.principal.scope?.caseIds.includes(request.run.caseId) ||
        !request.plan.fingerprint || request.plan.fingerprint !== request.run.planFingerprint ||
        request.sources.length === 0 ||
        !Number.isFinite(request.expiresAt) || request.expiresAt <= Date.now() ||
        request.permittedTools.length === 0 ||
        !request.permittedTools.every(tool => V3_REVIEW_TOOLS.includes(tool))) {
      throw new C0ContractError('CONTRACT_INVALID', 'Owner grant scope/plan/tool invalid')
    }
    for (const src of request.sources) {
      assertC0SourceIdentity(src)
      if (src.caseId !== request.run.caseId ||
          !request.run.sourceVersionIds.includes(src.documentVersionId)) {
        throw new C0ContractError('SOURCE_STALE', 'Owner source not included in frozen Run')
      }
    }
    const previous = this.journal.owners[request.sessionId]
    if (this.journal.tombstones.includes(request.sessionId) || previous ||
        this.localDenied.has(request.sessionId)) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Owner session ID cannot be reused')
    }
    const expected = (this.journal.generationBySession[request.sessionId] ?? 0) + 1
    if (request.run.ownerGeneration !== expected) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Owner generation not monotonic')
    }
    // The Main port must bind actual sender+window, current Case and principal.
    this.authority.authorizeExecution({
      principal: request.principal, run: request.run, plan: request.plan,
      sessionId: request.sessionId, senderKey: request.senderKey,
    })
    const lease: V3OwnerLease = {
      grantId: randomUUID(), sessionId: request.sessionId,
      senderKey: request.senderKey, processEpoch: this.processEpoch,
      caseId: request.run.caseId, attemptId: request.run.attemptId,
      runId: request.run.runId, generation: expected,
      manifestHash: request.run.inputManifestHash,
      planFingerprint: request.plan.fingerprint,
      sourceIdentities: request.sources.map(x => structuredClone(x)),
      runEvidence: structuredClone(request.run),
      planSnapshot: structuredClone(request.plan),
      permittedTools: [...new Set(request.permittedTools)],
      expiresAt: request.expiresAt, state: 'active',
    }
    this.persist({
      ...this.journal,
      owners: { ...this.journal.owners, [lease.sessionId]: lease },
      generationBySession: { ...this.journal.generationBySession, [lease.sessionId]: expected },
    })
    return structuredClone(lease)
  }

  get(sessionId: string): V3OwnerLease | null {
    this.assertFresh()
    const lease = this.journal.owners[sessionId]
    // A correctly committed same-process pause is an intentional scheduler
    // state: old capabilities stay locally denied, but Main may explicitly
    // resume with a rotated grant. Cold paused grants must be quarantined.
    const mustRecover=lease && (lease.state==='active' || lease.state==='paused') &&
      (lease.processEpoch!==this.processEpoch ||
        (lease.state==='active' && this.localDenied.has(sessionId)))
    return lease ? structuredClone(mustRecover
      ? { ...lease, state: 'recovery-required' as const } : lease) : null
  }

  /** Explicitly separate ordinary session operations from review owners. */
  assertOrdinarySession(sessionId: string): void {
    this.assertFresh()
    if (this.journal.tombstones.includes(sessionId) ||
        own(this.journal.owners, sessionId) || this.localDenied.has(sessionId)) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Review-owned session is private')
    }
  }

  assertAuthorized(sessionId: string, grantId: string, senderKey: string,
    principal: Principal, tool: V3ReviewTool, source?: SourceIdentity): V3OwnerLease {
    this.assertFresh()
    const lease = this.journal.owners[sessionId]
    if (!lease || this.localDenied.has(sessionId) || lease.state !== 'active' ||
        lease.processEpoch !== this.processEpoch ||
        lease.grantId !== grantId || lease.senderKey !== senderKey ||
        Date.now() >= lease.expiresAt ||
        !lease.permittedTools.includes(tool) ||
        !principal.scope?.caseIds.includes(lease.caseId) ||
        !this.authority.isCurrent({ lease: structuredClone(lease), principal })) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Owner capability is not current')
    }
    if (source) {
      assertC0SourceIdentity(source)
      if (source.caseId !== lease.caseId ||
          !lease.sourceIdentities.some(s =>
            s.documentVersionId === source.documentVersionId &&
            s.materialId === source.materialId &&
            s.rawSha256 === source.rawSha256 &&
            s.parseRevision === source.parseRevision &&
            s.blockId === source.blockId &&
            s.location.kind === source.location.kind &&
            s.location.locator === source.location.locator)) {
        throw new C0ContractError('SOURCE_STALE', 'Source is not in Main frozen allowlist')
      }
    }
    this.assertFresh()
    return structuredClone(lease)
  }

  /**
   * Serializes the final authorization and an A-owned synchronous event append
   * against a cross-PID Owner revoke using the same file lock. This does not
   * bind or validate Dev-C's business Run consumer.
   */
  withAuthorizedEvent<T>(sessionId: string, grantId: string, senderKey: string,
    principal: Principal, tool: V3ReviewTool, source: SourceIdentity | undefined,
    append: (lease: V3OwnerLease) => T): T {
    const run = () => append(this.assertAuthorized(
      sessionId, grantId, senderKey, principal, tool, source,
    ))
    return this.persistence.withLeaseFence
      ? this.persistence.withLeaseFence(run)
      : run()
  }

  /**
   * Durable pause is a scheduling state, not a revoke and not a new Run.
   * Immediately deny this PID's old grant before the disk commit. If disk
   * I/O fails, keep it denied: only an explicit recovery can reconcile.
   */
  pause(sessionId: string): void {
    this.assertFresh()
    const old = this.journal.owners[sessionId]
    if (!old || old.state !== 'active' ||
        old.processEpoch !== this.processEpoch ||
        this.localDenied.has(sessionId)) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Only current active Owner can pause')
    }
    // A failed persistence write cannot reactivate an in-flight Host call.
    this.localDenied.add(sessionId)
    this.persist({
      ...this.journal,
      owners: {...this.journal.owners, [sessionId]: {...old, state: 'paused'}},
    })
  }

  /**
   * Main-attested same-process resume. Rotate the grantId so a pre-pause
   * in-flight Host await can NEVER be accepted after a later resume.
   * Cross-process restart requires recovery and a newly authorized attempt;
   * paused state never automatically revives.
   */
  resumePaused(sessionId: string, formerGrantId: string, senderKey: string,
    principal: Principal): V3OwnerLease {
    this.assertFresh()
    const old = this.journal.owners[sessionId]
    if (!old || old.state !== 'paused' || old.processEpoch !== this.processEpoch ||
        old.grantId !== formerGrantId || old.senderKey !== senderKey ||
        Date.now() >= old.expiresAt || !old.runEvidence || !old.planSnapshot ||
        !principal?.scope?.caseIds.includes(old.caseId)) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Paused Owner is not eligible to resume')
    }
    this.authority.authorizeExecution({
      principal, run: structuredClone(old.runEvidence),
      plan: structuredClone(old.planSnapshot), sessionId, senderKey,
    })
    if (!this.authority.isCurrent({lease: structuredClone(old),principal})) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Main denied Owner resume')
    }
    const renewed: V3OwnerLease = {...old, grantId: randomUUID(),state: 'active'}
    this.persist({
      ...this.journal,
      owners: {...this.journal.owners, [sessionId]: renewed},
    })
    // Only after the committed state and new capability are both present.
    this.localDenied.delete(sessionId)
    return structuredClone(renewed)
  }

  private settle(sessionId: string, state: Exclude<V3OwnerState, 'active' | 'paused'>): void {
    this.localDenied.add(sessionId) // deny even if another PID changed the file
    this.assertFresh()
    const old = this.journal.owners[sessionId]
    if (!old) throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Unknown Owner session')
    this.localDenied.add(sessionId) // deny before potentially failing disk I/O
    const next: OwnerDisk = {
      ...this.journal,
      owners: { ...this.journal.owners, [sessionId]: { ...old, state } },
      tombstones: state === 'deleted'
        ? [...new Set([...this.journal.tombstones, sessionId])]
        : [...this.journal.tombstones],
    }
    this.persist(next)
  }
  revoke(sessionId: string): void { this.settle(sessionId, 'revoked') }
  deleteSession(sessionId: string): void { this.settle(sessionId, 'deleted') }
  settleTerminal(sessionId: string): void { this.settle(sessionId, 'terminal') }

  /**
   * Cold start MUST explicitly classify old active grants before exposing
   * session state or continuing a paused attempt.
   */
  quarantineInterrupted(): string[] {
    this.assertFresh()
    const ids = Object.entries(this.journal.owners)
      .filter(([id, lease]) => (lease.state === 'active' || lease.state === 'paused') &&
        (lease.processEpoch !== this.processEpoch ||
          (lease.state === 'active' && this.localDenied.has(id))))
      .map(([id]) => id)
    if (!ids.length) return []
    const updated = { ...this.journal.owners }
    for (const id of ids) {
      const previous = updated[id]
      if (!previous) fail('Owner to quarantine missing')
      updated[id] = { ...previous, state: 'recovery-required' }
    }
    this.persist({ ...this.journal, owners: updated })
    return ids
  }
}
