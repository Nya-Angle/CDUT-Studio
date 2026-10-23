/**
 * C1 immutable Plan binding. Only Dev-C's Main business service may call this
 * with a verified Dev-B artifact verifier; not exposed as Renderer IPC.
 * It does not confer template publication or school policy authority.
 */
import {
  assertC0CanonicalPlan, type Actor, type CanonicalPlan, type CaseAggregateV2,
  type ReviewCommandResult,
} from '@profer/shared'
import { CommandValidationError, submitCommand } from './case-store-v2'

export type VerifyPublishedCanonicalPlan = (
  plan: CanonicalPlan,
  /** Same frozen Case snapshot under submitCommand CAS; optional for old mock verifiers. */
  aggregate: CaseAggregateV2,
) => void

function checkPlan(caseRecord: CaseAggregateV2, plan: CanonicalPlan, verify: VerifyPublishedCanonicalPlan): void {
  assertC0CanonicalPlan(plan)
  // The external trust adapter MUST verify the published artifact provenance,
  // source module digests and fingerprint; caller-supplied DTOs are insufficient.
  verify(plan, caseRecord)
  if (plan.templateId !== caseRecord.caseV2.templateId ||
      plan.templateVersion !== String(caseRecord.caseV2.templateVersion)) {
    throw new CommandValidationError('VALIDATION_FAILED', 'Plan template/version is not the bound Case template')
  }
  // Native three-column draft rules are not published policy. Refuse to
  // silently install a formal Plan that ignores these still-pending author
  // intents. A later dedicated C publisher must resolve them explicitly.
  const nativeDraft = caseRecord.caseV2.nativeWorkspaceDraft
  if (nativeDraft?.manualRules.length)
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
      '原生工作台仍有未正式采纳或明确舍弃的手写规则草稿，禁止静默安装 CanonicalPlan')
  const activeVersions = new Set(caseRecord.caseV2.documents.filter((doc) => doc.active !== false).map((doc) => doc.versionId))
  if (nativeDraft?.subjectDocumentVersionIds !== undefined) {
    if (nativeDraft.subjectDocumentVersionIds.some(id => !activeVersions.has(id)))
      throw new CommandValidationError('STALE_INPUT', '待审主体原件版本已失效，必须显式重选')
    const planVersions = new Set(plan.bindings.flatMap(binding => binding.sourceVersionIds))
    if (nativeDraft.subjectDocumentVersionIds.some(id => !planVersions.has(id)))
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
        'CanonicalPlan 未显式覆盖工作台所选择的全部当前待审原件')
  }
  const keys = new Set<string>()
  for (const binding of plan.bindings) {
    const key = JSON.stringify([binding.checkKey, binding.targetKey, binding.objectKey])
    if (keys.has(key)) throw new CommandValidationError('VALIDATION_FAILED', 'Plan contains repeated Check×target×object')
    keys.add(key)
    if (binding.sourceVersionIds.some((id) => !activeVersions.has(id))) {
      throw new CommandValidationError('STALE_INPUT', 'Plan references an unavailable or archived material version')
    }
    // Case-level targets are owned by the canonical producer. For subject
    // targets, require a real Case Subject; never synthesize a V1 target.
    if (binding.targetKey.startsWith('subject:') &&
      !caseRecord.caseV2.subjects.some((subject) => subject.id === binding.subjectId)) {
      throw new CommandValidationError('VALIDATION_FAILED', 'Plan target Subject does not exist')
    }
  }
}

/** First bind: only one immutable published Plan, never a silent overwrite. */
export function bindCanonicalPlanV3(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: CanonicalPlan },
  verify: VerifyPublishedCanonicalPlan,
): Promise<ReviewCommandResult<CanonicalPlan>> {
  return submitCommand<CanonicalPlan, CanonicalPlan>(caseId, { ...command, type: 'BindCanonicalPlan' }, (aggregate, plan) => {
    checkPlan(aggregate, plan, verify)
    if (aggregate.canonicalPlan) throw new CommandValidationError('INVALID_TRANSITION', 'Plan already bound; explicit upgrade ACK required')
    return {
      summary: `绑定不可变 Plan ${plan.planId}@${plan.fingerprint}`,
      mutate: (draft) => {
        draft.canonicalPlan = structuredClone(plan)
        return draft.canonicalPlan
      },
    }
  })
}

/**
 * Dev-C B-CR-002-B: one removed obligation is the entire
 * Check × target × object × subject × source-version-set identity.
 *
 * Changes of condition/outcome alone do NOT authorize deletion of a Check.
 * Source-version replacement DOES remove the old obligation and needs ACK.
 * The identity is deterministic and recomputed from BOTH frozen plans by
 * Main inside the existing serialized Case transaction, not from UI diff.
 */
export interface CMainUpgradeRemovalAck {
  readonly previousFingerprint:string
  readonly nextFingerprint:string
  readonly acknowledgedRemovedIdentities: readonly string[]
}
export type CMainAuthorizeRemovedPlanBindings = (
  aggregate:CaseAggregateV2,
  actor:Actor,
  acknowledgement:CMainUpgradeRemovalAck,
  computedRemoved:readonly string[],
)=>void

function obligationIdentity(binding:CanonicalPlan['bindings'][number]):string {
  return JSON.stringify([
    binding.checkKey,binding.targetKey,binding.objectKey,binding.subjectId,
    [...binding.sourceVersionIds].sort(),
  ])
}
/** UI may display this pure diff, but Main never trusts UI's claimed removal set. */
export function describeRemovedPlanBindings(
  before:CanonicalPlan,after:CanonicalPlan,
):string[] {
  assertC0CanonicalPlan(before)
  assertC0CanonicalPlan(after)
  const current=new Set(after.bindings.map(obligationIdentity))
  return [...new Set(before.bindings.map(obligationIdentity))]
    .filter(identity=>!current.has(identity)).sort()
}
function assertRemovalAckAtCommit(
  aggregate:CaseAggregateV2,actor:Actor,before:CanonicalPlan,after:CanonicalPlan,
  ack:CMainUpgradeRemovalAck|undefined,reason:string,
  authorize:CMainAuthorizeRemovedPlanBindings|undefined,
):number {
  const removed=describeRemovedPlanBindings(before,after)
  if(!removed.length) {
    if(ack!==undefined) throw new CommandValidationError('VALIDATION_FAILED',
      'Non-removal Plan upgrade must not invent a Check-removal ACK')
    return 0
  }
  if(!ack || ack.previousFingerprint!==before.fingerprint ||
    ack.nextFingerprint!==after.fingerprint ||
    !Array.isArray(ack.acknowledgedRemovedIdentities) ||
    ack.acknowledgedRemovedIdentities.length!==removed.length ||
    ack.acknowledgedRemovedIdentities.some((id,i)=>
      typeof id!=='string'||id!==removed[i]) ||
    !reason.trim()) {
    throw new CommandValidationError('VALIDATION_FAILED',
      'Deleted Check×target×object×subject×sources requires exact explicit Main ACK')
  }
  if(typeof authorize!=='function') {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
      'Independent Main Principal/Owner/Subject removal approval unavailable')
  }
  // C/Main injects physical Principal, grant and current Owner validator;
  // caller Actor/Renderer string is not a capability to authorize removal.
  authorize(aggregate,actor,ack,removed)
  return removed.length
}

/** Explicit operator ACK; no legacy projection / hot reload may call this. */
export function upgradeCanonicalPlanV3(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number;
    payload: { plan: CanonicalPlan; previousFingerprint: string; acknowledgement: string;
      removalAck?: CMainUpgradeRemovalAck } },
  verify: VerifyPublishedCanonicalPlan,
  authorizeRemoved?: CMainAuthorizeRemovedPlanBindings,
): Promise<ReviewCommandResult<CanonicalPlan>> {
  return submitCommand<{ plan: CanonicalPlan; previousFingerprint: string; acknowledgement: string;
    removalAck?: CMainUpgradeRemovalAck }, CanonicalPlan>(caseId, { ...command, type: 'UpgradeCanonicalPlan' }, (aggregate, payload) => {
    const previous = aggregate.canonicalPlan
    if (!previous || previous.fingerprint !== payload.previousFingerprint) {
      throw new CommandValidationError('STALE_INPUT', 'Plan upgrade ACK does not identify the installed Plan')
    }
    if (!payload.acknowledgement.trim()) throw new CommandValidationError('VALIDATION_FAILED', 'Plan upgrade requires an explicit reason/ACK')
    checkPlan(aggregate, payload.plan, verify)
    if (previous.fingerprint === payload.plan.fingerprint || previous.planId === payload.plan.planId) {
      throw new CommandValidationError('INVALID_TRANSITION', 'A new immutable Plan identity is required')
    }
    // Removing an obligation is business-critical. Recheck BOTH Plan issuer
    // sources under the existing durable Case CAS before Main-issued approval.
    // A revoked historical issuer needs explicit future recovery, never UI ACK.
    const removed=describeRemovedPlanBindings(previous,payload.plan)
    if(removed.length) verify(previous,aggregate)
    const removedCount=assertRemovalAckAtCommit(aggregate,command.actor,previous,
      payload.plan,payload.removalAck,payload.acknowledgement,authorizeRemoved)
    return {
      summary: `确认升级 Plan ${previous.planId} → ${payload.plan.planId}（删除义务 ${removedCount} 项）：${payload.acknowledgement.trim()}`,
      mutate: (draft) => {
        draft.canonicalPlanHistory = [...(draft.canonicalPlanHistory ?? []), structuredClone(previous)]
        draft.canonicalPlan = structuredClone(payload.plan)
        return draft.canonicalPlan
      },
    }
  })
}
