/**
 * C2/R00 — Main-only, CAS-backed TECHNICAL execution proposal journal.
 *
 * Admission and consumption are deliberately not Renderer IPC. The C Main
 * caller must independently verify the frozen input manifest/Owner and
 * physical Host receipt at commit. Journal status never grants a formal
 * ReviewRun, Check, ReadReceipt, school Decision or external Outbox ACK.
 */
import { createHash } from 'node:crypto'
import {
  assertC0RunEvidenceIdentity, C0ContractError,
  type Actor, type CaseAggregateV2, type CanonicalPlan,
  type RunEvidenceIdentity, type V3ExecutionProposal, type ReviewCommandResult,
} from '@profer/shared'
import { CommandValidationError, payloadHash, submitCommand } from './case-store-v2'
import { executionProposalId, validateV3ExecutionProposal } from './review-v3-execution-contract'
import { assertC2HostRunNotFenced } from './review-v3-durable-host-fence'
import type { V3TrustedConsumptionContext, V3VerifiedHostReceipt } from './review-v3-execution-contract'

// V3TrustedConsumptionContext and receipt types are defined in C Main,
// not a Renderer-controllable shared DTO. Only main_service -> this module.
export interface C2TrustedHostEvidence {
  permissionGrantId: string
  grantActive: boolean
  receipts: ReadonlyMap<string, V3VerifiedHostReceipt>
}

export type C2PrepareAttestation = (
  aggregate: CaseAggregateV2, run: RunEvidenceIdentity,
) => void

export type C2VerifyHostAtCommit = (
  aggregate: CaseAggregateV2, event: V3ExecutionProposal,
) => C2TrustedHostEvidence

const stageGuard = (aggregate: CaseAggregateV2): void => {
  if (aggregate.caseV2.stage === 'archived')
    throw new CommandValidationError('INVALID_TRANSITION', '已归档案卷不能执行技术审核')
}
const currentVersions = (aggregate: CaseAggregateV2): Set<string> =>
  new Set(aggregate.caseV2.documents
    .filter(doc => doc.active !== false).map(doc => doc.versionId))
const canonical = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']'
  const r = value as Record<string, unknown>
  return '{' + Object.keys(r).filter(k => r[k] !== undefined).sort()
    .map(k => JSON.stringify(k) + ':' + canonical(r[k])).join(',') + '}'
}
const sameRun = (a: RunEvidenceIdentity, b: RunEvidenceIdentity): boolean =>
  canonical(a) === canonical(b)

/** Excludes only C's technical journaling and revision/timestamp churn.
 * Every real business mutation (including out-of-band data changes) must
 * invalidate the previously frozen admission before another Host event.
 */
function frozenInputDigest(record: CaseAggregateV2): string {
  const { receiptLog: _receipts, v3TechnicalExecution: _journal,
    v3ReviewRun: _sealedRun, caseV2, ...business } = record
  const { revision: _revision, updatedAt: _updatedAt, ...caseInputs } = caseV2
  return createHash('sha256').update(canonical({ caseInputs, business })).digest('hex')
}

/** Re-verify the entire durable event/Receipt chain, not merely a count.
 * The seal writer calls this inside its own serialized Case CAS handler.
 * This is integrity/provenance consistency, not a substitute for Main's real
 * Owner/physical-Host/registered-policy verification.
 */
export function assertV3TechnicalJournalIntegrity(aggregate: CaseAggregateV2): NonNullable<CaseAggregateV2['v3TechnicalExecution']> {
  const journal = aggregate.v3TechnicalExecution
  if (!journal || !aggregate.canonicalPlan) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '没有持久技术运行证据账及绑定 Plan')
  }
  assertC0RunEvidenceIdentity(journal.run)
  if (journal.run.caseId !== aggregate.caseV2.id ||
      journal.run.planFingerprint !== aggregate.canonicalPlan.fingerprint ||
      journal.run.templateVersion !== aggregate.canonicalPlan.templateVersion ||
      journal.frozenInputDigest !== frozenInputDigest(aggregate)) {
    throw new CommandValidationError('STALE_INPUT', 'Run/Plan/案卷原始输入已失效或被篡改')
  }
  const admitted = aggregate.receiptLog.filter(receipt =>
    receipt.type === 'AdmitV3TechnicalRun' &&
    receipt.revision === journal.admittedAtRevision &&
    receipt.payloadHash === payloadHash('AdmitV3TechnicalRun', journal.run))
  if (admitted.length !== 1 || journal.run.caseRevision !== journal.admittedAtRevision) {
    throw new CommandValidationError('INVALID_TRANSITION', '缺少与 Run 身份匹配的持久准入 CAS 回执')
  }
  if (!Array.isArray(journal.events) || journal.events.length > 4096) {
    throw new CommandValidationError('INVALID_TRANSITION', '技术事件账损坏或超过安全限额')
  }
  const persisted = aggregate.receiptLog.filter(receipt =>
    receipt.type === 'RecordV3TechnicalProposal' &&
    receipt.revision > journal.admittedAtRevision)
  if (persisted.length !== journal.events.length) {
    throw new CommandValidationError('INVALID_TRANSITION', '技术事件缺少对应 CAS 回执')
  }
  const seenReceipts = new Set<string>()
  let terminalStatus: typeof journal.terminalStatus
  for (let i = 0; i < journal.events.length; i++) {
    const item = journal.events[i]!
    const event = item.proposal
    const { eventId: _omitted, ...body } = event
    const receipt = persisted[i]
    if (item.sequence !== i + 1 || item.eventId !== event.eventId ||
        event.sequence !== item.sequence || !sameRun(event.run, journal.run) ||
        event.schemaVersion !== 'review-v3-execution/1' ||
        event.eventId !== executionProposalId(body as Omit<V3ExecutionProposal, 'eventId'>) ||
        !receipt || receipt.revision !== journal.admittedAtRevision + i + 1 ||
        receipt.requestId !== event.eventId ||
        receipt.payloadHash !== payloadHash('RecordV3TechnicalProposal', event) ||
        !event.hostReceiptId || seenReceipts.has(event.hostReceiptId) ||
        terminalStatus !== undefined) {
      throw new CommandValidationError('INVALID_TRANSITION',
        '技术事件 Hash、序号、Host 回执或 CAS 回执链不一致，需明确恢复')
    }
    seenReceipts.add(event.hostReceiptId)
    if (event.kind === 'terminal') terminalStatus = event.terminal.status
    if (event.kind === 'read') {
      const doc = aggregate.caseV2.documents.find(doc =>
        doc.versionId === event.read.source.documentVersionId && doc.active !== false)
      if (!doc || !doc.byteHash || doc.byteHash !== event.read.source.rawSha256) {
        throw new CommandValidationError('STALE_INPUT', 'Run 来源原件 SHA256 未验证或已改变')
      }
    }
  }
  if (terminalStatus !== journal.terminalStatus) {
    throw new CommandValidationError('INVALID_TRANSITION',
      '技术终态与持久 Host terminal 事件不一致')
  }
  return journal
}

/** Historical chain digest is stable after unrelated later Case decisions.
 * This pure helper DOES NOT attest current source/Owner authority by itself.
 */
export function rawV3TechnicalEventChainDigest(
  journal: NonNullable<CaseAggregateV2['v3TechnicalExecution']>,
): string {
  return createHash('sha256').update(canonical(journal.events.map(item => ({
    sequence: item.sequence, eventId: item.eventId, proposal: item.proposal,
  })))).digest('hex')
}

/** Hash of the exact currently validated technical proposals, in persisted order. */
export function digestV3TechnicalEventChain(aggregate: CaseAggregateV2): string {
  return rawV3TechnicalEventChainDigest(assertV3TechnicalJournalIntegrity(aggregate))
}

function assertPreparedPlan(aggregate: CaseAggregateV2, run: RunEvidenceIdentity): CanonicalPlan {
  stageGuard(aggregate)
  assertC2HostRunNotFenced(aggregate, run)
  const plan = aggregate.canonicalPlan
  if (!plan || aggregate.d2RuntimePlan)
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
      '没有唯一正式绑定的 CanonicalPlan，禁止创建执行账')
  assertC0RunEvidenceIdentity(run)
  if (run.caseId !== aggregate.caseV2.id ||
      run.planFingerprint !== plan.fingerprint ||
      run.templateVersion !== plan.templateVersion ||
      plan.templateId !== aggregate.caseV2.templateId ||
      plan.templateVersion !== String(aggregate.caseV2.templateVersion))
    throw new CommandValidationError('STALE_INPUT', '执行身份与本案已绑定 Plan 不一致')
  const active = currentVersions(aggregate)
  const expectedChecks = new Set(plan.bindings.map(binding => binding.checkKey))
  if (run.sourceVersionIds.length === 0 ||
      run.sourceVersionIds.some(id => !active.has(id)) ||
      new Set(run.sourceVersionIds).size !== run.sourceVersionIds.length ||
      run.checkKeys.length !== expectedChecks.size ||
      run.checkKeys.some(key => !expectedChecks.has(key)) ||
      new Set(run.checkKeys).size !== run.checkKeys.length ||
      plan.bindings.some(binding => binding.sourceVersionIds.some(id =>
        !active.has(id) || !run.sourceVersionIds.includes(id))))
    throw new CommandValidationError('STALE_INPUT',
      '执行声明未覆盖唯一 Plan 检查或选定的真实材料版本')
  return plan
}

/**
 * Installs a single technical journal AFTER independent C Main/Owner input
 * manifest attestation. Requires run.caseRevision = revision after CAS.
 * Does not start an SDK or assert a physical Provider request happened.
 */
export function admitV3TechnicalRun(
  caseId: string,
  command: { requestId: string; expectedRevision: number; actor: Actor; payload: RunEvidenceIdentity },
  attestAtCommit: C2PrepareAttestation,
): Promise<ReviewCommandResult> {
  if (typeof attestAtCommit !== 'function')
    throw new C0ContractError('BLOCKED_AUTH', 'C Main attestation callback is required')
  return submitCommand(caseId, { ...command, type: 'AdmitV3TechnicalRun' }, (aggregate, run) => {
    assertPreparedPlan(aggregate, run)
    if (aggregate.v3TechnicalExecution)
      throw new CommandValidationError('INVALID_TRANSITION',
        '原生技术运行账已存在；后续运行需显式新 attempt/归档合同')
    if (run.caseRevision !== aggregate.caseV2.revision + 1)
      throw new CommandValidationError('VERSION_CONFLICT', 'Run 必须锁定持久准入回执之后的 Case revision')
    attestAtCommit(aggregate, run)
    return {
      summary: `准入技术执行证据账 ${run.runId}；不授予正式运行或决定`,
      mutate: draft => {
        draft.v3TechnicalExecution = {
          run: structuredClone(run),
          frozenInputDigest: frozenInputDigest(aggregate),
          admittedAtRevision: aggregate.caseV2.revision + 1,
          events: [],
        }
      },
    }
  })
}

/** Only C Main can supply a current, independently verified Host registry. */
export function recordV3TechnicalProposal(
  caseId: string,
  command: { requestId: string; expectedRevision: number; actor: Actor; payload: V3ExecutionProposal },
  verifyHostAtCommit: C2VerifyHostAtCommit,
): Promise<ReviewCommandResult> {
  if (typeof verifyHostAtCommit !== 'function')
    throw new C0ContractError('BLOCKED_AUTH', 'C Main Host verifier is required')
  return submitCommand(caseId, { ...command, type: 'RecordV3TechnicalProposal' }, (aggregate, event) => {
    stageGuard(aggregate)
    if (command.requestId !== event.eventId)
      throw new CommandValidationError('VALIDATION_FAILED',
        '技术事件 requestId 必须是完整事件 eventId，禁止绕过精确幂等回执')
    const journal = assertV3TechnicalJournalIntegrity(aggregate)
    assertC2HostRunNotFenced(aggregate, journal.run)
    const plan = aggregate.canonicalPlan
    if (!plan) throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '绑定的 CanonicalPlan 不存在')
    if (!sameRun(event.run, journal.run) ||
        plan.fingerprint !== journal.run.planFingerprint)
      throw new CommandValidationError('STALE_INPUT', '事件试图越过原始 Run/Plan 身份')
    // Case revision may grow due to this very journal's CAS receipts; no
    // unrelated business write (material, Subject, Plan, archive, etc.) may
    // mutate the frozen run input between admission and this Host event.
    const later = aggregate.receiptLog.filter(entry =>
      entry.revision > journal.admittedAtRevision)
    if (later.some(entry => entry.type !== 'RecordV3TechnicalProposal'))
      throw new CommandValidationError('STALE_INPUT', 'Run 准入后发生其他业务变更，技术账不再是当前证据')
    if (journal.terminalStatus)
      throw new CommandValidationError('INVALID_TRANSITION', '技术终态已记录，不接受后续写入')
    if (journal.events.length >= 4096)
      throw new CommandValidationError('INVALID_TRANSITION',
        '技术事件账已达到本批受控上限，必须进行显式检查点/恢复处理')
    if (event.kind === 'read') {
      const doc = aggregate.caseV2.documents.find(item =>
        item.versionId === event.read.source.documentVersionId && item.active !== false)
      if (!doc || (doc.byteHash && doc.byteHash !== event.read.source.rawSha256))
        throw new CommandValidationError('STALE_INPUT',
          '物理 Host 来源 SHA256 与当前 Case 原件字节版本不一致')
    }
    const proof = verifyHostAtCommit(aggregate, event)
    if (!proof || !proof.grantActive || !proof.permissionGrantId ||
        !proof.receipts || typeof proof.receipts.get !== 'function')
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
        '没有仍有效的 Main/Host 原件与工具回执')
    const ctx: V3TrustedConsumptionContext = {
      run: journal.run,
      plan,
      permissionGrantId: proof.permissionGrantId,
      grantActive: proof.grantActive,
      currentCaseRevision: journal.run.caseRevision,
      activeSourceVersionIds: [...currentVersions(aggregate)],
      verifiedHostReceipts: proof.receipts,
      nextSequence: journal.events.length + 1,
      committedDigests: new Map(journal.events.map(item => [item.sequence, item.eventId])),
    }
    // Validator checks immutable tuple, grant, physical source, host receipt
    // and SHA-256 event identity, and refuses missing/changed sequence.
    const verdict = validateV3ExecutionProposal(event, ctx)
    if (verdict !== 'new')
      throw new CommandValidationError('REQUEST_ID_COLLISION',
        '已记录的事件仅可通过完全相同的命令 requestId/Receipt 重放')
    return {
      summary: `记录第 ${event.sequence} 条技术 ${event.kind} 候选；非正式 Check/Run`,
      mutate: draft => {
        draft.v3TechnicalExecution!.events.push({
          sequence: event.sequence, eventId: event.eventId,
          proposal: structuredClone(event), committedAt: new Date().toISOString(),
        })
        if (event.kind === 'terminal')
          draft.v3TechnicalExecution!.terminalStatus = event.terminal.status
      },
    }
  })
}
