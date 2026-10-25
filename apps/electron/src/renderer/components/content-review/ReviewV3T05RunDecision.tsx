/**
 * T05: Adjudicate an existing, current ReviewRunV2.
 * All writes are dispatched to the existing Main-owned case transaction APIs.
 * No local shadow state, no agent/school impersonation, no synthetic Run.
 */
import { useEffect, useMemo, useState } from 'react'
import type { CaseAggregateV2, ReviewCommandResult, ReviewRunV2 } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'

type Disposition = 'confirmed-issue' | 'human-confirmed-compliant' | 'false-positive' | 'supplement-requested' | 'waived' | 'escalated'
type CaseDecision = 'pass' | 'partial-pass' | 'return' | 'reject'
type SubjectOutcome = 'accepted' | 'rejected'
type BusinessMode = 'local-business' | 'technical-pre-review' | 'unknown'

/**
 * Main 的只读能力投影。当前运行字段按可选处理：Preload/Main 未暴露时停止写入，
 * 不用历史 Run 或渲染层猜测补位；业务模式由 Main 依据持久化确认判定。
 */
interface T05RunAuthorityProjection {
  mode?: 'local-business' | 'technical-pre-review'
  hasCurrentRun?: boolean
  currentRunId?: string
  currentRunReason?: string
}

const reviewer = { actorId: 'local-user', actorSource: 'local' as const, role: 'reviewer' as const }
const rid = (): string => 't05-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
const elementsFrom = (text: string): string[] => [...new Set(text.split(/[\n,，;；]+/).map((x) => x.trim()).filter(Boolean))]
const runAuthorityReason = (reason: string | undefined): string => {
  if (!reason || reason === 'latest-attempt-current') return ''
  const labels: Record<string, string> = {
    'no-business-run': '尚无业务审核运行',
    'latest-attempt-in-progress': '最新审核仍在执行',
    'latest-attempt-not-current': '最新审核与当前原件或计划不一致',
    'latest-attempt-failed': '最新审核执行失败',
    'latest-attempt-cancelled': '最新审核已取消',
  }
  return labels[reason] ?? reason
}

export function ReviewV3T05RunDecision({
  aggregate, onResult,
}: {
  aggregate: CaseAggregateV2
  onResult: (result: ReviewCommandResult | undefined) => void
}): JSX.Element {
  const caseId = aggregate.caseV2.id
  const [runs, setRuns] = useState<ReviewRunV2[]>([])
  const [runId, setRunId] = useState('')
  const [currentRunId, setCurrentRunId] = useState('')
  const [runAuthorityNote, setRunAuthorityNote] = useState('')
  const [businessMode, setBusinessMode] = useState<BusinessMode>('unknown')
  const [stale, setStale] = useState(true)
  const [findingKey, setFindingKey] = useState('')
  const [disposition, setDisposition] = useState<Disposition>('confirmed-issue')
  const [findingReason, setFindingReason] = useState('')
  const [requirements, setRequirements] = useState('')
  const [supplementReason, setSupplementReason] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [subjectOutcome, setSubjectOutcome] = useState<SubjectOutcome>('accepted')
  const [subjectReason, setSubjectReason] = useState('')
  const [caseDecision, setCaseDecision] = useState<CaseDecision>('pass')
  const [decisionReason, setDecisionReason] = useState('')
  const [decisionElements, setDecisionElements] = useState('')
  const [decisionSupplementReason, setDecisionSupplementReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setRuns([])
    setRunId('')
    setCurrentRunId('')
    setRunAuthorityNote('')
    setBusinessMode('unknown')
    setError('')
    // RUN-14：写入只允许 Main 判定的当前权威业务 Run；历史 Run 保留只读展示。
    // 业务模式同样以 Main 为准：CanonicalPlan 只有在持久化本地业务确认匹配时才不是技术预审。
    void Promise.allSettled([
      window.reviewAPI.listRunsV2(caseId),
      window.reviewAPI.getT05StageCapability({ caseId }),
    ] as const).then(([runsResult, capabilityResult]) => {
      if (!active) return
      const completed = runsResult.status === 'fulfilled'
        ? runsResult.value.filter((run) => run.status === 'completed' || run.status === 'partially-completed')
        : []
      setRuns(completed)
      if (runsResult.status === 'rejected') {
        setError(runsResult.reason instanceof Error ? runsResult.reason.message : String(runsResult.reason))
      }
      if (capabilityResult.status === 'rejected') {
        setRunAuthorityNote('未能读取 Main 的当前运行与业务模式；已停止写入，历史运行只读。')
        return
      }
      const capability: T05RunAuthorityProjection = capabilityResult.value
      const mode = capability.mode
      setBusinessMode(mode === 'local-business' || mode === 'technical-pre-review' ? mode : 'unknown')
      if (runsResult.status === 'rejected') {
        setRunAuthorityNote('无法读取已完成运行；已停止写入，请刷新后重试。')
        return
      }
      const currentId = capability.currentRunId ?? ''
      const hasCompletedCurrent = Boolean(currentId) && completed.some((run) => run.id === currentId)
      setCurrentRunId(currentId)
      setRunId(hasCompletedCurrent ? currentId : '')
      const reason = runAuthorityReason(capability.currentRunReason?.trim())
      setRunAuthorityNote(currentId
        ? hasCompletedCurrent ? '' : `当前权威运行 ${currentId} 尚未完成或不可核定${reason ? `（${reason}）` : ''}；历史运行只读，请先完成本次审核。`
        : capability.hasCurrentRun
          ? 'Main 报告存在当前权威运行，但未提供可写入的运行标识；已停止写入，历史运行只读。'
          : `当前没有可办理的权威审核运行${reason ? `（${reason}）` : ''}；历史运行只读，请先完成最新一轮审核。`)
    })
    return () => { active = false }
  }, [caseId, aggregate.caseV2.revision])

  useEffect(() => {
    let active = true
    if (!runId) { setStale(true); return }
    void window.reviewAPI.getWorkspaceRunValidityV2({ caseId, runId }).then((isStale) => {
      if (active) setStale(isStale)
    }).catch(() => { if (active) setStale(true) })
    return () => { active = false }
  }, [caseId, runId, aggregate.caseV2.revision])

  const run = runs.find((candidate) => candidate.id === runId)
  const inputHash = run?.inputManifest.hash
  const findings = useMemo(() => {
    if (!run) return []
    const distinct = new Map<string, { key: string; title: string; status: string }>()
    for (const check of run.checks) {
      const item = check as { checkId?: string; ruleId?: string; status?: string; reason?: string }
      const key = item.checkId ?? item.ruleId
      if (key) distinct.set(key, { key, title: item.reason ?? key, status: item.status ?? 'unknown' })
    }
    for (const opinion of run.opinions) {
      const item = opinion as { id?: string; checkId?: string; text?: string }
      const key = item.id ?? item.checkId
      if (key && !distinct.has(key)) distinct.set(key, { key, title: item.text ?? key, status: 'opinion' })
    }
    return [...distinct.values()]
  }, [run])
  const selectedFinding = findings.find((entry) => entry.key === findingKey) ?? findings[0]
  const selectedSubject = aggregate.caseV2.subjects.find((entry) => entry.id === subjectId) ?? aggregate.caseV2.subjects[0]
  const isTechnicalOnly = businessMode === 'technical-pre-review'
  const stageManaged = aggregate.tasks.length > 0
  const reviewable = Boolean(run && inputHash && !stale && !busy)
  const canDecide = reviewable && businessMode === 'local-business' && !stageManaged
    && aggregate.caseV2.stage !== 'decided' && aggregate.caseV2.stage !== 'archived'

  const send = async (fn: () => Promise<ReviewCommandResult | undefined>): Promise<boolean> => {
    setBusy(true)
    setError('')
    try {
      const result = await fn()
      onResult(result)
      if (result && !result.ok) setError(result.message)
      return Boolean(result?.ok)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
      return false
    } finally {
      setBusy(false)
    }
  }

  const command = (type: string, payload: Record<string, unknown>): {
    requestId: string
    target: { kind: 'case'; id: string }
    expectedRevision: number
    actor: typeof reviewer
    type: string
    payload: Record<string, unknown>
  } => ({
    requestId: rid(),
    target: { kind: 'case', id: caseId },
    expectedRevision: aggregate.caseV2.revision,
    actor: reviewer, type, payload,
  })

  return (
    <section className="space-y-2 rounded-lg border-t pt-3 text-xs">
      <h3 className="text-sm font-semibold">本次运行的人工核定</h3>
      <p className="text-muted-foreground">针对真实 Run 记录待办、补件、事项认定和本地决定。技术运行完成仅表示运行结束，检查结论以实际结果为准。</p>
      {runs.length === 0 ? (
        <p className="text-muted-foreground">尚无已完成的可核定 ReviewRun。先完成当前案卷审核。</p>
      ) : runs.some((entry) => entry.id === currentRunId) ? (
        <select className="w-full rounded border bg-background p-2" value={runId}
          onChange={(event) => setRunId(event.target.value)}>
          {runs.filter((entry) => entry.id === currentRunId).map((entry) => <option key={entry.id} value={entry.id}>{entry.id} · {entry.status}</option>)}
        </select>
      ) : (
        <p className="text-muted-foreground">当前没有可办理的权威审核运行；历史运行只读，请先完成最新一轮审核。</p>
      )}
      {runAuthorityNote && <p role="status" className="text-amber-700 dark:text-amber-300">{runAuthorityNote}</p>}
      {runs.some((entry) => entry.id !== currentRunId) && (
        <p className="text-muted-foreground">历史运行 {runs.filter((entry) => entry.id !== currentRunId).length} 条：只读，不可写入处置/认定。</p>
      )}
      {run && stale && <p className="rounded border px-2 py-1 text-amber-700 dark:text-amber-300">当前运行的输入已变化或来源失效，请先重新审核，不可用旧 Run 写入人工决定。</p>}
      {run && !stale && (
        <div className="space-y-2">
          <section className="space-y-1 rounded-md bg-muted/30 p-2">
            <h4 className="font-medium">检查项人工处置</h4>
            <select className="w-full rounded border bg-background px-2 py-1" value={selectedFinding?.key ?? ''}
              onChange={(event) => setFindingKey(event.target.value)}>
              {findings.map((item) => <option key={item.key} value={item.key}>{item.key} · {item.status}</option>)}
            </select>
            {selectedFinding && <p className="text-muted-foreground">{selectedFinding.title}</p>}
            <select className="w-full rounded border bg-background px-2 py-1" value={disposition}
              onChange={(event) => setDisposition(event.target.value as Disposition)}>
              <option value="confirmed-issue">确认问题属实</option>
              <option value="human-confirmed-compliant">人工确认符合</option>
              <option value="false-positive">AI 误报</option>
              <option value="supplement-requested">待补件（同时创建补件）</option>
              <option value="waived">按授权依据豁免</option>
              <option value="escalated">升级复核</option>
            </select>
            <textarea className="w-full rounded border bg-background p-2" rows={2}
              placeholder="说明人工认定理由，误报/豁免需说明事实或适用依据"
              value={findingReason} onChange={(event) => setFindingReason(event.target.value)} />
            {disposition === 'supplement-requested' && (
              <>
                <textarea className="w-full rounded border bg-background p-2" rows={2} value={requirements}
                  onChange={(event) => setRequirements(event.target.value)} placeholder="需要补交的具体要素（每行一项）" />
                <textarea className="w-full rounded border bg-background p-2" rows={2} value={supplementReason}
                  onChange={(event) => setSupplementReason(event.target.value)} placeholder="给提交方看的补件要求" />
              </>
            )}
            <Button size="sm" variant="outline"
              disabled={!reviewable || !selectedFinding || !findingReason.trim()
                || (disposition === 'supplement-requested' && (!elementsFrom(requirements).length || !supplementReason.trim()))}
              onClick={() => void (async () => {
                if (!run || !inputHash || !selectedFinding) return
                const ok = await send(() => disposition === 'supplement-requested'
                  ? window.reviewAPI.openWorkspaceSupplementV2({
                    caseId, command: command('OpenWorkspaceSupplement', {
                      findingKey: selectedFinding.key, runId, inputHash,
                      requiredElements: elementsFrom(requirements), reason: supplementReason.trim(),
                    }),
                  })
                  : window.reviewAPI.recordWorkspaceDispositionV2({
                    caseId, command: command('RecordWorkspaceFindingDisposition', {
                      findingKey: selectedFinding.key, disposition, reason: findingReason.trim(), runId, inputHash,
                    }),
                  }))
                if (ok) { setFindingReason(''); setRequirements(''); setSupplementReason('') }
              })()}>保存待办处理</Button>
          </section>

          {aggregate.caseV2.subjects.length > 0 && (
            <section className="space-y-1 rounded-md bg-muted/30 p-2">
              <h4 className="font-medium">申报事项人工认定</h4>
              <select className="w-full rounded border bg-background px-2 py-1" value={selectedSubject?.id ?? ''}
                onChange={(event) => setSubjectId(event.target.value)}>
                {aggregate.caseV2.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.title}</option>)}
              </select>
              <select className="w-full rounded border bg-background px-2 py-1" value={subjectOutcome}
                onChange={(event) => setSubjectOutcome(event.target.value as SubjectOutcome)}>
                <option value="accepted">确认此事项</option>
                <option value="rejected">不予认定此事项</option>
              </select>
              <textarea className="w-full rounded border bg-background p-2" rows={2}
                placeholder="认定理由及查阅的证据" value={subjectReason} onChange={(event) => setSubjectReason(event.target.value)} />
              <Button size="sm" variant="outline" disabled={!reviewable || !selectedSubject || !subjectReason.trim()}
                onClick={() => void (async () => {
                  if (!selectedSubject || !inputHash) return
                  const ok = await send(() => window.reviewAPI.recordWorkspaceSubjectAdjudicationV2({
                    caseId,
                    command: command('RecordWorkspaceSubjectAdjudication', {
                      subjectId: selectedSubject.id, outcome: subjectOutcome,
                      reason: subjectReason.trim(), runId, inputHash,
                    }),
                  }))
                  if (ok) setSubjectReason('')
                })()}>保存事项认定</Button>
            </section>
          )}

          <section className="space-y-1 rounded-md bg-muted/30 p-2">
            <h4 className="font-medium">案卷层面的本地最终决定</h4>
            {stageManaged && <p className="text-muted-foreground">本案已有阶段任务，必须通过阶段流程形成终审；不能与案卷快捷最终决定混用。</p>}
            {businessMode === 'local-business' && aggregate.canonicalPlan && (
              <p className="text-muted-foreground">Main 已依据与当前计划指纹匹配的持久化本地业务确认判定为本地业务；该确认仅代表本机试办，不是学校授权。</p>
            )}
            {isTechnicalOnly && <p className="text-amber-700 dark:text-amber-300">
              Main 当前判定本案为技术预审（例如 D2 预审，或 CanonicalPlan 尚无匹配的本地业务发布确认），不能直接作出正式决定；请先按受控 V3 本地阶段流程办理。
            </p>}
            <select className="w-full rounded border bg-background px-2 py-1" value={caseDecision}
              onChange={(event) => setCaseDecision(event.target.value as CaseDecision)}>
              <option value="pass">通过</option>
              <option value="partial-pass">部分通过</option>
              <option value="return">退回补件</option>
              <option value="reject">驳回（不自动补件）</option>
            </select>
            <textarea className="w-full rounded border bg-background p-2" rows={2}
              placeholder="本地最终决定理由，必须基于当前真实 Run 和已处理的事项"
              value={decisionReason} onChange={(event) => setDecisionReason(event.target.value)} />
            {caseDecision === 'return' && (
              <>
                <textarea className="w-full rounded border bg-background p-2" rows={2}
                  placeholder="补件要素，每行一项" value={decisionElements} onChange={(event) => setDecisionElements(event.target.value)} />
                <textarea className="w-full rounded border bg-background p-2" rows={2}
                  placeholder="给提交方的补件理由" value={decisionSupplementReason}
                  onChange={(event) => setDecisionSupplementReason(event.target.value)} />
              </>
            )}
            <Button size="sm" disabled={!canDecide || !decisionReason.trim()
              || (caseDecision === 'return' && (!elementsFrom(decisionElements).length || !decisionSupplementReason.trim()))}
              onClick={() => void (async () => {
                if (!run || !inputHash) return
                const ok = await send(() => window.reviewAPI.decideWorkspaceCaseV2({
                  caseId,
                  command: command('RecordWorkspaceBusinessDecision', {
                    result: caseDecision, reason: decisionReason.trim(),
                    basedOnRunId: runId, inputHash,
                    ...(caseDecision === 'return'
                      ? { requiredElements: elementsFrom(decisionElements), supplementReason: decisionSupplementReason.trim() }
                      : {}),
                  }),
                }))
                if (ok) { setDecisionReason(''); setDecisionElements(''); setDecisionSupplementReason('') }
              })()}>提交本地业务决定</Button>
            <p className="text-muted-foreground">Main 会再次检查当前输入、事项认定、补件与来源；如仍有阻断项会明确拒绝，不会通过隐藏检查项伪造通过。</p>
          </section>
        </div>
      )}
      {error && <p role="alert" className="text-destructive">{error}</p>}
    </section>
  )
}
