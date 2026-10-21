import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import {
  REVIEW_C0_SCHEMA_VERSION, REVIEW_V3_EXECUTION_SCHEMA, REVIEW_V3_RUN_SCHEMA,
  type Actor, type CanonicalPlan, type ReviewCaseV2, type RunEvidenceIdentity,
  type SourceIdentity, type V3ExecutionProposal,
} from '@profer/shared'
import { createAggregate, readAggregate, submitCommand, writeAggregate } from './case-store-v2'
import { executionProposalId, type V3VerifiedHostReceipt } from './review-v3-execution-contract'
import { admitV3TechnicalRun, recordV3TechnicalProposal } from './review-v3-technical-ledger'
import { sealV3ReviewRun, getV3ReviewRunRecord } from './review-v3-run-writer'

const root = join(import.meta.dir, '../../../../../../work/tmp', `review-v3-c2-seal-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const sha = 'a'.repeat(64)
const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
const plan: CanonicalPlan = {
  schemaVersion: REVIEW_C0_SCHEMA_VERSION, planId: 'frozen-synthetic-plan-1',
  fingerprint: sha, templateId: 'template-1', templateVersion: '2',
  moduleDigests: [sha], bindings: [{
    checkKey: 'R01', targetKey: 'subject:s1', objectKey: 'proof-1',
    subjectId: 's1', applicability: 'applicable',
    sourceVersionIds: ['v1'], conditionFingerprint: sha,
  }],
}
function run(id:string): RunEvidenceIdentity {
  return {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId:id, runId:`run-${id}`,
    caseRevision:1, planFingerprint:sha, templateVersion:'2',
    inputManifestHash:sha, sourceVersionIds:['v1'], checkKeys:['R01'],
    attemptId:'main-attempt-one',ownerGeneration:1,
  }
}
function source(id:string): SourceIdentity {
  return {
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,caseId:id,materialId:'d1',
    documentVersionId:'v1',rawSha256:sha,parseRevision:'parse-v1',
    blockId:'block-1',location:{kind:'paragraph',locator:'p1'},
  }
}
async function seed(id:string, stage:'reviewing'|'draft'='reviewing'): Promise<RunEvidenceIdentity> {
  const date='2026-10-20T00:00:00Z'
  const v:ReviewCaseV2={
    id,title:'C2 verified technical seal fixture',templateId:'template-1',
    templateVersion:2,objectType:'document',caseFields:{},
    subjects:[{id:'s1',type:'item',title:'Real subject',fields:{},sourceRefs:[],
      correction:'user-confirmed',status:'identified'}],
    documents:[{
      documentId:'d1',versionId:'v1',contentHash:sha,byteHash:sha,
      role:'application',fileName:'evidence.txt',mimeType:'text/plain',
      sizeBytes:8,assetPath:'source-docs/v1/evidence.txt',parseRevision:1,
      parseStatus:'parsed',blocks:[{
        blockId:'block-1',text:'Content',kind:'text',
        location:{kind:'paragraph',index:0},
      }],usage:'registered',active:true,
    }],stage,revision:0,createdAt:date,updatedAt:date,
  }
  await createAggregate(id,v)
  // Synthetic verified fixture injected directly: this DOES NOT prove
  // published policy/real bytes. Production C plan publisher is separate.
  const agg=readAggregate(id)!
  agg.canonicalPlan=structuredClone(plan)
  writeAggregate(agg)
  const identity=run(id)
  const admitted=await admitV3TechnicalRun(id,{
    requestId:`admit-${id}`,expectedRevision:0,actor,payload:identity,
  },()=>{})
  expect(admitted.ok).toBe(true)
  return identity
}
function payload(id:string,identity:RunEvidenceIdentity,seq:number,
  kind:'read'|'check'|'terminal',receiptId:string,
  status:'accepted'|'unknown'='accepted'): V3ExecutionProposal {
  const base={
    schemaVersion:REVIEW_V3_EXECUTION_SCHEMA,run:identity,sequence:seq,
    permissionGrantId:'main-grant',hostReceiptId:receiptId,
  }
  if(kind==='read'){
    const event={...base,kind:'read' as const,
      read:{source:source(id),extent:'block' as const}}
    return {...event,eventId:executionProposalId(event)}
  }
  if(kind==='check'){
    const event={...base,kind:'check' as const,
      check:{checkKey:'R01',targetKey:'subject:s1',objectKey:'proof-1',
        subjectId:'s1',status}}
    return {...event,eventId:executionProposalId(event)}
  }
  const event={...base,kind:'terminal' as const,
    terminal:{status:'completed-technical' as const}}
  return {...event,eventId:executionProposalId(event)}
}
function attestHost(event:V3ExecutionProposal) {
  let receipt: V3VerifiedHostReceipt
  if (event.kind==='read') receipt={
    kind:'read',permissionGrantId:'main-grant',
    source:event.read.source,extent:event.read.extent,
  }
  else if(event.kind==='check') receipt={
    kind:'check',permissionGrantId:'main-grant',check:event.check,
  }
  else receipt={kind:'terminal',permissionGrantId:'main-grant',
    terminalStatus:event.terminal.status}
  return {permissionGrantId:'main-grant',grantActive:true,
    receipts:new Map<string,V3VerifiedHostReceipt>([[event.hostReceiptId,receipt]])}
}
async function record(id:string,identity:RunEvidenceIdentity,seq:number,
  kind:'read'|'check'|'terminal',status:'accepted'|'unknown'='accepted') {
  const event=payload(id,identity,seq,kind,`receipt-${id}-${seq}`,status)
  const result=await recordV3TechnicalProposal(id,{
    requestId:event.eventId,expectedRevision:seq,actor,payload:event,
  },(_,proposal)=>attestHost(proposal))
  expect(result.ok).toBe(true)
  return event
}
async function seal(id:string,terminalEventId:string,expectedRevision:number,
  verify: Parameters<typeof sealV3ReviewRun>[2] = ()=>{}) {
  return sealV3ReviewRun(id,{
    requestId:`seal-${id}`,expectedRevision,actor,
    payload:{runId:`run-${id}`,terminalEventId},
  },verify)
}

describe('Dev-C C2-R01 Case-authoritative immutable technical Run seal',()=>{
  test('physical Read → verified Check → terminal → single CAS sealed Run; never Decision',async()=>{
    const id='c2-seal-complete-1'
    const identity=await seed(id)
    const read=await record(id,identity,1,'read')
    const check=await record(id,identity,2,'check')
    const terminal=await record(id,identity,3,'terminal')
    const first=await seal(id,terminal.eventId,4,(_,r,ev)=>{
      expect(r.runId).toBe(identity.runId)
      expect(ev.map(e=>e.eventId)).toEqual([read.eventId,check.eventId,terminal.eventId])
    })
    expect(first.ok).toBe(true)
    if(!first.ok) return
    expect(first.entity?.schemaVersion).toBe(REVIEW_V3_RUN_SCHEMA)
    expect(first.entity?.state).toBe('requires-human-review')
    expect(first.entity?.coverage).toMatchObject({
      totalBindings:1,observedBindings:1,unobservedBindings:0,blockedApplicability:0,
    })
    expect(first.entity?.boundChecks[0]).toMatchObject({
      technicalStatus:'accepted',eventId:check.eventId,decisionEligible:false,
    })
    expect(first.entity?.readEvidence[0]?.eventId).toBe(read.eventId)
    expect(first.entity?.eventChainDigest).toMatch(/^[a-f0-9]{64}$/)
    const state=readAggregate(id)!
    expect(state.caseV2.revision).toBe(5)
    expect(state.receiptLog.map(r=>r.type)).toEqual([
      'AdmitV3TechnicalRun',
      'RecordV3TechnicalProposal','RecordV3TechnicalProposal',
      'RecordV3TechnicalProposal','SealV3ReviewRun',
    ])
    expect(state.decisions).toHaveLength(0)
    expect(state.observations).toHaveLength(0)
    expect(state.caseV2.stage).toBe('reviewing')
    expect(getV3ReviewRunRecord(id)?.run.runId).toBe(identity.runId)
    const replay=await seal(id,terminal.eventId,4)
    expect(replay.ok).toBe(true)
    expect(readAggregate(id)?.caseV2.revision).toBe(5)
    const clone=getV3ReviewRunRecord(id)!
    clone.boundChecks[0]!.technicalStatus='rejected'
    expect(getV3ReviewRunRecord(id)?.boundChecks[0]?.technicalStatus).toBe('accepted')
  })

  test('technical completion with no Check remains incomplete, never fabricated pass',async()=>{
    const id='c2-seal-unobserved-2'
    const identity=await seed(id)
    const term=await record(id,identity,1,'terminal')
    const result=await seal(id,term.eventId,2)
    expect(result.ok).toBe(true)
    if(!result.ok)return
    expect(result.entity?.state).toBe('incomplete')
    expect(result.entity?.coverage).toMatchObject({
      totalBindings:1,observedBindings:0,unobservedBindings:1,
    })
    expect(result.entity?.boundChecks[0]?.technicalStatus).toBeNull()
    expect(result.entity?.boundChecks[0]?.decisionEligible).toBe(false)
    expect(readAggregate(id)?.decisions).toEqual([])
  })

  test('an alleged positive Check with no preceding physical Read cannot be sealed',async()=>{
    const id='c2-seal-unread-check-3'
    const identity=await seed(id)
    await record(id,identity,1,'check')
    const term=await record(id,identity,2,'terminal')
    const refused=await seal(id,term.eventId,3)
    expect(refused.ok).toBe(false)
    if(!refused.ok)expect(refused.message).toContain('真实 Host 原件读取')
    expect(readAggregate(id)?.v3ReviewRun).toBeUndefined()
    expect(readAggregate(id)?.caseV2.revision).toBe(3)
  })

  test('duplicate Check per immutable binding is rejected, not last-event-wins',async()=>{
    const id='c2-seal-duplicate-check-4'
    const identity=await seed(id)
    await record(id,identity,1,'read')
    await record(id,identity,2,'check')
    await record(id,identity,3,'check')
    const terminal=await record(id,identity,4,'terminal')
    const denied=await seal(id,terminal.eventId,5)
    expect(denied.ok).toBe(false)
    if(!denied.ok) expect(denied.message).toContain('重复观察')
    expect(readAggregate(id)?.v3ReviewRun).toBeUndefined()
  })

  test('missing Main closure attestor, wrong terminal ID and wrong Case state refuse seal',async()=>{
    const id='c2-seal-trust-5'
    const identity=await seed(id,'draft')
    const term=await record(id,identity,1,'terminal')
    expect(()=> sealV3ReviewRun(id,{
      requestId:'seal-missing',expectedRevision:2,actor,
      payload:{runId:identity.runId,terminalEventId:term.eventId},
    },undefined as never)).toThrow('ATTESTATION')
    expect((await seal(id,term.eventId,2)).ok).toBe(false)
    const changed=readAggregate(id)!
    changed.caseV2.stage='reviewing'
    writeAggregate(changed)
    // Off-ledger change without the original frozen input Receipt is NOT safe.
    expect((await seal(id,term.eventId,2)).ok).toBe(false)
    expect(readAggregate(id)?.v3ReviewRun).toBeUndefined()
  })

  test('corrupt event body, stolen host receipt and changed business source remain quarantined',async()=>{
    const id='c2-seal-tamper-6'
    const identity=await seed(id)
    await record(id,identity,1,'read')
    const term=await record(id,identity,2,'terminal')
    const aggregate=readAggregate(id)!
    const originalEvent=aggregate.v3TechnicalExecution!.events[0]!
    if(originalEvent.proposal.kind!=='read')throw new Error('bad fixture')
    originalEvent.proposal.read.source.rawSha256='b'.repeat(64)
    writeAggregate(aggregate)
    const denied=await seal(id,term.eventId,3)
    expect(denied.ok).toBe(false)
    expect(readAggregate(id)?.v3ReviewRun).toBeUndefined()
    expect(readAggregate(id)?.decisions).toHaveLength(0)
  })

  test('one sealed Run cannot be overwritten using a new transaction ID',async()=>{
    const id='c2-seal-no-overwrite-7'
    const identity=await seed(id)
    const term=await record(id,identity,1,'terminal')
    const first=await seal(id,term.eventId,2)
    expect(first.ok).toBe(true)
    const second=await sealV3ReviewRun(id,{
      requestId:'seal-replace-run',expectedRevision:3,actor,
      payload:{runId:identity.runId,terminalEventId:term.eventId},
    },()=>{})
    expect(second.ok).toBe(false)
    expect(readAggregate(id)?.receiptLog.filter(r=>r.type==='SealV3ReviewRun')).toHaveLength(1)
  })

  test('out-of-band input changes after terminal cannot pass an apparently valid closure',async()=>{
    const id='c2-seal-after-terminal-change-8'
    const identity=await seed(id)
    const term=await record(id,identity,1,'terminal')
    const changed=readAggregate(id)!
    changed.caseV2.documents[0]!.byteHash='b'.repeat(64)
    writeAggregate(changed)
    const denied=await seal(id,term.eventId,2)
    expect(denied.ok).toBe(false)
    expect(readAggregate(id)?.v3ReviewRun).toBeUndefined()
  })

  test('a concurrent C business change with CAS receipt blocks old frozen Run seal',async()=>{
    const id='c2-seal-revision-9'
    const identity=await seed(id)
    const term=await record(id,identity,1,'terminal')
    const changed=await submitCommand(id,{
      requestId:'human-business-after-run',expectedRevision:2,actor,
      type:'ModifyBusinessAfterHostTerminal',payload:{newTitle:'changed'},
    },()=>({summary:'Synthetic unrelated Case edit',mutate:a=>{
      a.caseV2.title='changed'
    }}))
    expect(changed.ok).toBe(true)
    const refused=await seal(id,term.eventId,3)
    expect(refused.ok).toBe(false)
    expect(readAggregate(id)?.v3ReviewRun).toBeUndefined()
  })
  test('read-only historical Run remains visible after an authorized later Case change',async()=>{
    const id='c2-seal-readable-history-10'
    const identity=await seed(id)
    await record(id,identity,1,'read')
    await record(id,identity,2,'check')
    const terminal=await record(id,identity,3,'terminal')
    expect((await seal(id,terminal.eventId,4)).ok).toBe(true)
    expect(getV3ReviewRunRecord(id)?.state).toBe('requires-human-review')
    const changed=await submitCommand(id,{
      requestId:'human-note-after-seal',expectedRevision:5,actor,
      type:'AfterRunHumanBusinessUpdate',payload:{title:'Updated'},
    },()=>({summary:'Later edit, historical Run still immutable',mutate:aggregate=>{
      aggregate.caseV2.title='Updated'
    }}))
    expect(changed.ok).toBe(true)
    expect(getV3ReviewRunRecord(id)?.run.runId).toBe(identity.runId)
    expect(readAggregate(id)?.caseV2.revision).toBe(6)
    expect(readAggregate(id)?.decisions).toEqual([])
  })

  test('read side rejects forged persisted technical Check status or missing Run seal Receipt',async()=>{
    const id='c2-seal-read-side-tamper-11'
    const identity=await seed(id)
    await record(id,identity,1,'read')
    await record(id,identity,2,'check')
    const terminal=await record(id,identity,3,'terminal')
    expect((await seal(id,terminal.eventId,4)).ok).toBe(true)
    const genuine=getV3ReviewRunRecord(id)!
    expect(genuine.boundChecks[0]?.technicalStatus).toBe('accepted')
    const changed=readAggregate(id)!
    changed.v3ReviewRun!.boundChecks[0]!.technicalStatus='rejected'
    writeAggregate(changed)
    expect(getV3ReviewRunRecord(id)).toBeUndefined()
    changed.v3ReviewRun!.boundChecks[0]!.technicalStatus='accepted'
    changed.receiptLog=changed.receiptLog.filter(r=>r.type!=='SealV3ReviewRun')
    writeAggregate(changed)
    expect(getV3ReviewRunRecord(id)).toBeUndefined()
    expect(readAggregate(id)?.decisions).toEqual([])
  })

  test('read side rejects a counterfeit historical Plan and cannot forge published authority',async()=>{
    const id='c2-seal-historic-plan-12'
    const identity=await seed(id)
    const terminal=await record(id,identity,1,'terminal')
    expect((await seal(id,terminal.eventId,2)).ok).toBe(true)
    expect(getV3ReviewRunRecord(id)?.plan.planId).toBe(plan.planId)
    const changed=readAggregate(id)!
    changed.v3ReviewRun!.plan.bindings[0]!.applicability='not-applicable'
    writeAggregate(changed)
    expect(getV3ReviewRunRecord(id)).toBeUndefined()
    expect(readAggregate(id)?.decisions).toHaveLength(0)
  })

})
