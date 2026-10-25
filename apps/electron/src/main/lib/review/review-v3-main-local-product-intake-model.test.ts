import {describe,expect,test} from 'bun:test'
import {mkdtempSync,rmSync,unlinkSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import type {DocumentVersion,TemplateDeepMatchResponse} from '@profer/shared'
import {buildC11DeepMatchEvidence,buildRouteCandidatesForRead,
  trustedC11ModelAutoCandidates} from './review-v3-main-local-product-intake'
import {classifyD4ApplicationDocuments,
  hasConflictingD4BusinessDeclarations} from './review-v3-d4-content-router'
import {planB3ConservativeRouting} from './review-intake-routing-adapter-v3-b3'
import type {B2MaterialCandidate} from './review-intake-adapter-v3-b2'

const catalog=[
  {templateId:'published',templateVersion:'1',name:'已发布业务',availability:'authorized-for-technical-selection' as const},
  {templateId:'held',templateVersion:'1',name:'待确认业务',availability:'candidate-held' as const},
]
function result(matches:TemplateDeepMatchResponse['matches'],scope:TemplateDeepMatchResponse['scope']='matched'):TemplateDeepMatchResponse {
  return {provider:'generic-model',scope,matches,reason:'仅为模板候选'}
}

describe('C11 Main-verified model suggestions',()=>{
  test('only current authorized high-confidence IDs can enter the Main countdown',()=>{
    const candidates=trustedC11ModelAutoCandidates(result([
      {templateId:'published',templateVersion:'1',confidence:0.96,reason:'业务材料对应'},
      {templateId:'held',templateVersion:'1',confidence:1,reason:'不得提权'},
      {templateId:'outside',templateVersion:'1',confidence:1,reason:'目录外'},
    ]),catalog)
    expect(candidates.map(item=>item.templateId)).toEqual(['published'])
    expect(candidates[0]?.evidence).toContain('业务材料对应')
  })
  test('low-confidence and uncertain responses do not trigger auto-binding',()=>{
    const weak={templateId:'published',templateVersion:'1',confidence:0.85,reason:'仍不明确'}
    expect(trustedC11ModelAutoCandidates(result([weak]),catalog)).toEqual([])
    expect(trustedC11ModelAutoCandidates(result([{...weak,confidence:1}],'uncertain'),catalog)).toEqual([])
  })
  test('verified model candidate uses the existing B3 clock and source evidence',()=>{
    const matched=trustedC11ModelAutoCandidates(result([
      {templateId:'published',templateVersion:'1',confidence:0.99,reason:'事项及办理动作吻合'},
    ]),catalog)
    const materials=[{
      candidateId:'m1',caseCandidateId:'c1',ownerId:'owner',ownerGeneration:1,
      status:'accepted',role:'application',subjectId:'s1',rawSha256:'a'.repeat(64),
    }] as B2MaterialCandidate[]
    const suggestion=matched.map((item,index)=>({
      templateId:item.templateId,templateVersion:item.templateVersion,
      availability:'authorized-for-technical-selection' as const,
      confidence:item.confidence,rank:-index,caseCandidateId:'c1',
      evidence:materials.map(material=>({materialCandidateId:material.candidateId,
        rawSha256:material.rawSha256,reason:item.evidence})),
    }))
    const input={startedAtMs:1000,automaticSelectionEnabled:true,userInterrupted:false,
      materialCandidates:materials,suggestions:suggestion}
    expect(planB3ConservativeRouting({...input,nowMs:2000}).status).toBe('countdown')
    const selected=planB3ConservativeRouting({...input,nowMs:21_000})
    expect(selected.status).toBe('default-selected')
    expect(selected.chosen).toEqual({templateId:'published',templateVersion:'1'})
    expect(planB3ConservativeRouting({...input,nowMs:21_000,userInterrupted:true}).chosen).toBeUndefined()
  })
})

const material=(id:string,role:DocumentVersion['role'],declaration:string):DocumentVersion=>({
  documentId:id,versionId:id,contentHash:'hash-'+id,role,fileName:id+'.pdf',
  mimeType:'application/pdf',sizeBytes:16,assetPath:id,parseRevision:1,
  parseStatus:'parsed',usage:'unread',blocks:[{blockId:id,kind:'text',text:declaration}],
})
const businessCatalog=[{templateId:'g03-t01',templateVersion:'1',name:'教室借用',
  availability:'authorized-for-technical-selection' as const}]

describe('F04 多原件模板路由',()=>{
  test('未识别申请主件仍可建议模板，但不得凭临时附件自动确认',()=>{
    const docs=[material('unassigned','attachment','申请事项：教室借用')]
    expect(buildRouteCandidatesForRead(businessCatalog,docs)).toEqual(expect.arrayContaining([
      expect.objectContaining({templateId:'g03-t01',autoEligible:false}),
    ]))
    expect(classifyD4ApplicationDocuments(businessCatalog,docs)[0]?.autoEligible).toBe(false)
  })

  test('两份申请主件共同指向同一事项，不能因数量不等于一而拒绝',()=>{
    const docs=[material('first','application','申请事项：教室借用'),
      material('second','application','申请事项：教室借用')]
    const candidates=buildRouteCandidatesForRead(businessCatalog,docs)
    expect(candidates[0]).toMatchObject({templateId:'g03-t01',autoEligible:true})
    expect(hasConflictingD4BusinessDeclarations(docs)).toBe(false)
  })

  test('冲突业务声明不得自动选定，多份原件仍全部进入深匹配证据',()=>{
    const docs=[material('first','application','申请事项：教室借用'),
      material('second','application','申请事项：校园卡申领')]
    expect(hasConflictingD4BusinessDeclarations(docs)).toBe(true)
    expect(classifyD4ApplicationDocuments(businessCatalog,docs)).toEqual([])
    expect(buildRouteCandidatesForRead(businessCatalog,docs).every(item=>!item.autoEligible)).toBe(true)
    const five=[...docs,material('third','evidence','现场说明'),
      material('fourth','rule','场地规则'),material('fifth','attachment','时间安排')]
    const evidence=buildC11DeepMatchEvidence(five)
    expect(five.every(doc=>evidence.includes('材料名称：'+doc.fileName))).toBe(true)
  })
})

describe('C11 缓存会话的读取授权重验',()=>{
  test('授权状态未知或授权源故障只提醒；原件完整性仍在每次缓存读取时核验',async()=>{
    const root=mkdtempSync(join(tmpdir(),'c11-cache-gate-'))
    const previousConfig=process.env.PROFER_CONFIG_DIR
    const previousBlock=process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK
    process.env.PROFER_CONFIG_DIR=root
    delete process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK
    let setMainWindow:((window:unknown)=>void)|undefined
    try{
      const {createNativeWorkspaceCaseV3,registerNativeWorkspaceMaterialV3}=
        await import('./native-workspace-case-v3')
      const {readAggregate}=await import('./case-store-v2')
      const {REVIEW_IPC_CHANNELS}=await import('@profer/shared')
      const {installC11LocalNativeProductIntake}=await import('./review-v3-main-local-product-intake')
      const windowState=await import('../main-window-state')
      setMainWindow=windowState.setMainWindow as (window:unknown)=>void
      const actor={actorId:'local-reviewer',actorSource:'local',role:'reviewer'} as const
      const created=await createNativeWorkspaceCaseV3({
        title:'C11 缓存授权重验',type:'自定义审核',applicant:'本地测试申请人',
        domainPackId:'custom',
      },actor)
      const caseId=created.view.id
      const sourcePath=join(root,'application.txt')
      writeFileSync(sourcePath,'申请事项：教室借用\n仅用于本地定向授权测试。')
      await registerNativeWorkspaceMaterialV3(caseId,sourcePath,'application',actor)

      const frame={id:1,routingId:0}
      const sender={id:207,mainFrame:frame,isDestroyed:()=>false}
      setMainWindow({isDestroyed:()=>false,webContents:sender})
      const hooks=(globalThis as typeof globalThis & {
        __proferElectronTestHooks:{ipcMainHandlers:Map<string,(...args:unknown[])=>unknown>}
      }).__proferElectronTestHooks
      hooks.ipcMainHandlers.clear()
      installC11LocalNativeProductIntake()
      const invoke=()=>{
        const handler=hooks.ipcMainHandlers.get(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_CURRENT_V3)
        if(!handler)throw new Error('测试未注册 LOCAL_PRODUCT_CURRENT_V3')
        return handler({sender,senderFrame:frame},caseId)
      }

      // 第一次读取通过并建立 session 缓存。
      const first=invoke() as {read:{caseCandidateId:string};sessionKey:string}
      expect(first.read.caseCandidateId).toBe(caseId)
      expect(first.sessionKey).toBeTruthy()

      // 未知或不可用授权状态只应提醒，不应阻止仍然完整的原件读取。
      process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK='1'
      const warned=invoke() as {read:{caseCandidateId:string};sessionKey:string}
      expect(warned.read.caseCandidateId).toBe(caseId)
      expect(warned.sessionKey).toBe(first.sessionKey)

      process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK='throw'
      const authorityUnavailable=invoke() as {read:{caseCandidateId:string};sessionKey:string}
      expect(authorityUnavailable.read.caseCandidateId).toBe(caseId)
      expect(authorityUnavailable.sessionKey).toBe(first.sessionKey)

      // The advisory gate must not weaken the independent physical-byte check.
      const aggregate=readAggregate(caseId)!
      const original=join(root,'review-cases',caseId,
        aggregate.caseV2.documents[0]!.assetPath)
      unlinkSync(original)
      expect(invoke).toThrow(/物理原件无法从案卷受控目录读取并重新核验/)
    }finally{
      setMainWindow?.(null)
      if(previousConfig===undefined)delete process.env.PROFER_CONFIG_DIR
      else process.env.PROFER_CONFIG_DIR=previousConfig
      if(previousBlock===undefined)delete process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK
      else process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK=previousBlock
      rmSync(root,{recursive:true,force:true})
    }
  })
})
