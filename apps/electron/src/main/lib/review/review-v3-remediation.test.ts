import { afterAll, describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Actor, D2RuntimePlan, ReviewRunV2, TemplateVersion } from '@profer/shared'

const root = mkdtempSync(join(tmpdir(), 'v3-f05-'))
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))

const { createNativeWorkspaceCaseV3, registerNativeWorkspaceMaterialV3 } = await import('./native-workspace-case-v3')
const { readAggregate, submitCommand } = await import('./case-store-v2')
const { proposeNativeRemediationV3, applyNativeRemediationV3 } = await import('./review-v3-remediation')
const { saveAuthoringCandidateDraft } = await import('./template-store')
const { computeRunInputHash } = await import('./run-service-v2')
const { saveRunV2 } = await import('./run-store-v2')
const { isWorkspaceRunStaleV2 } = await import('./workspace-business-service-v2')
const { resolveT05BusinessMode } = await import('./review-v3-t05-main-service')
const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
let sequence=0
const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
async function fixture() {
  const id=++sequence
  const file=join(root,'source-'+id+'.txt')
  writeFileSync(file,'原始材料版本 '+id)
  const created=await createNativeWorkspaceCaseV3({title:'F05 修复案卷 '+id,type:'自定义审核',applicant:'申请人',domainPackId:'contract-review',reviewTemplate:null},actor)
  await registerNativeWorkspaceMaterialV3(created.aggregate.caseV2.id,file,'application',actor)
  const current=readAggregate(created.aggregate.caseV2.id)!
  return {id:created.aggregate.caseV2.id,version:current.caseV2.documents[0]!.versionId}
}
function propose(id:string,version:string,requestId:string) {
  const revision=readAggregate(id)!.caseV2.revision
  return proposeNativeRemediationV3({caseId:id,requestId,expectedRevision:revision,actor,
    payload:{documentVersionId:version,nextRole:'evidence',reason:'该文件实际用于证明申请事实'}})
}
function apply(id:string,proposalId:string,requestId:string,ack?:string) {
  return applyNativeRemediationV3({caseId:id,requestId,expectedRevision:readAggregate(id)!.caseV2.revision,actor,
    payload:{proposalId,...(ack?{acknowledgedD2Fingerprint:ack,
      rebuildAcknowledgement:'我确认旧技术预审计划及审核结果失效'}:{})}})
}
async function seedD2(id:string):Promise<D2RuntimePlan> {
  const shell: TemplateVersion={
    templateId:'f05-candidate',version:1,schemaVersion:2,name:'本地候选',
    objectType:'document',displayName:{template:'F05'},
    status:'draft',createdAt:new Date().toISOString(),
    sourceNote:'D1_AUTHORING_CANDIDATE: F05 local technical draft',
    catalogKind:'custom',fields:[],materialSlots:[],policyVersionIds:[],policyRefs:[],sections:[],
    outputs:[{id:'review-feedback',kind:'item-feedback',audience:'reviewer'}],
    stages:[{id:'review',name:'本地预审',kind:'manual-review',executorRole:'reviewer'}],
  }
  saveAuthoringCandidateDraft(shell)
  const bare:Omit<D2RuntimePlan,'fingerprint'>={
    schemaVersion:1,mode:'technical-pre-review',publicationAllowed:false,
    workspaceId:'f05-candidate',revision:1,templateId:'f05-candidate',templateVersion:1,
    authoringDigest:'a'.repeat(64),previewFingerprint:'b'.repeat(64),
    targets:[],subjects:[],rules:[],mapping:[],
  }
  const plan:D2RuntimePlan={...bare,fingerprint:digest(bare)}
  const result=await submitCommand(id,{requestId:'seed-d2-'+id,actor,
    expectedRevision:readAggregate(id)!.caseV2.revision,type:'SeedD2TestOnly',payload:plan},
    (_state,payload)=>({summary:'测试专用 D2 任务包',mutate:draft=>{
      draft.caseV2.templateId=payload.templateId
      draft.caseV2.templateVersion=payload.templateVersion
      draft.caseV2.caseFields.d2PlanFingerprint={kind:'text',value:payload.fingerprint}
      draft.d2RuntimePlan=structuredClone(payload)
    }}))
  expect(result.ok).toBe(true)
  return plan
}

function seedReviewRun(id:string,status:ReviewRunV2['status']='completed'):ReviewRunV2 {
  const aggregate=readAggregate(id)!,state=aggregate.caseV2
  const run:ReviewRunV2={
    id:'run-f05-'+sequence+'-'+status,caseId:id,
    templateId:state.templateId,templateVersion:state.templateVersion,
    inputManifest:{hash:computeRunInputHash(state,[],[]),templateVersion:state.templateVersion,
      policyVersions:[],documentVersions:state.documents.map(doc=>({
        documentId:doc.documentId,versionId:doc.versionId,contentHash:doc.contentHash,
      })),observationIds:[],evidenceLinkIds:[]},
    status,checkpoints:[],checks:[],opinions:[],diagnostics:[],
    coverage:{documents:[],plannedChecks:0,completedChecks:0,effectiveVerdicts:0,pendingChecks:0},
    startedAt:new Date().toISOString(),completedAt:status==='completed'?new Date().toISOString():undefined,
  }
  saveRunV2(run)
  return run
}

describe('F05 人工纠错 → 计划重建 → 旧输入失效',()=>{
  test('纠错只是提案：磁盘冷读不修改材料/Run 输入；执行后保留原件并使旧哈希失效',async()=>{
    const f=await fixture(),before=readAggregate(f.id)!
    const oldHash=computeRunInputHash(before.caseV2,[],[])
    const proposal=await propose(f.id,f.version,'proposal-1')
    expect(proposal.ok).toBe(true)
    const replay=await proposeNativeRemediationV3({caseId:f.id,requestId:'proposal-1',actor,
      expectedRevision:before.caseV2.revision,
      payload:{documentVersionId:f.version,nextRole:'evidence',reason:'该文件实际用于证明申请事实'}})
    expect(replay.ok).toBe(true)
    const run=seedReviewRun(f.id)
    expect(isWorkspaceRunStaleV2(readAggregate(f.id)!,run.id)).toBe(false)
    const persisted=readAggregate(f.id)!
    expect(persisted.remediationRecords?.[0]?.status).toBe('proposed')
    expect(persisted.caseV2.documents[0]?.role).toBe('application')
    expect(computeRunInputHash(persisted.caseV2,[],[])).toBe(oldHash)
    const proposalId=persisted.remediationRecords![0]!.id
    const result=await apply(f.id,proposalId,'apply-1')
    expect(result.ok).toBe(true)
    const receiptReplay=await applyNativeRemediationV3({caseId:f.id,requestId:'apply-1',
      expectedRevision:persisted.caseV2.revision,actor,payload:{proposalId}})
    expect(receiptReplay.ok).toBe(true)
    const after=readAggregate(f.id)!
    expect(after.caseV2.documents[0]).toMatchObject({versionId:f.version,role:'evidence',active:true})
    expect(after.remediationRecords?.[0]?.status).toBe('applied')
    expect(after.sourceValidityRevocations?.at(-1)?.reason).toBe('reclassify')
    expect(after.receiptLog.at(-1)?.type).toBe('ApplyNativeRemediationV3')
    expect(after.receiptLog.filter(item=>item.type==='ApplyNativeRemediationV3')).toHaveLength(1)
    expect(computeRunInputHash(after.caseV2,[],[])).not.toBe(oldHash)
    expect(isWorkspaceRunStaleV2(after,run.id)).toBe(true)
    expect((await apply(f.id,proposalId,'apply-twice')).ok).toBe(false)
  })

  test('冻结 D2 未获得精确 ACK 不得写入；明确重建后保留旧计划，冻结态清零以阻断旧 Run',async()=>{
    const f=await fixture(),old=await seedD2(f.id)
    const before=readAggregate(f.id)!,oldHash=computeRunInputHash(before.caseV2,[],[])
    const proposed=await propose(f.id,f.version,'proposal-d2')
    expect(proposed.ok).toBe(true)
    const proposalId=readAggregate(f.id)!.remediationRecords![0]!.id
    const denied=await apply(f.id,proposalId,'without-ack')
    expect(denied.ok).toBe(false)
    expect(readAggregate(f.id)?.d2RuntimePlan?.fingerprint).toBe(old.fingerprint)
    const wrong=await apply(f.id,proposalId,'wrong-ack','c'.repeat(64))
    expect(wrong.ok).toBe(false)
    const applied=await apply(f.id,proposalId,'correct-ack',old.fingerprint)
    expect(applied.ok).toBe(true)
    const after=readAggregate(f.id)!
    expect(after.d2RuntimePlan).toBeUndefined()
    expect(after.d2RuntimePlanHistory?.[0]?.fingerprint).toBe(old.fingerprint)
    expect(after.caseV2.templateId).toBe('pending-template-v3')
    expect(after.caseV2.templateVersion).toBe(0)
    expect(after.caseV2.caseFields.d2PlanFingerprint).toBeUndefined()
    expect(after.caseV2.reviewRules).toEqual([])
    expect(after.remediationRecords?.[0]?.invalidatedPlanFingerprint).toBe(old.fingerprint)
    expect(computeRunInputHash(after.caseV2,[],[])).not.toBe(oldHash)
  })

  test('本地单用户在正式计划下可纠错，但必须确认原指纹，旧正式效力撤销并保留历史',async()=>{
    const f=await fixture()
    const bound=await submitCommand(f.id,{requestId:'canonical-fixture',actor,
      expectedRevision:readAggregate(f.id)!.caseV2.revision,type:'SeedCanonicalTestOnly',payload:'canonical'},
      ()=>({summary:'测试冻结状态',mutate:draft=>{draft.canonicalPlan={
        schemaVersion:'review-c0/1',planId:'formal-1',fingerprint:'a'.repeat(64),
        templateId:draft.caseV2.templateId,templateVersion:String(draft.caseV2.templateVersion),
        moduleDigests:['b'.repeat(64)],bindings:[],
      }}}))
    expect(bound.ok).toBe(true)
    const tagged=await submitCommand(f.id,{requestId:'canonical-machine-marker',actor,
      expectedRevision:readAggregate(f.id)!.caseV2.revision,type:'SeedClassificationTestOnly',payload:{}},
      ()=>({summary:'模拟先前机器分类',mutate:draft=>{
        draft.caseV2.documents[0]!.automaticClassification={role:'application',source:'local-rules',
          reason:'机器曾把材料归入申请',at:new Date().toISOString()}
      }}))
    expect(tagged.ok).toBe(true)
    const oldRun=seedReviewRun(f.id)
    expect((await propose(f.id,f.version,'proposal-canonical')).ok).toBe(true)
    const proposalId=readAggregate(f.id)!.remediationRecords![0]!.id
    const denied=await apply(f.id,proposalId,'attempt-canonical')
    expect(denied.ok).toBe(false)
    const wrong=await applyNativeRemediationV3({caseId:f.id,requestId:'wrong-canonical-ack',
      expectedRevision:readAggregate(f.id)!.caseV2.revision,actor,
      payload:{proposalId,acknowledgedCanonicalFingerprint:'c'.repeat(64),
        rebuildAcknowledgement:'我确认旧正式审核计划及结果失效'}})
    expect(wrong.ok).toBe(false)
    const confirmed=await applyNativeRemediationV3({caseId:f.id,requestId:'confirmed-canonical-ack',
      expectedRevision:readAggregate(f.id)!.caseV2.revision,actor,
      payload:{proposalId,acknowledgedCanonicalFingerprint:'a'.repeat(64),
        rebuildAcknowledgement:'我确认旧正式审核计划及结果失效'}})
    expect(confirmed.ok).toBe(true)
    const after=readAggregate(f.id)!
    expect(after.canonicalPlan).toBeUndefined()
    expect(after.canonicalPlanHistory?.at(-1)?.planId).toBe('formal-1')
    expect(after.caseV2.templateId).toBe('pending-template-v3')
    expect(after.caseV2.reviewRules).toEqual([])
    expect(after.caseV2.caseFields.retiredCanonicalPlanFingerprint).toMatchObject({
      kind: 'text', value: 'a'.repeat(64),
    })
    expect(resolveT05BusinessMode(after).mode).toBe('technical-pre-review')
    expect(after.caseV2.documents[0]?.role).toBe('evidence')
    expect(after.caseV2.documents[0]?.automaticClassification).toBeUndefined()
    expect(after.caseV2.documents[0]?.classificationCorrection?.role).toBe('evidence')
    expect(after.remediationRecords?.[0]?.status).toBe('applied')
    expect(after.remediationRecords?.[0]?.invalidatedPlanFingerprint).toBe('a'.repeat(64))
    expect(isWorkspaceRunStaleV2(after,oldRun.id)).toBe(true)
  })

  test('旧材料版本、错误类别和并发 CAS 均拒绝，无半笔纠错',async()=>{
    const f=await fixture(),revision=readAggregate(f.id)!.caseV2.revision
    const wrong=await proposeNativeRemediationV3({caseId:f.id,requestId:'wrong-source',actor,
      expectedRevision:revision,payload:{documentVersionId:'not-here',nextRole:'evidence',reason:'这是一份足够长的理由'}})
    expect(wrong.ok).toBe(false)
    const proposed=await propose(f.id,f.version,'correct-source')
    expect(proposed.ok).toBe(true)
    const stale=await proposeNativeRemediationV3({caseId:f.id,requestId:'stale-revision',actor,
      expectedRevision:revision,payload:{documentVersionId:f.version,nextRole:'rule',reason:'这是并发操作导致的过期提案'}})
    expect(stale).toMatchObject({ok:false,code:'VERSION_CONFLICT'})
    expect(readAggregate(f.id)?.remediationRecords).toHaveLength(1)
  })

  test('Pi 正在运行时不得重分类；先停止当前 Run 才能使旧账本失效',async()=>{
    const f=await fixture()
    expect((await propose(f.id,f.version,'proposal-running')).ok).toBe(true)
    const proposalId=readAggregate(f.id)!.remediationRecords![0]!.id
    seedReviewRun(f.id,'running')
    const denied=await apply(f.id,proposalId,'apply-running')
    expect(denied).toMatchObject({ok:false,code:'INVALID_TRANSITION'})
    expect(readAggregate(f.id)?.caseV2.documents[0]?.role).toBe('application')
  })

  test('补件中纠错不继承旧请求的「已满足」假象：历史请求保留但不再阻断新 Run',async()=>{
    const f=await fixture(),now=new Date().toISOString()
    const seeded=await submitCommand(f.id,{requestId:'old-supplement',actor,
      expectedRevision:readAggregate(f.id)!.caseV2.revision,type:'SeedOldSupplementTestOnly',payload:{}},
      ()=>({summary:'旧初审补件测试',mutate:draft=>{
        draft.caseV2.stage='awaiting-supplement'
        draft.supplements.push({id:'sup-old',caseId:f.id,originFindingKeys:['check-old'],
          requiredElements:['证明附件'],reason:'旧运行指出附件缺失',responsibleRole:'student',
          status:'open',responses:[],createdAt:now,originRunId:'run-old'})
        draft.tasks.push({id:'task-old',caseId:f.id,stageId:'review',round:1,
          assigneeRole:'reviewer',status:'open',inputRevision:0,createdAt:now})
      }}))
    expect(seeded.ok).toBe(true)
    expect((await propose(f.id,f.version,'supp-proposal')).ok).toBe(true)
    const proposalId=readAggregate(f.id)!.remediationRecords![0]!.id
    expect((await apply(f.id,proposalId,'supp-apply')).ok).toBe(true)
    const restored=readAggregate(f.id)!
    expect(restored.supplements).toHaveLength(1)
    expect(restored.supplements[0]).toMatchObject({id:'sup-old',status:'cancelled',originRunId:'run-old'})
    expect(restored.tasks[0]).toMatchObject({id:'task-old',status:'cancelled'})
    expect(restored.caseV2.stage).toBe('draft')
    expect(restored.receiptLog.at(-1)?.summary).toContain('旧输入失效')
  })
})
