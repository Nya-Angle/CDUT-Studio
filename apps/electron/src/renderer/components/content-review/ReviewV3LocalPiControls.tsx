/** Real local Pi/ReviewRun visibility for the native V3 workbench.
 * Display Main's existing persisted Run, not a fabricated progress or approval.
 */
import * as React from 'react'
import type { ReviewBackgroundPiRunState, ReviewRunV2 } from '@profer/shared'
import { projectF09RunLifecycle } from './review-v3-f09-run-lifecycle'

const statusName: Record<string,string> = {
  compliant:'符合', 'non-compliant':'不符合',
  'awaiting-supplement':'待补材料', 'awaiting-confirmation':'待人工确认',
  'not-applicable':'不适用','not-executed':'尚未执行',
  'execution-failed':'执行失败',
}
const button='rounded border border-border px-3 py-1 text-sm disabled:opacity-40'

export function ReviewV3LocalPiControls({caseId}:{caseId:string}):React.ReactElement {
  const [state,setState]=React.useState<ReviewBackgroundPiRunState|null>(null)
  const [run,setRun]=React.useState<ReviewRunV2|null>(null)
  const [history,setHistory]=React.useState<ReviewRunV2[]>([])
  const [inspectedRunId,setInspectedRunId]=React.useState('')
  const [busy,setBusy]=React.useState(false)
  const [error,setError]=React.useState('')
  const [notice,setNotice]=React.useState('')
  const [showAll,setShowAll]=React.useState(false)
  const [runStale,setRunStale]=React.useState<boolean|null>(null)
  const generation=React.useRef(0)
  const refreshSequence=React.useRef(0)

  const refresh=React.useCallback(async():Promise<void>=>{
    if(!caseId)return
    const currentGeneration=generation.current
    const currentRequest=++refreshSequence.current
    const [next,runs]=await Promise.all([
      window.reviewAPI.getBackgroundPiReviewStateV2(caseId),
      window.reviewAPI.listRunsV2(caseId),
    ])
    if(next.caseId!==caseId)throw new Error('MAIN_PI_CASE_SCOPE_MISMATCH')
    const actual=next.runId
      ? await window.reviewAPI.getRunV2(caseId,next.runId) : undefined
    if(actual&&(actual.caseId!==caseId||actual.id!==next.runId))
      throw new Error('MAIN_PI_PERSISTED_RUN_SCOPE_MISMATCH')
    // 是否过期由 Main 对当前聚合与 Run 的真实输入版本判断，界面不自算哈希。
    let stale:boolean|null=null
    let validityError=''
    if(actual&&!['queued','running'].includes(actual.status)){
      try{stale=await window.reviewAPI.getWorkspaceRunValidityV2({caseId,runId:actual.id})}
      catch(e){validityError=`无法核验 Run 输入版本：${e instanceof Error?e.message:String(e)}`}
    }
    // 较早一轮慢查询不能覆盖后发的停止/恢复回执或另一轮刷新。
    if(currentGeneration!==generation.current||currentRequest!==refreshSequence.current)return
    setState(next)
    setRun(actual??null)
    setRunStale(stale)
    setHistory(runs.filter(item=>item.caseId===caseId))
    setError(previous=>validityError||(previous.startsWith('无法核验 Run 输入版本')?'':previous))
  },[caseId])

  React.useEffect(()=>{
    generation.current+=1
    let live=true
    setState(null);setRun(null);setHistory([]);setInspectedRunId('');setShowAll(false);setError('');setNotice('');setRunStale(null)
    if(!caseId)return()=>{live=false;generation.current+=1}
    void refresh().catch(e=>{
      if(live)setError(e instanceof Error?e.message:String(e))
    })
    return()=>{live=false;generation.current+=1}
  },[caseId,refresh])

  React.useEffect(()=>{
    if(!caseId||!['running','queued','awaiting-input','awaiting-decision'].includes(state?.runStatus??''))return
    let active=true
    const timer=setInterval(()=>{
      if(!active||busy)return
      void refresh().catch(e=>{
        if(active)setError(e instanceof Error?e.message:String(e))
      })
    },2500)
    return()=>{active=false;clearInterval(timer)}
  },[caseId,state?.runStatus,refresh,busy])

  const execute=async(kind:'start'|'restart'|'stop'|'refresh'):Promise<void>=>{
    if(!caseId||busy)return
    setBusy(true);setError('');setNotice('')
    try{
      if(kind==='start'||kind==='restart'){
        setInspectedRunId('')
        const next=await window.reviewAPI.startBackgroundPiReviewV2({
          caseId,...(kind==='restart'?{mode:'restart' as const}:{})
        })
        if(next.caseId!==caseId)throw new Error('MAIN_PI_START_CASE_SCOPE_MISMATCH')
        setNotice(kind==='restart'?'已重新创建独立审核会话并启动新一轮完整 Pi 检查；旧 Run 保留在历史列表':
          '已提交真实 Pi 审核；下方显示 Main 持久运行记录')
      }else if(kind==='stop'){
        if(!state?.runId)throw new Error('没有 Main 当前 Run ID，不能停止未知运行')
        const next=await window.reviewAPI.stopBackgroundPiReviewV2({caseId,runId:state.runId})
        if(next.caseId!==caseId)throw new Error('MAIN_PI_STOP_CASE_SCOPE_MISMATCH')
        setNotice('Main 已受理停止；下方显示实际持久状态')
      }else setNotice('已重新读取最新 Main Run 账本')
      await refresh()
    }catch(e){setError(e instanceof Error?e.message:String(e))}
    finally{setBusy(false)}
  }
  const viewed=inspectedRunId?history.find(item=>item.id===inspectedRunId)??run:run
  const lifecycle=projectF09RunLifecycle(state,run,runStale)
  const items=viewed?.checks??[]
  const opinions=viewed?.opinions??[]
  const shown=showAll?items:items.slice(0,30)
  return <section className="space-y-3 rounded border border-border p-3" data-testid="review-v3-local-pi-ledger">
    <h3 className="text-sm font-semibold">真实 Pi 后台审核与结果账本</h3>
    <p className="text-xs text-muted-foreground">使用已存在的 Main Pi/ReviewRun 持久存储。案卷需要具备可执行模板、申报事项、材料及有效模型配置。运行结果供审核人员核验与办理使用。</p>
    <p className="break-all text-xs">案卷：{caseId||'尚未选择'} · 阶段：{state?.phase??'未读取'}
      {' · '}Run：{state?.runId??'未创建'}
      {' · '}状态：{run?.status??state?.runStatus??'未取得'}</p>
    <div className="space-y-1.5 rounded-lg bg-muted/50 p-3 text-xs" data-testid="review-v3-f09-lifecycle">
      <p className="font-semibold">{lifecycle.title}</p>
      <p>{lifecycle.explanation}</p>
      <p className="text-muted-foreground">下一步：{lifecycle.nextStep}</p>
      {lifecycle.coverage.planned>0&&<div className="space-y-1">
        <div className="flex justify-between text-muted-foreground">
          <span>持久化检查覆盖：{lifecycle.coverage.completed}/{lifecycle.coverage.planned}；待处理 {lifecycle.coverage.pending}</span>
          <span>{lifecycle.coverage.percent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border" role="progressbar"
          aria-label="已完成的计划检查占比" aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={lifecycle.coverage.percent??0}>
          <div className="h-full rounded-full bg-primary transition-[width]" style={{width:`${lifecycle.coverage.percent??0}%`}} />
        </div>
      </div>}
      {runStale===true&&<p className="text-amber-700 dark:text-amber-400">当前 Run 对案卷最新输入已过期；历史检查不可直接当作新版本结论。</p>}
    </div>
    <div className="flex flex-wrap gap-2">
      <button type="button" className={button} disabled={!caseId||busy||!lifecycle.canStart}
        onClick={()=>void execute('start')}>{lifecycle.startLabel}</button>
      <button type="button" className={button} disabled={!caseId||busy||!lifecycle.canStart}
        onClick={()=>void execute('restart')}>重新审核全部材料（新 Run）</button>
      <button type="button" className={button} disabled={!caseId||busy||!state?.runId||!lifecycle.canStop}
        onClick={()=>void execute('stop')}>停止当前 Run</button>
      <button type="button" className={button} disabled={!caseId||busy}
        onClick={()=>void execute('refresh')}>刷新运行与检查结果</button>
    </div>
    {history.length>0&&<label className="block space-y-1 text-xs">
      <span>查看本案历史运行（实时刷新保留，选择不会改变 Main 当前运行）</span>
      <select className="w-full rounded border border-border bg-background p-2"
        value={inspectedRunId} onChange={e=>{setInspectedRunId(e.target.value);setShowAll(false)}}>
        <option value="">当前最新运行{state?.runId?' · '+state.runId:''}</option>
        {history.map(item=><option key={item.id} value={item.id}>
          {item.startedAt} · {item.status} · {item.id} · 检查 {item.coverage.completedChecks}/{item.coverage.plannedChecks}
        </option>)}
      </select>
    </label>}
    {viewed&&<div className="space-y-3 rounded border border-border/70 p-3">
      <p className="text-sm font-medium">真实运行 {viewed.id} · 模板 {viewed.templateId}@{viewed.templateVersion}</p>
      <p className="text-xs">检查计划 {viewed.coverage.plannedChecks} 项 · 已完成 {viewed.coverage.completedChecks} 项
        {' · '}有效判断 {viewed.coverage.effectiveVerdicts} 项 · 待处理 {viewed.coverage.pendingChecks} 项
        {' · '}模型意见 {opinions.length} 条</p>
      {viewed.error&&<p role="alert" className="text-xs text-red-600">执行异常：{viewed.error}</p>}
      {items.length===0?<p className="text-xs text-muted-foreground">Main 当前未持久化检查结果；执行中或待补充材料。</p>:
        <div className="space-y-2">
          <h4 className="text-sm font-medium">逐项检查结果（来自 Run 账本）</h4>
          {shown.map((item,index)=><div key={item.checkId+'-'+index}
              className="rounded border border-border/70 p-2 text-xs">
            <div className="font-medium">{item.checkId} · {statusName[item.status]??item.status}
              {' · '}{item.executedBy}</div>
            <p className="mt-1 whitespace-pre-wrap">{item.reason||'无说明'}</p>
            {item.sourceRefs.length>0&&<p className="mt-1 break-all text-muted-foreground">
              原件来源：{item.sourceRefs.map(s=>s.documentVersionId).join('、')}
            </p>}
            {Boolean(item.calculation?.detailLines?.length)&&<p className="mt-1 whitespace-pre-wrap">
              {item.calculation?.detailLines?.join('；')}
            </p>}
          </div>)}
          {items.length>30&&<button type="button" className={button}
            onClick={()=>setShowAll(x=>!x)}>{showAll?'只看前 30 项':`展开全部 ${items.length} 项`}</button>}
        </div>}
      {opinions.length>0&&<details className="text-xs">
        <summary className="cursor-pointer font-medium">模型意见与待人工处理项（{opinions.length}）</summary>
        <div className="mt-2 space-y-2">{opinions.map(item=><div key={item.id}
          className="rounded border border-border/70 p-2">
          <p className="font-medium">{item.title} · {item.verification}</p>
          <p className="mt-1 whitespace-pre-wrap">{item.detail}</p>
          <p className="mt-1 text-muted-foreground">{item.suggestionText}</p>
        </div>)}</div>
      </details>}
      <p className="text-xs text-muted-foreground">原件和案卷的后续人工复核、历史回执及报告导出请使用同一案卷工作台；本视图不另写 Decision。</p>
    </div>}
    {notice&&<p role="status" className="text-xs">{notice}</p>}
    {error&&<p role="alert" className="text-xs text-red-600">{error}</p>}
  </section>
}
