/**
 * F05: human-proposed source corrections in the existing Case CAS journal.
 * A proposal is not a mutation, Plan, Run or authorization. 用户可以主动撤回
 * 本地案卷已绑定的计划并纠正材料，但撤回不等于取得新正式计划的发布权限。
 */
import { randomUUID } from 'node:crypto'
import type { Actor, CaseAggregateV2, DocumentVersion, ReviewCommandResult } from '@profer/shared'
import { reviewV3SlotAcceptsFile } from '@profer/shared'
import { CommandValidationError, submitCommand } from './case-store-v2'
import { isNativeWorkspaceCaseV3 } from './native-workspace-case-v3'
import { getTemplate } from './template-store'
import { revokeCurrentSourceValidity } from './source-current-validity-v3'
import { verifyD2InstalledPlan } from './review-d2-runtime'
import { listRunsV2 } from './run-store-v2'

type Role = DocumentVersion['role']
type RecordV3 = NonNullable<CaseAggregateV2['remediationRecords']>[number]
type Proposed = Pick<RecordV3, 'documentVersionId' | 'nextRole' | 'nextMaterialSlotId' | 'reason'>

const roleSet = new Set<Role>(['rule', 'application', 'evidence', 'attachment'])
const planKind = (caseRecord: CaseAggregateV2): RecordV3['planKind'] =>
  caseRecord.canonicalPlan ? 'canonical' : caseRecord.d2RuntimePlan ? 'd2' : 'none'
const fingerprint = (caseRecord: CaseAggregateV2): string | undefined =>
  caseRecord.canonicalPlan?.fingerprint ?? caseRecord.d2RuntimePlan?.fingerprint

function assertNativeMutable(caseRecord: CaseAggregateV2): void {
  if (!isNativeWorkspaceCaseV3(caseRecord) ||
      caseRecord.caseV2.stage === 'archived' || caseRecord.caseV2.stage === 'decided') {
    throw new CommandValidationError('INVALID_TRANSITION', '只有未归档且未终审的原生 V3 案卷可以提出材料纠错')
  }
}
function validateChange(caseRecord: CaseAggregateV2, input: Proposed): DocumentVersion {
  if (!input || typeof input.documentVersionId !== 'string' ||
      !roleSet.has(input.nextRole) || typeof input.reason !== 'string' ||
      input.reason.trim().length < 5 || input.reason.length > 1000 ||
      (input.nextMaterialSlotId !== undefined &&
        (typeof input.nextMaterialSlotId !== 'string' || !input.nextMaterialSlotId.trim() ||
          input.nextMaterialSlotId.length > 160))) {
    throw new CommandValidationError('VALIDATION_FAILED', '纠错必须说明原因、真实原件版本和有效分类')
  }
  const document = caseRecord.caseV2.documents.find(item =>
    item.versionId === input.documentVersionId && item.active !== false)
  if (!document) throw new CommandValidationError('STALE_INPUT', '纠错原件已换版或不在当前案卷')
  if (document.role === input.nextRole &&
      (document.materialSlotId ?? '') === (input.nextMaterialSlotId ?? '')) {
    throw new CommandValidationError('INVALID_TRANSITION', '纠错目标与当前材料分类完全一致')
  }
  if (input.nextMaterialSlotId) {
    const template = getTemplate(caseRecord.caseV2.templateId, caseRecord.caseV2.templateVersion)
    const slot = template?.materialSlots.find(item => item.id === input.nextMaterialSlotId)
    if (!slot || !reviewV3SlotAcceptsFile(slot, document.fileName) ||
        (slot.acceptedRoles?.length && !slot.acceptedRoles.includes(input.nextRole))) {
      throw new CommandValidationError('VALIDATION_FAILED', '目标槽位不存在或不接受该原件格式与类别')
    }
  }
  return document
}

export function proposeNativeRemediationV3(input: {
  caseId: string; requestId: string; expectedRevision: number; actor: Actor;
  payload: Proposed
}, authorizeAtCommit?: () => void): Promise<ReviewCommandResult<RecordV3>> {
  const id = 'rem-' + randomUUID().replace(/-/g, '')
  return submitCommand(input.caseId, {
    ...input, type: 'ProposeNativeRemediationV3',
  }, (caseRecord, proposed) => {
    authorizeAtCommit?.()
    assertNativeMutable(caseRecord)
    const document = validateChange(caseRecord, proposed)
    const record: RecordV3 = {
      id, documentVersionId: document.versionId, beforeRole: document.role,
      ...(document.materialSlotId ? { beforeMaterialSlotId: document.materialSlotId } : {}),
      nextRole: proposed.nextRole,
      ...(proposed.nextMaterialSlotId ? { nextMaterialSlotId: proposed.nextMaterialSlotId } : {}),
      reason: proposed.reason.trim(), proposedAt: new Date().toISOString(),
      proposedRevision: caseRecord.caseV2.revision,
      planKind: planKind(caseRecord),
      ...(fingerprint(caseRecord) ? { planFingerprint: fingerprint(caseRecord) } : {}),
      status: 'proposed',
    }
    return {
      summary: `提出材料版本 ${document.versionId} 分类/槽位纠错：${record.reason}`,
      mutate: draft => {
        draft.remediationRecords = [...(draft.remediationRecords ?? []), record]
        return record
      },
    }
  })
}

/**
 * D2 is a LOCAL technical candidate, so a human may explicitly withdraw it
 * to rebuild from the original B1/D4 source. There is no fake in-place Plan
 * upgrade: the Case becomes unbound and cannot run until a new one is installed.
 * 正式 CanonicalPlan 只能显式撤回并存入历史；撤回后退回未绑定草稿，
 * 不能把本机重新建立的技术计划冒充原正式计划。
 */
export function applyNativeRemediationV3(input: {
  caseId: string; requestId: string; expectedRevision: number; actor: Actor;
  payload: { proposalId: string; acknowledgedD2Fingerprint?: string;
    acknowledgedCanonicalFingerprint?: string; rebuildAcknowledgement?: string }
}, authorizeAtCommit?: () => void): Promise<ReviewCommandResult<RecordV3>> {
  return submitCommand(input.caseId, { ...input, type: 'ApplyNativeRemediationV3' }, (caseRecord, payload) => {
    authorizeAtCommit?.()
    assertNativeMutable(caseRecord)
    const proposal = caseRecord.remediationRecords?.find(record => record.id === payload.proposalId)
    if (!proposal || proposal.status !== 'proposed') {
      throw new CommandValidationError('INVALID_TRANSITION', '纠错提案不存在或已经实施')
    }
    if (listRunsV2(input.caseId).some(run => run.status === 'queued' || run.status === 'running')) {
      throw new CommandValidationError('INVALID_TRANSITION',
        '当前 Pi 审核尚未停止；请先取消或等待本轮结束，再执行分类纠错与重审')
    }
    if (caseRecord.v3TechnicalExecution &&
        (!caseRecord.v3TechnicalExecution.terminalStatus ||
          caseRecord.v3TechnicalExecution.terminalStatus === 'needs-resume')) {
      throw new CommandValidationError('INVALID_TRANSITION',
        '正式审核技术执行仍在运行或等待恢复，请先终止本轮再纠正材料')
    }
    if (proposal.planKind !== planKind(caseRecord) ||
        proposal.planFingerprint !== fingerprint(caseRecord)) {
      throw new CommandValidationError('STALE_INPUT', '纠错提案对应的计划已变化，请重新提出并核对')
    }
    const document = validateChange(caseRecord, {
      documentVersionId: proposal.documentVersionId, nextRole: proposal.nextRole,
      nextMaterialSlotId: proposal.nextMaterialSlotId, reason: proposal.reason,
    })
    if (document.role !== proposal.beforeRole ||
        (document.materialSlotId ?? '') !== (proposal.beforeMaterialSlotId ?? '')) {
      throw new CommandValidationError('STALE_INPUT', '材料类别或槽位已变化，不能应用旧提案')
    }
    const d2 = caseRecord.d2RuntimePlan
    const canonical = caseRecord.canonicalPlan
    if (canonical) {
      if (payload.acknowledgedCanonicalFingerprint !== canonical.fingerprint ||
          payload.rebuildAcknowledgement !== '我确认旧正式审核计划及结果失效') {
        throw new CommandValidationError('VALIDATION_FAILED',
          '本机撤回正式审核计划必须精确确认原计划指纹与旧结果失效')
      }
    } else if (payload.acknowledgedCanonicalFingerprint) {
      throw new CommandValidationError('VALIDATION_FAILED', '未绑定正式审核计划，不能提交正式计划撤回确认')
    }
    if (d2) {
      if (payload.acknowledgedD2Fingerprint !== d2.fingerprint ||
          payload.rebuildAcknowledgement !== '我确认旧技术预审计划及审核结果失效') {
        throw new CommandValidationError('VALIDATION_FAILED', '撤回 D2 技术计划必须明确确认其原始指纹和旧结果失效')
      }
      const problems = verifyD2InstalledPlan(caseRecord)
      if (problems.length) throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
        'D2 原计划已不一致，禁止自动移除责任：' + problems.join('；'))
      if (caseRecord.v3ReviewRun || caseRecord.v3TechnicalExecution) {
        throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
          '本案存在独立 C0 技术执行证据，须走 C0 Owner/Plan 升版，不能本地撤回 D2')
      }
    } else if (!canonical && (payload.acknowledgedD2Fingerprint || payload.rebuildAcknowledgement)) {
      throw new CommandValidationError('VALIDATION_FAILED', '未冻结技术计划的纠错不需要撤回确认')
    }
    const appliedAt = new Date().toISOString()
    const completed: RecordV3 = {
      ...proposal, status: 'applied', appliedAt,
      ...((d2 || canonical) ? { invalidatedPlanFingerprint: (d2 ?? canonical)!.fingerprint } : {}),
    }
    return {
      summary: `人工纠正原件 ${document.versionId} 分类/槽位；${d2 ? '撤回旧 D2 任务包并要求重新固定计划、重新运行' : canonical ? '撤回旧正式计划，降为未绑定草稿；不得沿用旧正式结论' : '旧输入失效并须复审'}；${proposal.reason}`,
      mutate: draft => {
        draft.caseV2.documents = draft.caseV2.documents.map(item => item.versionId !== document.versionId
          ? item : {
              ...item, role: proposal.nextRole,
              materialSlotId: proposal.nextMaterialSlotId,
              usage: 'unread' as const,
              // 机器分类可保存在不可变 Receipt 中，但人工纠错后不能再作为当前标签。
              automaticClassification: undefined,
              // 与分类事务同一回执字段：只表示人工把材料归到哪里，不放松
              // 任何计划/归档校验，也不把纠错当成政策或事实核验。
              classificationCorrection: {
                role: proposal.nextRole,
                materialSlotId: proposal.nextMaterialSlotId ?? null,
                at: appliedAt,
              },
            })
        revokeCurrentSourceValidity(draft, new Set([document.versionId]), 'reclassify')
        // Any open supplement/task is tied to the superseded Run and must not
        // silently gate or satisfy the replacement Run. Keep the entire old
        // request/response history, changing only its current workflow state.
        draft.supplements = draft.supplements.map(supplement =>
          ['open', 'responded', 'insufficient'].includes(supplement.status)
            ? { ...supplement, status: 'cancelled' as const } : supplement)
        draft.tasks = draft.tasks.map(task =>
          ['open', 'in-progress', 'submitted'].includes(task.status)
            ? { ...task, status: 'cancelled' as const, completedAt: appliedAt } : task)
        if (draft.caseV2.stage === 'awaiting-supplement') draft.caseV2.stage = 'draft'
        // A correction generation changes the ordinary Run input hash even if
        // a future correction restores the original role/slot byte-for-byte.
        draft.caseV2.caseFields.remediationGeneration = { kind: 'text', value: randomUUID() }
        if (canonical) {
          // 只保留为不可变历史；本地用户没有伪造已发布新版 Plan 的能力。
          // 后续如需再次进入正式审核，必须新建正式案卷走可信绑定流程。
          draft.canonicalPlanHistory = [...(draft.canonicalPlanHistory ?? []), structuredClone(canonical)]
          draft.canonicalPlan = undefined
          draft.caseV2.caseFields.retiredCanonicalPlanFingerprint = { kind: 'text', value: canonical.fingerprint }
        }
        if (d2) {
          draft.d2RuntimePlanHistory = [...(draft.d2RuntimePlanHistory ?? []), structuredClone(d2)]
          draft.d2RuntimePlan = undefined
        }
        if (d2 || canonical) {
          draft.caseV2.reviewRules = []
          draft.caseV2.subjects = []
          delete draft.caseV2.caseFields.d2PlanFingerprint
          draft.caseV2.templateId = 'pending-template-v3'
          draft.caseV2.templateVersion = 0
          draft.caseV2.objectType = 'document'
          draft.caseV2.stage = 'draft'
        }
        draft.remediationRecords = (draft.remediationRecords ?? []).map(record =>
          record.id === proposal.id ? completed : record)
        return completed
      },
    }
  })
}
