/**
 * 单案工作台业务动作：待办处置、补件和人工最终决定均走 V2 聚合事务。
 */
import { assessDecisionReadiness } from '@profer/shared'
import type { Actor, BusinessDecision, CaseAggregateV2, FieldValue, ReviewCommandResult, ReviewRunV2, SubjectAdjudication, SupplementRequest } from '@profer/shared'
import { CommandValidationError, submitCommand } from './case-store-v2'
import { getRunV2, listRunsV2, readArtifact } from './run-store-v2'
import { computeRunInputHash } from './run-service-v2'
import { currentSourceValidityBlockers } from './source-current-validity-v3'
import { resolveCurrentBusinessRun } from './review-runtime-contract'

type WorkspaceDisposition = 'confirmed-issue' | 'human-confirmed-compliant' | 'false-positive' | 'supplement-requested' | 'waived' | 'escalated'
type WorkspaceDecision = BusinessDecision['result']

function hasSupplementResponseAfterRun(aggregate: CaseAggregateV2, run: ReviewRunV2): boolean {
  const completedAt = run.completedAt ?? run.startedAt
  // Opening a request records workflow intent against this run; it does not
  // change the reviewed inputs. A response does, and requires a fresh review.
  return aggregate.supplements.some((supplement) => supplement.responses.some((response) => response.at > completedAt))
}

function currentSubjectAdjudications(aggregate: CaseAggregateV2, runId?: string, inputHash?: string): Map<string, SubjectAdjudication> {
  const records = aggregate.adjudications ?? []
  const supersededIds = new Set(records.flatMap((record) => record.supersedesAdjudicationId ? [record.supersedesAdjudicationId] : []))
  const current = records.filter((record) => !supersededIds.has(record.id) && (!runId || (record.basedOnRunId === runId && record.inputHash === inputHash))).sort((a, b) => a.at.localeCompare(b.at))
  const result = new Map<string, SubjectAdjudication>()
  for (const record of current) result.set(record.subjectId, record)
  return result
}

function finalScoresFor(aggregate: CaseAggregateV2, adjudications: Map<string, SubjectAdjudication>, runId: string): BusinessDecision['finalScores'] {
  return aggregate.caseV2.subjects.flatMap((subject) => {
    const adjudication = adjudications.get(subject.id)
    if (!adjudication) return []
    if (adjudication.outcome === 'rejected') return [{ subjectId: subject.id, value: '0', basisRunId: runId }]
    const manuallyConfirmedScore = aggregate.observations
      .filter((observation) => observation.subjectId === subject.id && observation.fieldKey === 'declaredScore' && observation.extractedBy === 'user' && observation.confirmed)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
      .at(-1)?.value
    const field = adjudication.finalFields?.declaredScore ?? adjudication.finalFields?.score ?? manuallyConfirmedScore ?? subject.fields.declaredScore ?? subject.fields.score
    if (!field || field.kind !== 'number') return []
    return [{ subjectId: subject.id, value: String(field.value), basisRunId: runId }]
  })
}

export function recordWorkspaceSubjectAdjudicationV2(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: { subjectId: string; outcome: SubjectAdjudication['outcome']; finalFields?: Record<string, FieldValue>; reason: string; runId: string; inputHash: string } },
): Promise<ReviewCommandResult<SubjectAdjudication>> {
  return submitCommand(caseId, { ...command, type: 'RecordWorkspaceSubjectAdjudication' }, (aggregate, payload) => {
    const run = assertCurrentRun(aggregate, payload.runId, payload.inputHash)
    if (!['completed', 'partially-completed'].includes(run.status)) throw new CommandValidationError('INVALID_TRANSITION', '运行未完成，不能进行事项最终认定')
    const subject = aggregate.caseV2.subjects.find((candidate) => candidate.id === payload.subjectId)
    if (!subject) throw new CommandValidationError('NOT_FOUND', `申报事项不存在: ${payload.subjectId}`)
    if (!['accepted', 'rejected', 'modified'].includes(payload.outcome)) throw new CommandValidationError('VALIDATION_FAILED', '事项认定结果无效')
    if (!payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '事项最终认定必须填写理由')
    if (payload.outcome === 'modified' && !Object.keys(payload.finalFields ?? {}).length) throw new CommandValidationError('VALIDATION_FAILED', '修改认定必须填写最终认定内容')
    const { getTemplate } = require('./template-store') as typeof import('./template-store')
    const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
    const allowedFields = new Set([...(template?.fields ?? []).map((field) => field.key), ...Object.keys(subject.fields)])
    for (const key of Object.keys(payload.finalFields ?? {})) {
      if (!allowedFields.has(key)) throw new CommandValidationError('VALIDATION_FAILED', `事项不支持最终认定字段: ${key}`)
    }
    const previous = currentSubjectAdjudications(aggregate).get(subject.id)
    return {
      summary: `审核员${payload.outcome === 'modified' ? '修改' : payload.outcome === 'accepted' ? '确认' : '不予'}事项认定：${subject.title}`,
      mutate: (draft) => {
        const record: SubjectAdjudication = {
          id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          subjectId: subject.id,
          outcome: payload.outcome,
          ...(payload.finalFields ? { finalFields: payload.finalFields } : {}),
          reason: payload.reason.trim(),
          basedOnRunId: run.id,
          inputHash: run.inputManifest.hash,
          actor: command.actor,
          at: new Date().toISOString(),
          ...(previous ? { supersedesAdjudicationId: previous.id } : {}),
        }
        draft.adjudications = [...(draft.adjudications ?? []), record]
        return record
      },
    }
  })
}

function assertCurrentRun(aggregate: CaseAggregateV2, runId: string, inputHash: string) {
  const sourceBlockers = currentSourceValidityBlockers(aggregate)
  if (sourceBlockers.length) throw new CommandValidationError('STALE_INPUT', '存在已撤效或来源无法核验的当前事实/关联，需重新确认并审核')
  const run = getRunV2(aggregate.caseV2.id, runId)
  if (!run || run.inputManifest.hash !== inputHash) throw new CommandValidationError('STALE_INPUT', '审核运行已过期，请重新运行后再处理')
  const currentHash = computeRunInputHash(aggregate.caseV2, aggregate.observations as unknown as Array<Record<string, unknown>>, aggregate.evidenceLinks as unknown as Array<Record<string, unknown>>)
  if (currentHash !== inputHash) throw new CommandValidationError('STALE_INPUT', '案卷输入已变化，请重新运行后再处理')
  if (hasSupplementResponseAfterRun(aggregate, run)) throw new CommandValidationError('STALE_INPUT', '补件回复在审核运行后发生变化，请重新审核后再处理')
  // RUN-14：只能对“当前权威业务 Run”办理处置/认定/补件，不能拿上一轮
  // 输入哈希相同的旧 Run 串轮写入。判定复用 review-runtime-contract，
  // 不做第二套时间戳/可见性规则；旧 Run 仍可在界面只读查看。
  const authority = resolveCurrentBusinessRun({
    aggregate,
    runs: listRunsV2(aggregate.caseV2.id),
    stale: (candidate) => isWorkspaceRunStaleV2(aggregate, candidate.id),
  })
  if (!authority.run) {
    throw new CommandValidationError('STALE_INPUT', '当前没有可办理的权威审核运行；请先完成最新一轮审核')
  }
  if (authority.run.id !== run.id) {
    throw new CommandValidationError('STALE_INPUT', `只能针对当前轮审核运行 ${authority.run.id} 办理；旧运行 ${run.id} 为只读历史`)
  }
  return run
}

export function recordWorkspaceDispositionV2(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: { findingKey: string; disposition: WorkspaceDisposition; reason: string; runId: string; inputHash: string } },
): Promise<ReviewCommandResult<CaseAggregateV2['dispositions'][number]>> {
  return submitCommand(caseId, { ...command, type: 'RecordWorkspaceFindingDisposition' }, (aggregate, payload) => {
    const run = assertCurrentRun(aggregate, payload.runId, payload.inputHash)
    const exists = run.checks.some((check) => check.checkId === payload.findingKey || check.ruleId === payload.findingKey)
      || run.opinions.some((opinion) => opinion.id === payload.findingKey || opinion.checkId === payload.findingKey)
    if (!exists) throw new CommandValidationError('NOT_FOUND', `本次运行中不存在待办: ${payload.findingKey}`)
    if (!payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '处理待办必须填写理由')
    if (!['confirmed-issue', 'human-confirmed-compliant', 'false-positive', 'supplement-requested', 'waived', 'escalated'].includes(payload.disposition)) {
      throw new CommandValidationError('VALIDATION_FAILED', '待办处置状态无效')
    }
    const dispositionLabel = payload.disposition === 'confirmed-issue' ? '确认问题属实'
      : payload.disposition === 'human-confirmed-compliant' ? '人工确认本项符合'
        : payload.disposition === 'false-positive' ? '标记 AI 误报'
          : payload.disposition === 'supplement-requested' ? '要求补件'
            : payload.disposition === 'waived' ? '暂不处理' : '升级处理'
    return {
      summary: `审核员处置待办：${dispositionLabel}`,
      mutate: (draft) => {
        const record = {
          findingKey: payload.findingKey,
          disposition: payload.disposition,
          actor: command.actor.actorId,
          actorSource: command.actor.actorSource,
          role: command.actor.role,
          reason: payload.reason.trim(),
          at: new Date().toISOString(),
          runId: run.id,
          inputHash: run.inputManifest.hash,
        }
        draft.dispositions = [...draft.dispositions, record]
        return record
      },
    }
  })
}

export function openWorkspaceSupplementV2(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: { findingKey: string; runId: string; inputHash: string; requiredElements: string[]; reason: string } },
): Promise<ReviewCommandResult<SupplementRequest>> {
  return submitCommand(caseId, { ...command, type: 'OpenWorkspaceSupplement' }, (aggregate, payload) => {
    const run = assertCurrentRun(aggregate, payload.runId, payload.inputHash)
    const slotMatch = payload.findingKey.match(/^material-slot:(.+)$/)
    if (slotMatch) {
      const { getTemplate } = require('./template-store') as typeof import('./template-store')
      const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
      const slot = template?.materialSlots.find((candidate) => candidate.id === slotMatch[1])
      if (!slot) throw new CommandValidationError('NOT_FOUND', `材料槽不存在: ${slotMatch[1]}`)
      if ((slot.requiredAt ?? 'submission') !== 'decision') throw new CommandValidationError('VALIDATION_FAILED', `材料槽 ${slot.id} 不是最终决定必需材料`)
      const activeCount = aggregate.caseV2.documents.filter((document) => document.active !== false && document.materialSlotId === slot.id).length
      if (activeCount >= slot.minCount) throw new CommandValidationError('INVALID_TRANSITION', `材料槽 ${slot.name} 已满足数量要求，无需补件`)
    } else if (!run.checks.some((check) => check.checkId === payload.findingKey || check.ruleId === payload.findingKey)
      && !run.opinions.some((opinion) => opinion.id === payload.findingKey || opinion.checkId === payload.findingKey)) {
      throw new CommandValidationError('NOT_FOUND', `本次运行中不存在待办: ${payload.findingKey}`)
    }
    const requiredElements = payload.requiredElements.map((item) => item.trim()).filter(Boolean)
    if (!requiredElements.length || !payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '补件必须填写缺少要素和原因')
    return {
      summary: `审核员要求补件：${payload.reason.trim()}`,
      mutate: (draft) => {
        const now = new Date().toISOString()
        const supplement: SupplementRequest = {
          id: `sup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          caseId,
          originFindingKeys: [payload.findingKey],
          requiredElements,
          reason: payload.reason.trim(),
          responsibleRole: 'student',
          status: 'open',
          responses: [],
          createdAt: now,
          documentVersionIdsAtRequest: aggregate.caseV2.documents.map((document) => document.versionId),
        }
        draft.supplements = [...draft.supplements, supplement]
        draft.caseV2.stage = 'awaiting-supplement'
        draft.dispositions = [...draft.dispositions, {
          findingKey: payload.findingKey,
          disposition: 'supplement-requested',
          actor: command.actor.actorId,
          actorSource: command.actor.actorSource,
          role: command.actor.role,
          reason: payload.reason.trim(),
          at: now,
          runId: run.id,
          inputHash: run.inputManifest.hash,
        }]
        return supplement
      },
    }
  })
}

export function acknowledgeWorkspaceMaterialV2(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: { documentVersionId: string; action: 'read' | 'ignore'; reason: string } },
): Promise<ReviewCommandResult<CaseAggregateV2['caseV2']['documents'][number]>> {
  return submitCommand(caseId, { ...command, type: 'AcknowledgeWorkspaceMaterial' }, (aggregate, payload) => {
    const document = aggregate.caseV2.documents.find((item) => item.versionId === payload.documentVersionId && item.active !== false)
    if (!document) throw new CommandValidationError('NOT_FOUND', `材料版本不存在: ${payload.documentVersionId}`)
    if (!payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '人工检查材料必须填写处理说明')
    const acknowledgedAt = new Date().toISOString()
    return {
      summary: payload.action === 'ignore' ? `人工忽略材料：${document.fileName}` : `人工检查材料：${document.fileName}`,
      mutate: (draft) => {
        const changed = {
          ...document,
          usage: 'read' as const,
          unusedReason: payload.action === 'ignore' ? `[审核员忽略] ${payload.reason.trim()}` : undefined,
          manualReadReceipt: payload.action === 'read'
            ? { actorId: command.actor.actorId, reason: payload.reason.trim(), at: acknowledgedAt }
            : undefined,
        }
        draft.caseV2.documents = draft.caseV2.documents.map((item) => item.versionId === payload.documentVersionId ? changed : item)
        return changed
      },
    }
  })
}

/**
 * Machine-originated final decisions are only allowed through a current, explicit
 * batch policy. The check is performed INSIDE submitCommand's serialized handler,
 * so disabling the policy or changing the case before commit fails closed.
 */
function assertAutomatedWorkspaceDecision(
  aggregate: CaseAggregateV2,
  run: ReviewRunV2,
  actor: Actor,
  result: WorkspaceDecision,
  requiredElements: string[] | undefined,
  reason: string,
): void {
  if (actor.actorSource === 'agent') {
    const { getSettings } = require('../settings-service') as typeof import('../settings-service')
    if (getSettings().reviewAgentAutoApproval !== true) throw new CommandValidationError('AGENT_DECISION_DISABLED', 'AI 代批未授权')
    // Generic Agent approval is not batch automation. Its permissions are scoped separately.
    return
  }
  if (actor.actorSource !== 'system') return
  const match = /^batch-auto:([^:]+):(\d+)$/.exec(actor.actorId)
  if (!match) throw new CommandValidationError('AGENT_DECISION_DISABLED', '未经授权的系统审批主体')
  const batchId = decodeURIComponent(match[1]!)
  const { readBatchStateV2 } = require('./batch-store') as typeof import('./batch-store')
  const { checkAutoBatchAction } = require('./batch-automation-gates') as typeof import('./batch-automation-gates')
  const { getTemplate } = require('./template-store') as typeof import('./template-store')
  const { readArtifact } = require('./run-store-v2') as typeof import('./run-store-v2')
  const batch = readBatchStateV2(batchId)
  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
  if (!batch || !template || batch.automation?.revision !== Number(match[2]))
    throw new CommandValidationError('AGENT_DECISION_DISABLED', '批次自动化授权已失效')
  const action = result === 'pass' ? 'pass' : result === 'return' ? 'return' : null
  if (!action) throw new CommandValidationError('AGENT_DECISION_DISABLED', '自动审批只支持符合或补件')
  const artifact = readArtifact<{ observations?: Array<Record<string, unknown>> }>(aggregate.caseV2.id, run.id, 'node-auto-check-extract')
  const gate = checkAutoBatchAction(batch, aggregate, run, template, action, artifact?.observations ?? [])
  if (!gate.allowed) throw new CommandValidationError('AGENT_DECISION_DISABLED', gate.reason)
  if (reason !== gate.reason || (action === 'return' && JSON.stringify(requiredElements ?? []) !== JSON.stringify(gate.requiredElements)))
    throw new CommandValidationError('VALIDATION_FAILED', '自动处理的理由或补正要素与已核验规则不一致')
}

export function decideWorkspaceCaseV2(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: { result: WorkspaceDecision; reason: string; basedOnRunId: string; inputHash: string; requiredElements?: string[]; supplementReason?: string } },
): Promise<ReviewCommandResult<BusinessDecision>> {
  return submitCommand(caseId, { ...command, type: 'RecordWorkspaceBusinessDecision' }, (aggregate, payload) => {
    // D2 候选为技术预审：普通 Pi 的完成回执不能获取校方行政决定权限。
    if (aggregate.d2RuntimePlan) throw new CommandValidationError('AGENT_DECISION_DISABLED', 'D2 技术预审案卷不能形成正式批准，需另走有权业务流程')
    // A bound CanonicalPlan must be reviewed by the verified C2 Run writer.
    // A legacy graph Run or run@rev cannot acquire policy/coverage authority.
    if (aggregate.canonicalPlan) throw new CommandValidationError('AGENT_DECISION_DISABLED', '冻结 CanonicalPlan 案卷尚无受控真实 Run 定稿服务；不得使用历史运行直接审批')
    const run = assertCurrentRun(aggregate, payload.basedOnRunId, payload.inputHash)
    if (!['completed', 'partially-completed'].includes(run.status)) throw new CommandValidationError('INVALID_TRANSITION', '运行未完成，不能形成最终决定')
    if (!payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '最终决定必须填写理由')
    if (aggregate.caseV2.stage === 'decided' || aggregate.caseV2.stage === 'archived') throw new CommandValidationError('INVALID_TRANSITION', '案卷已结束')
    assertAutomatedWorkspaceDecision(aggregate, run, command.actor, payload.result, payload.requiredElements, payload.reason)

    if (payload.result === 'pass' || payload.result === 'partial-pass') {
      const { getTemplate } = require('./template-store') as typeof import('./template-store')
      const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
      const extractArtifact = readArtifact<{ observations?: Array<Record<string, unknown>> }>(aggregate.caseV2.id, run.id, 'node-auto-check-extract')
      const readiness = assessDecisionReadiness({
        aggregate,
        run,
        runStale: false,
        template,
        observations: extractArtifact?.observations ?? [],
      })
      if (!readiness.ready) throw new CommandValidationError('DEPENDENCY_UNRESOLVED', `仍有阻断最终决定的事项：${readiness.blockers.map((blocker) => blocker.message).join('；')}`)
      if (aggregate.caseV2.subjects.length > 0) {
        const adjudications = currentSubjectAdjudications(aggregate, run.id, run.inputManifest.hash)
        const missing = aggregate.caseV2.subjects.filter((subject) => !adjudications.has(subject.id))
        if (missing.length) throw new CommandValidationError('DEPENDENCY_UNRESOLVED', `仍有事项未完成人工最终认定：${missing.map((subject) => subject.title).join('、')}`)
        if (payload.result === 'partial-pass' && ![...adjudications.values()].some((entry) => entry.outcome === 'modified' || entry.outcome === 'rejected')) {
          throw new CommandValidationError('VALIDATION_FAILED', '部分通过必须至少有一项修改或不予认定的事项结果')
        }
      }
    }
    if (payload.result === 'return' && (!(payload.requiredElements?.some((item) => item.trim())) || !payload.supplementReason?.trim())) {
      throw new CommandValidationError('VALIDATION_FAILED', '退回补件必须指定缺少要素和原因')
    }

    return {
      summary: `审核员作出最终决定：${payload.result}`,
      mutate: (draft) => {
        const now = new Date().toISOString()
        const decision: BusinessDecision = {
          id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          actor: command.actor,
          scope: { kind: 'case', ids: [] },
          stageId: draft.caseV2.stage,
          result: payload.result,
          reason: payload.reason.trim(),
          basedOnRunId: run.id,
          basedOnRevision: aggregate.caseV2.revision,
          finalScores: finalScoresFor(aggregate, currentSubjectAdjudications(aggregate, run.id, run.inputManifest.hash), run.id),
          at: now,
          finality: 'final',
        }
        draft.decisions = [...draft.decisions, decision]
        if (payload.result === 'return') {
          draft.supplements = [...draft.supplements, {
            id: `sup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            caseId,
            originFindingKeys: [],
            requiredElements: payload.requiredElements!.map((item) => item.trim()).filter(Boolean),
            reason: payload.supplementReason!.trim(),
            responsibleRole: 'student',
            status: 'open',
            responses: [],
            createdAt: now,
            documentVersionIdsAtRequest: aggregate.caseV2.documents.map((document) => document.versionId),
          }]
          draft.caseV2.stage = 'awaiting-supplement'
        } else {
          draft.caseV2.stage = 'decided'
          draft.tasks = draft.tasks.map((task) => task.status === 'open' ? { ...task, status: 'completed', completedAt: now } : task)
        }
        return decision
      },
    }
  })
}

/** 与工作台共用的新鲜度查询；历史运行可留存，但不能作为当前结论。 */
export function isWorkspaceRunStaleV2(aggregate: CaseAggregateV2, runId: string): boolean {
  const run = getRunV2(aggregate.caseV2.id, runId)
  if (!run?.inputManifest.hash) return true
  const observations = aggregate.observations as unknown as Array<Record<string, unknown>>
  const evidenceLinks = aggregate.evidenceLinks as unknown as Array<Record<string, unknown>>
  const currentHash = computeRunInputHash(aggregate.caseV2, observations, evidenceLinks)
  if (currentHash !== run.inputManifest.hash) {
    // Runs created before document ordering was removed from the content hash
    // keep their recorded order in the manifest. Recompute against that order
    // so a later projection-only reorder does not disable reviewer actions.
    const manifestOrder = run.inputManifest.documentVersions.map((document) => document.versionId)
    const currentIds = aggregate.caseV2.documents.map((document) => document.versionId)
    const manifestIds = new Set(manifestOrder)
    if (manifestIds.size !== manifestOrder.length
      || manifestIds.size !== currentIds.length
      || currentIds.some((id) => !manifestIds.has(id))
      || computeRunInputHash(aggregate.caseV2, observations, evidenceLinks, manifestOrder) !== run.inputManifest.hash) return true
  }
  return hasSupplementResponseAfterRun(aggregate, run)
}
