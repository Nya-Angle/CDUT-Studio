/**
 * 审核结果面板：展示最近一次真实运行的检查明细、结论和覆盖情况
 */
import { useCallback, useEffect, useState } from 'react'
import type { CaseAggregateV2, ReviewRunV2, SourceRef } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { toast } from 'sonner'

const STATUS_LABEL: Record<string, string> = {
  compliant: '符合', 'non-compliant': '不符合', 'needs-confirmation': '待确认', 'not-applicable': '不适用', 'not-executed': '未执行', 'execution-failed': '执行失败', 'awaiting-confirmation': '待确认', 'awaiting-supplement': '待补件',
}

interface RunPreflight {
  deterministicCount: number
  semanticCount: number
  manualCount: number
  missingRequiredSlots: string[]
  missingDataCheckSlots: string[]
  policyReviewTitles: string[]
}

/** 不把文件名相同的材料视为同一来源：按案卷、原件版本、解析版本三重核对。 */
function describeSource(ref: SourceRef, aggregate: CaseAggregateV2 | null, caseId: string): { label: string; valid: boolean } {
  if (ref.caseId !== caseId) return { label: `跨案卷引用 ${ref.documentVersionId}（不可采信）`, valid: false }
  const document = aggregate?.caseV2.documents.find(item => item.versionId === ref.documentVersionId)
  if (!document) return { label: `原件 ${ref.documentVersionId} 不在当前案卷（不可采信）`, valid: false }
  if (document.active === false || document.parseRevision !== ref.parseRevision) {
    return { label: `${document.fileName} · 旧原件或旧解析版本（不可采信）`, valid: false }
  }
  const location = ref.location
  const where = location.kind === 'pdf-rect' ? `第 ${location.page} 页` :
    location.kind === 'sheet-cell' ? `${location.sheet} 工作表第 ${location.row} 行 ${location.column} 列` :
    location.kind === 'paragraph' ? `第 ${location.index} 段` :
    location.kind === 'text-range' ? `字符 ${location.start}–${location.end}` : '文件级（需按原件核对）'
  return { label: `${document.fileName} · ${where}`, valid: true }
}

export function RunResultPanel({ caseId, refreshNonce }: { caseId: string; refreshNonce: number }): JSX.Element {
  const [runs, setRuns] = useState<ReviewRunV2[]>([])
  const [caseAggregate, setCaseAggregate] = useState<CaseAggregateV2 | null>(null)
  const [ruleLabels, setRuleLabels] = useState<Record<string, string>>({})
  const [preflight, setPreflight] = useState<RunPreflight | null>(null)
  const [expandedRun, setExpandedRun] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const load = useCallback(async (): Promise<void> => {
    try {
      const [list, aggregate] = await Promise.all([window.reviewAPI.listRunsV2(caseId), window.reviewAPI.getAggregateV2(caseId)])
      setRuns(list ?? [])
      setCaseAggregate(aggregate ?? null)
      if (aggregate) {
        const template = await window.reviewAPI.getTemplateV2(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
        const labels: Record<string, string> = {}
        const criteria = (template?.sections ?? []).flatMap((section) => section.criteria ?? [])
        for (const section of template?.sections ?? []) {
          for (const criterion of section.criteria ?? []) labels[`section-${section.id}-${criterion.id}`] = `${section.name} · ${criterion.title}`
        }
        setRuleLabels(labels)
        const activeDocuments = aggregate.caseV2.documents.filter((document) => document.active !== false)
        const missingRequiredSlots = (template?.materialSlots ?? []).filter((slot) => slot.requiredAt !== 'decision' && slot.minCount > 0 && activeDocuments.filter((document) => document.materialSlotId === slot.id).length < slot.minCount).map((slot) => slot.name)
        const dataChecks = criteria.flatMap((criterion) => criterion.execution === 'deterministic' && criterion.dataCheck ? [criterion.dataCheck] : [])
        const missingDataCheckSlots = [...new Set(dataChecks.filter((check) => !activeDocuments.some((document) => document.materialSlotId === check.materialSlotId && document.blocks.some((block) => block.location?.kind === 'sheet-cell'))).map((check) => (template?.materialSlots ?? []).find((slot) => slot.id === check.materialSlotId)?.name ?? check.materialSlotId))]
        const hasConfirmedPolicy = (template?.policyRefs?.length ?? 0) > 0 || (template?.policyVersionIds.length ?? 0) > 0
        const policyReviewTitles = !hasConfirmedPolicy
          ? criteria.filter((criterion) => criterion.execution === 'manual' && /政策|制度|额度|限额|标准|资格|可报/.test(criterion.title + criterion.requirement)).map((criterion) => criterion.title)
          : []
        setPreflight({
          deterministicCount: criteria.filter((criterion) => criterion.execution === 'deterministic').length,
          semanticCount: criteria.filter((criterion) => criterion.execution === 'semantic').length,
          manualCount: criteria.filter((criterion) => criterion.execution === 'manual').length,
          missingRequiredSlots,
          missingDataCheckSlots,
          policyReviewTitles,
        })
      }
      if (list && list.length > 0) setExpandedRun(list[0]!.id)
    } catch (error) {
      console.error('[审核] 运行列表加载失败', error)
    }
  }, [caseId])

  useEffect(() => { void load() }, [load, refreshNonce])

  /** 触发真实审核运行（RUN_REVIEW_V2 四层：真实渠道 + 真实执行器） */
  /** 导出报告：真实调用 EXPORT_REPORT_V2（公开反馈投影 + 检查结果落盘 MD） */
  const exportReport = useCallback(async (): Promise<void> => {
    try {
      const result = await window.reviewAPI.exportReportV2(caseId)
      toast.success(`报告已导出：${result.file}`)
    } catch (error) {
      toast.error(`导出失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }, [caseId])

  const startRun = useCallback(async (): Promise<void> => {
    setRunning(true)
    try {
      const run = await window.reviewAPI.runReviewV2(caseId)
      toast.success(`审核运行完成：${run.id}（检查 ${(run.checks ?? []).length} 项）`)
      await load()
    } catch (error) {
      toast.error(`审核运行失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setRunning(false)
    }
  }, [caseId, load])

  return (
    <div className="space-y-1.5 rounded-lg border-t pt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">审核结果（{runs.length} 次）</p>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" disabled={running} onClick={() => void startRun()}>{running ? '审核中…' : '开始审核'}</Button>
          <Button size="sm" variant="ghost" disabled={runs.length === 0} onClick={() => void exportReport()}>导出报告</Button>
          <Button size="sm" variant="ghost" onClick={() => void load()}>刷新</Button>
        </div>
      </div>
      {preflight && (
        <div className="space-y-0.5 rounded-md bg-muted/40 px-2 py-1.5 text-xs text-muted-foreground">
          <p>本模板分工：程序核对 {preflight.deterministicCount} 项 · Agent 核对 {preflight.semanticCount} 项 · 人工确认 {preflight.manualCount} 项。</p>
          {preflight.missingRequiredSlots.length > 0 && <p>尚缺必需材料：{preflight.missingRequiredSlots.join('、')}。上传后再开始，避免把缺件误作通过。</p>}
          {preflight.missingDataCheckSlots.length > 0 && <p>表格计算尚未就绪：{preflight.missingDataCheckSlots.join('、')}。缺少工作簿时对应计算会显示待补件。</p>}
          {preflight.policyReviewTitles.length > 0 && <p>模板没有关联正式政策；{preflight.policyReviewTitles.join('、')}会留给人工判断，不自动决定额度或资格。</p>}
        </div>
      )}
      {runs.length === 0 && <p className="text-xs text-muted-foreground">尚未开始审核。点击“开始自动审核”后，系统会读取当前材料和审核依据。</p>}
      {runs.slice(0, 3).map((run) => (
        <div key={run.id} className="rounded-md border p-2 text-xs">
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}>
            <span className="font-medium">{run.id.slice(-12)} · {run.status}{run.completedAt ? ` · ${new Date(run.completedAt).toLocaleTimeString()}` : ''}</span>
            <span className="text-muted-foreground">检查 {run.checks.length} · 覆盖 {run.coverage.completedChecks}/{run.coverage.plannedChecks}</span>
          </button>
          {expandedRun === run.id && (
            <div className="mt-1.5 space-y-1">
              {run.checks.length === 0 && <p className="text-muted-foreground">本次运行未产生检查结果（核对规则来源与模型返回）</p>}
              {run.checks.map((check, index) => {
                  const item = check as { ruleId: string; status: string; reason: string }
                  const refs = [...new Map([...check.sourceRefs, ...(check.basis?.sourceRefs ?? [])]
                    .map(ref => [JSON.stringify(ref), ref])).values()]
                  const sources = refs.map(ref => {
                    const described = describeSource(ref, caseAggregate, caseId)
                    const document = caseAggregate?.caseV2.documents.find(entry => entry.versionId === ref.documentVersionId)
                    if (!described.valid || check.target.scope !== 'subject' || document?.role !== 'evidence') return described
                    const owners = new Set(caseAggregate?.evidenceLinks.filter(link =>
                      link.documentVersionId === ref.documentVersionId && link.status === 'confirmed').map(link => link.subjectId) ?? [])
                    return owners.size > 0 && !check.target.subjectIds.some(id => owners.has(id))
                      ? { label: `${described.label} · 证明已归属其他事项（不可直接采信）`, valid: false }
                      : described
                  })
                  const subjectIds = new Set(caseAggregate?.caseV2.subjects.map(subject => subject.id) ?? [])
                  const unknownSubjects = check.target.scope === 'case' ? [] : check.target.subjectIds.filter(id => !subjectIds.has(id))
                  const invalid = sources.some(source => !source.valid) || unknownSubjects.length > 0
                  return (
                  <div key={check.checkId || index} className="space-y-1 rounded bg-muted/40 px-1.5 py-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="min-w-0"><span className="font-medium">{ruleLabels[item.ruleId] ?? item.ruleId}</span><span className="text-muted-foreground">：{item.reason}</span></span>
                      <span className={invalid ? 'text-amber-700' : item.status === 'compliant' ? 'text-emerald-600' : item.status === 'non-compliant' ? 'text-red-600' : 'text-amber-600'}>
                        {invalid ? '来源归属异常' : STATUS_LABEL[item.status] ?? item.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground">核对对象：{check.target.scope === 'case' ? '当前案卷' : check.target.subjectIds.map(id => caseAggregate?.caseV2.subjects.find(subject => subject.id === id)?.title ?? `未知事项 ${id}`).join('、') || '未标明对象'}</p>
                    {invalid && <p className="text-amber-700">检查引用的原件或事项与当前案卷不一致，该结论不得直接作为可靠通过依据。</p>}
                    <details><summary className="cursor-pointer text-muted-foreground">核对证据来源（{sources.length}）</summary>
                      {sources.length === 0 ? <p>本项没有文件级出处；请结合规则输入、事实及计算明细核验。</p> :
                        <ul className="list-disc pl-4">{sources.map((source, sourceIndex) => <li key={sourceIndex} className={source.valid ? '' : 'text-amber-700'}>{source.label}</li>)}</ul>}
                    </details>
                  </div>
                )
              })}
              {run.opinions.length > 0 && <p className="rounded bg-muted/40 px-1.5 py-1">结论：{(run.opinions[0] as unknown as { text?: string }).text ?? '—'}</p>}
              {run.agentActivity && run.agentActivity.length > 0 && (
                <details className="text-muted-foreground">
                  <summary>Agent 材料能力调用（{run.agentActivity.length}）</summary>
                  <ol className="list-decimal pl-4">{run.agentActivity.map((activity, index) => <li key={`${index}-${activity}`}>{activity}</li>)}</ol>
                </details>
              )}
              {run.modelUsage && run.modelUsage.length > 0 && (
                <p className="text-muted-foreground">按需图像核验：{run.modelUsage.length} 次模型调用 · {run.modelUsage.reduce((sum, item) => sum + (item.tokens ?? 0), 0).toLocaleString()} tokens。</p>
              )}
              {run.diagnostics.length > 0 && (
                <details className="text-muted-foreground">
                  <summary>诊断（{run.diagnostics.length}）</summary>
                  <ul className="list-disc pl-4">{run.diagnostics.map((line, index) => <li key={index}>{line}</li>)}</ul>
                </details>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
