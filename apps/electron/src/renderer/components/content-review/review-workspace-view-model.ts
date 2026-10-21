import { assessDecisionReadiness, isDecisionRelevantObservation } from '@profer/shared'
import type { CaseAggregateV2, ReviewRunV2, SourceRef, TemplateVersion } from '@profer/shared'
import type { DecisionReadiness } from '@profer/shared'

export interface ReviewWorkspacePendingAction {
  key: string
  kind: 'check' | 'fact' | 'evidence' | 'material' | 'material-slot' | 'supplement' | 'adjudication'
  title: string
  detail: string
  checkId?: string
  subjectId?: string
  sourceDocumentVersionIds?: string[]
  materialSlotId?: string
  sourceRefs?: SourceRef[]
  presentationGroup?: 'verify' | 'resolve' | 'adjudicate'
}

export interface ReviewWorkspaceViewModel {
  caseId: string
  title: string
  status: 'draft' | 'ready' | 'reviewing' | 'needs-attention' | 'waiting-supplement' | 'ready-for-decision' | 'decided'
  pendingActions: ReviewWorkspacePendingAction[]
  resolvedActions: ReviewWorkspacePendingAction[]
  closedActions: ReviewWorkspacePendingAction[]
  canDecide: boolean
  canReject: boolean
  decisionReadiness: DecisionReadiness
}

const actionableCheckStatuses = new Set(['non-compliant', 'awaiting-supplement', 'awaiting-confirmation', 'not-executed', 'execution-failed'])
const activeSupplementStatuses = new Set(['open', 'responded', 'insufficient'])

function fieldLabel(fieldKey: string, template?: TemplateVersion | null): string {
  const configured = template?.fields.find((field) => field.key === fieldKey)?.label
  if (configured) return configured
  return ({ level: '获奖等级', declaredScore: '申报分值', score: '申报分值', activityDate: '活动日期', organizer: '主办单位', category: '事项类别', title: '事项名称' } as Record<string, string>)[fieldKey] ?? '补充信息'
}

export function buildReviewWorkspaceViewModel(
  aggregate: CaseAggregateV2,
  run: ReviewRunV2 | null,
  runStale: boolean,
  extractedObservations: Array<Record<string, unknown>> = [],
  template?: TemplateVersion | null,
): ReviewWorkspaceViewModel {
  const pendingActions: ReviewWorkspacePendingAction[] = []
  const resolvedActions: ReviewWorkspacePendingAction[] = []
  const closedActions: ReviewWorkspacePendingAction[] = []
  const inputHash = run?.inputManifest.hash

  if (run) {
    if (run.coverage.plannedChecks === 0) {
      pendingActions.push({ key: 'coverage:no-checks', kind: 'check', title: '没有生成有效的规则检查', detail: '当前模板/审核依据没有生成可执行检查；本次只是 Agent 的材料分析，不能视为按规则完成审核。请补全模板规则和申报事项后重新审核。' })
    }
    for (const check of run.checks) {
      if (!actionableCheckStatuses.has(check.status)) continue
      const disposition = [...aggregate.dispositions].reverse().find((entry) =>
        entry.findingKey === check.checkId && entry.runId === run.id && entry.inputHash === inputHash)
      const matchingSupplement = aggregate.supplements.find((supplement) => supplement.originFindingKeys.includes(check.checkId))
      const supplementPending = disposition?.disposition === 'supplement-requested'
        && (!matchingSupplement || activeSupplementStatuses.has(matchingSupplement.status))
      const item: ReviewWorkspacePendingAction = {
        key: `check:${check.checkId}`,
        kind: supplementPending ? 'supplement' : 'check',
        title: check.reason || check.ruleId,
        detail: check.status === 'awaiting-supplement' ? '缺少必要证明材料，请补充后继续。'
          : check.status === 'awaiting-confirmation' ? 'AI 尚不能判断符合或不符合。请对照规则查看来源，核实后记录该项结论；这不会自动通过或驳回整案。'
            : check.status === 'execution-failed' || check.status === 'not-executed' ? '本项尚未完成核对，请重试审核。'
              : '请对照审核依据确认问题是否成立，再记录单项处理；这不会自动通过或驳回整案。',
        checkId: check.checkId,
        subjectId: check.target.subjectIds[0],
        sourceDocumentVersionIds: check.sourceRefs.map((ref) => ref.documentVersionId),
        sourceRefs: check.sourceRefs,
      }
      if (disposition && !supplementPending) resolvedActions.push(item)
      else pendingActions.push(item)
    }

    for (const raw of extractedObservations) {
      if (raw.confirmed === true || raw.extractedBy === 'user') continue
      const confidence = typeof raw.confidence === 'number' && Number.isFinite(raw.confidence)
        ? `识别置信度 ${Math.round(raw.confidence * 100)}%`
        : '尚未人工核对；本次提取未提供置信度'
      const refs = Array.isArray(raw.sourceRefs) ? raw.sourceRefs : []
      const subjectId = typeof raw.subjectId === 'string' ? raw.subjectId : ''
      const fieldKey = typeof raw.fieldKey === 'string' ? raw.fieldKey : '事实'
      if (!isDecisionRelevantObservation(run, fieldKey)) continue
      if (aggregate.observations.some((observation) => observation.subjectId === subjectId && observation.fieldKey === fieldKey && observation.extractedBy === 'user' && observation.confirmed)) continue
      const value = raw.value && typeof raw.value === 'object' && 'value' in raw.value
        ? String((raw.value as { value: unknown }).value)
        : String(raw.value ?? '未识别')
      pendingActions.push({
        key: `fact:${subjectId}:${fieldKey}`,
        kind: 'fact',
        title: `待核实：${fieldLabel(fieldKey, template)} ${value}`,
        detail: confidence,
        subjectId,
        sourceDocumentVersionIds: refs.flatMap((ref) => ref && typeof ref === 'object' && 'documentVersionId' in ref ? [String((ref as { documentVersionId: unknown }).documentVersionId)] : []),
        sourceRefs: refs.filter((ref): ref is SourceRef => !!ref && typeof ref === 'object' && 'documentVersionId' in ref && 'location' in ref) as SourceRef[],
      })
    }
  }

  for (const link of aggregate.evidenceLinks) {
    const subject = aggregate.caseV2.subjects.find((item) => item.id === link.subjectId)
    const document = aggregate.caseV2.documents.find((item) => item.versionId === link.documentVersionId)
    const item = {
      key: `evidence:${link.id}`,
      kind: 'evidence' as const,
      title: `确认证明关联：${document?.fileName ?? link.documentVersionId}`,
      detail: `${subject?.title ?? link.subjectId} · ${link.supportsFact}`,
      subjectId: link.subjectId,
      sourceDocumentVersionIds: [link.documentVersionId],
      sourceRefs: link.blockRef ? [link.blockRef] : [{ caseId: aggregate.caseV2.id, documentVersionId: link.documentVersionId, parseRevision: 0, location: { kind: 'file' as const } }],
    }
    if (link.status === 'candidate') pendingActions.push(item)
    else if (link.status === 'confirmed') resolvedActions.push(item)
  }

  const runDocumentCoverage = new Map((run?.coverage.documents ?? []).map((item) => [item.documentVersionId, item]))
  for (const document of aggregate.caseV2.documents.filter((item) => item.active !== false)) {
    if (document.unusedReason?.startsWith('[审核员忽略]')) continue
    if (document.manualReadReceipt) {
      resolvedActions.push({
        key: `material:${document.versionId}`,
        kind: 'material',
        title: `已人工核对：${document.fileName}`,
        detail: document.manualReadReceipt.reason,
        sourceDocumentVersionIds: [document.versionId],
      })
      continue
    }
    // Pi 的读取记录属于一次运行，并不会回写到案卷原始材料元数据。
    // 当前运行覆盖账本优先；新上传、尚未进入本次运行的材料再回退到案卷状态。
    const tracked = runDocumentCoverage.get(document.versionId)
    const status = document.parseStatus === 'failed'
      ? tracked?.status ?? 'unread'
      : document.usage === 'read' ? 'read' : tracked?.status ?? document.usage
    if (status === 'read') continue
    const title = !run
      ? `待审核材料：${document.fileName}`
      : status === 'partially-read'
        ? `本次审核仅部分读取：${document.fileName}`
        : `本次审核未记录完整读取：${document.fileName}`
    pendingActions.push({
      key: `material:${document.versionId}`,
      kind: 'material',
      title,
        detail: document.parseStatus === 'failed'
          ? tracked?.status === 'partially-read'
            ? '自动解析失败。请打开原件逐页检查后确认已核对；若材料与本案无关，可记录忽略。这是读取状态，不代表材料不合格。'
            : `自动解析失败；空占位内容不能证明读过原件。请打开原件核验，或记录忽略。${document.parseError ? `原因：${document.parseError}` : ''}`
          : document.parseStatus === 'partial' && document.blocks.length === 0
            ? '旧版导入未提取出可用文本。请打开原件逐页检查后确认已核对；若与本案无关，可记录忽略。这不代表材料不合格。'
            : tracked?.status === 'partially-read'
              ? `本次只记录了部分内容：${tracked.reason ?? '尚未完整读取'}。请查看剩余内容，或说明为何忽略。`
              : '当前运行没有完整读取凭据。请查看材料后确认已核对；若与本案无关，可记录忽略。这不代表材料不合格。',
      sourceDocumentVersionIds: [document.versionId],
      sourceRefs: [{ caseId: aggregate.caseV2.id, documentVersionId: document.versionId, parseRevision: document.parseRevision, location: { kind: 'file' } }],
    })
  }
  for (const document of aggregate.caseV2.documents.filter((item) => item.unusedReason?.startsWith('[审核员忽略]'))) {
    resolvedActions.push({ key: `material:${document.versionId}`, kind: 'material', title: `已人工忽略：${document.fileName}`, detail: document.unusedReason ?? '审核员已记录忽略理由', sourceDocumentVersionIds: [document.versionId] })
  }

  for (const slot of template?.materialSlots ?? []) {
    if ((slot.requiredAt ?? 'submission') !== 'decision') continue
    const count = aggregate.caseV2.documents.filter((document) => document.active !== false && document.materialSlotId === slot.id).length
    if (count >= slot.minCount) continue
    pendingActions.push({
      key: `material-slot:${slot.id}`,
      kind: 'material-slot',
      title: `缺少证明材料：${slot.name}`,
      detail: `最终决定前需要至少 ${slot.minCount} 份，当前 ${count} 份。`,
      materialSlotId: slot.id,
    })
  }

  for (const supplement of aggregate.supplements) {
    if (!activeSupplementStatuses.has(supplement.status)) continue
    pendingActions.push({
      key: `supplement:${supplement.id}`,
      kind: 'supplement',
      title: `待处理补件：${supplement.reason}`,
      detail: `${supplement.status === 'responded' ? '已收到补充材料，等待核验' : supplement.status === 'insufficient' ? '补充材料仍未满足要求' : '等待补充材料'} · 缺少：${supplement.requiredElements.join('、')}`,
    })
  }

  const adjudications = aggregate.adjudications ?? []
  const supersededAdjudications = new Set(adjudications.flatMap((record) => record.supersedesAdjudicationId ? [record.supersedesAdjudicationId] : []))
  const adjudicatedSubjects = new Map(adjudications.filter((record) => !supersededAdjudications.has(record.id) && record.basedOnRunId === run?.id && record.inputHash === run?.inputManifest.hash).map((record) => [record.subjectId, record]))
  for (const subject of aggregate.caseV2.subjects) {
    const adjudication = adjudicatedSubjects.get(subject.id)
    const item: ReviewWorkspacePendingAction = adjudication
      ? { key: `adjudication:${subject.id}`, kind: 'adjudication', subjectId: subject.id, title: `已完成认定：${subject.title}`, detail: `${adjudication.outcome === 'accepted' ? '认可' : adjudication.outcome === 'modified' ? '调整认定' : '不予认定'} · ${adjudication.reason}` }
      : { key: `adjudication:${subject.id}`, kind: 'adjudication', subjectId: subject.id, title: `待最终认定：${subject.title}`, detail: '请在中栏事项卡确认、修改等级/分值，或作不予认定。' }
    if (adjudication) resolvedActions.push(item)
    else pendingActions.push(item)
  }

  const currentFinalDecision = [...aggregate.decisions].reverse().find((decision) =>
    decision.finality === 'final' && decision.scope.kind === 'case' && decision.basedOnRunId === run?.id)
  if (aggregate.caseV2.stage === 'decided' && currentFinalDecision?.result === 'reject') {
    closedActions.push(...pendingActions.splice(0).map((item) => ({
      ...item,
      detail: `已随整案驳回结案；这不表示该条 AI 发现或材料已被逐项确认。整案驳回理由：${currentFinalDecision.reason}`,
    })))
  }

  const hasUsableRun = !!run && ['completed', 'partially-completed'].includes(run.status)
  const readiness = assessDecisionReadiness({ aggregate, run, runStale, template, observations: extractedObservations })
  const canDecide = hasUsableRun && readiness.ready && aggregate.caseV2.stage !== 'decided' && aggregate.caseV2.stage !== 'archived'
  // A reviewer may reject a current completed run because a confirmed blocker or
  // missing material can itself justify rejection. Passing still requires readiness.
  const canReject = hasUsableRun && !runStale && aggregate.caseV2.stage !== 'decided' && aggregate.caseV2.stage !== 'archived'
  const status: ReviewWorkspaceViewModel['status'] = aggregate.caseV2.stage === 'decided'
    ? 'decided'
    : aggregate.caseV2.stage === 'awaiting-supplement'
      ? 'waiting-supplement'
      : runStale
        ? 'ready'
        : !run
          ? aggregate.caseV2.documents.length > 0 ? 'ready' : 'draft'
          : pendingActions.length > 0 || !hasUsableRun
            ? 'needs-attention'
            : 'ready-for-decision'

  const priority = (item: ReviewWorkspacePendingAction): number => {
    const check = item.checkId ? run?.checks.find((candidate) => candidate.checkId === item.checkId) : undefined
    if (check && ['awaiting-confirmation', 'not-executed', 'execution-failed'].includes(check.status)) return 0
    if (item.kind === 'material' || item.kind === 'material-slot' || item.kind === 'supplement') return 1
    if (check?.status === 'non-compliant' || check?.status === 'awaiting-supplement') return 2
    if (item.kind === 'fact' || item.kind === 'evidence') return 3
    if (item.kind === 'adjudication') return 4
    return 5
  }
  for (const item of pendingActions) {
    item.presentationGroup = item.kind === 'adjudication' ? 'adjudicate'
      : item.kind === 'check' && item.checkId && run?.checks.some((check) => check.checkId === item.checkId && ['non-compliant', 'awaiting-supplement'].includes(check.status)) || item.kind === 'material-slot' || item.kind === 'supplement'
        ? 'resolve' : 'verify'
  }
  pendingActions.sort((left, right) => priority(left) - priority(right))
  return { caseId: aggregate.caseV2.id, title: aggregate.caseV2.title, status, pendingActions, resolvedActions, closedActions, canDecide, canReject, decisionReadiness: readiness }
}
