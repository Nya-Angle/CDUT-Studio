/**
 * C-owned renderer entry for B's actual B1 candidate author and Main IPC.
 * The saved B1 revision survives app restart; no school publication is implied.
 */
import * as React from 'react'
import { useSetAtom } from 'jotai'
import { reviewWorkspaceSectionAtom } from '@/atoms/review-atoms'
import { reviewV2AggregateAtom } from './V2CasePanel'
import { ReviewV3LocalManualItem } from './ReviewV3LocalManualItem'
import { ReviewV3LocalPiControls } from './ReviewV3LocalPiControls'
import { ReviewV3UnifiedRun } from './ReviewV3UnifiedRun'
import { ReviewV3MaterialClassification } from './ReviewV3MaterialClassification'
import { ReviewV3RemediationPanel } from './ReviewV3RemediationPanel'
import { ReviewV3T08ReportPanel } from './ReviewV3T08ReportPanel'
import { D4CaseSetup } from './D4CaseSetup'
import { humanizeReviewError } from './review-error-text'
import { ReviewV3TemplateRoutingAssistant } from './ReviewV3TemplateRoutingAssistant'
import { ReviewAdvancedOptionsToggle, useAdvancedReviewOptions } from './ReviewAdvancedOptionsToggle'
import { createClassificationRefreshCoalescer } from './material-classification-refresh'
import type { CaseAggregateV2, D4ClientSelection, ReviewRunV2, TemplateVersion } from '@profer/shared'
import { ReviewV3CandidateIntakeSurface } from '../review-v3-dev-b/ReviewV3CandidateIntakeSurface'
import type { C11MainLocalProductRead } from '../../../main/lib/review/review-v3-main-local-product-intake'
import { ReviewV3AuthorWizard, emptyB1AuthorDocument } from '../review-v3-dev-b/ReviewV3AuthorWizard'
import type { B1AuthorDocument } from '../../../main/lib/review/review-template-plan-adapter-v3-b1'
import type { B1CandidateReadResponse } from '../review-v3-dev-b/review-v3-author-revision-read'

export function ReviewV3LocalCandidateWorkbench({
  initialCaseId,
  onTemplateReady,
}: {
  initialCaseId?: string
  onTemplateReady?: (caseId: string) => void | Promise<void>
}={}):React.ReactElement {
  const goToCase=useSetAtom(reviewWorkspaceSectionAtom)
  const showCase=useSetAtom(reviewV2AggregateAtom)
  const [caseTitle,setCaseTitle]=React.useState('本地人工审核')
  const [caseApplicant,setCaseApplicant]=React.useState('本机用户')
  const [caseYear,setCaseYear]=React.useState(String(new Date().getFullYear()))
  const [localCaseId,setLocalCaseId]=React.useState('')
  React.useEffect(()=>{
    if (initialCaseId) setLocalCaseId(initialCaseId)
  },[initialCaseId])
  const [savedCases,setSavedCases]=React.useState<Array<{id:string;title:string}>>([])
  const [d4Selection,setD4Selection]=React.useState<D4ClientSelection|undefined>(undefined)
  const [routedD4TemplateId,setRoutedD4TemplateId]=React.useState<string|undefined>(undefined)
  const [b1Frozen,setB1Frozen]=React.useState<{templateId:string;fingerprint:string}|null>(null)
  const [b1Notice,setB1Notice]=React.useState('')
  const [b1Error,setB1Error]=React.useState('')
  const [d4Notice,setD4Notice]=React.useState('')
  const [d4Error,setD4Error]=React.useState('')
  const [materialsEpoch,setMaterialsEpoch]=React.useState(0)
  const [product,setProduct]=React.useState<C11MainLocalProductRead|null>(null)
  // 异步读取必须绑定发起时的案卷；旧案响应不得渲染进新案（UI-03）。
  const localCaseIdRef=React.useRef(localCaseId)
  localCaseIdRef.current=localCaseId
  const productSeq=React.useRef(0)
  const [activePlan,setActivePlan]=React.useState<{
    templateId:string;templateVersion:number;checks:number;fingerprint:string
  }|null>(null)
  const [nativeAggregate,setNativeAggregate]=React.useState<CaseAggregateV2|null>(null)
  const [currentTemplate,setCurrentTemplate]=React.useState<TemplateVersion|null>(null)
  const [classificationError,setClassificationError]=React.useState('')
  const [classificationConfirmed,setClassificationConfirmed]=React.useState(false)
  const [publishedTemplateBound,setPublishedTemplateBound]=React.useState(false)
  const [nativeRun,setNativeRun]=React.useState<ReviewRunV2|null>(null)
  const [runEpoch,setRunEpoch]=React.useState(0)
  const [productError,setProductError]=React.useState('')
  React.useEffect(()=>{
    const route=product?.read.route
    const choice=route?.status==='default-selected'?route.chosen:undefined
    if(!choice||!product)return
    if(product.catalog.some(item=>item.templateId===choice.templateId&&
      item.templateVersion===choice.templateVersion)){
      setRoutedD4TemplateId(choice.templateId)
      setD4Notice('倒计时结束，已建议 '+choice.templateId+'。请核对真实审核对象与条件，再固定 Plan。')
    }
  },[product])
  const readProduct=React.useCallback(async()=>{
    const target=localCaseId
    if(!target)throw new Error('请先创建或选择本机案卷')
    const seq=++productSeq.current
    const data=await window.reviewAPI.readLocalNativeProductV3(target)
    if(seq!==productSeq.current||localCaseIdRef.current!==target)return data.read
    setProduct(data);setProductError('')
    return data.read
  },[localCaseId])
  React.useEffect(()=>{
    productSeq.current+=1
    setProduct(null);setActivePlan(null);setProductError('')
    setNativeAggregate(null);setPublishedTemplateBound(false);setClassificationError('')
    if(!localCaseId)return
    let mounted=true
    void (async()=>{
      try{
        const aggregate=await window.reviewAPI.getAggregateV2(localCaseId)
        if(!mounted)return
        setNativeAggregate(aggregate??null)
        if(aggregate?.d2RuntimePlan){
          const plan=aggregate.d2RuntimePlan
          setActivePlan({templateId:plan.templateId,templateVersion:plan.templateVersion,
            checks:plan.mapping.length,fingerprint:plan.fingerprint})
          return
        }
        if(aggregate&&aggregate.caseV2.templateVersion>0){
          try{
            const bound=await window.reviewAPI.getTemplateV2(
              aggregate.caseV2.templateId,aggregate.caseV2.templateVersion)
            if(mounted)setPublishedTemplateBound(bound?.status==='published')
          }catch(cause){
            if(mounted)setClassificationError(cause instanceof Error?cause.message:String(cause))
          }
        }
        const data=await window.reviewAPI.readLocalNativeProductV3(localCaseId)
        if(mounted)setProduct(data)
      }catch(e){if(mounted)setProductError(e instanceof Error?e.message:String(e))}
    })()
    return ()=>{mounted=false}
  },[localCaseId,materialsEpoch])
  React.useEffect(()=>{
    setCurrentTemplate(null)
    if(!nativeAggregate||nativeAggregate.d2RuntimePlan||nativeAggregate.caseV2.templateVersion<1)return
    let live=true
    void window.reviewAPI.getTemplateV2(
      nativeAggregate.caseV2.templateId,nativeAggregate.caseV2.templateVersion)
      .then(template=>{if(live)setCurrentTemplate(template??null)})
      .catch(cause=>{if(live)setClassificationError(cause instanceof Error?cause.message:String(cause))})
    return()=>{live=false}
  },[nativeAggregate?.caseV2.templateId,nativeAggregate?.caseV2.templateVersion,
    Boolean(nativeAggregate?.d2RuntimePlan)])
  React.useEffect(()=>{setClassificationConfirmed(false)},[localCaseId,materialsEpoch])
  React.useEffect(()=>{
    setNativeRun(null)
    if (!localCaseId) return
    let live=true
    void (async()=>{
      const runs=await window.reviewAPI.listRunsV2(localCaseId)
      const latest=[...runs].sort((a,b)=>b.startedAt.localeCompare(a.startedAt))[0]??null
      if (live) setNativeRun(latest)
    })().catch(()=>{if(live)setNativeRun(null)})
    return()=>{live=false}
  },[localCaseId,materialsEpoch,runEpoch])
  /** 自动分类完成事件：只刷新当前案卷的聚合与材料读取结果，不重置人工状态。 */
  const classificationRefreshSeq = React.useRef(0)
  React.useEffect(() => {
    const coalescer = createClassificationRefreshCoalescer((caseId) => {
      if (localCaseIdRef.current !== caseId) return
      const seq = ++classificationRefreshSeq.current
      void (async () => {
        try {
          const aggregate = await window.reviewAPI.getAggregateV2(caseId)
          // 旧案卷/旧请求的迟到结果不得覆盖当前页面
          if (seq !== classificationRefreshSeq.current || localCaseIdRef.current !== caseId) return
          if (aggregate) setNativeAggregate(aggregate)
          await readProduct()
        } catch { /* 分类刷新失败不打断页面，原列表仍可用 */ }
      })()
    })
    const unsubscribe = window.reviewAPI.onMaterialAutoClassified?.((event) => {
      coalescer.notify(event.caseId, localCaseIdRef.current)
    })
    return () => {
      unsubscribe?.()
      coalescer.dispose()
      classificationRefreshSeq.current += 1
    }
  }, [readProduct])

  const refreshNativeAggregate=React.useCallback(async()=>{
    if (!localCaseId)return
    const refreshed=await window.reviewAPI.getAggregateV2(localCaseId)
    if(refreshed)setNativeAggregate(refreshed)
    setRunEpoch(epoch=>epoch+1)
  },[localCaseId])
  const [dropActive,setDropActive]=React.useState(false)
  const [dropRole,setDropRole]=React.useState<'application'|'evidence'>('application')
  const [caseBusy,setCaseBusy]=React.useState(false)
  const [caseNotice,setCaseNotice]=React.useState('')
  const [caseError,setCaseError]=React.useState('')
  const [templateId,setTemplateId]=React.useState('')
  const [loaded,setLoaded]=React.useState<{document:B1AuthorDocument;revision:number}|null>(null)
  const [key,setKey]=React.useState(0)
  const [busy,setBusy]=React.useState(false)
  const [error,setError]=React.useState('')
  const [message,setMessage]=React.useState('')
  const readLatest=React.useCallback(async (id:string):Promise<B1CandidateReadResponse>=>{
    const response=await window.reviewAPI.readCurrentAuthorRevisionV3({templateId:id})
    return {schemaVersion:'review-b1-author-read/1',templateId:response.templateId,
      revision:response.revision,digest:response.sourceDigest,
      document:response.document as B1AuthorDocument,candidateStatus:'candidate-held'}
  },[])
  const reopen=async ():Promise<void>=>{
    if(busy)return
    if(loaded && !window.confirm('切换作者修订可能舍弃编辑器中尚未保存的修改，确定继续？'))return
    setBusy(true);setError('');setMessage('')
    try{
      const source=await readLatest(templateId.trim())
      setLoaded({document:source.document,revision:source.revision})
      // A preview is not a frozen candidate. The existing B1 editor must
      // explicitly freeze the loaded revision before the install button enables.
      setB1Frozen(null)
      setKey(k=>k+1)
      setMessage('已从 Main 重新读取本机保存的候选修订 '+source.revision)
    }catch(e){setError(e instanceof Error?e.message:String(e))}
    finally{setBusy(false)}
  }
  const listSavedCases=async ():Promise<void>=>{
    if(caseBusy)return
    setCaseBusy(true);setCaseError('')
    try{
      const cases=await window.reviewAPI.listCases()
      setSavedCases(cases.map(item=>({id:item.id,title:item.title})))
      setCaseNotice('已列出本地已保存案卷（含只读历史）；选择后可以重新打开。')
    }catch(e){setCaseError(e instanceof Error?e.message:String(e))}
    finally{setCaseBusy(false)}
  }
  const createCase=async ():Promise<void>=>{
    if(caseBusy)return
    setCaseBusy(true);setCaseError('');setCaseNotice('')
    try{
      const created=await window.reviewAPI.createCase({
        title:caseTitle.trim(),type:'自定义审核',
        applicant:caseApplicant.trim(),academicYear:caseYear.trim(),
        reviewTemplate:null,
      })
      setLocalCaseId(created.id)
      setSavedCases([])
      setCaseNotice('本机原生案卷已创建：'+created.id+'；未绑定校方模板，请先导入材料并人工审核。')
    }catch(e){setCaseError(e instanceof Error?e.message:String(e))}
    finally{setCaseBusy(false)}
  }
  const installD4=async():Promise<void>=>{
    if(caseBusy||!localCaseId||!d4Selection)return
    setCaseBusy(true);setD4Error('');setD4Notice('')
    try{
      const ack=await window.reviewAPI.attachD4TechnicalPlanV3({
        caseId:localCaseId,d4:d4Selection,
      })
      setD4Notice('已把「'+ack.templateId+'」应用到当前案卷，固定 '+ack.checks+' 项检查。现在可以从下方运行审核。')
      setMaterialsEpoch(x=>x+1)
    }catch(e){setD4Error(humanizeReviewError(e))}
    finally{setCaseBusy(false)}
  }
  const freezeB1=async(document:B1AuthorDocument,expectedRevision:number):Promise<{fingerprint:string}>=>{
    const result=await window.reviewAPI.freezeLocalCandidateAuthorV3({document,expectedRevision})
    setB1Frozen({templateId:document.templateId,fingerprint:result.fingerprint})
    setB1Notice('第51套已冻结，可绑定当前本机案卷。')
    return result
  }
  const attachB1=async():Promise<void>=>{
    if(caseBusy||!localCaseId||!b1Frozen)return
    setCaseBusy(true);setB1Error('');setB1Notice('')
    try{
      const ack=await window.reviewAPI.attachB1TechnicalPlanV3({caseId:localCaseId,...b1Frozen})
      setB1Notice('本案已安装 '+ack.checks+' 项真实 Pi 检查；可以启动审核')
      setMaterialsEpoch(x=>x+1)
    }catch(e){setB1Error(e instanceof Error?e.message:String(e))}
    finally{setCaseBusy(false)}
  }
  const importMaterial=async (role:'application'|'evidence'):Promise<void>=>{
    if(caseBusy||!localCaseId)return
    setCaseBusy(true);setCaseError('');setCaseNotice('')
    try{
      const imported=await window.reviewAPI.importDocument({caseId:localCaseId,role})
      if(imported.canceled){setCaseNotice('已取消选择，没有导入原件')}
      else{
        setMaterialsEpoch(x=>x+1)
        setCaseNotice((role==='application'?'申请原件':'证明材料')+'：成功导入 '+imported.documents.length+' 份；失败 '+imported.failures.length+' 份')
        if(imported.failures.length)
          setCaseError(imported.failures.map(x=>x.fileName+': '+x.message).join('；').slice(0,500))
      }
    }catch(e){setCaseError(e instanceof Error?e.message:String(e))}
    finally{setCaseBusy(false)}
  }
  const dropMaterials=async(event:React.DragEvent<HTMLDivElement>):Promise<void>=>{
    event.preventDefault()
    event.stopPropagation()
    setDropActive(false)
    if(!localCaseId||caseBusy)return
    const files=Array.from(event.dataTransfer.files)
    if(!files.length)return
    setCaseBusy(true);setCaseNotice('');setCaseError('')
    let imported=0
    const errors:string[]=[]
    try{
      for(const file of files){
        try{
          const sourcePath=window.electronAPI.getPathForFile(file)
          if(!sourcePath)throw new Error('无法读取系统拖拽文件路径')
          await window.reviewAPI.registerMaterialPathV2({
            caseId:localCaseId,sourcePath,role:dropRole,fileName:file.name,
          })
          imported++
        }catch(reason){
          errors.push(file.name+': '+(reason instanceof Error?reason.message:String(reason)))
        }
      }
      if(imported)setMaterialsEpoch(x=>x+1)
      setCaseNotice('拖入 '+files.length+' 份材料，成功 '+imported+' 份，失败 '+errors.length+' 份；已记录到当前案卷')
      if(errors.length)setCaseError(errors.join('；').slice(0,800))
    }finally{setCaseBusy(false)}
  }
  const openCase=async ():Promise<void>=>{
    if(caseBusy||!localCaseId)return
    setCaseBusy(true);setCaseError('')
    try{
      const aggregate=await window.reviewAPI.openAggregateV2(localCaseId)
      if(!aggregate)throw new Error('未找到该原生案卷；请确认本机案卷 ID。')
      showCase(aggregate)
      goToCase('case-v2')
    }catch(e){setCaseError(e instanceof Error?e.message:String(e))}
    finally{setCaseBusy(false)}
  }
  const start=():void=>{
    if(loaded && !window.confirm('新建编辑器会舍弃尚未保存的修改，确定继续？'))return
    setLoaded(null);setKey(k=>k+1);setError('');setMessage('本地未发布候选草稿')
  }
  const { show: advancedOptions } = useAdvancedReviewOptions()
  return <div className="mx-auto max-w-5xl space-y-4 px-4 pb-8">
    {/* 顶部「当前材料」：始终可见；复杂配置见下方高级容器。 */}
    <div className="space-y-3 rounded-lg border border-border p-4">
      <h2 className="text-base font-semibold">{localCaseId ? '当前案卷' : '开始审核'}</h2>
      {localCaseId ? (
        <p className="text-sm text-muted-foreground" data-review-case-summary>
          {nativeAggregate?.caseV2.title || '已选择本机案卷'}
          <span className="mx-1">·</span>
          {nativeAggregate ? `${nativeAggregate.caseV2.documents.filter(item=>item.active!==false).length} 份材料` : '正在读取材料…'}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">请先在「导入材料」导入真实材料；已导入的案卷会自动出现在这里。</p>
      )}
      {advancedOptions && <div className="space-y-2">
      <p className="text-xs text-muted-foreground">高级：手工建案、指定案卷编号与历史案卷工具。日常从材料导入开始即可。</p>
      <div className="flex flex-wrap gap-2">
        <input aria-label="本地案卷标题" value={caseTitle} onChange={e=>setCaseTitle(e.target.value)}
          className="min-w-44 flex-1 rounded border border-border bg-background px-2 py-1.5 text-sm" placeholder="案卷标题"/>
        <input aria-label="申请主体" value={caseApplicant} onChange={e=>setCaseApplicant(e.target.value)}
          className="min-w-32 flex-1 rounded border border-border bg-background px-2 py-1.5 text-sm" placeholder="申请主体"/>
        <input aria-label="学年" value={caseYear} onChange={e=>setCaseYear(e.target.value)}
          className="w-24 rounded border border-border bg-background px-2 py-1.5 text-sm" placeholder="学年"/>
        <button type="button" className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={caseBusy||!caseTitle.trim()||!caseApplicant.trim()||!caseYear.trim()}
          onClick={()=>void createCase()}>创建未绑定模板案卷</button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input aria-label="当前本机案卷 ID" className="min-w-44 flex-1 rounded border border-border bg-background px-2 py-1.5 text-sm"
          placeholder="本机已有案卷 ID 可直接粘贴重开" value={localCaseId} onChange={e=>setLocalCaseId(e.target.value)}/>
        <button type="button" className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={caseBusy} onClick={()=>void listSavedCases()}>列出本机历史案卷</button>
        {advancedOptions&&<>
        <button type="button" className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={caseBusy||!localCaseId} onClick={()=>void importMaterial('application')}>选择并导入申请材料</button>
        <button type="button" className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={caseBusy||!localCaseId} onClick={()=>void importMaterial('evidence')}>选择并导入证明材料</button>
        </>}
        <button type="button" className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={caseBusy||!localCaseId} onClick={()=>void openCase()}>打开案卷人工办理</button>
      </div>
      </div>}
      {localCaseId&&advancedOptions&&<div className={`rounded-lg border-2 border-dashed p-4 ${dropActive?'border-primary bg-primary/10':'border-border'}`}
        data-testid="review-v3-native-file-drop" onDragOver={event=>{
          event.preventDefault();event.dataTransfer.dropEffect='copy';setDropActive(true)
        }} onDragLeave={event=>{event.preventDefault();setDropActive(false)}}
        onDrop={event=>void dropMaterials(event)}>
        <p className="text-sm font-medium">把申请材料或证明文件直接拖到这里</p>
        <p className="text-xs text-muted-foreground">多个文件会依次进入当前原生案卷；仍使用现有材料服务、真实原件和 V3 解析链。</p>
        <div className="mt-2 flex gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input type="radio" checked={dropRole==='application'} onChange={()=>setDropRole('application')}/>
            申请材料
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={dropRole==='evidence'} onChange={()=>setDropRole('evidence')}/>
            证明材料
          </label>
        </div>
      </div>}
      {advancedOptions&&savedCases.length>0&&<select aria-label="从历史案卷重开" value=""
        onChange={e=>{setLocalCaseId(e.target.value);setCaseNotice('已选择历史案卷 '+e.target.value) }}
        className="w-full rounded border border-border bg-background px-2 py-2 text-sm">
        <option value="">选择一份本机历史案卷</option>
        {savedCases.map(c=><option key={c.id} value={c.id}>{c.title} · {c.id}</option>)}
      </select>}
      {caseNotice&&<p role="status" className="text-xs">{caseNotice}</p>}
      {caseError&&<p role="alert" className="text-xs text-red-600">{caseError}</p>}
    </div>
    {/* 默认可见：当前材料与模板匹配（自动推荐 + 手动选择） */}
    {localCaseId&&!activePlan&&!nativeAggregate?.d2RuntimePlan&&!publishedTemplateBound&&<ReviewV3TemplateRoutingAssistant
      caseId={localCaseId}
      onPlanInstalled={plan=>{
        setActivePlan(plan)
        setMaterialsEpoch(x=>x+1)
        void onTemplateReady?.(localCaseId)
      }}
      onTemplateBound={()=>{
        setMaterialsEpoch(x=>x+1)
        void onTemplateReady?.(localCaseId)
      }}
    />}
    {/* 已固定计划时的默认摘要：不打开高级也能继续进入三栏审核 */}
    {activePlan&&!advancedOptions&&<div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
      <p className="text-sm">已选模板已固定 · {activePlan.checks} 项检查；无需再次选择。</p>
      <button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
        onClick={()=>void onTemplateReady?.(localCaseId)}>进入审核</button>
    </div>}
    <div className={advancedOptions ? 'space-y-4' : 'hidden'} data-review-advanced-detail>
    {activePlan&&<div className="space-y-2 rounded-lg border border-border p-4">
      <h2 className="text-base font-semibold">本案已绑定审核计划</h2>
      <p className="text-sm">{activePlan.templateId}@{activePlan.templateVersion} · 已固定 {activePlan.checks} 项检查</p>
      <p className="break-all text-xs text-muted-foreground">任务指纹：{activePlan.fingerprint}</p>
      <p className="text-xs">不必重新选择模板。继续导入材料、在下方启动 Pi，或打开案卷进行人工复核。</p>
    </div>}
    {localCaseId&&nativeAggregate&&nativeAggregate.caseV2.templateVersion>0&&(!!activePlan||!!nativeAggregate.d2RuntimePlan||publishedTemplateBound)&&<ReviewV3MaterialClassification
      caseId={localCaseId}
      aggregate={nativeAggregate}
      autoMode={publishedTemplateBound&&/^(?:S0[1-8]|T0[1-8])-T\d{2}$/.test(nativeAggregate.caseV2.templateId)&&
        currentTemplate?.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')===true}
      confirmed={classificationConfirmed}
      onConfirmed={()=>setClassificationConfirmed(true)}
      onClassificationChanged={()=>{
        setClassificationConfirmed(false)
        setMaterialsEpoch(x=>x+1)
      }}
      onUpdated={refreshNativeAggregate}
      onProposeRemediation={async(suggestion)=>{
        const fresh=await window.reviewAPI.getAggregateV2(localCaseId)
        if(!fresh||fresh.caseV2.id!==localCaseId)throw new Error('纠错案卷已变化')
        const outcome=await window.reviewAPI.proposeNativeRemediationV3({
          caseId:localCaseId,requestId:'f05-ai-propose-'+crypto.randomUUID(),
          expectedRevision:fresh.caseV2.revision,
          documentVersionId:suggestion.documentVersionId,role:suggestion.role,
          ...(suggestion.materialSlotId?{materialSlotId:suggestion.materialSlotId}:{}),
          reason:'审核人提出复核 AI 分类建议：'+suggestion.reason,
        })
        if(!outcome.ok)throw new Error(outcome.message)
        await refreshNativeAggregate()
      }}
    />}
    {classificationError&&<p role="alert" className="text-xs text-red-600">模板读取失败：{classificationError}</p>}
    {localCaseId&&nativeAggregate&&<ReviewV3RemediationPanel
      caseId={localCaseId} aggregate={nativeAggregate}
      slots={currentTemplate?.materialSlots??[]}
      onUpdated={async()=>{
        setClassificationConfirmed(false)
        setMaterialsEpoch(epoch=>epoch+1)
        await refreshNativeAggregate()
      }}
    />}
    {/* 第二套对象/场景配置只保留逻辑挂载（hidden），避免与上方匹配区同时露出两套 D4 表单；
        真正可见且可提交的模板选择在上方「匹配审核模板」内完成。 */}
    {localCaseId&&!activePlan&&!nativeAggregate?.d2RuntimePlan&&!publishedTemplateBound&&<div className="hidden" aria-hidden="true" data-review-legacy-d4>
      <h2 className="text-base font-semibold">选择审核方案，为当前案卷生成审核任务</h2>
      <p className="text-xs text-muted-foreground">选择方案并确认对象/场景后，把检查方案写入当前案卷；不另外创建案卷。已添加人工事项或已固定方案的案卷请另建新案卷。</p>
      <D4CaseSetup onChange={setD4Selection} suggestedTemplateId={routedD4TemplateId}/>
      <button type="button" className="rounded border border-border px-3 py-2 text-sm disabled:opacity-50"
        disabled={caseBusy||!d4Selection} onClick={()=>void installD4()}>
        把该方案应用到当前案卷
      </button>
      {d4Notice&&<p role="status" className="text-xs">{d4Notice}</p>}
      {d4Error&&<p role="alert" className="text-xs text-red-600">{d4Error}</p>}
    </div>}
    <div className="space-y-2 rounded-lg border border-border p-4">
      <h2 className="text-base font-semibold">自定义审核方案</h2>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={caseBusy||!localCaseId||!b1Frozen||!!activePlan} onClick={()=>void attachB1()}>
          把已保存的自定义方案应用到当前案卷
        </button>
        <span className="text-xs">{b1Frozen?.templateId??'请先在下方保存并冻结模板'}</span>
      </div>
      {b1Notice&&<p role="status" className="text-xs">{b1Notice}</p>}
      {b1Error&&<p role="alert" className="text-xs text-red-600">{b1Error}</p>}
      <p className="text-xs text-muted-foreground">内置方案不适用时，可在这里新建、编辑并保存自己的审核方案。</p>
      <div className="flex flex-wrap items-center gap-2">
        <input aria-label="重开候选模板 ID" className="min-w-40 flex-1 rounded border border-border bg-background px-2 py-1.5 text-sm"
          placeholder="输入已保存模板 ID" value={templateId} onChange={e=>setTemplateId(e.target.value)} />
        <button type="button" className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50" disabled={busy||!templateId.trim()}
          onClick={()=>void reopen()}>读取本机最新修订</button>
        <button type="button" className="rounded border border-border px-3 py-1.5 text-sm" onClick={start}>新建候选</button>
      </div>
      {message&&<p role="status" className="text-xs">{message}</p>}
      {error&&<p role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
    {localCaseId&&!activePlan&&!publishedTemplateBound&&<div className="space-y-2">
      {productError&&<p role="alert" className="text-xs text-red-600">
        当前材料 Main 读取失败：{productError}（未返回候选结果）
      </p>}
      <button type="button" className="rounded border border-border px-3 py-1.5 text-sm"
        onClick={()=>void readProduct().catch(e=>setProductError(e instanceof Error?e.message:String(e)))}>
        从真实原件刷新 50+1 候选工作台
      </button>
      {product&&<ReviewV3CandidateIntakeSurface
        key={localCaseId+'-'+product.sessionKey}
        caseCandidateId={localCaseId} sessionKey={product.sessionKey}
        route={product.read.route} manualCatalog={product.catalog}
        onRequestRefresh={async()=>{await readProduct()}}
        onInterrupt={async()=>{
          const target=localCaseId
          const data=await window.reviewAPI.interruptLocalNativeProductV3(target)
          if(localCaseIdRef.current===target)setProduct(data)
        }}
        onManualChoice={async choice=>{
          const target=localCaseId
          // Main 要求当前路由会话；重新读一次，避免用面板旧快照绑定或造空 key。
          const fresh=await window.reviewAPI.readLocalNativeProductV3(target)
          if(localCaseIdRef.current!==target)return
          if(!fresh.sessionKey)
            throw new Error('当前材料路由会话不可用，请刷新候选工作台后重试')
          if(fresh.sessionKey!==choice.sessionKey)
            throw new Error('材料或路由会话已更新，请刷新候选工作台后重新选择')
          const ack=await window.reviewAPI.chooseLocalNativeProductTemplateV3({
            caseId:target,templateId:choice.templateId,templateVersion:choice.templateVersion,
            sessionKey:fresh.sessionKey,selectionMode:'manual'})
          if(localCaseIdRef.current!==target)return ack
          if(ack.requiresPlanSetup){
            setRoutedD4TemplateId(choice.templateId)
            setD4Notice('已根据材料匹配到方案 '+choice.templateId+'，请在上方核对审核对象与场景后再应用。')
          }else setMaterialsEpoch(x=>x+1)
          await readProduct()
          return ack
        }}
        author={{
          onSaveDraft:(document,expectedRevision)=>
            window.reviewAPI.saveLocalCandidateAuthorV3({document,expectedRevision}),
          onPreview:document=>window.reviewAPI.previewLocalCandidateAuthorV3({document}),
          onFreezeCandidate:freezeB1,
          onReadLatestCandidate:async id=>readLatest(id),
        }}
        product={{
          onReadCurrent:readProduct,
          onPrepareUnmatchedDraft:intent=>window.reviewAPI.prepareLocalNativeUnmatchedV3({
            caseId:localCaseId,intent,
          }),
          // 未匹配业务 → 可编辑业务模板草稿（只保存 draft，不含政策与确定性规则）
          onCreateBusinessTemplateDraft:async(document,templateId)=>{
            const created=await window.reviewAPI.createFallbackTemplateDraft({document,templateId})
            return {
              templateId:created.template.templateId,
              version:created.template.version,
              notes:created.notes,
            }
          },
        }}
      />}
    </div>}
    <ReviewV3LocalManualItem key={localCaseId+'-'+materialsEpoch} caseId={localCaseId} />
    {localCaseId&&<ReviewV3UnifiedRun
      caseId={localCaseId}
      stage={nativeAggregate?.caseV2.stage??'draft'}
      documentCount={nativeAggregate?.caseV2.documents.filter(item=>item.active!==false).length??0}
      technicalPlan={!!nativeAggregate?.d2RuntimePlan}
      nativeV3={nativeAggregate?.receiptLog[0]?.type === 'CreateNativeWorkspaceCaseV3'}
      materialSlots={currentTemplate?.materialSlots}
      canRun={!!activePlan||!!nativeAggregate?.d2RuntimePlan||
        (publishedTemplateBound&&(classificationConfirmed||
          (/^(?:S0[1-8]|T0[1-8])-T\d{2}$/.test(nativeAggregate?.caseV2.templateId??'')&&
            currentTemplate?.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')===true)))}
      onUpdated={refreshNativeAggregate}
    />}
    {localCaseId&&<div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">审核完成后核对与交付</h2>
          <p className="text-xs text-muted-foreground">在原案卷修改证据、处理待办和作出人工决定；报告始终使用真实运行。</p>
        </div>
        <button type="button" className="rounded border border-primary/50 px-3 py-2 text-sm disabled:opacity-50"
          disabled={caseBusy} onClick={()=>void openCase()}>打开本案复核与人工办理</button>
      </div>
      {nativeRun&&<ReviewV3T08ReportPanel caseId={localCaseId} currentRunId={nativeRun.id}/>}
      {!nativeRun&&<p className="text-xs text-muted-foreground">本案尚无真实运行，完成审核后可在这里直接下载报告。</p>}
    </div>}
    <details className="rounded-lg border border-border px-3 py-2">
      <summary className="cursor-pointer text-sm font-medium">高级：Pi 详细账本与停止／续跑</summary>
      <ReviewV3LocalPiControls key={localCaseId+'-'+materialsEpoch} caseId={localCaseId} />
    </details>
        <ReviewV3AuthorWizard key={key} initialDraft={loaded?.document??emptyB1AuthorDocument()}
      initialRevision={loaded?.revision??0}
      onSaveDraft={(document,expectedRevision)=>
        window.reviewAPI.saveLocalCandidateAuthorV3({document,expectedRevision})}
      onPreview={document=>window.reviewAPI.previewLocalCandidateAuthorV3({document})}
      onFreezeCandidate={freezeB1}
      onReadLatestCandidate={(id)=>readLatest(id)}
    />
    </div>
    <ReviewAdvancedOptionsToggle />
  </div>
}
