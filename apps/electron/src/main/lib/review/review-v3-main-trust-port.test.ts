import { afterAll, describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  REVIEW_C0_SCHEMA_VERSION, REVIEW_V3_EXECUTION_SCHEMA,
  type Actor, type CanonicalPlan, type ReviewCaseV2, type RunEvidenceIdentity,
  type SourceIdentity, type V3ExecutionProposal,
} from '@profer/shared'
import { createAggregate, readAggregate, writeAggregate } from './case-store-v2'
import { executionProposalId, type V3VerifiedHostReceipt } from './review-v3-execution-contract'
import {
  assertC2PhysicalOriginalBytes, createC2MainTrustedRunPort,
  type C2MainHostWitness, type C2MainOwnerWitness,
} from './review-v3-main-trust-port'

const root = join(import.meta.dir, '../../../../../../work/tmp', `v3-c2-main-trust-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const actor: Actor = { actorId: 'main-local-reviewer', actorSource: 'local', role: 'reviewer' }
const planFingerprint = 'b'.repeat(64)
const manifestHash = 'c'.repeat(64)
const original = Buffer.from('This is a registered physical original for C2 trust tests.')
const byteHash = createHash('sha256').update(original).digest('hex')

function run(caseId: string): RunEvidenceIdentity {
  return {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId, runId: `run-${caseId}`,
    caseRevision: 1, planFingerprint, templateVersion: '2',
    inputManifestHash: manifestHash, sourceVersionIds: ['version-1'],
    checkKeys: ['rule-1'], attemptId: 'host-attempt-main', ownerGeneration: 6,
  }
}
function source(caseId: string): SourceIdentity {
  return {
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,
    caseId,materialId:'document-1',documentVersionId:'version-1',
    rawSha256:byteHash,parseRevision:'parse-1',blockId:'block-1',
    location:{kind:'paragraph',locator:'p1'},
  }
}
function plan(): CanonicalPlan {
  return {
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,planId:'test-published-plan',
    fingerprint:planFingerprint,templateId:'template-1',templateVersion:'2',
    moduleDigests:['a'.repeat(64)],
    bindings:[{
      checkKey:'rule-1',targetKey:'subject:s1',objectKey:'proof-1',
      subjectId:'s1',applicability:'applicable',
      sourceVersionIds:['version-1'],conditionFingerprint:manifestHash,
    }],
  }
}
function event(id: string, runIdentity: RunEvidenceIdentity, sequence: number,
  kind: 'read'|'check'|'terminal'): V3ExecutionProposal {
  const base={
    schemaVersion:REVIEW_V3_EXECUTION_SCHEMA,run:runIdentity,sequence,
    permissionGrantId:'host-grant-6',hostReceiptId:`physical-host-${id}-${sequence}`,
  }
  if (kind==='read') {
    const body={...base,kind:'read' as const,read:{source:source(id),extent:'block' as const}}
    return {...body,eventId:executionProposalId(body)}
  }
  if (kind==='check') {
    const body={...base,kind:'check' as const,check:{
      checkKey:'rule-1',targetKey:'subject:s1',objectKey:'proof-1',
      subjectId:'s1',status:'accepted' as const,
    }}
    return {...body,eventId:executionProposalId(body)}
  }
  const body={...base,kind:'terminal' as const,
    terminal:{status:'completed-technical' as const}}
  return {...body,eventId:executionProposalId(body)}
}
function verified(event: V3ExecutionProposal): V3VerifiedHostReceipt {
  if(event.kind==='read')return {
    permissionGrantId:'host-grant-6',kind:'read',
    source:event.read.source,extent:event.read.extent,
  }
  if(event.kind==='check')return{
    permissionGrantId:'host-grant-6',kind:'check',check:event.check,
  }
  return{
    permissionGrantId:'host-grant-6',kind:'terminal',
    terminalStatus:event.terminal.status,
  }
}
async function fixture(id: string) {
  const casePath = join(root,'review-cases',id)
  const file = join(casePath,'source-docs','version-1','original.txt')
  mkdirSync(join(casePath,'source-docs','version-1'),{recursive:true})
  writeFileSync(file,original)
  const now='2026-10-20T00:00:00Z'
  const state:ReviewCaseV2={
    id,title:'C2 trusted Main original',templateId:'template-1',
    templateVersion:2,objectType:'document',caseFields:{},
    subjects:[{id:'s1',type:'item',title:'Applicant proof',fields:{},
      sourceRefs:[],correction:'user-confirmed',status:'identified'}],
    documents:[{
      documentId:'document-1',versionId:'version-1',
      contentHash:byteHash,byteHash,role:'application',fileName:'original.txt',
      mimeType:'text/plain',sizeBytes:original.length,
      assetPath:'source-docs/version-1/original.txt',parseRevision:1,
      parseStatus:'parsed',blocks:[{blockId:'block-1',text:'This is a registered',
        kind:'text',location:{kind:'paragraph',index:0}}],
      usage:'registered',active:true,
    }],
    stage:'reviewing',revision:0,createdAt:now,updatedAt:now,
  }
  await createAggregate(id,state)
  const agg=readAggregate(id)!
  agg.canonicalPlan=plan()
  // Contract-only synthetic Main/B publisher fixture. It does NOT certify
  // real school policy or actual Pi Provider receipt capability.
  writeAggregate(agg)
  const identity=run(id)
  let active=true
  let published=true
  let grant='host-grant-6'
  const stored=new Map<string,C2MainHostWitness>()
  const port=createC2MainTrustedRunPort({
    assertPublishedPlan:(_,current)=>{
      if(!published||current.planFingerprint!==planFingerprint)
        throw new Error('C2_TEST_CANDIDATE_HELD_OR_STALE')
    },
    getCurrentOwner:(current)=>{
      if (!active) return undefined
      const owner:C2MainOwnerWitness={
        run:identity,permissionGrantId:grant,active:true,
        ownerGeneration:6,inputManifestHash:manifestHash,
      }
      return owner
    },
    getPhysicalHostReceipt:(id)=>stored.get(id),
  })
  return {
    id,port,identity,file,
    addHost:(ev:V3ExecutionProposal,runId=identity)=>
      stored.set(ev.hostReceiptId,{
        run:runId,permissionGrantId:'host-grant-6',
        hostReceiptId:ev.hostReceiptId,verified:verified(ev),
      }),
    revoke:()=>{active=false},
    rejectPlan:()=>{published=false},
    wrongGrant:()=>{grant='new-grant-after-revoke'},
    removeHost:(id:string)=>stored.delete(id),
    command:(requestId:string,expectedRevision:number,payload:RunEvidenceIdentity)=>({
      requestId,expectedRevision,actor,payload,
    }),
  }
}
async function admit(f:Awaited<ReturnType<typeof fixture>>) {
  return f.port.admit(f.id,{
    requestId:`admit-${f.id}`,expectedRevision:0,actor,payload:f.identity,
  })
}
async function record(f:Awaited<ReturnType<typeof fixture>>,ev:V3ExecutionProposal) {
  return f.port.record(f.id,{
    requestId:ev.eventId,expectedRevision:ev.sequence,actor,payload:ev,
  })
}
async function seal(f:Awaited<ReturnType<typeof fixture>>,terminal:V3ExecutionProposal,
  expectedRevision:number) {
  return f.port.seal(f.id,{
    requestId:`seal-${f.id}`,expectedRevision,actor,
    payload:{runId:f.identity.runId,terminalEventId:terminal.eventId},
  })
}

describe('C2 Main physical Host and current Source trust ports',()=>{
  test('rejects missing Main-owned source ports, never installs renderer fallback',()=>{
    expect(()=>createC2MainTrustedRunPort({} as never)).toThrow('REQUIRED')
  })

  test('real on-disk bytes + live Owner + registered Host Read/Check/terminal seal to human-review only',async()=>{
    const f=await fixture('main-physical-complete-1')
    expect((await admit(f)).ok).toBe(true)
    for(const kind of ['read','check','terminal'] as const){
      const index=kind==='read'?1:kind==='check'?2:3
      const ev=event(f.id,f.identity,index,kind)
      f.addHost(ev)
      expect((await record(f,ev)).ok).toBe(true)
    }
    const terminal=event(f.id,f.identity,3,'terminal')
    const outcome=await seal(f,terminal,4)
    expect(outcome.ok).toBe(true)
    if(!outcome.ok)return
    expect(outcome.entity?.state).toBe('requires-human-review')
    expect(outcome.entity?.coverage).toMatchObject({
      totalBindings:1,observedBindings:1,unobservedBindings:0,
    })
    expect(readAggregate(f.id)?.decisions).toEqual([])
    expect(readAggregate(f.id)?.caseV2.stage).toBe('reviewing')
  })

  test('missing actual saved source, byte tamper and path traversal block admission',async()=>{
    const f=await fixture('main-physical-block-2')
    writeFileSync(f.file,'modified physical bytes')
    expect((await admit(f)).ok).toBe(false)
    expect(readAggregate(f.id)?.v3TechnicalExecution).toBeUndefined()
    writeFileSync(f.file,original)
    const changed=readAggregate(f.id)!
    changed.caseV2.documents[0]!.assetPath='../outside-file'
    writeAggregate(changed)
    expect((await admit(f)).ok).toBe(false)
    expect(readAggregate(f.id)?.v3TechnicalExecution).toBeUndefined()
  })

  test('physical source symlink escape is rejected before any host event',async()=>{
    const f=await fixture('main-symlink-source-3')
    const rootExternal=join(root,'outside.txt')
    writeFileSync(rootExternal,original)
    rmSync(f.file)
    symlinkSync(rootExternal,f.file)
    expect((await admit(f)).ok).toBe(false)
    expect(readAggregate(f.id)?.receiptLog).toHaveLength(0)
  })

  test('candidate-held Plan, revoked owner and rotated grant cannot gain durable ACK',async()=>{
    const f=await fixture('main-no-unauthorized-4')
    f.rejectPlan()
    expect((await admit(f)).ok).toBe(false)
    const g=await fixture('main-revoked-grant-5')
    expect((await admit(g)).ok).toBe(true)
    const ev=event(g.id,g.identity,1,'read')
    g.addHost(ev)
    g.revoke()
    expect((await record(g,ev)).ok).toBe(false)
    const h=await fixture('main-grant-rotation-6')
    expect((await admit(h)).ok).toBe(true)
    const later=event(h.id,h.identity,1,'read')
    h.addHost(later)
    h.wrongGrant()
    expect((await record(h,later)).ok).toBe(false)
  })

  test('cross-Run Host receipt substitution and missing physical Host deny receipt mutation',async()=>{
    const f=await fixture('main-cross-run-7')
    expect((await admit(f)).ok).toBe(true)
    const ev=event(f.id,f.identity,1,'read')
    expect((await record(f,ev)).ok).toBe(false)
    f.addHost(ev,{...f.identity,attemptId:'another-attempt'})
    expect((await record(f,ev)).ok).toBe(false)
    expect(readAggregate(f.id)?.v3TechnicalExecution?.events).toEqual([])
    f.addHost(ev)
    expect((await record(f,ev)).ok).toBe(true)
  })

  test('cold Host registry loss, revoked Owner or changed original forbids sealing even after terminal',async()=>{
    for(const [id,mode] of [
      ['main-seal-host-gone-8','host'],
      ['main-seal-revoked-9','owner'],
      ['main-seal-original-changed-10','bytes'],
    ] as const){
      const f=await fixture(id)
      expect((await admit(f)).ok).toBe(true)
      const terminal=event(f.id,f.identity,1,'terminal')
      f.addHost(terminal)
      expect((await record(f,terminal)).ok).toBe(true)
      if(mode==='host')f.removeHost(terminal.hostReceiptId)
      if(mode==='owner')f.revoke()
      if(mode==='bytes')writeFileSync(f.file,'modified after terminal')
      const denied=await seal(f,terminal,2)
      expect(denied.ok).toBe(false)
      expect(readAggregate(f.id)?.v3ReviewRun).toBeUndefined()
      expect(readAggregate(f.id)?.decisions).toEqual([])
    }
  })
})
