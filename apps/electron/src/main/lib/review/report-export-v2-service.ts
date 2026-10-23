/**
 * V2 报告导出服务（08 设计 §4：从 EXPORT_REPORT_V2 handler 抽出，IPC 与 Agent 工具薄委托）
 *
 * 公开反馈投影（字段可见性按模板默认 public）+ 真实检查结果摘要 → MD 落盘
 * 到案卷受控目录 reports/（不覆盖任意宿主路径）。
 */

import { assertSafeReviewStorageId } from './review-storage-id'
import type { ReportActor, ReportAudience, ReportCaseCycle, ReportRunSelection } from './review-v3-report-snapshot'

export interface ExportReportResultV2 {
  file: string
  decision: { result: string; reason: string; at: string } | null
  /** 本次导出绑定的运行与快照来源（RUN-02/21/31/32） */
  run: { id: string; basis: ReportRunSelection['basis']; historical: boolean } | null
  audience: { requested: ReportAudience; granted: ReportAudience; authorized: boolean; reason: string }
  /** 报告正文快照指纹：历史重导可核对是否同一份内容 */
  snapshotDigest: string
  archiveCycle: ReportCaseCycle
}

export interface ExportReportOptionsV2 {
  /** 显式选择历史 Run；缺省按最终决定绑定 Run，再退到最新 Run */
  runId?: string
  /** 请求的受众；Main 依据可信 actor 决定是否授予，未授权降级为学生版 */
  audience?: ReportAudience
  actor?: ReportActor | null
}

export function exportCaseReport(caseId: string, options: ExportReportOptionsV2 = {}): ExportReportResultV2 {
  assertSafeReviewStorageId(caseId, 'caseId')
  const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
  const { buildCaseFeedback } = require('./report-service-v2') as typeof import('./report-service-v2')
  const { listRunsV2 } = require('./run-store-v2') as typeof import('./run-store-v2')
  const { reconcilePiReviewRunsWithReadReceipts } = require('./pi-case-review-service') as typeof import('./pi-case-review-service')
  const { getTemplate } = require('./template-store') as typeof import('./template-store')
  const { resolveEffectiveRules } = require('./effective-rules') as typeof import('./effective-rules')
  const snapshot = require('./review-v3-report-snapshot') as typeof import('./review-v3-report-snapshot')
  const aggregate = getCaseV2Aggregate(caseId)
  if (!aggregate) throw new Error(`案卷聚合不存在: ${caseId}`)
  const feedback = buildCaseFeedback(aggregate.caseV2, aggregate.decisions, aggregate.supplements, {})
  // Export what actually happened, including unfinished or interrupted local
  // Pi work. No completed-only filter that silently hides the current run.
  const runs = reconcilePiReviewRunsWithReadReceipts(caseId, listRunsV2(caseId))
  const selection = snapshot.resolveReportRun({ runs, decisions: aggregate.decisions, requestedRunId: options.runId })
  const lastRun = selection.run
  if (!lastRun) throw new Error(`报告没有可用的审核运行：${selection.reason}`)
  const finalDecision = aggregate.decisions.find((decision) => decision.basedOnRunId === lastRun.id) ?? null
  const audienceGrant = snapshot.resolveReportAudience({ requested: options.audience ?? 'student', actor: options.actor })
  const internal = audienceGrant.audience !== 'student'
  const cycle = snapshot.resolveReportCaseCycle(aggregate)
  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
  const effectiveRules = template ? resolveEffectiveRules(aggregate, template) : []
  const lines: string[] = [`# 审核报告：${aggregate.caseV2.title}`, '', `- 案卷：${caseId}`, `- 阶段：${aggregate.caseV2.stage}（revision ${aggregate.caseV2.revision}）`, `- 报告受众：${audienceGrant.audience}（${audienceGrant.granted ? '已授权' : '未授权，已降级'}；${audienceGrant.reason}）`, `- 运行选择：${selection.basis}（${selection.reason}）`, `- 归档代次：${cycle.archiveCycle}${cycle.restoredAt ? `；最近恢复于 ${cycle.restoredAt}，恢复前的决定仅作历史展示` : ''}`, '']
  if (feedback.decision) lines.push(`## 决定`, `- 结果：${feedback.decision.result}`, `- 理由：${feedback.decision.reason}`, `- 时间：${feedback.decision.at}`, `- 归属：${finalDecision ? `基于运行 ${lastRun.id}` : '该决定不基于所选运行，仅作案卷历史展示'}`, '')
  if (lastRun) {
    lines.push(`## 审核依据（运行 ${lastRun.id}）`)
    lines.push(`- 技术运行状态：${lastRun.status}（尚未完成不等于审核通过）`)
    lines.push(`- 当前输入哈希：${lastRun.inputManifest.hash}`)
    lines.push(`- 检查覆盖：计划 ${lastRun.coverage.plannedChecks}、已完成 ${lastRun.coverage.completedChecks}、有效判断 ${lastRun.coverage.effectiveVerdicts}、待处理 ${lastRun.coverage.pendingChecks}`)
    // RUN-42：completed 只代表技术轮结束；报告必须显式区分“业务未就绪”。
    const unreadDocuments = lastRun.coverage.documents.filter((entry) => entry.status !== 'read').length
    if (lastRun.status === 'completed' && (lastRun.coverage.pendingChecks > 0 || unreadDocuments > 0)) {
      lines.push(`- 业务可办理性：技术轮已完成，但仍有 ${lastRun.coverage.pendingChecks} 项待处理检查、${unreadDocuments} 份未读材料；completed 不代表完整业务通过`)
    }
    lines.push(`- 模型意见：${lastRun.opinions.length} 条`)
    lines.push(`- 有效规则集哈希：${lastRun.inputManifest.effectiveRuleSetHash ?? '旧运行未记录'}`)
    if(lastRun.error)lines.push(`- 运行错误：${lastRun.error}`)
    if(aggregate.d2RuntimePlan?.fingerprint)
      lines.push(`- 本地 D4/D2 技术计划：${aggregate.d2RuntimePlan.templateId}@${aggregate.d2RuntimePlan.templateVersion} / ${aggregate.d2RuntimePlan.fingerprint}（非校方发布）`)
    if(lastRun.coverage.documents.length){
      lines.push('', '### 实际材料覆盖')
      for(const doc of lastRun.coverage.documents)
        lines.push(`- ${doc.documentVersionId}：${doc.status}${doc.reason?'；'+doc.reason:''}`)
    }
    for (const { rule, origin } of effectiveRules) {
      const sectionName = rule.sectionId ? template?.sections?.find((section) => section.id === rule.sectionId)?.name : undefined
      const source = origin.kind === 'policy' ? `政策 ${origin.policyId}@${origin.version}` : origin.kind === 'template' ? `模板 ${origin.templateId}@${origin.version}` : '案卷规则'
      lines.push(`- ${sectionName ? `【${sectionName}】` : ''}${rule.title}（${rule.id}；${rule.execution}；${source}）`)
    }
    lines.push('', `## 检查结果（运行 ${lastRun.id}）`)
    for (const check of lastRun.checks) {
      lines.push(`- ${check.checkId}（规则 ${check.ruleId}）【${check.status}】：${check.reason || '未注明原因'}；执行来源 ${check.executedBy}`)
      for(const ref of check.sourceRefs)
        lines.push(`  - 原件 ${ref.documentVersionId}（解析修订 ${ref.parseRevision}）：${JSON.stringify(ref.location)}`)
      if(check.calculation?.detailLines?.length)
        for(const line of check.calculation.detailLines)lines.push('  - 计算：'+line)
    }
    if(internal && lastRun.opinions.length){
      lines.push('', '### 模型建议（必须人工复核，非最终认定）')
      for(const item of lastRun.opinions){
        lines.push(`- ${item.title}（${item.kind}/${item.verification}）：${item.detail}`)
        if(item.suggestionText)lines.push('  - 建议：'+item.suggestionText)
        for(const ref of item.sourceRefs)
          lines.push(`  - 原件 ${ref.documentVersionId}（解析修订 ${ref.parseRevision}）：${JSON.stringify(ref.location)}`)
      }
    }
    if(lastRun.coverage.pendingChecks>0)
      lines.push('', `**尚有 ${lastRun.coverage.pendingChecks} 项检查待处理，不能作为完整结论使用。**`)
    lines.push('')
    const waived = internal ? aggregate.dispositions.filter((entry) => entry.runId === lastRun.id && entry.inputHash === lastRun.inputManifest.hash && entry.disposition === 'waived') : []
    if (waived.length) {
      lines.push('## 人工豁免（不代表规则符合）')
      for (const entry of waived) lines.push(`- ${entry.findingKey}：人工豁免；${entry.reason}`)
      lines.push('')
    }
  }
  if (feedback.supplements.length > 0) {
    lines.push('## 补件')
    for (const supplement of feedback.supplements) lines.push(`- ${supplement.reason}（${supplement.status}，要素：${supplement.requiredElements.join('、') || '—'}）`)
    lines.push('')
  }
  lines.push('## 事项字段')
  for (const item of feedback.items) lines.push(`- ${item.title}：${JSON.stringify(item.publicFields)}`)
  const adjudicationScope = snapshot.resolveReportAdjudications({
    adjudications: aggregate.adjudications ?? [],
    runId: lastRun.id,
    inputHash: lastRun.inputManifest.hash,
  })
  const currentAdjudications = adjudicationScope.current
  if (currentAdjudications.length) {
    lines.push('', '## 事项最终认定')
    for (const subject of aggregate.caseV2.subjects) {
      const adjudication = currentAdjudications.find((record) => record.subjectId === subject.id)
      if (!adjudication) continue
      const outcome = adjudication.outcome === 'accepted' ? '认可' : adjudication.outcome === 'modified' ? '修改认定' : '不予认定'
      const finalFields = adjudication.finalFields ?? (adjudication.outcome === 'rejected' ? {} : subject.fields)
      const scoreField = finalFields.declaredScore ?? finalFields.score
      const score = adjudication.outcome === 'rejected' ? '0' : scoreField?.kind === 'number' ? String(scoreField.value) : '未记录'
      lines.push(`- ${subject.title}：${outcome}；最终分值 ${score}；认定内容 ${JSON.stringify(finalFields)}；理由：${adjudication.reason}`)
    }
  }
  if (internal && adjudicationScope.supersededInRun + adjudicationScope.excludedOtherRun > 0) {
    lines.push('', `> 裁定作用域：本 Run 内被后续裁定替代 ${adjudicationScope.supersededInRun} 条；另有 ${adjudicationScope.excludedOtherRun} 条属于其他 Run，未纳入本报告。`)
  }
  if (finalDecision?.finalScores?.length) {
    lines.push('', '## 最终分数')
    for (const score of finalDecision.finalScores) {
      const subject = aggregate.caseV2.subjects.find((candidate) => candidate.id === score.subjectId)
      lines.push(`- ${subject?.title ?? score.subjectId}：${score.value}`)
    }
  }
  const { writeFileSync, mkdirSync } = require('node:fs') as typeof import('node:fs')
  const { join } = require('node:path') as typeof import('node:path')
  const { getConfigDir } = require('../config-paths') as typeof import('../config-paths')
  const dir = join(getConfigDir(), 'review-cases', caseId, 'reports')
  mkdirSync(dir, { recursive: true })
  const markdown = lines.join('\n')
  const digest = snapshot.reportSnapshotDigest({ caseId, runId: lastRun.id, audience: audienceGrant.audience, json: markdown })
  lines.push('', `<!-- report-snapshot: ${digest} -->`)
  const file = join(dir, `report-${Date.now().toString(36)}.md`)
  writeFileSync(file, lines.join('\n'), 'utf-8')
  return {
    file,
    decision: feedback.decision,
    run: { id: lastRun.id, basis: selection.basis, historical: selection.historical },
    audience: { requested: audienceGrant.requested, granted: audienceGrant.audience, authorized: audienceGrant.granted, reason: audienceGrant.reason },
    snapshotDigest: digest,
    archiveCycle: cycle,
  }
}
