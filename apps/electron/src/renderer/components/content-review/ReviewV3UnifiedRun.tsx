/**
 * 普通用户的单案审核入口：规则与 Pi 共用同一案卷、材料版本和 Main 账本。
 * 两种运行目前仍各自保存 Run；这里只编排已有 Main 操作，不伪造合并结果。
 */
import * as React from 'react'
import type { ReviewBackgroundPiRunState, ReviewRunV2 } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'

interface RuleReceipt {
  runId: string
  status: 'completed' | 'partially-completed'
  checks: Array<{ status: string }>
}

interface Props {
  caseId: string
  stage: string
  documentCount: number
  technicalPlan?: boolean
  canRun?: boolean
  onUpdated: () => Promise<void>
}

const terminalStatuses = new Set(['completed', 'partially-completed', 'failed', 'stopped', 'cancelled'])

export function ReviewV3UnifiedRun({ caseId, stage, documentCount, technicalPlan, canRun = true, onUpdated }: Props): JSX.Element {
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [rule, setRule] = React.useState<RuleReceipt | null>(null)
  const [ruleError, setRuleError] = React.useState('')
  const [submissionNotice, setSubmissionNotice] = React.useState('')
  const [piError, setPiError] = React.useState('')
  const [piState, setPiState] = React.useState<ReviewBackgroundPiRunState | null>(null)
  const [piRun, setPiRun] = React.useState<ReviewRunV2 | null>(null)
  // RUN-43：中断续跑不自动重放未知请求；只有用户看过提示并显式确认后才放行。
  const [resumePrompt, setResumePrompt] = React.useState(false)
  const running = !!piState?.runId && ['queued', 'running', 'awaiting-input', 'awaiting-decision'].includes(piState.runStatus ?? '')
  // 旧案的异步回读不得写进新案的卡片；以代次 + 目标 caseId 双重核对（UI-13）。
  const requestSeq = React.useRef(0)
  const caseIdRef = React.useRef(caseId)
  caseIdRef.current = caseId

  const refresh = React.useCallback(async (): Promise<void> => {
    const target = caseId
    const seq = ++requestSeq.current
    const state = await window.reviewAPI.getBackgroundPiReviewStateV2(target)
    if (state.caseId !== target) throw new Error('审核状态与当前案卷不一致')
    const run = state.runId ? await window.reviewAPI.getRunV2(target, state.runId) : undefined
    if (run && run.caseId !== target) throw new Error('审核结果与当前案卷不一致')
    if (seq !== requestSeq.current || caseIdRef.current !== target) return
    setPiState(state)
    setPiRun(run ?? null)
    if (run && terminalStatuses.has(run.status)) {
      setMessage('本轮 AI 审核已结束；请核对待确认项、证据和人工决定。')
      await onUpdated()
    }
  }, [caseId, onUpdated])

  React.useEffect(() => {
    requestSeq.current += 1
    setRule(null); setRuleError(''); setSubmissionNotice(''); setPiError(''); setPiState(null); setPiRun(null); setMessage('')
    void refresh().catch(() => { /* 尚未运行 Pi 时没有状态，不阻止第一次审核 */ })
  }, [caseId])

  React.useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      void refresh().catch((cause) => setPiError(cause instanceof Error ? cause.message : String(cause)))
    }, 2500)
    return () => clearInterval(timer)
  }, [running, refresh])

  const start = async (mode: 'update' | 'restart', resumeInterrupted = false): Promise<void> => {
    if (busy || running || !caseId) return
    if (!canRun) { setPiError('请先根据材料匹配并确认审核模板，再开始执行'); return }
    if (documentCount === 0) { setPiError('请先导入实际材料，不能审核空案卷'); return }
    setBusy(true); setRule(null); setRuleError(''); setSubmissionNotice(''); setPiError(''); setResumePrompt(false); setMessage('正在准备本案审核…')
    try {
      // 已发布业务模板尝试转入正式办理；材料先拖入时可能尚未分配
      // 必填槽位，这不应该阻断本地 AI 预审。正式提交失败必须明示。
      // D4/B1 原生技术计划本就不适用发布模板的提交事务。
      if (stage === 'draft' && !technicalPlan) {
        try {
          const submitted = await window.reviewAPI.submitCaseV2(caseId)
          if (submitted && !submitted.ok) throw new Error(submitted.message ?? '案卷提交失败')
          await onUpdated()
        } catch (cause) {
          setSubmissionNotice(`案卷仍为草稿（可能需补材料槽位），本地预审继续：${cause instanceof Error ? cause.message : String(cause)}`)
        }
      }
      if (!technicalPlan) {
        try {
          const receipt = await window.reviewAPI.runTemplateRuleReview({ caseId })
          setRule(receipt as RuleReceipt)
        } catch (cause) {
          // 确定性检查失败不等于语义检查可以假称通过；明确保留失败原因。
          setRuleError(cause instanceof Error ? cause.message : String(cause))
        }
      }
      setMessage('规则检查已处理，正在启动针对同一案卷的 AI 审核…')
      try {
        const admitted = await window.reviewAPI.startBackgroundPiReviewV2({
          caseId, mode, ...(resumeInterrupted ? { resumeInterrupted: true } : {}),
        })
        if (admitted.caseId !== caseId || !admitted.runId) throw new Error('后台未返回本案真实审核运行')
        setPiState(admitted)
        setMessage('AI 审核已受理，下面会展示真实后台进度。')
        await refresh()
      } catch (cause) {
        const detail = cause instanceof Error ? cause.message : String(cause)
        setPiError(detail)
        // Main 对冷启动中断的自动续跑失败关闭；只有这里显式确认才允许新回合续交。
        if (detail.includes('继续上次检查点')) setResumePrompt(true)
        setMessage('规则检查与 AI 审核有独立回执；AI 未成功受理，不能把规则结果当成完整审核。')
      }
      await onUpdated()
    } catch (cause) {
      setPiError(cause instanceof Error ? cause.message : String(cause))
      setMessage('本轮未正常开始，请根据下方原因修正后重试。')
    } finally {
      setBusy(false)
    }
  }

  const summary = piRun?.coverage
  return <section aria-label="统一审核执行" className="space-y-2 rounded-lg border border-primary/30 bg-primary/[0.03] p-3 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="font-semibold">审核当前材料</p>
        <p className="text-xs text-muted-foreground">一处发起；规则检查和 AI 审核都使用本案真实材料与已保存的运行记录</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={busy || running || !canRun || documentCount === 0 || stage === 'archived'} onClick={() => void start('update')}>
          {busy ? '正在启动…' : running ? '审核正在进行' : piRun ? '更新审核' : '开始审核'}
        </Button>
        {resumePrompt && <Button size="sm" variant="outline" disabled={busy || running || !canRun} onClick={() => void start('update', true)}>
          继续上次检查点（新回合）
        </Button>}
        {!!piRun && <Button size="sm" variant="outline" disabled={busy || running || !canRun} onClick={() => void start('restart')}>重新审核全部</Button>}
      </div>
    </div>
    {documentCount === 0 && <p className="text-xs text-amber-700">请先把材料拖入上面的材料区，随后即可开始审核。</p>}
    {!canRun && <p className="text-xs text-amber-700">已保存材料，请先确认匹配的审核模板和实际审核对象。</p>}
    {message && <p role="status" className="text-xs">{message}</p>}
    {submissionNotice && <p role="status" className="text-xs text-amber-700">{submissionNotice}</p>}
    {rule && <p className="text-xs">模板规则检查：{rule.checks.length} 项 · {rule.status === 'completed' ? '已完成' : '存在待处理项'} · <span className="font-mono">{rule.runId}</span></p>}
    {ruleError && <p role="alert" className="text-xs text-amber-700">规则检查未完成：{ruleError}</p>}
    {piState?.runId && <p className="text-xs">AI 审核：{piRun?.status ?? piState.runStatus ?? '已受理'} · <span className="font-mono">{piState.runId}</span></p>}
    {summary && <p className="text-xs">已完成 {summary.completedChecks}/{summary.plannedChecks} 项；待处理 {summary.pendingChecks} 项；有依据的判断 {summary.effectiveVerdicts} 项</p>}
    {piRun?.status === 'completed' && summary && (summary.pendingChecks > 0 || summary.documents.some((item) => item.status !== 'read')) &&
      <p role="status" className="text-xs text-amber-700">
        技术轮已完成，但业务未就绪：{summary.pendingChecks > 0 ? `${summary.pendingChecks} 项检查待人工确认` : ''}
        {summary.pendingChecks > 0 && summary.documents.some((item) => item.status !== 'read') ? '、' : ''}
        {summary.documents.some((item) => item.status !== 'read') ? `${summary.documents.filter((item) => item.status !== 'read').length} 份材料未读` : ''}
        。completed 仅表示本轮技术执行结束，不代表完整审核通过。
      </p>}
    {summary && summary.documents.some((item) => item.status !== 'read') &&
      <p role="alert" className="text-xs text-red-600">有 {summary.documents.filter((item) => item.status !== 'read').length} 份材料尚未确认读取成功；本轮结果不可视为完整审核。</p>}
    {piError && <p role="alert" className="text-xs text-red-600">AI 审核未完成：{piError}</p>}
    <Button size="sm" variant="ghost" disabled={busy || !caseId} onClick={() => void refresh().catch((cause) => setPiError(cause instanceof Error ? cause.message : String(cause)))}>刷新审核进度和结果</Button>
  </section>
}
