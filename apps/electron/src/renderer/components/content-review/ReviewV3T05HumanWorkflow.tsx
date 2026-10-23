/**
 * T05: Human business workflow for one existing CaseAggregateV2.
 * Renderer owns drafts and presentation only; all durable actions go through
 * existing reviewAPI commands and the Main-owned actor / revision boundary.
 */
import { humanizeReviewError } from './review-error-text'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CaseAggregateV2, ReviewCommandResult } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { getT05StageActionState, type T05StageAction as StageAction, type T05StageActionCapability } from './review-v3-t05-stage-actions'
import { ReviewV3F12SupplementCycle } from './ReviewV3F12SupplementCycle'
import { ReviewV3F13AppealHistory } from './ReviewV3F13AppealHistory'

type AppealResolution = 'maintain-original' | 'amend-original'

export interface T05AppealSubmission {
  requestId: string
  caseId: string
  expectedRevision: number
  againstDecisionId: string
  statement: string
  newEvidenceDocumentVersionIds: string[]
  /** 旧版案卷没有提交人绑定时，本机用户明确确认本地申诉人身份。 */
  confirmLocalSubmitter?: boolean
}

export interface T05AppealReview {
  requestId: string
  caseId: string
  expectedRevision: number
  appealId: string
  resolution: AppealResolution
  reason: string
  amendedResult?: 'pass' | 'partial-pass' | 'reject' | 'return' | 'withdraw'
}

/** L owns the trusted Main command registration for these two missing paths. */
export interface T05AppealPorts {
  submitAppeal?: (input: T05AppealSubmission) => Promise<ReviewCommandResult | undefined>
  reviewAppeal?: (input: T05AppealReview) => Promise<ReviewCommandResult | undefined>
  withdrawAppeal?: (input: { requestId: string; caseId: string; expectedRevision: number; appealId: string }) => Promise<ReviewCommandResult | undefined>
}

/**
 * Main-issued read projection: not an authorization token. The actual command
 * must independently resolve actor, stage, and current ReviewRun in Main.
 * Enables teacher final stages without forging a renderer actor.
 */
export interface T05TrustedStageCapability extends T05StageActionCapability {
  actorLabel: string
}

export interface T05TrustedStageCommand {
  caseId: string
  templateId: string
  version: number
  expectedRevision: number
  taskId: string
  action: StageAction
  reason: string
  supplementRequiredElements?: string[]
  supplementReason?: string
}

export interface T05TrustedStagePorts {
  stageCapability?: T05TrustedStageCapability
  /**
   * No actor or fabricated runId from the renderer. Main verifies the
   * actual Run and decides which actor can act on the task.
   */
  recordTrustedStageDecision?: (input: T05TrustedStageCommand) => Promise<ReviewCommandResult | undefined>
}

interface Props extends T05AppealPorts, T05TrustedStagePorts {
  aggregate: CaseAggregateV2
  onResult: (result: ReviewCommandResult | undefined) => void
}

const terminalSupplement = new Set(['satisfied', 'cancelled'])
const businessStatus: Record<string, string> = {
  draft: '草稿', submitted: '已提交', reviewing: '审核中',
  'awaiting-supplement': '待补件', 'awaiting-review': '待复审',
  decided: '已有决定', archived: '已归档',
}
const decisionLabel: Record<string, string> = {
  pass: '通过', 'partial-pass': '部分通过', return: '退回', reject: '驳回', withdraw: '撤回',
}

const newRequestId = (prefix: string): string =>
  prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)

const parseElements = (raw: string): string[] =>
  [...new Set(raw.split(/[\n,，;；]+/).map((value) => value.trim()).filter(Boolean))]

export function ReviewV3T05HumanWorkflow({
  aggregate, onResult, submitAppeal, reviewAppeal, withdrawAppeal,
  stageCapability, recordTrustedStageDecision,
}: Props): JSX.Element {
  const caseId = aggregate.caseV2.id
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [action, setAction] = useState<StageAction>('stage-pass')
  const [reason, setReason] = useState('')
  const [elements, setElements] = useState('')
  const [supplementReason, setSupplementReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [appealDecisionId, setAppealDecisionId] = useState('')
  const [appealStatement, setAppealStatement] = useState('')
  const [appealDocuments, setAppealDocuments] = useState<string[]>([])
  const [localSubmitterConfirmed, setLocalSubmitterConfirmed] = useState(false)
  const [appealReviewId, setAppealReviewId] = useState('')
  const [appealResolution, setAppealResolution] = useState<AppealResolution>('maintain-original')
  const [appealReason, setAppealReason] = useState('')
  const [amendedResult, setAmendedResult] = useState<T05AppealReview['amendedResult']>('pass')
  const [refreshedCapability, setRefreshedCapability] = useState<{
    caseId: string; revision: number; actorRole: 'reviewer' | 'teacher'; value: T05TrustedStageCapability
  }>()
  const [refreshingCapability, setRefreshingCapability] = useState(false)
  const [capabilityError, setCapabilityError] = useState('')
  const capabilityRequestSeq = useRef(0)
  const currentCapability = refreshedCapability?.caseId === caseId
    && refreshedCapability.revision === aggregate.caseV2.revision
    && refreshedCapability.actorRole === stageCapability?.actorRole
    ? refreshedCapability.value : stageCapability

  const openTasks = aggregate.tasks.filter((task) => task.status === 'open')
  // Main 授予的当前任务是唯一可选集合。能力读取失败时不再回退到旧 reviewer 命令。
  const eligibleTasks = currentCapability
    ? openTasks.filter((currentTask) => currentCapability.eligibleTaskIds.includes(currentTask.id)
      && currentTask.assigneeRole === currentCapability.actorRole)
    : []
  const task = eligibleTasks.find((current) => current.id === selectedTaskId) ?? eligibleTasks[0]
  const unresolvedSupplements = aggregate.supplements.filter((request) => !terminalSupplement.has(request.status))
  const effectiveDecisions = useMemo(() => {
    const overwritten = new Set(aggregate.decisions.map((decision) => decision.amendsDecisionId).filter(Boolean))
    return aggregate.decisions.filter((decision) => !overwritten.has(decision.id))
      .sort((a, b) => b.at.localeCompare(a.at))
  }, [aggregate.decisions])
  const effectiveAdjudications = useMemo(() => {
    const records = aggregate.adjudications ?? []
    const superseded = new Set(records.flatMap((record) => record.supersedesAdjudicationId ? [record.supersedesAdjudicationId] : []))
    return records.filter((record) => !superseded.has(record.id)).sort((a, b) => b.at.localeCompare(a.at))
  }, [aggregate.adjudications])
  const latestFinal = effectiveDecisions.find((decision) => decision.finality === 'final')
  const activeDocuments = aggregate.caseV2.documents.filter((document) => document.active !== false)
  const pendingAppeals = aggregate.appeals.filter((appeal) => appeal.status === 'submitted' || appeal.status === 'in-review')
  const chosenAppeal = pendingAppeals.find((appeal) => appeal.id === appealReviewId) ?? pendingAppeals[0]
  // CanonicalPlan alone is not proof of technical-only semantics: the new
  // local-business path may also own an executable Plan. Main must explicitly
  // attest that the case supports local-business stage decisions.
  const technicalPreReview = Boolean(aggregate.d2RuntimePlan
    || currentCapability?.mode === 'technical-pre-review'
    || (aggregate.canonicalPlan && currentCapability?.mode !== 'local-business'))
  const actionState = getT05StageActionState({
    capability: currentCapability,
    task,
    connected: Boolean(recordTrustedStageDecision),
    action,
    unresolvedSupplementCount: unresolvedSupplements.length,
  })
  const stageDisabled = technicalPreReview || !actionState.enabled

  useEffect(() => {
    setSelectedTaskId('')
    setReason('')
    setElements('')
    setSupplementReason('')
    setError('')
    setAppealStatement('')
    setAppealDocuments([])
    setLocalSubmitterConfirmed(false)
  }, [caseId])

  // 切案、版本写入或本地模拟角色变化后，旧的能力快照不能继续驱动按钮。
  useEffect(() => {
    capabilityRequestSeq.current += 1
    setRefreshedCapability(undefined)
    setCapabilityError('')
    setRefreshingCapability(false)
  }, [caseId, aggregate.caseV2.revision, stageCapability])

  const refreshStageCapability = async (): Promise<void> => {
    if (!stageCapability || refreshingCapability) return
    const requestSeq = ++capabilityRequestSeq.current
    setRefreshingCapability(true)
    setCapabilityError('')
    try {
      // 真实 Run 的完成不一定提高案卷 revision，允许用户主动重新读取资格。
      // 不读取/构造 actor 对象，角色依旧由 Main 从本地身份声明派生。
      const latest = await window.reviewAPI.getT05StageCapability({
        caseId, claim: { role: stageCapability.actorRole },
      }) as T05TrustedStageCapability
      if (capabilityRequestSeq.current === requestSeq) setRefreshedCapability({
        caseId, revision: aggregate.caseV2.revision, actorRole: stageCapability.actorRole, value: latest,
      })
    } catch (cause) {
      if (capabilityRequestSeq.current === requestSeq) {
        setRefreshedCapability(undefined)
        setCapabilityError(cause instanceof Error ? cause.message : String(cause))
      }
    } finally {
      if (capabilityRequestSeq.current === requestSeq) setRefreshingCapability(false)
    }
  }

  const execute = async (run: () => Promise<ReviewCommandResult | undefined>): Promise<boolean> => {
    setBusy(true)
    setError('')
    try {
      const result = await run()
      onResult(result)
      if (result && !result.ok) setError(humanizeReviewError(result.message))
      return Boolean(result?.ok)
    } catch (cause) {
      setError(humanizeReviewError(cause))
      return false
    } finally {
      setBusy(false)
    }
  }

  const decideStage = async (): Promise<void> => {
    if (!task || !reason.trim() || stageDisabled || !recordTrustedStageDecision) return
    const required = parseElements(elements)
    if (action === 'return-for-supplement' && (required.length === 0 || !supplementReason.trim())) return
    const succeeded = await execute(() => recordTrustedStageDecision({
      caseId,
      templateId: aggregate.caseV2.templateId,
      version: aggregate.caseV2.templateVersion,
      expectedRevision: aggregate.caseV2.revision,
      taskId: task.id,
      action,
      reason: reason.trim(),
      ...(action === 'return-for-supplement'
        ? { supplementRequiredElements: required, supplementReason: supplementReason.trim() }
        : {}),
    }))
    if (succeeded) { setReason(''); setElements(''); setSupplementReason('') }
  }

  return (
    <section className="space-y-3 rounded-lg border-t pt-3 text-xs">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">本地人工业务流程</h3>
          <p className="text-muted-foreground">案卷：{businessStatus[aggregate.caseV2.stage] ?? aggregate.caseV2.stage}
            {' · '}开放任务 {openTasks.length} · 未结补件 {unresolvedSupplements.length}</p>
        </div>
        <span className="rounded bg-muted px-2 py-1">本地业务操作记录</span>
      </div>
      {technicalPreReview && (
        <p className="rounded border px-2 py-1 text-amber-700 dark:text-amber-300">
          当前案卷绑定技术预审 Plan；不能据此直接进行正式阶段决定。需要本地 Agent 接入合法的本地业务阶段及受控 Run。
        </p>
      )}

      <section className="space-y-2 rounded-md bg-muted/30 p-2">
        <h4 className="font-medium">阶段待办与人工决定</h4>
        {openTasks.length > 0 && <p className="text-muted-foreground">当前任务：{openTasks.map((entry) => entry.stageId + '（第 ' + entry.round + ' 轮，' + entry.assigneeRole + '）').join('、')}</p>}
        {currentCapability && <p className="text-muted-foreground">
          当前本地操作者：{currentCapability.actorLabel}（{currentCapability.actorRole === 'teacher' ? '终审' : '初审'}），
          由 Main 判定可处理任务与审核运行。
        </p>}
        {stageCapability && <Button size="sm" variant="outline" disabled={refreshingCapability || busy}
          onClick={() => void refreshStageCapability()}>{refreshingCapability ? '正在核对…' : '重新核对阶段资格'}</Button>}
        {capabilityError && <p role="alert" className="text-destructive">资格刷新失败：{capabilityError}</p>}
        {!currentCapability && <p role="status" className="text-amber-700 dark:text-amber-300">尚未获取 Main 的当前身份与任务资格；不会通过旧式阶段命令代写决定。</p>}
        {eligibleTasks.length === 0 ? (
          <p className="text-muted-foreground">当前身份没有可操作的阶段任务。终审请切换至 Main 确认的本地终审身份；不能在界面伪造教师或校方授权。</p>
        ) : (
          <>
            <select className="w-full rounded border bg-background px-2 py-1" value={task?.id ?? ''}
              onChange={(event) => setSelectedTaskId(event.target.value)}>
              {eligibleTasks.map((entry) => <option key={entry.id} value={entry.id}>{entry.stageId} · 第 {entry.round} 轮</option>)}
            </select>
            <select className="w-full rounded border bg-background px-2 py-1" value={action}
              onChange={(event) => setAction(event.target.value as StageAction)}>
              <option value="stage-pass">本阶段通过（非最终阶段则推进下一阶段）{currentCapability?.allowedActions && !currentCapability.allowedActions.includes('stage-pass') ? ' · 当前不可用' : ''}</option>
              <option value="return-for-supplement">退回合并补件清单{currentCapability?.allowedActions && !currentCapability.allowedActions.includes('return-for-supplement') ? ' · 当前不可用' : ''}</option>
              <option value="return-to-previous-stage">退回前一阶段{currentCapability?.allowedActions && !currentCapability.allowedActions.includes('return-to-previous-stage') ? ' · 当前不可用' : ''}</option>
              <option value="final-reject">最终驳回（不自动要求补件）{currentCapability?.allowedActions && !currentCapability.allowedActions.includes('final-reject') ? ' · 当前不可用' : ''}</option>
            </select>
            <textarea className="w-full rounded border bg-background p-2" rows={2} value={reason}
              onChange={(event) => setReason(event.target.value)} placeholder="本次决定的理由（必填）" />
            {action === 'return-for-supplement' && (
              <>
                <textarea className="w-full rounded border bg-background p-2" rows={2} value={elements}
                  onChange={(event) => setElements(event.target.value)} placeholder="需要补齐的要素，每行一项（合并为一份补件清单）" />
                <textarea className="w-full rounded border bg-background p-2" rows={2} value={supplementReason}
                  onChange={(event) => setSupplementReason(event.target.value)} placeholder="向提交方公开的补件说明" />
              </>
            )}
            {actionState.reasons.length > 0 && <div role="status" className="rounded-md bg-amber-500/10 p-2 text-amber-800 dark:text-amber-200">
              <p className="font-medium">当前操作不可提交：</p>
              <ul className="list-inside list-disc space-y-1">{actionState.reasons.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>}
            {actionState.enabled && <p className="text-muted-foreground">此操作满足 Main 当前只读资格，提交时仍会重新验证身份、任务、Run 和案卷版本。</p>}
            <Button size="sm" disabled={busy || stageDisabled || !reason.trim()
              || (action === 'return-for-supplement' && (!parseElements(elements).length || !supplementReason.trim()))}
              onClick={() => void decideStage()}>记录当前阶段决定</Button>
          </>
        )}
      </section>

      <ReviewV3F12SupplementCycle aggregate={aggregate} onResult={onResult} />

      <section className="space-y-2 rounded-md bg-muted/30 p-2">
        <h4 className="font-medium">申报事项认定（{effectiveAdjudications.length} 条现存记录）</h4>
        <p className="text-muted-foreground">事项认定和案卷阶段决定是两种不同记录；单项确认不代表整案已通过。每项均保留来源 Run，材料或事实变化后仍需重审。</p>
        {aggregate.caseV2.subjects.length === 0 && <p className="text-muted-foreground">本案没有单独申报事项。</p>}
        {aggregate.caseV2.subjects.map((subject) => {
          const currentRecord = effectiveAdjudications.find((record) => record.subjectId === subject.id)
          return <div key={subject.id} className="rounded-md bg-background p-2">
            <p className="font-medium">{subject.title}：{currentRecord
              ? currentRecord.outcome === 'accepted' ? '确认' : currentRecord.outcome === 'rejected' ? '不予认定' : '人工修订'
              : '尚无人工认定'}</p>
            {currentRecord && <>
              <p>{currentRecord.reason}</p>
              <p className="text-muted-foreground">{currentRecord.actor.actorId}（{currentRecord.actor.actorSource}）
                {' · '}{new Date(currentRecord.at).toLocaleString()} · 依据运行 {currentRecord.basedOnRunId}</p>
            </>}
          </div>
        })}
      </section>

      <section className="space-y-2 rounded-md bg-muted/30 p-2">
        <h4 className="font-medium">业务决定历史（追加记录，不覆盖旧结论）</h4>
        {aggregate.decisions.length === 0 && <p className="text-muted-foreground">尚无人工业务决定。</p>}
        {[...aggregate.decisions].sort((a, b) => b.at.localeCompare(a.at)).map((decision) => (
          <div key={decision.id} className="rounded border bg-background p-2">
            <p className="font-medium">{decisionLabel[decision.result] ?? decision.result}
              {decision.finality === 'final' ? ' · 最终决定' : ' · 阶段意见'}
              {effectiveDecisions.some((current) => current.id === decision.id) ? '' : ' · 已被更正'}</p>
            <p>{decision.reason}</p>
            <p className="text-muted-foreground">{decision.actor.actorId}（{decision.actor.actorSource}）
              {' · '}{new Date(decision.at).toLocaleString()} · 阶段 {decision.stageId}
              {' · '}依据运行 {decision.basedOnRunId}</p>
          </div>
        ))}
        {latestFinal && <p>当前有效最终结论：{decisionLabel[latestFinal.result] ?? latestFinal.result}</p>}
      </section>

      <section className="space-y-2 rounded-md bg-muted/30 p-2">
        <h4 className="font-medium">异议与申诉</h4>
        <ReviewV3F13AppealHistory aggregate={aggregate} />
        <p className="font-medium">提交方申请复审</p>
        <select className="w-full rounded border bg-background px-2 py-1" value={appealDecisionId}
          onChange={(event) => setAppealDecisionId(event.target.value)}>
          <option value="">选择要申诉的业务决定</option>
          {effectiveDecisions.filter((decision) => decision.finality === 'final').map((decision) => (
            <option key={decision.id} value={decision.id}>{decisionLabel[decision.result] ?? decision.result} · {decision.id}</option>
          ))}
        </select>
        <textarea rows={2} className="w-full rounded border bg-background p-2" value={appealStatement}
          onChange={(event) => setAppealStatement(event.target.value)} placeholder="说明不同意原决定的理由" />
        <div className="flex flex-wrap gap-2">
          {activeDocuments.map((document) => (
            <label key={document.versionId} className="inline-flex items-center gap-1">
              <input type="checkbox" checked={appealDocuments.includes(document.versionId)}
                onChange={(event) => setAppealDocuments((current) => event.target.checked
                  ? [...current, document.versionId] : current.filter((id) => id !== document.versionId))} />
              {document.fileName}
            </label>
          ))}
        </div>
        {!aggregate.caseV2.submitter && (
          <label className="flex items-start gap-2 text-xs">
            <input type="checkbox" className="mt-0.5" checked={localSubmitterConfirmed}
              onChange={(event) => setLocalSubmitterConfirmed(event.target.checked)} />
            <span>这是本机案卷，我确认以本机提交方身份登记此次申诉。此操作只记录本地申诉，不证明学校账号身份。</span>
          </label>
        )}
        <Button size="sm" variant="outline" disabled={busy || !submitAppeal || aggregate.caseV2.stage !== 'decided'
          || (!aggregate.caseV2.submitter && !localSubmitterConfirmed)
          || !appealDecisionId || !appealStatement.trim()}
          onClick={() => void (async () => {
            if (!submitAppeal) return
            const ok = await execute(() => submitAppeal({
              requestId: newRequestId('t05-appeal'), caseId, expectedRevision: aggregate.caseV2.revision, againstDecisionId: appealDecisionId,
              statement: appealStatement.trim(), newEvidenceDocumentVersionIds: appealDocuments,
              confirmLocalSubmitter: localSubmitterConfirmed,
            }))
            if (ok) { setAppealStatement(''); setAppealDocuments([]); setLocalSubmitterConfirmed(false) }
          })()}>提交申诉</Button>
        {aggregate.caseV2.stage !== 'decided' && <p className="text-muted-foreground">形成最终业务决定后才能提交新申诉。</p>}
        {!submitAppeal && <p className="text-muted-foreground">申诉提交端口尚未接入可信 Main，填写内容只保存在当前表单，不会假称已提交。</p>}
        {chosenAppeal && (
          <div className="space-y-1 border-t pt-2">
            <h4 className="font-medium">本机独立角色复核</h4>
            <p className="text-muted-foreground">由 Main 已指派的本地复核角色办理；若补充了新证据，须重新完成审核后才能保存复核结论。本地复核角色。</p>
            <select className="w-full rounded border bg-background px-2 py-1" value={chosenAppeal.id}
              onChange={(event) => setAppealReviewId(event.target.value)}>
              {aggregate.appeals.filter((appeal) => appeal.status === 'submitted' || appeal.status === 'in-review').map((appeal) => (
                <option key={appeal.id} value={appeal.id}>{appeal.id} · {appeal.statement.slice(0, 40)}</option>
              ))}
            </select>
            <select className="w-full rounded border bg-background px-2 py-1" value={appealResolution}
              onChange={(event) => setAppealResolution(event.target.value as AppealResolution)}>
              <option value="maintain-original">维持原决定</option>
              <option value="amend-original">更正原决定（追加关联决定）</option>
            </select>
            {appealResolution === 'amend-original' && (
              <select className="w-full rounded border bg-background px-2 py-1" value={amendedResult}
                onChange={(event) => setAmendedResult(event.target.value as T05AppealReview['amendedResult'])}>
                <option value="pass">改为通过</option>
                <option value="partial-pass">改为部分通过</option>
                <option value="reject">改为驳回</option>
                <option value="return">改为退回</option>
                <option value="withdraw">改为撤回</option>
              </select>
            )}
            <textarea rows={2} className="w-full rounded border bg-background p-2" value={appealReason}
              onChange={(event) => setAppealReason(event.target.value)} placeholder="复核人的明确结论及依据" />
            <Button size="sm" variant="outline" disabled={busy || !reviewAppeal || !appealReason.trim()}
              onClick={() => void (async () => {
                if (!reviewAppeal) return
                const ok = await execute(() => reviewAppeal({
                  requestId: newRequestId('t05-appeal-review'), caseId, expectedRevision: aggregate.caseV2.revision, appealId: chosenAppeal.id,
                  resolution: appealResolution, reason: appealReason.trim(),
                  ...(appealResolution === 'amend-original' ? { amendedResult } : {}),
                }))
                if (ok) setAppealReason('')
              })()}>保存复核结论</Button>
            {!reviewAppeal && <p className="text-muted-foreground">复核端口需要可信教师/独立复核人身份；本地审核员不会伪装该角色。</p>}
            <Button size="sm" variant="outline" disabled={busy || !withdrawAppeal}
              onClick={() => void execute(() => withdrawAppeal!({
                requestId: newRequestId('t05-appeal-withdraw'), caseId,
                expectedRevision: aggregate.caseV2.revision, appealId: chosenAppeal.id,
              }))}>由原申诉人撤回</Button>
            {!withdrawAppeal && <p className="text-muted-foreground">撤回须由可信 Main 识别原申诉人，不允许复审人代撤回。</p>}
          </div>
        )}
      </section>
      {error && <p role="alert" className="text-destructive">{error}</p>}
    </section>
  )
}
