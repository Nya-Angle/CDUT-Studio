import {afterAll,describe,expect,test} from 'bun:test'
import {createHash} from 'node:crypto'
import {mkdtempSync,mkdirSync,rmSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {
  REVIEW_C0_SCHEMA_VERSION,REVIEW_V3_EXECUTION_SCHEMA,
  type ReviewCaseV2,type CanonicalPlan,type RunEvidenceIdentity,
  type SourceIdentity,type V3ExecutionProposal,
} from '@profer/shared'
import {createAggregate,readAggregate,writeAggregate} from './case-store-v2'
import {executionProposalId} from './review-v3-execution-contract'
import type {A22TechnicalEvidenceEnvelope} from './review-v3-a-host-technical-handoff'
import type {C2MainHostWitness,C2MainOwnerWitness} from './review-v3-main-trust-port'
import {
  C11MainLocalTechnicalReview,createC11MainLocalReview,
} from './review-v3-main-local-technical-review'

const dir=mkdtempSync(join(tmpdir(),'c11-local-first-host-'))
const prev=process.env.PROFER_CONFIG_DIR
process.env.PROFER_CONFIG_DIR=dir
afterAll(()=>{
  if(prev===undefined)delete process.env.PROFER_CONFIG_DIR
  else process.env.PROFER_CONFIG_DIR=prev
  rmSync(dir,{recursive:true,force:true})
})
const sha=(value:Buffer|string)=>createHash('sha256').update(value).digest('hex')
const canon=(x:unknown):string=>{
  if(x===null||typeof x!=='object')return JSON.stringify(x)??'null'
  if(Array.isArray(x))return '['+x.map(canon).join(',')+']'
  const r=x as Record<string,unknown>
  return '{'+Object.keys(r).filter(k=>r[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+':'+canon(r[k])).join(',')+'}'
}
let serial=0
async function fixture(){
  const caseId='c11local'+ ++serial
  const original=Buffer.from('C11 local physical original '+caseId)
  const file=join(dir,'review-cases',caseId,'source-docs','v1','original.txt')
  mkdirSync(join(dir,'review-cases',caseId,'source-docs','v1'),{recursive:true})
  writeFileSync(file,original)
  const source:SourceIdentity={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,caseId,
    materialId:'doc',documentVersionId:'v1',rawSha256:sha(original),
    parseRevision:'p1',blockId:'block1',
    location:{kind:'paragraph',locator:'p1'},
  }
  const run:RunEvidenceIdentity={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,caseId,
    runId:'run-'+caseId,attemptId:'attempt-1',caseRevision:1,
    ownerGeneration:4,sourceVersionIds:['v1'],checkKeys:['check-1'],
    planFingerprint:'a'.repeat(64),templateVersion:'1',
    inputManifestHash:'b'.repeat(64),
  }
  const plan:CanonicalPlan={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,planId:'local-draft',
    templateId:'local-tpl',templateVersion:'1',
    fingerprint:run.planFingerprint,moduleDigests:['c'.repeat(64)],
    bindings:[{
      checkKey:'check-1',targetKey:'target',objectKey:'object',
      subjectId:'subject',sourceVersionIds:['v1'],
      applicability:'unknown',conditionFingerprint:'d'.repeat(64),
    }],
  }
  const now='2026-10-20T00:00:00Z'
  const state:ReviewCaseV2={
    id:caseId,title:'Local review',templateId:'local-tpl',templateVersion:1,
    objectType:'document',caseFields:{},subjects:[{
      id:'subject',type:'item',title:'subject',fields:{},
      sourceRefs:[],correction:'user-confirmed',status:'identified',
    }],
    stage:'reviewing',revision:0,createdAt:now,updatedAt:now,
    documents:[{
      documentId:'doc',versionId:'v1',contentHash:sha(original),
      byteHash:sha(original),role:'application',fileName:'original.txt',
      mimeType:'text/plain',sizeBytes:original.byteLength,
      assetPath:'source-docs/v1/original.txt',parseRevision:1,
      parseStatus:'parsed',blocks:[{
        blockId:'block1',text:'local physical source',kind:'text',
        location:{kind:'paragraph',index:0},
      }],usage:'registered',active:true,
    }],
  }
  await createAggregate(caseId,state)
  const aggregate=readAggregate(caseId)!
  aggregate.canonicalPlan=plan
  writeAggregate(aggregate)
  let active=true,grant='real-local-grant-4'
  const owner=():C2MainOwnerWitness=>({
    run,active,permissionGrantId:grant,ownerGeneration:4,
    inputManifestHash:run.inputManifestHash,
  })
  const readBody={
    schemaVersion:REVIEW_V3_EXECUTION_SCHEMA,run,
    sequence:1,permissionGrantId:grant,hostReceiptId:'actual-host-'+caseId,
    kind:'read' as const,read:{source,extent:'block' as const},
  }
  const event:V3ExecutionProposal={
    ...readBody,eventId:executionProposalId(readBody),
  }
  const proof=({
    version:'v3-dev-a-host-handoff/1' as const,
    trust:'A_TECHNICAL_ONLY_C_PHYSICAL_OBSERVER_REQUIRED' as const,
    run,
    owner:{
      sessionId:'main-session',senderKey:'main-frame',
      generation:4,processEpoch:'process-epoch',grantId:grant,
      sourceVersionIds:['v1'],planFingerprint:run.planFingerprint,
      inputManifestHash:run.inputManifestHash,
    },
    planBindings:[],
    technicalEvents:[event],
    turnBudget:{usedTurns:0,maxTurns:24,exhausted:false},
    sdkDispatches:[],
    unresolvedProviderEffect:false,
    canSealCReviewRun:false as const,
  })
  const seal=(payload:typeof proof)=>{
    const clone=structuredClone(payload)
    return {...clone,evidenceHash:sha(canon(clone))} as A22TechnicalEvidenceEnvelope
  }
  const observed=new Map<string,C2MainHostWitness>()
  const provider={
    getObservedPhysicalReceipt:(id:string)=>observed.get(id),
    getCurrentOwner:(_run:RunEvidenceIdentity)=>active?owner():undefined,
    readCurrentCase:(_run:RunEvidenceIdentity)=>readAggregate(caseId),
  }
  const getReview=()=>new C11MainLocalTechnicalReview(provider)
  return{
    run,caseId,file,event,original,proof,seal,getReview,provider,
    observe:()=>observed.set(event.hostReceiptId,{
      run,hostReceiptId:event.hostReceiptId,permissionGrantId:grant,
      verified:{kind:'read',permissionGrantId:grant,source,extent:'block'},
    }),
    revoke:()=>{active=false},
    rotate:()=>{grant='different-grant'},
    drop:()=>observed.clear(),
  }
}
describe('C R11 local Pi technical inspection independent of future School Gate L',()=>{
  test('real physical Host read + saved source -> candidate/manual, no school issuer or C formal Run',async()=>{
    const f=await fixture();f.observe()
    const r=f.getReview()
    const x=r.inspect(f.seal(f.proof))
    expect(x).toMatchObject({
      status:'local-manual-review',officialSchoolApproved:false,
      schoolPolicyPublished:false,businessWriteAllowed:false,
      formalReviewRunSealed:false,readCount:1,seenPhysicalEvents:1,
      hostSource:'independent-c-main-physical-observer',
    })
    expect(readAggregate(f.caseId)?.v3ReviewRun).toBeUndefined()
    r.close()
    expect(()=>r.inspect(f.seal(f.proof))).toThrow('PORT_CLOSED')
  })
  test('A own self-sealed technical proposal without an independent physical Host is always refused',async()=>{
    const f=await fixture()
    const r=f.getReview()
    expect(()=>r.inspect(f.seal(f.proof))).toThrow('No independently observed')
    f.observe()
    expect(r.inspect(f.seal(f.proof)).readCount).toBe(1)
    f.drop()
    expect(()=>r.inspect(f.seal(f.proof))).toThrow('No independently observed')
    r.close()
  })
  test('Owner revoke and physical source bytes mutation independently deny before anything is considered',async()=>{
    const f=await fixture();f.observe();f.revoke()
    expect(()=>f.getReview().inspect(f.seal(f.proof)))
      .toThrow('MAIN_OWNER_GRANT_NOT_CURRENT')
    const g=await fixture();g.observe()
    writeFileSync(g.file,'tampered after actual Main source')
    expect(()=>g.getReview().inspect(g.seal(g.proof))).toThrow('物理原件')
  })
  test('current owner grant rotation, A tamper and mismatched physical read reject',async()=>{
    const f=await fixture();f.observe();f.rotate()
    expect(()=>f.getReview().inspect(f.seal(f.proof)))
      .toThrow('A_OWNER_DOES_NOT_MATCH_INDEPENDENT_C_OWNER')
    const g=await fixture();g.observe()
    const edited={...g.proof,owner:{...g.proof.owner,grantId:'forged'}}
    expect(()=>g.getReview().inspect(g.seal(edited)))
      .toThrow('A_OWNER_DOES_NOT_MATCH_INDEPENDENT_C_OWNER')
    const bad={...g.proof,technicalEvents:[{
      ...g.event,read:{...g.event.read,extent:'full-document' as const},
    }]}
    expect(()=>g.getReview().inspect(g.seal(bad)))
      .toThrow('A_EVENT_DIGEST_INVALID')
  })
  test('empty A evidence never produces manual-review without any physical observation',async()=>{
    const f=await fixture()
    const empty={...f.proof,technicalEvents:[]}
    expect(()=>f.getReview().inspect(f.seal(empty)))
      .toThrow('TECHNICAL_EVENT_SET_INVALID_OR_NO_PHYSICAL_PROOF')
  })
  test('unknown Provider effect remains local recovery-required even with real physical witness',async()=>{
    const f=await fixture();f.observe()
    const payload={...f.proof,unresolvedProviderEffect:true}
    expect(f.getReview().inspect(f.seal(payload)))
      .toMatchObject({status:'local-recovery-required',
        unresolvedProviderEffect:true,officialSchoolApproved:false,
        formalReviewRunSealed:false})
  })
  test('fresh locally opened process does not trust cold Host snapshots from A event DTO alone',async()=>{
    const f=await fixture();f.observe()
    const first=createC11MainLocalReview(f.provider)
    expect(first.inspect(f.seal(f.proof)).readCount).toBe(1)
    first.close()
    f.drop()
    const cold=createC11MainLocalReview(f.provider)
    expect(()=>cold.inspect(f.seal(f.proof))).toThrow('No independently observed')
  })
})
