/** Native B1 author candidate -> executable technical plan, using existing Case/Pi. */
import {createHash,randomUUID} from 'node:crypto'
import {ipcMain,type IpcMainInvokeEvent} from 'electron'
import {REVIEW_IPC_CHANNELS} from '@profer/shared'
import type {Actor,D2RuntimePlan,D2TargetBinding,ReviewSubject,RuleSpec,TemplateVersion} from '@profer/shared'
import {readAggregate,submitCommand} from './case-store-v2'
import {isNativeWorkspaceCaseV3} from './native-workspace-case-v3'
import {assertC0ReviewMainSender} from './review-c0-authority'
import {getTemplate,isAuthoringCandidateDraft,saveAuthoringCandidateDraft,isSafeTemplateId} from './template-store'
import {readB1FrozenCandidate,readB1AuthorRevision} from './review-template-author-store-v3-b1'
import {verifyD2InstalledPlan} from './review-d2-runtime'
import {assertC2PhysicalOriginalBytes} from './review-v3-main-trust-port'

const sha=(x:unknown)=>createHash('sha256').update(JSON.stringify(x)??'undefined').digest('hex')
const actor:Actor={actorId:'local-reviewer',actorSource:'local',role:'reviewer'}

export function installC11NativeB1TechnicalPlan():void{
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_B1_ATTACH_PLAN_V3,async(
    event:IpcMainInvokeEvent,input:{caseId:string;templateId:string;fingerprint:string}
  )=>{
    assertC0ReviewMainSender(event)
    if(!input||typeof input.caseId!=='string'||!isSafeTemplateId(input.templateId)||
      !/^[a-f0-9]{64}$/.test(input.fingerprint))throw Error('B1_AUTHOR_OR_CASE_REQUIRED')
    const current=readAggregate(input.caseId)
    if(!current||!isNativeWorkspaceCaseV3(current)||current.caseV2.stage!=='draft'||
      current.caseV2.templateId!=='pending-template-v3'||current.d2RuntimePlan||
      current.canonicalPlan||current.caseV2.subjects.length||current.caseV2.reviewRules?.length)
      throw Error('B1_UNBOUND_NATIVE_DRAFT_REQUIRED')
    const frozen=readB1FrozenCandidate(input.templateId,input.fingerprint)
    if(!frozen)throw Error('B1_FROZEN_TEMPLATE_NOT_FOUND')
    const latest=readB1AuthorRevision(input.templateId,frozen.revision)
    if(!latest)throw Error('B1_AUTHOR_REVISION_MISSING')
    const author=latest.document,descriptor=frozen.descriptor,version=Number(author.templateVersion)
    if(!Number.isSafeInteger(version)||version<1)throw Error('B1_NUMERIC_VERSION_REQUIRED')
    // 公共兜底入口的B29来源最初是瞬态B2 docv-*；装入原生案卷之前必须
    // 对应到当前案卷实际登记的原件版本，逐份物理验真且覆盖当前全部原件。
    // 不能仅因同名或同SHA从另一案卷挑选来源，也不能默默遗漏附件。
    if(author.templateId.startsWith('fallback-')){
      const active=current.caseV2.documents.filter(doc=>doc.active!==false)
      const declared=descriptor.sourceLedger.map(source=>source.documentVersionId)
      const actual=new Set(active.map(doc=>doc.versionId))
      if(!active.length||active.filter(doc=>doc.role==='application').length!==1||
        declared.length!==actual.size||new Set(declared).size!==declared.length||
        declared.some(versionId=>!actual.has(versionId))||
        descriptor.sourceLedger.some(source=>source.kind!=='user-declared'||
          source.locator!=='native-document:'+source.documentVersionId))
        throw Error('B1_FALLBACK_NATIVE_SOURCE_COVERAGE_MISMATCH')
      for(const doc of active)assertC2PhysicalOriginalBytes(current,doc.versionId)
    }
    const existing=getTemplate(input.templateId,version)
    if(existing&&(!isAuthoringCandidateDraft(input.templateId,version)||
      !existing.sourceNote?.startsWith('D1_AUTHORING_CANDIDATE: B1')))
      throw Error('B1_TEMPLATE_VERSION_OCCUPIED')
    if(!existing){
      const shell:TemplateVersion={
        templateId:input.templateId,version,schemaVersion:2,name:author.name,description:author.purpose,
        sourceNote:'D1_AUTHORING_CANDIDATE: B1 local technical draft',
        catalogKind:'custom',objectType:'document',displayName:{template:author.name},
        fields:[],materialSlots:[],policyVersionIds:[],policyRefs:[],sections:[],
        stages:[{id:'review',name:'Pi 自定义预审',kind:'manual-review',executorRole:'reviewer'}],
        outputs:[{id:'review-feedback',kind:'item-feedback',audience:'reviewer'}],
        status:'draft',createdAt:new Date().toISOString(),
      }
      saveAuthoringCandidateDraft(shell)
    }
    const targets:D2TargetBinding[]=author.targets.map((item,i)=>({
      kind:'custom-object',
      objectKey:'b1-'+sha([i,item.objectKey]).slice(0,24),
      subjectId:'b1-'+sha([i,item.subjectId]).slice(0,24),
      title:item.objectKey,
    }))
    const byKey=new Map(author.targets.map((item,i)=>[item.targetKey,targets[i]!]))
    const subjects:ReviewSubject[]=author.targets.map((item,i)=>{
      const t=targets[i]!,fields:ReviewSubject['fields']={
        b1ObjectKey:{kind:'text',value:item.objectKey},
        b1Scenario:{kind:'text',value:item.scenario},
      }
      for(const [key,value] of Object.entries(item.fieldValues)){
        if(value===null)continue
        fields[key]=typeof value==='number'?{kind:'number',value}:
          typeof value==='boolean'?{kind:'boolean',value}:{kind:'text',value}
      }
      return {id:t.subjectId,title:item.objectKey,type:'custom',fields,
        sectionId:'d2-scope-'+sha(t.objectKey).slice(0,16),
        sourceRefs:[],correction:'user-confirmed',status:'confirmed'}
    })
    const sourceMap=new Map(descriptor.sourceLedger.map(s=>[s.sourceId,s]))
    const rules:RuleSpec[]=[],mapping:D2RuntimePlan['mapping']=[]
    for(const [i,b] of descriptor.bindingDetails.entries()){
      const t=byKey.get(b.targetKey)
      if(!t)throw Error('B1_TARGET_NOT_FOUND')
      const id='d2-'+sha([input.templateId,version,b.checkKey,b.targetKey]).slice(0,20)
      const authority=b.sourceIds.every(s=>sourceMap.get(s)?.kind==='user-declared')
        ? 'request-scope' : 'unverified-policy'
      // 新公共兜底B1来源已由Main锁定到本案DocumentVersion；把这些真实版本
      // 写入RuleSpec而非临时作者sourceId，旧B1作者入口继续保留原先映射语义。
      const physicalSourceIds=author.templateId.startsWith('fallback-')
        ? [...b.sourceVersionIds]:[...b.sourceIds]
      rules.push({
        id,policyVersionId:'workspace:b1-'+input.templateId+'@'+frozen.revision,
        title:b.responsibility,
        requirement:[b.requirement,author.purpose,'原对象：'+b.objectKey,
          '来源：'+b.sourceIds.map(s=>s+'/'+(sourceMap.get(s)?.documentVersionId??'未知')).join('、')].join('\n'),
        when:{all:[]},sectionId:'d2-scope-'+sha(t.objectKey).slice(0,16),
        targetScope:'subject',execution:'semantic',semanticOutputEnum:['compliant','non-compliant'],
        onFail:'manual-review',onUnknown:'needs-confirmation',sourceRefIds:physicalSourceIds,
        priority:50000+i,confirmation:authority==='request-scope'?'confirmed':'unconfirmed',
      })
      mapping.push({checkId:b.checkKey+'#'+b.targetKey,ruleId:id,
        objectKey:t.objectKey,subjectId:t.subjectId,sourceIds:physicalSourceIds,
        authority,applicability:b.applicability})
    }
    if(!mapping.length)throw Error('B1_PLAN_HAS_NO_CHECKS')
    const bare:Omit<D2RuntimePlan,'fingerprint'>={
      schemaVersion:1,mode:'technical-pre-review',publicationAllowed:false,
      workspaceId:'b1-'+input.templateId,revision:frozen.revision,
      templateId:input.templateId,templateVersion:version,
      authoringDigest:descriptor.authorDigest,
      previewFingerprint:descriptor.canonicalPlan.fingerprint,targets,subjects,rules,mapping,
    }
    const plan:D2RuntimePlan={...bare,fingerprint:sha(bare)}
    assertC0ReviewMainSender(event)
    const result=await submitCommand(input.caseId,{
      requestId:'native-b1-'+randomUUID(),type:'AttachB1LocalTechnicalPlan',
      actor,expectedRevision:current.caseV2.revision,
      payload:{templateId:input.templateId,version,plan},
    },(aggregate,payload)=>{
      assertC0ReviewMainSender(event)
      if(!isNativeWorkspaceCaseV3(aggregate)||aggregate.d2RuntimePlan||
        aggregate.canonicalPlan||aggregate.caseV2.stage!=='draft'||
        aggregate.caseV2.templateId!=='pending-template-v3'||
        aggregate.caseV2.subjects.length||aggregate.caseV2.reviewRules?.length)
        throw Error('B1_NATIVE_CASE_CHANGED')
      return {summary:'本机第51套作者候选固定为 Pi 技术预审计划',mutate:draft=>{
        draft.caseV2.templateId=payload.templateId
        draft.caseV2.templateVersion=payload.version
        draft.caseV2.objectType='document'
        draft.caseV2.subjects.push(...structuredClone(payload.plan.subjects))
        draft.caseV2.reviewRules=structuredClone(payload.plan.rules)
        draft.caseV2.caseFields={...draft.caseV2.caseFields,
          d2PlanFingerprint:{kind:'text',value:payload.plan.fingerprint}}
        draft.d2RuntimePlan=structuredClone(payload.plan)
      }}
    })
    if(!result.ok)throw Error(result.code+': '+result.message)
    const problems=verifyD2InstalledPlan(result.aggregate)
    if(problems.length)throw Error('B1_INSTALLED_PLAN_INCONSISTENT: '+problems.join('; '))
    return {caseId:input.caseId,templateId:input.templateId,templateVersion:version,
      checks:mapping.length,fingerprint:plan.fingerprint}
  })
}
