import type { CaseAggregateV2, ReviewRunV2, TemplateVersion } from '../types'
import { assessMaterialSlotV2 } from './material-slot-readiness-v2'

export type DecisionBlockerKind =
  | 'stale-run'
  | 'unresolved-check'
  | 'unconfirmed-fact'
  | 'candidate-evidence'
  | 'missing-material-slot'
  | 'open-supplement'
  | 'missing-adjudication'
  | 'unread-material'
  | 'zero-effective-rules'

export interface DecisionReadiness {
  ready: boolean
  blockers: Array<{ kind: DecisionBlockerKind; id?: string; message: string }>
}

const ACTIONABLE_CHECK_STATUSES = new Set(['non-compliant', 'awaiting-supplement', 'awaiting-confirmation', 'not-executed', 'execution-failed'])
const ACTIVE_SUPPLEMENT_STATUSES = new Set(['open', 'responded', 'insufficient'])

export function isDecisionRelevantObservation(run: ReviewRunV2, fieldKey: string): boolean {
  const dependencies = run.inputManifest.effectiveRuleDependencies
  // Legacy runs lack dependency manifests. Fail safely until a fresh run records them.
  if (!dependencies) return true
  return dependencies.some((dependency) => dependency.fieldKeys.includes('*') || dependency.fieldKeys.includes(fieldKey))
}

function currentAdjudicatedSubjectIds(aggregate: CaseAggregateV2, run: ReviewRunV2): Set<string> {
  const records = aggregate.adjudications ?? []
  const superseded = new Set(records.flatMap((record) => record.supersedesAdjudicationId ? [record.supersedesAdjudicationId] : []))
  return new Set(records.filter((record) => !superseded.has(record.id) && record.basedOnRunId === run.id && record.inputHash === run.inputManifest.hash).map((record) => record.subjectId))
}

export function assessDecisionReadiness(input: {
  aggregate: CaseAggregateV2
  run: ReviewRunV2 | null
  runStale: boolean
  template?: TemplateVersion | null
  observations?: Array<Record<string, unknown>>
}): DecisionReadiness {
  const { aggregate, run, runStale, template } = input
  const blockers: DecisionReadiness['blockers'] = []
  if (!run || runStale || !['completed', 'partially-completed'].includes(run.status)) {
    blockers.push({ kind: 'stale-run', id: run?.id, message: '需要先完成一份与当前案卷输入一致的审核运行。' })
  }
  if (!run) return { ready: false, blockers }

  const effectiveRuleCount = run.inputManifest.effectiveRuleIds?.length ?? run.coverage.plannedChecks
  if (effectiveRuleCount === 0) blockers.push({ kind: 'zero-effective-rules', message: '当前运行没有有效规则检查。' })
  if (run.coverage.completedChecks < run.coverage.plannedChecks) {
    blockers.push({ kind: 'unresolved-check', id: 'coverage:missing-results', message: `有 ${run.coverage.plannedChecks - run.coverage.completedChecks} 项计划检查没有结果记录，请重新运行审核。` })
  }

  for (const check of run.checks) {
    if (!ACTIONABLE_CHECK_STATUSES.has(check.status)) continue
    const disposition = [...aggregate.dispositions].reverse().find((entry) =>
      entry.findingKey === check.checkId && entry.runId === run.id && entry.inputHash === run.inputManifest.hash)
    if (!disposition || disposition.disposition === 'escalated') {
      blockers.push({ kind: 'unresolved-check', id: check.checkId, message: `规则检查仍待处理：${check.reason || check.ruleId}` })
      continue
    }
    if (disposition.disposition === 'supplement-requested') {
      const related = aggregate.supplements.filter((item) => item.originFindingKeys.includes(check.checkId))
      if (related.length === 0 || related.some((item) => ACTIVE_SUPPLEMENT_STATUSES.has(item.status))) {
        blockers.push({ kind: 'unresolved-check', id: check.checkId, message: `该检查的补件流程尚未完成：${check.reason || check.ruleId}` })
      }
    }
  }

  // 结论引用必须落在本案、当前原件版本。若证据已经人工归属给某事项，
  // 不能悄悄把这份证明拿来支持另一个事项的通过结论。
  const documentsByVersion = new Map(aggregate.caseV2.documents.map(document => [document.versionId, document]))
  const subjectIds = new Set(aggregate.caseV2.subjects.map(subject => subject.id))
  for (const check of run.checks) {
    const targetSubjects = new Set(check.target.subjectIds)
    if (check.target.scope !== 'case' && [...targetSubjects].some(id => !subjectIds.has(id))) {
      blockers.push({ kind: 'unresolved-check', id: check.checkId, message: `检查 ${check.ruleId} 引用了当前案卷之外的申报事项。` })
    }
    const refs = [...check.sourceRefs, ...(check.basis?.sourceRefs ?? [])]
    const seenVersions = new Set<string>()
    for (const ref of refs) {
      const document = documentsByVersion.get(ref.documentVersionId)
      if (ref.caseId !== aggregate.caseV2.id || !document || document.active === false ||
          ref.parseRevision !== document.parseRevision) {
        blockers.push({ kind: 'unresolved-check', id: check.checkId, message: `检查 ${check.ruleId} 的材料引用不属于当前案卷或已过期。` })
        continue
      }
      if (check.target.scope !== 'subject' || document.role !== 'evidence' || seenVersions.has(document.versionId)) continue
      seenVersions.add(document.versionId)
      const confirmedOwners = new Set(aggregate.evidenceLinks.filter(link =>
        link.documentVersionId === document.versionId && link.status === 'confirmed').map(link => link.subjectId))
      if (confirmedOwners.size > 0 && ![...targetSubjects].some(id => confirmedOwners.has(id))) {
        blockers.push({ kind: 'unresolved-check', id: check.checkId,
          message: `检查 ${check.ruleId} 引用了「${document.fileName}」，但证明已归属其他事项；请人工核对并更正关联。` })
      }
    }
  }

  const observations = [...aggregate.observations.map((item) => item as unknown as Record<string, unknown>), ...(input.observations ?? [])]
  const manuallyConfirmed = new Set(observations.filter((item) => item.confirmed === true && item.extractedBy === 'user')
    .map((item) => `${String(item.subjectId ?? '')}::${String(item.fieldKey ?? '')}`))
  const seenFacts = new Set<string>()
  for (const observation of observations) {
    if (observation.confirmed === true || observation.extractedBy === 'user') continue
    const subjectId = String(observation.subjectId ?? '')
    const fieldKey = String(observation.fieldKey ?? '')
    if (!subjectId || !fieldKey || !isDecisionRelevantObservation(run, fieldKey)) continue
    const key = `${subjectId}::${fieldKey}`
    if (manuallyConfirmed.has(key) || seenFacts.has(key)) continue
    seenFacts.add(key)
    blockers.push({ kind: 'unconfirmed-fact', id: key, message: `规则相关事实尚未人工确认：${fieldKey}` })
  }

  for (const link of aggregate.evidenceLinks) {
    if (link.status === 'candidate') blockers.push({ kind: 'candidate-evidence', id: link.id, message: `证明关联待确认：${link.supportsFact}` })
  }

  const runDocumentCoverage = new Map((run.coverage.documents ?? []).map((item) => [item.documentVersionId, item]))
  for (const document of aggregate.caseV2.documents) {
    if (document.active === false) continue
    if (document.unusedReason?.startsWith('[审核员忽略]')) continue
    const runStatus = runDocumentCoverage.get(document.versionId)?.status
    // 人工确认保存在案卷材料上；Agent 的读取证明保存在当前运行上。
    // 两者都能解除材料读取阻断，避免要求 Agent 的读取状态再伪造回写成案卷编辑。
    // 历史解析失败文件可能把空占位块记成 usage=read；失败状态下只有本次完整原件核验记录可解除阻断。
    // 解析失败的原件即使旧 Run 错把空块记作 read，也必须由人实际打开确认。
    // 只有可解析材料才允许由本次 Run 的真实读取记录解除阻断。
    const readConfirmed = !!document.manualReadReceipt ||
      (document.parseStatus !== 'failed' && (document.usage === 'read' || runStatus === 'read'))
    if (!readConfirmed) {
      const reason = runDocumentCoverage.get(document.versionId)?.reason
      blockers.push({ kind: 'unread-material', id: document.versionId, message: `材料尚未完整读取或人工处理：${document.fileName}${reason ? `（${reason}）` : ''}` })
    }
  }

  // Every required slot remains a final-decision gate, including slots that
  // were missing at submission but allowed the initial review to proceed.
  // Applicability, accepted file kinds and min/max counts share the same
  // assessment used to create the Run's material-slot checks.
  for (const slot of template?.materialSlots ?? []) {
    const assessment = assessMaterialSlotV2(aggregate, slot)
    if (assessment.status === 'awaiting-supplement' || assessment.status === 'awaiting-confirmation') {
      blockers.push({
        kind: 'missing-material-slot',
        id: slot.id,
        message: assessment.reason || `材料槽未满足：${slot.name}`,
      })
    }
  }
  if (!template) blockers.push({ kind: 'missing-material-slot', id: 'template', message: '审核模板不存在，无法核对最终决定所需材料。' })

  for (const supplement of aggregate.supplements) {
    if (ACTIVE_SUPPLEMENT_STATUSES.has(supplement.status)) blockers.push({ kind: 'open-supplement', id: supplement.id, message: `补件流程尚未完成：${supplement.reason}` })
  }

  const adjudicated = currentAdjudicatedSubjectIds(aggregate, run)
  for (const subject of aggregate.caseV2.subjects) {
    if (!adjudicated.has(subject.id)) blockers.push({ kind: 'missing-adjudication', id: subject.id, message: `申报事项尚未最终认定：${subject.title}` })
  }

  return { ready: blockers.length === 0, blockers }
}
