/**
 * C: conservative per-case automation eligibility, rerunnable inside the
 * existing single-case transaction. It does not write any business data.
 */
import { assessDecisionReadiness, triageBatchCase } from '@profer/shared'
import type { BatchStateV2, CaseAggregateV2, ReviewRunV2, TemplateVersion, RuleSpec } from '@profer/shared'
import { getSettings } from '../settings-service'
import { getPolicy } from './policy-store'

export type AutoAction = 'pass' | 'return'
export type AutoGate = { allowed: true; requiredElements: string[]; reason: string } | { allowed: false; reason: string }

const blocked = (reason: string): AutoGate => ({ allowed: false, reason })

function confirmedRules(template: TemplateVersion, batch: BatchStateV2): Map<string, RuleSpec> | null {
  const refs = template.policyRefs?.map((ref) => ({ id: ref.policyId, version: ref.version, hash: ref.contentHash }))
    ?? template.policyVersionIds.map((id) => ({ id, version: batch.batch.policyVersionLock.find((ref) => ref.policyVersionId === id)?.version ?? 0, hash: '' }))
  if (!refs.length || refs.length !== batch.batch.policyVersionLock.length) return null
  const rules = new Map<string, RuleSpec>()
  for (const ref of refs) {
    if (!batch.batch.policyVersionLock.some((lock) => lock.policyVersionId === ref.id && lock.version === ref.version)) return null
    const policy = getPolicy(ref.id, ref.version)
    if (!policy || policy.status !== 'published' || (ref.hash && ref.hash !== policy.contentHash)
      || !policy.confirmations.length || !policy.compiledRules?.length) return null
    for (const rule of policy.compiledRules) {
      if (!rule.id || rules.has(rule.id) || rule.confirmation !== 'confirmed' || !rule.sourceRefIds?.length) return null
      rules.set(rule.id, rule)
    }
  }
  return rules
}

export function checkAutoBatchAction(
  state: BatchStateV2,
  aggregate: CaseAggregateV2,
  run: ReviewRunV2,
  template: TemplateVersion,
  action: AutoAction,
  observations: Array<Record<string, unknown>> = [],
): AutoGate {
  const policy = state.automation
  if (!policy || policy.mode === 'assist' || (action === 'pass' && policy.mode !== 'auto-approve'))
    return blocked('本批次未授权此类自动处理')
  if (state.status === 'finalized' || state.status === 'running') return blocked('批次仍在运行或已定稿')
  if (policy.templateId !== state.batch.templateId || policy.templateVersion !== state.batch.templateVersion
    || !policy.grantedAt || policy.grantedBy !== 'local-reviewer') return blocked('授权策略与批次不匹配')
  if (template.status !== 'published' || aggregate.caseV2.templateId !== state.batch.templateId
    || aggregate.caseV2.templateVersion !== state.batch.templateVersion) return blocked('未发布模板或版本不匹配')
  if (!state.cases.some((entry) => entry.caseId === aggregate.caseV2.id && entry.status === 'done'))
    return blocked('当前案卷还没有完成批次检查')
  if (aggregate.caseV2.stage === 'awaiting-supplement' || aggregate.caseV2.stage === 'decided'
    || aggregate.caseV2.stage === 'archived') return blocked('案卷已经在补件或正式决定阶段')
  if (aggregate.supplements.some((item) => ['open', 'responded', 'insufficient'].includes(item.status)))
    return blocked('补件请求尚未处理完毕')
  if (aggregate.appeals.some((item) => item.status === 'in-review' || item.status === 'submitted'))
    return blocked('申诉或复核尚未结束')

  const stages = template.stages
  const singleStage = stages.length === 1 ? stages[0] : undefined
  if (!singleStage || singleStage.workflowOwner === 'school'
    || singleStage.requiredApprovers && singleStage.requiredApprovers > 0
    || !['reviewer', 'system'].includes(singleStage.executorRole)) return blocked('存在多阶段、校方归属或人工审批门槛')
  if (template.rubric?.quota !== undefined || template.rubric || aggregate.caseV2.subjects.length > 0)
    return blocked('评分、名额或逐事项认定不允许由批次规则跳过')
  if (aggregate.tasks.some((task) => task.status === 'open' && !['reviewer', 'system'].includes(task.assigneeRole)))
    return blocked('存在其他角色的未办任务')

  const triage = triageBatchCase({
    caseId: aggregate.caseV2.id, entryStatus: 'done', caseStage: aggregate.caseV2.stage,
    batch: state.batch, run,
  })
  if (triage.route !== (action === 'pass' ? 'auto-pass-candidate' : 'auto-return-candidate'))
    return blocked('审核运行未满足本动作的自动分流条件')

  const rules = confirmedRules(template, state)
  if (!rules || !run.inputManifest.effectiveRuleIds?.length
    || run.inputManifest.effectiveRuleIds.some((id) => !rules.has(id))
    || run.checks.some((item) => !rules.has(item.ruleId))
    || run.coverage.completedChecks !== run.coverage.plannedChecks
    || run.checks.length !== run.coverage.plannedChecks
    || run.inputManifest.effectiveRuleIds.some((id) => !run.checks.some((check) => check.ruleId === id)))
    return blocked('政策规则未完整发布确认，或本轮检查与规则计划不一致')

  // For autonomous actions, every current active document must be represented
  // as read in THIS run, not just a historical case-level usage flag.
  if (aggregate.caseV2.documents.some((doc) =>
    doc.active !== false && !doc.unusedReason?.startsWith('[审核员忽略]')
    && !run.coverage.documents.some((item) => item.documentVersionId === doc.versionId && item.status === 'read'))) {
    return blocked('本轮审核运行未覆盖全部有效材料，不得自动处理')
  }
  // A source pointer must actually refer to a current, parseable case document;
  // a nonempty array with a fabricated version ID is not evidence.
  if (run.checks.some((check) => check.sourceRefs.some((ref) => ref.caseId !== aggregate.caseV2.id
    || !aggregate.caseV2.documents.some((doc) =>
      doc.active !== false && doc.versionId === ref.documentVersionId
      && doc.parseRevision === ref.parseRevision
      && (doc.parseStatus === 'parsed' || !!doc.manualReadReceipt))))) {
    return blocked('检查引用的证据不属于当前有效案卷材料或尚未正确读取')
  }
  // Each run check must reference a known, confirmed and published policy.
  if (action === 'pass') {
    if (getSettings().reviewAgentAutoApproval !== true) return blocked('全局自动审批授权已撤销')
    if (template.autoPassPolicy?.enabled !== true || template.autoPassPolicy.conditions)
      return blocked('模板未明确开启可评估的自动通过策略')
    if (!['auto-check', 'finalize'].includes(singleStage.kind)) return blocked('当前模板阶段必须人工审核')
    if (run.checks.some((check) => !['compliant', 'not-applicable'].includes(check.status)
      || (check.executedBy === 'semantic' && check.sourceRefs.length === 0)))
      return blocked('存在不合规检查或语义检查缺少证据')
    const readiness = assessDecisionReadiness({ aggregate, run, runStale: false, template, observations })
    if (!readiness.ready) return blocked('业务审批尚有阻断：' + readiness.blockers.map((b) => b.message).slice(0, 2).join('；'))
    return { allowed: true, requiredElements: [], reason: '有效规则检查全部符合且完成业务门槛校验，按批次已授权策略自动通过' }
  }

  const needs = run.checks.filter((check) => check.status === 'awaiting-supplement')
  if (!needs.length || run.checks.some((check) => !['awaiting-supplement', 'compliant', 'not-applicable'].includes(check.status)))
    return blocked('存在不能自动补正的检查')
  const requiredElements: string[] = []
  for (const check of needs) {
    const rule = rules.get(check.ruleId)!
    if (rule.onFail !== 'supplement' || !rule.requirement?.trim()
      || rule.requirement.trim().length > 400
      || check.sourceRefs.length === 0
      || check.sourceRefs.some((ref) => ref.caseId !== aggregate.caseV2.id
        || !aggregate.caseV2.documents.some((doc) => doc.active !== false
          && doc.versionId === ref.documentVersionId && doc.parseRevision === ref.parseRevision))) {
      return blocked('补件规则未明确授权或检查缺少有效证据定位')
    }
    const statement = `请提供能够证明以下要求的材料：${rule.requirement.trim()}`
    if (!requiredElements.includes(statement)) requiredElements.push(statement)
  }
  const reason = `根据已确认规则，需补充核实：${needs.map((check) => check.reason.trim()).join('；')}`
  return { allowed: true, requiredElements, reason }
}
