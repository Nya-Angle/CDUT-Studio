/** 批量审核：按批次查看项目进度；审核队列策略后续单独收敛。 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BatchStateV2, ReviewBatch, ReviewCaseSummary, TemplateVersion, BatchTriageInput, BatchTriageRoute, BatchIssueGroup } from '@profer/shared'
import { groupBatchIssues, triageBatchCase, prepareBatchIssueActionDraft } from '@profer/shared'
import { AlertTriangle, CheckCircle2, Clock3, FileWarning, FolderOpen, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@profer/ui/primitives/dialog'
import { Input } from '@profer/ui/primitives/input'
import { Label } from '@profer/ui/primitives/label'
import { toast } from 'sonner'
import { useStore } from 'jotai'
import { reviewV2BusyAtom } from './V2CasePanel'
import { BatchGroupActionDialog } from './BatchGroupActionDialog'
import { BatchAutomationDialog } from './BatchAutomationDialog'
import { batchAutomationDisplay, reviewBusinessError, summarizeBatchExecution } from './batch-ui-feedback'
import { ReviewV3T06BatchIntakePreview } from './ReviewV3T06BatchIntakePreview'
import { ReviewV3T06PhysicalImport, type T06PhysicalMainApi } from './ReviewV3T06PhysicalImport'
import type { T06CommitReceipt } from './review-v3-t06-physical-intake'
import { buildBatchSummaryCsv } from './review-v3-t06-batch-intake'
import { latestBatchRun, mapWithConcurrency, selectVisibleBatchCases } from './review-v3-f14-batch-worklist'

type CaseIndexItem = Awaited<ReturnType<typeof window.reviewAPI.listCasesV2>>[number]
type ReviewRunV2 = Awaited<ReturnType<typeof window.reviewAPI.listRunsV2>>[number]

interface BatchProjectRow {
  caseId: string
  title: string
  applicant: string
  updatedAt: string
  entryStatus: BatchStateV2['cases'][number]['status']
  error?: string
  stage?: CaseIndexItem['stage']
  run?: ReviewRunV2
}

interface BatchPanelProps {
  active: boolean
  onOpenProject: (caseId: string) => Promise<boolean>
}

const BATCH_STATUS_LABEL: Record<BatchStateV2['status'], string> = {
  draft: '草稿', queued: '待处理', running: '进行中', finalized: '已定稿', reopened: '已重开',
}

function formatTime(value: string | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function caseStatus(row: BatchProjectRow, batch: BatchStateV2): { label: string; tone: string } {
  if (row.entryStatus === 'failed') return { label: '执行失败', tone: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300' }
  if (row.entryStatus === 'paused') return { label: '已暂停', tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' }
  if (row.entryStatus === 'running') return { label: '审核中', tone: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' }
  if (row.entryStatus === 'queued') return { label: batch.status === 'draft' ? '待开始' : '排队中', tone: 'bg-muted text-muted-foreground' }
  if (row.stage === 'awaiting-supplement') return { label: '等待补件', tone: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' }
  if (row.stage === 'awaiting-review' || row.stage === 'awaiting-final') return { label: '需要人工处理', tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' }
  if (row.entryStatus === 'done') return { label: batch.status === 'finalized' ? '批次已定稿' : '检查已完成', tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' }
  if (batch.status === 'draft') return { label: '待开始', tone: 'bg-muted text-muted-foreground' }
  return { label: '排队中', tone: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' }
}

const TRIAGE_LABELS: Record<BatchTriageRoute, string> = {
  pending: '待执行/处理中',
  'awaiting-supplement': '等待补件',
  'technical-exception': '技术异常',
  'manual-review': '待人工判断',
  'auto-return-candidate': '可退回候选',
  'auto-pass-candidate': '可通过候选',
  'already-decided': '已作业务决定',
}

const TRIAGE_TONES: Record<BatchTriageRoute, string> = {
  pending: 'text-muted-foreground',
  'awaiting-supplement': 'text-blue-700 dark:text-blue-300',
  'technical-exception': 'text-red-600 dark:text-red-400',
  'manual-review': 'text-amber-600 dark:text-amber-400',
  'auto-return-candidate': 'text-orange-600 dark:text-orange-400',
  'auto-pass-candidate': 'text-emerald-700 dark:text-emerald-300',
  'already-decided': 'text-foreground',
}

export function BatchPanel({ active, onOpenProject }: BatchPanelProps): JSX.Element {
  const store = useStore()
  const progressPollInFlight = useRef(false)
  const [batches, setBatches] = useState<BatchStateV2[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [cases, setCases] = useState<CaseIndexItem[]>([])
  const [legacyCases, setLegacyCases] = useState<ReviewCaseSummary[]>([])
  const [templates, setTemplates] = useState<TemplateVersion[]>([])
  const [runs, setRuns] = useState<Record<string, ReviewRunV2 | undefined>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [handlingBatch, setHandlingBatch] = useState(false)
  const [openedGroupKey, setOpenedGroupKey] = useState<string | null>(null)
  const [actionGroup, setActionGroup] = useState<BatchIssueGroup | null>(null)
  const [configureAutomationOpen, setConfigureAutomationOpen] = useState(false)
  const [batchName, setBatchName] = useState('')
  const [templateKey, setTemplateKey] = useState('')
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([])
  const [queueQuery, setQueueQuery] = useState('')
  const [queueFilter, setQueueFilter] = useState('all')
  const [selectedRetryIds, setSelectedRetryIds] = useState<string[]>([])
  const [reopenOpen, setReopenOpen] = useState(false)
  const [reopenReason, setReopenReason] = useState('')

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const [batchList, caseList, legacyList, templateList] = await Promise.all([
        window.reviewAPI.listBatchesV2(),
        window.reviewAPI.listCasesV2(),
        window.reviewAPI.listCases(),
        window.reviewAPI.listTemplatesV2(),
      ])
      setBatches(batchList)
      setCases(caseList)
      setLegacyCases(legacyList)
      setTemplates(templateList.filter((template) => template.status === 'published'))
      setSelectedBatchId((current) => batchList.some((batch) => batch.batch.id === current) ? current : batchList[0]?.batch.id ?? '')

      const caseIds = [...new Set(batchList.flatMap((batch) => batch.cases.map((entry) => entry.caseId)))]
      // 大批次有上百案卷，限制 IPC/磁盘查询并发，避免打开工作台时瞬时淹没 Main。
      const runEntries = await mapWithConcurrency(caseIds, 6, async (caseId) => {
        try {
          const history = await window.reviewAPI.listRunsV2(caseId)
          return [caseId, latestBatchRun(history)] as const
        } catch {
          return [caseId, undefined] as const
        }
      })
      setRuns(Object.fromEntries(runEntries))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (active) void refresh() }, [active, refresh])

  const selectedBatch = batches.find((batch) => batch.batch.id === selectedBatchId) ?? null

  // Main 按案逐个落盘；UI 不应等整个批次的 runBatchV2 Promise 返回才显示进度。
  // 轮询只读已有状态，发现完成的案卷才补读 Run，绝不在 Renderer 改写批次。
  useEffect(() => {
    if (!active || !selectedBatchId) return
    let cancelled = false
    const poll = async (): Promise<void> => {
      if (progressPollInFlight.current) return
      progressPollInFlight.current = true
      try {
        const updated = await window.reviewAPI.getBatchV2(selectedBatchId)
        if (cancelled || !updated) return
        const old = selectedBatch
        const oldEntries = new Map(old?.cases.map((entry) => [entry.caseId, entry]))
        const changed = !old || updated.status !== old.status || updated.cases.some((entry) => {
          const previous = oldEntries.get(entry.caseId)
          return !previous || entry.status !== previous.status || entry.error !== previous.error
        })
        if (!changed) return
        const completed = updated.cases.filter((entry) => entry.status === 'done'
          && oldEntries.get(entry.caseId)?.status !== 'done').map((entry) => entry.caseId)
        if (completed.length) {
          const [caseList, runEntries] = await Promise.all([
            window.reviewAPI.listCasesV2(),
            mapWithConcurrency(completed, 6, async (caseId) => {
              try { return [caseId, latestBatchRun(await window.reviewAPI.listRunsV2(caseId))] as const }
              catch { return [caseId, undefined] as const }
            }),
          ])
          if (cancelled) return
          setCases(caseList)
          setRuns((current) => ({ ...current, ...Object.fromEntries(runEntries) }))
        }
        if (!cancelled) setBatches((current) => current.map((item) => item.batch.id === updated.batch.id ? updated : item))
      } catch {
        // 瞬时轮询失败不代表队列失败；用户仍可手动刷新查看 Main 的持久状态。
      } finally {
        progressPollInFlight.current = false
      }
    }
    const interval = window.setInterval(() => { void poll() }, selectedBatch?.status === 'running' || executing ? 1500 : 8000)
    return () => { cancelled = true; window.clearInterval(interval) }
  }, [active, selectedBatchId, selectedBatch, executing])
  const legacyById = useMemo(() => new Map(legacyCases.map((item) => [item.id, item])), [legacyCases])
  const caseById = useMemo(() => new Map(cases.map((item) => [item.caseId, item])), [cases])
  const rows = useMemo<BatchProjectRow[]>(() => {
    if (!selectedBatch) return []
    return selectedBatch.cases.map((entry) => {
      const indexItem = caseById.get(entry.caseId)
      const legacy = legacyById.get(entry.caseId)
      return {
        caseId: entry.caseId,
        title: indexItem?.title ?? legacy?.title ?? entry.caseId,
        applicant: legacy?.applicant || '未填写',
        updatedAt: indexItem?.updatedAt ?? legacy?.updatedAt ?? selectedBatch.batch.createdAt,
        entryStatus: entry.status,
        error: entry.error,
        stage: indexItem?.stage,
        run: runs[entry.caseId],
      }
    })
  }, [caseById, legacyById, runs, selectedBatch])

  const selectedTemplate = templates.find((template) => `${template.templateId}@${template.version}` === templateKey)
  const availableCases = selectedTemplate
    ? cases.filter((item) => item.templateId === selectedTemplate.templateId && item.templateVersion === selectedTemplate.version)
    : []

  const openCreate = (): void => {
    setBatchName('新审核批次')
    setTemplateKey('')
    setSelectedCaseIds([])
    setCreateOpen(true)
  }

  const toggleCase = (caseId: string): void => {
    setSelectedCaseIds((current) => current.includes(caseId) ? current.filter((id) => id !== caseId) : [...current, caseId])
  }

  const openProject = async (caseId: string): Promise<void> => {
    try {
      if (!await onOpenProject(caseId)) toast.error('无法打开这个审核项目，请刷新后重试。')
    } catch (cause) {
      toast.error(`打开项目失败：${reviewBusinessError(cause)}`)
    }
  }

  const createBatch = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!selectedTemplate || !batchName.trim() || selectedCaseIds.length === 0 || creating) return
    setCreating(true)
    store.set(reviewV2BusyAtom, true)
    try {
      const batch: ReviewBatch = {
        id: `batch-${Date.now().toString(36)}`,
        name: batchName.trim(),
        templateId: selectedTemplate.templateId,
        templateVersion: selectedTemplate.version,
        policyVersionLock: (selectedTemplate.policyRefs?.map((policy) => ({ policyVersionId: policy.policyId, version: policy.version }))
          ?? selectedTemplate.policyVersionIds.map((policyVersionId) => ({ policyVersionId, version: 1 }))),
        caseIds: selectedCaseIds,
        createdAt: new Date().toISOString(),
      }
      const created = await window.reviewAPI.createBatchV2(batch)
      setBatches((current) => [created, ...current])
      setSelectedBatchId(created.batch.id)
      setCreateOpen(false)
      toast.success(`批次已创建：${created.batch.name}`)
    } catch (cause) {
      toast.error(`批次创建失败：${reviewBusinessError(cause)}`)
    } finally {
      store.set(reviewV2BusyAtom, false)
      setCreating(false)
    }
  }


  const triageInputs = useMemo<BatchTriageInput[]>(() => selectedBatch
    ? rows.map((row) => ({
      caseId: row.caseId,
      entryStatus: row.entryStatus,
      caseStage: row.stage,
      run: row.run,
      batch: selectedBatch.batch,
    }))
    : [], [rows, selectedBatch])
  const triageByCase = useMemo(() => new Map(triageInputs.map((input) =>
    [input.caseId, triageBatchCase(input)])), [triageInputs])
  const issueGroups = useMemo(() => groupBatchIssues(triageInputs), [triageInputs])
  const retryableCaseIds = useMemo(() => new Set(rows.filter((row) =>
    row.entryStatus === 'failed' || row.entryStatus === 'paused'
    || (row.entryStatus === 'done' && triageByCase.get(row.caseId)?.route === 'technical-exception'),
  ).map((row) => row.caseId)), [rows, triageByCase])
  const visibleRows = useMemo(() => rows.filter((row) => {
    const query = queueQuery.trim().toLocaleLowerCase()
    const searchable = [row.title, row.applicant, row.caseId, row.error ?? ''].join(' ').toLocaleLowerCase()
    if (query && !searchable.includes(query)) return false
    const route = triageByCase.get(row.caseId)?.route
    if (queueFilter === 'all') return true
    if (queueFilter === 'retryable') return retryableCaseIds.has(row.caseId)
    if (queueFilter === 'failed' || queueFilter === 'paused' || queueFilter === 'queued' || queueFilter === 'running' || queueFilter === 'done') {
      return row.entryStatus === queueFilter
    }
    return route === queueFilter
  }), [rows, queueQuery, queueFilter, retryableCaseIds, triageByCase])
  const visibleRetryableIds = visibleRows.filter((row) => retryableCaseIds.has(row.caseId)).map((row) => row.caseId)

  useEffect(() => {
    setSelectedRetryIds([])
    setQueueQuery('')
    setQueueFilter('all')
  }, [selectedBatchId])
  const retrySelected = async (): Promise<void> => {
    if (!selectedBatch || handlingBatch || executing || selectedBatch.status === 'running' || selectedBatch.status === 'finalized') return
    const ids = selectedRetryIds.filter((caseId) => retryableCaseIds.has(caseId))
    if (!ids.length) return
    setHandlingBatch(true)
    try {
      await window.reviewAPI.batchActionV2({ action: 'retry', batchId: selectedBatch.batch.id, caseIds: ids })
      toast.success('已将 ' + ids.length + ' 个明确选中的案卷重新加入审核队列')
      setSelectedRetryIds([])
      await refresh()
    } catch (cause) {
      toast.error('批量重试失败：' + reviewBusinessError(cause))
    } finally { setHandlingBatch(false) }
  }

  const reopenFinalizedBatch = async (): Promise<void> => {
    if (!selectedBatch || selectedBatch.status !== 'finalized' || !reopenReason.trim() || handlingBatch) return
    setHandlingBatch(true)
    try {
      const reopened = await window.reviewAPI.batchActionV2({
        action: 'reopen', batchId: selectedBatch.batch.id,
        newBatchId: 'batch-reopen-' + Date.now().toString(36),
        reason: reopenReason.trim(),
      })
      setReopenOpen(false)
      setReopenReason('')
      await refresh()
      setSelectedBatchId(reopened.batch.id)
      toast.success('已建立新评审轮次；旧批次及定稿快照保持不变')
    } catch (cause) {
      toast.error('重开批次失败：' + reviewBusinessError(cause))
    } finally { setHandlingBatch(false) }
  }

  const exportBatchSummary = (): void => {
    if (!selectedBatch) return
    const csv = buildBatchSummaryCsv(rows.map((row) => {
      const route = triageByCase.get(row.caseId)
      return {
        caseId: row.caseId, title: row.title, applicant: row.applicant,
        status: row.entryStatus, route: route ? TRIAGE_LABELS[route.route] : '未知',
        completed: row.run?.coverage?.completedChecks ?? '',
        planned: row.run?.coverage?.plannedChecks ?? '',
        pending: row.run?.coverage?.pendingChecks ?? '',
        error: row.error ?? '',
      }
    }))
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'batch-' + selectedBatch.batch.id + '-status.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const issueDraft = useMemo(() => openedGroupKey
    ? prepareBatchIssueActionDraft(triageInputs, openedGroupKey)
    : null, [triageInputs, openedGroupKey])
  const counts = triageInputs.reduce((total, input) => {
    const route = triageByCase.get(input.caseId)?.route
    if (route === 'pending') total.pending++
    if (route === 'manual-review') total.human++
    if (route === 'technical-exception') total.technical++
    if (route === 'auto-pass-candidate') total.passCandidate++
    if (route === 'auto-return-candidate' || route === 'awaiting-supplement') total.supplement++
    return total
  }, { pending: 0, human: 0, technical: 0, passCandidate: 0, supplement: 0 })
  const queueCounts = selectedBatch?.cases.reduce((total, entry) => {
    total[entry.status]++
    return total
  }, { queued: 0, running: 0, done: 0, failed: 0, paused: 0 })

  const processAutomation = async (): Promise<void> => {
    if (!selectedBatch || executing || handlingBatch || !selectedBatch.automation || selectedBatch.automation.mode === 'assist') return
    setHandlingBatch(true)
    try {
      const report = await window.reviewAPI.processBatchAutomationV2(selectedBatch.batch.id)
      toast.success(`自动处理结果：已执行 ${report.applied} 案，阻断 ${report.blocked} 案，失败 ${report.failed} 案`)
      await refresh()
    } catch (cause) {
      toast.error(`批次自动处理失败：${reviewBusinessError(cause)}`)
    } finally { setHandlingBatch(false) }
  }

  const finalizeCompleted = async (): Promise<void> => {
    if (!selectedBatch || executing || handlingBatch) return
    setHandlingBatch(true)
    try {
      await window.reviewAPI.batchActionV2({ action: 'finalize-completed', batchId: selectedBatch.batch.id })
      toast.success('全部案卷具备正式业务结论，批次已定稿')
      await refresh()
    } catch (cause) {
      toast.error(`批次尚不能定稿：${reviewBusinessError(cause)}`)
    } finally { setHandlingBatch(false) }
  }

  const runSelectedBatch = async (): Promise<void> => {
    if (!selectedBatch || executing || handlingBatch || selectedBatch.status === 'finalized' || selectedBatch.status === 'running') return
    setExecuting(true)
    try {
      const result = await window.reviewAPI.runBatchV2(selectedBatch.batch.id)
      // Only the run-result statuses count as completed/failed. Inspect the
      // fresh per-case route before reporting anything as pending human work.
      let routes = new Map<string, BatchTriageRoute>()
      try {
        const [caseIndex, histories] = await Promise.all([
          window.reviewAPI.listCasesV2(),
          mapWithConcurrency(result.cases.filter((entry) => entry.status === 'done'), 6,
            async (entry) => ({ caseId: entry.caseId, history: await window.reviewAPI.listRunsV2(entry.caseId) })),
        ])
        const stages = new Map(caseIndex.map((item) => [item.caseId, item.stage]))
        routes = new Map(histories.map(({ caseId, history }) => {
          const run = latestBatchRun(history)
          return [caseId, triageBatchCase({
            caseId, entryStatus: 'done', caseStage: stages.get(caseId), run, batch: result.batch,
          }).route] as const
        }))
      } catch {
        // Queue result is authoritative even if optional UI classification fails.
        // Never turn a completed run into a false "execution failed" notification.
      }
      const summary = summarizeBatchExecution(result, routes)
      const humanText = summary.completed === 0 || routes.size ? String(summary.needsHuman) : '待刷新确认'
      const message = `批次检查结束：完成 ${summary.completed} 案，失败 ${summary.failed} 案，待人工处理 ${humanText} 案`
        + (summary.technical ? `，技术异常 ${summary.technical} 案` : '')
        + (summary.pending ? `，仍待执行 ${summary.pending} 案` : '')
      if (summary.failed || summary.technical || summary.pending) toast.warning(message)
      else toast.success(message)
    } catch (cause) {
      toast.error(`批次执行失败：${reviewBusinessError(cause)}`)
    } finally {
      setExecuting(false)
      await refresh()
    }
  }

  const handleBatchAction = async (action: 'recover' | 'retry', caseId?: string): Promise<void> => {
    if (!selectedBatch || executing || handlingBatch) return
    setHandlingBatch(true)
    try {
      await window.reviewAPI.batchActionV2({
        action,
        batchId: selectedBatch.batch.id,
        ...(caseId ? { caseIds: [caseId] } : {}),
      })
      toast.success(action === 'recover' ? '已标记上次中断的案卷，请核查后选择重试' : '已将指定案卷重新加入待执行队列')
      await refresh()
    } catch (cause) {
      toast.error(`批次操作失败：${reviewBusinessError(cause)}`)
    } finally {
      setHandlingBatch(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 px-5 py-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">批量审核</h2>
          <p className="mt-1 text-sm text-muted-foreground">按批次跟进多个审核项目的进度和待处理情况。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedBatch && selectedBatch.status !== 'finalized' && (
            <Button type="button" size="sm" variant="outline" className="h-9 rounded-lg px-3"
              disabled={executing || handlingBatch || selectedBatch.status === 'running'}
              onClick={() => setConfigureAutomationOpen(true)}>
              自动化：{selectedBatch.automation?.mode === 'auto-approve' ? '自动通过/补件'
                : selectedBatch.automation?.mode === 'auto-return' ? '自动补件' : '辅助'}
            </Button>
          )}
          {selectedBatch?.status === 'queued' && (
            <>
              {selectedBatch.automation && selectedBatch.automation.mode !== 'assist' && (
                <Button type="button" size="sm" variant="outline" className="h-9 rounded-lg px-3"
                  disabled={executing || handlingBatch} onClick={() => void processAutomation()}>
                  执行自动处理
                </Button>
              )}
              {/* BATCH-02：assist 人工批次与自动批次共用同一核验定稿入口，策略不决定能否定稿。 */}
              <Button type="button" size="sm" variant="outline" className="h-9 rounded-lg px-3"
                disabled={executing || handlingBatch} onClick={() => void finalizeCompleted()}>
                核验并定稿
              </Button>
            </>
          )}
          {selectedBatch?.status === 'finalized' && (
            <Button type="button" size="sm" variant="outline" className="h-9 rounded-lg px-3"
              disabled={handlingBatch || executing} onClick={() => setReopenOpen(true)}>
              重开新评审轮次
            </Button>
          )}
          {selectedBatch?.status === 'running' && !executing && (
            <Button type="button" size="sm" variant="outline" className="h-9 rounded-lg px-3"
              disabled={executing || handlingBatch} onClick={() => void handleBatchAction('recover')}>
              <RefreshCw size={15} />恢复中断批次
            </Button>
          )}
          {selectedBatch && (
            <Button type="button" size="sm" variant="outline" className="h-9 rounded-lg px-3"
              disabled={executing || handlingBatch || selectedBatch.status === 'finalized' || selectedBatch.status === 'running' || !selectedBatch.cases.some((entry) => entry.status === 'queued')}
              onClick={() => void runSelectedBatch()}>
              <Clock3 size={15} />{executing ? '批次审核中…' : '执行待审核案卷'}
            </Button>
          )}
          <Button type="button" size="sm" className="h-9 rounded-lg px-4" onClick={openCreate}>
            <Plus size={15} />新建批次
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="待执行/处理中" value={counts.pending} hint="尚未完成本轮检查" icon={<Clock3 size={15} />} tone="text-blue-600 dark:text-blue-400" />
        <SummaryCard label="待人工判断" value={counts.human} hint="不含技术异常" icon={<AlertTriangle size={15} />} tone="text-amber-600 dark:text-amber-400" />
        <SummaryCard label="可通过候选" value={counts.passCandidate} hint="未作正式批准" icon={<CheckCircle2 size={15} />} tone="text-emerald-600 dark:text-emerald-400" />
        <SummaryCard label="补件/退回候选" value={counts.supplement} hint="仍需正式授权" icon={<FileWarning size={15} />} tone="text-orange-600 dark:text-orange-400" />
      </div>

      {selectedBatch && (
        <div className="space-y-1 text-xs text-muted-foreground" role="status" aria-live="polite">
          <p>名册共 {selectedBatch.cases.length} 案 · 待执行 {queueCounts?.queued} · 执行中 {queueCounts?.running} ·
            检查结束 {queueCounts?.done} · 执行失败 {queueCounts?.failed} · 暂停 {queueCounts?.paused}。
            {selectedBatch.status === 'running' && ' 正在逐案处理，状态自动更新。'}</p>
          <p>技术异常：{counts.technical} 项 · 已执行自动通过：
          {(selectedBatch.automationReceipts ?? []).filter((r) => r.action === 'pass' && r.status === 'applied').length} 案 ·
          已执行自动补件：{(selectedBatch.automationReceipts ?? []).filter((r) => r.action === 'return' && r.status === 'applied').length} 案 ·
          自动阻断/失败：{(selectedBatch.automationReceipts ?? []).filter((r) => r.status !== 'applied').length} 条。
          候选建议不是正式决定；正式处理仅以案卷事务回执为准。</p>
        </div>
      )}
      {error && <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">批次加载失败：{error}</div>}

      <section className="space-y-3">
        <div className="flex min-h-8 flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">审核批次</h3>
          {selectedBatch ? (
            <>
              {batches.length > 1 ? (
                <select
                  aria-label="当前审核批次"
                  value={selectedBatch.batch.id}
                  onChange={(event) => setSelectedBatchId(event.target.value)}
                  className="h-7 max-w-full rounded-md border border-input bg-background px-2 text-xs text-muted-foreground"
                >
                  {batches.map((batch) => <option key={batch.batch.id} value={batch.batch.id}>{batch.batch.name}</option>)}
                </select>
              ) : <span className="text-xs text-muted-foreground">{selectedBatch.batch.name}</span>}
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{BATCH_STATUS_LABEL[selectedBatch.status]}</span>
              <span className="text-xs text-muted-foreground">{templates.find((item) => item.templateId === selectedBatch.batch.templateId && item.version === selectedBatch.batch.templateVersion)?.name ?? selectedBatch.batch.templateId} · v{selectedBatch.batch.templateVersion}</span>
            </>
          ) : <span className="text-xs text-muted-foreground">{loading ? '正在加载…' : '还没有审核批次'}</span>}
          <Button type="button" variant="ghost" size="sm" className="ml-auto h-7 px-2 text-xs text-muted-foreground" disabled={loading} onClick={() => void refresh()}>
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />刷新
          </Button>
        </div>

        {selectedBatch && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/80 bg-card p-2">
            <input type="search" value={queueQuery} onChange={(event) => setQueueQuery(event.target.value)}
              aria-label="筛选批次案卷" placeholder="搜索案卷、申报人或错误原因"
              className="h-8 min-w-[160px] flex-1 rounded-md border border-input bg-background px-2 text-xs" />
            <select aria-label="筛选执行与分流状态" value={queueFilter}
              onChange={(event) => setQueueFilter(event.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs">
              <option value="all">所有状态</option>
              <option value="queued">待执行</option>
              <option value="running">执行中</option>
              <option value="done">检查已结束</option>
              <option value="failed">执行失败</option>
              <option value="paused">已暂停</option>
              <option value="retryable">可重试</option>
              <option value="manual-review">需要人工判断</option>
              <option value="technical-exception">技术异常</option>
              <option value="awaiting-supplement">等待补件</option>
              <option value="auto-pass-candidate">通过候选</option>
              <option value="auto-return-candidate">退回候选</option>
              <option value="already-decided">已作业务决定</option>
            </select>
            <span className="text-xs text-muted-foreground">显示 {visibleRows.length}/{rows.length} 案</span>
            <Button type="button" size="sm" variant="outline" onClick={exportBatchSummary}>
              导出状态 CSV
            </Button>
            <Button type="button" size="sm" variant="outline"
              disabled={executing || handlingBatch || selectedBatch.status === 'running' || selectedBatch.status === 'finalized'
                || selectedRetryIds.filter((caseId) => retryableCaseIds.has(caseId)).length === 0}
              onClick={() => void retrySelected()}>
              重试选中（{selectedRetryIds.filter((caseId) => retryableCaseIds.has(caseId)).length}）
            </Button>
          </div>
        )}

        {selectedBatch ? (
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
                <thead className="bg-muted/45 text-[11px] font-medium text-muted-foreground">
                  <tr>
                    <th className="px-2 py-3">
                      <input type="checkbox" aria-label="选择当前筛选中所有可重试案卷"
                        disabled={!visibleRetryableIds.length || executing || handlingBatch || selectedBatch.status === 'running' || selectedBatch.status === 'finalized'}
                        checked={visibleRetryableIds.length > 0 && visibleRetryableIds.every((id) => selectedRetryIds.includes(id))}
                        onChange={(event) => {
                          setSelectedRetryIds((previous) => event.target.checked
                            ? [...new Set([...previous, ...visibleRetryableIds])]
                            : previous.filter((id) => !visibleRetryableIds.includes(id)))
                        }} />
                    </th>
                    <th className="px-3 py-3">项目</th>
                    <th className="px-3 py-3">申报人</th>
                    <th className="px-3 py-3">审核进度</th>
                    <th className="px-3 py-3">待处理</th>
                    <th className="px-3 py-3">状态</th>
                    <th className="px-3 py-3">分流建议</th>
                    <th className="px-3 py-3 text-right">最近更新</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {visibleRows.map((row) => {
                    const status = caseStatus(row, selectedBatch)
                    const coverage = row.run?.coverage
                    const triage = triageByCase.get(row.caseId)
                    const automationRecord = [...(selectedBatch.automationReceipts ?? [])].reverse()
                      .find((receipt) => receipt.caseId === row.caseId && receipt.status === 'applied')
                    const display = batchAutomationDisplay(
                      row.entryStatus, row.stage, row.run?.id, automationRecord, triage ? TRIAGE_LABELS[triage.route] : '—',
                    )
                    return (
                      <tr key={row.caseId} className="transition-colors hover:bg-muted/25">
                        <td className="px-2 py-3">
                          {retryableCaseIds.has(row.caseId) && <input type="checkbox" aria-label={'选择重试 ' + row.title}
                            disabled={executing || handlingBatch || selectedBatch.status === 'running' || selectedBatch.status === 'finalized'}
                            checked={selectedRetryIds.includes(row.caseId)}
                            onChange={(event) => setSelectedRetryIds((previous) => event.target.checked
                              ? [...new Set([...previous, row.caseId])]
                              : previous.filter((id) => id !== row.caseId))} />}
                        </td>
                        <td className="max-w-[360px] px-3 py-3">
                          <button type="button" className="block max-w-full truncate text-left text-foreground/90 hover:text-primary hover:underline" title={row.title} onClick={() => void openProject(row.caseId)}>{row.title}</button>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">{row.applicant}</td>
                        <td className="px-3 py-3 tabular-nums text-muted-foreground">{coverage && coverage.plannedChecks > 0 ? `${coverage.completedChecks} / ${coverage.plannedChecks}` : '—'}</td>
                        <td className="px-3 py-3 tabular-nums text-muted-foreground">{coverage ? coverage.pendingChecks : '—'}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${status.tone}`}>{status.label}</span>
                          {row.error && <p className="mt-1 max-w-[180px] truncate text-[11px] text-destructive" title={row.error}>{row.error}</p>}
                          {(row.entryStatus === 'failed' || row.entryStatus === 'paused' || (row.entryStatus === 'done' && triage?.route === 'technical-exception')) && selectedBatch.status !== 'running' && selectedBatch.status !== 'finalized' && (
                            <button type="button" className="ml-2 text-[11px] text-primary hover:underline"
                              disabled={executing || handlingBatch}
                              title={selectedBatch.cases.find((entry) => entry.caseId === row.caseId)?.error ?? '重新入队，仅本案'}
                              onClick={() => void handleBatchAction('retry', row.caseId)}>重试本案</button>
                          )}
                        </td>
                        <td className={`px-3 py-3 font-medium ${triage ? TRIAGE_TONES[triage.route] : 'text-muted-foreground'}`} title={triage?.explanation}>
                          <div>{display.label}</div>
                          {display.history && (
                            <div className="mt-1 font-normal text-[11px] text-muted-foreground">{display.history}</div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatTime(row.updatedAt)}</td>
                      </tr>
                    )
                  })}
                  {visibleRows.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">{rows.length ? '当前筛选条件下没有案卷。' : '这个批次还没有纳入审核项目。'}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-12 text-center">
            <FolderOpen size={23} className="mx-auto text-muted-foreground/70" />
            <p className="mt-3 text-sm font-medium">还没有审核批次</p>
            <p className="mt-1 text-xs text-muted-foreground">创建批次后，可以在这里查看各项目的审核进度。</p>
            {!loading && templates.length === 0 && <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">请先发布审核模板，再创建批次。</p>}
          </div>
        )}
      </section>

      {selectedBatch && issueGroups.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">同类审核问题</h3>
            <span className="text-xs text-muted-foreground">保守归组 · {issueGroups.length} 组 · 可按组预览与人工确认逐案处理</span>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {issueGroups.map((group) => (
              <div key={group.key} className="rounded-xl border border-border/80 bg-card p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{group.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{group.ruleId} · {group.status} · {group.occurrences.length} 条检查</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs">{group.caseIds.length} 个案卷</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.caseIds.slice(0, 4).map((caseId) => {
                    const row = rows.find((item) => item.caseId === caseId)
                    return <button type="button" key={caseId} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:border-primary/40"
                      onClick={() => void openProject(caseId)}>{row?.applicant && row.applicant !== '未填写' ? row.applicant : row?.title ?? caseId}</button>
                  })}
                  {group.caseIds.length > 4 && <span className="py-1 text-xs text-muted-foreground">等 {group.caseIds.length} 项</span>}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <button type="button" className="text-xs text-primary hover:underline"
                    onClick={() => setOpenedGroupKey((current) => current === group.key ? null : group.key)}>
                    {openedGroupKey === group.key ? '收起处置草稿' : '查看逐案处置草稿'}
                  </button>
                  <Button size="sm" variant="outline" type="button" disabled={selectedBatch.status === 'finalized' || selectedBatch.status === 'running' || executing || handlingBatch}
                    onClick={() => setActionGroup(group)}>人工集中处理</Button>
                </div>
                {openedGroupKey === group.key && issueDraft?.groupKey === group.key && (
                  <div className="mt-2 space-y-2 rounded-md bg-muted/50 p-3 text-xs">
                    <p className="font-medium">建议：{issueDraft.action === 'supplement-draft' ? '核对补件要素' : '人工复核'} · 可适用 {issueDraft.eligibleCount}/{issueDraft.cases.length} 项</p>
                    <p className="text-muted-foreground">{issueDraft.suggestedReason}</p>
                    {issueDraft.cases.map((draftCase) => (
                      <div key={draftCase.caseId} className="flex justify-between gap-2">
                        <button type="button" className="text-left hover:text-primary hover:underline" onClick={() => void openProject(draftCase.caseId)}>{rows.find((row) => row.caseId === draftCase.caseId)?.title ?? draftCase.caseId}</button>
                        <span className={draftCase.eligible ? 'text-amber-600' : 'text-muted-foreground'}>{draftCase.eligible ? '待核对' : '排除批量操作'}</span>
                      </div>
                    ))}
                    <p className="text-muted-foreground">草稿不执行审批；请打开案卷核对来源、业务规则及授权。</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedBatch && actionGroup && (
        <BatchGroupActionDialog key={actionGroup.key} batchId={selectedBatch.batch.id}
          group={actionGroup}
          titleOf={(caseId) => rows.find((row) => row.caseId === caseId)?.title ?? caseId}
          onClose={() => setActionGroup(null)}
          onApplied={refresh}
        />
      )}

      {selectedBatch && configureAutomationOpen && (
        <BatchAutomationDialog key={selectedBatch.batch.id} batch={selectedBatch}
          onClose={() => setConfigureAutomationOpen(false)} onSaved={refresh} />
      )}

      <Dialog open={reopenOpen} onOpenChange={setReopenOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>重开批次评审</DialogTitle>
            <DialogDescription>
              为已定稿批次建立新的评审轮次，保留原来的批次、定稿快照和历史结果。
              新轮次将重新进入待审队列，不会修改原轮次的业务决定。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="t06-reopen-reason">重开原因</Label>
            <Input id="t06-reopen-reason" value={reopenReason}
              onChange={(event) => setReopenReason(event.target.value)}
              placeholder="说明需要重新审核的原因" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setReopenOpen(false)}>取消</Button>
            <Button type="button" disabled={!reopenReason.trim() || handlingBatch}
              onClick={() => void reopenFinalizedBatch()}>{handlingBatch ? '正在建立…' : '确认重开'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateBatchDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        creating={creating}
        batchName={batchName}
        onBatchNameChange={setBatchName}
        templates={templates}
        templateKey={templateKey}
        onTemplateKeyChange={(value) => { setTemplateKey(value); setSelectedCaseIds([]) }}
        availableCases={availableCases}
        allCases={cases}
        legacyById={legacyById}
        selectedCaseIds={selectedCaseIds}
        onToggleCase={toggleCase}
        onApplyCaseIds={setSelectedCaseIds}
        onPhysicalCommitted={(result) => { void (async () => {
          await refresh()
          if (result.batchId) setSelectedBatchId(result.batchId)
          // 留在弹窗内展示逐案入库回执，并让用户点击一次启动所有模板批次审核。
        })() }}
        onCreate={createBatch}
      />
    </div>
  )
}

function SummaryCard({ label, value, hint, icon, tone }: { label: string; value: number; hint: string; icon: JSX.Element; tone: string }): JSX.Element {
  return (
    <div className="min-h-[84px] rounded-xl border border-border/80 bg-card px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={tone}>{icon}</span>
      </div>
      <div className="mt-1 text-2xl font-semibold leading-none tabular-nums">{value}</div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">{hint}</p>
    </div>
  )
}

function CreateBatchDialog({
  open, onOpenChange, creating, batchName, onBatchNameChange, templates, templateKey, onTemplateKeyChange,
  availableCases, allCases, legacyById, selectedCaseIds, onToggleCase, onApplyCaseIds, onPhysicalCommitted, onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  creating: boolean
  batchName: string
  onBatchNameChange: (name: string) => void
  templates: TemplateVersion[]
  templateKey: string
  onTemplateKeyChange: (value: string) => void
  availableCases: CaseIndexItem[]
  allCases: CaseIndexItem[]
  legacyById: Map<string, ReviewCaseSummary>
  selectedCaseIds: string[]
  onToggleCase: (caseId: string) => void
  onApplyCaseIds: (ids: string[]) => void
  onPhysicalCommitted: (result: T06CommitReceipt) => void
  onCreate: (event: React.FormEvent<HTMLFormElement>) => void
}): JSX.Element {
  const selectedTemplate = templates.find((template) => `${template.templateId}@${template.version}` === templateKey)
  const [caseSearch, setCaseSearch] = useState('')
  const visibleCases = useMemo(() => {
    const query = caseSearch.trim().toLocaleLowerCase()
    return query ? availableCases.filter((item) => [item.caseId, item.title, legacyById.get(item.caseId)?.applicant ?? '']
      .some((value) => value.toLocaleLowerCase().includes(query))) : availableCases
  }, [availableCases, caseSearch, legacyById])
  const visibleIds = visibleCases.map((item) => item.caseId)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedCaseIds.includes(id))
  const canCreate = !!selectedTemplate && batchName.trim().length > 0 && selectedCaseIds.length > 0 && !creating
  // Main 已提供物理入库端口；仍保留存在性判断，便于旧 preload 降级为不可用而不是崩
  const physicalMain = window.reviewAPI as Partial<T06PhysicalMainApi>
  const physicalApi: T06PhysicalMainApi | undefined =
    typeof physicalMain.pickT06PhysicalSource === 'function'
    && typeof physicalMain.commitT06PhysicalImport === 'function'
      ? { pickT06PhysicalSource: physicalMain.pickT06PhysicalSource, commitT06PhysicalImport: physicalMain.commitT06PhysicalImport }
      : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>批量导入与审核</DialogTitle>
          <DialogDescription>先选择 ZIP 或文件夹，逐案确认申请人和业务模板；混合业务会创建不同模板批次。下方仍保留从已有案卷建同模板批次的入口。</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(event) => void onCreate(event)}>
          <div className="space-y-1.5">
            <Label htmlFor="review-batch-name">批次名称</Label>
            <Input id="review-batch-name" value={batchName} onChange={(event) => onBatchNameChange(event.target.value)} placeholder="如：2026 秋季综合测评" autoFocus />
          </div>
          <ReviewV3T06PhysicalImport key="physical-batch-intake"
            api={physicalApi} templateId={selectedTemplate?.templateId} templateVersion={selectedTemplate?.version}
            batchName={batchName} templates={templates.map(item => ({
              templateId: item.templateId, version: item.version, name: item.name,
              fields: (item.fields ?? []).map(field => ({
                key: field.key, label: field.label, kind: field.kind, required: field.required,
                scope: field.scope ?? 'subject',
                ...(field.options ? { options: field.options.map(option => ({ value: option.value, label: option.label })) } : {}),
              })),
              materialSlots: (item.materialSlots ?? []).map(slot => ({
                id: slot.id, name: slot.name, minCount: slot.minCount,
                ...(slot.requiredAt ? { requiredAt: slot.requiredAt } : {}),
              })),
            }))}
            existingCases={allCases.map(item => ({
              caseId: item.caseId, title: item.title, templateId: item.templateId, templateVersion: item.templateVersion,
            }))}
            onCommitted={onPhysicalCommitted} />
          <div className="space-y-1.5 border-t pt-3">
            <Label htmlFor="review-batch-template">可选：使用同一模板的已有案卷组批次</Label>
            <select id="review-batch-template" value={templateKey} onChange={(event) => { onTemplateKeyChange(event.target.value); setCaseSearch('') }} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="">选择已发布模板…</option>
              {templates.map((template) => <option key={`${template.templateId}@${template.version}`} value={`${template.templateId}@${template.version}`}>{template.name} · v{template.version}</option>)}
            </select>
            {selectedTemplate && <p className="text-xs text-muted-foreground">批次固定模板 v{selectedTemplate.version}；纳入 {(selectedTemplate.policyRefs?.length ?? selectedTemplate.policyVersionIds.length)} 个审核依据版本。</p>}
          </div>
          {selectedTemplate && (
            <ReviewV3T06BatchIntakePreview key={templateKey}
              availableCases={availableCases.map((item) => ({
                caseId: item.caseId, title: item.title, applicant: legacyById.get(item.caseId)?.applicant,
              }))}
              onApply={onApplyCaseIds} />
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label>纳入项目</Label>
              <span className="text-xs text-muted-foreground">已选 {selectedCaseIds.length} / {availableCases.length} 个</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input aria-label="搜索候选案卷" value={caseSearch} onChange={(event) => setCaseSearch(event.target.value)}
                placeholder="按标题、案卷 ID、申报人筛选" className="min-w-[170px] flex-1" />
              <Button type="button" size="sm" variant="outline" disabled={!visibleIds.length}
                onClick={() => onApplyCaseIds(selectVisibleBatchCases(selectedCaseIds, visibleIds, !allVisibleSelected))}>
                {allVisibleSelected ? '取消当前筛选' : '全选当前筛选'}（{visibleIds.length}）
              </Button>
            </div>
            <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-border/80 p-1.5">
              {visibleCases.map((item) => {
                const legacy = legacyById.get(item.caseId)
                return (
                  <label key={item.caseId} className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 hover:bg-muted/50">
                    <input type="checkbox" className="mt-0.5 accent-primary" checked={selectedCaseIds.includes(item.caseId)} onChange={() => onToggleCase(item.caseId)} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium">{item.title}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{legacy?.applicant || '未填写申报人'} · 更新于 {formatTime(item.updatedAt)}</span>
                    </span>
                  </label>
                )
              })}
              {selectedTemplate && availableCases.length === 0 && <p className="px-3 py-8 text-center text-xs text-muted-foreground">没有使用此模板版本的项目。</p>}
              {selectedTemplate && availableCases.length > 0 && visibleCases.length === 0 && <p className="px-3 py-8 text-center text-xs text-muted-foreground">当前搜索没有匹配案卷，已选的其他案卷仍保留。</p>}
              {!selectedTemplate && <p className="px-3 py-8 text-center text-xs text-muted-foreground">先选择模板，再选择要纳入的项目。</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit" disabled={!canCreate}>{creating ? '正在创建…' : '创建批次'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
