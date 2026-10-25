/**
 * 普通用户的单案审核入口：一次启动对应一份权威 ReviewRun。
 * 确定性规则、已发布模板计划检查、材料槽完整性与 Pi 语义检查由 Main
 * 合并到同一 Run；模板规则诊断入口不得被当成业务决定依据。
 */
import * as React from 'react'
import type { MaterialSlotSpec, ReviewBackgroundPiRunState, ReviewRunV2 } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { reviewPiProgressLabel } from './review-pi-progress-label'

interface Props {
  caseId: string
  stage: string
  documentCount: number
  technicalPlan?: boolean
  /** Enables native-V3-only persistent initial-review supplement requests. */
  nativeV3?: boolean
  canRun?: boolean
  materialSlots?: MaterialSlotSpec[]
  onUpdated: () => Promise<void>
}

const terminalStatuses = new Set(['completed', 'partially-completed', 'failed', 'stopped', 'cancelled'])

export function ReviewV3UnifiedRun({ caseId, stage, documentCount, technicalPlan, nativeV3 = false, canRun = true, materialSlots = [], onUpdated }: Props): JSX.Element {
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [supplementBusy, setSupplementBusy] = React.useState(false)
  const [piError, setPiError] = React.useState('')
  const [piState, setPiState] = React.useState<ReviewBackgroundPiRunState | null>(null)
  const [piRun, setPiRun] = React.useState<ReviewRunV2 | null>(null)
  const [runStale, setRunStale] = React.useState(false)
  // RUN-43：冷启动中断的自动续跑由 Main 失败关闭；只有用户看到拒止并显式
  // 点击“继续上次检查点（新回合）”后，才把 resumeInterrupted=true 传给同一 Run。
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
    const stale = run ? await window.reviewAPI.getWorkspaceRunValidityV2({ caseId: target, runId: run.id }) : false
    if (seq !== requestSeq.current || caseIdRef.current !== target) return
    setPiState(state)
    setPiRun(run ?? null)
    setRunStale(stale)
    if (run && terminalStatuses.has(run.status)) {
      setMessage('本轮统一审核已结束；请核对待确认项、待补件、证据和人工决定。')
      await onUpdated()
    }
  }, [caseId, onUpdated])

  React.useEffect(() => {
    requestSeq.current += 1
    setRunStale(false)
    setResumePrompt(false)
    setPiError('')
    setPiState(null)
    setPiRun(null)
    setMessage('')
  }, [caseId])

  React.useEffect(() => {
    void refresh().catch(() => { /* 尚未运行 Pi 时没有状态，不阻止第一次审核 */ })
  }, [refresh])

  React.useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      void refresh().catch((cause) => setPiError(cause instanceof Error ? cause.message : String(cause)))
    }, 2500)
    return () => clearInterval(timer)
  }, [running, refresh])

  const start = async (mode: 'update' | 'restart', resumeInterrupted = false): Promise<void> => {
    if (busy || running || !caseId) return
    if (!canRun) { setPiError('请先根据材料匹配并确认审核模板、材料分类与审核对象'); return }
    if (documentCount === 0) { setPiError('请先导入实际材料，不能审核空案卷'); return }
    setBusy(true)
    setResumePrompt(false)
    setPiError('')
    setMessage('正在校验输入并启动统一初审…')
    try {
      // 初审可在 draft 阶段发生：它不是提交或学校审批。Main 的冻结
      // 规则/材料门禁仍负责拒绝无效计划；普通缺件由本轮 Run 如实记录。
      setMessage('正在启动本案唯一的初审 Run…')
      const admitted = await window.reviewAPI.startBackgroundPiReviewV2({
        caseId, mode, ...(resumeInterrupted ? { resumeInterrupted: true } : {}),
      })
      if (admitted.caseId !== caseId || !admitted.runId) throw new Error('后台未返回本案真实审核运行')
      setPiState(admitted)
      setMessage('统一审核已受理；规则检查、材料槽状态和 Pi 语义检查将显示在同一份运行记录中。')
      await refresh()
      await onUpdated()
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : String(cause)
      setPiError(detail)
      // Main 对冷启动中断的自动续跑失败关闭；只有这里显式确认才允许新回合续交。
      if (detail.includes('继续上次检查点')) setResumePrompt(true)
      setMessage('本轮初审未正常开始，请根据原因修正后重试。')
    } finally {
      setBusy(false)
    }
  }

  const summary = piRun?.coverage
  const progressLabel = reviewPiProgressLabel(piState?.progress)
  const awaitingSupplement=piRun?.checks.filter(check=>check.status==='awaiting-supplement')??[]
  const supplementSlotIds=[...new Set(awaitingSupplement.map(check=>
    check.ruleId.startsWith('required-material-')?check.ruleId.slice('required-material-'.length):''
  ).filter(Boolean))]
  const createInitialSupplementRequests=async():Promise<number>=>{
    if(!nativeV3)throw new Error('持久初审补件请求仅适用于原生 V3 案卷')
    if(!caseId||!piRun)throw new Error('当前没有可关联的真实初审 Run')
    const result=await window.reviewAPI.openInitialReviewSupplementV3({caseId,runId:piRun.id})
    if(!result.ok)throw new Error(result.message)
    return result.entity?.length??0
  }
  const requestSupplements=async():Promise<void>=>{
    if(!nativeV3||supplementBusy||!caseId||!piRun||runStale)return
    setSupplementBusy(true);setPiError('')
    try{
      const count=await createInitialSupplementRequests()
      setMessage('已建立/复用 '+count+' 条持久补件请求。请进入本案“补件周期”逐项回复并等待人工核验；补件核结不等于审核通过。')
      await onUpdated()
    }catch(cause){setPiError(cause instanceof Error?cause.message:String(cause))}
    finally{setSupplementBusy(false)}
  }
  const addSupplement=async (slotId:string):Promise<void>=>{
    if(supplementBusy||!caseId||!piRun||runStale)return
    setSupplementBusy(true);setPiError('')
    try{
      // Native V3 records a durable request BEFORE importing. Legacy cases retain
      // their prior material-registration path and do not claim this new contract.
      if(nativeV3){
        await createInitialSupplementRequests()
        // Refresh the request before opening the picker; cancellation must not
        // leave a newly-created request invisible until a manual refresh.
        await onUpdated()
      }
      const imported=await window.reviewAPI.pickRegisterMaterialV2({
        caseId,role:'evidence',materialSlotId:slotId,
      })
      if(imported.length){
        setRunStale(true)
        setMessage(nativeV3
          ? '补件请求已持久化，原件已登记。请进入本案“补件周期”将新材料关联为回复并等待人工核验，再更新审核生成新 Run。'
          : '材料已登记。此兼容案卷未自动创建初审补件请求；如需正式补件，请使用现有业务补件流程。')
        await onUpdated()
      }else if(nativeV3){
        setMessage('补件请求已持久化；本次未选择新材料。可稍后进入本案“补件周期”提交回复。')
      }
    }catch(cause){setPiError(cause instanceof Error?cause.message:String(cause))}
    finally{setSupplementBusy(false)}
  }
  return <section aria-label="统一审核执行" className="space-y-2 rounded-lg border border-primary/30 bg-primary/[0.03] p-3 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="font-semibold">审核当前材料</p>
        <p className="text-xs text-muted-foreground">一次发起、一份权威 Run；确定性规则、模板检查和 Pi 语义审核共用同一输入快照</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={busy || running || !canRun || documentCount === 0 || stage === 'archived'} onClick={() => void start('update')}>
          {busy ? '正在启动…' : running ? '初审进行中' : piRun ? '更新审核' : '开始初审'}
        </Button>
        {resumePrompt && <Button size="sm" variant="outline" disabled={busy || running || !canRun} onClick={() => void start('update', true)}>
          继续上次检查点（新回合）
        </Button>}
        {!!piRun && <Button size="sm" variant="outline" disabled={busy || running || !canRun} onClick={() => void start('restart')}>重新审核全部</Button>}
      </div>
    </div>
    {documentCount === 0 && <p className="text-xs text-amber-700">请先把材料拖入上面的材料区，随后即可开始审核。</p>}
    {!canRun && <p className="text-xs text-amber-700">请先确认材料分类、适用模板与实际审核对象；申请件数量由模板决定。</p>}
    {message && <p role="status" className="text-xs">{message}</p>}
    {stage==='draft'&&!technicalPlan&&<p className="text-xs text-muted-foreground">本次是材料初审，不会自动正式提交、批准或作出学校决定；少量缺件可以在初审后补交。</p>}
    {piState?.runId && <p className="text-xs">统一审核：{piRun?.status ?? piState.runStatus ?? '已受理'} · <span className="font-mono">{piState.runId}</span></p>}
    {running&&progressLabel&&
      <p className="truncate text-xs text-muted-foreground" role="status" aria-live="polite">{progressLabel}</p>}
    {summary && <p className="text-xs">已完成 {summary.completedChecks}/{summary.plannedChecks} 项；待处理 {summary.pendingChecks} 项；有依据的判断 {summary.effectiveVerdicts} 项</p>}
    {piRun?.status === 'completed' && summary && (summary.pendingChecks > 0 || summary.documents.some((item) => item.status !== 'read')) &&
      <p role="status" className="text-xs text-amber-700">
        技术轮已完成，但业务未就绪：{summary.pendingChecks > 0 ? `${summary.pendingChecks} 项检查待人工确认` : ''}
        {summary.pendingChecks > 0 && summary.documents.some((item) => item.status !== 'read') ? '、' : ''}
        {summary.documents.some((item) => item.status !== 'read') ? `${summary.documents.filter((item) => item.status !== 'read').length} 份材料未读` : ''}
        。completed 仅表示本轮技术执行结束，不代表完整审核通过。
      </p>}
    {runStale&&piRun&&<p role="alert" className="text-xs text-amber-700">
      当前材料或分类已变化，旧运行 {piRun.id} 已过期；请更新审核获取对应新原件版本的结果。
    </p>}
    {awaitingSupplement.length>0&&!running&&<div className="space-y-2 rounded-md border border-amber-600/30 p-3">
      <p className="font-medium">本轮初审发现 {awaitingSupplement.length} 项待补件</p>
      {awaitingSupplement.map(check=><p key={check.checkId} className="text-xs">
        {check.reason||check.ruleId}
      </p>)}
      {nativeV3&&!runStale&&piRun&&['completed','partially-completed'].includes(piRun.status)&&supplementSlotIds.length>0&&
        <Button size="sm" variant="outline" disabled={supplementBusy} onClick={()=>void requestSupplements()}>
          {supplementBusy?'正在创建补件请求…':'建立持久补件请求'}
        </Button>}
      {!runStale&&supplementSlotIds.map(slotId=>{
        const slot=materialSlots.find(item=>item.id===slotId)
        return slot?<Button size="sm" key={slotId} variant="outline"
          disabled={supplementBusy} onClick={()=>void addSupplement(slotId)}>
          补传：{slot.name}
        </Button>:null
      })}
      <p className="text-xs text-muted-foreground">{nativeV3
        ? '系统会先创建/复用持久补件请求，再登记新原件。请进入本案补件周期提交回复并等待人工核验；补件后旧 Run 失效，必须点击“更新审核”生成新 Run。'
        : '补件文件会按当前槽位登记；此兼容案卷仍使用原有业务补件流程。材料变化后旧 Run 失效，必须重新审核。'}</p>
    </div>}
    {summary && summary.documents.some((item) => item.status !== 'read') &&
      <p role="alert" className="text-xs text-red-600">有 {summary.documents.filter((item) => item.status !== 'read').length} 份材料尚未确认读取成功；本轮结果不可视为完整审核。</p>}
    {piError && <p role="alert" className="text-xs text-red-600">审核未完成：{piError}</p>}
    <Button size="sm" variant="ghost" disabled={busy || !caseId} onClick={() => void refresh().catch((cause) => setPiError(cause instanceof Error ? cause.message : String(cause)))}>刷新审核进度和结果</Button>
  </section>
}
