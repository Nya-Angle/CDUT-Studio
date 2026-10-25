/** 统一模板路由：同一原生案卷，50套D4或公共兜底B1 -> 原有 Pi 可执行计划。 */
import * as React from 'react'
import { filterTemplateCatalog, type TemplateDeepMatchCandidate } from '@profer/shared'
import type { D4ClientSelection } from '@profer/shared'
import type { C11MainLocalProductRead } from '../../../main/lib/review/review-v3-main-local-product-intake'
import type { B29UnmatchedAuthorDraft } from '../../../main/lib/review/review-v3-b3-unmatched-author-bootstrap'
import { D4CaseSetup } from './D4CaseSetup'
import { useAdvancedReviewOptions } from './ReviewAdvancedOptionsToggle'
import { humanizeReviewError } from './review-error-text'
import { draftT01FromBrief, type T01BriefDraft } from './review-v3-t01-brief-authoring'
import { draftT01ViaAuthorizedModel } from './review-v3-t01-model-draft-port'
import { executableFallbackAuthor, proposedFallbackChecks, proposedFallbackReviewMatter } from './review-v3-fallback-executable-plan'
import { F06_REQUIRED_CHECKS } from '../../../main/lib/review/review-v3-f06-generic-contract'

export interface ReviewV3InstalledPlan {
  caseId:string;templateId:string;templateVersion:number;checks:number;fingerprint:string
}
export interface ReviewV3TemplateRoutingAssistantProps {
  caseId:string
  /** 安装的是当前案卷真实Pi技术计划，启动Pi由统一主流程控制。 */
  onPlanInstalled?:(plan:ReviewV3InstalledPlan)=>void
  /** 本机已发布模板沿用既有非D2路径，不能伪造D2 Plan回执。 */
  onTemplateBound?:(choice:{caseId:string;templateId:string;templateVersion:number})=>void
}
type Step='catalog'|'fallback'
const action='rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40'
const secondary='rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-40'

type UnifiedRouteCandidate = {
  templateId:string;templateVersion:string;name:string;confidence:number;reason:string;
  matchedSignals:string[];source:'规则匹配'|'AI 深度匹配'|'规则 + AI'
}
function mergeUnifiedRouteCandidates(
  ruleCandidates:C11MainLocalProductRead['routeCandidates'],
  modelCandidates:Array<TemplateDeepMatchCandidate & {name:string}>,
):UnifiedRouteCandidate[] {
  const merged=new Map<string,UnifiedRouteCandidate>()
  for(const candidate of ruleCandidates){
    const key=candidate.templateId+'@'+candidate.templateVersion
    merged.set(key,{
      templateId:candidate.templateId,templateVersion:candidate.templateVersion,name:candidate.name,
      confidence:candidate.confidence,reason:candidate.evidence,
      matchedSignals:candidate.matchedSignals,source:'规则匹配',
    })
  }
  for(const candidate of modelCandidates){
    const key=candidate.templateId+'@'+candidate.templateVersion
    const prior=merged.get(key)
    merged.set(key,prior?{
      ...prior,confidence:Math.max(prior.confidence,candidate.confidence),
      reason:prior.reason+'；AI 深度匹配：'+candidate.reason,
      source:'规则 + AI',
    }:{
      templateId:candidate.templateId,templateVersion:candidate.templateVersion,name:candidate.name,
      confidence:candidate.confidence,reason:candidate.reason,matchedSignals:[],source:'AI 深度匹配',
    })
  }
  return [...merged.values()].sort((a,b)=>b.confidence-a.confidence||
    b.matchedSignals.length-a.matchedSignals.length||
    a.templateId.localeCompare(b.templateId)||a.templateVersion.localeCompare(b.templateVersion))
}

export function ReviewV3TemplateRoutingAssistant({caseId,onPlanInstalled,onTemplateBound}:ReviewV3TemplateRoutingAssistantProps):React.ReactElement {
  const [read,setRead]=React.useState<C11MainLocalProductRead|null>(null)
  const [mode,setMode]=React.useState<Step>('catalog')
  /** 手动选择模板默认折叠：未点击前不铺开目录卡片。 */
  const [manualOpen,setManualOpen]=React.useState(false)
  /** 公共兜底/自动起草、对象条件与高级 JSON 只在开启高级选项时出现。 */
  const { show: advancedOptions } = useAdvancedReviewOptions()
  const [selection,setSelection]=React.useState<D4ClientSelection|undefined>()
  const [preferred,setPreferred]=React.useState('')
  const [busy,setBusy]=React.useState(false)
  const [message,setMessage]=React.useState('')
  const [error,setError]=React.useState('')
  const [installed,setInstalled]=React.useState<ReviewV3InstalledPlan|null>(null)
  const [brief,setBrief]=React.useState('')
  const [reviewMatter,setReviewMatter]=React.useState('')
  const [proposal,setProposal]=React.useState<T01BriefDraft|null>(null)
  const [prepared,setPrepared]=React.useState<B29UnmatchedAuthorDraft|null>(null)
  const [requirements,setRequirements]=React.useState('')
  const [confirmed,setConfirmed]=React.useState(false)
  const [modelInfo,setModelInfo]=React.useState('')
  const [modelRouteNote,setModelRouteNote]=React.useState('')
  const [catalogQuery,setCatalogQuery]=React.useState('')
  const [modelCandidates,setModelCandidates]=React.useState<Array<TemplateDeepMatchCandidate & {name:string}>>([])
  const [modelResultSessionKey,setModelResultSessionKey]=React.useState<string|null>(null)
  const [modelMatchState,setModelMatchState]=React.useState<'idle'|'matching'|'matched'|'out-of-scope'|'uncertain'|'failed'>('idle')
  const modelAttemptRef=React.useRef('')
  const choiceInFlightRef=React.useRef(false)
  const routeAutoChoiceRef=React.useRef('')
  const routeRefreshInFlight=React.useRef(false)
  const applyChoiceRef=React.useRef<(templateId:string,templateVersion:string,source:string,selectionMode?:'manual'|'default')=>void>(()=>{})
  const [epoch,setEpoch]=React.useState(0)
  const currentCase=React.useRef(caseId)
  currentCase.current=caseId
  const latestReadRef=React.useRef(read)
  latestReadRef.current=read
  const latestModeRef=React.useRef(mode)
  latestModeRef.current=mode
  const onInstall=React.useRef(onPlanInstalled)
  onInstall.current=onPlanInstalled
  const onBound=React.useRef(onTemplateBound)
  onBound.current=onTemplateBound
  const refresh=React.useCallback(async():Promise<void>=>{
    if(!caseId)return
    const aggregate=await window.reviewAPI.getAggregateV2(caseId)
    if(currentCase.current!==caseId)return
    if(aggregate?.d2RuntimePlan){
      const plan=aggregate.d2RuntimePlan
      setInstalled({caseId,templateId:plan.templateId,templateVersion:plan.templateVersion,
        checks:plan.mapping.length,fingerprint:plan.fingerprint})
      setRead(null)
      return
    }
    const current=await window.reviewAPI.readLocalNativeProductV3(caseId)
    if(currentCase.current!==caseId)return
    setRead(current);setInstalled(null)
    const choice=current.read.route.status==='default-selected'?current.read.route.chosen:undefined
    if(choice)setPreferred(choice.templateId)
  },[caseId])
  React.useEffect(()=>{
    let live=true
    setRead(null);setInstalled(null);setPreferred('');setMode('catalog');setError('');setMessage('')
    setProposal(null);setPrepared(null);setConfirmed(false);setReviewMatter('')
    setModelRouteNote('');setCatalogQuery('');setModelCandidates([]);setModelMatchState('idle')
    modelAttemptRef.current='';routeAutoChoiceRef.current=''
    if(!caseId)return
    void refresh().catch(reason=>{if(live)setError(String(reason))})
    return ()=>{live=false}
  },[caseId,epoch,refresh])
  // 案卷不变也可能在后台补件、替换原件或重新分类。模型结果只对
  // 生成它时的 Main 原件快照有效，不能移植到更新后的 sessionKey。
  React.useEffect(()=>{
    setModelCandidates([]);setModelResultSessionKey(null);setModelMatchState('idle')
    setModelRouteNote('');setProposal(null);setPrepared(null);setConfirmed(false)
    modelAttemptRef.current=''
  },[read?.sessionKey])
  React.useEffect(()=>{
    if(!read?.deepMatch)return
    modelAttemptRef.current=read.sessionKey
    setModelMatchState(read.deepMatch.scope)
    if(read.deepMatch.scope==='matched'){
      setModelCandidates(read.deepMatch.matches.flatMap(item=>{
        const entry=read.catalog.find(option=>option.templateId===item.templateId&&
          option.templateVersion===item.templateVersion)
        return entry?[{...item,name:entry.name}]:[]
      }))
      setModelResultSessionKey(read.sessionKey)
    }
  },[read?.sessionKey,read?.deepMatch?.scope])
  // Main owns the B3 deadline. Poll only its remaining time; the Renderer never decides route success.
  React.useEffect(()=>{
    if(read?.read.route.status!=='countdown')return
    let live=true
    const tick=()=>{
      if(routeRefreshInFlight.current)return
      routeRefreshInFlight.current=true
      void refresh().catch(reason=>{if(live)setError(reason instanceof Error?reason.message:String(reason))})
        .finally(()=>{routeRefreshInFlight.current=false})
    }
    const timer=setInterval(tick,500)
    return ()=>{live=false;clearInterval(timer)}
  },[read?.read.route.status,read?.sessionKey,refresh])
  const run=async(action:()=>Promise<void>):Promise<void>=>{
    if(busy)return
    setBusy(true);setError('');setMessage('')
    try{await action()}catch(reason){setError(humanizeReviewError(reason))}
    finally{setBusy(false)}
  }
  const attachD4=():void=>{void run(async()=>{
    if(!selection)throw new Error('请先核对具体对象、场景和适用条件')
    if(currentCase.current!==caseId)throw new Error('案卷已切换，请重新选择模板')
    const receipt=await window.reviewAPI.attachD4TechnicalPlanV3({caseId,d4:selection})
    if(currentCase.current!==caseId)return
    setInstalled(receipt);setMessage('已给当前案卷安装 '+receipt.checks+' 项审核检查；接下来可运行 Pi。')
    onInstall.current?.(receipt)
  })}
  const extract=(model:boolean):void=>{void run(async()=>{
    if(!brief.trim())throw new Error('先写明审核目的和需要检查的事项')
    const templateId='fallback-'+Date.now().toString(36)
    const createdAt=new Date().toISOString()
    let result:T01BriefDraft
    if(model){
      let channel='',modelId=''
      result=await draftT01ViaAuthorizedModel(brief,templateId,createdAt,async prompt=>{
        const response=await window.reviewAPI.requestT01ModelDraft(prompt)
        channel=response.channelName;modelId=response.modelId
        return response.raw
      })
      setModelInfo('由当前已配置模型 '+channel+'/'+modelId+' 草拟，所有规则仍须逐条确认')
    }else{
      result=draftT01FromBrief(brief,templateId,createdAt)
      setModelInfo('已按明确写出的要求本机提取；不明制度不会被推断')
    }
    setProposal(result);setPrepared(null);setConfirmed(false)
    setReviewMatter(proposedFallbackReviewMatter(result,brief))
    setRequirements(proposedFallbackChecks(result,brief).join('\n'))
    setMessage('草拟完成。请修改下方逐条审核要求，再确认并接入真实案卷。')
  })}
  const attachFallback=():void=>{void run(async()=>{
    if(!proposal||!confirmed)throw new Error('请先逐条核对检查要求并确认')
    const checks=requirements.split(/\r?\n/).map(line=>line.trim()).filter(Boolean)
    const matter=reviewMatter.trim()
    if(!matter)throw new Error('请确认本案真实申请事项')
    // B29在Main内根据当前真实原件重算全部来源和归属，不能使用UI自报的SHA/路径。
    const templateId='fallback-'+caseId.replace(/[^a-zA-Z0-9]/g,'').slice(0,36)+'-'+Date.now().toString(36)
    const intent={
      templateId,name:proposal.template.name||'本地公共审核',
      purpose:brief.trim(),scenario:'本机技术初审（非正式审批）',objectKey:matter,
      humanRequirement:checks[0]??F06_REQUIRED_CHECKS[0].requirement,
      recordedBy:'local-reviewer',reviewerRole:'local-reviewer',
      userConfirmedAuthoring:true as const,
    }
    const authoritative=await window.reviewAPI.prepareLocalNativeUnmatchedV3({caseId,intent})
    if(currentCase.current!==caseId)return
    setPrepared(authoritative)
    const native=await window.reviewAPI.getAggregateV2(caseId)
    if(currentCase.current!==caseId)return
    if(!native||native.caseV2.id!==caseId)throw new Error('当前案卷已发生变化，请刷新材料')
    const author=executableFallbackAuthor(authoritative,checks,native.caseV2.documents,matter)
    // B1 Main 校验计划结构 -> 持久化修订 -> 冻结指纹 -> 装载同一原生案卷Pi。
    await window.reviewAPI.previewLocalCandidateAuthorV3({document:author})
    const saved=await window.reviewAPI.saveLocalCandidateAuthorV3({document:author,expectedRevision:0})
    const frozen=await window.reviewAPI.freezeLocalCandidateAuthorV3({document:author,expectedRevision:saved.revision})
    if(currentCase.current!==caseId)return
    const receipt=await window.reviewAPI.attachB1TechnicalPlanV3({caseId,templateId,fingerprint:frozen.fingerprint})
    if(currentCase.current!==caseId)return
    setInstalled(receipt);setMessage('公共兜底已接入当前案卷：'+receipt.checks+' 项真实 Pi 检查可运行。')
    onInstall.current?.(receipt)
  })}
  const identifyWithModel=(automatic=false,sourceRead:C11MainLocalProductRead|null=read):void=>{
    if(!sourceRead||!caseId)return
    const scope=sourceRead.sessionKey
    if(automatic&&modelAttemptRef.current===scope)return
    modelAttemptRef.current=scope
    setModelMatchState('matching');setModelRouteNote('');setError('')
    void (async()=>{
      try{
        // 模型调用、当前原件/目录校验与倒计时统一在 Main；不再让
        // Renderer 构造证据文本并自行计时提交自动选择。
        const next=await window.reviewAPI.deepMatchLocalNativeProductV3({
          caseId,sessionKey:scope,...(automatic?{}:{retry:true}),
        })
        if(currentCase.current!==caseId||latestReadRef.current?.sessionKey!==scope||latestModeRef.current!=='catalog')return
        setRead(next)
        const result=next.deepMatch
        if(!result)throw new Error('Main 未返回深度匹配结果')
        if(result.scope==='matched'&&result.matches.length){
          const ranked=result.matches.map(item=>{
            const entry=next.catalog.find(candidate=>candidate.templateId===item.templateId&&
              candidate.templateVersion===item.templateVersion)
            return entry?{...item,name:entry.name}:null
          }).filter((item):item is TemplateDeepMatchCandidate & {name:string}=>Boolean(item))
          if(ranked.length){
            setModelCandidates(ranked);setModelResultSessionKey(scope);setModelMatchState('matched')
            setModelRouteNote(next.read.route.status==='countdown'
              ?'通用模型已给出排序候选；由 Main 持有同一 20 秒倒计时，结束后默认进入第一项。'
              :'模型候选可信程度不足以自动确认；请从候选中人工选择适用模板。')
            return
          }
        }
        if(result.scope==='out-of-scope'){
          setModelMatchState('out-of-scope');setModelCandidates([])
          const fallbackBrief='现有模板匹配未覆盖本事项。\n模型分析：'+(result.reason||'模型判断当前事项不属于已提供模板范围。')+
            '\n请依据已导入材料起草通用审核要求；未知制度、资格、阈值和权限必须列为待人工核实，不得推断为通过。'
          setMode('fallback');setBrief(fallbackBrief);setConfirmed(false)
          setModelRouteNote('模型明确判断当前事项不在现有模板覆盖范围，已转入公共兜底。系统会起草一份待确认的通用审核方案，不会自动批准或运行。')
          const templateId='fallback-'+Date.now().toString(36)
          const draft=await draftT01ViaAuthorizedModel(fallbackBrief,templateId,new Date().toISOString(),async prompt=>{
            const response=await window.reviewAPI.requestT01ModelDraft(prompt)
            return response.raw
          })
          if(currentCase.current!==caseId||latestReadRef.current?.sessionKey!==scope)return
          setProposal(draft);setPrepared(null)
          setReviewMatter(proposedFallbackReviewMatter(draft,fallbackBrief))
          setRequirements(proposedFallbackChecks(draft,fallbackBrief).join('\n'))
          setModelInfo('由当前已配置通用模型起草；所有规则、材料要求与适用范围仍需逐条确认')
          setMessage('公共兜底草案已生成，请核对对象、材料和每一项检查要求后再确认。')
          return
        }
        setModelCandidates([]);setModelMatchState('uncertain')
        setModelRouteNote('通用模型仍无法可靠判断适用模板，也没有证据证明该事项超出范围。不会自动套用兜底；请搜索全部模板或人工确认业务类型。')
      }catch(reason){
        if(currentCase.current===caseId&&latestReadRef.current?.sessionKey===scope){
          setModelMatchState('failed');setModelCandidates([])
          setModelRouteNote('自动深度匹配失败：'+humanizeReviewError(reason)+'。可重试，或直接搜索全部模板。')
        }
      }
    })()
  }
  const applyTemplateChoice=(templateId:string,templateVersion:string,source:string,selectionMode:'manual'|'default'='manual'):void=>{
    if(choiceInFlightRef.current)return
    choiceInFlightRef.current=true
    void run(async()=>{
    if(!read||currentCase.current!==caseId)throw new Error('案卷已切换，请重新读取材料')
    const item=read.catalog.find(candidate=>candidate.templateId===templateId&&
      candidate.templateVersion===templateVersion&&candidate.availability==='authorized-for-technical-selection')
    if(!item)throw new Error('该模板版本不在当前 Main 授权目录中')
    const receipt=await window.reviewAPI.chooseLocalNativeProductTemplateV3({
      caseId,templateId,templateVersion,sessionKey:read.sessionKey,selectionMode,
    })
    if(!receipt.technicalChoiceRecorded)throw new Error('Main 未确认模板选择')
    if(currentCase.current!==caseId)return
    setModelCandidates([]);setModelMatchState('idle')
    if(receipt.requiresPlanSetup){
      setPreferred(templateId);setSelection(undefined);setMode('catalog')
      setMessage('已选择 '+item.name+'（'+source+'）。请继续核对真实对象、场景和必要条件，再固定审核计划。')
      const updated=await window.reviewAPI.readLocalNativeProductV3(caseId)
      if(currentCase.current===caseId)setRead(updated)
      return
    }
    setMessage('已选择并绑定 '+item.name+'；下一步将使用该模板处理当前案卷。')
    onBound.current?.({caseId,templateId,templateVersion:Number(templateVersion)})
    setEpoch(value=>value+1)
    }).finally(()=>{choiceInFlightRef.current=false})
  }
  applyChoiceRef.current=applyTemplateChoice
  React.useEffect(()=>{
    if(mode!=='catalog'||!read||installed||read.read.route.status!=='unmatched')return
    const reliable=read.routeCandidates.some(candidate=>candidate.autoEligible)
    if(reliable||modelAttemptRef.current===read.sessionKey)return
    identifyWithModel(true,read)
  },[mode,read?.sessionKey,read?.read.route.status,read?.routeCandidates,installed?.caseId,caseId])
  React.useEffect(()=>{
    const choice=read?.read.route.status==='default-selected'?read.read.route.chosen:undefined
    if(mode!=='catalog'||!choice||!read||installed||busy)return
    const candidate=read.read.route.candidates?.find(item=>item.templateId===choice.templateId&&
      item.templateVersion===choice.templateVersion)
    if(!candidate)return
    const key=read.sessionKey+'::'+choice.templateId+'@'+choice.templateVersion
    if(routeAutoChoiceRef.current===key)return
    routeAutoChoiceRef.current=key
    applyChoiceRef.current(choice.templateId,choice.templateVersion,'Main 倒计时默认候选','default')
  },[read?.sessionKey,read?.read.route.status,read?.read.route.chosen?.templateId,
    read?.read.route.chosen?.templateVersion,installed?.caseId,mode,busy])
  const route=read?.read.route
  const eligible=read?.catalog.filter(item=>!item.templateId.startsWith('fallback-'))??[]
  const visibleCatalog=filterTemplateCatalog(eligible,catalogQuery)
  const currentModelCandidates=modelResultSessionKey===read?.sessionKey?modelCandidates:[]
  const unifiedCandidates=React.useMemo(()=>mergeUnifiedRouteCandidates(
    read?.routeCandidates??[],currentModelCandidates
  ),[read?.routeCandidates,currentModelCandidates])

  return <section className="space-y-3 rounded-xl bg-card p-4 shadow-sm" aria-label="审核模板匹配与公共兜底" data-testid="review-v3-route-assistant">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div><h2 className="text-base font-semibold">匹配审核模板</h2>
        <p className="text-xs text-muted-foreground">全部工作发生在当前案卷；固定审核检查之后直接运行 Pi。</p>
        <p role="note" className="mt-2 max-w-3xl rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">继续匹配或调用 AI 前，请确认这些材料适合在当前设备和所选模型渠道中处理。</p>
      </div>
      <button type="button" className={secondary} disabled={!caseId||busy} onClick={()=>void run(refresh)}>重新读取材料与匹配</button>
    </div>
    {!caseId&&<p className="text-sm text-muted-foreground">导入申请材料后自动匹配可用模板。</p>}
    {installed&&<div role="status" className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
      <p>已选模板已固定 · {installed.checks} 项检查。无需再次建案或起草。</p>
      <button type="button" className={`${action} mt-2`} onClick={()=>onPlanInstalled?.(installed)}>进入审核</button>
    </div>}
    {caseId&&read&&!installed&&<>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-muted px-2 py-1">真实材料 {read.read.inventory?.sources?.length ?? 0} 份</span>
        <span className="rounded-full bg-muted px-2 py-1">可选模板 {eligible.length} 套</span>
        <span className="rounded-full bg-muted px-2 py-1">{route?.status==='default-selected'?'已匹配':route?.status==='countdown'?'建议确认中':route?.status==='unmatched'?(modelMatchState==='matching'?'AI深度匹配中':modelMatchState==='matched'?'已找到候选':modelMatchState==='out-of-scope'?'现有模板未覆盖':modelMatchState==='failed'?'AI匹配失败':modelMatchState==='uncertain'?'需人工确认':'未匹配'):route?.status==='awaiting-evidence'?'缺少可用材料':route?.status==='manually-selected'?'已选模板':'需人工选择'}</span>
      </div>
      {route?.status==='countdown'&&<div className="space-y-1 text-xs text-muted-foreground">
        <p>{route.candidates?.length&&route.candidates.length>1?'已找到多个有效候选':'已找到可靠候选'}；约 {Math.ceil(route.remainingMs/1000)} 秒后默认进入第一项。</p>
        <progress className="w-full" max={20} value={20-Math.min(20,Math.ceil(route.remainingMs/1000))}/>
      </div>}
      {route?.status==='unmatched'&&(modelMatchState==='idle'||modelMatchState==='matching')&&<p className="text-xs text-amber-700 dark:text-amber-300">尚未找到可靠的现有模板，正在自动深度匹配；你也可以搜索全部模板，或在确认超出范围后使用公共兜底。</p>}
      {route?.status==='manually-selected'&&route.chosen&&<p role="status" className="rounded-lg bg-primary/5 p-2 text-xs">当前已选择模板 {route.chosen.templateId}@{route.chosen.templateVersion}。继续完成该模板要求的配置；这不是审核结论。</p>}
      {['needs-user-confirmation','awaiting-evidence'].includes(route?.status??'')&&
        <p className="text-xs text-amber-700 dark:text-amber-300">需要人工确认：{route?.reason}。系统不会将不明材料自动归属到某个对象，也不会擅自创建正式案卷。</p>}
      <div className="flex gap-2">
        <button type="button" className={mode==='catalog'&&manualOpen?action:secondary} aria-expanded={mode==='catalog'&&manualOpen}
          onClick={()=>{setMode('catalog');setManualOpen(open=>!open)}}>手动选择模板</button>
        {advancedOptions&&<button type="button" className={mode==='fallback'?action:secondary} onClick={()=>{
          setMode('fallback');setModelCandidates([]);setModelMatchState('idle');modelAttemptRef.current=''
          if(route&&(route.status==='countdown'||route.status==='default-selected'))void window.reviewAPI.interruptLocalNativeProductV3(caseId)
            .then(setRead).catch(reason=>setError(reason instanceof Error?reason.message:String(reason)))
        }}>公共兜底 / 自动起草</button>}
      </div>
      {mode==='catalog'&&<div className="space-y-2">
        {read.routeCandidates.length>0&&modelMatchState!=='matched'&&<div className="rounded-lg bg-primary/5 p-3 text-xs">
          <p className="font-semibold">规则匹配候选 · {read.routeCandidates.length} 项</p>
          <div className="mt-2 space-y-2">{read.routeCandidates.map((candidate,index)=><div
            key={candidate.templateId+'@'+candidate.templateVersion} className="flex items-start gap-2 rounded border border-border/70 bg-background p-2">
            <span className="font-semibold">{index+1}.</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{candidate.name} · {candidate.templateId} · v{candidate.templateVersion}</p>
              <p className="text-muted-foreground">{candidate.tier==='exact'?'精确匹配':candidate.tier==='business-content-l1'?'业务对象＋办理动作':'关键词匹配'} · {candidate.matchedSignals.join(' + ')}</p>
              <p className="text-muted-foreground">依据：{candidate.evidence} · 置信度参考 {Math.round(candidate.confidence*100)}%</p>
            </div>
            <button type="button" className={secondary} disabled={busy}
              onClick={()=>applyTemplateChoice(candidate.templateId,candidate.templateVersion,'规则匹配人工选择')}>选择</button>
          </div>)}</div>
        </div>}
        {modelMatchState==='matching'&&<p role="status" className="text-xs text-muted-foreground">规则层未找到可靠结果，正在用当前已配置通用模型比较全部可用模板…</p>}
        {modelMatchState==='matched'&&currentModelCandidates.length>0&&<div className="space-y-2 rounded-lg border border-primary/30 p-3" role="status">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm">统一候选列表 · {unifiedCandidates.length} 项</p>
            <span className="text-xs tabular-nums">{route?.status==='countdown'?`Main 倒计时 ${Math.ceil(route.remainingMs/1000)} 秒`:'待人工确认'}</span>
          </div>
          {route?.status==='countdown'&&<progress className="w-full" max={20} value={20-Math.min(20,Math.ceil(route.remainingMs/1000))}/>}
          <p className="text-xs text-muted-foreground">仅 Main 认可的高置信度候选会在倒计时后默认选择第一项；其他结果需人工确认。模板选择不等于审核结论。</p>
          {unifiedCandidates.map((candidate,index)=><div key={candidate.templateId+'@'+candidate.templateVersion} className="flex items-start gap-2 rounded border border-border p-2">
            <span className="font-semibold">{index+1}.</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{candidate.name} · {candidate.templateId} · v{candidate.templateVersion}</p>
              <p className="text-xs text-muted-foreground">{candidate.source} · {candidate.reason} · 排序参考 {Math.round(candidate.confidence*100)}%</p>
              {candidate.matchedSignals.length>0&&<p className="text-xs text-muted-foreground">规则命中：{candidate.matchedSignals.join(' + ')}</p>}
            </div>
            <button type="button" className={secondary} disabled={busy}
              onClick={()=>applyTemplateChoice(candidate.templateId,candidate.templateVersion,'统一候选列表人工选择')}>选择</button>
          </div>)}
        </div>}
        {modelRouteNote&&<p role="status" className="rounded-lg bg-amber-500/10 p-2 text-xs">{modelRouteNote}</p>}
        {(modelMatchState==='uncertain'||modelMatchState==='failed'||modelMatchState==='out-of-scope')&&<button type="button" className={secondary}
          disabled={busy} onClick={()=>{modelAttemptRef.current='';identifyWithModel(false,read)}}>
          重新运行 AI 深度匹配
        </button>}
        {manualOpen&&<><label className="block text-xs">搜索模板（标题、编号、别名、关键词）
          <input type="search" className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            placeholder="例如：学籍更正、公共邮箱、差旅…"
            value={catalogQuery} onChange={event=>setCatalogQuery(event.target.value)}/>
        </label>
        <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
          {visibleCatalog.map(item=><div key={item.templateId+'@'+item.templateVersion} className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{item.name}</p>
              <p className="truncate text-xs text-muted-foreground">{item.templateId} · v{item.templateVersion}</p>
            </div>
            <button type="button" className={secondary}
              disabled={busy||item.availability!=='authorized-for-technical-selection'}
              onClick={()=>applyTemplateChoice(item.templateId,item.templateVersion,'全模板搜索人工选择')}>
              {item.availability==='authorized-for-technical-selection'?'选择':'候选未授权'}
            </button>
          </div>)}
          {visibleCatalog.length===0&&<p className="p-2 text-xs text-muted-foreground">没有命中；清空关键词查看全部模板。</p>}
        </div></>}
        {preferred&&<div className="space-y-2 rounded-lg border border-primary/30 p-3">
          <p className="text-sm font-semibold">模板下一步配置</p>
          <p className="text-xs text-muted-foreground">已选择 {read.catalog.find(item=>item.templateId===preferred)?.name??preferred}。请核对真实对象、场景和模板要求的条件。</p>
          <div className={advancedOptions ? '' : 'hidden'} aria-hidden={!advancedOptions}>
            <D4CaseSetup key={preferred} suggestedTemplateId={preferred} onChange={setSelection}/>
          </div>
          <button type="button" className={action} disabled={!selection||busy} onClick={attachD4}>
            {busy?'正在应用模板…':'使用此模板'}
          </button>
        </div>}

      </div>}
      {advancedOptions&&mode==='fallback'&&<div className="space-y-3">
        {modelMatchState==='out-of-scope'&&modelRouteNote&&<p role="status" className="rounded-lg bg-amber-500/10 p-2 text-xs">{modelRouteNote}</p>}
        <p className="text-xs text-muted-foreground">描述本案审核目的和具体要求。草稿必须由你逐条确认；模型只起草，不决定通过、不伪造学校政策。</p>
        <textarea aria-label="公共兜底审核目的" className="min-h-24 w-full rounded-lg border border-border bg-background p-2 text-sm"
          placeholder={'审核名称：临时活动材料审核\n审核对象：申请人\n材料：活动计划书、场地使用说明\n规则：核查申请用途、时间和材料是否相互一致'}
          value={brief} onChange={event=>{setBrief(event.target.value);setProposal(null);setReviewMatter('');setConfirmed(false)}}/>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={secondary} disabled={busy||!brief.trim()} onClick={()=>extract(false)}>提取明确要求</button>
          <button type="button" className={secondary} disabled={busy||!brief.trim()} onClick={()=>extract(true)}>用当前模型起草</button>
        </div>
        {proposal&&<div className="space-y-2 rounded-lg bg-muted/40 p-3">
          <p className="text-sm font-medium">审核草稿 · {proposal.template.name}</p>
          <label className="block text-xs">真实申请事项（必须由你核对；不能用笼统占位项）
            <input className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
              aria-label="公共兜底真实申请事项" maxLength={240} value={reviewMatter}
              onChange={event=>{setReviewMatter(event.target.value);setConfirmed(false)}}
              placeholder="例如：某实验室临时借用申请"/>
          </label>
          <p className="text-xs text-muted-foreground">本机固定检查（{F06_REQUIRED_CHECKS.length} 项）：申请事项与主体、材料事实一致性、缺件建议、政策依据可信性。制度依据始终待人工核实。</p>
          <p className="text-xs text-muted-foreground">{modelInfo}。下方每行一项可选的额外检查；用户/模型草拟的要求均不得自动视为有效校规。</p>
          <textarea aria-label="公共兜底逐项审核要求" className="min-h-32 w-full rounded-lg border border-border bg-background p-2 text-sm"
            placeholder="可留空；需要针对某个事项补充审核问题时，每行填写一项"
            value={requirements} onChange={event=>{setRequirements(event.target.value);setConfirmed(false)}}/>
          {proposal.questions.length>0&&<details className="text-xs text-amber-700 dark:text-amber-300"><summary className="cursor-pointer">尚需人工核对的事项（{proposal.questions.length}）</summary>
            <ul className="list-disc space-y-1 pl-4">{proposal.questions.map((item,index)=><li key={index}>{item}</li>)}</ul>
          </details>}
          <label className="flex items-start gap-2 text-xs"><input type="checkbox" checked={confirmed}
            onChange={event=>setConfirmed(event.target.checked)}/>
            我确认真实申请事项和可选检查要求；学校政策、权限和适用性未经认证，只能形成待人工确认的本机初审，不当作审批通过。
          </label>
          <button type="button" className={action} disabled={!confirmed||busy||!reviewMatter.trim()}
            onClick={attachFallback}>{busy?'正在固定本地审核任务…':'确认并继续审核当前案卷'}</button>
          {prepared&&<p className="text-xs text-muted-foreground">来源已由 Main 核查，共 {prepared.sourceCandidates.length} 份；不会另建案卷。</p>}
        </div>}
      </div>}
    </>}
    {message&&<p role="status" className="text-xs text-emerald-700 dark:text-emerald-300">{message}</p>}
    {error&&<p role="alert" className="text-xs text-red-600">{error}</p>}
  </section>
}
